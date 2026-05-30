import { X } from 'lucide-react';

export default function DonateModal({ isOpen, onClose }) {
  const upiId = "saranshchaudhary17@oksbi";
  const upiLink = `upi://pay?pa=${upiId}&pn=Saransh%20Chaudhary`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-tertiary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFF7D4] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-tertiary/15 animate-reveal max-h-[90vh] flex flex-col">
        <div className="p-4 md:p-6 border-b border-tertiary/15 flex justify-between items-center bg-white/40 shrink-0">
          <h2 className="text-xl md:text-2xl font-display font-black text-tertiary">MAALIK PYAAR DENGE</h2>
          <button
            onClick={onClose}
            className="text-tertiary/60 hover:text-secondary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center overflow-y-auto">
          <p className="text-tertiary/80 text-center mb-6 leading-relaxed text-sm md:text-base">
            If you enjoy the Papanary, consider buying me a coffee! Scan the QR code below using any UPI app (GPay, PhonePe, Paytm).
          </p>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-tertiary/10 mb-6">
            <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48" />
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="bg-white/50 border border-tertiary/15 rounded-xl px-4 py-3 text-center">
              <span className="text-xs text-tertiary/60 font-bold tracking-widest uppercase block mb-1">UPI ID</span>
              <p className="text-tertiary font-mono font-bold text-sm">{upiId}</p>
            </div>

            <a
              href={upiLink}
              className="w-full bg-primary hover:bg-primary/90 text-tertiary px-6 py-4 rounded-xl font-black tracking-widest flex items-center justify-center gap-2 transition-colors shadow-sm text-center"
            >
              OPEN UPI APP
            </a>

            <p className="text-[10px] text-tertiary/50 text-center uppercase tracking-widest mt-2">
              (Works on Mobile Devices)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
