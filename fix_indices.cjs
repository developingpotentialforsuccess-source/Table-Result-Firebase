const fs = require('fs');
let content = fs.readFileSync('src/components/SettingsModal.tsx', 'utf8');

content = content.replace(/const TEMPLATE_2A = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_2A = SYSTEM_TEMPLATES[6].levels[0] as Level;");
content = content.replace(/const TEMPLATE_2B = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_2B = SYSTEM_TEMPLATES[7].levels[0] as Level;");
content = content.replace(/const TEMPLATE_3A = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_3A = SYSTEM_TEMPLATES[4].levels[0] as Level;");
content = content.replace(/const TEMPLATE_3B = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_3B = SYSTEM_TEMPLATES[5].levels[0] as Level;");
content = content.replace(/const TEMPLATE_4A = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_4A = SYSTEM_TEMPLATES[2].levels[0] as Level;");
content = content.replace(/const TEMPLATE_4B = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_4B = SYSTEM_TEMPLATES[3].levels[0] as Level;");
content = content.replace(/const TEMPLATE_100_PERCENT = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_100_PERCENT = SYSTEM_TEMPLATES[8].levels[0].subjects;");
content = content.replace(/const TEMPLATE_LEVEL_1A = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_LEVEL_1A = SYSTEM_TEMPLATES[9].levels[0].subjects;");
content = content.replace(/const TEMPLATE_LEVEL_1B = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_LEVEL_1B = SYSTEM_TEMPLATES[10].levels[0].subjects;");
content = content.replace(/const TEMPLATE_PRE2A_II = SYSTEM_TEMPLATES\[\d+\].*;/g, "const TEMPLATE_PRE2A_II = SYSTEM_TEMPLATES[12].levels[0] as Level;");

if (!content.includes('const TEMPLATE_5A')) {
  content = content.replace(
    /const TEMPLATE_2A/,
    "const TEMPLATE_5A = SYSTEM_TEMPLATES[0].levels[0] as Level;\nconst TEMPLATE_5B = SYSTEM_TEMPLATES[1].levels[0] as Level;\nconst TEMPLATE_2A"
  );
}

fs.writeFileSync('src/components/SettingsModal.tsx', content, 'utf8');
