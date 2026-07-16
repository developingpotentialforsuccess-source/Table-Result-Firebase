const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const backupOld = `              <div className="flex gap-1">
                <button
                  onClick={handleDownloadFullBackup}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
                  title="Download Full Data Backup (.JSON)"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  Backup
                </button>

                <label
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
                  title="Restore from Backup (.JSON)"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                  Restore
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImportBackup(e.target.files[0]);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>`;

const backupNew = `              <div className="flex gap-1">
                <div className="relative group/backup">
                  <button
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200 rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-600" />
                    Backup
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover/backup:opacity-100 group-hover/backup:visible transition-all z-50 overflow-hidden">
                    <div className="p-2 flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 mb-1">Timeframe</span>
                      <button onClick={() => handleDownloadFullBackup('1d')} className="px-3 py-2 text-xs font-bold text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors">The last 1 day</button>
                      <button onClick={() => handleDownloadFullBackup('3d')} className="px-3 py-2 text-xs font-bold text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors">The last 3 days</button>
                      <button onClick={() => handleDownloadFullBackup('1w')} className="px-3 py-2 text-xs font-bold text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors">The last 1 week</button>
                      <button onClick={() => handleDownloadFullBackup('1m')} className="px-3 py-2 text-xs font-bold text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors">The last 1 month</button>
                      <button onClick={() => handleDownloadFullBackup('3m')} className="px-3 py-2 text-xs font-bold text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors">The last 3 months</button>
                      <button onClick={() => handleDownloadFullBackup('6m')} className="px-3 py-2 text-xs font-bold text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors">The last 6 months</button>
                      <button onClick={() => handleDownloadFullBackup('all')} className="px-3 py-2 text-xs font-bold text-left text-emerald-700 bg-emerald-50 rounded-lg transition-colors mt-1">All Time (Full Backup)</button>
                    </div>
                  </div>
                </div>

                <label
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
                  title="Restore from Backup (.JSON)"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                  Restore
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImportBackup(e.target.files[0]);
                      }
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>`;

if (content.includes(backupOld)) {
  content = content.replace(backupOld, backupNew);
  // Also update handleDownloadFullBackup to accept a parameter
  content = content.replace('const handleDownloadFullBackup = async () => {', 'const handleDownloadFullBackup = async (timeframe: string = "all") => {');
  fs.writeFileSync('src/App.tsx', content);
  console.log("Updated backup");
} else {
  console.log("Not found");
}
