const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">Excel Detail Mode</p>`;

const replacement = `                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">Header Darkness</p>
                        <select
                          value={currentRecord?.settings?.headerDarkness || 'black'}
                          onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, headerDarkness: e.target.value})}
                          className="w-full text-sm border-slate-200 rounded p-1 mb-2 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="black">Black</option>
                          <option value="dark">Dark Gray</option>
                          <option value="medium">Medium Gray</option>
                          <option value="light">Light Gray</option>
                          <option value="none">None (White)</option>
                        </select>
                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">Subject BG Level</p>
                        <select
                          value={currentRecord?.settings?.subjectBgLevel || 'light'}
                          onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, subjectBgLevel: e.target.value})}
                          className="w-full text-sm border-slate-200 rounded p-1 mb-2 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="light">Pastel (Light)</option>
                          <option value="medium">Medium</option>
                          <option value="dark">Vibrant (Dark)</option>
                          <option value="none">None (White)</option>
                        </select>
                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">Excel Detail Mode</p>`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', content);
console.log("Updated App.tsx with Header Darkness and Subject BG Level");
