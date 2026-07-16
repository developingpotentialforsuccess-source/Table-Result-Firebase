const fs = require('fs');
let content = fs.readFileSync('src/lib/excelExport.ts', 'utf8');

// We need to inject the logic for headerDarkness and subjectBgLevel

const targetStr = `  // Apply custom Excel header color if set
  if (settings.excelHeaderColor) {
    headerBg = 'FF' + settings.excelHeaderColor.replace('#', '').toUpperCase();
    // Use white text if the background is dark
    const r = parseInt(headerBg.slice(2, 4), 16);
    const g = parseInt(headerBg.slice(4, 6), 16);
    const b = parseInt(headerBg.slice(6, 8), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    headerText = brightness < 128 ? 'FFFFFFFF' : 'FF000000';
  } else {
    switch (styleIndex) {`;

const newStr = `  const headerDarkness = settings.headerDarkness || 'black';
  const subjectBgLevel = settings.subjectBgLevel || 'light';

  // Apply custom Excel header color if set
  if (settings.excelHeaderColor) {
    headerBg = 'FF' + settings.excelHeaderColor.replace('#', '').toUpperCase();
    // Use white text if the background is dark
    const r = parseInt(headerBg.slice(2, 4), 16);
    const g = parseInt(headerBg.slice(4, 6), 16);
    const b = parseInt(headerBg.slice(6, 8), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    headerText = brightness < 128 ? 'FFFFFFFF' : 'FF000000';
  } else {
    switch (styleIndex) {`;

content = content.replace(targetStr, newStr);

// Now for subjectBgLevel:
const target2 = `        // Simple hash-based color selection for diversity
        const hash = h.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        const colors = [
          'FFDBEAFE', 'FFEDE9FE', 'FFDBEAFE', 'FFFCE7F3', 'FFDCFCE7', 'FFFFEDD5', 'FFCCFBF1', 'FFECFCCB'
        ];
        currentCellBg = colors[Math.abs(hash) % colors.length];
        isCustomBg = true;`;

const new2 = `        // Simple hash-based color selection for diversity
        const hash = h.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
        let colors = [];
        if (subjectBgLevel === 'none') {
            colors = ['FFFFFFFF'];
            isCustomBg = false;
        } else if (subjectBgLevel === 'dark') {
            colors = ['FF3B82F6', 'FF8B5CF6', 'FFEC4899', 'FF10B981', 'FFF59E0B', 'FF06B6D4', 'FF84CC16', 'FF6366F1'];
            isCustomBg = true;
        } else if (subjectBgLevel === 'medium') {
            colors = ['FF93C5FD', 'FFC4B5FD', 'FFF9A8D4', 'FF6EE7B7', 'FFFCD34D', 'FF67E8F9', 'FFBEF264', 'FFA5B4FC'];
            isCustomBg = true;
        } else {
            colors = ['FFDBEAFE', 'FFEDE9FE', 'FFDBEAFE', 'FFFCE7F3', 'FFDCFCE7', 'FFFFEDD5', 'FFCCFBF1', 'FFECFCCB'];
            isCustomBg = true;
        }
        currentCellBg = colors[Math.abs(hash) % colors.length];
        if (subjectBgLevel !== 'none') isCustomBg = true;`;

content = content.replace(target2, new2);

const target3 = `    if (currentCellBg !== 'FFFFFFFF') {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: currentCellBg } }; 
    }`;
const new3 = `    // Override main header bg based on headerDarkness
    if (!weightMatch && !isCustomBg && !settings.excelHeaderColor) {
        if (headerDarkness === 'none') {
            currentCellBg = 'FFFFFFFF';
            headerText = 'FF000000';
        } else if (headerDarkness === 'light') {
            currentCellBg = 'FFF1F5F9';
            headerText = 'FF000000';
        } else if (headerDarkness === 'medium') {
            currentCellBg = 'FF94A3B8';
            headerText = 'FFFFFFFF';
        } else if (headerDarkness === 'dark') {
            currentCellBg = 'FF334155';
            headerText = 'FFFFFFFF';
        } else if (headerDarkness === 'black') {
            currentCellBg = 'FF000000';
            headerText = 'FFFFFFFF';
        }
    }
    
    // Check text contrast for subject categories
    if (isCustomBg) {
       if (subjectBgLevel === 'dark') {
           cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Times New Roman' };
       } else {
           cell.font = { bold: true, color: { argb: 'FF000000' }, name: 'Times New Roman' };
       }
    } else {
       cell.font = { bold: true, color: { argb: headerText }, name: 'Times New Roman' };
    }

    if (currentCellBg !== 'FFFFFFFF') {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: currentCellBg } }; 
    }`;

content = content.replace(`    if (currentCellBg !== 'FFFFFFFF') {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: currentCellBg } }; 
    }`, new3);

fs.writeFileSync('src/lib/excelExport.ts', content);
console.log("Updated excelExport.ts");
