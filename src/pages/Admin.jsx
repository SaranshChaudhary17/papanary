import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('adminAuth') === 'true'
  );
  
  const [activeTab, setActiveTab] = useState('suggestions');
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');

  const [allWords, setAllWords] = useState([]);
  const [editingWord, setEditingWord] = useState(null);
  const [editTerm, setEditTerm] = useState('');
  const [editMeaning, setEditMeaning] = useState('');

  // Popup config
  const [popupConfig, setPopupConfig] = useState({
    enabled: true,
    title: 'WELCOME TO PAPANARY',
    subtitle: "The Nallu Army's Official Lore Book",
    message1: "We're brand new! The dictionary is still pretty empty and we need YOUR help to fill it with all of Papa's legendary words, phrases, and lore.",
    message2: "If you know a Papanary word, suggest it! The admin will review and approve it so the whole Nallu Army can see it.",
    step1: 'Think of a word, phrase or inside joke from the Casetoo universe',
    step2: 'Click the "Suggest" button in the top nav bar (or bottom on mobile)',
    step3: 'Fill in the word and its meaning, then hit Submit!',
  });
  const [popupSaving, setPopupSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Fetch words
    const qWords = query(collection(db, "words"));
    const unsubWords = onSnapshot(qWords, (querySnapshot) => {
      const wordsArr = [];
      querySnapshot.forEach((doc) => {
        wordsArr.push({ id: doc.id, ...doc.data() });
      });
      wordsArr.sort((a, b) => a.term.localeCompare(b.term));
      setAllWords(wordsArr);
    });

    // Fetch popup config
    const unsubPopup = onSnapshot(doc(db, 'config', 'welcome_popup'), (snap) => {
      if (snap.exists()) {
        setPopupConfig(prev => ({ ...prev, ...snap.data() }));
      }
    });

    return () => {
      unsubWords();
      unsubPopup();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Fetch suggestions
    const qSugs = query(collection(db, "suggestions"));
    const unsubSugs = onSnapshot(qSugs, (querySnapshot) => {
      const sugs = [];
      querySnapshot.forEach((doc) => {
        sugs.push({ id: doc.id, ...doc.data() });
      });
      setSuggestions(sugs);
    });

    // Fetch messages
    const qMsgs = query(collection(db, "messages"));
    const unsubMsgs = onSnapshot(qMsgs, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    });
    
    return () => {
      unsubSugs();
      unsubMsgs();
    };
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Jaat@9412') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      toast.success('Logged in successfully');
    } else {
      toast.error('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  const handleAddWordManually = async (e) => {
    e.preventDefault();
    if (!newWord || !newMeaning) return;
    
    try {
      await addDoc(collection(db, "words"), {
        term: newWord,
        meaning: newMeaning,
        createdAt: serverTimestamp()
      });
      setNewWord('');
      setNewMeaning('');
      toast.success('Word added to global dictionary!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add word');
    }
  };

  const handleApprove = async (suggestion) => {
    try {
      // Add to global dictionary
      await addDoc(collection(db, "words"), {
        term: suggestion.term,
        meaning: suggestion.meaning,
        createdAt: serverTimestamp()
      });
      // Remove from suggestions
      await deleteDoc(doc(db, "suggestions", suggestion.id));
      toast.success('Suggestion approved & added!');
    } catch (error) {
      console.error("Error approving document: ", error);
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await deleteDoc(doc(db, "suggestions", id));
      toast.success('Suggestion rejected');
    } catch (error) {
      console.error("Error rejecting document: ", error);
      toast.error('Failed to reject');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "messages", id));
      toast.success('Message deleted');
    } catch (error) {
      console.error("Error deleting message: ", error);
      toast.error('Failed to delete message');
    }
  };

  const handleDeleteWord = async (id) => {
    try {
      await deleteDoc(doc(db, "words", id));
      toast.success('Word deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete');
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "words", id), {
        term: editTerm,
        meaning: editMeaning
      });
      setEditingWord(null);
      toast.success('Word updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update');
    }
  };

  const handleMigrateData = async () => {
    const localWords = JSON.parse(localStorage.getItem('papanaryWords') || '[]');
    if (localWords.length === 0) {
      toast.error("No local words to migrate!");
      return;
    }
    
    let count = 0;
    for (const word of localWords) {
      try {
        await addDoc(collection(db, "words"), {
          term: word.term,
          meaning: word.meaning,
          createdAt: serverTimestamp()
        });
        count++;
      } catch (err) {
        console.error(err);
      }
    }
    toast.success(`Migrated ${count} words! You can now clear local storage.`);
    localStorage.removeItem('papanaryWords');
  };

  const handleSavePopupConfig = async () => {
    setPopupSaving(true);
    try {
      await setDoc(doc(db, 'config', 'welcome_popup'), popupConfig, { merge: true });
      toast.success('Popup settings saved!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save popup settings');
    } finally {
      setPopupSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full max-w-md flex flex-col items-center mt-20"
      >
        <div className="bg-white w-full p-8 rounded-2xl border border-tertiary/15 shadow-2xl">
          <h2 className="text-2xl font-display font-black text-primary tracking-wider mb-6 text-center">ADMIN LOGIN</h2>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 text-center tracking-widest"
            />
            <button type="submit" className="bg-primary hover:bg-primary/90 text-tertiary font-black py-3 rounded-xl uppercase tracking-widest transition-colors mt-2">
              Login
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-5xl flex flex-col items-center"
    >
      <div className="w-full flex justify-between items-center mb-10">
        <h1 className="text-4xl font-display font-black text-primary tracking-tight">
          ADMIN DASHBOARD
        </h1>
        <button onClick={handleLogout} className="text-tertiary/60 hover:text-tertiary uppercase tracking-widest text-xs font-bold transition-colors border border-tertiary/15 px-4 py-2 rounded-lg hover:bg-gray-100">
          Logout
        </button>
      </div>

      <div className="w-full flex gap-4 mb-8 border-b border-tertiary/15 pb-4">
        <button 
          onClick={() => setActiveTab('suggestions')} 
          className={`font-bold uppercase tracking-widest text-sm px-4 py-2 rounded-lg transition-colors ${activeTab === 'suggestions' ? 'bg-primary/20 text-primary' : 'text-tertiary/60 hover:text-tertiary hover:bg-gray-100'}`}
        >
          Suggestions
        </button>
        <button 
          onClick={() => setActiveTab('words')} 
          className={`font-bold uppercase tracking-widest text-sm px-4 py-2 rounded-lg transition-colors ${activeTab === 'words' ? 'bg-primary/20 text-primary' : 'text-tertiary/60 hover:text-tertiary hover:bg-gray-100'}`}
        >
          Add Word
        </button>
        <button 
          onClick={() => setActiveTab('manage_words')} 
          className={`font-bold uppercase tracking-widest text-sm px-4 py-2 rounded-lg transition-colors ${activeTab === 'manage_words' ? 'bg-primary/20 text-primary' : 'text-tertiary/60 hover:text-tertiary hover:bg-gray-100'}`}
        >
          Manage Words
        </button>
        <button 
          onClick={() => setActiveTab('messages')} 
          className={`font-bold uppercase tracking-widest text-sm px-4 py-2 rounded-lg transition-colors ${activeTab === 'messages' ? 'bg-primary/20 text-primary' : 'text-tertiary/60 hover:text-tertiary hover:bg-gray-100'}`}
        >
          Messages
        </button>
        <button 
          onClick={() => setActiveTab('popup')} 
          className={`font-bold uppercase tracking-widest text-sm px-4 py-2 rounded-lg transition-colors ${activeTab === 'popup' ? 'bg-primary/20 text-primary' : 'text-tertiary/60 hover:text-tertiary hover:bg-gray-100'}`}
        >
          Welcome Popup
        </button>
      </div>

      <div className="w-full">
        {activeTab === 'suggestions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.length === 0 ? (
              <p className="text-tertiary/60 italic">No pending suggestions.</p>
            ) : (
              suggestions.map(sug => (
                <div key={sug.id} className="bg-white p-6 rounded-2xl border border-tertiary/15 relative">
                  <h3 className="text-tertiary font-display font-black text-xl mb-2">{sug.term}</h3>
                  <p className="text-tertiary/60 text-sm mb-6">{sug.meaning}</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleApprove(sug)}
                      className="flex-1 bg-green-500/20 text-green-600 hover:bg-green-500 hover:text-white font-bold py-2 rounded-lg text-sm transition-colors uppercase tracking-widest"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(sug.id)}
                      className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 rounded-lg text-sm transition-colors uppercase tracking-widest"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'words' && (
          <div className="bg-white p-8 rounded-2xl border border-tertiary/15 max-w-2xl mx-auto">
            <h2 className="text-xl font-display font-black text-tertiary tracking-wider mb-6">ADD WORD MANUALLY</h2>
            <form onSubmit={handleAddWordManually} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Word(s) (comma separated)</label>
                <input 
                  type="text" 
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Meaning</label>
                <textarea 
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors min-h-[100px] resize-none"
                  required
                />
              </div>
              <button type="submit" className="bg-primary text-tertiary hover:bg-tertiary hover:text-primary font-black text-sm tracking-widest uppercase px-8 py-3 rounded-xl transition-colors mt-4 self-end border border-transparent hover:border-tertiary">
                Add to Dictionary
              </button>
            </form>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length === 0 ? (
              <p className="text-tertiary/60 italic">No messages yet.</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className="bg-white p-6 rounded-2xl border border-tertiary/15 relative">
                  <h3 className="text-tertiary font-display font-black text-xl mb-1">{msg.name}</h3>
                  {msg.email && (
                    <a href={`mailto:${msg.email}`} className="text-primary hover:underline text-xs tracking-widest mb-1 block">
                      {msg.email}
                    </a>
                  )}
                  {msg.phone && (
                    <a href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-xs tracking-widest mb-4 block">
                      WhatsApp: {msg.phone}
                    </a>
                  )}
                  <div className="mt-4 border-t border-tertiary/10 pt-4 mb-6">
                    <p className="text-tertiary/60 text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 rounded-lg text-sm transition-colors uppercase tracking-widest"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'manage_words' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-tertiary/60 italic">Total Words: {allWords.length}</p>
              <button 
                onClick={handleMigrateData}
                className="bg-secondary text-white hover:bg-white hover:text-secondary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors border border-transparent hover:border-secondary shadow-sm"
              >
                Migrate Local Data
              </button>
            </div>
            {allWords.length === 0 ? (
              <p className="text-tertiary/60 italic text-center py-10">No words in global dictionary yet.</p>
            ) : (
              allWords.map(word => (
                <div key={word.id} className="bg-white p-6 rounded-2xl border border-tertiary/15">
                  {editingWord === word.id ? (
                    <div className="flex flex-col gap-4">
                      <input 
                        className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50"
                        value={editTerm} onChange={(e) => setEditTerm(e.target.value)}
                      />
                      <textarea 
                        className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 min-h-[100px] resize-none"
                        value={editMeaning} onChange={(e) => setEditMeaning(e.target.value)}
                      />
                      <div className="flex gap-4">
                        <button onClick={() => handleSaveEdit(word.id)} className="bg-green-500/20 text-green-600 hover:bg-green-500 hover:text-white px-6 py-2 rounded-lg font-bold tracking-widest uppercase text-sm transition-colors">Save</button>
                        <button onClick={() => setEditingWord(null)} className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-2 rounded-lg font-bold tracking-widest uppercase text-sm transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="text-tertiary font-display font-black text-xl mb-2 uppercase">{word.term.split(',').map(t => t.trim()).join(' • ')}</h3>
                        <p className="text-tertiary/60 text-sm whitespace-pre-wrap">{word.meaning}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setEditingWord(word.id); setEditTerm(word.term); setEditMeaning(word.meaning); }} className="bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors uppercase tracking-widest">Edit</button>
                        <button onClick={() => handleDeleteWord(word.id)} className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors uppercase tracking-widest">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'popup' && (
          <div className="bg-white p-8 rounded-2xl border border-tertiary/15 max-w-2xl mx-auto flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-display font-black text-tertiary tracking-wider">WELCOME POPUP</h2>
              {/* On/Off Toggle */}
              <button
                onClick={() => setPopupConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 border-2 ${
                  popupConfig.enabled
                    ? 'bg-primary border-primary'
                    : 'bg-tertiary/20 border-tertiary/30'
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                  popupConfig.enabled ? 'translate-x-7' : 'translate-x-0'
                }`} />
                <span className="sr-only">{popupConfig.enabled ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>

            {!popupConfig.enabled && (
              <p className="text-xs font-bold text-red-400 tracking-widest uppercase bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                ⚠️ Popup is currently OFF — users won't see it
              </p>
            )}

            {/* Title */}
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Title</label>
              <input
                type="text"
                value={popupConfig.title}
                onChange={e => setPopupConfig(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Subtitle</label>
              <input
                type="text"
                value={popupConfig.subtitle}
                onChange={e => setPopupConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Messages */}
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Message 1 (🫙)</label>
              <textarea
                value={popupConfig.message1}
                onChange={e => setPopupConfig(prev => ({ ...prev, message1: e.target.value }))}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors resize-none min-h-[80px]"
              />
            </div>
            <div>
              <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Message 2 (💪)</label>
              <textarea
                value={popupConfig.message2}
                onChange={e => setPopupConfig(prev => ({ ...prev, message2: e.target.value }))}
                className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors resize-none min-h-[80px]"
              />
            </div>

            {/* Steps */}
            {['step1', 'step2', 'step3'].map((key, i) => (
              <div key={key}>
                <label className="text-xs text-tertiary/60 mb-1 ml-2 font-bold tracking-widest uppercase block">Step {i + 1}</label>
                <input
                  type="text"
                  value={popupConfig[key]}
                  onChange={e => setPopupConfig(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full bg-white border border-tertiary/15 rounded-xl px-4 py-3 text-tertiary outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            ))}

            <button
              onClick={handleSavePopupConfig}
              disabled={popupSaving}
              className="bg-primary text-tertiary hover:bg-tertiary hover:text-primary font-black text-sm tracking-widest uppercase px-8 py-3 rounded-xl transition-colors self-end border border-transparent hover:border-tertiary disabled:opacity-50"
            >
              {popupSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
