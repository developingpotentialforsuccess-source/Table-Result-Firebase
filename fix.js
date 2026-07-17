const fs = require('fs');
let code = fs.readFileSync('src/lib/templates.ts', 'utf8');

// For Full-Time English Program, delete the attendance subject:
code = code.replace(/\{\s*id:\ \`fte_\$\{i\}_attendance\`,[\s\S]*?categories:\ \[\s*\{\ id:\ \`fte_\$\{i\}_att_1\`,[\s\S]*?\]\s*\},/g, '');

// For Part-Time English Program, delete the attendance subject:
code = code.replace(/\{\s*id:\ \`pte_\$\{i\}_attendance\`,[\s\S]*?categories:\ \[\s*\{\ id:\ \`pte_\$\{i\}_att_1\`,[\s\S]*?\]\s*\},/g, '');

// Add fullModeMidtermWeight and fullModeFinalWeight
code = code.replace(/finalTargetWeight: 100,/g, 'finalTargetWeight: 100,\n            fullModeMidtermWeight: 50,\n            fullModeFinalWeight: 50,\n            midtermMaxScore: 100,\n            finalMaxScore: 100,');

fs.writeFileSync('src/lib/templates.ts', code);
console.log('Fixed');
