const fs = require('fs');

let content = fs.readFileSync('src/lib/templates.ts', 'utf8');

const level2aTemplate = `
  {
    id: 'system-level-2a',
    name: 'Level 2A Template (Official)',
    authorName: 'System',
    levels: [
      {
        id: 'l2a',
        name: 'Level 2A',
        subjects: [
          {
            id: 's_reading_2a',
            name: 'Reading',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_r_wq_2a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_icq_2a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_hw_2a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_ra_2a', name: 'Reading Assignments', weight: 14, midtermWeight: 0, finalWeight: 0, itemCount: 2, itemMaxScores: [80, 60] },
              { id: 'c_r_att_2a', name: 'Attendance & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_mid_2a', name: 'Midterm Test', weight: 26, midtermWeight: 100, finalWeight: 0, itemCount: 2, itemMaxScores: [30, 70] },
              { id: 'c_r_fin_2a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 2, itemMaxScores: [30, 70] },
            ]
          },
          {
            id: 's_writing_2a',
            name: 'Writing',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_w_wq_2a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_icq_2a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_jw_2a', name: 'Journal Writing', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_wa_2a', name: 'Writing Assignments', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 2, itemMaxScores: [50, 50] },
              { id: 'c_w_hw_2a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_att_2a', name: 'Attendance. & Class. Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_mid_2a', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_w_fin_2a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_listening_2a',
            name: 'Listening',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_l_wq_2a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_icq_2a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_hw_2a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_att_2a', name: 'Att. & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_mid_2a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_l_fin_2a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_speaking_2a',
            name: 'Speaking',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_s_wq_2a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_icq_2a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_pres_2a', name: 'Presentation', weight: 7, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_pc_2a', name: 'Pair-Conversation', weight: 8, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_hw_2a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_att_2a', name: 'Attendance & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_mid_2a', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_s_fin_2a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_computer_2a',
            name: 'Computer',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_c_att_2a', name: 'Computer Attendance', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_cp_2a', name: 'Class Participation', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_mid_2a', name: 'Midterm Test', weight: 40, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_c_fin_2a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          }
        ],
        gradingScale: [
          { grade: 'A+', minScore: 95 },
          { grade: 'A', minScore: 90 },
          { grade: 'B', minScore: 80 },
          { grade: 'C', minScore: 70 },
          { grade: 'D', minScore: 60 },
          { grade: 'E', minScore: 50 },
          { grade: 'F', minScore: 0 }
        ],
        statusScale: [
          { grade: 'Pass', minScore: 70 },
          { grade: 'Fail', minScore: 0 }
        ]
      }
    ]
  },
`;

if (!content.includes('system-level-2a')) {
  content = content.replace(/(export const SYSTEM_TEMPLATES = \[)/, '$1\n' + level2aTemplate);
  fs.writeFileSync('src/lib/templates.ts', content, 'utf8');
}
