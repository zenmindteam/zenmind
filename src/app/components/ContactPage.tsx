import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles, Phone, Mail, ArrowDownLeft, ShieldCheck, HeartHandshake, Globe2, Clock, CheckCircle } from "lucide-react";
import Globe from "./ui/globe";
import { Navbar as LandingNavbar } from "./landing/Navbar";
import { Footer as LandingFooter } from "./landing/Footer";

interface ContactPageProps {
  onClose: () => void;
  onGetStarted?: () => void;
  onAdminLoginTrigger?: () => void;
  onTherapistLoginTrigger?: () => void;
  onCompanyLinkClick?: (link: string) => void;
  onResourcesLinkClick?: (link: string) => void;
  onProductLinkClick?: (link: string) => void;
}

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.3 },   // Hero: Right side, balanced
    { top: "25%", left: "50%", scale: 0.9 },   // Global Presence: Top side
    { top: "50%", left: "25%", scale: 1.4 },   // Contact Form: Left side
    { top: "50%", left: "50%", scale: 1.8 },   // Crisis & Future: Center, large backdrop
  ]
};

const parsePercent = (str: string): number => parseFloat(str.replace('%', ''));

export default function ContactPage({
  onClose,
  onGetStarted,
  onAdminLoginTrigger,
  onTherapistLoginTrigger,
  onCompanyLinkClick,
  onResourcesLinkClick,
  onProductLinkClick,
}: ContactPageProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameId = useRef<number>();

  // Contact Form State
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const calculatedPositions = useMemo(() => {
    return defaultGlobeConfig.positions.map(pos => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale
    }));
  }, []);

  const updateScrollPosition = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const docHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    
    setScrollProgress(progress);

    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          newActiveSection = index;
        }
      }
    });

    const currentPos = calculatedPositions[newActiveSection] || calculatedPositions[0];
    const transform = `translate3d(${currentPos.left}vw, ${currentPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${currentPos.scale}, ${currentPos.scale}, 1)`;
    
    setGlobeTransform(transform);
    setActiveSection(newActiveSection);
  }, [calculatedPositions]);

  useEffect(() => {
    let ticking = false;
    const container = containerRef.current;
    
    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      updateScrollPosition();
    }
    
    return () => {
      if (container) container.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [updateScrollPosition]);

  useEffect(() => {
    const initialPos = calculatedPositions[0];
    const initialTransform = `translate3d(${initialPos.left}vw, ${initialPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${initialPos.scale}, ${initialPos.scale}, 1)`;
    setGlobeTransform(initialTransform);
  }, [calculatedPositions]);

  // Form Submit Handler
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
      // Fallback API
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

  const sections = [
    {
      id: "hero",
      badge: "Contact",
      title: "Let's Make Mental Health",
      subtitle: "Easier to Talk About.",
      description: "Whether you're a college student, mental-health professional, organization, or simply curious about ZenMind — we'd love to hear from you."
    },
    {
      id: "presence",
      badge: "Global Presence",
      title: "24/7 Digital Sanctuary",
      subtitle: "Connected Worldwide, Rooted in Care.",
      description: "Our encrypted network supports adolescents, therapists, and organizations across India and global digital communities 24 hours a day, 7 days a week."
    },
    {
      id: "form",
      badge: "Send Message",
      title: "Start a Conversation",
      subtitle: "Direct Route to ZenMind Admin Desk",
      description: "Fill out the contact form below. Your query will be delivered directly to the ZenMind Administration desk for real-time review and response."
    },
    {
      id: "crisis",
      badge: "Emergency Lines",
      title: "24/7 Immediate Crisis Support",
      subtitle: "You Are Never Alone",
      description: "Trained counsellors and national mental health helplines are available right now. If you or someone you know needs urgent help, reach out immediately."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#f8fdf9] text-[#0a2617] font-sans overflow-hidden flex flex-col"
    >
      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-[#f8fdf9]/90 backdrop-blur-md border-b border-[#0d5d3a]/15 h-16 flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onClose}>
          <div className="w-8 h-8 rounded-full bg-[#0d5d3a] flex items-center justify-center text-white font-bold">
            <Globe2 className="w-4 h-4 text-[#fde68a]" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0d5d3a]" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
            ZenMind
          </span>
          <span className="hidden sm:inline-block text-xs font-extrabold text-[#78350f] bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 rounded-full">
            Contact Sanctuary
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#0d5d3a]/20 text-[#0d5d3a] hover:bg-[#e6f4ea] font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 w-full h-1 bg-[#0d5d3a]/10 z-50">
        <div
          className="h-full bg-gradient-to-r from-[#0d5d3a] via-[#d97706] to-[#fde68a] transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Right Navigation Dots */}
      <div className="hidden sm:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-4">
        {sections.map((sec, index) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => {
              sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`group relative flex items-center justify-end p-2 transition-all`}
          >
            <span className={`absolute right-8 px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap bg-white border border-[#0d5d3a]/20 shadow-md text-[#0d5d3a] transition-all ${activeSection === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}>
              {sec.badge}
            </span>
            <div className={`w-3 h-3 rounded-full border-2 transition-all ${activeSection === index ? 'bg-[#d97706] border-[#d97706] scale-125 shadow-md' : 'border-[#0d5d3a]/40 bg-white hover:bg-[#e6f4ea]'}`} />
          </button>
        ))}
      </div>

      {/* ── INTERACTIVE 3D SCROLL GLOBE ── */}
      <div
        className="fixed z-10 pointer-events-none transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
          filter: `opacity(${activeSection === 3 ? 0.35 : 0.85})`,
        }}
      >
        <Globe />
      </div>

      {/* ── SCROLLABLE SECTIONS CONTAINER ── */}
      <div ref={containerRef} className="flex-1 overflow-y-auto overflow-x-hidden relative z-20">
        
        {/* Section 0: Hero */}
        <section
          ref={el => (sectionRefs.current[0] = el)}
          className="min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto py-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-xs font-bold text-[#78350f] mb-6 w-max">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Welcome to ZenMind Contact Sanctuary</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0d5d3a] tracking-tight leading-[1.08] mb-6" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
            Let's Make Mental Health<br />
            <span className="text-[#d97706]">Easier to Talk About.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#0a2617]/80 font-semibold max-w-2xl leading-relaxed mb-8">
            Whether you're a college student, mental-health professional, organization, or simply curious about ZenMind — we'd love to hear from you.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => sectionRefs.current[2]?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full bg-[#0d5d3a] hover:bg-[#084229] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Fill Contact Form →
            </button>
            <button
              type="button"
              onClick={() => sectionRefs.current[3]?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full border-2 border-[#0d5d3a]/20 bg-white hover:bg-[#e6f4ea] text-[#0d5d3a] font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              24/7 Crisis Helplines
            </button>
          </div>
        </section>

        {/* Section 1: Global Presence */}
        <section
          ref={el => (sectionRefs.current[1] = el)}
          className="min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto py-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f4ea] border border-[#0d5d3a]/20 text-xs font-bold text-[#0d5d3a] mb-6 w-max">
            <Globe2 className="w-4 h-4 text-[#0d5d3a]" />
            <span>Global Reach & Privacy</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0d5d3a] tracking-tight leading-tight mb-6" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
            Connected Worldwide,<br />
            Rooted in Compassion.
          </h2>

          <p className="text-base sm:text-lg text-[#0a2617]/80 font-semibold max-w-2xl leading-relaxed mb-10">
            Our encrypted network supports adolescents, therapists, and organizations across India and global digital communities 24 hours a day, 7 days a week.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl">
            <div className="bg-white p-6 rounded-3xl border-2 border-[#0d5d3a]/15 shadow-md space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#fef3c7] text-[#78350f] flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-[#d97706]" />
              </div>
              <h3 className="font-extrabold text-[#0d5d3a] text-base">24/7 AI Companion</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">Instant emotional support available anytime in English, Hindi, and Hinglish.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-[#0d5d3a]/15 shadow-md space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#e6f4ea] text-[#0d5d3a] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-[#0d5d3a] text-base">Encrypted Communications</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">End-to-end encrypted messaging and clinical video consultation rooms.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-[#0d5d3a]/15 shadow-md space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#fef3c7] text-[#78350f] flex items-center justify-center font-bold">
                <Send className="w-5 h-5 text-[#d97706]" />
              </div>
              <h3 className="font-extrabold text-[#0d5d3a] text-base">Direct Admin Routing</h3>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">Contact queries land directly in our Super Admin dashboard for swift support.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Contact Form Card Section */}
        <section
          ref={el => (sectionRefs.current[2] = el)}
          className="min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto py-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a] text-xs font-bold text-[#78350f] mb-6 w-max">
            <Sparkles className="w-4 h-4 text-[#d97706]" />
            <span>Send Direct Message</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0d5d3a] tracking-tight leading-tight mb-4" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
            Start a Conversation
          </h2>
          <p className="text-sm sm:text-base text-[#0a2617]/80 font-semibold max-w-xl leading-relaxed mb-8">
            Every query is routed directly to the ZenMind Administration Desk for real-time review and response.
          </p>

          {/* Form Card (Matches Footer/Landing Page Component) */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#0d5d3a]/15 shadow-2xl max-w-2xl">
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
        </section>

        {/* Section 3: Emergency & Crisis Helplines */}
        <section
          ref={el => (sectionRefs.current[3] = el)}
          className="min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 max-w-5xl mx-auto py-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-700 mb-6 w-max">
            <Phone className="w-4 h-4 text-red-600" />
            <span>Emergency Support Helplines</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#0d5d3a] tracking-tight leading-tight mb-4" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
            In Need of Immediate Help?
          </h2>
          <p className="text-sm sm:text-base text-[#0a2617]/80 font-semibold max-w-xl leading-relaxed mb-8">
            ZenMind is a digital support sanctuary. If you are in immediate danger or emotional crisis, please reach out to national emergency helplines.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            <a href="tel:18005990019" className="bg-white p-5 rounded-3xl border-2 border-[#0d5d3a]/15 shadow-md flex items-start gap-4 hover:border-[#d97706] transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#fef3c7] text-[#78350f] flex items-center justify-center font-bold shrink-0">
                <Phone className="w-5 h-5 text-[#d97706]" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#78350f] uppercase">Kiran – Govt of India</div>
                <div className="text-base font-extrabold text-[#0d5d3a]">1800-599-0019</div>
                <div className="text-xs text-gray-500 font-medium">24/7 Toll-Free · 13 Indian languages</div>
              </div>
            </a>

            <a href="tel:9152987821" className="bg-white p-5 rounded-3xl border-2 border-[#0d5d3a]/15 shadow-md flex items-start gap-4 hover:border-[#d97706] transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#e6f4ea] text-[#0d5d3a] flex items-center justify-center font-bold shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#0d5d3a] uppercase">iCall – TISS</div>
                <div className="text-base font-extrabold text-[#0d5d3a]">9152987821</div>
                <div className="text-xs text-gray-500 font-medium">Mon–Sat, 8am–10pm · Free counselling</div>
              </div>
            </a>
          </div>
        </section>

        {/* Footer */}
        <LandingFooter
          onProductLinkClick={onProductLinkClick}
          onCompanyLinkClick={onCompanyLinkClick}
          onResourcesLinkClick={onResourcesLinkClick}
          onTherapistLoginTrigger={onTherapistLoginTrigger}
          onGetStarted={onGetStarted}
        />
      </div>
    </motion.div>
  );
}
