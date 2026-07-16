const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `              {/* View Settings Menu */}
              <div className="relative group/view-settings shrink-0">`;

const replacementStr = `              {/* View Settings & Compact View Group */}
              <div className="flex items-center gap-2 shrink-0">
                {/* View Settings Menu */}
                <div className="relative group/view-settings shrink-0">`;

content = content.replace(targetStr, replacementStr);

const targetStr2 = `                  </>
                )}
              </button>
            </div>`;

const replacementStr2 = `                  </>
                )}
              </button>
              </div>
            </div>`;

content = content.replace(targetStr2, replacementStr2);

fs.writeFileSync('src/App.tsx', content);
console.log("Grouped View Settings and Compact View.");
