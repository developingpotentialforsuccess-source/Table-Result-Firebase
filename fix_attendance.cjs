const fs = require('fs');
let code = fs.readFileSync('src/components/AttendanceTracker.tsx', 'utf8');

code = code.replace(
  /const \[showConfig, setShowConfig\] = useState\(true\);/g,
  'const [showConfig, setShowConfig] = useState(false);'
);

fs.writeFileSync('src/components/AttendanceTracker.tsx', code);
console.log('Fixed attendance config default state');
