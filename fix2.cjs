const fs = require('fs');
let content = fs.readFileSync('src/components/GradeTable.tsx', 'utf8');

// Change label: `${totalComponentsWeight}%` to label: `W ${totalComponentsWeight}%`
content = content.replace('label: `${totalComponentsWeight}%`,', 'label: `W ${totalComponentsWeight}%`,');

fs.writeFileSync('src/components/GradeTable.tsx', content);
console.log("Fixed W label");
