const fs = require('fs');

let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

content = content.replace(
  /const TEMPLATE_2A = SYSTEM_TEMPLATES\[0\]\.levels\[0\];/,
  "const TEMPLATE_2A = SYSTEM_TEMPLATES[0].levels[0] as Level;"
);
content = content.replace(
  /const TEMPLATE_PRE2A_II = SYSTEM_TEMPLATES\[4\]\.levels\[0\];/,
  "const TEMPLATE_PRE2A_II = SYSTEM_TEMPLATES[4].levels[0] as Level;"
);

fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
