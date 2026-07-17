const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `              </select>
              <button
                onClick={handleRenameLevel}
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                title="Rename Current Level"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCreateLevel}
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                title="Create New Level"
              >
                <Plus className="w-4 h-4" />
              </button>
              {levels.length > 1 && (
                <button
                  onClick={handleDeleteLevel}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                  title="Delete Current Level"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}`;

const replacement = `              </select>
              {isAdmin && (
                <>
                  <button
                    onClick={handleRenameLevel}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                    title="Rename Current Level"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCreateLevel}
                    className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                    title="Create New Level"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  {levels.length > 1 && (
                    <button
                      onClick={handleDeleteLevel}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                      title="Delete Current Level"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Fixed Level Profile edit buttons');
} else {
  console.log('Target not found');
}
