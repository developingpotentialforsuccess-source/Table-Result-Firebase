const fs = require('fs');

const code = `import { Level } from '../types';

// Helper to create a consistent grading scale
const DEFAULT_SCALE = [
  { grade: 'A+', minScore: 95 },
  { grade: 'A', minScore: 90 },
  { grade: 'A-', minScore: 85 },
  { grade: 'B+', minScore: 80 },
  { grade: 'B', minScore: 75 },
  { grade: 'B-', minScore: 70 },
  { grade: 'C+', minScore: 65 },
  { grade: 'C', minScore: 60 },
  { grade: 'C-', minScore: 55 },
  { grade: 'D', minScore: 50 },
  { grade: 'E', minScore: 45 },
  { grade: 'F', minScore: 0 },
];

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', 
  '#06b6d4', '#84cc16', '#f97316', '#14b8a6', '#6366f1', '#d946ef'
];

export const SYSTEM_TEMPLATES = [
  {
    id: 'full-time-english',
    name: 'Full-Time English Program',
    authorName: 'System',
    isAdmin: true,
    levels: Array.from({ length: 12 }).map((_, i) => {
      const levelNum = Math.floor(i / 2) + 1;
      const subLevel = i % 2 === 0 ? 'A' : 'B';
      const levelName = \`Level \${levelNum}\${subLevel}\`;
      const color = COLORS[i % COLORS.length];
      
      return {
        id: \`fte_\${levelNum}\${subLevel.toLowerCase()}\`,
        name: levelName,
        customDivisor: 5,
        midtermCustomDivisor: 5,
        finalCustomDivisor: 5,
        color: color,
        gradingScale: DEFAULT_SCALE,
        subjects: [
          {
            id: \`fte_\${i}_grammar\`,
            name: 'Grammar',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            fullModeMidtermWeight: 50,
            fullModeFinalWeight: 50,
            midtermMaxScore: 100,
            finalMaxScore: 100,
            categories: [
              { id: \`fte_\${i}_g_1\`, name: 'In-class Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_g_2\`, name: 'Weekly Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_g_3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_g_4\`, name: 'Journal', weight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_g_5\`, name: 'Class Participation and Homework', weight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_g_mt\`, name: 'Midterm Grammar Test', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`fte_\${i}_g_ft\`, name: 'Final Grammar Test', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]
          },
          {
            id: \`fte_\${i}_writing\`,
            name: 'Writing',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            fullModeMidtermWeight: 50,
            fullModeFinalWeight: 50,
            midtermMaxScore: 100,
            finalMaxScore: 100,
            categories: [
              { id: \`fte_\${i}_w_1\`, name: 'In-class Quiz', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_w_2\`, name: 'Weekly Quiz', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_w_3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_w_4\`, name: 'Class Participation and Homework', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_w_mt\`, name: 'Midterm Written Test', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`fte_\${i}_w_ft\`, name: 'Final Written Test', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]
          },
          {
            id: \`fte_\${i}_reading\`,
            name: 'Reading',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            fullModeMidtermWeight: 50,
            fullModeFinalWeight: 50,
            midtermMaxScore: 100,
            finalMaxScore: 100,
            categories: [
              { id: \`fte_\${i}_r_1\`, name: 'In-class Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_r_2\`, name: 'Weekly Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_r_3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_r_4\`, name: 'Class Participation and Homework', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_r_mt\`, name: 'Midterm Reading Test', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`fte_\${i}_r_ft\`, name: 'Final Reading Test', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]
          },
          {
            id: \`fte_\${i}_listening\`,
            name: 'Listening & Speaking',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            fullModeMidtermWeight: 50,
            fullModeFinalWeight: 50,
            midtermMaxScore: 100,
            finalMaxScore: 100,
            categories: [
              { id: \`fte_\${i}_l_1\`, name: 'In-class Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_l_2\`, name: 'Weekly Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_l_3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_l_4\`, name: 'Class Participation and Homework', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\${i}_l_mt\`, name: 'Midterm Test', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`fte_\${i}_l_ft\`, name: 'Final Test', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]
          }
        ]
      };
    })
  },
  {
    id: 'part-time-english',
    name: 'Part-Time English Program',
    authorName: 'System',
    isAdmin: true,
    levels: Array.from({ length: 12 }).map((_, i) => {
      const levelNum = Math.floor(i / 2) + 1;
      const subLevel = i % 2 === 0 ? 'A' : 'B';
      const levelName = \`PTE Level \${levelNum}\${subLevel}\`;
      const color = COLORS[(i + 4) % COLORS.length];
      
      return {
        id: \`pte_\${levelNum}\${subLevel.toLowerCase()}\`,
        name: levelName,
        color: color,
        gradingScale: DEFAULT_SCALE,
        subjects: [
          {
            id: \`pte_\${i}_core\`,
            name: 'Core English',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            fullModeMidtermWeight: 50,
            fullModeFinalWeight: 50,
            midtermMaxScore: 100,
            finalMaxScore: 100,
            categories: [
              { id: \`pte_\${i}_c1\`, name: 'In-class Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`pte_\${i}_c2\`, name: 'Weekly Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`pte_\${i}_c3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`pte_\${i}_c4\`, name: 'Journal', weight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`pte_\${i}_c5\`, name: 'Class Participation and Homework', weight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`pte_\${i}_mt\`, name: 'Midterm Exam', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`pte_\${i}_ft\`, name: 'Final Exam', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]
          }
        ]
      };
    })
  }
];
`;

fs.writeFileSync('src/lib/templates.ts', code);
console.log('Fixed templates.ts completely');
