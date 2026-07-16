const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `  BookOpen,`;
const newStr = `  BookOpen,
  AlertTriangle,
  Info,`;

if (content.includes(targetStr) && !content.includes('AlertTriangle,')) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Imported icons");
} else {
  console.log("Icons already imported or target not found");
}
