const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the local `isAdmin` definition with `isAdminCode` inside `filteredRecords`
code = code.replace(
  'const isAdmin = ["dps", "dpss", "virtue", "virtues", "wisdom", "wisdoms"].includes(code);',
  'const isAdminCode = ["dps", "dpss", "virtue", "virtues", "wisdom", "wisdoms"].includes(code);'
);

// We need to replace usages of `isAdmin` inside that useMemo
code = code.replace(
  'if (!isAdminCode && cr.lockCode && cr.lockCode.toLowerCase() !== code) {',
  'if (!isAdminCode && cr.lockCode && cr.lockCode.toLowerCase() !== code) {'
);

code = code.replace(
  /if \(!isAdmin && /g,
  'if (!isAdminCode && '
);


// Now inject the `isAdmin` variable at the top of the render logic or component
// Let's put it right before `filteredRecords = useMemo`
code = code.replace(
  '  const filteredRecords = useMemo(() => {',
  '  const isAdmin = ["dps", "dpss", "virtue", "virtues", "wisdom", "wisdoms"].includes(accessCode.trim().toLowerCase());\n  const filteredRecords = useMemo(() => {'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed isAdmin scope');
