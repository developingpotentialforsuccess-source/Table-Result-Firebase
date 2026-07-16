import { ClassRecord, Level, Student, TeacherSettings } from '../types';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { generateExportData } from './exportUtils';

function createSheetData(wb: ExcelJS.Workbook, currentRecord: ClassRecord, currentLevel: Level, resultMode: 'full' | 'midterm' | 'final', sheetName: string, styleIndex: number, gridLineLevel: string = 'medium', students?: Student[], detailMode: 'subjects' | 'categories' | 'both' = 'subjects') {
  const data = generateExportData(currentRecord, currentLevel, resultMode, students, detailMode);
  const settings = (currentRecord.settings || {}) as TeacherSettings;
  
  if (data.length === 0) {
    console.warn(`No data found for sheet: ${sheetName} in mode: ${resultMode}`);
    return;
  }

  const ws = wb.addWorksheet(sheetName);
  
  ws.pageSetup.orientation = 'landscape';
  
  // Set Column A width to 2, starting content in Column B
  ws.getColumn(1).width = 2;
  const headers = Object.keys(data[0]);
  
  // Calculate total columns for merging (start at B)
  const totalCols = headers.length;
  const endCol = totalCols + 1; // 1-based, B is 2, so endCol is headers.length + 1
  
  // We'll use a helper to center text across the table width
  const centerMerge = (rowNum: number, text: string, bold: boolean = false, size: number = 11) => {
    ws.mergeCells(rowNum, 2, rowNum, endCol);
    const cell = ws.getCell(rowNum, 2);
    cell.value = text;
    cell.font = { bold, size, name: 'Times New Roman' };
    cell.alignment = { horizontal: 'center' };
  };

  const modeLabel = resultMode === 'midterm' ? 'Mid-term Test Result' : (resultMode === 'final' ? 'Final Test Result' : 'Termly Result');
  
  centerMerge(1, "Developing Potential for Success School", true, 14);
  centerMerge(2, "Building Wisdom with Virtues", false, 12);
  centerMerge(3, "Full-time English Program", true, 12);
  centerMerge(4, modeLabel, true, 12);
  centerMerge(5, "Testing Dates: April 27-29, 2026", true, 12);

  // Row 7 for Teacher, Level, Shift
  ws.getCell(7, 2).value = `Teachers: ${currentRecord.teacherName}`;
  ws.getCell(7, 2).font = { name: 'Times New Roman', size: 11 };
  ws.getCell(7, 2).alignment = { horizontal: 'left' };
  
  const midCol = Math.floor(endCol / 2) + 1;
  ws.getCell(7, midCol).value = `Level: ${currentLevel.name}`;
  ws.getCell(7, midCol).font = { name: 'Times New Roman', size: 11 };
  ws.getCell(7, midCol).alignment = { horizontal: 'center' };

  ws.getCell(7, endCol).value = `Shift: Morning`;
  ws.getCell(7, endCol).font = { name: 'Times New Roman', size: 11 };
  ws.getCell(7, endCol).alignment = { horizontal: 'right' };

  // Define style themes based on user choice
  let headerBg = 'FFFFFFFF'; // White by default for simple
  let headerText = 'FF000000'; // Black text
  let altRowBg = 'FFFFFFFF'; // No alt row color for simple
  let borderColor = 'FF64748B'; // Darker grid lines (slate-500)
  let passColor = 'FF15803D';
  let failColor = 'FFDC2626';

  const headerDarkness = settings.headerDarkness || 'black';
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
    switch (styleIndex) {
      case 1: // Simple / Standard
        break; 
      case 2: // Minimalist Grayscale
        headerBg = 'FF334155';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFF1F5F9';
        borderColor = 'FF94A3B8';
        passColor = 'FF000000';
        failColor = 'FF000000';
        break;
      case 3: // Professional Green
        headerBg = 'FF047857';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFF0FDF4';
        borderColor = 'FF86EFAC';
        passColor = 'FF047857';
        failColor = 'FFDC2626';
        break;
      case 4: // Vibrant Purple
        headerBg = 'FF7E22CE';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFFAF5FF';
        borderColor = 'FFD8B4FE';
        passColor = 'FF16A34A';
        failColor = 'FFEA580C';
        break;
      case 5: // High Contrast Dark
        headerBg = 'FF000000';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFE2E8F0';
        borderColor = 'FF64748B';
        passColor = 'FF166534';
        failColor = 'FF991B1B';
        break;
      case 6: // DPS Corporate Navy
        headerBg = 'FF1E3A8A';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFF1F5F9';
        borderColor = 'FF94A3B8';
        passColor = 'FF1E3A8A';
        failColor = 'FFDC2626';
        break;
      case 7: // Warm Orange
        headerBg = 'FFEA580C';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFFFF7ED';
        borderColor = 'FFFDBA74';
        passColor = 'FF15803D';
        failColor = 'FFEA580C';
        break;
      case 8: // Sky Blue
        headerBg = 'FF0284C7';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFF0F9FF';
        borderColor = 'FF7DD3FC';
        passColor = 'FF0369A1';
        failColor = 'FFBE123C';
        break;
      case 9: // Rose Pink
        headerBg = 'FFE11D48';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFFDF2F8';
        borderColor = 'FFF9A8D4';
        passColor = 'FFBE123C';
        failColor = 'FF000000';
        break;
      case 10: // Amber Gold
        headerBg = 'FFD97706';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFFEF3C7';
        borderColor = 'FFFCD34D';
        passColor = 'FF92400E';
        failColor = 'FFB91C1C';
        break;
      case 11: // Teal
        headerBg = 'FF0D9488';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFF0FDFA';
        borderColor = 'FF5EEAD4';
        passColor = 'FF0F766E';
        failColor = 'FF991B1B';
        break;
      case 12: // Slate Dark
        headerBg = 'FF334155';
        headerText = 'FFFFFFFF';
        altRowBg = 'FFF8FAFC';
        borderColor = 'FFCBD5E1';
        passColor = 'FF1E293B';
        failColor = 'FFB91C1C';
        break;
    }
  }
  
  const borderStyleVal: any = gridLineLevel === 'light' ? 'hair' : (gridLineLevel === 'heavy' ? 'thick' : (gridLineLevel === 'none' ? 'none' : 'thin'));

  // Create table header
  const headerRow = ws.getRow(8);
  headers.forEach((h, index) => {
    const cell = headerRow.getCell(index + 2); // Start from B
    cell.value = h;
    
    // Determine cell color and comment
    let currentCellBg = headerBg;
    
    // Check if it's a weighted column
    const weightMatch = h.match(/\((\d+(\.\d+)?)\%\)$/);
    if (weightMatch) {
      const weight = weightMatch[1];
      cell.note = {
        texts: [
          { font: { bold: true, size: 10, name: 'Times New Roman' }, text: 'Weight Percentage:\n' },
          { font: { size: 11, color: { argb: 'FF1E3A8A' }, name: 'Times New Roman' }, text: `${weight}%` }
        ]
      };
    }

    // Assign a distinct color for categories/subjects if in category or both mode
    let isCustomBg = false;
    if (weightMatch && (detailMode === 'categories' || (detailMode === 'both' && h.includes(':')))) {
        // Simple hash-based color selection for diversity
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
        if (subjectBgLevel !== 'none') isCustomBg = true;
    }

    cell.font = { 
      bold: true, 
      color: { argb: isCustomBg ? 'FF000000' : headerText }, 
      name: 'Times New Roman' 
    };
    // Override main header bg based on headerDarkness
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

    // Override main header bg based on headerDarkness
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
    }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    if (borderStyleVal !== 'none') {
      cell.border = {
        top: { style: borderStyleVal, color: { argb: borderColor } },
        left: { style: borderStyleVal, color: { argb: borderColor } },
        bottom: { style: borderStyleVal, color: { argb: borderColor } },
        right: { style: borderStyleVal, color: { argb: borderColor } }
      };
    }
  });
  
  // Add data rows
  data.forEach((row, rowIndex) => {
    const r = ws.getRow(rowIndex + 9);
    headers.forEach((h, colIndex) => {
      const cell = r.getCell(colIndex + 2);
      cell.value = row[h as keyof typeof row] as any;
      
      const isAlt = rowIndex % 2 !== 0;
      if (isAlt) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: altRowBg } };
      }
      
      cell.font = { name: 'Times New Roman' };
      // Styling rules based on value
      if (h === 'Grade') {
        cell.font = { bold: true, name: 'Times New Roman' };
        const val = cell.value as string;
        if (val === 'Pass' || val === 'Promoted' || val?.startsWith('A') || val?.startsWith('B')) {
          cell.font = { ...cell.font, color: { argb: passColor } };
        } else if (val === 'Fail' || val?.startsWith('F') || val?.startsWith('E') || val?.startsWith('D')) {
          cell.font = { ...cell.font, color: { argb: failColor } }; 
        }
      }

      // Color-coding scores for different percentage ranges (50%, 60%, 70%...)
      const nonScoreCols = ['No', "Student's Full Name", 'Sex', 'Attnd', 'Grade'];
      if (!nonScoreCols.includes(h) && typeof cell.value === 'number') {
        const scoreVal = cell.value;
        let pctVal = scoreVal;

        // If the header matches "Subject Name (X%)", extract the weight to compute the percentage
        const headerStr = h || '';
        const weightMatch = headerStr.match(/\((\d+(\.\d+)?)\%\)$/);
        if (weightMatch) {
          const weight = parseFloat(weightMatch[1]);
          if (weight > 0) {
            pctVal = (scoreVal / weight) * 100;
          }
        }

        let scoreColor = 'FF000000';
        
        // Use custom conditional formatting if available
        if (settings.conditionalFormatting && settings.conditionalFormatting.length > 0) {
          const rule = settings.conditionalFormatting.find(r => pctVal >= r.min && pctVal <= r.max);
          if (rule) {
            scoreColor = 'FF' + rule.color.replace('#', '').toUpperCase();
          }
        } else {
          // Default logic
          if (pctVal >= 90) {
            scoreColor = 'FF059669'; // Emerald Green for 90%+ (A)
          } else if (pctVal >= 80) {
            scoreColor = 'FF2563EB'; // Vibrant Blue for 80%+ (B)
          } else if (pctVal >= 70) {
            scoreColor = 'FF7C3AED'; // Purple for 70%+ (C)
          } else if (pctVal >= 60) {
            scoreColor = 'FFE11D48'; // Rose for 60%+ (D)
          } else if (pctVal >= 50) {
            scoreColor = 'FFD97706'; // Amber/Orange for 50%+ (E)
          } else {
            scoreColor = 'FFDC2626'; // Red for < 50% (F)
          }
        }
        
        cell.font = { 
          bold: h === 'Total', 
          name: 'Times New Roman', 
          color: { argb: scoreColor } 
        };
      }

      if (h === 'Attnd' && typeof cell.value === 'number') {
        cell.numFmt = '0"%"';
      }
      
      if (borderStyleVal !== 'none') {
        cell.border = {
          top: { style: borderStyleVal, color: { argb: borderColor } },
          left: { style: borderStyleVal, color: { argb: borderColor } },
          bottom: { style: borderStyleVal, color: { argb: borderColor } },
          right: { style: borderStyleVal, color: { argb: borderColor } }
        };
      }
      
      cell.alignment = { vertical: 'middle', horizontal: colIndex === 1 ? 'left' : 'center' };
    });
  });
  
  // Auto-size columns based on header
  headers.forEach((h, index) => {
    const col = ws.getColumn(index + 2);
    if (index === 0) col.width = 6;
    else if (index === 1) col.width = 30; // Name
    else if (index === 2) col.width = 10; // Sex
    else col.width = 15;
  });
  
  // Footer
  const footerRow = data.length + 11;
  
  ws.getCell(`B${footerRow}`).value = "Notes:";
  ws.getCell(`B${footerRow}`).font = { bold: true, name: 'Times New Roman' };
  
  // Dynamic notes based on subjects
  const subjects = currentLevel.subjects;
  subjects.forEach((s, idx) => {
    ws.getCell(`B${footerRow + 1 + idx}`).value = `${idx + 1}) ${s.name}`;
    ws.getCell(`B${footerRow + 1 + idx}`).font = { name: 'Times New Roman' };
  });
  
  const allNames = currentLevel.subjects.flatMap(s => [s.name, ...s.categories.map(c => c.name)]).join(' ');
  const abbreviationDefinitions = [
    { key: "Alphabet Dict.", value: "Alphabet Dict.: Alphabet Dictation" },
    { key: "Alphabet Recogn.", value: "Alphabet Recogn.: Alphabet Recognition" },
    { key: "Alphabet Writ.", value: "Alphabet Writ.: Alphabet Writing" },
    { key: "Alphabet and W. Trac.", value: "Alphabet and W. Trac.: Alphabet and Word Tracing" },
    { key: "Individual Speak.", value: "Individual Speak.: Individual Speaking" },
    { key: "Pair Conver.", value: "Pair Conver.: Pair Conversation" }
  ];
  const activeAbbreviations = abbreviationDefinitions.filter(abb => 
    allNames.includes(abb.key)
  );

  const startAbbRow = footerRow + 1 + subjects.length + 1;
  if (activeAbbreviations.length > 0) {
    ws.getCell(`B${startAbbRow}`).value = "Abbreviations:";
    ws.getCell(`B${startAbbRow}`).font = { bold: true, name: 'Times New Roman' };
    activeAbbreviations.forEach((abb, idx) => {
      ws.getCell(`B${startAbbRow + 1 + idx}`).value = abb.value;
      ws.getCell(`B${startAbbRow + 1 + idx}`).font = { name: 'Times New Roman' };
    });
  }
  
  // right side of footer (moved further right to align with right edge)
  const signCol = Math.max(endCol - 1, 4);
  const today = new Date();
  const dateStr = `Phnom Penh ${today.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}`;
  ws.getCell(footerRow, signCol).value = dateStr;
  ws.getCell(footerRow, signCol).font = { name: 'Times New Roman', size: 12 };
  ws.getCell(footerRow, signCol).alignment = { horizontal: 'center' };
  
  ws.getCell(footerRow + 1, signCol).value = "Academic Manager";
  ws.getCell(footerRow + 1, signCol).font = { name: 'Times New Roman', size: 12 };
  ws.getCell(footerRow + 1, signCol).alignment = { horizontal: 'center' };
  
  ws.getCell(footerRow + 6, signCol).value = "Sek Sokha";
  ws.getCell(footerRow + 6, signCol).font = { name: 'Times New Roman', size: 12 };
  ws.getCell(footerRow + 6, signCol).alignment = { horizontal: 'center' };
}

function createDashboardSheet(wb: ExcelJS.Workbook, currentRecord: ClassRecord, currentLevel: Level, styleIndex: number, students?: Student[]) {
  const ws = wb.addWorksheet('Dashboard');
  ws.views = [{ showGridLines: true }];
  const settings = (currentRecord.settings || {}) as TeacherSettings;
  
  // Set widths for dashboard layout columns starting at C (col 3)
  ws.getColumn(1).width = 2;  // Left Margin
  ws.getColumn(2).width = 2;  // Left Margin
  ws.getColumn(3).width = 24; // Metric Label
  ws.getColumn(4).width = 16; // Metric Value
  ws.getColumn(5).width = 16; // Spacer / Metric Pct
  ws.getColumn(6).width = 24; // Metric Label
  ws.getColumn(7).width = 16; // Metric Value
  ws.getColumn(8).width = 16; // Right Margin Spacer

  const data = generateExportData(currentRecord, currentLevel, 'full', students);
  
  const total = data.length;
  const passed = data.filter(r => r['Grade'] === 'Pass' || r['Grade'] === 'Promoted').length;
  const failed = total - passed;
  const passRateNum = total > 0 ? (passed / total) : 0;
  
  const gradeDist = data.reduce((acc: any, r) => {
    const g = r['Grade'];
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  let headerColor = 'FF1E3A8A'; // Navy Blue default
  let headerText = 'FFFFFFFF';
  let passColor = 'FF15803D';
  let failColor = 'FFDC2626';
  let cardBgTotal = 'FFE0F2FE'; // Light Blue
  let cardBgPass = 'FFDCFCE7';  // Light Green
  let cardBgFail = 'FFFEE2E2';  // Light Red
  let themeLight = 'FFF8FAFC';  // Very light gray
  let accentBorder = 'FFCBD5E1';

  // Apply custom Excel header color if set
  if (settings.excelHeaderColor) {
    headerColor = 'FF' + settings.excelHeaderColor.replace('#', '').toUpperCase();
    // Use white text if the background is dark
    const r = parseInt(headerColor.slice(2, 4), 16);
    const g = parseInt(headerColor.slice(4, 6), 16);
    const b = parseInt(headerColor.slice(6, 8), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    headerText = brightness < 128 ? 'FFFFFFFF' : 'FF000000';
  } else {
    switch (styleIndex) {
      case 2: // Minimalist Grayscale
        headerColor = 'FF1E293B';
        passColor = 'FF000000';
        failColor = 'FF000000';
        cardBgTotal = 'FFF1F5F9';
        cardBgPass = 'FFF1F5F9';
        cardBgFail = 'FFF1F5F9';
        themeLight = 'FFFFFFFF';
        accentBorder = 'FF94A3B8';
        break;
      case 3: // Professional Green
        headerColor = 'FF047857';
        passColor = 'FF047857';
        failColor = 'FFDC2626';
        cardBgTotal = 'FFF0FDF4';
        cardBgPass = 'FFDCFCE7';
        cardBgFail = 'FFFEE2E2';
        themeLight = 'FFF8FAFC';
        accentBorder = 'FF86EFAC';
        break;
      case 4: // Vibrant Purple
        headerColor = 'FF7E22CE';
        passColor = 'FF16A34A';
        failColor = 'FFEA580C';
        cardBgTotal = 'FFFAF5FF';
        cardBgPass = 'FFECFDF5';
        cardBgFail = 'FFFFF7ED';
        themeLight = 'FFFDF4FF';
        accentBorder = 'FFD8B4FE';
        break;
      case 5: // High Contrast Dark
        headerColor = 'FF000000';
        passColor = 'FF166534';
        failColor = 'FF991B1B';
        cardBgTotal = 'FFE2E8F0';
        cardBgPass = 'FFE2E8F0';
        cardBgFail = 'FFE2E8F0';
        themeLight = 'FFFFFFFF';
        accentBorder = 'FF64748B';
        break;
      case 6: // DPS Corporate Navy
        headerColor = 'FF1E3A8A';
        passColor = 'FF1E3A8A';
        failColor = 'FFDC2626';
        cardBgTotal = 'FFF1F5F9';
        cardBgPass = 'FFDCFCE7';
        cardBgFail = 'FFFEE2E2';
        themeLight = 'FFF8FAFC';
        accentBorder = 'FF94A3B8';
        break;
      case 7: // Warm Orange
        headerColor = 'FFEA580C';
        passColor = 'FF15803D';
        failColor = 'FFEA580C';
        cardBgTotal = 'FFFFF7ED';
        cardBgPass = 'FFDCFCE7';
        cardBgFail = 'FFFEE2E2';
        themeLight = 'FFFFFFFF';
        accentBorder = 'FFFDBA74';
        break;
      case 8: // Sky Blue
        headerColor = 'FF0284C7';
        passColor = 'FF0369A1';
        failColor = 'FFBE123C';
        cardBgTotal = 'FFF0F9FF';
        cardBgPass = 'FFDCFCE7';
        cardBgFail = 'FFFEE2E2';
        themeLight = 'FFFFFFFF';
        accentBorder = 'FF7DD3FC';
        break;
      case 9: // Rose Pink
        headerColor = 'FFE11D48';
        passColor = 'FFBE123C';
        failColor = 'FF000000';
        cardBgTotal = 'FFFDF2F8';
        cardBgPass = 'FFDCFCE7';
        cardBgFail = 'FFFEE2E2';
        themeLight = 'FFFFFFFF';
        accentBorder = 'FFF9A8D4';
        break;
      case 10: // Amber Gold
        headerColor = 'FFD97706';
        passColor = 'FF92400E';
        failColor = 'FFB91C1C';
        cardBgTotal = 'FFFEF3C7';
        cardBgPass = 'FFDCFCE7';
        cardBgFail = 'FFFEE2E2';
        themeLight = 'FFFFFFFF';
        accentBorder = 'FFFCD34D';
        break;
      case 11: // Teal
        headerColor = 'FF0D9488';
        passColor = 'FF0F766E';
        failColor = 'FF991B1B';
        cardBgTotal = 'FFF0FDFA';
        cardBgPass = 'FFDCFCE7';
        cardBgFail = 'FFFEE2E2';
        themeLight = 'FFFFFFFF';
        accentBorder = 'FF5EEAD4';
        break;
      case 12: // Slate Dark
        headerColor = 'FF334155';
        passColor = 'FF1E293B';
        failColor = 'FFB91C1C';
        cardBgTotal = 'FFF8FAFC';
        cardBgPass = 'FFDCFCE7';
        cardBgFail = 'FFFEE2E2';
        themeLight = 'FFFFFFFF';
        accentBorder = 'FFCBD5E1';
        break;
    }
  }

  // --- Title Banner ---
  ws.mergeCells('C2:G3');
  const titleCell = ws.getCell('C2');
  titleCell.value = 'DEVELOPING POTENTIAL FOR SUCCESS - PERFORMANCE DASHBOARD';
  titleCell.font = { bold: true, size: 14, color: { argb: headerText }, name: 'Times New Roman' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerColor } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 20;
  ws.getRow(3).height = 20;

  // --- Meta Info Bar (Class Details) ---
  ws.mergeCells('C5:D5');
  ws.getCell('C5').value = `Class Name: ${currentRecord.className}`;
  ws.getCell('C5').font = { bold: true, size: 11, name: 'Times New Roman', color: { argb: 'FF334155' } };

  ws.mergeCells('E5:F5');
  ws.getCell('E5').value = `Term: ${currentRecord.termName} | Level: ${currentLevel.name}`;
  ws.getCell('E5').font = { bold: true, size: 11, name: 'Times New Roman', color: { argb: 'FF334155' } };

  ws.getCell('G5').value = `Teacher: ${currentRecord.teacherName}`;
  ws.getCell('G5').font = { bold: true, size: 11, name: 'Times New Roman', color: { argb: 'FF334155' } };
  ws.getCell('G5').alignment = { horizontal: 'right' };

  ws.getRow(5).height = 24;

  // --- Divider ---
  ws.getRow(6).height = 10;

  // --- KPI CARD 1: Total Students ---
  ws.mergeCells('C7:D7');
  const kpi1Title = ws.getCell('C7');
  kpi1Title.value = 'TOTAL STUDENTS';
  kpi1Title.font = { bold: true, size: 9, name: 'Times New Roman', color: { argb: 'FF475569' } };
  kpi1Title.alignment = { horizontal: 'center', vertical: 'middle' };
  kpi1Title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cardBgTotal } };

  ws.mergeCells('C8:D9');
  const kpi1Val = ws.getCell('C8');
  kpi1Val.value = total;
  kpi1Val.font = { bold: true, size: 24, name: 'Times New Roman', color: { argb: headerColor } };
  kpi1Val.alignment = { horizontal: 'center', vertical: 'middle' };
  kpi1Val.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cardBgTotal } };

  // --- KPI CARD 2: Passed Rate ---
  ws.mergeCells('E7:F7');
  const kpi2Title = ws.getCell('E7');
  kpi2Title.value = 'PASS RATE %';
  kpi2Title.font = { bold: true, size: 9, name: 'Times New Roman', color: { argb: 'FF15803D' } };
  kpi2Title.alignment = { horizontal: 'center', vertical: 'middle' };
  kpi2Title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cardBgPass } };

  ws.mergeCells('E8:F9');
  const kpi2Val = ws.getCell('E8');
  kpi2Val.value = passRateNum;
  kpi2Val.font = { bold: true, size: 24, name: 'Times New Roman', color: { argb: passColor } };
  kpi2Val.alignment = { horizontal: 'center', vertical: 'middle' };
  kpi2Val.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cardBgPass } };
  kpi2Val.numFmt = '0.0%';

  // --- KPI CARD 3: Failed Count ---
  ws.mergeCells('G7:H7');
  const kpi3Title = ws.getCell('G7');
  kpi3Title.value = 'STUDY IN OFFICE / FAIL';
  kpi3Title.font = { bold: true, size: 9, name: 'Times New Roman', color: { argb: 'FF991B1B' } };
  kpi3Title.alignment = { horizontal: 'center', vertical: 'middle' };
  kpi3Title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cardBgFail } };

  ws.mergeCells('G8:H9');
  const kpi3Val = ws.getCell('G8');
  kpi3Val.value = failed;
  kpi3Val.font = { bold: true, size: 24, name: 'Times New Roman', color: { argb: failColor } };
  kpi3Val.alignment = { horizontal: 'center', vertical: 'middle' };
  kpi3Val.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: cardBgFail } };

  // Set card cell borders
  const applyCardBorder = (startRow: number, endRow: number, startCol: number, endCol: number, bColor: string) => {
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const cell = ws.getCell(r, c);
        cell.border = {
          top: { style: r === startRow ? 'medium' : 'thin', color: { argb: bColor } },
          left: { style: c === startCol ? 'medium' : 'thin', color: { argb: bColor } },
          bottom: { style: r === endRow ? 'medium' : 'thin', color: { argb: bColor } },
          right: { style: c === endCol ? 'medium' : 'thin', color: { argb: bColor } }
        };
      }
    }
  };

  applyCardBorder(7, 9, 3, 4, headerColor);
  applyCardBorder(7, 9, 5, 6, passColor);
  applyCardBorder(7, 9, 7, 8, failColor);

  ws.getRow(7).height = 16;
  ws.getRow(8).height = 20;
  ws.getRow(9).height = 20;

  // --- Divider ---
  ws.getRow(11).height = 15;

  // --- Grade Distribution Section Header ---
  ws.mergeCells('C12:D12');
  const distTitle = ws.getCell('C12');
  distTitle.value = 'GRADE DISTRIBUTION SUMMARY';
  distTitle.font = { bold: true, size: 11, name: 'Times New Roman', color: { argb: 'FF0F172A' } };
  distTitle.alignment = { vertical: 'middle' };

  // --- Student List Summary Header ---
  ws.mergeCells('F12:G12');
  const topStudentsTitle = ws.getCell('F12');
  topStudentsTitle.value = 'TOP PERFORMING STUDENTS';
  topStudentsTitle.font = { bold: true, size: 11, name: 'Times New Roman', color: { argb: 'FF0F172A' } };
  topStudentsTitle.alignment = { vertical: 'middle' };

  ws.getRow(12).height = 22;

  // --- Grade Table Headers ---
  ws.getCell('C13').value = 'Grade / Status';
  ws.getCell('D13').value = 'Count';
  ws.getCell('E13').value = 'Ratio %';
  
  const tblHeaders = ['C13', 'D13', 'E13'];
  tblHeaders.forEach(cellRef => {
    const c = ws.getCell(cellRef);
    c.font = { bold: true, size: 10, name: 'Times New Roman', color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerColor } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = {
      top: { style: 'medium', color: { argb: headerColor } },
      bottom: { style: 'medium', color: { argb: headerColor } }
    };
  });

  // --- Top Students Headers ---
  ws.getCell('F13').value = 'Student Name';
  ws.getCell('G13').value = 'Total Score';
  ws.getCell('H13').value = 'Grade';

  const tsHeaders = ['F13', 'G13', 'H13'];
  tsHeaders.forEach(cellRef => {
    const c = ws.getCell(cellRef);
    c.font = { bold: true, size: 10, name: 'Times New Roman', color: { argb: 'FFFFFFFF' } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerColor } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = {
      top: { style: 'medium', color: { argb: headerColor } },
      bottom: { style: 'medium', color: { argb: headerColor } }
    };
  });

  ws.getRow(13).height = 18;

  // --- Populate Grade Rows ---
  let distRow = 14;
  const targetGrades = ['Pass', 'Repeat', 'Fail +', 'Auto-Repeat'];
  targetGrades.forEach(grade => {
    const rLabel = ws.getCell(`C${distRow}`);
    const rCount = ws.getCell(`D${distRow}`);
    const rPct = ws.getCell(`E${distRow}`);

    rLabel.value = grade;
    rLabel.font = { name: 'Times New Roman', size: 10 };
    rLabel.alignment = { horizontal: 'left', vertical: 'middle' };

    const cnt = gradeDist[grade] || 0;
    rCount.value = cnt;
    rCount.font = { name: 'Times New Roman', size: 10, bold: true };
    rCount.alignment = { horizontal: 'center', vertical: 'middle' };

    rPct.value = total > 0 ? (cnt / total) : 0;
    rPct.font = { name: 'Times New Roman', size: 10 };
    rPct.alignment = { horizontal: 'center', vertical: 'middle' };
    rPct.numFmt = '0.0%';

    // Cell borders
    const borderStyle: any = {
      top: { style: 'thin', color: { argb: accentBorder } },
      bottom: { style: 'thin', color: { argb: accentBorder } },
      left: { style: 'thin', color: { argb: accentBorder } },
      right: { style: 'thin', color: { argb: accentBorder } }
    };
    rLabel.border = borderStyle;
    rCount.border = borderStyle;
    rPct.border = borderStyle;

    if (distRow % 2 === 1) {
      rLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: themeLight } };
      rCount.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: themeLight } };
      rPct.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: themeLight } };
    }

    distRow++;
  });

  // --- Populate Top Students ---
  const sortedStudents = [...data].sort((a, b) => (b['Total'] || 0) - (a['Total'] || 0)).slice(0, 4);
  let studRow = 14;
  for (let i = 0; i < 4; i++) {
    const sName = ws.getCell(`F${studRow}`);
    const sScore = ws.getCell(`G${studRow}`);
    const sGrade = ws.getCell(`H${studRow}`);

    const studentItem = sortedStudents[i];
    if (studentItem) {
      sName.value = studentItem['Student\'s Full Name'];
      sScore.value = studentItem['Total'] ? (studentItem['Total'] / 100) : 0;
      sGrade.value = studentItem['Grade'];

      sName.font = { name: 'Times New Roman', size: 10 };
      sScore.font = { name: 'Times New Roman', size: 10, bold: true };
      sGrade.font = { name: 'Times New Roman', size: 10, bold: true };

      sName.alignment = { horizontal: 'left', vertical: 'middle' };
      sScore.alignment = { horizontal: 'center', vertical: 'middle' };
      sGrade.alignment = { horizontal: 'center', vertical: 'middle' };
      sScore.numFmt = '0.0%';

      // Colors for grade
      const gradeStr = studentItem['Grade'] as string;
      if (gradeStr === 'Pass' || gradeStr === 'Promoted') {
        sGrade.font = { ...sGrade.font, color: { argb: passColor } };
      } else if (gradeStr === 'Fail') {
        sGrade.font = { ...sGrade.font, color: { argb: failColor } };
      }
    } else {
      sName.value = '-';
      sScore.value = '';
      sGrade.value = '';
      sName.alignment = { horizontal: 'center' };
    }

    const borderStyle: any = {
      top: { style: 'thin', color: { argb: accentBorder } },
      bottom: { style: 'thin', color: { argb: accentBorder } },
      left: { style: 'thin', color: { argb: accentBorder } },
      right: { style: 'thin', color: { argb: accentBorder } }
    };
    sName.border = borderStyle;
    sScore.border = borderStyle;
    sGrade.border = borderStyle;

    if (studRow % 2 === 1) {
      sName.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: themeLight } };
      sScore.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: themeLight } };
      sGrade.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: themeLight } };
    }

    studRow++;
  }

  // --- Divider ---
  ws.getRow(18).height = 15;

  // --- Visual horizontal bar progress bar (Pass vs. Study in Office) ---
  ws.mergeCells('C19:H19');
  const barTitle = ws.getCell('C19');
  barTitle.value = `CLASS PERFORMANCE METRIC BAR (PASS vs STUDY IN OFFICE)`;
  barTitle.font = { bold: true, size: 10, name: 'Times New Roman', color: { argb: 'FF475569' } };
  barTitle.alignment = { vertical: 'middle' };
  ws.getRow(19).height = 18;

  // We have columns C, D, E, F, G, H (6 columns total).
  const passColsCount = Math.round(passRateNum * 6);
  const colRefs = ['C', 'D', 'E', 'F', 'G', 'H'];

  colRefs.forEach((col, index) => {
    const cell = ws.getCell(`${col}20`);
    if (index < passColsCount) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } }; // Soft green
      cell.value = index === 0 ? 'PASS RATE' : '';
      cell.font = { bold: true, size: 9, name: 'Times New Roman', color: { argb: passColor } };
    } else {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } }; // Soft red
      cell.value = index === passColsCount ? 'STUDY IN OFFICE' : '';
      cell.font = { bold: true, size: 9, name: 'Times New Roman', color: { argb: failColor } };
    }
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'medium', color: { argb: accentBorder } },
      bottom: { style: 'medium', color: { argb: accentBorder } },
      left: { style: index === 0 ? 'medium' : 'thin', color: { argb: accentBorder } },
      right: { style: index === 5 ? 'medium' : 'thin', color: { argb: accentBorder } }
    };
  });
  ws.getRow(20).height = 24;

  // --- Extra padding below ---
  ws.getCell('C22').value = `Generated on ${new Date().toLocaleDateString('en-US')} | Developing Potential for Success`;
  ws.getCell('C22').font = { italic: true, size: 8, name: 'Times New Roman', color: { argb: 'FF94A3B8' } };
}

export async function exportToExcelFull(currentRecord: ClassRecord, currentLevel: Level, styleIndex: number = 6, gridLineLevel: string = 'medium', students?: Student[], detailMode: 'subjects' | 'categories' | 'both' = 'subjects') {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Teacher Grade Calc';
  
  createDashboardSheet(wb, currentRecord, currentLevel, styleIndex, students);
  createSheetData(wb, currentRecord, currentLevel, 'midterm', 'Mid-Term Results', styleIndex, gridLineLevel, students, detailMode);
  createSheetData(wb, currentRecord, currentLevel, 'final', 'Final Test Results', styleIndex, gridLineLevel, students, detailMode);
  createSheetData(wb, currentRecord, currentLevel, 'full', 'Full Term Results', styleIndex, gridLineLevel, students, detailMode);
  
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${currentRecord.className}_${currentRecord.termName}_All_Results.xlsx`.replace(/\s+/g, '_'));
}
