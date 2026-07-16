const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                  <div className="flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded-md border border-black/5">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Term:</span>
                    <span className="font-black text-xs uppercase">{currentRecord?.termName || "Term Name"}</span>
                  </div>`;

const newStr = `                  <div className="flex items-center gap-1.5 bg-purple-500 text-white px-2.5 py-1 rounded-lg border border-purple-600 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 opacity-90" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Term:</span>
                    <span className="font-black text-xs uppercase tracking-wide">{currentRecord?.termName || "Term Name"}</span>
                  </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Fixed term badge");
} else {
  console.log("Term badge not found");
}
