const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetBlock = `              {/* View Settings Menu */}
              <div className="relative group/view-settings shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all shadow-sm">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View Settings</span>
                  <span className="sm:hidden text-[10px] uppercase">View</span>
                  <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover/view-settings:opacity-100 group-hover/view-settings:visible transition-all z-50">
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visibility</span>
                      <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                        <span>Show Item Config (MAX, etc.)</span>
                        <input 
                          type="checkbox" 
                          checked={currentRecord?.settings?.showItemConfig !== false}
                          onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, showItemConfig: e.target.checked})}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                        <span>Hide Regular Categories</span>
                        <input 
                          type="checkbox" 
                          checked={currentRecord?.settings?.hideRegularCategories === true}
                          onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, hideRegularCategories: e.target.checked})}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>

                    <div className="md:hidden flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Table Layout</span>
                      <button
                        onClick={() => handleUpdateSettings({
                          ...currentRecord!.settings!,
                          showScoreColumns: !currentRecord!.settings!.showScoreColumns
                        })}
                        className={\`flex items-center justify-between w-full p-2 rounded-lg border text-xs font-bold transition-all \${
                          currentRecord?.settings?.showScoreColumns 
                            ? "bg-white border-slate-200 text-slate-600" 
                            : "bg-blue-50 border-blue-200 text-blue-700"
                        }\`}
                      >
                        <span>{currentRecord?.settings?.showScoreColumns ? "Detailed View" : "Compact View"}</span>
                        {currentRecord?.settings?.showScoreColumns ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="lg:hidden flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Result Column</span>
                      <select 
                        value={currentRecord?.settings?.resultDisplayMode || 'both'}
                        onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, resultDisplayMode: e.target.value as 'both'|'avg'|'wtd'})}
                        className="w-full text-xs font-bold border border-slate-200 rounded p-2 outline-none focus:border-blue-500 bg-slate-50"
                      >
                        <option value="both">Both (Wtd & Avg)</option>
                        <option value="wtd">Weight Only</option>
                        <option value="avg">Average Only</option>
                      </select>
                    </div>

                    <div className="sm:hidden flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grading Mode</span>
                      <select
                        value={resultMode}
                        onChange={(e) => handleUpdateResultMode(e.target.value as "full" | "midterm" | "final")}
                        className="w-full text-xs font-bold border border-slate-200 rounded p-2 outline-none focus:border-blue-500 bg-slate-50"
                      >
                        <option value="full">Termly Result</option>
                        <option value="midterm">Mid-term Test</option>
                        <option value="final">Final Test</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Column Display - Desktop */}
              <div className="hidden lg:flex items-center border border-slate-200 rounded-lg px-2 bg-white shadow-sm shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2 border-r border-slate-100 pr-2 py-1">Result Col</span>
                <select 
                  value={currentRecord?.settings?.resultDisplayMode || 'both'}
                  onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, resultDisplayMode: e.target.value as 'both'|'avg'|'wtd'})}
                  className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer py-1"
                  title="Result Column Display"
                >
                  <option value="both">Both (Wtd & Avg)</option>
                  <option value="wtd">Weight Only</option>
                  <option value="avg">Average Only</option>
                </select>
              </div>

              {/* Repositioned Mode Select - Desktop */}
              <div className={\`hidden sm:flex items-center border rounded-lg px-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shrink-0 \${
                resultMode === 'full' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                resultMode === 'midterm' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                'bg-rose-50 border-rose-200 text-rose-800'
              }\`}>
                <span className={\`text-[10px] font-black uppercase tracking-widest mr-2 border-r pr-2 py-1 \${
                  resultMode === 'full' ? 'text-emerald-500 border-emerald-200' :
                  resultMode === 'midterm' ? 'text-amber-500 border-amber-200' :
                  'text-rose-500 border-rose-200'
                }\`}>Mode</span>
                <select
                  value={resultMode}
                  onChange={(e) => handleUpdateResultMode(e.target.value as "full" | "midterm" | "final")}
                  className="bg-transparent text-sm font-bold outline-none cursor-pointer py-1 text-inherit"
                  title="Choose grading period view and export mode"
                >
                  <option value="full" className="text-slate-700 bg-white">Termly Result</option>
                  <option value="midterm" className="text-slate-700 bg-white">Mid-term Test</option>
                  <option value="final" className="text-slate-700 bg-white">Final Test</option>
                </select>
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

const replacementBlock = `              {/* Result Column Display - Desktop */}
              <div className="hidden lg:flex items-center border border-slate-200 rounded-lg px-2 bg-white shadow-sm shrink-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2 border-r border-slate-100 pr-2 py-1">Result Col</span>
                <select 
                  value={currentRecord?.settings?.resultDisplayMode || 'both'}
                  onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, resultDisplayMode: e.target.value as 'both'|'avg'|'wtd'})}
                  className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer py-1"
                  title="Result Column Display"
                >
                  <option value="both">Both (Wtd & Avg)</option>
                  <option value="wtd">Weight Only</option>
                  <option value="avg">Average Only</option>
                </select>
              </div>

              {/* Repositioned Mode Select - Desktop */}
              <div className={\`hidden sm:flex items-center border rounded-lg px-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shrink-0 \${
                resultMode === 'full' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                resultMode === 'midterm' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                'bg-rose-50 border-rose-200 text-rose-800'
              }\`}>
                <span className={\`text-[10px] font-black uppercase tracking-widest mr-2 border-r pr-2 py-1 \${
                  resultMode === 'full' ? 'text-emerald-500 border-emerald-200' :
                  resultMode === 'midterm' ? 'text-amber-500 border-amber-200' :
                  'text-rose-500 border-rose-200'
                }\`}>Mode</span>
                <select
                  value={resultMode}
                  onChange={(e) => handleUpdateResultMode(e.target.value as "full" | "midterm" | "final")}
                  className="bg-transparent text-sm font-bold outline-none cursor-pointer py-1 text-inherit"
                  title="Choose grading period view and export mode"
                >
                  <option value="full" className="text-slate-700 bg-white">Termly Result</option>
                  <option value="midterm" className="text-slate-700 bg-white">Mid-term Test</option>
                  <option value="final" className="text-slate-700 bg-white">Final Test</option>
                </select>
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
              </button>

              {/* View Settings Menu */}
              <div className="relative group/view-settings shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-all shadow-sm">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">View Settings</span>
                  <span className="sm:hidden text-[10px] uppercase">View</span>
                  <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover/view-settings:opacity-100 group-hover/view-settings:visible transition-all z-50">
                  <div className="p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visibility</span>
                      <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                        <span>Show Item Config (MAX, etc.)</span>
                        <input 
                          type="checkbox" 
                          checked={currentRecord?.settings?.showItemConfig !== false}
                          onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, showItemConfig: e.target.checked})}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                        <span>Hide Regular Categories</span>
                        <input 
                          type="checkbox" 
                          checked={currentRecord?.settings?.hideRegularCategories === true}
                          onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, hideRegularCategories: e.target.checked})}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>

                    <div className="md:hidden flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Table Layout</span>
                      <button
                        onClick={() => handleUpdateSettings({
                          ...currentRecord!.settings!,
                          showScoreColumns: !currentRecord!.settings!.showScoreColumns
                        })}
                        className={\`flex items-center justify-between w-full p-2 rounded-lg border text-xs font-bold transition-all \${
                          currentRecord?.settings?.showScoreColumns 
                            ? "bg-white border-slate-200 text-slate-600" 
                            : "bg-blue-50 border-blue-200 text-blue-700"
                        }\`}
                      >
                        <span>{currentRecord?.settings?.showScoreColumns ? "Detailed View" : "Compact View"}</span>
                        {currentRecord?.settings?.showScoreColumns ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="lg:hidden flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Result Column</span>
                      <select 
                        value={currentRecord?.settings?.resultDisplayMode || 'both'}
                        onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, resultDisplayMode: e.target.value as 'both'|'avg'|'wtd'})}
                        className="w-full text-xs font-bold border border-slate-200 rounded p-2 outline-none focus:border-blue-500 bg-slate-50"
                      >
                        <option value="both">Both (Wtd & Avg)</option>
                        <option value="wtd">Weight Only</option>
                        <option value="avg">Average Only</option>
                      </select>
                    </div>

                    <div className="sm:hidden flex flex-col gap-2 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grading Mode</span>
                      <select
                        value={resultMode}
                        onChange={(e) => handleUpdateResultMode(e.target.value as "full" | "midterm" | "final")}
                        className="w-full text-xs font-bold border border-slate-200 rounded p-2 outline-none focus:border-blue-500 bg-slate-50"
                      >
                        <option value="full">Termly Result</option>
                        <option value="midterm">Mid-term Test</option>
                        <option value="final">Final Test</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>`;

if (content.includes(targetBlock)) {
  content = content.replace(targetBlock, replacementBlock);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Reordered toolbar items successfully.");
} else {
  console.log("Could not find target block to reorder.");
}
