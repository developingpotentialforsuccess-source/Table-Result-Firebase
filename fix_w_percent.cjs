const fs = require('fs');
let content = fs.readFileSync('src/components/GradeTable.tsx', 'utf8');

// Replace W (%) with W {weight}
content = content.replace(/const wtdLabel = settings\?\.hideWeightSymbol \? \`W\$\{activeWeight\}\` : "W \(\%\)";/g, 
  'const wtdLabel = `W ${activeWeight}`;');

content = content.replace(/const weightLabel = settings\?\.hideWeightSymbol \? "W" : "W \(\%\)";/g, 
  'const weightLabel = `W ${activeWeight}`;');

// Also update the mid/final weight columns
content = content.replace(/label: \`W \$\{midWeightContrib\}\%\`/g, 'label: `W ${midWeightContrib}`');
content = content.replace(/label: \`W \$\{finalWeightContrib\}\%\`/g, 'label: `W ${finalWeightContrib}`');
content = content.replace(/label: \`W \$\{totalComponentsWeight\}\%\`/g, 'label: `W ${totalComponentsWeight}`');

fs.writeFileSync('src/components/GradeTable.tsx', content);
console.log("Fixed W (%) -> W {number}");
