import { Level } from '../types';

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
      const levelName = `Level ${levelNum}${subLevel}`;
      const color = COLORS[i % COLORS.length];
      
      return {
        id: `fte_${levelNum}${subLevel.toLowerCase()}`,
        name: levelName,
        customDivisor: 5,
        midtermCustomDivisor: 5,
        finalCustomDivisor: 5,
        color: color,
        gradingScale: DEFAULT_SCALE,
        subjects: [
          {
            id: `fte_${i}_attendance`,
            name: 'Attendance',
            targetWeight: 100,
            midtermTargetWeight: 0,
            finalTargetWeight: 0,
            categories: [
              { id: `fte_${i}_att_1`, name: 'Attendance', weight: 100, itemCount: 1, itemMaxScores: [100] }
            ]
          },
          {
            id: `fte_${i}_reading`,
            name: 'Reading & Grammar',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: `fte_${i}_rd_1`, name: 'Weekly Reading', weight: 10, itemCount: 5, itemMaxScores: [100,100,100,100,100] },
              { id: `fte_${i}_rd_2`, name: 'Grammar Quiz', weight: 10, itemCount: 5, itemMaxScores: [100,100,100,100,100] },
              { id: `fte_${i}_rd_3`, name: 'Journal', weight: i % 2 === 0 ? 10 : 0, itemCount: 5, itemMaxScores: [100,100,100,100,100] },
              { id: `fte_${i}_rd_mt_g`, name: 'Midterm: Grammar Test', weight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: `fte_${i}_rd_mt_r`, name: 'Midterm: Reading Test', weight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: `fte_${i}_rd_ft_g`, name: 'Final: Grammar Test', weight: 20, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 },
              { id: `fte_${i}_rd_ft_r`, name: 'Final: Reading Test', weight: 20, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 },
            ].filter(c => c.weight > 0)
          },
          {
            id: `fte_${i}_listening`,
            name: 'Listening & Speaking',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: `fte_${i}_ls_1`, name: 'Participation', weight: 10, itemCount: 1, itemMaxScores: [100] },
              { id: `fte_${i}_ls_2`, name: i % 3 === 0 ? 'Speaking with AI' : 'Class Presentation', weight: 15, itemCount: 2, itemMaxScores: [100, 100] },
              { id: `fte_${i}_ls_3`, name: i % 2 === 0 ? 'Video Project' : 'Dictation', weight: 10, itemCount: 1, itemMaxScores: [100] },
              { id: `fte_${i}_ls_mt_l`, name: 'Midterm: Listening Test', weight: 30, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100 },
              { id: `fte_${i}_ls_ft_l`, name: 'Final: Listening Test', weight: 35, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 100 },
            ]
          },
          {
            id: `fte_${i}_writing`,
            name: 'Writing',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: `fte_${i}_wr_1`, name: 'Weekly Paragraph', weight: 20, itemCount: 5, itemMaxScores: [100,100,100,100,100] },
              { id: `fte_${i}_wr_mt`, name: 'Midterm Essay', weight: 30, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100 },
              { id: `fte_${i}_wr_ft`, name: 'Final Essay', weight: 50, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 100 },
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
      const levelName = `PTE Level ${levelNum}${subLevel}`;
      const color = COLORS[(i + 4) % COLORS.length];
      
      return {
        id: `pte_${levelNum}${subLevel.toLowerCase()}`,
        name: levelName,
        color: color,
        gradingScale: DEFAULT_SCALE,
        subjects: [
          {
            id: `pte_${i}_core`,
            name: 'Core English',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: `pte_${i}_c1`, name: 'Vocabulary', weight: 20, itemCount: 1, itemMaxScores: [100] },
              { id: `pte_${i}_c2`, name: i % 2 === 0 ? 'Journal' : 'Video Task', weight: 20, itemCount: 1, itemMaxScores: [100] },
              { id: `pte_${i}_c3`, name: 'Speaking AI', weight: 10, itemCount: 1, itemMaxScores: [100] },
              { id: `pte_${i}_mt`, name: 'Midterm Exam', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100 },
              { id: `pte_${i}_ft`, name: 'Final Exam', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 100 },
            ]
          }
        ]
      };
    })
  },
  {
    id: 'math-program',
    name: 'Math Program',
    authorName: 'System',
    isAdmin: true,
    levels: Array.from({ length: 12 }).map((_, i) => {
      const levelNum = Math.floor(i / 2) + 1;
      const subLevel = i % 2 === 0 ? 'A' : 'B';
      const levelName = `Math Level ${levelNum}${subLevel}`;
      const color = COLORS[(i + 8) % COLORS.length];
      
      return {
        id: `mat_${levelNum}${subLevel.toLowerCase()}`,
        name: levelName,
        color: color,
        gradingScale: DEFAULT_SCALE,
        subjects: [
          {
            id: `mat_${i}_main`,
            name: 'Mathematics',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: `mat_${i}_q`, name: 'Weekly Quizzes', weight: 30, itemCount: 10, itemMaxScores: Array(10).fill(100) },
              { id: `mat_${i}_hw`, name: 'Homework', weight: 10, itemCount: 1, itemMaxScores: [100] },
              { id: `mat_${i}_mt`, name: 'Midterm: Calculation Test', weight: 30, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100 },
              { id: `mat_${i}_ft`, name: 'Final: Applied Math Test', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 100 },
            ]
          }
        ]
      };
    })
  },
  {
    id: 'khmer-program',
    name: 'Khmer Program',
    authorName: 'System',
    isAdmin: true,
    levels: Array.from({ length: 6 }).map((_, i) => {
      const levelNum = i + 1;
      const levelName = `Khmer Level ${levelNum}`;
      
      return {
        id: `khm_${levelNum}`,
        name: levelName,
        color: '#f43f5e',
        gradingScale: DEFAULT_SCALE,
        subjects: [
          {
            id: `khm_${i}_lang`,
            name: 'Khmer Language',
            targetWeight: 100,
            categories: [
              { id: `khm_${i}_r`, name: 'Reading', weight: 25, itemCount: 1, itemMaxScores: [100] },
              { id: `khm_${i}_w`, name: 'Writing', weight: 25, itemCount: 1, itemMaxScores: [100] },
              { id: `khm_${i}_mt`, name: 'Midterm', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: `khm_${i}_ft`, name: 'Final', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true },
            ]
          }
        ]
      };
    })
  }
];
