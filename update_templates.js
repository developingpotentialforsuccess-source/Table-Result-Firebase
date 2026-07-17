const fs = require('fs');

const file = fs.readFileSync('src/lib/templates.ts', 'utf8');

const updatedFile = file.replace(/export const SYSTEM_TEMPLATES[\s\S]*?(?=\];\n\n\/\/ \-\-\-)/, `...`);

// Actually, I'll just rewrite the Full-Time English Program using regex or substring.
