import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ClassRecord, Level, Student } from '../types';
import { generateExportData } from './exportUtils';

function addPage(doc: jsPDF, currentRecord: ClassRecord, currentLevel: Level, resultMode: 'full' | 'midterm' | 'final', addPageBreak: boolean, students?: Student[]) {
  if (addPageBreak) doc.addPage();
  
  const data = generateExportData(currentRecord, currentLevel, resultMode, students);
  
  const total = data.length;
  const passed = data.filter(r => r['Grade'] === 'Pass' || r['Grade'] === 'Promoted' || r['Grade'] === 'A' || r['Grade'] === 'B' || r['Grade'] === 'C').length;
  const failed = total - passed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "0.0";
  const gradeDist = data.reduce((acc: any, r) => {
    const g = r['Grade'];
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const modeLabel = resultMode === 'midterm' ? 'Mid-term Test Results' : (resultMode === 'final' ? 'Final Test Results' : 'Termly Results');

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

  if (data.length === 0) return;

  const headers = Object.keys(data[0] || {});
  const rows = data.map(row => headers.map(h => row[h as keyof typeof row]));

  // @ts-ignore
  doc.autoTable({
    startY: 52,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold', halign: 'center', textColor: 0, lineColor: [100, 100, 100], lineWidth: 0.2 },
    styles: { fontSize: 7, cellPadding: 2, lineColor: [100, 100, 100], lineWidth: 0.1, textColor: 0, font: 'times' },
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
  doc.setTextColor(30, 41, 59);

  const allNames = currentLevel.subjects.flatMap(s => [s.name, ...s.categories.map(c => c.name)]).join(' ');
  const abbreviationDefinitions = [
    { key: "Alphabet Dict.", text: "Alphabet Dict.: Alphabet Dictation" },
    { key: "Alphabet Recogn.", text: "Alphabet Recogn.: Alphabet Recognition" },
    { key: "Alphabet Writ.", text: "Alphabet Writ.: Alphabet Writing" },
    { key: "Alphabet and W. Trac.", text: "Alphabet and W. Trac.: Alphabet and Word Tracing" },
    { key: "Individual Speak.", text: "Individual Speak.: Individual Speaking" },
    { key: "Pair Conver.", text: "Pair Conver.: Pair Conversation" }
  ];
  const activeAbbreviations = abbreviationDefinitions.filter(abb => 
    allNames.includes(abb.key)
  );

  let nextY = footerY;
  if (activeAbbreviations.length > 0) {
    doc.text("Abbreviations:", 14, nextY);
    activeAbbreviations.forEach(abb => {
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
}

export function exportToPDFFull(currentRecord: ClassRecord, currentLevel: Level, students?: Student[]) {
  const doc = new jsPDF('landscape');
  
  addPage(doc, currentRecord, currentLevel, 'midterm', false, students);
  addPage(doc, currentRecord, currentLevel, 'final', true, students);
  addPage(doc, currentRecord, currentLevel, 'full', true, students);

  doc.save(`${currentRecord.className}_${currentRecord.termName}_All_Results.pdf`.replace(/\s+/g, '_'));
}
