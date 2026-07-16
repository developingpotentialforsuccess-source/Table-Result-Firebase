const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Remove the old warning
const oldWarningStr = `            <div className="flex items-center gap-3">
              {totalWeight !== 100 && totalWeight > 0 && (
                <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 hidden md:inline-block">
                  Warning: Level total weight is {totalWeight}%
                </span>
              )}
              {totalWeight === 0 && (
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 hidden md:inline-block">
                  Configure subjects in Level Config
                </span>
              )}`;

const oldWarningReplacement = `            <div className="flex items-center gap-3">`;

content = content.replace(oldWarningStr, oldWarningReplacement);

// 2. Add the new warning below Term Name
const newWarningStr = `                  <div className="flex items-center gap-1.5 bg-purple-500 text-white px-2.5 py-1 rounded-lg border border-purple-600 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 opacity-90" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Term:</span>
                    <span className="font-black text-xs uppercase tracking-wide">{currentRecord?.termName || "Term Name"}</span>
                  </div>`;

const newWarningReplacement = `                  <div className="flex items-center gap-1.5 bg-purple-500 text-white px-2.5 py-1 rounded-lg border border-purple-600 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 opacity-90" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Term:</span>
                    <span className="font-black text-xs uppercase tracking-wide">{currentRecord?.termName || "Term Name"}</span>
                  </div>
                  {totalWeight !== 100 && totalWeight > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-300 shadow-sm ml-auto">
                      <AlertTriangle className="w-3.5 h-3.5 opacity-90 text-amber-600" />
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Warning:</span>
                      <span className="font-black text-xs uppercase tracking-wide">Level total weight is {totalWeight}%</span>
                    </div>
                  )}
                  {totalWeight === 0 && (
                    <div className="flex items-center gap-1.5 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-300 shadow-sm ml-auto">
                      <Info className="w-3.5 h-3.5 opacity-90 text-blue-600" />
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Info:</span>
                      <span className="font-black text-xs uppercase tracking-wide">Configure subjects in Level Config</span>
                    </div>
                  )}`;

content = content.replace(newWarningStr, newWarningReplacement);

fs.writeFileSync('src/App.tsx', content);
console.log("Moved warning");
