const fs = require('fs');

let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

const pre2aBlockStart = `                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-purple-50 rounded-xl shrink-0">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">Level Pre-2A II Template (Official)</h4>`;

const level2aBlock = `                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-rose-50 rounded-xl shrink-0">
                      <FileText className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">Level 2A Template (Official)</h4>
                      <p className="text-sm text-slate-500 mt-1">Includes Reading, Writing, Listening, Speaking, and Computer with full term weighting logic.</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={() => handleApplyToCurrentLevel([TEMPLATE_2A])}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
                        title="Apply to Current Class"
                      >
                        <Copy className="w-4 h-4" /> Apply to Class
                      </button>
                      <button 
                        onClick={() => handleDuplicateTemplate({
                          id: 'level_2a_template_lib',
                          name: 'Level 2A Template (Official)',
                          authorName: 'System',
                          levels: [TEMPLATE_2A]
                        })}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Duplicate to Library"
                      >
                        <Copy className="w-4 h-4" /> Duplicate
                      </button>
                    </div>
                  </div>
                </div>\n`;

content = content.replace(pre2aBlockStart, level2aBlock + pre2aBlockStart);
fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
