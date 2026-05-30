const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = {
  'bg-black': 'bg-white',
  'text-white': 'text-gray-900',
  'border-white/10': 'border-gray-200',
  'border-white/5': 'border-gray-200',
  'bg-[#1f1f1f]/60': 'bg-white/60',
  'bg-[#151515]/80': 'bg-gray-50/80',
  'text-white/5': 'text-gray-900/5',
  'text-white/20': 'text-gray-400',
  'text-white/50': 'text-gray-500',
  'bg-card': 'bg-white',
  'bg-background': 'bg-[#fdf6e3]',
  'hover:bg-white/5': 'hover:bg-gray-100',
  'text-muted': 'text-gray-500',
  'text-muted/40': 'text-gray-400',
  'text-muted/60': 'text-gray-500',
  'text-white/10': 'text-gray-200',
  'border-red-600/50': 'border-red-300'
};

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // If it's index.css, do specific replacements
      if (file === 'index.css') {
        content = content.replace('background-color: #0a0a0a;', 'background-color: #fdf6e3;');
        content = content.replace('color: white;', 'color: #1a1a1a;');
      }
      
      // Do the general replacements
      for (const [search, replace] of Object.entries(replacements)) {
        content = content.split(search).join(replace);
      }
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory(directoryPath);
console.log('Theme updated successfully!');
