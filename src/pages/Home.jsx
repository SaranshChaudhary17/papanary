import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, Share2 } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const DUMMY_WORDS = [];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState([]);

  const [papaProps, setPapaProps] = useState({ visible: false, x: 50, y: 50, rotate: 0, scale: 1 });
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const qWords = query(collection(db, "words"));
    const unsubWords = onSnapshot(qWords, (querySnapshot) => {
      const wordsArr = [];
      querySnapshot.forEach((doc) => {
        wordsArr.push({ id: doc.id, ...doc.data() });
      });
      setWords(wordsArr);
    });

    return () => unsubWords();
  }, []);

  const filteredWords = words.filter(w => {
    const terms = w.term.split(',').map(t => t.trim().toLowerCase());
    const search = searchTerm.toLowerCase().trim();
    return terms.some(t => t.includes(search));
  });

  const getMatchedTerm = (termStr, search) => {
    const terms = termStr.split(',').map(t => t.trim());
    if (!search) return terms[0];
    const match = terms.find(t => t.toLowerCase().includes(search.toLowerCase()));
    return match || terms[0];
  };

  const speakHindi = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShare = (word) => {
    const term = getMatchedTerm(word.term, searchTerm.trim());
    const textToShare = `**${term.toUpperCase()}**: ${word.meaning}\n\n- via Papanary`;
    navigator.clipboard.writeText(textToShare);
    toast.success('Meaning copied to clipboard!');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    // Trigger Papa Image effect
    if (e.target.value.trim().length > 0) {
      const newX = Math.random() * 80 + 10; // 10vw to 90vw
      const newY = Math.random() * 80 + 10; // 10vh to 90vh
      const newRotate = (Math.random() - 0.5) * 60; // -30 to 30 degrees
      const newScale = Math.random() * 0.7 + 0.8; // 0.8 to 1.5 scale

      setPapaProps({
        visible: true,
        x: newX,
        y: newY,
        rotate: newRotate,
        scale: newScale
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setPapaProps(prev => ({ ...prev, visible: false }));
      }, 400);
    } else {
      setPapaProps(prev => ({ ...prev, visible: false }));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-5xl flex flex-col items-center relative"
    >
      {/* Papa Image Overlay */}
      {papaProps.visible && (
        <img
          src="/papa.png"
          alt=""
          className="fixed pointer-events-none z-[9999] drop-shadow-2xl transition-all duration-75 ease-out"
          style={{
            left: `${papaProps.x}vw`,
            top: `${papaProps.y}vh`,
            transform: `translate(-50%, -50%) rotate(${papaProps.rotate}deg) scale(${papaProps.scale})`,
            width: '200px', // Adjust base size as needed
            height: 'auto'
          }}
        />
      )}

      <div className="text-center mb-8 md:mb-16 relative w-full">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-tertiary tracking-tight mb-2 md:mb-4 text-glow px-2">
          PAPANARY
        </h1>
        <p className="text-tertiary/60 font-display italic text-base md:text-lg opacity-80">
          "Baap Baap hota h !!!!"
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white/40 backdrop-blur rounded-2xl p-0 flex flex-col md:flex-row border border-tertiary/15 shadow-2xl mb-12 md:mb-24 overflow-hidden md:min-h-[300px]">
        <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-tertiary/15 flex flex-col">
          <h3 className="text-primary font-black tracking-[0.2em] text-xs mb-4">PAPALANG</h3>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search lore (e.g. Nalla)..."
              className="w-full bg-transparent outline-none text-2xl font-bold placeholder:text-tertiary/20"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 p-6 flex flex-col bg-tertiary/5 relative overflow-y-auto max-h-[400px] md:max-h-[300px] min-h-[250px]">
          <h3 className="text-tertiary/60 font-black tracking-[0.2em] text-xs absolute top-6 left-6 z-10">SAMJHA NALLE</h3>
          <div className="w-full flex-1 flex flex-col justify-center mt-6">
            {searchTerm.trim() === '' ? (
              <div className="text-tertiary/40 font-bold italic text-lg tracking-widest text-center">
                Input de Nalle...
              </div>
            ) : searchTerm.trim().length < 3 ? (
              <div className="text-tertiary/60 font-bold italic text-sm tracking-widest text-center">
                Type at least 3 letters...
              </div>
            ) : filteredWords.length > 0 ? (
              <div className="flex flex-col gap-6 pb-4 w-full">
                {filteredWords.map((word, idx) => (
                  <div key={word.term} className="animate-reveal relative" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-primary font-black text-sm pr-4">
                        {getMatchedTerm(word.term, searchTerm.trim()).toUpperCase()}
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShare(word)}
                          className="transition-colors shrink-0 text-tertiary/40 hover:text-primary"
                          title="Share / Copy"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => speakHindi(word.meaning)}
                          className="transition-colors shrink-0 text-tertiary/40 hover:text-secondary"
                          title="Listen in Hindi"
                        >
                          <Volume2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-tertiary text-base leading-relaxed">
                      {word.meaning}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-tertiary/60 text-sm text-center mt-12">
                Ye lore abhi database mein nahi hai. Suggest kar do!
              </div>
            )}
          </div>
        </div>
      </div>


    </motion.div>
  );
}
