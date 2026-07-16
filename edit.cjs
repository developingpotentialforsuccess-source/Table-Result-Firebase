const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
let target = fs.readFileSync('target.txt', 'utf8');
// Now we parse target to reorder pieces
// Compact view is 3350 to 3374
const compactView = target.split('\n').slice(0, 25).join('\n');
// The rest is 3375 to the end
const theRest = target.split('\n').slice(25).join('\n');
// We want to put compactView AFTER the rest
const replacement = theRest + '\n' + compactView;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
console.log("Done!");
