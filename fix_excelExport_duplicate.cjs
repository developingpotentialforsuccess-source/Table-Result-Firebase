const fs = require('fs');
let content = fs.readFileSync('src/lib/excelExport.ts', 'utf8');

// The replacement was probably inserted twice or the previous code already had it?
content = content.replace(/const headerDarkness = settings\.headerDarkness \|\| 'black';\s*const subjectBgLevel = settings\.subjectBgLevel \|\| 'light';\s*/, '');

fs.writeFileSync('src/lib/excelExport.ts', content);
console.log("Removed duplicate declaration");
