const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `              {/* View Settings Menu */}`;
const endTarget1 = `              </div>\n\n              {/* Result Column Display - Desktop */}`;

const viewSettingsBlock = content.substring(content.indexOf(target1), content.indexOf(endTarget1) + 21);

const target2 = `              {/* Result Column Display - Desktop */}`;
const endTarget2 = `              {/* Repositioned Mode Select - Desktop */}`;
const resultColBlock = content.substring(content.indexOf(target2), content.indexOf(endTarget2));

const target3 = `              {/* Repositioned Mode Select - Desktop */}`;
const endTarget3 = `              {/* Compact View Toggle */}`;
const modeSelectBlock = content.substring(content.indexOf(target3), content.indexOf(endTarget3));

const target4 = `              {/* Compact View Toggle */}`;
const endTarget4 = `              {/* Repositioned Search Input */}`;
const compactViewBlock = content.substring(content.indexOf(target4), content.indexOf(endTarget4));

// Now put them in the requested order:
// Attendance -> Result Column -> Mode Select -> View Settings -> Compact View Toggle
// Wait, the user said: "Result column and Mode dropdown should be placed between Attendance and Compact view."

// Currently they are between View Settings Menu and Compact View.
// If I move Result Column and Mode Dropdown BEFORE View Settings, then they are:
// Attendance -> Result Column -> Mode Select -> View Settings -> Compact View Toggle.
// But the user might want:
// Attendance -> Result Column -> Mode Select -> Compact View Toggle -> View Settings Menu.

// Let's just output the blocks and piece them together.
const oldFullStr = viewSettingsBlock + resultColBlock + modeSelectBlock + compactViewBlock;

const newFullStr = resultColBlock + modeSelectBlock + compactViewBlock + viewSettingsBlock;

if (content.includes(oldFullStr)) {
  content = content.replace(oldFullStr, newFullStr);
  fs.writeFileSync('src/App.tsx', content);
  console.log("Reordered blocks.");
} else {
  console.log("Blocks not found exactly.");
}

