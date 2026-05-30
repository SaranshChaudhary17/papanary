import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import Typewriter from '../components/Typewriter';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AllLore() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const qWords = query(collection(db, "words"));
    const unsubWords = onSnapshot(qWords, (querySnapshot) => {
      const wordsArr = [];
      querySnapshot.forEach((doc) => {
        wordsArr.push({ id: doc.id, ...doc.data() });
      });
      // Sort words alphabetically by term
      wordsArr.sort((a, b) => a.term.localeCompare(b.term));
      setWords(wordsArr);
    });

    return () => unsubWords();
  }, []);

  const handleShare = (word) => {
    const textToShare = `**${word.term.toUpperCase()}**: ${word.meaning}\n\n- via Papanary`;
    navigator.clipboard.writeText(textToShare);
    toast.success('Meaning copied to clipboard!');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-5xl flex flex-col items-center"
    >
      <div className="w-full mb-8">
        <Link to="/dictionary" className="inline-flex items-center gap-2 text-sm font-bold text-tertiary/60 hover:text-primary transition-colors uppercase tracking-widest">
          <ArrowLeft size={16} />
          Back to Search
        </Link>
      </div>
      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-10 border-b border-secondary/30 pb-4 relative gap-2 md:gap-0">
          <div className="z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight flex items-center text-tertiary flex-wrap">
              <span className="pr-2 md:pr-0">THE</span>
              <span className="animate-papas-reveal text-primary italic whitespace-nowrap overflow-hidden inline-block align-bottom">
                <span className="pl-3">PAPA'S</span>
              </span>
              <span className="pl-3 animate-lore-color italic pr-1">LORE</span>
              <span className="animate-bible-hide relative whitespace-nowrap overflow-hidden inline-block align-bottom">
                <span className="pl-3">BIBLE</span>
                <span className="custom-strikethrough"></span>
              </span>
            </h2>
            <p className="text-tertiary/60 text-[10px] tracking-[0.3em] mt-4 uppercase">
              EVERYTHING APPROVED BY THE NALLU ARMY
            </p>
          </div>
          <div className="text-6xl md:text-7xl font-display font-black text-tertiary/5 leading-none absolute right-0 bottom-4 md:-right-4 md:-bottom-4 z-0 pointer-events-none">
            {words.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-tertiary/15 hover:border-primary/30 transition-colors group relative overflow-hidden shadow-sm">
              <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary shadow-[0_0_8px_rgba(251,191,36,0.8)] transition-all"></div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-primary font-display font-black text-xl leading-tight uppercase pr-4">
                  {word.term.split(',').map(t => t.trim()).join(' • ')}
                </h3>
                <button
                  onClick={() => handleShare(word)}
                  className="transition-colors shrink-0 text-tertiary/40 hover:text-primary mt-1"
                  title="Share / Copy"
                >
                  <Share2 size={16} />
                </button>
              </div>
              <p className="text-tertiary/60 text-sm leading-relaxed">
                {word.meaning}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
