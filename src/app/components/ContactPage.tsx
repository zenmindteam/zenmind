import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion } from "motion/react";
import { X, Send, Sparkles, Phone, Mail, ArrowDownLeft, ShieldCheck, Globe2, Clock, CheckCircle } from "lucide-react";
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
    { top: "45%", left: "75%", scale: 1.3 },   // Hero: Right side
    { top: "50%", left: "50%", scale: 1.1 },   // Form section: Center backdrop
    { top: "50%", left: "25%", scale: 1.5 },   // Crisis section: Left side
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

  const handleCompanyNavigation = (link: string) => {
    if (link === 'Contact Us' && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCompanyLinkClick?.(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={containerRef}
      data-lenis-prevent
      className="fixed inset-0 z-[200] bg-[#0a2617] text-[#fffdf5] overflow-y-auto font-sans-main scrollbar-none [&::-webkit-scrollbar]:hidden no-scrollbar select-none"
    >
      {/* ── LANDING NAVBAR ── */}
      <LandingNavbar
        scrollContainerRef={containerRef}
        delayReappearMs={1500}
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={handleCompanyNavigation}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />

      {/* Floating Close Button top right */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-5 right-6 z-[210] flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
        title="Close Contact Page"
      >
        <X className="w-4 h-4 text-[#ffebc4]" />
        <span>Close</span>
      </button>

      {/* ── INTERACTIVE 3D SCROLL GLOBE ── */}
      <div
        className="fixed z-10 pointer-events-none transition-all duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
          filter: `opacity(${activeSection === 2 ? 0.3 : 0.75})`,
        }}
      >
        <Globe />
      </div>

      {/* ── HERO SECTION: Editorial Header ── */}
      <section
        ref={el => (sectionRefs.current[0] = el)}
        className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 bg-[#0a2617] overflow-hidden border-b border-white/10 z-20"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <span className="text-[#ffebc4] text-xs font-sans tracking-[0.2em] uppercase font-bold block mb-4">
                ✦ CONTACT ZENMIND SANCTUARY
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] text-[#fffdf5] font-normal leading-[0.98] tracking-tight mb-8">
                Let&apos;s Make Mental Health<br />
                <span className="text-[#d97706] font-bold">Easier to Talk About.</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#fffdf5]/85 font-normal leading-relaxed max-w-2xl mb-8">
                Whether you&apos;re a college student, mental-health professional, organization, or simply curious about ZenMind — we&apos;d love to hear from you.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => sectionRefs.current[1]?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-full bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer"
                >
                  Fill Contact Form ↓
                </button>
                <button
                  type="button"
                  onClick={() => sectionRefs.current[2]?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  24/7 Crisis Helplines
                </button>
              </div>
            </motion.div>

            {/* Right Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 bg-white/5 border border-white/15 p-8 rounded-3xl backdrop-blur-md space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#d97706] flex items-center justify-center text-white font-bold">
                  <Globe2 className="w-5 h-5 text-[#fde68a]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#ffebc4] uppercase tracking-wider">Global Reach</div>
                  <div className="text-base font-bold text-white">24/7 Digital Sanctuary</div>
                </div>
              </div>

              <p className="text-sm text-[#fffdf5]/80 leading-relaxed font-normal">
                Our platform operates round-the-clock across India and international digital communities, routing inquiries directly to our Super Admin desk.
              </p>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3 text-xs text-[#ffebc4] font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  <span>Real-time Admin Dashboard Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#10b981]" />
                  <span>End-to-End Encrypted Communications</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── SECTION 2: EXACT LANDING PAGE CONTACT CARD UI (GetInTouchSection) ── */}
      <section
        ref={el => (sectionRefs.current[1] = el)}
        className="relative w-full bg-[#0a2617] py-16 sm:py-24 z-20"
      >
        <div className="w-full bg-[#0a2617]">
          <div
            id="contact-form-section"
            className="relative w-full bg-[#f8fdf9] text-[#0a2617] rounded-[2.5rem] lg:rounded-[3.5rem] z-20 pt-10 pb-16 sm:pb-24 overflow-hidden border-2 border-[#0d5d3a]/15 shadow-2xl"
          >
            {/* Decorative Arrow Top Right */}
            <div className="absolute top-6 right-6 sm:right-10 lg:right-12 text-[#0a2617]">
              <ArrowDownLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
            </div>

            <div className="w-full px-6 sm:px-10 md:px-14 lg:px-16">
              {/* Top Row: Heading + Subtitle */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 sm:mb-14 md:mb-16">
                <h2
                  className="font-sans-main text-4xl sm:text-5xl md:text-6xl lg:text-[60px] xl:text-[70px] font-normal leading-[1.05] tracking-tight text-[#0a2617] -ml-1 mt-1 max-w-2xl text-left"
                >
                  Let&apos;s Make Mental Health<br />Easier to Talk About.
                </h2>
                <p
                  className="font-sans text-xs sm:text-sm md:text-base text-[#0a2617]/80 max-w-xs md:max-w-md text-left leading-relaxed"
                >
                  Whether you&apos;re a college, mental-health professional, organization, or simply curious about Zeni — we&apos;d love to hear from you.
                </p>
              </div>

              {/* Form + Image Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                
                {/* Left: Form Card */}
                <div>
                  {/* Star + Label */}
                  <div className="flex items-center gap-2 mb-6">
                    <img
                      src="/star-black.svg"
                      alt=""
                      className="w-3.5 h-3.5"
                    />
                    <p className="font-sans text-xs sm:text-sm tracking-[0.1em] uppercase font-medium text-[#0a2617]">
                      Fill out the form
                    </p>
                  </div>

                  {/* Form Fields */}
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Full Name*"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#0a2617]/[0.05] rounded-xl px-5 py-4 font-sans text-sm text-[#0a2617] placeholder:text-[#0a2617]/50 focus:outline-none focus:ring-1 focus:ring-[#0a2617]/20 transition-all border-0"
                    />
                    <input
                      type="email"
                      placeholder="Email*"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#0a2617]/[0.05] rounded-xl px-5 py-4 font-sans text-sm text-[#0a2617] placeholder:text-[#0a2617]/50 focus:outline-none focus:ring-1 focus:ring-[#0a2617]/20 transition-all border-0"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#0a2617]/[0.05] rounded-xl px-5 py-4 font-sans text-sm text-[#0a2617] placeholder:text-[#0a2617]/50 focus:outline-none focus:ring-1 focus:ring-[#0a2617]/20 transition-all border-0"
                    />
                    <select
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#0a2617]/[0.05] rounded-xl px-5 py-4 font-sans text-sm text-[#0a2617] focus:outline-none focus:ring-1 focus:ring-[#0a2617]/20 transition-all border-0 cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Therapy Support">Therapy Support</option>
                      <option value="Partnership Request">Partnership Request</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Feedback">Feedback & Suggestions</option>
                    </select>
                    <textarea
                      placeholder="Message*"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#0a2617]/[0.05] rounded-xl px-5 py-4 font-sans text-sm text-[#0a2617] placeholder:text-[#0a2617]/50 focus:outline-none focus:ring-1 focus:ring-[#0a2617]/20 transition-all min-h-[140px] md:min-h-[180px] resize-y border-0"
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className="mt-2 w-full bg-[#0a2617] text-[#fffdf5] font-sans text-xs sm:text-sm tracking-[0.15em] uppercase font-bold py-4 rounded-xl hover:bg-[#3a2e27] transition-colors duration-300 border-0 cursor-pointer disabled:opacity-50"
                    >
                      {submitted ? "Message Sent! ✓" : busy ? "Sending..." : "Start a Conversation →"}
                    </button>
                  </form>
                </div>

                {/* Right: Glassmorphism Image Card */}
                <div
                  style={{
                    backdropFilter: 'blur(15px)',
                    WebkitBackdropFilter: 'blur(15px)',
                    boxShadow: `
                      inset 0 0 20px rgba(255, 255, 255, 0.18),
                      inset 0 0 5px rgba(255, 255, 255, 0.28),
                      0 12px 30px rgba(0, 0, 0, 0.45)
                    `,
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                  }}
                  className="relative w-full aspect-[4/3] md:aspect-[690/520] rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img
                    src="/peoples-image.webp"
                    alt="Happy People"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a2617]/90 via-[#0a2617]/40 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#d97706] text-white flex items-center justify-center font-bold">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-[#fde68a]">Email Support</div>
                          <div className="text-sm font-bold text-white">support@zenmind.in</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0d5d3a] text-white flex items-center justify-center font-bold">
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
          </div>
        </div>
      </section>

      {/* ── SECTION 3: CRISIS HELPLINES ── */}
      <section
        ref={el => (sectionRefs.current[2] = el)}
        className="relative py-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto z-20"
      >
        <div className="mb-12 text-center sm:text-left">
          <span className="text-[#ffebc4] text-xs font-sans tracking-[0.2em] uppercase font-bold block mb-3">
            ✦ EMERGENCY CRISIS LINES
          </span>
          <h2 className="text-3xl sm:text-5xl font-normal text-white tracking-tight mb-4">
            In Need of Urgent Help?
          </h2>
          <p className="text-sm sm:text-base text-[#fffdf5]/80 max-w-xl font-normal">
            ZenMind is a supportive platform. If you or someone you know is in immediate crisis, tap any number to call trained counsellors directly.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="tel:18005990019" className="bg-white/5 border border-white/15 p-6 rounded-2xl backdrop-blur-md hover:border-[#d97706] transition-all">
            <Phone className="w-6 h-6 text-[#d97706] mb-3" />
            <div className="text-xs font-bold text-[#ffebc4] uppercase">Kiran – Govt of India</div>
            <div className="text-lg font-bold text-white mt-1">1800-599-0019</div>
            <div className="text-xs text-white/60 mt-1">24/7 · Toll-Free · 13 Languages</div>
          </a>

          <a href="tel:9152987821" className="bg-white/5 border border-white/15 p-6 rounded-2xl backdrop-blur-md hover:border-[#10b981] transition-all">
            <Phone className="w-6 h-6 text-[#10b981] mb-3" />
            <div className="text-xs font-bold text-[#ffebc4] uppercase">iCall – TISS</div>
            <div className="text-lg font-bold text-white mt-1">9152987821</div>
            <div className="text-xs text-white/60 mt-1">Mon–Sat, 8am–10pm · Free</div>
          </a>

          <a href="tel:18602662345" className="bg-white/5 border border-white/15 p-6 rounded-2xl backdrop-blur-md hover:border-[#d97706] transition-all">
            <Phone className="w-6 h-6 text-[#d97706] mb-3" />
            <div className="text-xs font-bold text-[#ffebc4] uppercase">Vandrevala Foundation</div>
            <div className="text-lg font-bold text-white mt-1">1860-2662-345</div>
            <div className="text-xs text-white/60 mt-1">24/7 · Mental Health & Crisis</div>
          </a>

          <a href="tel:08046110007" className="bg-white/5 border border-white/15 p-6 rounded-2xl backdrop-blur-md hover:border-[#10b981] transition-all">
            <Phone className="w-6 h-6 text-[#10b981] mb-3" />
            <div className="text-xs font-bold text-[#ffebc4] uppercase">NIMHANS Helpline</div>
            <div className="text-lg font-bold text-white mt-1">080-46110007</div>
            <div className="text-xs text-white/60 mt-1">National Institute Bangalore</div>
          </a>
        </div>
      </section>

      {/* ── LANDING FOOTER ── */}
      <LandingFooter
        onProductLinkClick={onProductLinkClick}
        onCompanyLinkClick={handleCompanyNavigation}
        onResourcesLinkClick={onResourcesLinkClick}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onGetStarted={onGetStarted}
      />
    </motion.div>
  );
}
