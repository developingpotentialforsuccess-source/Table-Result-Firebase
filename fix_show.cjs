const fs = require('fs');
let code = fs.readFileSync('src/components/AttendanceTracker.tsx', 'utf8');

code = code.replace(
  /<Settings2 className="w-4 h-4" \/>\s*Quick Config/g,
  '<Settings2 className="w-4 h-4" />\n            {showConfig ? "Hide" : "Show"}'
);

fs.writeFileSync('src/components/AttendanceTracker.tsx', code);
console.log('Fixed button text');
