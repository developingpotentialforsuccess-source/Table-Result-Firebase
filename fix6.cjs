const fs = require('fs');
let lines = fs.readFileSync('src/components/GradeTable.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('                      </button>')) {
        if (lines[i+1].includes('                    </div>') && lines[i+2].includes('                                          </div>')) {
            lines.splice(i+2, 2); // remove the empty spaces </div> and )}
            break;
        }
    }
}
fs.writeFileSync('src/components/GradeTable.tsx', lines.join('\n'));
console.log("Fixed");
