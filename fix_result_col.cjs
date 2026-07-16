const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the standalone Result Column Display from the toolbar
content = content.replace(/\s*\{\/\* Result Column Display - Desktop \*\/\}\s*<div className="hidden lg:flex items-center border border-slate-200 rounded-lg px-2 bg-white shadow-sm shrink-0">[\s\S]*?<\/div>/, '');

// Remove lg:hidden from the Result Column Display inside View Settings
content = content.replace(/<div className="lg:hidden flex flex-col gap-2 pt-3 border-t border-slate-100">\s*<span className="text-\[10px\] font-bold text-slate-400 uppercase tracking-widest">Result Column<\/span>/,
  `<div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Result Column</span>`);

fs.writeFileSync('src/App.tsx', content);
console.log("Moved Result Col inside View Settings.");
