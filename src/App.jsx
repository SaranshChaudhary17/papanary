import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import AllLore from './pages/AllLore';
import Info from './pages/Info';
import SuggestModal from './components/SuggestModal';
import DonateModal from './components/DonateModal';
import WelcomePopup from './components/WelcomePopup';
import { useState } from 'react';
import { MessageSquare, Heart, Menu, X } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

function AppContent() {
  const location = useLocation();
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';
  const isDictionary = location.pathname === '/dictionary';

  return (
    <div className="min-h-screen flex flex-col font-mono text-tertiary bg-[#FFF7D4] selection:bg-primary/30">
      {!isLanding && (
        <header className="flex flex-row justify-between items-center p-4 md:p-6 bg-white/80 backdrop-blur border-b border-tertiary/15 sticky top-0 z-50">
          {/* Mobile Hamburger */}
          <button 
            className="md:hidden p-2 -ml-2 text-tertiary hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Left Links */}
          <div className="hidden md:flex gap-6 text-sm text-tertiary/60 font-bold tracking-widest uppercase">
            <Link to="/all-lore" className="hover:text-primary transition-colors">All Lore</Link>
            <Link to="/info" className="hover:text-primary transition-colors">Info</Link>
          </div>

          <Link to="/dictionary" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-primary font-display font-black text-2xl tracking-widest drop-shadow-sm">
              PAPANARY
            </h1>
          </Link>

          {/* Desktop Right Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 md:px-4 text-xs md:text-sm text-tertiary font-bold hover:bg-tertiary hover:text-white rounded-lg transition-colors"
            >
              <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
              Suggest
            </button>
            <button
              onClick={() => setIsDonateOpen(true)}
              className="flex items-center gap-2 px-3 py-2 md:px-4 bg-primary text-tertiary hover:bg-tertiary hover:text-primary font-bold rounded-lg transition-colors border border-tertiary/15 shadow-sm text-xs md:text-sm"
            >
              💋 Gili Pucchi
            </button>
          </div>

          {/* Mobile Spacer to keep logo centered */}
          <div className="md:hidden w-8"></div>
        </header>
      )}

      {/* Mobile Side Menu */}
      {!isLanding && isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[65px] bg-[#FFF7D4] z-40 flex flex-col p-6 animate-reveal">
            <Link to="/all-lore" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-tertiary py-4 border-b border-tertiary/10 text-center">All Lore</Link>
            <Link to="/info" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-tertiary py-4 border-b border-tertiary/10 text-center">Info</Link>
          </div>
        )}

      <main className={`flex-1 flex flex-col items-center w-full ${!isLanding ? 'pt-8 md:pt-20 px-4' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/dictionary" element={<Home />} />
            <Route path="/all-lore" element={<AllLore />} />
            <Route path="/info" element={<Info />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isLanding && (
        <footer className="py-6 md:py-8 text-center text-[10px] md:text-xs text-tertiary/60 font-mono tracking-[0.2em] border-t border-tertiary/15 mt-auto bg-white/40 backdrop-blur w-full">
          PAPANARY © 2026 | BUILT FOR THE NALLU ARMY
        </footer>
      )}

        <SuggestModal
          isOpen={isSuggestModalOpen}
          onClose={() => setIsSuggestModalOpen(false)}
        />

        <DonateModal
          isOpen={isDonateOpen}
          onClose={() => setIsDonateOpen(false)}
        />

      {/* Mobile Floating Action Buttons (Bottom) */}
      {!isLanding && (
        <div className="md:hidden fixed bottom-6 left-0 right-0 px-6 flex justify-between items-center z-50 pointer-events-none">
          <button
            onClick={() => setIsSuggestModalOpen(true)}
            className="w-14 h-14 bg-white border border-tertiary/15 rounded-full shadow-2xl flex items-center justify-center text-tertiary hover:bg-tertiary hover:text-white transition-colors pointer-events-auto"
            title="Suggest a Word"
          >
            <MessageSquare size={24} />
          </button>
          
          <button
            onClick={() => setIsDonateOpen(true)}
            className="w-14 h-14 bg-primary border border-tertiary/15 rounded-full shadow-2xl flex items-center justify-center text-tertiary text-2xl hover:bg-tertiary hover:text-primary transition-colors pointer-events-auto"
            title="Gili Pucchi"
          >
            💋
          </button>
        </div>
      )}

        <Toaster position="top-center" />

        {isDictionary && (
          <WelcomePopup onSuggest={() => setIsSuggestModalOpen(true)} />
        )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
