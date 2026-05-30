import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Play, Camera, MessageSquare } from 'lucide-react';
import MessageDeveloperModal from '../components/MessageDeveloperModal';
import { motion } from 'framer-motion';

export default function Info() {
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-5xl flex flex-col items-center relative"
    >
      <div className="w-full mb-8">
        <Link to="/dictionary" className="inline-flex items-center gap-2 text-sm font-bold text-tertiary/60 hover:text-primary transition-colors uppercase tracking-widest">
          <ArrowLeft size={16} />
          Back to Search
        </Link>
      </div>

      <div className="w-full bg-white/40 p-6 md:p-8 rounded-3xl border border-tertiary/15 shadow-sm text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-display font-black text-tertiary mb-4 md:mb-6">ABOUT PAPANARY</h2>
        <p className="text-tertiary/80 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
          This is the official lore dictionary for the NALLU Army. We document every legendary word, meme, and inside joke that makes up the Casetoo universe.
        </p>
        <p className="text-tertiary/80 leading-relaxed">
          If you know a term that isn't listed here, use the Suggest button at the top to submit it. Our admins will review and add it to the sacred lore!
        </p>
      </div>

      <div className="w-full bg-white/40 p-6 md:p-8 rounded-3xl border border-tertiary/15 shadow-sm text-center mb-8">
        <h3 className="text-xs md:text-sm font-black tracking-[0.2em] text-secondary mb-2">OFFICIAL CHANNELS</h3>
        <h2 className="text-3xl md:text-4xl font-display font-black text-tertiary mb-6">Big Daddy's Link</h2>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-2">
          <a
            href="https://www.youtube.com/@thecasetoopapa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#ff0000] text-white hover:bg-white hover:text-[#ff0000] font-black tracking-widest uppercase px-4 md:px-6 py-3 rounded-xl transition-colors shadow-sm text-xs md:text-sm border border-transparent hover:border-[#ff0000]"
          >
            <Play size={18} /> THE CASETOO
          </a>
          <a
            href="https://www.youtube.com/@casetooop"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#ff0000] text-white hover:bg-white hover:text-[#ff0000] font-black tracking-widest uppercase px-4 md:px-6 py-3 rounded-xl transition-colors shadow-sm text-xs md:text-sm border border-transparent hover:border-[#ff0000]"
          >
            <Play size={18} /> CASETOO
          </a>
          <a
            href="https://www.youtube.com/@Casetoolive"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#ff0000] text-white hover:bg-white hover:text-[#ff0000] font-black tracking-widest uppercase px-4 md:px-6 py-3 rounded-xl transition-colors shadow-sm text-xs md:text-sm border border-transparent hover:border-[#ff0000]"
          >
            <Play size={18} /> CASETOO IS LIVE
          </a>
          <a
            href="https://www.youtube.com/@casetooclips"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#ff0000] text-white hover:bg-white hover:text-[#ff0000] font-black tracking-widest uppercase px-4 md:px-6 py-3 rounded-xl transition-colors shadow-sm text-xs md:text-sm border border-transparent hover:border-[#ff0000]"
          >
            <Play size={18} /> CASETOO CLIPS
          </a>
          <a
            href="https://www.instagram.com/casetooyt/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white hover:from-white hover:via-white hover:to-white hover:text-[#fd1d1d] font-black tracking-widest uppercase px-4 md:px-6 py-3 rounded-xl transition-all shadow-sm text-xs md:text-sm border border-transparent hover:border-[#fd1d1d]"
          >
            <Camera size={18} /> INSTAGRAM
          </a>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-tertiary/5 p-6 md:p-8 rounded-3xl border border-tertiary/15 shadow-sm text-center mt-4">
        <h3 className="text-xs md:text-sm font-black tracking-[0.2em] text-secondary mb-2">DEVELOPED BY</h3>
        <h2 className="text-2xl md:text-3xl font-display font-black text-tertiary mb-6">Saransh Chaudhary</h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
          <button
            onClick={() => setIsMessageOpen(true)}
            className="flex items-center justify-center gap-2 bg-secondary text-white hover:bg-white hover:text-secondary font-black tracking-widest uppercase px-6 py-3 rounded-xl transition-colors shadow-sm border border-transparent hover:border-secondary"
          >
            <MessageSquare size={18} /> Message
          </button>
          <a
            href="https://saranshchaudhary.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-primary text-tertiary hover:bg-tertiary hover:text-primary font-black tracking-widest uppercase px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            Maalpaani
          </a>
          <a
            href="https://instagram.com/saranshchaudhary.17"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-tertiary text-white hover:bg-white hover:text-tertiary font-black tracking-widest uppercase px-6 py-3 rounded-xl transition-colors shadow-sm border border-transparent hover:border-tertiary"
          >
            Instagram
          </a>
        </div>
      </div>

      <MessageDeveloperModal
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
      />
    </motion.div>
  );
}
