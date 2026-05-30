import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('submitting');
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        read: false,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setStatus('idle');
      setName('');
      setEmail('');
      setMessage('');
      toast.success('Message sent successfully! DADDY will look into it.');
    } catch (err) {
      console.error("Error submitting message: ", err);
      setStatus('error');
      toast.error('Failed to send message.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-2xl flex flex-col items-center"
    >
      <h1 className="text-4xl font-display font-black text-primary tracking-tight mb-8">
        CONTACT DADDY
      </h1>

      <div className="w-full bg-white p-8 rounded-2xl border border-tertiary/15 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="text-xs text-tertiary/60 mb-2 ml-2 font-bold tracking-widest uppercase block">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors text-base"
                required
              />
            </div>
            <div>
              <label className="text-xs text-tertiary/60 mb-2 ml-2 font-bold tracking-widest uppercase block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors text-base"
                required
              />
            </div>
            <div>
              <label className="text-xs text-tertiary/60 mb-2 ml-2 font-bold tracking-widest uppercase block">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors min-h-[150px] resize-none text-base"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="bg-primary text-tertiary hover:bg-tertiary hover:text-primary font-black text-sm tracking-widest uppercase px-8 py-4 rounded-xl transition-colors mt-2 disabled:opacity-50 border border-transparent hover:border-tertiary"
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
    </motion.div>
  );
}
