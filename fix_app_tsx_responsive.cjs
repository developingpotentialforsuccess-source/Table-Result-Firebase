const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// I will make sure the search bar wraps if it's too big, but everything else is fine.

fs.writeFileSync('src/App.tsx', content);
