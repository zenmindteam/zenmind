import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, RotateCcw, Sparkles, ExternalLink } from 'lucide-react';
import { apiFetch } from '../api/client';
import ZenChatSidebar from './ZenChatSidebar';
import MoodCheckIn from './MoodCheckIn';

type MessageAction = 'STORY_BUTTONS' | 'POST_STORY' | 'THERAPY_BUTTON' | 'CRISIS' | null;
type Message = { role: 'user' | 'assistant'; content: string; id: string; action?: MessageAction };

let _id = 0;
const uid = () => `m_${Date.now()}_${_id++}`;

const ACTION_RE = /\[ACTION:(STORY_BUTTONS|POST_STORY|THERAPY_BUTTON|CRISIS)\]/g;

function stripActionTags(text: string): string {
  return text.replace(ACTION_RE, '').replace(/^\s+|\s+$/g, '').replace(/\n{3,}/g, '\n\n');
}

function detectAction(raw: string): MessageAction {
  const reset = new RegExp(ACTION_RE.source, 'g');
  const m = reset.exec(raw);
  return m ? (m[1] as MessageAction) : null;
}

function parseReply(raw: string): { text: string; action: MessageAction } {
  const action = detectAction(raw);
  const text = stripActionTags(raw);
  return { text, action };
}

const CRISIS_NUMBERS = [
  { name: 'iCall', number: '9152987821', tag: 'Mon–Sat, 8am–9pm' },
  { name: 'Vandrevala Foundation', number: '1860 2662 345', tag: '24/7 · Free' },
  { name: 'AASRA', number: '9820466627', tag: '24/7 · Confidential' },
  { name: 'Snehi', number: '044-24640050', tag: 'Mon–Sat, 8am–9pm' },
  { name: 'NIMHANS Helpline', number: '080-46110007', tag: 'Mon–Sat, 8am–8pm' },
];

/* ── Crisis card ───────────────────────────────────────────── */
function CrisisCard({ onGoToTherapy }: { onGoToTherapy?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mt-3 rounded-2xl overflow-hidden shadow-lg border border-rose-200/60 dark:border-rose-500/25"
    >
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-4 py-3 flex items-center gap-2.5">
        <span className="text-xl"></span>
        <div>
          <p className="text-white font-bold text-sm leading-tight">You are not alone.</p>
          <p className="text-rose-100 text-xs">Real support is just one call away.</p>
        </div>
      </div>

      <div className="bg-rose-50 dark:bg-rose-950/40 px-4 py-3 flex flex-col gap-2">
        <p className="text-[10px] text-rose-700 dark:text-rose-300 font-bold uppercase tracking-wider mb-0.5">
          India Crisis Helplines — Available Now
        </p>

        {CRISIS_NUMBERS.map(({ name, number, tag }) => (
          <a
            key={name}
            href={`tel:${number.replace(/[^0-9]/g, '')}`}
            className="flex items-center justify-between bg-white dark:bg-rose-900/30 border border-rose-200 dark:border-rose-500/20 rounded-xl px-3 py-2.5 hover:bg-rose-100 dark:hover:bg-rose-800/30 transition-colors group"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-rose-800 dark:text-rose-200 leading-tight truncate">{name}</span>
              {tag && <span className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">{tag}</span>}
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-300 group-hover:underline whitespace-nowrap ml-2">
              {number} <ExternalLink size={10} />
            </span>
          </a>
        ))}

        {onGoToTherapy && (
          <button
            onClick={onGoToTherapy}
            className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#0d5d3a] to-[#1a8a5a] text-white text-sm font-bold hover:from-[#0a4a2e] hover:to-[#0d5d3a] transition-all shadow-md shadow-[#0d5d3a]/20"
          >
             Talk to a Therapist Now
          </button>
        )}

        <p className="text-[10px] text-rose-500/70 dark:text-rose-400/50 text-center mt-0.5">
          Tap any number to call directly from your device
        </p>
      </div>
    </motion.div>
  );
}

/* ── Message bubble ────────────────────────────────────────── */
function MessageBubble({ msg, onStoryYes, onStoryNo, onFeelingGood, onConnectReal, onGoToTherapy }: {
  msg: Message;
  onStoryYes: () => void;
  onStoryNo: () => void;
  onFeelingGood: () => void;
  onConnectReal: () => void;
  onGoToTherapy: () => void;
}) {
  const isBot = msg.role === 'assistant';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${isBot ? 'bg-gradient-to-br from-[#0d5d3a] to-[#10b981] text-white' : 'bg-[#0d5d3a] dark:bg-[#1a1a1a] text-white'}`}>
        {isBot ? 'Zi' : 'U'}
      </div>
      <div className={`max-w-[75%] flex flex-col gap-1 ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={`text-[11px] font-semibold ${isBot ? 'text-[#0d5d3a] dark:text-[#10b981]' : 'text-[#4a7c5d] dark:text-gray-400'}`}>
          {isBot ? 'Zeni' : 'You'}
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">{stripActionTags(msg.content)}</div>

        {isBot && msg.action === 'STORY_BUTTONS' && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mt-1">
            <button onClick={onStoryYes}
              className="px-5 py-2 bg-[#0d5d3a] dark:bg-[#1a8a5a] text-white text-sm font-bold rounded-xl hover:bg-[#0a4a2e] transition shadow-md">
              Yes, please
            </button>
            <button onClick={onStoryNo}
              className="px-5 py-2 bg-white dark:bg-[#1a1a1a] text-[#0d5d3a] dark:text-[#10b981] text-sm font-bold rounded-xl border border-[#0d5d3a]/20 dark:border-white/10 hover:bg-[#f0fbf4] dark:hover:bg-white/5 transition">
              Not right now
            </button>
          </motion.div>
        )}

        {isBot && msg.action === 'POST_STORY' && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mt-1 flex-wrap">
            <button onClick={onFeelingGood}
              className="px-5 py-2 bg-[#0d5d3a] dark:bg-[#1a8a5a] text-white text-sm font-bold rounded-xl hover:bg-[#0a4a2e] transition shadow-md">
              Feeling good
            </button>
            <button onClick={onConnectReal}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition shadow-md">
              Connect to a real person
            </button>
          </motion.div>
        )}

        {isBot && msg.action === 'THERAPY_BUTTON' && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-1">
            <button onClick={onGoToTherapy}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#0d5d3a] to-[#1a8a5a] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:from-[#0a4a2e] transition">
               Go to Therapy Hub
            </button>
          </motion.div>
        )}

        {isBot && msg.action === 'CRISIS' && <CrisisCard onGoToTherapy={onGoToTherapy} />}
      </div>
    </motion.div>
  );
}

/* ── Main Component ────────────────────────────────────────── */
export default function ZenChat({ onNavigateToTherapy, me, onUpgradeClick }: { onNavigateToTherapy?: () => void, me?: any, onUpgradeClick?: () => void }) {
  const [messages, setMessages]       = useState<Message[]>([]);
  const [input, setInput]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const [localCredits, setLocalCredits] = useState(me?.aiCreditsRemaining ?? 0);
  useEffect(() => { setLocalCredits(me?.aiCreditsRemaining ?? 0); }, [me?.aiCreditsRemaining]);

  // Session persistence
  const [sessionId, setSessionId]     = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);

  // Mood check-in
  const [showMood, setShowMood]       = useState(false);
  const moodShownRef                  = useRef(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const checkMoodAndPrompt = useCallback(async () => {
    if (moodShownRef.current) return;
    try {
      const { checkedIn } = await apiFetch<{ checkedIn: boolean }>('/zen-progress/mood/today');
      if (!checkedIn) { setShowMood(true); moodShownRef.current = true; }
    } catch { /* silent */ }
  }, []);

  const loadSession = useCallback(async (id: string) => {
    try {
      const data = await apiFetch<{ messages: any[]; sessionId: string; title: string }>(`/zen-sessions/${id}/messages`);
      const restored: Message[] = data.messages.map((m: any) => ({
        id: uid(),
        role: m.role as 'user' | 'assistant',
        content: m.content,
        action: m.action || null,
      }));
      setMessages(restored.length ? restored : [{ role: 'assistant', id: uid(), content: GREETING }]);
      setSessionId(id);
      setInput('');
      setError(null);
    } catch { /* silent */ }
  }, []);

  const GREETING = "Hey, I'm Zeni  I'm here for you — no judgment, just support. How are you feeling today?";

  useEffect(() => {
    setMessages([{ role: 'assistant', id: uid(), content: GREETING }]);
  }, []);

  const handleSend = useCallback(async (text: string) => {
    const t = text.trim(); if (!t || loading) return;

    if (false) {
      setError('You have run out of AI Chat credits. Please upgrade your plan to continue.');
      return;
    }

    setInput(''); setError(null);
    const userMsg: Message = { role: 'user', content: t, id: uid() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      const history = [...messages, userMsg].slice(-14).map(({ role, content }) => ({ role, content }));
      const body: any = { messages: history };
      if (sessionId) body.sessionId = sessionId;

      const res = await apiFetch<{ reply: string; sessionId: string; creditsLeft?: number }>('/zen-chat', {
        method: 'POST',
        body: JSON.stringify(body),
        timeoutMs: 28000,
      });
      const { reply, sessionId: newSessionId, creditsLeft } = res;

      if (creditsLeft !== undefined && creditsLeft !== null) {
        setLocalCredits(creditsLeft);
      }

      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
        setSidebarRefresh(r => r + 1);
      }

      const { text: cleanText, action } = parseReply(reply);
      const botMsg: Message = { role: 'assistant', content: cleanText, id: uid(), action };
      setMessages(prev => [...prev, botMsg]);

      checkMoodAndPrompt();
    } catch (e: any) {
      const msg = e?.message || '';
      if (msg.includes('timed out') || msg.includes('took too long')) setError('Zeni is taking a moment. Please try again.');
      else if (msg.includes('fetch') || msg.includes('connect') || msg.includes('Failed')) setError('Could not reach Zeni. Please check your connection.');
      else setError(msg || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  }, [messages, loading, sessionId, checkMoodAndPrompt]);

  const handleStoryYes    = useCallback(() => handleSend("Yes, please tell me the story"), [handleSend]);
  const handleStoryNo     = useCallback(() => handleSend("Not right now, thanks"), [handleSend]);
  const handleFeelingGood = useCallback(async () => {
    if (sessionId) {
      apiFetch(`/zen-sessions/${sessionId}/mood`, {
        method: 'PATCH',
        body: JSON.stringify({ score: 8 }),
      }).catch(() => {});
    }
    handleSend("Feeling good now, thank you ");
  }, [handleSend, sessionId]);
  const handleConnectReal = useCallback(() => handleSend("I'd like to connect to a real person"), [handleSend]);
  const handleGoToTherapy = useCallback(() => { if (onNavigateToTherapy) onNavigateToTherapy(); }, [onNavigateToTherapy]);

  const clearChat = () => {
    setInput(''); setError(null);
    setSessionId(null);
    setMessages([{ role: 'assistant', id: uid(), content: GREETING }]);
    setSidebarRefresh(r => r + 1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex h-[calc(100vh-148px)] min-h-[560px] relative overflow-hidden">

      <AnimatePresence>
        {showMood && <MoodCheckIn onClose={() => setShowMood(false)} />}
      </AnimatePresence>

      <div className="relative flex-shrink-0 h-full">
        <ZenChatSidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(o => !o)}
          currentSessionId={sessionId}
          onSelectSession={loadSession}
          onNewChat={clearChat}
          refreshTrigger={sidebarRefresh}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 rounded-3xl border border-[#0d5d3a]/10 dark:border-white/10 bg-white dark:bg-[#111111] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#0d5d3a]/10 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
          <div className="text-xs font-bold text-[#0a2617] dark:text-gray-300">Zeni Chat</div>
          <div className="flex items-center gap-2">

            <div className="text-[10px] font-medium text-[#4a7c5d] dark:text-gray-400 bg-white dark:bg-black/20 px-2 py-0.5 rounded-md border border-[#0d5d3a]/10 dark:border-white/10 shadow-sm">{messages.length} msg{messages.length !== 1 ? 's' : ''}</div>
            <button onClick={clearChat} title="New chat" className="w-7 h-7 rounded-md flex items-center justify-center border border-[#0d5d3a]/15 dark:border-white/10 bg-white dark:bg-[#1a1a1a] text-[#4a7c5d] hover:bg-[#f0fbf4] transition">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-8">
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg}
              onStoryYes={handleStoryYes}
              onStoryNo={handleStoryNo}
              onFeelingGood={handleFeelingGood}
              onConnectReal={handleConnectReal}
              onGoToTherapy={handleGoToTherapy}
            />
          ))}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0d5d3a] to-[#10b981] flex items-center justify-center text-white text-xs font-bold">Zi</div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#f7fbf8] dark:bg-[#1a1a1a] border border-[#0d5d3a]/08">
                  <div className="flex gap-1.5 items-center h-4">
                    {[0,1,2].map(i => <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0d5d3a] dark:bg-[#10b981]" animate={{ scale: [1,1.4,1], opacity: [0.4,1,0.4] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />)}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 px-4 py-4 text-sm text-red-600 dark:text-red-400 flex flex-col items-center justify-center text-center gap-3">
                <div className="font-bold">{error}</div>

              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        <div className="flex-shrink-0 px-4 sm:px-5 pb-3 pt-1 mt-auto">
          <div className="relative flex items-center bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#0d5d3a]/15 dark:border-white/10 shadow-sm p-1">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(input); }}
              placeholder="Message Zeni..."
              className="flex-1 bg-transparent border-0 focus:ring-0 px-4 py-2 text-sm outline-none text-[#0a2617] dark:text-white"
            />
            <button id="zen-send-btn" className="zen-chat-submit flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-r from-[#0d5d3a] to-[#1a8a5a] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#0a4a2e] hover:to-[#0d5d3a] transition shadow-md" onClick={() => handleSend(input)} disabled={!input.trim() || loading} title="Send">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-500 mt-2">
            Zeni is an AI companion, not a substitute for professional therapy. In crisis? iCall: 9152987821
          </p>
        </div>
      </div>
    </motion.div>
  );
}
