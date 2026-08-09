import { useEffect, useRef, useState } from 'react';
import { Sparkles, ShieldCheck, Activity } from 'lucide-react';
import logo from '../../../asset/logo.png';

interface Props {
  apiReady: boolean;      // set true when backend responds
  onComplete: () => void; // called when bar reaches 100
}

const STAGES = [
  { at: 0,  text: 'INITIALIZING SANCTUARY PIPELINE' },
  { at: 22, text: 'ESTABLISHING ENCRYPTED SESSION' },
  { at: 48, text: 'SYNCHRONIZING WELLNESS MODULES' },
  { at: 72, text: 'PREPARING CLINICAL DASHBOARD' },
  { at: 91, text: 'WELCOME TO ZENMIND' },
];

export default function LoadingScreen({ apiReady, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);
  const progressRef = useRef(0);
  const doneRef = useRef(false);

  /* Dots animation */
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 600);
    return () => clearInterval(t);
  }, []);

  /* Progress tied to apiReady */
  useEffect(() => {
    const id = setInterval(() => {
      if (doneRef.current) return;
      let p = progressRef.current;

      if (apiReady) {
        // Backend responded — race to 100
        p = Math.min(100, p + 6);
      } else {
        // Crawl towards 88 — stop and wait
        const maxWait = 88;
        const inc = p < 25 ? 2.8 : p < 55 ? 1.8 : p < 78 ? 0.9 : 0.12;
        p = Math.min(maxWait, p + inc + Math.random() * 0.4);
      }

      progressRef.current = p;
      setProgress(Math.floor(p));

      if (p >= 100 && !doneRef.current) {
        doneRef.current = true;
        clearInterval(id);
        setTimeout(onComplete, 350);
      }
    }, 180);
    return () => clearInterval(id);
  }, [apiReady, onComplete]);

  const stage = [...STAGES].reverse().find(s => progress >= s.at)?.text ?? STAGES[0].text;
  const dots = '.'.repeat((tick % 3) + 1).padEnd(3, '\u00a0');

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-between overflow-hidden select-none bg-[#071a0e] text-white font-sans"
      style={{ fontFamily: 'Google Sans, Inter, sans-serif' }}
    >
      {/* ── AMBIENT AWWWARDS GLOW ORBS ── */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#d97706]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#0d5d3a]/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Modern luxury grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #fde68a 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* ── TOP LUXURY BAR ── */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-12 pt-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e6f4ea]/10 border border-[#d97706]/40 flex items-center justify-center ring-2 ring-[#d97706]/30 shadow-md">
            <img src={logo} alt="ZenMind" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold tracking-[0.3em] uppercase text-[#d97706]">
              ZenMind Platform
            </div>
            <div className="text-sm font-extrabold tracking-wider text-white">
              DIGITAL SANCTUARY
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#fef3c7]/10 border border-[#fde68a]/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#fde68a]">
          <ShieldCheck className="w-4 h-4 text-[#d97706]" />
          <span>INITIALIZING SECURE SESSION</span>
        </div>
      </header>

      {/* ── CENTER STAGE AWWWARDS COUNTER ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        
        {/* Dynamic Center Orb & Rings */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-[#d97706]/20 animate-spin-slow" style={{ animationDuration: '20s' }} />
          <div className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-[#0d5d3a]/30" />
          <div className="absolute w-44 h-44 rounded-full bg-[#d97706]/10 blur-2xl pointer-events-none" />

          {/* Numerical Percentage */}
          <div className="relative z-10 flex items-baseline">
            <span
              className="font-extrabold leading-none tabular-nums tracking-tighter text-[#ffffff]"
              style={{
                fontSize: 'clamp(80px, 16vw, 160px)',
                textShadow: '0 0 60px rgba(217, 119, 6, 0.35)'
              }}
            >
              {String(progress).padStart(2, '0')}
            </span>
            <span className="text-2xl sm:text-4xl font-extrabold text-[#fde68a] ml-1">
              %
            </span>
          </div>
        </div>

        {/* Stage Status Pill */}
        <div className="mt-4 flex items-center gap-2.5 bg-white/5 border border-[#d97706]/30 px-5 py-2 rounded-full backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#d97706] animate-pulse" />
          <span className="text-xs font-extrabold tracking-[0.25em] text-[#fde68a] uppercase">
            {stage}{dots}
          </span>
        </div>
      </main>

      {/* ── BOTTOM PROGRESS TRACK ── */}
      <footer className="relative z-10 px-6 sm:px-12 pb-10 max-w-4xl mx-auto w-full">
        <div className="flex justify-between text-[10px] font-extrabold tracking-widest text-[#d97706]/70 mb-2 px-1">
          <span>00</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-full h-[3px] bg-[#0d5d3a]/30 rounded-full overflow-visible">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#0d5d3a] via-[#d97706] to-[#fde68a] rounded-full transition-all duration-200 ease-out shadow-[0_0_15px_#d97706]"
            style={{ width: `${progress}%` }}
          />

          {/* Glowing Head Pointer */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#fde68a] border-2 border-[#0d5d3a] transition-all duration-200 ease-out shadow-[0_0_12px_#d97706]"
            style={{ left: `calc(${progress}% - 7px)` }}
          />

          {[25, 50, 75].map(m => (
            <div
              key={m}
              className="absolute top-1/2 -translate-y-1/2 w-px h-3 bg-[#d97706]/40"
              style={{ left: `${m}%` }}
            />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-[#e6f4ea]/60 uppercase">
          <span>{apiReady ? 'SERVER ONLINE — READY' : 'CONNECTING TO BACKEND'}</span>
          <span>ZENMIND SYSTEM v2.0</span>
        </div>
      </footer>
    </div>
  );
}
