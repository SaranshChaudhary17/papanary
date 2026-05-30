import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WORDS = [
  { text: "WELCOME", gradient: "text-gradient-1", from: "left" },
  { text: "THE", gradient: "text-gradient-3", from: "right" },
  { text: "BACK", gradient: "text-gradient-2", from: "top" },
  { text: "BACK", gradient: "text-gradient-3", from: "left" },
  { text: "THE", gradient: "text-gradient-2", from: "right" },
  { text: "WELCOM", gradient: "text-gradient-1", from: "top" },
];

const WORD_DURATION = 160; // ms per word

function getEntryVariants(from) {
  const origins = {
    left: { x: -120, y: 0, skewX: -12, skewY: 0 },
    right: { x: 120, y: 0, skewX: 12, skewY: 0 },
    top: { x: 0, y: -80, skewX: 0, skewY: 0 },
    bottom: { x: 0, y: 80, skewX: 0, skewY: 0 },
  };
  const o = origins[from];
  return {
    hidden: {
      opacity: 0,
      x: o.x,
      y: o.y,
      scale: 1.6,
      skewX: o.skewX,
      filter: "blur(20px) brightness(3)",
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      skewX: 0,
      filter: "blur(0px) brightness(1)",
      transition: {
        duration: 0.06,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      filter: "blur(8px) brightness(0.5)",
      transition: { duration: 0.05, ease: "easeIn" },
    },
  };
}

// Glitch flash overlay
const flashVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: [0, 0.8, 0],
    transition: { duration: 0.05, ease: "easeOut" },
  },
};

export default function Landing() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('words'); // 'words' | 'all' | 'done'
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (phase !== 'words') return;

    const advance = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 150);

      setCurrentIdx(prev => {
        const next = prev + 1;
        if (next >= WORDS.length) {
          setTimeout(() => setPhase('all'), 80);
          return prev;
        }
        return next;
      });
    };

    const timer = setTimeout(advance, WORD_DURATION);
    return () => clearTimeout(timer);
  }, [currentIdx, phase]);

  useEffect(() => {
    if (phase === 'all') {
      const t = setTimeout(() => setPhase('done'), 600);
      return () => clearTimeout(t);
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Video BG */}
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-[-2]">
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      {/* Light overlay */}
      <div className="absolute inset-0 bg-[#FFF7D4]/88 z-[-1]" />

      {/* Glitch flash on word change */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            className="absolute inset-0 bg-primary z-10 pointer-events-none"
            variants={flashVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
          />
        )}
      </AnimatePresence>

      {/* === PHASE: single word at a time === */}
      {phase === 'words' && (
        <div className="flex items-center justify-center w-full h-full px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              variants={getEntryVariants(WORDS[currentIdx].from)}
              initial="hidden"
              animate="show"
              exit="exit"
              className="text-center"
            >
              {/* Chromatic aberration layers */}
              <span
                className={`block text-[clamp(4rem,15vw,11rem)] font-display font-black tracking-tighter leading-none select-none pointer-events-none absolute opacity-30 blur-[2px] ${WORDS[currentIdx].gradient}`}
                style={{ transform: 'translate(-3px, 0)', mixBlendMode: 'multiply', color: '#ff0040', WebkitTextFillColor: '#ff0040' }}
                aria-hidden
              >
                {WORDS[currentIdx].text}
              </span>
              <span
                className={`block text-[clamp(4rem,15vw,11rem)] font-display font-black tracking-tighter leading-none select-none pointer-events-none absolute opacity-20 blur-[2px]`}
                style={{ transform: 'translate(3px, 0)', mixBlendMode: 'multiply', color: '#0040ff', WebkitTextFillColor: '#0040ff' }}
                aria-hidden
              >
                {WORDS[currentIdx].text}
              </span>
              {/* Main text */}
              <span className={`relative block text-[clamp(4rem,15vw,11rem)] font-display font-black tracking-tighter leading-none ${WORDS[currentIdx].gradient}`}>
                {WORDS[currentIdx].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* === PHASE: all words together === */}
      {(phase === 'all' || phase === 'done') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2 md:gap-3 px-4 py-8 text-center"
        >
          {WORDS.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, x: w.from === 'left' ? -40 : w.from === 'right' ? 40 : 0, y: w.from === 'top' ? -20 : w.from === 'bottom' ? 20 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: i * 0.025, duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`block text-[clamp(2.2rem,8vw,6rem)] font-display font-black tracking-tighter leading-none ${w.gradient}`}
            >
              {w.text}
            </motion.span>
          ))}
        </motion.div>
      )}

      {/* Proceed button */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.button
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate('/dictionary')}
            className="absolute bottom-12 md:bottom-20 bg-primary text-tertiary hover:bg-tertiary hover:text-primary font-black tracking-[0.2em] uppercase px-10 py-4 md:px-14 md:py-5 rounded-2xl text-sm md:text-lg transition-colors shadow-2xl border border-transparent hover:border-tertiary"
          >
            PROCEED TO PAPANARY
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
