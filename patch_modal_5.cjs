const fs = require('fs');

let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

content = content.replace(
  /const TEMPLATE_2B = SYSTEM_TEMPLATES\[1\].levels\[0\] as Level;/,
  "const TEMPLATE_2B = SYSTEM_TEMPLATES[1].levels[0] as Level;\nconst TEMPLATE_3A = SYSTEM_TEMPLATES[2].levels[0] as Level;\nconst TEMPLATE_3B = SYSTEM_TEMPLATES[3].levels[0] as Level;"
);

content = content.replace(
  /const TEMPLATE_100_PERCENT = SYSTEM_TEMPLATES\[2\].*/,
  "const TEMPLATE_100_PERCENT = SYSTEM_TEMPLATES[4].levels[0].subjects;"
);

content = content.replace(
  /const TEMPLATE_LEVEL_1A = SYSTEM_TEMPLATES\[3\].*/,
  "const TEMPLATE_LEVEL_1A = SYSTEM_TEMPLATES[5].levels[0].subjects;"
);

content = content.replace(
  /const TEMPLATE_LEVEL_1B = SYSTEM_TEMPLATES\[4\].*/,
  "const TEMPLATE_LEVEL_1B = SYSTEM_TEMPLATES[6].levels[0].subjects;"
);

content = content.replace(
  /const TEMPLATE_PRE2A_II = SYSTEM_TEMPLATES\[6\].*/,
  "const TEMPLATE_PRE2A_II = SYSTEM_TEMPLATES[8].levels[0] as Level;"
);

const level3aBlock = `
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-amber-50 rounded-xl shrink-0">
                      <FileText className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">Level 3A Template (Official)</h4>
                      <p className="text-sm text-slate-500 mt-1">Includes Reading, Writing, Listening, Speaking, Grammar, and Computer with full term weighting logic.</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={() => handleApplyToCurrentLevel([TEMPLATE_3A])}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
                        title="Apply to Current Class"
                      >
                        <Copy className="w-4 h-4" /> Apply to Class
                      </button>
                      <button 
                        onClick={() => handleDuplicateTemplate({
                          id: 'level_3a_template_lib',
                          name: 'Level 3A Template (Official)',
                          authorName: 'System',
                          levels: [TEMPLATE_3A]
                        })}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Duplicate to Library"
                      >
                        <Copy className="w-4 h-4" /> Duplicate
                      </button>
                    </div>
                  </div>
                </div>`;

const level3bBlock = `
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-indigo-50 rounded-xl shrink-0">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-lg">Level 3B Template (Official)</h4>
                      <p className="text-sm text-slate-500 mt-1">Includes Reading, Writing, Listening, Speaking, Grammar, Computer, and Science with full term weighting logic.</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button 
                        onClick={() => handleApplyToCurrentLevel([TEMPLATE_3B])}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                        title="Apply to Current Class"
                      >
                        <Copy className="w-4 h-4" /> Apply to Class
                      </button>
                      <button 
                        onClick={() => handleDuplicateTemplate({
                          id: 'level_3b_template_lib',
                          name: 'Level 3B Template (Official)',
                          authorName: 'System',
                          levels: [TEMPLATE_3B]
                        })}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Duplicate to Library"
                      >
                        <Copy className="w-4 h-4" /> Duplicate
                      </button>
                    </div>
                  </div>
                </div>`;

const level2bBlockSearch = 'Level 2B Template (Official)</h4>';
const level2bBlockEnd = '</div>\n                  </div>\n                </div>';

if (!content.includes('Level 3A Template (Official)') || !content.includes('TEMPLATE_3B')) {
    const splitIndex = content.indexOf(level2bBlockSearch);
    if (splitIndex !== -1) {
        const nextEndIndex = content.indexOf(level2bBlockEnd, splitIndex);
        if (nextEndIndex !== -1) {
            const insertionPoint = nextEndIndex + level2bBlockEnd.length;
            content = content.substring(0, insertionPoint) + '\\n' + level3aBlock + '\\n' + level3bBlock + content.substring(insertionPoint);
        }
    }
}

fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
