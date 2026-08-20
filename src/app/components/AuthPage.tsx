import React, { useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Lock, Mail, Phone, User, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, Download, Smartphone } from 'lucide-react';
import logo from '../../../asset/logo.png';
import { apiFetch } from '../api/client';

type AuthPageProps = { onBackHome: () => void; onAuthSuccess: () => void; };

export default function AuthPage({ onBackHome, onAuthSuccess }: AuthPageProps) {
  const [mode, setMode]         = useState<'login'|'signup'>('login');
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState<string|null>(null);
  const [showPw, setShowPw]     = useState(false);
  const [showFpPw, setShowFpPw] = useState(false);
  const [otpSeconds, setOtpSeconds] = useState(0);
  const [fp, setFp] = useState({ open:false, phone:'', code:'', newPassword:'', step:'phone' as 'phone'|'verify'|'reset' });
  const [fpMsg, setFpMsg] = useState<{text:string;ok:boolean}|null>(null);

  // Form field state for smooth FieldBox behavior
  const [loginData, setLoginData] = useState({ identifier: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', phone: '', email: '', age: '', gender: '', password: '' });
  const [noEmails, setNoEmails] = useState(false);

  useEffect(() => {
    if (otpSeconds <= 0) return;
    const t = window.setInterval(() => setOtpSeconds(s => Math.max(0, s-1)), 1000);
    return () => window.clearInterval(t);
  }, [otpSeconds]);

  const resetFp = () => { setFp({ open:false, phone:'', code:'', newPassword:'', step:'phone' }); setFpMsg(null); setOtpSeconds(0); };

  const switchMode = (newMode: 'login'|'signup') => { setMode(newMode); setError(null); resetFp(); };

  return (
    <section className="min-h-screen bg-[#f4faf7] text-[#0a2617] antialiased flex flex-col justify-between font-sans overflow-x-hidden">
      
      {/* ── STICKY TOP NAV BAR ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#0d5d3a]/15 h-16 flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBackHome}>
          <img src={logo} alt="ZenMind" className="w-8 h-8 object-contain" />
          <span className="font-bold text-xl tracking-tight text-[#0d5d3a]" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
            ZenMind
          </span>
          <span className="hidden sm:inline-block text-xs font-extrabold text-[#78350f] bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 rounded-full">
            User Sanctuary
          </span>
        </div>

        <button
          type="button"
          onClick={onBackHome}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#0d5d3a]/20 text-[#0d5d3a] hover:bg-[#e6f4ea] font-bold text-xs uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* ── MAIN SPLIT-SCREEN AUTH CONTAINER (SOLACE UI STYLE IN GREEN, WHITE & GOLD) ── */}
      <main className="flex-1 p-3 sm:p-6 flex items-center justify-center my-2">
        <div className="grid w-full max-w-7xl gap-6 lg:grid-cols-[0.98fr_1.02fr] items-stretch">
          
          {/* ── LEFT COLUMN: AUTH FORM CARD ── */}
          <div className="flex min-h-[680px] items-center rounded-3xl border-2 border-[#0d5d3a]/15 bg-white px-6 py-8 sm:px-10 lg:px-12 lg:py-12 shadow-xl relative overflow-hidden">
            <div className="mx-auto w-full max-w-[540px]">
              
              {/* Header Title */}
              <div>
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#d97706] uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-[#d97706]" />
                  <span>ZenMind Portal</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0d5d3a]" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
                  {fp.open ? 'Reset Password' : mode === 'login' ? 'Welcome Back' : 'Create an Account'}
                </h1>
                <p className="mt-2 text-sm text-[#0a2617]/70 font-semibold">
                  {fp.open ? 'Recover access to your personal mental health workspace' : mode === 'login' ? 'Brainstorm in chat, track mood, build inner peace' : 'Join thousands starting their mindfulness journey today'}
                </p>
              </div>

              {!fp.open && (
                <>
                  {/* Social Buttons */}
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <SocialButton icon={<GoogleIcon />} label="Sign in with Google" />
                    <SocialButton icon={<AppleIcon />} label="Sign in with Apple" />
                  </div>

                  <div className="my-6 text-center text-sm font-bold text-[#0d5d3a]/60 uppercase tracking-widest flex items-center gap-4">
                    <div className="h-px bg-[#0d5d3a]/15 flex-1" />
                    <span>or</span>
                    <div className="h-px bg-[#0d5d3a]/15 flex-1" />
                  </div>

                  {/* Mode Selector Pill Toggle */}
                  <div className="bg-[#e6f4ea] p-1 rounded-full flex gap-1 mb-6 border border-[#0d5d3a]/15">
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className={`flex-1 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all text-center ${
                        mode === 'login'
                          ? 'bg-[#0d5d3a] text-white shadow-xs'
                          : 'text-[#0d5d3a] hover:bg-[#d2ebd9]'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className={`flex-1 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all text-center ${
                        mode === 'signup'
                          ? 'bg-[#0d5d3a] text-white shadow-xs'
                          : 'text-[#0d5d3a] hover:bg-[#d2ebd9]'
                      }`}
                    >
                      Create Account
                    </button>
                  </div>
                </>
              )}

              {/* ── FORGOT PASSWORD FLOW ── */}
              {fp.open ? (
                <div className="space-y-4 mt-6">
                  {fp.step === 'phone' && (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-gray-600">Enter your registered mobile number for OTP verification</p>
                      <FieldBox label="Mobile Number" value={fp.phone} onChange={v => setFp(p => ({...p, phone: v}))} type="tel" icon={<Phone className="w-4 h-4 text-[#0d5d3a]" />} />
                      <button
                        type="button"
                        disabled={!fp.phone.trim() || busy}
                        onClick={async () => {
                          setBusy(true); setFpMsg(null);
                          try {
                            await apiFetch('/auth/forgot-password', { method:'POST', body:JSON.stringify({ phone:fp.phone }), timeoutMs:30000 });
                            setOtpSeconds(120); setFp(p => ({...p, step:'verify'})); setFpMsg({ text:'OTP sent successfully', ok:true });
                          } catch(e:any) { setFpMsg({ text:e.message||'Failed to send OTP', ok:false }); }
                          finally { setBusy(false); }
                        }}
                        className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#0d5d3a] hover:bg-[#084229] text-sm font-bold uppercase tracking-wider text-white transition-all shadow-md disabled:opacity-50"
                      >
                        {busy ? 'Sending OTP…' : 'Send OTP Code'}
                      </button>
                    </div>
                  )}

                  {fp.step === 'verify' && (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-gray-600 text-center">Enter 6-digit OTP code {otpSeconds > 0 ? `(${otpSeconds}s)` : ''}</p>
                      <div className="flex gap-2 justify-center">
                        {[0,1,2,3,4,5].map(i => (
                          <input key={i} id={`otp-d-${i}`} maxLength={1} type="text" inputMode="numeric"
                            value={fp.code[i] || ''}
                            onChange={e => {
                              const v = e.target.value.replace(/\D/,'');
                              const a = fp.code.split(''); a[i] = v;
                              const c = a.join('').slice(0,6);
                              setFp(p => ({...p, code: c}));
                              if (v && i < 5) (document.getElementById(`otp-d-${i+1}`) as HTMLInputElement)?.focus();
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Backspace' && !fp.code[i] && i > 0) (document.getElementById(`otp-d-${i-1}`) as HTMLInputElement)?.focus();
                            }}
                            className="w-10 h-12 text-center font-bold text-lg border-2 border-[#0d5d3a]/20 rounded-xl focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 outline-none bg-white text-[#0d5d3a]"
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        disabled={fp.code.length !== 6 || busy}
                        onClick={async () => {
                          setBusy(true); setFpMsg(null);
                          try {
                            await apiFetch('/auth/verify-otp', { method:'POST', body:JSON.stringify({ phone:fp.phone, code:fp.code }), timeoutMs:30000 });
                            setFp(p => ({...p, step:'reset'})); setFpMsg({ text:'OTP Verified', ok:true });
                          } catch(e:any) { setFpMsg({ text:e.message||'Invalid OTP code', ok:false }); }
                          finally { setBusy(false); }
                        }}
                        className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#0d5d3a] hover:bg-[#084229] text-sm font-bold uppercase tracking-wider text-white transition-all shadow-md disabled:opacity-50"
                      >
                        {busy ? 'Verifying…' : 'Verify Code'}
                      </button>
                    </div>
                  )}

                  {fp.step === 'reset' && (
                    <div className="space-y-4">
                      <FieldBox label="New Password" value={fp.newPassword} onChange={v => setFp(p => ({...p, newPassword: v}))} type={showFpPw ? 'text' : 'password'} icon={<Lock className="w-4 h-4 text-[#0d5d3a]" />} />
                      <button type="button" onClick={() => setShowFpPw(s => !s)} className="text-xs font-bold text-[#0d5d3a]">
                        {showFpPw ? 'Hide' : 'Show'} Password
                      </button>
                      <button
                        type="button"
                        disabled={fp.newPassword.length < 6 || busy}
                        onClick={async () => {
                          setBusy(true); setFpMsg(null);
                          try {
                            await apiFetch('/auth/reset-password', { method:'POST', body:JSON.stringify({ phone:fp.phone, code:fp.code, newPassword:fp.newPassword }), timeoutMs:30000 });
                            resetFp();
                          } catch(e:any) { setFpMsg({ text:e.message||'Failed to reset password', ok:false }); }
                          finally { setBusy(false); }
                        }}
                        className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#0d5d3a] hover:bg-[#084229] text-sm font-bold uppercase tracking-wider text-white transition-all shadow-md disabled:opacity-50"
                      >
                        {busy ? 'Updating…' : 'Update Password'}
                      </button>
                    </div>
                  )}

                  {fpMsg && (
                    <div className={`p-3 rounded-2xl text-xs font-bold text-center border ${fpMsg.ok ? 'bg-green-50 text-[#0d5d3a] border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                      {fpMsg.text}
                    </div>
                  )}

                  <button type="button" onClick={resetFp} className="w-full text-center text-xs font-bold text-[#0d5d3a] hover:underline mt-2">
                    ← Back to Login
                  </button>
                </div>
              ) : mode === 'login' ? (
                /* ── LOGIN FORM ── */
                <form
                  className="space-y-4"
                  onSubmit={async e => {
                    e.preventDefault();
                    setBusy(true); setError(null);
                    try {
                      await apiFetch('/auth/login', {
                        method:'POST',
                        body:JSON.stringify({ identifier: loginData.identifier.trim(), password: loginData.password }),
                        noReloadOnSuspend:true,
                        timeoutMs:30000
                      });
                      onAuthSuccess();
                    } catch(e:any) { setError(e.message||'Login failed'); }
                    finally { setBusy(false); }
                  }}
                >
                  <FieldBox
                    label="Email or Mobile"
                    value={loginData.identifier}
                    onChange={v => setLoginData(p => ({ ...p, identifier: v }))}
                    type="text"
                    icon={<Mail className="w-4 h-4 text-[#0d5d3a]" />}
                  />

                  <div className="space-y-1">
                    <FieldBox
                      label="Password"
                      value={loginData.password}
                      onChange={v => setLoginData(p => ({ ...p, password: v }))}
                      type={showPw ? 'text' : 'password'}
                      icon={<Lock className="w-4 h-4 text-[#0d5d3a]" />}
                    />
                    <div className="flex items-center justify-between text-xs pt-1 px-1">
                      <button type="button" onClick={() => setShowPw(s => !s)} className="font-bold text-gray-500 hover:text-[#0d5d3a]">
                        {showPw ? 'Hide' : 'Show'} password
                      </button>
                      <button type="button" onClick={() => { setError(null); setFp(p => ({...p, open:true})); }} className="font-bold text-[#d97706] hover:underline">
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2 text-xs leading-5 text-gray-500">
                    <CheckboxLine checked={noEmails} onChange={setNoEmails}>
                      I don't want to receive feature updates and wellness emails
                    </CheckboxLine>
                    <CheckboxLine checked={true} onChange={() => {}}>
                      By signing in, you agree to our <a href="#" className="font-bold text-[#0d5d3a] underline">Terms & Services</a> and <a href="#" className="font-bold text-[#0d5d3a] underline">Privacy Policy</a>
                    </CheckboxLine>
                  </div>

                  {error && (
                    <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy || !loginData.identifier || !loginData.password}
                    className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#0d5d3a] hover:bg-[#084229] text-sm font-bold uppercase tracking-wider text-white transition-all shadow-md disabled:opacity-50"
                  >
                    {busy ? 'Signing In…' : 'Submit & Access Workspace'}
                  </button>
                </form>
              ) : (
                /* ── SIGNUP FORM ── */
                <form
                  className="space-y-3"
                  onSubmit={async e => {
                    e.preventDefault();
                    setBusy(true); setError(null);
                    try {
                      await apiFetch('/auth/register', {
                        method:'POST',
                        body:JSON.stringify({
                          name: signupData.name,
                          phone: signupData.phone,
                          email: signupData.email,
                          age: Number(signupData.age || 0),
                          gender: signupData.gender,
                          password: signupData.password
                        }),
                        noReloadOnSuspend:true,
                        timeoutMs:30000
                      });
                      onAuthSuccess();
                    } catch(e:any) { setError(e.message||'Signup failed'); }
                    finally { setBusy(false); }
                  }}
                >
                  <FieldBox
                    label="Full Name"
                    value={signupData.name}
                    onChange={v => setSignupData(p => ({ ...p, name: v }))}
                    type="text"
                    icon={<User className="w-4 h-4 text-[#0d5d3a]" />}
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FieldBox
                      label="Mobile (+91)"
                      value={signupData.phone}
                      onChange={v => setSignupData(p => ({ ...p, phone: v }))}
                      type="tel"
                      icon={<Phone className="w-4 h-4 text-[#0d5d3a]" />}
                    />
                    <FieldBox
                      label="Email"
                      value={signupData.email}
                      onChange={v => setSignupData(p => ({ ...p, email: v }))}
                      type="email"
                      icon={<Mail className="w-4 h-4 text-[#0d5d3a]" />}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FieldBox
                      label="Age"
                      value={signupData.age}
                      onChange={v => setSignupData(p => ({ ...p, age: v }))}
                      type="number"
                    />
                    <div className="flex h-12 items-center justify-between gap-2 rounded-2xl border-2 border-[#0d5d3a]/15 bg-white px-4 text-xs font-semibold">
                      <select
                        value={signupData.gender}
                        onChange={e => setSignupData(p => ({ ...p, gender: e.target.value }))}
                        className="w-full bg-transparent text-[#0a2617] outline-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <FieldBox
                    label="Password"
                    value={signupData.password}
                    onChange={v => setSignupData(p => ({ ...p, password: v }))}
                    type={showPw ? 'text' : 'password'}
                    icon={<Lock className="w-4 h-4 text-[#0d5d3a]" />}
                  />

                  <div className="space-y-2 text-xs text-gray-500 pt-1">
                    <CheckboxLine checked={noEmails} onChange={setNoEmails}>
                      I don't want to receive feature updates and marketing emails
                    </CheckboxLine>
                    <CheckboxLine checked={true} onChange={() => {}}>
                      I agree to the <a href="#" className="font-bold text-[#0d5d3a] underline">Terms & Services</a> and <a href="#" className="font-bold text-[#0d5d3a] underline">Privacy Policy</a>
                    </CheckboxLine>
                  </div>

                  {error && (
                    <div className="p-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={busy || !signupData.name || !signupData.email || !signupData.password}
                    className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-[#d97706] hover:bg-[#b45309] text-sm font-bold uppercase tracking-wider text-white transition-all shadow-md disabled:opacity-50"
                  >
                    {busy ? 'Creating Account…' : 'Submit & Join ZenMind'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: SOLACE SHOWCASE BANNER (GREEN, GOLD & WHITE GRAIN GRADIENT) ── */}
          <div className="relative flex min-h-[500px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#0d5d3a] via-[#084229] to-[#042416] p-8 sm:p-12 text-white border-2 border-[#0d5d3a]/20 shadow-2xl lg:min-h-0 flex-col justify-between">
            
            {/* Ambient Gold Glow Ornaments */}
            <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#d97706]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#e6f4ea]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Floating Decorative Gold Stars */}
            <div className="absolute top-8 right-12 z-10 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-[#fef3c7]/20 backdrop-blur-md flex items-center justify-center border border-[#fde68a]/30">
                <Sparkles className="w-4 h-4 text-[#fde68a]" />
              </div>
            </div>

            {/* Banner Top Content */}
            <div className="relative z-10 flex h-full w-full flex-col justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#fef3c7]/15 border border-[#fde68a]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#fde68a] mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Clinical Encryption & AI Companion</span>
                </div>

                <h2 className="max-w-[580px] text-4xl sm:text-5xl lg:text-[56px] lg:leading-[1.05] font-extrabold tracking-tight text-white" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
                  Think fast, <br />
                  <span className="text-[#fde68a]">Live mindfully.</span>
                </h2>

                <p className="mt-4 text-base sm:text-lg text-white/80 font-medium max-w-md leading-relaxed">
                  Your private space for AI therapy, daily mood tracking, clinical appointment booking, and wellness resources.
                </p>
              </div>

              {/* Bottom App Download CTA Pill */}
              <div className="pt-8">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert("ZenMind Web & Mobile App is active on your device!"); }}
                  className="inline-flex h-14 max-w-full items-center gap-3.5 rounded-2xl border border-white/30 bg-white/10 px-6 text-sm sm:text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50 shadow-lg"
                >
                  <Smartphone className="w-5 h-5 text-[#fde68a] shrink-0" />
                  <span className="truncate whitespace-nowrap">
                    Experience ZenMind Digital Sanctuary
                  </span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-semibold text-[#0d5d3a]/60">
        © {new Date().getFullYear()} ZenMind Health. All rights reserved.
      </footer>
    </section>
  );
}

{/* ── HELPER COMPONENTS (SOLACE UI PATTERN) ── */}

function SocialButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="flex h-11 items-center justify-center gap-2.5 rounded-2xl border-2 border-[#0d5d3a]/15 bg-white px-4 text-xs font-bold text-[#0a2617] transition-all hover:bg-[#e6f4ea] hover:border-[#0d5d3a]/30 shadow-xs"
    >
      <span className="shrink-0">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function FieldBox({
  label,
  value,
  onChange,
  type = "text",
  icon
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="relative flex h-12 items-center justify-between gap-3 rounded-2xl border-2 border-[#0d5d3a]/15 bg-white px-4 text-xs font-semibold focus-within:border-[#d97706] focus-within:ring-2 focus-within:ring-[#d97706]/20 transition-all">
      {icon && <span className="shrink-0">{icon}</span>}
      <input
        type={type}
        value={value}
        placeholder={label}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-[#0a2617] outline-none placeholder:text-[#0d5d3a]/50 font-semibold"
      />
    </div>
  );
}

function CheckboxLine({ children, checked, onChange }: { children: ReactNode; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 rounded border-[#0d5d3a]/30 text-[#0d5d3a] focus:ring-[#d97706] cursor-pointer"
      />
      <span>{children}</span>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-[#0a2617]"
      aria-hidden="true"
    >
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}
