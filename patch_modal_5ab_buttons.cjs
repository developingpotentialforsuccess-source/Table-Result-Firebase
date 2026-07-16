const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

const level5aBlock = `
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-fuchsia-50 rounded-xl shrink-0">
                      <FileText className="w-6 h-6 text-fuchsia-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">Level 5A Template (Official)</h4>
                      <p className="text-sm text-slate-500 mt-1">Includes Reading, Writing, Listening, Speaking, Grammar, Computer, and Science with full term weighting logic.</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={() => handleApplyToCurrentLevel([TEMPLATE_5A])}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-fuchsia-600 rounded-lg hover:bg-fuchsia-700 transition-colors cursor-pointer"
                        title="Apply to Current Class"
                      >
                        <Copy className="w-4 h-4" /> Apply to Class
                      </button>
                      <button 
                        onClick={() => handleDuplicateTemplate({
                          id: 'level_5a_template_lib',
                          name: 'Level 5A Template (Official)',
                          authorName: 'System',
                          levels: [TEMPLATE_5A]
                        })}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Duplicate to Library"
                      >
                        <Copy className="w-4 h-4" /> Duplicate
                      </button>
                    </div>
                  </div>
                </div>`;

const level5bBlock = `
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-pink-50 rounded-xl shrink-0">
                      <FileText className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">Level 5B Template (Official)</h4>
                      <p className="text-sm text-slate-500 mt-1">Includes Reading, Writing, Listening, Speaking, Grammar, Computer, and Mathematics with full term weighting logic.</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={() => handleApplyToCurrentLevel([TEMPLATE_5B])}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors cursor-pointer"
                        title="Apply to Current Class"
                      >
                        <Copy className="w-4 h-4" /> Apply to Class
                      </button>
                      <button 
                        onClick={() => handleDuplicateTemplate({
                          id: 'level_5b_template_lib',
                          name: 'Level 5B Template (Official)',
                          authorName: 'System',
                          levels: [TEMPLATE_5B]
                        })}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Duplicate to Library"
                      >
                        <Copy className="w-4 h-4" /> Duplicate
                      </button>
                    </div>
                  </div>
                </div>`;

const level4bBlockSearch = 'Level 4B Template (Official)</h4>';
const level4bBlockEnd = '</div>\n                  </div>\n                </div>';

if (!content.includes('Level 5A Template (Official)') || !content.includes('TEMPLATE_5B')) {
    const splitIndex = content.indexOf(level4bBlockSearch);
    if (splitIndex !== -1) {
        const nextEndIndex = content.indexOf(level4bBlockEnd, splitIndex);
        if (nextEndIndex !== -1) {
            const insertionPoint = nextEndIndex + level4bBlockEnd.length;
            content = content.substring(0, insertionPoint) + '\\n' + level5aBlock + '\\n' + level5bBlock + content.substring(insertionPoint);
        }
    }
}

fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
