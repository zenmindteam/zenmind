import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Briefcase, ChevronRight, Search, Star, Send, Upload, CheckCircle, Sparkles, Building2 } from 'lucide-react';
import { apiFetch } from '../api/client';
import { Navbar as LandingNavbar } from './landing/Navbar';
import { Footer as LandingFooter } from './landing/Footer';

interface CareersPageProps {
  onClose: () => void;
  onGetStarted?: () => void;
  onAdminLoginTrigger?: () => void;
  onTherapistLoginTrigger?: () => void;
  onCompanyLinkClick?: (link: string) => void;
  onResourcesLinkClick?: (link: string) => void;
  onProductLinkClick?: (link: string) => void;
}

export default function CareersPage({
  onClose,
  onGetStarted,
  onAdminLoginTrigger,
  onTherapistLoginTrigger,
  onCompanyLinkClick,
  onResourcesLinkClick,
  onProductLinkClick,
}: CareersPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', portfolio: '', coverLetter: '' });

  useEffect(() => {
    apiFetch<any>('/jobs')
      .then(r => setJobs(r.jobs || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const depts = ['All', ...Array.from(new Set(jobs.map(j => j.department).filter(Boolean)))];
  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchQ = !q || j.title?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q) || j.department?.toLowerCase().includes(q);
    const matchF = filter === 'All' || j.department === filter;
    return matchQ && matchF;
  });

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedJob(null);
      setFormData({ name: '', email: '', phone: '', portfolio: '', coverLetter: '' });
    }, 4000);
  };

  return (
    <div
      ref={containerRef}
      data-lenis-prevent
      className="fixed inset-0 z-[200] bg-[#f8fdf9] text-[#0a2617] overflow-y-auto font-sans-main scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
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
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-20 bg-[#0a2617] text-center text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#ffebc4] text-xs font-sans tracking-[0.2em] uppercase font-bold mb-6">
            <Briefcase className="w-3.5 h-3.5" />
            <span>JOIN THE ZENMIND TEAM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.98] mb-6 max-w-4xl mx-auto" style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}>
            Build the Future of <span className="text-[#ffebc4] italic font-normal">Adolescent Healthcare.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/80 font-normal max-w-2xl mx-auto leading-relaxed">
            Join engineers, designers, psychotherapists, and clinical researchers in making mental wellness accessible to every student in India.
          </p>
        </div>
      </section>

      {/* Careers Content */}
      <section className="py-20 bg-[#f8fdf9] min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-[#0d5d3a]/15 shadow-xl mb-12 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0d5d3a]/60" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search roles or locations..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-[#0d5d3a]/15 bg-[#f4faf7] text-sm text-[#0a2617] outline-none focus:border-[#d97706]"
              />
            </div>

            <div className="flex gap-2 flex-wrap w-full sm:w-auto">
              {depts.map(d => (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    filter === d
                      ? 'bg-[#0d5d3a] text-white border-[#0d5d3a]'
                      : 'bg-[#f4faf7] text-[#0a2617]/70 border-[#0d5d3a]/15 hover:bg-[#0d5d3a]/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Job List */}
          {loading ? (
            <div className="text-center py-16 text-[#0d5d3a] font-bold">Loading open positions...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-[#0d5d3a]/15 p-8">
              <h3 className="text-2xl font-bold text-[#0a2617] mb-2">No Open Roles in this Department</h3>
              <p className="text-sm text-[#0a2617]/70 max-w-md mx-auto mb-6">Send us a general application — we are always looking for passionate builders and clinicians!</p>
              <button
                onClick={() => onResourcesLinkClick?.('Contact Us')}
                className="px-6 py-3 rounded-full bg-[#0d5d3a] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#084229]"
              >
                Send Open Application →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((job) => (
                <div
                  key={job._id || job.title}
                  className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#0d5d3a]/15 shadow-xl flex flex-col justify-between hover:border-[#d97706] transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3.5 py-1 rounded-full bg-[#0d5d3a]/10 text-[#0d5d3a] text-xs font-bold uppercase tracking-wider">
                        {job.department || 'General'}
                      </span>
                      <span className="text-xs font-bold text-[#d97706]">{job.type || 'Full-time'}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-[#0a2617] mb-2">{job.title}</h3>
                    <p className="text-xs text-[#0a2617]/60 flex items-center gap-2 mb-4">
                      <MapPin size={14} className="text-[#0d5d3a]" />
                      <span>{job.location || 'Chikodi, Karnataka / Remote'}</span>
                    </p>

                    <p className="text-sm text-[#0a2617]/80 leading-relaxed mb-6">
                      {job.description || 'Help build scalable mental health tools and infrastructure for adolescent care.'}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="w-full py-3.5 rounded-full bg-[#0d5d3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#084229] transition-all cursor-pointer shadow-md"
                  >
                    View Role & Apply →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Drawer Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md p-6 flex items-center justify-center overflow-y-auto"
          >
            <div className="w-full max-w-2xl bg-white border-2 border-[#0d5d3a]/20 rounded-[2.5rem] p-8 overflow-y-auto relative shadow-2xl text-[#0a2617]">
              <div className="flex items-center justify-between pb-6 border-b border-[#0d5d3a]/15 mb-6">
                <div>
                  <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider">{selectedJob.department}</span>
                  <h3 className="text-2xl font-bold text-[#0d5d3a]">{selectedJob.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-full bg-[#0d5d3a]/10 text-[#0d5d3a] text-xs font-bold uppercase hover:bg-[#0d5d3a] hover:text-white transition-all cursor-pointer"
                >
                  Close ✕
                </button>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <CheckCircle size={48} className="text-[#10b981] mx-auto" />
                  <h4 className="text-2xl font-bold text-[#0d5d3a]">Application Submitted!</h4>
                  <p className="text-sm text-[#0a2617]/70 max-w-md mx-auto">Our talent team will review your portfolio and reach out within 3 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Full Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Aarav Sharma"
                      className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3 font-sans text-sm font-semibold border-2 border-[#0d5d3a]/15 outline-none focus:border-[#d97706]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Email*</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="aarav@example.com"
                        className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3 font-sans text-sm font-semibold border-2 border-[#0d5d3a]/15 outline-none focus:border-[#d97706]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Mobile Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3 font-sans text-sm font-semibold border-2 border-[#0d5d3a]/15 outline-none focus:border-[#d97706]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Portfolio / GitHub / Resume Link*</label>
                    <input
                      type="url"
                      required
                      value={formData.portfolio}
                      onChange={e => setFormData({ ...formData, portfolio: e.target.value })}
                      placeholder="https://github.com/username or LinkedIn"
                      className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3 font-sans text-sm font-semibold border-2 border-[#0d5d3a]/15 outline-none focus:border-[#d97706]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0d5d3a] mb-1 uppercase tracking-wider">Why do you want to join ZenMind?*</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.coverLetter}
                      onChange={e => setFormData({ ...formData, coverLetter: e.target.value })}
                      placeholder="Tell us about your background and passion for mental healthcare..."
                      className="w-full bg-[#f4faf7] rounded-2xl px-5 py-3 font-sans text-sm font-semibold border-2 border-[#0d5d3a]/15 outline-none focus:border-[#d97706] resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#0d5d3a] hover:bg-[#084229] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg mt-2"
                  >
                    Submit Application →
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#0a2617]">
        <LandingFooter
          onGetStarted={onGetStarted}
          onTherapistLoginTrigger={onTherapistLoginTrigger}
          onCompanyLinkClick={onCompanyLinkClick}
          onResourcesLinkClick={onResourcesLinkClick}
          onProductLinkClick={onProductLinkClick}
        />
      </div>
    </div>
  );
}
