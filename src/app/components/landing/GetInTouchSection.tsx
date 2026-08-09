import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowDownLeft } from "lucide-react";

export const GetInTouchSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="w-full bg-[#0a2617]">
      <section
        id="contact"
        className="relative w-full bg-[#f8fdf9] text-[#0a2617] rounded-[2.5rem] lg:rounded-[3.5rem] z-20 pt-[10px] pb-16 sm:pb-24 overflow-hidden -mt-16 sm:-mt-20 lg:-mt-24"
      >
        {/* Decorative Arrow Top Right */}
        <div className="absolute top-[10px] right-[10px] sm:right-6 lg:right-10 text-[#0a2617]">
          <ArrowDownLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 stroke-[1.5]" />
        </div>

        <div className="w-full px-6 sm:px-10 md:px-14 lg:px-16">
          {/* Top Row: Heading + Subtitle */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 sm:mb-14 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans-main text-4xl sm:text-5xl md:text-6xl lg:text-[60px] xl:text-[70px] font-normal leading-[1.05] tracking-tight text-[#0a2617] -ml-1 mt-1 max-w-2xl text-left"
            >
              Let&apos;s Make Mental Health<br />Easier to Talk About.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-xs sm:text-sm md:text-base text-[#0a2617]/80 max-w-xs md:max-w-md text-left leading-relaxed"
            >
              Whether you&apos;re a college, mental-health professional, organization, or simply curious about Zeni — we&apos;d love to hear from you.
            </motion.p>
          </div>

          {/* Form + Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Left: Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
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
                  className="w-full bg-[#0a2617]/[0.05] rounded-xl px-5 py-4 font-sans text-sm text-[#0a2617] placeholder:text-[#0a2617]/50 focus:outline-none focus:ring-1 focus:ring-[#0a2617]/20 transition-all"
                />
                <input
                  type="email"
                  placeholder="Email*"
                  required
                  className="w-full bg-[#0a2617]/[0.05] rounded-xl px-5 py-4 font-sans text-sm text-[#0a2617] placeholder:text-[#0a2617]/50 focus:outline-none focus:ring-1 focus:ring-[#0a2617]/20 transition-all"
                />
                <textarea
                  placeholder="Message"
                  rows={5}
                  className="w-full bg-[#0a2617]/[0.05] rounded-xl px-5 py-4 font-sans text-sm text-[#0a2617] placeholder:text-[#0a2617]/50 focus:outline-none focus:ring-1 focus:ring-[#0a2617]/20 transition-all min-h-[140px] md:min-h-[180px] resize-y"
                />
                <button
                  type="submit"
                  className="mt-2 w-full bg-[#0a2617] text-[#fffdf5] font-sans text-xs sm:text-sm tracking-[0.15em] uppercase font-bold py-4 rounded-xl hover:bg-[#3a2e27] transition-colors duration-300 border-0 cursor-pointer"
                >
                  {submitted ? "Message Sent! ✓" : "Start a Conversation →"}
                </button>
              </form>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
