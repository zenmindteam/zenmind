import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Lock, Mail, Phone, User, Eye, EyeOff, KeyRound, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import logo from '../../../asset/logo.png';

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

  useEffect(() => {
    if (otpSeconds <= 0) return;
    const t = window.setInterval(() => setOtpSeconds(s => Math.max(0, s-1)), 1000);
    return () => window.clearInterval(t);
  }, [otpSeconds]);

  const resetFp = () => { setFp({ open:false, phone:'', code:'', newPassword:'', step:'phone' }); setFpMsg(null); setOtpSeconds(0); };

  const switchMode = (newMode: 'login'|'signup') => { setMode(newMode); setError(null); resetFp(); };

  return (
    <div className="min-h-screen w-full bg-[#f4faf7] text-[#0a2617] font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* ── STICKY TOP NAV BAR (LANDING PAGE STYLE) ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#0d5d3a]/15 h-16 flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBackHome}>
          <img src={logo} alt="ZenMind" className="w-8 h-8 object-contain" />
          <span className="font-bold text-xl tracking-tight text-[#0d5d3a]" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
            ZenMind
          </span>
          <span className="hidden sm:inline-block text-xs font-extrabold text-[#78350f] bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 rounded-full">
            User Portal
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

      {/* ── MAIN AUTH SECTION (GOOGLE WORKSPACE CARD) ── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="bg-white rounded-[28px] border-2 border-[#0d5d3a]/15 shadow-2xl p-6 sm:p-10 max-w-md w-full mx-auto relative overflow-hidden">
          
          {/* Top Brand Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#e6f4ea] border-2 border-[#0d5d3a]/20 flex items-center justify-center mx-auto mb-4 ring-4 ring-[#d97706]/20">
              <img src={logo} alt="ZenMind" className="w-10 h-10 object-contain" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d5d3a]" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
              {fp.open ? 'Reset Password' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs font-semibold text-[#d97706] mt-1">
              {fp.open ? 'Secure account recovery' : mode === 'login' ? 'Sign in to access your wellness workspace' : 'Join thousands taking care of their mental health'}
            </p>
          </div>

          {!fp.open && (
            /* ── Google Material You Mode Toggle Pill Bar ── */
            <div className="bg-[#e6f4ea] p-1.5 rounded-full flex gap-1 mb-6 border border-[#0d5d3a]/15">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all text-center ${
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
                className={`flex-1 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all text-center ${
                  mode === 'signup'
                    ? 'bg-[#0d5d3a] text-white shadow-xs'
                    : 'text-[#0d5d3a] hover:bg-[#d2ebd9]'
                }`}
              >
                Create Account
              </button>
            </div>
          )}

          {/* ── FORGOT PASSWORD FLOW ── */}
          {fp.open ? (
            <div className="space-y-4">
              {fp.step === 'phone' && (
                <div className="space-y-4">
                  <p className="text-xs font-semibold text-gray-600 text-center">Enter your registered mobile number for OTP verification</p>
                  <div>
                    <label className="block text-xs font-bold text-[#0d5d3a] mb-1.5 uppercase tracking-wider">Mobile Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#0d5d3a] absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={fp.phone}
                        onChange={e => setFp(p => ({...p, phone: e.target.value}))}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-sm text-[#0a2617] outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!fp.phone.trim() || busy}
                    onClick={async () => {
                      setBusy(true); setFpMsg(null);
                      try {
                        const { apiFetch } = await import('../api/client');
                        await apiFetch('/auth/forgot-password', { method:'POST', body:JSON.stringify({ phone:fp.phone }), timeoutMs:30000 });
                        setOtpSeconds(120); setFp(p => ({...p, step:'verify'})); setFpMsg({ text:'OTP sent successfully', ok:true });
                      } catch(e:any) { setFpMsg({ text:e.message||'Failed to send OTP', ok:false }); }
                      finally { setBusy(false); }
                    }}
                    className="w-full py-3.5 rounded-full bg-[#0d5d3a] hover:bg-[#084229] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
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
                        const { apiFetch } = await import('../api/client');
                        await apiFetch('/auth/verify-otp', { method:'POST', body:JSON.stringify({ phone:fp.phone, code:fp.code }), timeoutMs:30000 });
                        setFp(p => ({...p, step:'reset'})); setFpMsg({ text:'OTP Verified', ok:true });
                      } catch(e:any) { setFpMsg({ text:e.message||'Invalid OTP code', ok:false }); }
                      finally { setBusy(false); }
                    }}
                    className="w-full py-3.5 rounded-full bg-[#0d5d3a] hover:bg-[#084229] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
                  >
                    {busy ? 'Verifying…' : 'Verify Code'}
                  </button>
                </div>
              )}

              {fp.step === 'reset' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0d5d3a] mb-1.5 uppercase tracking-wider">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#0d5d3a] absolute left-3.5 top-3.5" />
                      <input
                        type={showFpPw ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={fp.newPassword}
                        onChange={e => setFp(p => ({...p, newPassword: e.target.value}))}
                        className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-sm text-[#0a2617] outline-none"
                      />
                      <button type="button" onClick={() => setShowFpPw(s => !s)} className="absolute right-3.5 top-3.5 text-[#0d5d3a]">
                        {showFpPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={fp.newPassword.length < 6 || busy}
                    onClick={async () => {
                      setBusy(true); setFpMsg(null);
                      try {
                        const { apiFetch } = await import('../api/client');
                        await apiFetch('/auth/reset-password', { method:'POST', body:JSON.stringify({ phone:fp.phone, code:fp.code, newPassword:fp.newPassword }), timeoutMs:30000 });
                        resetFp();
                      } catch(e:any) { setFpMsg({ text:e.message||'Failed to reset password', ok:false }); }
                      finally { setBusy(false); }
                    }}
                    className="w-full py-3.5 rounded-full bg-[#0d5d3a] hover:bg-[#084229] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
                  >
                    {busy ? 'Resetting…' : 'Update Password'}
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
                const f = new FormData(e.currentTarget);
                setBusy(true); setError(null);
                try {
                  const { apiFetch } = await import('../api/client');
                  await apiFetch('/auth/login', {
                    method:'POST',
                    body:JSON.stringify({ identifier:String(f.get('identifier')||''), password:String(f.get('password')||'') }),
                    noReloadOnSuspend:true,
                    timeoutMs:30000
                  });
                  onAuthSuccess();
                } catch(e:any) { setError(e.message||'Login failed'); }
                finally { setBusy(false); }
              }}
            >
              <div>
                <label className="block text-xs font-bold text-[#0d5d3a] mb-1.5 uppercase tracking-wider">Email or Mobile Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#0d5d3a] absolute left-3.5 top-3.5" />
                  <input
                    name="identifier"
                    type="text"
                    placeholder="Enter email or phone"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-sm text-[#0a2617] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d5d3a] mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#0d5d3a] absolute left-3.5 top-3.5" />
                  <input
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-sm text-[#0a2617] outline-none"
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-3.5 text-[#0d5d3a]">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <button type="button" onClick={() => setShowPw(s => !s)} className="font-bold text-gray-500 hover:text-[#0d5d3a]">
                  {showPw ? 'Hide' : 'Show'} password
                </button>
                <button type="button" onClick={() => { setError(null); setFp(p => ({...p, open:true})); }} className="font-bold text-[#d97706] hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 rounded-full bg-[#0d5d3a] hover:bg-[#084229] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50 mt-2"
              >
                {busy ? 'Signing In…' : 'Sign In'}
              </button>
            </form>
          ) : (
            /* ── SIGNUP FORM ── */
            <form
              className="space-y-3"
              onSubmit={async e => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                setBusy(true); setError(null);
                try {
                  const { apiFetch } = await import('../api/client');
                  await apiFetch('/auth/register', {
                    method:'POST',
                    body:JSON.stringify({
                      name:String(f.get('name')||''),
                      phone:String(f.get('phone')||''),
                      email:String(f.get('email')||''),
                      age:Number(f.get('age')||0),
                      gender:String(f.get('gender')||''),
                      password:String(f.get('password')||'')
                    }),
                    noReloadOnSuspend:true,
                    timeoutMs:30000
                  });
                  onAuthSuccess();
                } catch(e:any) { setError(e.message||'Signup failed'); }
                finally { setBusy(false); }
              }}
            >
              <div>
                <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#0d5d3a] absolute left-3.5 top-3" />
                  <input name="name" type="text" placeholder="John Doe" required className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-xs text-[#0a2617] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#0d5d3a] absolute left-3.5 top-3" />
                  <input name="phone" type="tel" placeholder="+91 98765 43210" required className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-xs text-[#0a2617] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#0d5d3a] absolute left-3.5 top-3" />
                  <input name="email" type="email" placeholder="john@example.com" required className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-xs text-[#0a2617] outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Age</label>
                  <input name="age" type="number" min="10" max="100" placeholder="25" required className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-xs text-[#0a2617] outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Gender</label>
                  <select name="gender" required className="w-full px-4 py-2.5 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-xs text-[#0a2617] outline-none cursor-pointer">
                    <option value="" disabled selected>Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#0d5d3a] absolute left-3.5 top-3" />
                  <input name="password" type={showPw ? 'text' : 'password'} placeholder="Create password" required className="w-full pl-10 pr-10 py-2.5 rounded-2xl border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 bg-white font-semibold text-xs text-[#0a2617] outline-none" />
                  <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3.5 top-3 text-[#0d5d3a]">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50 mt-1"
              >
                {busy ? 'Creating Account…' : 'Create Free Account'}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-semibold text-[#0d5d3a]/60">
        © {new Date().getFullYear()} ZenMind Health. All rights reserved.
      </footer>
    </div>
  );
}
