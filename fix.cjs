const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I need to swap the `            </div>` and the `Compact View Toggle` block.
// Let's find:
const wrongOrder = `              </div>
            </div>

              {/* Compact View Toggle */}
              <button
                onClick={() => handleUpdateSettings({
                  ...currentRecord!.settings!,
                  showScoreColumns: !currentRecord!.settings!.showScoreColumns
                })}
                className={\`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm shrink-0 \${
                  currentRecord?.settings?.showScoreColumns 
                    ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50" 
                    : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                }\`}
                title={currentRecord?.settings?.showScoreColumns ? "Switch to Compact View (Hide item columns)" : "Switch to Detailed View (Show item columns)"}
              >
                {currentRecord?.settings?.showScoreColumns ? (
                  <>
                    <Minimize className="w-3.5 h-3.5" />
                    Compact View
                  </>
                ) : (
                  <>
                    <Maximize className="w-3.5 h-3.5" />
                    Detailed View
                  </>
                )}
              </button>`;

const correctOrder = `              </div>

              {/* Compact View Toggle */}
              <button
                onClick={() => handleUpdateSettings({
                  ...currentRecord!.settings!,
                  showScoreColumns: !currentRecord!.settings!.showScoreColumns
                })}
                className={\`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm shrink-0 \${
                  currentRecord?.settings?.showScoreColumns 
                    ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50" 
                    : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                }\`}
                title={currentRecord?.settings?.showScoreColumns ? "Switch to Compact View (Hide item columns)" : "Switch to Detailed View (Show item columns)"}
              >
                {currentRecord?.settings?.showScoreColumns ? (
                  <>
                    <Minimize className="w-3.5 h-3.5" />
                    Compact View
                  </>
                ) : (
                  <>
                    <Maximize className="w-3.5 h-3.5" />
                    Detailed View
                  </>
                )}
              </button>
            </div>`;

content = content.replace(wrongOrder, correctOrder);
fs.writeFileSync('src/App.tsx', content);
console.log("Fixed");
