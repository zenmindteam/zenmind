import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, BrainCircuit, ShieldCheck, MessageSquare, HeartHandshake, Lock, 
  UserCheck, ArrowRight, ChevronDown, Activity, Users, ShoppingBag, 
  Calendar, CheckCircle, RefreshCw, Layers, Shield, Zap, Search, Send, Clock, IndianRupee, HelpCircle, FileCode, AlertTriangle
} from 'lucide-react';
import FeaturesPage from './FeaturesPage';
import { Navbar as LandingNavbar } from './landing/Navbar';
import { Footer as LandingFooter } from './landing/Footer';
import { apiFetch } from '../api/client';

interface ProductPageProps {
  page: string;
  onClose: () => void;
  onGetStarted?: () => void;
  onAdminLoginTrigger?: () => void;
  onTherapistLoginTrigger?: () => void;
  onCompanyLinkClick?: (link: string) => void;
  onResourcesLinkClick?: (link: string) => void;
  onProductLinkClick?: (link: string) => void;
}

/* ═══════════════════════════════════════════════════════
   1. SYNUS-INSPIRED AI CHATBOT OVERLAY PAGE
   ═══════════════════════════════════════════════════════ */
function AIChatbotPage({
  onGetStarted,
  onAdminLoginTrigger,
  onTherapistLoginTrigger,
  onCompanyLinkClick,
  onResourcesLinkClick,
  onProductLinkClick,
}: Omit<ProductPageProps, 'onClose' | 'page'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'hindi' | 'english' | 'hinglish' | 'kannada'>('hinglish');
  const [inputMessage, setInputMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'zeni', text: 'Hey there. I\'m Zeni. Whenever your mind feels loud or you just need someone to vent to without judgment, I\'m here.' }
  ]);

  const samples = {
    hinglish: "Yaar exams ka tension bohot zyada lag raha hai, neend nahi aa rahi.",
    english: "I feel like everyone expects too much from me and I'm falling behind.",
    hindi: "मुझे बहुत चिंता हो रही है और समझ नहीं आ रहा किससे बात करूँ।",
    kannada: "ನನಗೆ ತುಂಬಾ ಒತ್ತಡ ಎನಿಸುತ್ತಿದೆ ಮತ್ತು ಏನು ಮಾಡಬೇಕೆಂದು ತಿಳಿಯುತ್ತಿಲ್ಲ."
  };

  const handleSend = (txt?: string) => {
    const msg = txt || inputMessage;
    if (!msg.trim()) return;
    setChatLog(prev => [...prev, { sender: 'user', text: msg }]);
    setInputMessage('');

    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        {
          sender: 'zeni',
          text: 'I hear how heavy that feels right now. Take a slow, deep breath with me. You don\'t have to navigate all of this pressure alone. Tell me more about what\'s weighing on you most.'
        }
      ]);
    }, 900);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] bg-[#0a2617] text-[#fffdf5] overflow-y-auto font-sans-main scrollbar-none [&::-webkit-scrollbar]:hidden">
      <LandingNavbar
        scrollContainerRef={containerRef}
        delayReappearMs={1500}
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 bg-[#0a2617] border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#ffebc4] text-xs font-sans tracking-[0.2em] uppercase font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI COMPANION ARCHITECTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl text-white font-normal leading-[0.98] mb-6 max-w-4xl mx-auto">
            Meet Zeni: Your Private <span className="text-[#ffebc4] italic">24/7 AI Companion.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
            Attuned to adolescent emotional needs. Multi-lingual, memory-enabled, and guarded by real-time safety pipelines.
          </p>

          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-full bg-[#ffebc4] text-[#0a2617] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl cursor-pointer"
          >
            START TALKING NOW →
          </button>
        </div>
      </section>

      {/* Interactive AI Sandbox Simulator */}
      <section className="py-24 bg-[#071d13] border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#ffebc4] text-xs font-sans tracking-widest uppercase font-bold block mb-2">
              ✦ LIVE INTERACTIVE DEMO
            </span>
            <h2 className="text-3xl sm:text-5xl text-white font-normal">
              Try Zeni in 4 Regional Languages
            </h2>
          </div>

          {/* Language Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {(['hinglish', 'english', 'hindi', 'kannada'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => { setActiveTab(lang); setInputMessage(samples[lang]); }}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                  activeTab === lang
                    ? 'bg-[#ffebc4] text-[#0a2617] border-[#ffebc4]'
                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Chat Window */}
          <div className="p-6 sm:p-8 rounded-[2.5rem] bg-[#0a2617] border border-white/15 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#10b981] animate-ping" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Zeni Active Simulator</span>
              </div>
              <span className="text-xs text-[#ffebc4] font-semibold">100% Encrypted & Anonymized</span>
            </div>

            <div className="space-y-4 min-h-[220px] max-h-[350px] overflow-y-auto pr-2">
              {chatLog.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl max-w-md text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-white/15 text-white font-medium'
                      : 'bg-[#10b981]/20 border border-[#10b981]/30 text-[#ffebc4]'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex gap-3 pt-4 border-t border-white/10">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your message to Zeni..."
                className="flex-1 bg-white/5 border border-white/15 rounded-full px-6 py-3.5 text-sm text-white focus:outline-none focus:border-[#10b981]"
              />
              <button
                onClick={() => handleSend()}
                className="px-6 py-3.5 rounded-full bg-[#10b981] text-[#0a2617] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Send</span>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter
        onGetStarted={onGetStarted}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   2. SYNUS-INSPIRED THERAPY DIRECTORY OVERLAY PAGE
   ═══════════════════════════════════════════════════════ */
function TherapyPage({
  onGetStarted,
  onAdminLoginTrigger,
  onTherapistLoginTrigger,
  onCompanyLinkClick,
  onResourcesLinkClick,
  onProductLinkClick,
}: Omit<ProductPageProps, 'onClose' | 'page'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [therapists, setTherapists] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<any>('/therapists')
      .then(res => setTherapists(res.therapists || []))
      .catch(() => {});
  }, []);

  const filterOptions = ['All', 'Adolescent CBT', 'Anxiety & Stress', 'Depression Care', 'Academic Pressure'];

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] bg-[#0a2617] text-[#fffdf5] overflow-y-auto font-sans-main scrollbar-none [&::-webkit-scrollbar]:hidden">
      <LandingNavbar
        scrollContainerRef={containerRef}
        delayReappearMs={1500}
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 bg-[#0a2617] border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#ffebc4] text-xs font-sans tracking-[0.2em] uppercase font-bold mb-6">
            <UserCheck className="w-3.5 h-3.5" />
            <span>VERIFIED CLINICAL CARE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl text-white font-normal leading-[0.98] mb-6 max-w-4xl mx-auto">
            When AI Isn't Enough, <span className="text-[#ffebc4] italic">People Are There.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
            Verified licensed adolescent psychotherapists, psychiatrists, and counselors for 1-on-1 online and in-person sessions.
          </p>

          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-full bg-[#ffebc4] text-[#0a2617] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-xl cursor-pointer"
          >
            BOOK A SESSION NOW →
          </button>
        </div>
      </section>

      {/* Directory Section with Sticky Filter Bar */}
      <section className="py-24 bg-[#071d13] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Sticky Filter Bar */}
          <div className="sticky top-24 z-30 bg-[#0a2617]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/15 mb-12 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <span className="text-xs font-sans text-[#ffebc4] font-bold tracking-wider uppercase">Filter Specialization:</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelectedFilter(opt)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    selectedFilter === opt
                      ? 'bg-[#10b981] text-[#0a2617] border-[#10b981]'
                      : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {therapists.length > 0 ? (
              therapists.map((t, idx) => (
                <motion.div
                  key={t._id || idx}
                  whileHover={{ y: -8 }}
                  className="p-6 rounded-[2.5rem] bg-[#0a2617] border border-white/15 shadow-2xl flex flex-col justify-between"
                >
                  <div>
                    <div className="h-48 rounded-2xl bg-white/10 mb-6 overflow-hidden relative">
                      {t.imageUrl ? (
                        <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-[#ffebc4]">
                          {t.name ? t.name.charAt(0) : 'T'}
                        </div>
                      )}
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#10b981] text-[#0a2617] text-[10px] font-black uppercase">
                        Verified Expert
                      </span>
                    </div>

                    <h3 className="text-2xl text-white font-normal mb-1">{t.name}</h3>
                    <p className="text-xs text-[#ffebc4] font-semibold mb-4">{t.specialty || 'Psychotherapist'} • {t.experienceYears || '10+'} Yrs Exp</p>
                    <p className="text-xs text-white/70 leading-relaxed mb-6">{t.bio || 'Specializes in adolescent mental wellness, stress management, and cognitive behavioral therapy.'}</p>
                  </div>

                  <button
                    onClick={onGetStarted}
                    className="w-full py-3.5 rounded-full bg-[#ffebc4] text-[#0a2617] font-extrabold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md cursor-pointer"
                  >
                    BOOK SESSION (₹{t.sessionFee || '1,200'}) →
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 p-8 rounded-[2.5rem] bg-[#0a2617] border border-white/15">
                <h3 className="text-2xl text-white mb-2">Verified Psychotherapist Directory</h3>
                <p className="text-sm text-white/70 max-w-md mx-auto mb-6">
                  Online and offline appointment booking with licensed clinical counselors.
                </p>
                <button onClick={onGetStarted} className="px-6 py-3 rounded-full bg-[#ffebc4] text-[#0a2617] font-bold text-xs uppercase cursor-pointer">
                  Book Therapist Session →
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      <LandingFooter
        onGetStarted={onGetStarted}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   3. SYNUS-INSPIRED PRICING OVERLAY PAGE
   ═══════════════════════════════════════════════════════ */
function PricingPage({
  onGetStarted,
  onAdminLoginTrigger,
  onTherapistLoginTrigger,
  onCompanyLinkClick,
  onResourcesLinkClick,
  onProductLinkClick,
}: Omit<ProductPageProps, 'onClose' | 'page'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] bg-[#0a2617] text-[#fffdf5] overflow-y-auto font-sans-main scrollbar-none [&::-webkit-scrollbar]:hidden">
      <LandingNavbar
        scrollContainerRef={containerRef}
        delayReappearMs={1500}
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 bg-[#0a2617] border-b border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#ffebc4] text-xs font-sans tracking-[0.2em] uppercase font-bold mb-6">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>TRANSPARENT PLANS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl text-white font-normal leading-[0.98] mb-6 max-w-4xl mx-auto">
            Accessible Care. <span className="text-[#ffebc4] italic">Zero Hidden Fees.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 font-normal max-w-2xl mx-auto mb-10 leading-relaxed">
            Free forever for basic AI conversations, or upgrade for unlimited credits and human therapy discounts.
          </p>

          {/* Billing Cycle Selector */}
          <div className="inline-flex items-center p-1.5 rounded-full bg-white/10 border border-white/15">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-[#ffebc4] text-[#0a2617]' : 'text-white/70 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                billingCycle === 'annual' ? 'bg-[#ffebc4] text-[#0a2617]' : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-[#10b981] text-[#0a2617] text-[10px] font-black">20% OFF</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="py-24 bg-[#071d13] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Free Plan */}
            <div className="p-8 rounded-[2.5rem] bg-[#0a2617] border border-white/15 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans text-white/50 tracking-widest uppercase font-bold block mb-2">STARTER</span>
                <h3 className="text-3xl text-white font-normal mb-2">ZenFree</h3>
                <div className="text-4xl font-bold text-[#10b981] mb-6">₹0 <span className="text-sm font-normal text-white/50">/ forever</span></div>

                <div className="space-y-3 text-xs sm:text-sm text-white/80 mb-8">
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#10b981]" /><span>40 AI Chat Credits / month</span></div>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#10b981]" /><span>Basic Mood Logging</span></div>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#10b981]" /><span>Peer Circles (View Only)</span></div>
                </div>
              </div>

              <button onClick={onGetStarted} className="w-full py-4 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-[#0a2617] transition-all cursor-pointer">
                GET STARTED FREE
              </button>
            </div>

            {/* Pro Plan (HERO CARD) */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#0d5d3a] to-[#071d13] border-2 border-[#ffebc4] shadow-2xl flex flex-col justify-between relative">
              <span className="absolute -top-4 right-8 px-4 py-1 rounded-full bg-[#ffebc4] text-[#0a2617] text-[10px] font-black uppercase tracking-wider">
                MOST POPULAR
              </span>

              <div>
                <span className="text-xs font-sans text-[#ffebc4] tracking-widest uppercase font-bold block mb-2">RECOMMENDED</span>
                <h3 className="text-3xl text-white font-normal mb-2">ZenPro</h3>
                <div className="text-4xl font-bold text-[#ffebc4] mb-6">
                  {billingCycle === 'monthly' ? '₹299' : '₹2,799'} <span className="text-sm font-normal text-white/70">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-white mb-8">
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#ffebc4]" /><span>250 AI Chat Credits / month</span></div>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#ffebc4]" /><span>Unlimited Peer Circles</span></div>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#ffebc4]" /><span>Encrypted Sentiment Analytics</span></div>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#ffebc4]" /><span>20% Wellness Store Discount</span></div>
                </div>
              </div>

              <button onClick={onGetStarted} className="w-full py-4 rounded-full bg-[#ffebc4] text-[#0a2617] font-black text-xs uppercase tracking-wider hover:bg-white transition-all cursor-pointer shadow-lg">
                START PRO TRIAL →
              </button>
            </div>

            {/* Platinum Plan */}
            <div className="p-8 rounded-[2.5rem] bg-[#0a2617] border border-white/15 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-sans text-white/50 tracking-widest uppercase font-bold block mb-2">COMPLETE CARE</span>
                <h3 className="text-3xl text-white font-normal mb-2">ZenPlatinum</h3>
                <div className="text-4xl font-bold text-white mb-6">
                  {billingCycle === 'monthly' ? '₹999' : '₹8,999'} <span className="text-sm font-normal text-white/50">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-white/80 mb-8">
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#10b981]" /><span>2 Free Human Therapy Sessions / mo</span></div>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#10b981]" /><span>Unlimited 24/7 AI Chat</span></div>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#10b981]" /><span>Direct Therapist Messaging</span></div>
                  <div className="flex items-center gap-3"><CheckCircle size={16} className="text-[#10b981]" /><span>30% Wellness Store Discount</span></div>
                </div>
              </div>

              <button onClick={onGetStarted} className="w-full py-4 rounded-full bg-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-[#0a2617] transition-all cursor-pointer">
                CHOOSE PLATINUM
              </button>
            </div>

          </div>
        </div>
      </section>

      <LandingFooter
        onGetStarted={onGetStarted}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   4. SYNUS-INSPIRED FAQ OVERLAY PAGE
   ═══════════════════════════════════════════════════════ */
function FAQPage({
  onGetStarted,
  onAdminLoginTrigger,
  onTherapistLoginTrigger,
  onCompanyLinkClick,
  onResourcesLinkClick,
  onProductLinkClick,
}: Omit<ProductPageProps, 'onClose' | 'page'>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    apiFetch<any>('/faqs')
      .then(res => setFaqs(res.faqs || []))
      .catch(() => {
        setFaqs([
          { question: "Is my conversation with Zeni private?", answer: "Yes, 100%. All chat logs are anonymized and end-to-end encrypted. We never sell or share your personal emotional data." },
          { question: "How does Zeni handle crisis situations?", answer: "ZenMind runs an independent background safety pipeline that detects risk signals and immediately connects you with crisis help numbers and licensed human therapists." },
          { question: "What languages can I speak with Zeni in?", answer: "Zeni fluently understands and responds in English, Hindi, Hinglish, and Kannada." },
          { question: "How do I book a session with a human therapist?", answer: "Navigate to the Therapy Desk, choose a verified practitioner based on specialization, select your preferred time slot, and confirm online or offline booking." }
        ]);
      });
  }, []);

  const filteredFaqs = faqs.filter(f => 
    (f.question || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.answer || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] bg-[#0a2617] text-[#fffdf5] overflow-y-auto font-sans-main scrollbar-none [&::-webkit-scrollbar]:hidden">
      <LandingNavbar
        scrollContainerRef={containerRef}
        delayReappearMs={1500}
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-28 bg-[#0a2617] border-b border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#ffebc4] text-xs font-sans tracking-[0.2em] uppercase font-bold mb-6">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>KNOWLEDGE BASE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl text-white font-normal leading-[0.98] mb-6 max-w-4xl mx-auto">
            Frequently Asked <span className="text-[#ffebc4] italic">Questions.</span>
          </h1>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/50" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search questions about privacy, therapy, or AI..."
              className="w-full bg-white/10 border border-white/15 rounded-full pl-12 pr-6 py-4 text-sm text-white focus:outline-none focus:border-[#10b981] placeholder-white/50"
            />
          </div>
        </div>
      </section>

      {/* FAQ Accordion List */}
      <section className="py-24 bg-[#071d13] border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-4">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;

              return (
                <div key={idx} className="p-6 rounded-[2rem] bg-[#0a2617] border border-white/15 shadow-xl">
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer"
                  >
                    <span className="text-lg sm:text-xl text-white font-normal">{faq.question}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                      isOpen ? 'bg-[#ffebc4] text-[#0a2617] rotate-180' : 'bg-white/10 text-white'
                    }`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-white/10 text-sm text-white/80 leading-relaxed"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <LandingFooter
        onGetStarted={onGetStarted}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PRODUCT PAGE OVERLAY ROUTER
   ═══════════════════════════════════════════════════════ */
export default function ProductPage({
  page,
  onClose,
  onGetStarted,
  onAdminLoginTrigger,
  onTherapistLoginTrigger,
  onCompanyLinkClick,
  onResourcesLinkClick,
  onProductLinkClick,
}: ProductPageProps) {
  if (page === 'Features') {
    return (
      <FeaturesPage
        onClose={onClose}
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    );
  }

  if (page === 'AI Chatbot') {
    return (
      <AIChatbotPage
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    );
  }

  if (page === 'Therapy') {
    return (
      <TherapyPage
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    );
  }

  if (page === 'Pricing') {
    return (
      <PricingPage
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    );
  }

  if (page === 'FAQ') {
    return (
      <FAQPage
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    );
  }

  // Fallback for contact / docs pages
  return (
    <div className="fixed inset-0 z-[200] bg-[#0a2617] text-[#fffdf5] overflow-y-auto font-sans-main scrollbar-none [&::-webkit-scrollbar]:hidden">
      <LandingNavbar
        delayReappearMs={1500}
        onGetStarted={onGetStarted}
        onAdminLoginTrigger={onAdminLoginTrigger}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />

      <div className="max-w-4xl mx-auto py-40 px-6 text-center">
        <h2 className="text-4xl text-white font-normal mb-4">{page}</h2>
        <p className="text-white/70 mb-8">This page is managed by ZenMind digital health services.</p>
        <button onClick={onGetStarted} className="px-6 py-3 rounded-full bg-[#ffebc4] text-[#0a2617] font-bold text-xs uppercase">
          Back to Sanctuary →
        </button>
      </div>

      <LandingFooter
        onGetStarted={onGetStarted}
        onTherapistLoginTrigger={onTherapistLoginTrigger}
        onCompanyLinkClick={onCompanyLinkClick}
        onResourcesLinkClick={onResourcesLinkClick}
        onProductLinkClick={onProductLinkClick}
      />
    </div>
  );
}
