import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, ExternalLink, Shield, FileText, Users, HeartHandshake, BookOpen, AlertTriangle, CheckCircle, Send, Sparkles, X } from 'lucide-react';

const CRISIS_LINES = [
  { name: 'iCall – Tata Institute', number: '9152987821', desc: 'Mon–Sat, 8am–10pm · Free counselling & therapy', tag: 'Counselling' },
  { name: 'Kiran – Govt of India', number: '1800-599-0019', desc: '24/7 · Free · 13 Indian languages · All India', tag: '24/7 Free' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 · Mental health & suicide prevention', tag: '24/7' },
  { name: 'iCharity / iCall Alt',  number: '9820466627',   desc: 'Crisis support & emotional counselling', tag: 'Counselling' },
  { name: 'SNEHI',                 number: '044-24640050', desc: 'Chennai · Emotional support helpline', tag: 'Regional' },
  { name: 'NIMHANS Helpline',      number: '080-46110007', desc: 'National Institute of Mental Health, Bangalore', tag: 'Clinical' },
  { name: 'Aasra',                 number: '022-27546669', desc: '24/7 · Suicide prevention & emotional support', tag: '24/7' },
  { name: 'Sumaitri',              number: '011-23389090', desc: 'New Delhi · Emotional support, Mon–Fri', tag: 'Regional' },
  { name: 'Arpita Suicide Prev.', number: '080-23655557', desc: 'Bangalore · Crisis counselling', tag: 'Regional' },
  { name: 'Mann Talks',            number: '8686139139',   desc: 'Student mental health support', tag: 'Students' },
  { name: 'Fortis StressLine',     number: '8376804102',   desc: 'Fortis Hospital · 24/7 Crisis support', tag: '24/7' },
  { name: 'Parivarthan',           number: '7676602602',   desc: 'Bangalore · Individual & family counselling', tag: 'Counselling' },
];

const TAG_COLORS: Record<string, string> = {
  '24/7':       'bg-green-100  dark:bg-green-500/20  text-green-700  dark:text-green-400',
  '24/7 Free':  'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  'Free':       'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  'Counselling':'bg-blue-100   dark:bg-blue-500/20   text-blue-700   dark:text-blue-400',
  'Clinical':   'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
  'Regional':   'bg-amber-100  dark:bg-amber-500/20  text-amber-700  dark:text-amber-400',
  'Students':   'bg-pink-100   dark:bg-pink-500/20   text-pink-700   dark:text-pink-400',
};

export default function ResourcesPage({ page, onClose }: { page: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-[#f7fbf8] dark:bg-[#050505] overflow-y-auto"
    >
      {/* Floating close button */}
      <button onClick={onClose}
        className="fixed top-4 right-4 z-[110] w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] shadow-lg border border-[#0d5d3a]/20 dark:border-white/10 flex items-center justify-center text-[#0a2617] dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition"
        title="Close">
        <X className="w-5 h-5 text-[#0d5d3a]" />
      </button>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 pb-24">
        {page === 'Help Center' && <HelpCenter />}
        {page === 'Privacy Policy' && <PrivacyPolicy />}
        {page === 'Terms of Service' && <TermsOfService />}
        {page === 'Crisis Support' && <CrisisSupport />}
        {page === 'Community' && <Community />}
        {(page === 'Contact Us' || page === 'Contact') && <ContactUsPage />}
      </div>
    </motion.div>
  );
}

/* ── CONTACT US PAGE (LANDING PAGE CONTACT CARD STYLE IN GREEN, WHITE & GOLD) ── */
function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setBusy(true);

    const newQuery = {
      _id: 'ct_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      type: 'contact',
      subject: formData.subject,
      body: formData.message,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'N/A',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const { apiFetch } = await import('../api/client');
      await apiFetch('/support/contact', {
        method: 'POST',
        body: JSON.stringify(newQuery)
      });
    } catch (err) {
      // API fallback
    } finally {
      try {
        const existing = JSON.parse(localStorage.getItem('zm_contact_queries') || '[]');
        existing.unshift(newQuery);
        localStorage.setItem('zm_contact_queries', JSON.stringify(existing));
      } catch {}
      setBusy(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="w-full bg-[#f8fdf9] rounded-[2.5rem] p-6 sm:p-10 border-2 border-[#0d5d3a]/15 shadow-2xl text-[#0a2617]">
      
      {/* Heading Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fef3c7] border border-[#fde68a] text-xs font-bold text-[#78350f] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#d97706]" />
          <span>ZenMind Support & Contact Desk</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0d5d3a] tracking-tight leading-tight" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
          Let's Make Mental Health<br className="hidden sm:block" /> Easier to Talk About.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#0a2617]/80 font-semibold max-w-2xl">
          Whether you have a query about sessions, therapist onboarding, platform features, or partnerships — reach out directly to our team.
        </p>
      </div>

      {/* Grid: Left Form Card + Right Contact Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#0d5d3a]/15 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <p className="font-sans text-xs sm:text-sm tracking-[0.1em] uppercase font-bold text-[#0d5d3a]">
              Fill out the contact form
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Full Name*</label>
              <input
                type="text"
                placeholder="Harshit Sharma"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3.5 font-sans text-sm font-semibold text-[#0a2617] placeholder:text-[#0d5d3a]/40 border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Email Address*</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3.5 font-sans text-sm font-semibold text-[#0a2617] placeholder:text-[#0d5d3a]/40 border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3.5 font-sans text-sm font-semibold text-[#0a2617] placeholder:text-[#0d5d3a]/40 border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Subject</label>
              <select
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3.5 font-sans text-sm font-semibold text-[#0a2617] border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 outline-none cursor-pointer"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Therapy Support">Therapy Support</option>
                <option value="Partnership Request">Partnership Request</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Feedback">Feedback & Suggestions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Message*</label>
              <textarea
                placeholder="Tell us how we can assist you..."
                rows={4}
                required
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3.5 font-sans text-sm font-semibold text-[#0a2617] placeholder:text-[#0d5d3a]/40 border-2 border-[#0d5d3a]/15 focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 outline-none transition-all resize-y min-h-[120px]"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-2 w-full bg-[#0d5d3a] hover:bg-[#084229] text-[#fffdf5] font-sans text-xs sm:text-sm tracking-[0.15em] uppercase font-extrabold py-4 rounded-full transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-[#fde68a]" />
              <span>{submitted ? "Message Sent to Admin! ✓" : busy ? "Sending..." : "Submit Query to Admin →"}</span>
            </button>
          </form>
        </div>

        {/* Right Glass Card */}
        <div className="relative w-full aspect-[4/3] md:aspect-[690/520] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#0d5d3a]/20">
          <img
            src="/peoples-image.webp"
            alt="ZenMind Team"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2617]/90 via-[#0a2617]/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d97706] text-white flex items-center justify-center font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#fde68a]">Email Support</div>
                  <div className="text-sm font-bold text-white">support@zenmind.in</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0d5d3a] text-white flex items-center justify-center font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#fde68a]">Toll-Free Helpline</div>
                  <div className="text-sm font-bold text-white">1800-599-0019 (24/7)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── HELP CENTER ── */
function HelpCenter() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-[#0d5d3a]/10 text-[#0d5d3a] text-xs font-black uppercase tracking-widest mb-4">Help Center</span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0a2617] mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>How can we help?</h1>
        <p className="text-[#4a7c5d]">Find answers, contact support, or reach a real human for help.</p>
      </div>

      {[
        { q: 'How do I create an account?', a: 'Click "Get Started" on the home page, enter your email and set a password. Verify your email to activate your account.' },
        { q: 'How do I book a therapy session?', a: 'Navigate to the Therapy Hub in your dashboard, browse available therapists, and click "Book Session" on any therapist card.' },
        { q: 'Are my conversations private?', a: 'Absolutely. All AI chats are encrypted and never shared. Video sessions use end-to-end WebRTC encryption and are never recorded.' },
        { q: 'How do I cancel a session?', a: 'Go to Dashboard → My Sessions → find your upcoming session → click Cancel. Refund policy applies based on how early you cancel.' },
        { q: 'I forgot my password — what do I do?', a: 'Click "Forgot Password" on the login page. We\'ll send a reset link to your registered email address.' },
        { q: 'How do I report a problem?', a: 'Use the "Contact Us" link in the Support section of the footer, or email us at support@zenmind.in' },
      ].map((faq, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#0d5d3a]/10 p-6 shadow-xs">
          <h3 className="font-black text-[#0a2617] mb-2">{faq.q}</h3>
          <p className="text-[#4a7c5d] text-sm leading-relaxed">{faq.a}</p>
        </div>
      ))}

      <div className="bg-[#f0fbf4] rounded-2xl border border-[#0d5d3a]/20 p-6 text-center shadow-xs">
        <p className="font-bold text-[#0a2617] mb-2">Still need help?</p>
        <a href="mailto:support@zenmind.in" className="inline-flex items-center gap-2 text-[#0d5d3a] font-bold text-sm hover:underline">
          <Mail size={16} /> support@zenmind.in
        </a>
      </div>
    </div>
  );
}

/* ── CRISIS SUPPORT ── */
function CrisisSupport() {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-black text-sm mb-4">
          <AlertTriangle size={16} /> If you are in immediate danger, call <a href="tel:112" className="underline">112</a>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0a2617] mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>Crisis Support</h1>
        <p className="text-[#4a7c5d] max-w-xl mx-auto">You are not alone. Trained counsellors are available right now. Tap any number to call directly.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {CRISIS_LINES.map((line, i) => (
          <motion.a key={i} href={`tel:${line.number.replace(/[^0-9]/g, '')}`}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group bg-white rounded-2xl border border-[#0d5d3a]/10 p-5 flex items-start gap-4 hover:border-[#0d5d3a]/40 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-full bg-[#0d5d3a]/10 flex items-center justify-center shrink-0 group-hover:bg-[#0d5d3a] transition-colors">
              <Phone size={18} className="text-[#0d5d3a] group-hover:text-white transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                <span className="font-black text-[#0a2617] text-sm">{line.name}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${TAG_COLORS[line.tag] || 'bg-gray-100 text-gray-600'}`}>{line.tag}</span>
              </div>
              <p className="text-[#0d5d3a] font-black text-base">{line.number}</p>
              <p className="text-[#4a7c5d] text-xs mt-0.5">{line.desc}</p>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="text-amber-800 text-sm font-semibold leading-relaxed">
          <strong>Please note:</strong> ZenMind is a supportive platform, not an emergency service. If you or someone you know is in immediate danger, please call <strong>112</strong> (India Emergency) or go to your nearest hospital.
        </p>
      </div>
    </div>
  );
}

/* ── PRIVACY POLICY ── */
function PrivacyPolicy() {
  const sections = [
    { title: 'Information We Collect', body: 'We collect only what is necessary: your name, email, and session preferences. AI conversations are processed in real-time and not permanently stored in identifiable form. Therapy session metadata (time, duration) is stored for billing — video content is never recorded.' },
    { title: 'How We Use Your Data', body: 'Your data is used exclusively to provide the ZenMind service: to personalise your experience, connect you with therapists, and improve our AI model. We never sell, rent, or share your personal data with third parties for advertising.' },
    { title: 'Data Security', body: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Video sessions use end-to-end WebRTC encryption. We conduct regular security audits and follow industry best practices.' },
    { title: 'Data Retention', body: 'Account data is retained for the duration of your account. You can request complete deletion at any time by contacting support@zenmind.in. Deletion is processed within 30 days.' },
    { title: 'Cookies', body: 'We use essential cookies for authentication and session management. No third-party tracking cookies are used. You can clear cookies at any time via your browser settings.' },
    { title: 'Children\'s Privacy', body: 'ZenMind is designed for adolescents aged 13+. Users under 18 should use the platform with parental awareness. We do not knowingly collect data from children under 13.' },
    { title: 'Your Rights', body: 'You have the right to access, correct, export, or delete your personal data. Contact us at privacy@zenmind.in for any data rights requests. We respond within 7 business days.' },
    { title: 'Contact', body: 'Privacy Officer: privacy@zenmind.in | ZenMind Healthcare, India | Last updated: May 2026' },
  ];
  return (
    <div className="space-y-8">
      <div className="text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-[#0d5d3a]/10 text-[#0d5d3a] text-xs font-black uppercase tracking-widest mb-4">Legal</span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0a2617] mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>Privacy Policy</h1>
        <p className="text-[#4a7c5d]">Your privacy is our foundational commitment. We are transparent about everything.</p>
      </div>
      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#0d5d3a]/10 p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3"><CheckCircle size={16} className="text-[#0d5d3a] shrink-0" /><h3 className="font-black text-[#0a2617]">{s.title}</h3></div>
            <p className="text-[#4a7c5d] text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── TERMS OF SERVICE ── */
function TermsOfService() {
  const sections = [
    { title: 'Acceptance of Terms', body: 'By creating an account on ZenMind, you agree to these Terms of Service. If you do not agree, please do not use the platform.' },
    { title: 'Eligibility', body: 'You must be at least 13 years of age to use ZenMind. Users under 18 are advised to inform a parent or guardian. By using the platform, you confirm you meet these requirements.' },
    { title: 'Use of the Platform', body: 'ZenMind is a mental wellness support platform, not a substitute for emergency medical care. The AI companion provides emotional support — it is not a licensed therapist. For medical emergencies, contact 112 immediately.' },
    { title: 'Therapy Sessions', body: 'All therapists are independently licensed professionals. ZenMind facilitates the connection and session but is not responsible for the clinical advice provided by therapists. Sessions are subject to our cancellation and refund policy.' },
    { title: 'User Content', body: 'You retain ownership of any content you submit. By submitting community stories, you grant ZenMind a non-exclusive licence to display and moderate that content within the platform.' },
    { title: 'Prohibited Conduct', body: 'You may not use ZenMind to harass others, post harmful content, attempt to reverse-engineer the platform, or misrepresent yourself as a healthcare professional.' },
    { title: 'Payment & Refunds', body: 'Session fees are charged at the time of booking. Refunds follow our cancellation policy (100% for 3+ days notice, 80% for 2 days, 70% for late cancellation). All payments are processed securely.' },
    { title: 'Limitation of Liability', body: 'ZenMind provides the platform "as is". We are not liable for clinical outcomes, third-party service disruptions, or indirect damages arising from platform use.' },
    { title: 'Changes to Terms', body: 'We may update these terms at any time. Continued use of the platform after updates constitutes acceptance. We will notify you of significant changes via email.' },
    { title: 'Contact', body: 'Legal: legal@zenmind.in | ZenMind Healthcare, India | Last updated: May 2026' },
  ];
  return (
    <div className="space-y-8">
      <div className="text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-[#0d5d3a]/10 text-[#0d5d3a] text-xs font-black uppercase tracking-widest mb-4">Legal</span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0a2617] mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>Terms of Service</h1>
        <p className="text-[#4a7c5d]">Simple, transparent terms. No hidden surprises.</p>
      </div>
      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#0d5d3a]/10 p-6 shadow-xs">
            <h3 className="font-black text-[#0a2617] mb-2"><span className="text-[#0d5d3a] mr-2">{i + 1}.</span>{s.title}</h3>
            <p className="text-[#4a7c5d] text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── COMMUNITY ── */
function Community() {
  return (
    <div className="space-y-10 text-center">
      <div>
        <span className="inline-block px-4 py-1 rounded-full bg-[#0d5d3a]/10 text-[#0d5d3a] text-xs font-black uppercase tracking-widest mb-4">Community</span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0a2617] mb-4" style={{ fontFamily: 'Google Sans, sans-serif' }}>You belong here</h1>
        <p className="text-[#4a7c5d] max-w-lg mx-auto">ZenMind's community is a safe, moderated space for adolescents to share, support each other, and heal together.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 text-left">
        {[
          { icon: Users, title: 'Peer Circles', desc: 'Join topic-based support circles — anxiety, sleep, exam stress, self-esteem and more. Real conversations with peers who understand.' },
          { icon: HeartHandshake, title: 'Community Stories', desc: 'Read and share personal mental health journeys. Every story you share (anonymously if you choose) could be someone else\'s turning point.' },
          { icon: Shield, title: 'Safe & Moderated', desc: 'All community content is reviewed by our moderation team. Harmful content is removed swiftly. Your safety is always the priority.' },
        ].map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#0d5d3a]/10 p-6 shadow-xs">
            <div className="w-11 h-11 rounded-2xl bg-[#0d5d3a] flex items-center justify-center mb-4"><Icon size={20} className="text-white" /></div>
            <h3 className="font-black text-[#0a2617] mb-2">{title}</h3>
            <p className="text-[#4a7c5d] text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-br from-[#0d5d3a] to-[#084229] rounded-2xl p-8 text-white shadow-md">
        <h3 className="text-2xl font-black mb-2">Join the community</h3>
        <p className="text-white/80 mb-4 text-sm">Sign in to access Peer Circles, share your story, and connect with others on the same journey.</p>
        <span className="inline-block px-5 py-2.5 rounded-xl bg-white text-[#0d5d3a] font-black text-sm">Sign In to Join →</span>
      </div>
    </div>
  );
}
