const fs = require('fs');
let content = fs.readFileSync('src/components/GradeTable.tsx', 'utf8');

const regex = /\{\!sc\.isHidden && resultMode \!\=\= 'full' && \(\s*<div className="flex items-center text-\[9px\] normal-case font-bold text-red-600 bg-red-50\/50 px-1 py-0\.5 rounded border border-red-200\/50 mt-1">[\s\S]*?<\/div>\s*\)\}/g;

content = content.replace(regex, '');
fs.writeFileSync('src/components/GradeTable.tsx', content);
console.log("Removed redundant red box");
