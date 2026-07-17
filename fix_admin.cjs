const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const isAdmin = code === "dps" \|\| code === "dpss";/g,
  'const isAdmin = ["dps", "dpss", "virtue", "virtues", "wisdom", "wisdoms"].includes(code);'
);

code = code.replace(
  /\{\/\* Level Config \*\/\}\s*<button\s*onClick=\{\(\) => setShowSettings\(!showSettings\)\}[\s\S]*?Level Config\s*<\/button>/g,
  `{isAdmin && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={\`flex items-center gap-1 px-3 py-1.5 text-xs font-bold transition-all border rounded-lg shadow-sm cursor-pointer \${showSettings ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"}\`}
              >
                <Settings className="w-3.5 h-3.5" />
                Level Config
              </button>
              )}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed admin Level Config button');
