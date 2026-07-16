const fs = require('fs');

let content = fs.readFileSync('src/lib/templates.ts', 'utf8');

const level4aTemplate = `
  {
    id: 'system-level-4a',
    name: 'Level 4A Template (Official)',
    authorName: 'System',
    levels: [
      {
        id: 'l4a',
        name: 'Level 4A',
        subjects: [
          {
            id: 's_reading_4a',
            name: 'Reading',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_r_wq_4a', name: 'Weekly Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_icq_4a', name: 'In-Class Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_hw_4a', name: 'Homework', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_ra_4a', name: 'Reading Assignments', weight: 18, midtermWeight: 0, finalWeight: 0, itemCount: 2, itemMaxScores: [100, 100] },
              { id: 'c_r_att_4a', name: 'Attendance & Class Parti.', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_mid_4a', name: 'Midterm Test', weight: 26, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_r_fin_4a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_writing_4a',
            name: 'Writing',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_w_wq_4a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_icq_4a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_wa1_4a', name: 'Writing Assignment 1', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_wa2_4a', name: 'Writing Assignment 2', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_hw_4a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_att_4a', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_mid_4a', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_w_fin_4a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_computer_4a',
            name: 'Computer',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_c_att_4a', name: 'Attendance', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_cp_4a', name: 'Class Participation', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_mid_4a', name: 'Midterm Test', weight: 40, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_c_fin_4a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_phonetic_4a',
            name: 'Phonetic Symbols',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_p_qz_4a', name: 'Quiz', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_p_hw_4a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_p_att_4a', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_p_mid_4a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_p_fin_4a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_listening_4a',
            name: 'Listening',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_l_wq_4a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_icq_4a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_hw_4a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_att_4a', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_mid_4a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_l_fin_4a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_speaking_4a',
            name: 'Speaking',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_s_wq_4a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_icq_4a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_gp_4a', name: 'Group Presentation', weight: 8, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_rp_4a', name: 'Roleplay', weight: 7, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_hw_att_4a', name: 'Homework, Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_mid_4a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_s_fin_4a', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_grammar_4a',
            name: 'Grammar',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_g_wq_4a', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_icq_4a', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_hw_4a', name: 'Homework', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_att_4a', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_mid_4a', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_g_fin_4a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_math_4a',
            name: 'Mathematics',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_m_qz_4a', name: 'Quiz', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_m_hw_4a', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_m_att_4a', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_m_mid_4a', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_m_fin_4a', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
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

const level4bTemplate = `
  {
    id: 'system-level-4b',
    name: 'Level 4B Template (Official)',
    authorName: 'System',
    levels: [
      {
        id: 'l4b',
        name: 'Level 4B',
        subjects: [
          {
            id: 's_reading_4b',
            name: 'Reading',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_r_wq_4b', name: 'Weekly Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_icq_4b', name: 'In-Class Quiz', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_r_hw_4b', name: 'Homework', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_ra_4b', name: 'Reading Assignments', weight: 18, midtermWeight: 0, finalWeight: 0, itemCount: 2, itemMaxScores: [100, 100] },
              { id: 'c_r_att_4b', name: 'Attendance & Class Parti.', weight: 4, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_r_mid_4b', name: 'Midterm Test', weight: 26, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_r_fin_4b', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_writing_4b',
            name: 'Writing',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_w_wq_4b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_icq_4b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_w_wa1_4b', name: 'Writing Assignment 1', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_wa2_4b', name: 'Writing Assignment 2', weight: 7.5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_hw_4b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_att_4b', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_w_mid_4b', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_w_fin_4b', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_computer_4b',
            name: 'Computer',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_c_att_4b', name: 'Attendance', weight: 5, midtermWeight: 10, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_cp_4b', name: 'Class Participation', weight: 5, midtermWeight: 10, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_c_mid_4b', name: 'Midterm Test', weight: 40, midtermWeight: 80, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_c_fin_4b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_phonetic_4b',
            name: 'Phonetic Symbols',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_p_qz_4b', name: 'Quiz', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_p_hw_4b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_p_att_4b', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_p_mid_4b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_p_fin_4b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_listening_4b',
            name: 'Listening',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_l_wq_4b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_icq_4b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_l_hw_4b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_att_4b', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_l_mid_4b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_l_fin_4b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_speaking_4b',
            name: 'Speaking',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_s_wq_4b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_icq_4b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_s_gp_4b', name: 'Group Presentation', weight: 8, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_rp_4b', name: 'Roleplay', weight: 7, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_hw_att_4b', name: 'Homework, Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_s_mid_4b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_s_fin_4b', name: 'Final Test', weight: 40, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_grammar_4b',
            name: 'Grammar',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_g_wq_4b', name: 'Weekly Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_icq_4b', name: 'In-Class Quiz', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_g_hw_4b', name: 'Homework', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_att_4b', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_g_mid_4b', name: 'Midterm Test', weight: 25, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_g_fin_4b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
            ]
          },
          {
            id: 's_science_4b',
            name: 'Science',
            targetWeight: 100,
            fullModeMidtermWeight: 100,
            fullModeFinalWeight: 100,
            categories: [
              { id: 'c_sc_qz_4b', name: 'Quiz', weight: 10, midtermWeight: 0, finalWeight: 0, itemCount: 10, itemMaxScores: Array(10).fill(10) },
              { id: 'c_sc_hw_4b', name: 'Homework', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_sc_att_4b', name: 'Att. & Class Part.', weight: 5, midtermWeight: 0, finalWeight: 0, itemCount: 1, itemMaxScores: [10] },
              { id: 'c_sc_mid_4b', name: 'Midterm Test', weight: 30, midtermWeight: 100, finalWeight: 0, itemCount: 1, itemMaxScores: [100] },
              { id: 'c_sc_fin_4b', name: 'Final Test', weight: 50, midtermWeight: 0, finalWeight: 100, itemCount: 1, itemMaxScores: [100] },
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

if (!content.includes('Level 4A Template')) {
  content = content.replace(/(export const SYSTEM_TEMPLATES = \[)/, '$1\n' + level4aTemplate + level4bTemplate);
  fs.writeFileSync('src/lib/templates.ts', content, 'utf8');
}
