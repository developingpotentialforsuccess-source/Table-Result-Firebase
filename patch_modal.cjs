const fs = require('fs');

let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

content = content.replace(
  /const TEMPLATE_100_PERCENT = SYSTEM_TEMPLATES\[0\]\.levels\[0\]\.subjects;/,
  "const TEMPLATE_2A = SYSTEM_TEMPLATES[0].levels[0];\nconst TEMPLATE_100_PERCENT = SYSTEM_TEMPLATES[1].levels[0].subjects;"
);
content = content.replace(
  /const TEMPLATE_LEVEL_1A = SYSTEM_TEMPLATES\[1\]\.levels\[0\]\.subjects;/,
  "const TEMPLATE_LEVEL_1A = SYSTEM_TEMPLATES[2].levels[0].subjects;"
);
content = content.replace(
  /const TEMPLATE_LEVEL_1B = SYSTEM_TEMPLATES\[2\]\.levels\[0\]\.subjects;/,
  "const TEMPLATE_LEVEL_1B = SYSTEM_TEMPLATES[3].levels[0].subjects;"
);
content = content.replace(
  /const TEMPLATE_PRE2A_II = SYSTEM_TEMPLATES\[3\]\.levels\[0\];/,
  "const TEMPLATE_PRE2A_II = SYSTEM_TEMPLATES[4].levels[0];"
);

fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
