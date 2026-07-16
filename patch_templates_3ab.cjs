const fs = require('fs');

let content = fs.readFileSync('src/lib/templates.ts', 'utf8');

const level3aTemplate = `
  {
    id: 'system-level-3a',
    name: 'Level 3A Template (Official)',
    authorName: 'System',
    levels: [
      {
        id: 'l3a',
        name: 'Level 3A',
        subjects: [
          {
            id: 's_reading_3a',
            name: 'Reading',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_r_wq_3a', name: 'Weekly Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_icq_3a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_hw_3a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_ra_3a', name: 'Reading Assignments', weight: 16, midtermWeight: 0, finalWeight: 0, itemCount: 2, itemMaxScores: [100, 60] },
              { id: 'c_r_att_3a', name: 'Attendance & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_mid_3a', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_r_fin_3a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_writing_3a',
            name: 'Writing',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_w_wq_3a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_icq_3a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_jw_3a', name: 'Journal Writing', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_omd_3a', name: 'One-Month Diary', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_wa_3a', name: 'Writing Assignment', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_hw_att_3a', name: 'Homework, Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_mid_3a', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_w_fin_3a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_computer_3a',
            name: 'Computer',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_c_att_3a', name: 'Attendance', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_cp_3a', name: 'Class Participation', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_mid_3a', name: 'Midterm Test', weight: 40, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_c_fin_3a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_listening_3a',
            name: 'Listening',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_l_wq_3a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_icq_3a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_hw_3a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_att_3a', name: 'Attendance & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_mid_3a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_l_fin_3a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_speaking_3a',
            name: 'Speaking',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_s_wq_3a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_icq_3a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_wt_3a', name: 'Whiteboard Talk', weight: 8, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_tsp_3a', name: 'Three-Student Presentation', weight: 7, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_hw_att_3a', name: 'Homework, Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_mid_3a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_s_fin_3a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_grammar_3a',
            name: 'Grammar',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_g_wq_3a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_icq_3a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_hw_3a', name: 'Homework', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_att_3a', name: 'Attendance & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_mid_3a', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_g_fin_3a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
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

const level3bTemplate = `
  {
    id: 'system-level-3b',
    name: 'Level 3B Template (Official)',
    authorName: 'System',
    levels: [
      {
        id: 'l3b',
        name: 'Level 3B',
        subjects: [
          {
            id: 's_reading_3b',
            name: 'Reading',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_r_wq_3b', name: 'Weekly Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_icq_3b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_hw_3b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_ra_3b', name: 'Reading Assignments', weight: 16, midtermWeight: 0, finalWeight: 0, itemCount: 2, itemMaxScores: [100, 60] },
              { id: 'c_r_att_3b', name: 'Attendance & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_mid_3b', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_r_fin_3b', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_writing_3b',
            name: 'Writing',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_w_wq_3b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_icq_3b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_wa1_3b', name: 'Writing Assignment 1', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_wa2_3b', name: 'Writing Assignment 2', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_hw_3b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_hw_att_3b', name: 'Homework, Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_mid_3b', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_w_fin_3b', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_computer_3b',
            name: 'Computer',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_c_att_3b', name: 'Attendance', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_cp_3b', name: 'Class Participation', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_mid_3b', name: 'Midterm Test', weight: 40, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_c_fin_3b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_listening_3b',
            name: 'Listening',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_l_wq_3b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_icq_3b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_hw_3b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_att_3b', name: 'Attendance & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_mid_3b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_l_fin_3b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_speaking_3b',
            name: 'Speaking',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_s_wq_3b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_icq_3b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_otsp_3b', name: 'One Two-Student Presentation', weight: 8, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_icp_3b', name: 'In-Class Presentation', weight: 7, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_hw_att_3b', name: 'Homework, Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_mid_3b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_s_fin_3b', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_grammar_3b',
            name: 'Grammar',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_g_wq_3b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_icq_3b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_hw_3b', name: 'Homework', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_att_3b', name: 'Attendance & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_mid_3b', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_g_fin_3b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_science_3b',
            name: 'Science',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_sc_qz_3b', name: 'Quiz', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_sc_hw_3b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_sc_att_3b', name: 'Attendance & Class Parti.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_sc_mid_3b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_sc_fin_3b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
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

if (!content.includes('Level 3A Template')) {
  content = content.replace(/(export const SYSTEM_TEMPLATES = \[)/, '$1\n' + level3aTemplate + level3bTemplate);
  fs.writeFileSync('src/lib/templates.ts', content, 'utf8');
}
