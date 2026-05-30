import { useState, useEffect } from 'react';

export default function Typewriter({ words, typingSpeed = 150, deletingSpeed = 100, delay = 2000 }) {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
        timer = setTimeout(() => {}, 500);
      } else {
        timer = setTimeout(() => {
          setText(text.slice(0, -1));
        }, deletingSpeed);
      }
    } else {
      if (text === currentWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      } else {
        timer = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, typingSpeed);
      }
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, delay]);

  return (
    <span className="inline-block relative">
      <span className="text-primary italic">{text}</span>
      <span className="animate-pulse border-r-4 border-gray-900 ml-2 absolute top-1/2 -translate-y-1/2 h-4/5"></span>
    </span>
  );
}
