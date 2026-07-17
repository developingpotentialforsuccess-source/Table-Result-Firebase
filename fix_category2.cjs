const fs = require('fs');
let code = fs.readFileSync('src/lib/categoryUtils.ts', 'utf8');

code = code.replace(/ \|\| n\.includes\("SPEAKING"\)/g, '');

fs.writeFileSync('src/lib/categoryUtils.ts', code);
console.log('Fixed categoryUtils.ts again');
