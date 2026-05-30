import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessageDeveloperModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message || (!email && !phone)) return;
    
    setStatus('submitting');
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        phone,
        message,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
      setStatus('idle');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      onClose();
      toast.success('Message sent successfully!');
    } catch (err) {
      console.error("Error submitting message: ", err);
      setStatus('error');
      toast.error('Failed to send message.');
    }
  };

  return (
    <div className="fixed inset-0 bg-tertiary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFF7D4] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-tertiary/15 animate-reveal max-h-[90vh] flex flex-col">
        <div className="p-4 md:p-6 border-b border-tertiary/15 flex justify-between items-center bg-white/40 shrink-0">
          <h2 className="text-xl md:text-2xl font-display font-black text-tertiary">MESSAGE DEV</h2>
          <button onClick={onClose} className="text-tertiary/60 hover:text-secondary transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Name</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors text-base"
              />
            </div>
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Email</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors text-base"
              />
            </div>
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Phone (WhatsApp)</label>
              <input 
                type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91..."
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors text-base"
              />
            </div>
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Message</label>
              <textarea 
                value={message} onChange={(e) => setMessage(e.target.value)} required
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors min-h-[100px] resize-none text-base"
              />
            </div>
            
            <div className="flex justify-end gap-4 mt-4">
              <button type="submit" disabled={status === 'submitting'} className="bg-primary text-tertiary hover:bg-tertiary hover:text-primary font-black text-sm tracking-widest uppercase px-8 py-3 rounded-xl transition-colors disabled:opacity-50 border border-transparent hover:border-tertiary">
                {status === 'submitting' ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
