const fs = require('fs');

let content = fs.readFileSync('src/lib/templates.ts', 'utf8');

const level5aTemplate = `
  {
    id: 'system-level-5a',
    name: 'Level 5A Template (Official)',
    authorName: 'System',
    levels: [
      {
        id: 'l5a',
        name: 'Level 5A',
        subjects: [
          {
            id: 's_reading_5a',
            name: 'Reading',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_r_wq_5a', name: 'Weekly Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_icq_5a', name: 'In-Class Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_hw_5a', name: 'Homework', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_ra_5a', name: 'Reading Assignments', weight: 18, midtermWeight: 0, finalWeight: 0, itemCount: 2, itemMaxScores: [100, 100] },
              { id: 'c_r_att_5a', name: 'Attendance & Class Parti.', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_mid_5a', name: 'Midterm Test', weight: 26, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_r_fin_5a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_writing_5a',
            name: 'Writing',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_w_wq_5a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_icq_5a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_wa1_5a', name: 'Writing Assignment 1', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_wa2_5a', name: 'Writing Assignment 2', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_hw_5a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_att_5a', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_mid_5a', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_w_fin_5a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_computer_5a',
            name: 'Computer',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_c_att_5a', name: 'Attendance', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_cp_5a', name: 'Class Participation', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_mid_5a', name: 'Midterm Test', weight: 40, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_c_fin_5a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_listening_5a',
            name: 'Listening',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_l_wq_5a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_icq_5a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_hw_5a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_att_5a', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_mid_5a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_l_fin_5a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_speaking_5a',
            name: 'Speaking',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_s_wq_5a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_icq_5a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_deb_5a', name: 'Debate', weight: 8, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_gp_5a', name: 'Group Presentation', weight: 7, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_hw_att_5a', name: 'Homework, Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_mid_5a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_s_fin_5a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_grammar_5a',
            name: 'Grammar',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_g_wq_5a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_icq_5a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_hw_5a', name: 'Homework', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_att_5a', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_mid_5a', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_g_fin_5a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_science_5a',
            name: 'Science',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_sc_qz_5a', name: 'Quiz', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_sc_hw_5a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_sc_att_5a', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_sc_mid_5a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_sc_fin_5a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
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

const level5bTemplate = `
  {
    id: 'system-level-5b',
    name: 'Level 5B Template (Official)',
    authorName: 'System',
    levels: [
      {
        id: 'l5b',
        name: 'Level 5B',
        subjects: [
          {
            id: 's_reading_5b',
            name: 'Reading',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_r_wq_5b', name: 'Weekly Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_icq_5b', name: 'In-Class Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_hw_5b', name: 'Homework', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_ra_5b', name: 'Reading Assignments', weight: 18, midtermWeight: 0, finalWeight: 0, itemCount: 2, itemMaxScores: [100, 100] },
              { id: 'c_r_att_5b', name: 'Attendance & Class Parti.', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_mid_5b', name: 'Midterm Test', weight: 26, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_r_fin_5b', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_writing_5b',
            name: 'Writing',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_w_wq_5b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_icq_5b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_wa1_5b', name: 'Writing Assignment 1', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_wa2_5b', name: 'Writing Assignment 2', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_hw_5b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_att_5b', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_mid_5b', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_w_fin_5b', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_computer_5b',
            name: 'Computer',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_c_att_5b', name: 'Attendance', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_cp_5b', name: 'Class Participation', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_mid_5b', name: 'Midterm Test', weight: 40, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_c_fin_5b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_listening_5b',
            name: 'Listening',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_l_wq_5b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_icq_5b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_hw_5b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_att_5b', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_mid_5b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_l_fin_5b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_speaking_5b',
            name: 'Speaking',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_s_wq_5b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_icq_5b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_deb_5b', name: 'Debate', weight: 15, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_hw_att_5b', name: 'Homework, Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_mid_5b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_s_fin_5b', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_grammar_5b',
            name: 'Grammar',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_g_wq_5b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_icq_5b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_hw_5b', name: 'Homework', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_att_5b', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_mid_5b', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_g_fin_5b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_math_5b',
            name: 'Mathematics',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_m_qz_5b', name: 'Quiz', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_m_hw_5b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_m_att_5b', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_m_mid_5b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_m_fin_5b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
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

if (!content.includes('Level 5A Template')) {
  content = content.replace(/(export const SYSTEM_TEMPLATES = \[)/, '$1\n' + level5aTemplate + level5bTemplate);
  fs.writeFileSync('src/lib/templates.ts', content, 'utf8');
}
