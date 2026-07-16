const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                <div className={\`text-xs font-medium flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 \${currentRecord?.settings?.headerBgColor && currentRecord.settings.headerBgColor !== 'transparent' && currentRecord.settings.headerBgColor !== '#ffffff' ? 'text-white/80' : 'text-slate-500'}\`}>
                  <div className="flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded-md border border-black/5">
                    <UserIcon className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Teacher:</span>
                    <span className="font-black text-xs uppercase">{currentRecord?.teacherName || "Teacher"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded-md border border-black/5">
                    <BookOpen className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Class:</span>
                    <span className="font-black text-xs uppercase">{currentRecord?.className || "Class Name"}</span>
                  </div>`;

const newStr = `                <div className={\`text-xs font-medium flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 \${currentRecord?.settings?.headerBgColor && currentRecord.settings.headerBgColor !== 'transparent' && currentRecord.settings.headerBgColor !== '#ffffff' ? 'text-white' : 'text-slate-700'}\`}>
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-2.5 py-1 rounded-lg border border-emerald-600 shadow-sm">
                    <UserIcon className="w-3.5 h-3.5 opacity-90" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Teacher:</span>
                    <span className="font-black text-xs uppercase tracking-wide">{currentRecord?.teacherName || "Teacher"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-500 text-white px-2.5 py-1 rounded-lg border border-blue-600 shadow-sm">
                    <BookOpen className="w-3.5 h-3.5 opacity-90" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Class:</span>
                    <span className="font-black text-xs uppercase tracking-wide">{currentRecord?.className || "Class Name"}</span>
                  </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Fixed badges");
} else {
  console.log("Badge target not found");
}
