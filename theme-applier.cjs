const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = {
  'text-gray-900': 'text-tertiary',
  'text-gray-600': 'text-tertiary/80',
  'text-gray-500': 'text-tertiary/60',
  'text-gray-400': 'text-tertiary/40',
  'border-gray-200': 'border-tertiary/15',
  'bg-gray-50': 'bg-tertiary/5',
  'bg-white/60': 'bg-white/40',
  'border-red-300': 'border-secondary/30',
  'text-green-500': 'text-secondary',
  'bg-red-600': 'bg-secondary',
  'text-black': 'text-tertiary'
};

function processDirectory(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const [key, value] of Object.entries(replacements)) {
        content = content.replace(new RegExp(key, 'g'), value);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log("Theme comprehensive update complete.");
