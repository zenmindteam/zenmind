import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Bot, UserCheck, ShieldCheck, Users, ArrowRight, CheckCircle } from "lucide-react";

interface TherapyRevealSectionProps {
  onBookSession?: () => void;
}

export const TherapyRevealSection: React.FC<TherapyRevealSectionProps> = ({ onBookSession }) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const careLayers = [
    {
      id: "01",
      badge: "TIER 01 • INSTANT AI COMPANION",
      title: "24/7 Empathetic AI Companion",
      description: "Zeni parses context, sentiment velocity, and emotional nuance — offering instant, thoughtful replies in English, Hindi, Hinglish, or Kannada with zero wait time.",
      metric: "Sub-400ms Response Latency",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "02",
      badge: "TIER 02 • CLINICAL CARE",
      title: "1-on-1 Verified Psychotherapy",
      description: "Whenever you feel you need human care beyond AI conversations, book confidential 1-on-1 video therapy sessions with licensed adolescent psychotherapists.",
      metric: "120+ Verified Practitioners",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "03",
      badge: "BACKGROUND RISK PIPELINE",
      title: "Independent Crisis Safety Guardian",
      description: "An isolated background safety pipeline continuously monitors conversation flow for serious distress signals to ensure immediate care pathways.",
      metric: "24/7 Active Safeguards",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "04",
      badge: "PEER SANCTUARY",
      title: "Moderated Anonymous Peer Circles",
      description: "Connect anonymously with students dealing with similar academic pressure and social burnout in clinically supervised community rooms.",
      metric: "50,000+ Student Community",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // Auto-play timer every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % careLayers.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [careLayers.length]);

  const current = careLayers[activeTab];

  return (
    <section
      id="therapy-reveal"
      className="relative w-full bg-[#f8fdf9] py-28 sm:py-36 md:py-44 overflow-hidden z-20 border-b border-[#0e3820]/10"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Section Headline aligned clean to section start */}
        <div className="flex flex-col items-start text-left max-w-4xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0e3820]/10 text-[#0e3820] text-xs font-sans tracking-[0.2em] uppercase font-bold mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0e3820]" />
            <span>COMPLETE CARE ECOSYSTEM</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-sans-main text-4xl sm:text-6xl md:text-7xl lg:text-[80px] text-[#0e3820] font-normal leading-[0.98] tracking-tight mb-4"
          >
            Continuous AI Support.<br />
            <span className="italic text-[#10b981]">On-Demand Human Experts.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-sans-main text-lg sm:text-xl text-[#0e3820]/80 font-normal max-w-2xl leading-relaxed"
          >
            The seamless continuum between instant 24/7 AI conversations and verified offline & online adolescent psychotherapists.
          </motion.p>
        </div>

        {/* ── BORDERLESS APPLE-STYLE SCROLLYTELLING INTERACTIVE SPLIT WITH AUTO-PLAY ── */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Liquid Pill Selector Tabs */}
          <div className="lg:col-span-5 space-y-4">
            {careLayers.map((layer, idx) => {
              const isActive = activeTab === idx;

              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveTab(idx)}
                  className={`p-6 rounded-3xl transition-all duration-300 cursor-pointer border ${
                    isActive
                      ? "bg-[#0e3820] text-white border-[#0e3820] shadow-2xl scale-[1.02]"
                      : "bg-white/60 text-[#0e3820] border-[#0e3820]/15 hover:bg-white hover:border-[#0e3820]/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-[10px] font-bold font-sans tracking-widest uppercase block mb-1 ${isActive ? "text-[#ffebc4]" : "text-[#0e3820]/50"}`}>
                        Phase {layer.id} of 04
                      </span>
                      <h3 className={`font-sans-main text-xl font-normal leading-snug ${isActive ? "text-white" : "text-[#0e3820]"}`}>
                        {layer.title}
                      </h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isActive ? "bg-[#ffebc4] text-[#0a2617]" : "bg-[#0e3820]/10 text-[#0e3820]"}`}>
                      {layer.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Liquid Media Showcase Canvas */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full h-[450px] sm:h-[500px] rounded-[3rem] overflow-hidden border border-[#0e3820]/20 shadow-2xl flex flex-col justify-between p-8 sm:p-12 group"
              >
                {/* Full-Bleed Background Photography */}
                <img
                  src={current.image}
                  alt={current.title}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] contrast-110 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Liquid Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#092214] via-[#092214]/60 to-transparent pointer-events-none" />

                {/* Top Badge Info */}
                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/20">
                  <span className="px-3.5 py-1 rounded-full bg-[#10b981]/25 text-[#10b981] border border-[#10b981]/40 text-xs font-bold font-sans uppercase tracking-wider">
                    {current.badge}
                  </span>
                  <span className="text-xs text-[#ffebc4] font-bold font-sans flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    {current.metric}
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 space-y-4">
                  <h3 className="font-sans-main text-3xl sm:text-4xl text-white font-normal leading-tight">
                    {current.title}
                  </h3>

                  <p className="text-sm sm:text-base text-white/85 font-normal leading-relaxed max-w-xl">
                    {current.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-white/60 font-sans">100% Confidential Sanctuary Protocol</span>

                    <button
                      onClick={onBookSession}
                      className="px-6 py-3 rounded-full bg-[#ffebc4] text-[#0a2617] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl border-0 cursor-pointer inline-flex items-center gap-2"
                    >
                      <span>TALK TO EXPERT NOW</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
