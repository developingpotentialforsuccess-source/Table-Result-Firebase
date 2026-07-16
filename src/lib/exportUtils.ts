import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ClassRecord, Level, Student, calculateGrade, calculateStatus } from '../types';
import { calculateAttendancePercentage } from './attendanceUtils';
import { isMidtermCategory, isFinalCategory, getStudentScoreValue } from './categoryUtils';

function getActiveAbbreviations(currentLevel: Level) {
  const allNames = currentLevel.subjects.flatMap(s => [s.name, ...s.categories.map(c => c.name)]).join(' ');
  const abbs = [
    { key: "Alphabet Dict.", text: "Alphabet Dict.: Alphabet Dictation" },
    { key: "Alphabet Recogn.", text: "Alphabet Recogn.: Alphabet Recognition" },
    { key: "Alphabet Writ.", text: "Alphabet Writ.: Alphabet Writing" },
    { key: "Alphabet and W. Trac.", text: "Alphabet and W. Trac.: Alphabet and Word Tracing" },
    { key: "Individual Speak.", text: "Individual Speak.: Individual Speaking" },
    { key: "Pair Conver.", text: "Pair Conver.: Pair Conversation" }
  ];
  return abbs.filter(abb => allNames.includes(abb.key));
}

export function exportToExcel(currentRecord: ClassRecord, currentLevel: Level, resultMode: 'full' | 'midterm' | 'final' = 'full', students?: Student[]) {
  const data = generateExportData(currentRecord, currentLevel, resultMode, students);
  
  // Calculate Dashboard Statistics
  const total = data.length;
  const passed = data.filter(r => r['Grade'] === 'Pass' || r['Grade'] === 'Promoted').length;
  const failed = total - passed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";
  
  const gradeDist = data.reduce((acc: any, r) => {
    const g = r['Grade'];
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const modeLabel = resultMode === 'midterm' ? 'Mid-term Test Results' : (resultMode === 'final' ? 'Final Test Results' : 'Termly Results');

  // 1. Grades Sheet
  const gradesWs = utils.json_to_sheet([]);
  
  utils.sheet_add_aoa(gradesWs, [
    [`Testing Period: ${modeLabel}`],
    [`Teacher: ${currentRecord.teacherName} | Level: ${currentLevel.name} | Class: ${currentRecord.className}`],
    []
  ], { origin: "A1" });

  utils.sheet_add_json(gradesWs, data, { origin: "A4", skipHeader: false });
  
  const today = new Date();
  const dateStr = `Date: Phnom Penh, ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const activeAbbs = getActiveAbbreviations(currentLevel);
  const footerData: any[][] = [[]];
  if (activeAbbs.length > 0) {
    footerData.push(["Abbreviations:"]);
    activeAbbs.forEach((abb, idx) => {
      if (idx === 0) {
        footerData.push([abb.text, "", "", "", "", "", dateStr]);
      } else if (idx === 1) {
        footerData.push([abb.text, "", "", "", "", "", "Academic Manager"]);
      } else if (idx === activeAbbs.length - 1) {
        footerData.push([abb.text, "", "", "", "", "", "Sek Sokha"]);
      } else {
        footerData.push([abb.text]);
      }
    });
  } else {
    footerData.push(["", "", "", "", "", "", dateStr]);
    footerData.push(["", "", "", "", "", "", "Academic Manager"]);
    footerData.push(["", "", "", "", "", "", ""]);
    footerData.push(["", "", "", "", "", "", "Sek Sokha"]);
  }

  utils.sheet_add_aoa(gradesWs, footerData, { origin: -1 });

  // Set column widths for grades
  const colWidths = [{ wch: 5 }, { wch: 25 }, { wch: 8 }];
  currentLevel.subjects.forEach(() => colWidths.push({ wch: 15 }));
  colWidths.push({ wch: 15 }, { wch: 10 }, { wch: 15 });
  gradesWs['!cols'] = colWidths;

  // 2. Dashboard Sheet
  const dashboardWs = utils.json_to_sheet([]);
  
  utils.sheet_add_aoa(dashboardWs, [
    [], [], [], [], [], // 5 empty rows for custom logo space
    [`DEVELOPING POTENTIAL FOR SUCCESS - GRADE BOOK SUMMARY`],
    [`Class: ${currentRecord.className}`],
    [`Term: ${currentRecord.termName}  |  Teacher: ${currentRecord.teacherName}  |  Level: ${currentLevel.name}`],
    [`Report Period: ${modeLabel}`],
    [],
    [`PERFORMANCE DASHBOARD`],
    [`Total Students: ${total}`],
    [`Passed: ${passed} (${passRate}%)`],
    [`Failed: ${failed}`],
    [],
    [`Grade Distribution:`],
    [`A: ${gradeDist['A'] || 0}`],
    [`B: ${gradeDist['B'] || 0}`],
    [`C: ${gradeDist['C'] || 0}`],
    [`D: ${gradeDist['D'] || 0}`],
    [`F: ${gradeDist['F'] || 0}`],
  ], { origin: "A1" });
  
  dashboardWs['!cols'] = [{ wch: 50 }];

  const wb = utils.book_new();
  utils.book_append_sheet(wb, gradesWs, "Grades");
  utils.book_append_sheet(wb, dashboardWs, "Dashboard");

  const fileSuffix = resultMode === 'midterm' ? 'Midterm' : (resultMode === 'final' ? 'Final_Test' : 'Full_Term');
  writeFile(wb, `${currentRecord.className}_${currentRecord.termName}_${fileSuffix}_Summary.xlsx`.replace(/\s+/g, '_'));
}

export function exportToPDF(currentRecord: ClassRecord, currentLevel: Level, resultMode: 'full' | 'midterm' | 'final' = 'full', students?: Student[]) {
  const doc = new jsPDF('landscape');
  const data = generateExportData(currentRecord, currentLevel, resultMode, students);
  
  // Calculate Dashboard Statistics
  const total = data.length;
  const passed = data.filter(r => r['Grade'] === 'Pass' || r['Grade'] === 'Promoted').length;
  const failed = total - passed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";
  const gradeDist = data.reduce((acc: any, r) => {
    const g = r['Grade'];
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const modeLabel = resultMode === 'midterm' ? 'Mid-term Test Results' : (resultMode === 'final' ? 'Final Test Results' : 'Termly Results');

  // Leave top 28mm blank for logo positioning, start title at Y=34
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text(`DEVELOPING POTENTIAL FOR SUCCESS`, 14, 34);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`GRADE BOOK SUMMARY - ${modeLabel}`, 14, 40);
  doc.text(`Class: ${currentRecord.className} | Term: ${currentRecord.termName} | Teacher: ${currentRecord.teacherName} | Level: ${currentLevel.name}`, 14, 46);

  // Dashboard Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(180, 30, 100, 20, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.setFont(undefined, 'bold');
  doc.text("PERFORMANCE DASHBOARD", 185, 36);
  doc.setFont(undefined, 'normal');
  doc.text(`Total: ${total} | Pass: ${passed} (${passRate}%) | Fail: ${failed}`, 185, 41);
  doc.text(`Grades: A:${gradeDist['A']||0} B:${gradeDist['B']||0} C:${gradeDist['C']||0} D:${gradeDist['D']||0} F:${gradeDist['F']||0}`, 185, 46);

  const headers = Object.keys(data[0] || {});
  const rows = data.map(row => headers.map(h => row[h as keyof typeof row]));

  // @ts-ignore
  doc.autoTable({
    startY: 52,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246], fontSize: 8, fontStyle: 'bold', halign: 'center', textColor: 255 },
    styles: { fontSize: 7, cellPadding: 2, lineColor: [200, 200, 200], lineWidth: 0.1 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 35, fontStyle: 'bold' }
    },
    didDrawCell: (data: any) => {
      if (data.section === 'body' && data.column.index > 1) {
        const text = data.cell.text[0];
        if (text === 'Pass' || text === 'Promoted' || text?.startsWith('A') || text?.startsWith('B')) {
          doc.setTextColor(21, 128, 61); // Green
        } else if (text === 'Fail' || text?.startsWith('F') || text?.startsWith('E') || text?.startsWith('D')) {
          doc.setTextColor(220, 38, 38); // Red
        }
      }
    }
  });

  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY || 40;
  const footerY = finalY + 12;
  
  doc.setFontSize(8);
  const activeAbbs = getActiveAbbreviations(currentLevel);
  let nextY = footerY;
  if (activeAbbs.length > 0) {
    doc.text("Abbreviations:", 14, nextY);
    activeAbbs.forEach(abb => {
      nextY += 4;
      doc.text(abb.text, 14, nextY);
    });
  }

  const rightX = 220; 
  const today = new Date();
  const dateStr = `Date: Phnom Penh, ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  
  doc.text(dateStr, rightX, footerY);
  doc.text("Academic Manager", rightX, footerY + 4);
  doc.text("Sek Sokha", rightX, footerY + 20);

  const fileSuffix = resultMode === 'midterm' ? 'Midterm' : (resultMode === 'final' ? 'Final_Test' : 'Full_Term');
  doc.save(`${currentRecord.className}_${currentRecord.termName}_${fileSuffix}_Summary.pdf`.replace(/\s+/g, '_'));
}

export function generateExportData(currentRecord: ClassRecord, currentLevel: Level, resultMode: 'full' | 'midterm' | 'final', students?: Student[], detailMode: 'subjects' | 'categories' | 'both' = 'subjects') {
  const activeStudents = (students?.length ? students : (currentRecord.students || [])).filter(s => !s.isHidden);

  const getCategoryActiveWeight = (cat: any, subject: any, mode: 'midterm' | 'final' | 'full') => {
    if (mode === 'midterm') {
      return isMidtermCategory(cat) ? (cat.weight ?? 0) : 0;
    }
    if (mode === 'final') {
      return isFinalCategory(cat) ? (cat.weight ?? 0) : 0;
    }
    if (isMidtermCategory(cat)) {
      return subject?.fullModeMidtermWeight ?? cat.weight ?? 0;
    }
    if (isFinalCategory(cat)) {
      return subject?.fullModeFinalWeight ?? cat.weight ?? 0;
    }
    return cat.weight ?? 0;
  };

  // Pre-calculate final scores and ranks
  const scores = activeStudents.map(student => {
    const subjectAvgs: Record<string, number> = {};
    const subjectWtds: Record<string, number> = {};
    let totalWeightedSum = 0;
    let totalWeightSum = 0;

    currentLevel.subjects.forEach(subject => {
      const calculateModeMetrics = (mode: 'midterm' | 'final' | 'full') => {
        let points = 0;
        let weight = 0;
        let hasAnyScore = false;

        subject.categories.forEach(cat => {
          const isMid = isMidtermCategory(cat);
          const isFin = isFinalCategory(cat);
          const activeWeight = getCategoryActiveWeight(cat, subject, mode);
          const isVisible = mode === 'full' ? true : mode === 'midterm' ? isMid : isFin;
          if (!isVisible) return;

          let catEarned = 0;
          let catMax = 0;
          let hasCatScore = false;
          for (let i = 0; i < cat.itemCount; i++) {
            const s = getStudentScoreValue(student.scores, cat.id, i, mode, cat);
            if (typeof s === 'number') {
              catEarned += s;
              catMax += (cat.itemMaxScores?.[i] || 100);
              hasCatScore = true;
              hasAnyScore = true;
            } else if (currentRecord.settings?.treatBlanksAsZero) {
              catEarned += 0;
              catMax += (cat.itemMaxScores?.[i] || 100);
              hasCatScore = true;
            }
          }
          const catPct = catMax > 0 ? (catEarned / catMax) * 100 : 0;
          if (hasCatScore && activeWeight > 0) {
            points += (catPct / 100) * activeWeight;
            weight += activeWeight;
          }
        });
        return { points, weight, hasAnyScore };
      };

      const fullMetrics = calculateModeMetrics('full');
      const midMetrics = calculateModeMetrics('midterm');
      const finalMetrics = calculateModeMetrics('final');

      const midKey = `exam_midterm_${subject.id}_-1`;
      const finalKey = `exam_final_${subject.id}_-1`;

      let midResultPct = midMetrics.weight > 0 ? (midMetrics.points / midMetrics.weight) * 100 : 0;
      let hasMidScore = midMetrics.hasAnyScore;
      const midScore = student.scores[midKey];
      if (typeof midScore === 'number') {
        const midMax = subject.midtermMaxScore || 100;
        midResultPct = (midScore / midMax) * 100;
        hasMidScore = true;
      }

      let finalResultPct = finalMetrics.weight > 0 ? (finalMetrics.points / finalMetrics.weight) * 100 : 0;
      let hasFinalScore = finalMetrics.hasAnyScore;
      const finalScore = student.scores[finalKey];
      if (typeof finalScore === 'number') {
        const finalMax = subject.finalMaxScore || 100;
        finalResultPct = (finalScore / finalMax) * 100;
        hasFinalScore = true;
      }

      let subjectPercentage = 0;
      let hasSubjectScore = false;
      let subjectScoreRaw = 0;

      const midCats = subject.categories.filter(isMidtermCategory);
      const finalCats = subject.categories.filter(isFinalCategory);
      const midWeightContrib = subject.fullModeMidtermWeight ?? midCats.reduce((sum, c) => sum + (c.weight ?? 0), 0);
      const finalWeightContrib = subject.fullModeFinalWeight ?? finalCats.reduce((sum, c) => sum + (c.weight ?? 0), 0);

      const midPoints = (midResultPct / 100) * (midWeightContrib || 0);
      const finPoints = (finalResultPct / 100) * (finalWeightContrib || 0);

      if (resultMode === 'midterm') {
        subjectPercentage = midResultPct;
        hasSubjectScore = hasMidScore || midMetrics.hasAnyScore;
        subjectWtds[subject.name] = midMetrics.points; // Raw weighted points sum for midterm (like UI)
      } else if (resultMode === 'final') {
        subjectPercentage = finalResultPct;
        hasSubjectScore = hasFinalScore || finalMetrics.hasAnyScore;
        subjectWtds[subject.name] = finalMetrics.points; // Raw weighted points sum for final (like UI)
      } else {
        const otherCats = subject.categories.filter(cat => !isMidtermCategory(cat) && !isFinalCategory(cat));
        let otherWeightedSum = 0;
        otherCats.forEach(cat => {
          let catEarned = 0;
          let catMax = 0;
          let hasCatScore = false;
          for (let i = 0; i < cat.itemCount; i++) {
            const s = getStudentScoreValue(student.scores, cat.id, i, 'full', cat);
            if (typeof s === 'number') {
              catEarned += s;
              catMax += (cat.itemMaxScores?.[i] || 100);
              hasCatScore = true;
            } else if (currentRecord.settings?.treatBlanksAsZero) {
              catEarned += 0;
              catMax += (cat.itemMaxScores?.[i] || 100);
              hasCatScore = true;
            }
          }
          const catPct = catMax > 0 ? (catEarned / catMax) * 100 : 0;
          if (hasCatScore && cat.weight > 0) {
            otherWeightedSum += (catPct / 100) * cat.weight;
          }
        });

        subjectScoreRaw = otherWeightedSum + midPoints + finPoints;
        subjectPercentage = subjectScoreRaw;
        hasSubjectScore = hasMidScore || hasFinalScore || subject.categories.some(cat => {
          for (let i = 0; i < cat.itemCount; i++) {
            if (typeof getStudentScoreValue(student.scores, cat.id, i, 'full', cat) === 'number') return true;
          }
          return false;
        });
        subjectWtds[subject.name] = subjectScoreRaw;
      }

      subjectAvgs[subject.name] = subjectPercentage;

      const targetWeight = resultMode === 'midterm' 
        ? (subject.midtermTargetWeight ?? subject.targetWeight ?? 100)
        : resultMode === 'final'
          ? (subject.finalTargetWeight ?? subject.targetWeight ?? 100)
          : (subject.targetWeight ?? 100);

      const divideByAll = currentRecord.settings?.divideByAllSubjects !== false;
      if (divideByAll || hasSubjectScore) {
        totalWeightSum += targetWeight;
      }
      if (hasSubjectScore) {
        let pct = 0;
        if (resultMode === 'midterm') {
          pct = midResultPct;
        } else if (resultMode === 'final') {
          pct = finalResultPct;
        } else {
          const otherCats = subject.categories.filter(cat => !isMidtermCategory(cat) && !isFinalCategory(cat));
          const otherWeightTotal = otherCats.reduce((sum, c) => sum + (c.weight ?? 0), 0);
          const totalComponentsWeight = otherWeightTotal + (midWeightContrib || 0) + (finalWeightContrib || 0);
          pct = totalComponentsWeight > 0 ? (subjectScoreRaw / totalComponentsWeight) * 100 : 0;
        }
        totalWeightedSum += (pct / 100) * targetWeight;
      }
    });

    const attWeight = currentLevel.attendanceWeight || 0;
    if (resultMode === 'full' && attWeight > 0) {
      const attPct = calculateAttendancePercentage(student, currentRecord.settings || ({} as any));
      totalWeightSum += attWeight;
      totalWeightedSum += (attPct / 100) * attWeight;
    }

    const performancePct = totalWeightSum > 0 ? (totalWeightedSum / totalWeightSum) * 100 : 0;

    return { id: student.id, finalScore: performancePct, subjectAvgs, subjectWtds };
  });

  const sortedScores = [...scores].sort((a, b) => b.finalScore - a.finalScore);

  return activeStudents.map((student, index) => {
    const metrics = scores.find(s => s.id === student.id)!;
    const finalScore = metrics.finalScore;

    const computedAttendance = currentRecord.settings?.showAttendance !== false
      ? `${calculateAttendancePercentage(student, currentRecord.settings || ({} as any)).toFixed(2)}%`
      : student.attendance;

    const status = calculateStatus(finalScore, resultMode, currentRecord.settings, computedAttendance, currentLevel);

    const row: any = {
      'No': index + 1,
      'Student\'s Full Name': currentRecord.settings?.hideStudentNames ? `Student ${index + 1}` : student.name,
      'Sex': student.sex === 'Female' ? 'F' : 'M',
    };

    if (resultMode === 'full') {
      const attRaw = computedAttendance ? computedAttendance.trim() : '';
      if (attRaw) {
        const cleaned = attRaw.replace('%', '');
        const parsed = parseFloat(cleaned);
        row['Attnd'] = isNaN(parsed) ? attRaw : parsed;
      } else {
        row['Attnd'] = 100;
      }
    }

    currentLevel.subjects.forEach(subject => {
      // Add Subject column if requested
      if (detailMode === 'subjects' || detailMode === 'both') {
        if (resultMode === 'full') {
          const subjectTargetWeight = subject.targetWeight ?? 100;
          const key = `${subject.name} (${subjectTargetWeight}%)`;
          const contribution = metrics.subjectWtds[subject.name] || 0;
          row[key] = parseFloat(contribution.toFixed(1));
        } else {
          row[`${subject.name}`] = parseFloat((metrics.subjectAvgs[subject.name] || 0).toFixed(1));
        }
      }

      // Add Category columns if requested
      if (detailMode === 'categories' || detailMode === 'both') {
        subject.categories.forEach(cat => {
          const isMid = isMidtermCategory(cat);
          const isFin = isFinalCategory(cat);
          const isVisible = resultMode === 'full' ? true : resultMode === 'midterm' ? isMid : isFin;
          if (!isVisible) return;

          let earned = 0;
          let max = 0;
          let hasAny = false;
          for (let i = 0; i < cat.itemCount; i++) {
            const s = getStudentScoreValue(student.scores, cat.id, i, resultMode, cat);
            if (typeof s === 'number') {
              earned += s;
              max += (cat.itemMaxScores?.[i] || 100);
              hasAny = true;
            } else if (currentRecord.settings?.treatBlanksAsZero) {
              earned += 0;
              max += (cat.itemMaxScores?.[i] || 100);
              hasAny = true;
            }
          }
          
          const weight = resultMode === 'midterm'
            ? (cat.midtermWeight ?? cat.weight ?? 0)
            : resultMode === 'final'
              ? (cat.finalWeight ?? cat.weight ?? 0)
              : (cat.weight ?? 0);

          // Calculate score based on user's preference:
          // If weight > 0, score is weighted contribution (e.g., out of 10). If weight is 0, score is out of 100.
          const score = max > 0 ? (earned / max) * (weight > 0 ? weight : 100) : 0;

          let label = detailMode === 'both' ? `${subject.name}: ${cat.name}` : cat.name;
          if (weight > 0) {
            label += ` (${weight}%)`;
          }
          row[label] = parseFloat(score.toFixed(1));
        });
      }
    });

    row['Total'] = parseFloat(finalScore.toFixed(2));
    row['Grade'] = status;

    return row;
  });
}
