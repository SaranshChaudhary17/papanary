import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, BookOpen } from 'lucide-react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const DEFAULT_CONFIG = {
  enabled: true,
  title: 'WELCOME TO PAPANARY',
  subtitle: "The Nallu Army's Official Lore Book",
  message1: "We're brand new! The dictionary is still pretty empty and we need YOUR help to fill it with all of Papa's legendary words, phrases, and lore.",
  message2: "If you know a Papanary word, suggest it! The admin will review and approve it so the whole Nallu Army can see it.",
  step1: 'Think of a word, phrase or inside joke from the Casetoo universe',
  step2: 'Click the "Suggest" button in the top nav bar (or bottom on mobile)',
  step3: 'Fill in the word and its meaning, then hit Submit!',
};

export default function WelcomePopup({ onSuggest }) {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    // Listen to popup config from Firestore
    const unsub = onSnapshot(doc(db, 'config', 'welcome_popup'), (snap) => {
      if (snap.exists()) {
        setConfig({ ...DEFAULT_CONFIG, ...snap.data() });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem('papanary_welcome_seen');
    if (!seen) {
      const t = setTimeout(() => {
        if (config.enabled) setIsOpen(true);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [config.enabled]);

  const handleClose = () => {
    sessionStorage.setItem('papanary_welcome_seen', 'true');
    setIsOpen(false);
  };

  const handleSuggest = () => {
    handleClose();
    if (onSuggest) onSuggest();
  };

  return (
    <AnimatePresence>
      {isOpen && config.enabled && (
        <motion.div
          key="welcome-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-tertiary/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            key="welcome-card"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            onClick={e => e.stopPropagation()}
            className="bg-[#FFF7D4] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-tertiary/15 relative"
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary" />

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-tertiary/40 hover:text-tertiary transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                  <BookOpen size={24} className="text-secondary" />
                </div>
                <div>
                  <h2 className="font-display font-black text-xl md:text-2xl text-tertiary leading-tight">
                    {config.title}
                  </h2>
                  <p className="text-xs text-tertiary/50 font-bold tracking-widest uppercase mt-0.5">
                    {config.subtitle}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="bg-white/60 rounded-2xl p-4 mb-5 border border-tertiary/10">
                <div className="flex gap-3 items-start mb-3">
                  <span className="text-2xl">🫙</span>
                  <p className="text-tertiary/80 text-sm leading-relaxed">{config.message1}</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-2xl">💪</span>
                  <p className="text-tertiary/80 text-sm leading-relaxed">{config.message2}</p>
                </div>
              </div>

              {/* How to guide */}
              <p className="text-xs font-bold tracking-widest uppercase text-tertiary/50 mb-3">How to suggest a word</p>
              <div className="flex flex-col gap-2 mb-6">
                {[config.step1, config.step2, config.step3].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/40 rounded-xl px-3 py-2.5 border border-tertiary/10">
                    <span className="w-6 h-6 bg-primary text-tertiary font-black text-xs rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-tertiary/70 text-sm">{text}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSuggest}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-tertiary hover:bg-tertiary hover:text-primary font-black tracking-widest uppercase text-sm px-5 py-3.5 rounded-xl transition-colors border border-transparent hover:border-tertiary shadow-sm"
                >
                  <MessageSquare size={16} />
                  Suggest a Word
                </button>
                <button
                  onClick={handleClose}
                  className="px-5 py-3.5 text-sm font-bold text-tertiary/60 hover:bg-tertiary hover:text-white rounded-xl transition-colors tracking-widest uppercase"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
