import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function SuggestModal({ isOpen, onClose }) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || !meaning) return;
    
    setStatus('submitting');
    try {
      await addDoc(collection(db, "suggestions"), {
        term: word,
        meaning: meaning,
        suggestedBy: name,
        email: email,
        approved: false,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setStatus('idle');
      setWord('');
      setMeaning('');
      setName('');
      setEmail('');
      onClose();
      toast.success('Suggestion submitted successfully!');
    } catch (err) {
      console.error("Error submitting suggestion: ", err);
      setStatus('error');
      toast.error('Failed to submit suggestion.');
    }
  };

  return (
    <div className="fixed inset-0 bg-tertiary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFF7D4] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-tertiary/15 animate-reveal max-h-[90vh] flex flex-col">
        <div className="p-4 md:p-6 border-b border-tertiary/15 flex justify-between items-center bg-white/40 shrink-0">
          <h2 className="text-xl md:text-2xl font-display font-black text-tertiary">SUGGEST A WORD</h2>
        </div>
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Word</label>
              <input 
                type="text" 
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors text-base"
                required
              />
            </div>
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Meaning</label>
              <textarea 
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors min-h-[100px] resize-none text-base"
                required
              />
            </div>
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Your Name (Optional)</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors text-base"
              />
            </div>
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Your Email (Optional)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors text-base"
              />
              <p className="text-[10px] text-tertiary/50 uppercase tracking-widest mt-1 ml-2">Provide to get notified on approval</p>
            </div>
            
            <div className="flex justify-end gap-4 mt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="text-tertiary/60 hover:bg-tertiary hover:text-white px-6 py-3 rounded-xl font-bold tracking-widest uppercase text-sm transition-colors"
                disabled={status === 'submitting'}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="bg-primary text-tertiary hover:bg-tertiary hover:text-primary font-black text-sm tracking-widest uppercase px-8 py-3 rounded-xl transition-colors disabled:opacity-50 border border-transparent hover:border-tertiary"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
