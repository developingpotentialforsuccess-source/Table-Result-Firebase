import { Level } from '../types';

export const SYSTEM_TEMPLATES = [
  {
    id: 'full-time-english',
    name: 'Full-Time English Program',
    authorName: 'System',
    isAdmin: true,
    levels: [
      {
        id: 'fte_2a',
        name: 'Level 2A',
        customDivisor: 5,
        midtermCustomDivisor: 4,
        finalCustomDivisor: 4,
        gradingScale: [
          { grade: 'A+', minScore: 90 },
          { grade: 'A', minScore: 85 },
          { grade: 'A-', minScore: 80 },
          { grade: 'B+', minScore: 75 },
          { grade: 'B', minScore: 70 },
          { grade: 'B-', minScore: 65 },
          { grade: 'C+', minScore: 60 },
          { grade: 'C', minScore: 55 },
          { grade: 'C-', minScore: 50 },
          { grade: 'D', minScore: 45 },
          { grade: 'E', minScore: 40 },
          { grade: 'F', minScore: 0 },
        ],
        subjects: [
          {
            id: 'fte_2a_attendance',
            name: 'Attendance',
            targetWeight: 100,
            midtermTargetWeight: 0,
            finalTargetWeight: 0,
            categories: [
              {
                id: 'fte_2a_att_main',
                name: 'Attendance',
                weight: 100,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              }
            ]
          },
          {
            id: 'fte_2a_reading',
            name: 'Reading',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              {
                id: 'fte_2a_read_wq',
                name: 'Weekly Quiz',
                weight: 5,
                itemCount: 10,
                itemMaxScores: [100,100,100,100,100,100,100,100,100,100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_read_icq',
                name: 'In-Class Quiz',
                weight: 5,
                itemCount: 10,
                itemMaxScores: [100,100,100,100,100,100,100,100,100,100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_read_hw',
                name: 'Homework',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_read_as_a',
                name: 'Reading Assignment A',
                weight: 8,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_read_as_b',
                name: 'Reading Assignment B',
                weight: 6,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_read_part',
                name: 'Attendance & Class Participation',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_read_mt',
                name: 'Midterm Test',
                weight: 26,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 100,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_read_ft',
                name: 'Final Test',
                weight: 40,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 100,
              }
            ]
          },
          {
            id: 'fte_2a_writing',
            name: 'Writing',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              {
                id: 'fte_2a_writ_wq',
                name: 'Weekly Quiz',
                weight: 5,
                itemCount: 10,
                itemMaxScores: [100,100,100,100,100,100,100,100,100,100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_writ_icq',
                name: 'In-Class Quiz',
                weight: 5,
                itemCount: 10,
                itemMaxScores: [100,100,100,100,100,100,100,100,100,100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_writ_jw',
                name: 'Journal Writing',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_writ_as_a',
                name: 'Writing Assignment A',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_writ_as_b',
                name: 'Writing Assignment B',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_writ_hw',
                name: 'Homework',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_writ_part',
                name: 'Attendance & Class Participation',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_writ_mt',
                name: 'Midterm Test',
                weight: 25,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 100,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_writ_ft',
                name: 'Final Test',
                weight: 40,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 100,
              }
            ]
          },
          {
            id: 'fte_2a_computer',
            name: 'Computer',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              {
                id: 'fte_2a_comp_att',
                name: 'Attendance',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_comp_part',
                name: 'Class Participation',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_comp_mt',
                name: 'Midterm Test',
                weight: 40,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 100,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_comp_ft',
                name: 'Final Test',
                weight: 50,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 100,
              }
            ]
          },
          {
            id: 'fte_2a_listening',
            name: 'Listening',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              {
                id: 'fte_2a_list_wq',
                name: 'Weekly Quiz',
                weight: 5,
                itemCount: 10,
                itemMaxScores: [100,100,100,100,100,100,100,100,100,100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_list_icq',
                name: 'In-Class Quiz',
                weight: 5,
                itemCount: 10,
                itemMaxScores: [100,100,100,100,100,100,100,100,100,100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_list_hw',
                name: 'Homework',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_list_part',
                name: 'Attendance & Class Participation',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_list_mt',
                name: 'Midterm Test',
                weight: 30,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 100,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_list_ft',
                name: 'Final Test',
                weight: 50,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 100,
              }
            ]
          },
          {
            id: 'fte_2a_speaking',
            name: 'Speaking',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              {
                id: 'fte_2a_spea_wq',
                name: 'Weekly Quiz',
                weight: 5,
                itemCount: 10,
                itemMaxScores: [100,100,100,100,100,100,100,100,100,100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_spea_icq',
                name: 'In-Class Quiz',
                weight: 5,
                itemCount: 10,
                itemMaxScores: [100,100,100,100,100,100,100,100,100,100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_spea_pres',
                name: 'Presentation',
                weight: 8,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_spea_pair',
                name: 'Pair-Conversation',
                weight: 7,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_spea_part',
                name: 'Homework, Attendance & Class Participation',
                weight: 5,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_spea_mt',
                name: 'Midterm Test',
                weight: 25,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 100,
                finalWeight: 0,
              },
              {
                id: 'fte_2a_spea_ft',
                name: 'Final Test',
                weight: 40,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 100,
              }
            ]
          }
        ]
      },
      {
        id: 'fte_2b',
        name: 'Level 2B',
        customDivisor: 5,
        midtermCustomDivisor: 6,
        finalCustomDivisor: 4,
        gradingScale: [
          { grade: 'A+', minScore: 90 },
          { grade: 'A', minScore: 85 },
          { grade: 'A-', minScore: 80 },
          { grade: 'B+', minScore: 75 },
          { grade: 'B', minScore: 70 },
          { grade: 'B-', minScore: 65 },
          { grade: 'C+', minScore: 60 },
          { grade: 'C', minScore: 55 },
          { grade: 'C-', minScore: 50 },
          { grade: 'D', minScore: 45 },
          { grade: 'E', minScore: 40 },
          { grade: 'F', minScore: 0 },
        ],
        subjects: [
          {
            id: 'fte_2b_attendance',
            name: 'Attendance',
            targetWeight: 100,
            midtermTargetWeight: 0,
            finalTargetWeight: 0,
            categories: [
              { id: 'fte_2b_att_main', name: 'Attendance', weight: 100, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 }
            ]
          },
          {
            id: 'fte_2b_reading',
            name: 'Reading',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'fte_2b_read_wq', name: 'Weekly Quiz', weight: 5, itemCount: 10, itemMaxScores: [100,100,100,100,100,100,100,100,100,100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_read_icq', name: 'In-Class Quiz', weight: 5, itemCount: 10, itemMaxScores: [100,100,100,100,100,100,100,100,100,100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_read_hw', name: 'Homework', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_read_as_a', name: 'Reading Assignments A', weight: 8, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_read_as_b', name: 'Reading Assignments B', weight: 6, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_read_part', name: 'Attendance & Class Participation', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_read_mt', name: 'Midterm Test', weight: 26, itemCount: 1, itemMaxScores: [100], midtermWeight: 30, finalWeight: 0 },
              { id: 'fte_2b_read_dict', name: 'Dictation', weight: 0, itemCount: 1, itemMaxScores: [100], midtermWeight: 70, finalWeight: 0 },
              { id: 'fte_2b_read_ft', name: 'Final Test', weight: 40, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'fte_2b_writing',
            name: 'Writing',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'fte_2b_writ_wq', name: 'Weekly Quiz', weight: 5, itemCount: 10, itemMaxScores: [100,100,100,100,100,100,100,100,100,100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_writ_icq', name: 'In-Class Quiz', weight: 5, itemCount: 10, itemMaxScores: [100,100,100,100,100,100,100,100,100,100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_writ_jw', name: 'Journal Writing', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_writ_as_a', name: 'Writing Assignments A', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_writ_as_b', name: 'Writing Assignments B', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_writ_hw', name: 'Homework', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_writ_part', name: 'Attendance & Class Participation', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_writ_mt', name: 'Midterm Test', weight: 25, itemCount: 1, itemMaxScores: [100], midtermWeight: 100, finalWeight: 0 },
              { id: 'fte_2b_writ_ft', name: 'Final Test', weight: 40, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'fte_2b_computer',
            name: 'Computer',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'fte_2b_comp_att', name: 'Attendance', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_comp_part', name: 'Class Participation', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_comp_mt', name: 'Midterm Test', weight: 40, itemCount: 1, itemMaxScores: [100], midtermWeight: 100, finalWeight: 0 },
              { id: 'fte_2b_comp_ft', name: 'Final Test', weight: 50, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'fte_2b_listening',
            name: 'Listening',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'fte_2b_list_wq', name: 'Weekly Quiz', weight: 5, itemCount: 10, itemMaxScores: [100,100,100,100,100,100,100,100,100,100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_list_icq', name: 'In-Class Quiz', weight: 5, itemCount: 10, itemMaxScores: [100,100,100,100,100,100,100,100,100,100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_list_hw', name: 'Homework', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_list_part', name: 'Attendance & Class Participation', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_list_mt', name: 'Midterm Test', weight: 30, itemCount: 1, itemMaxScores: [100], midtermWeight: 100, finalWeight: 0 },
              { id: 'fte_2b_list_ft', name: 'Final Test', weight: 50, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'fte_2b_speaking',
            name: 'Speaking',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'fte_2b_spea_wq', name: 'Weekly Quiz', weight: 5, itemCount: 10, itemMaxScores: [100,100,100,100,100,100,100,100,100,100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_spea_icq', name: 'In-Class Quiz', weight: 5, itemCount: 10, itemMaxScores: [100,100,100,100,100,100,100,100,100,100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_spea_pres_pic', name: 'Picture Presentation', weight: 8, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_spea_pres_tea', name: 'Presentation About a Teacher', weight: 7, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_spea_part', name: 'Homework, Attendance & Class Participation', weight: 5, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'fte_2b_spea_mt', name: 'Midterm Test', weight: 25, itemCount: 1, itemMaxScores: [100], midtermWeight: 100, finalWeight: 0 },
              { id: 'fte_2b_spea_ft', name: 'Final Test', weight: 40, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'fte_2b_vocabulary',
            name: 'Vocabulary',
            targetWeight: 0,
            midtermTargetWeight: 100,
            finalTargetWeight: 0,
            categories: [
              { id: 'fte_2b_voc_main', name: 'Vocabulary', weight: 100, itemCount: 1, itemMaxScores: [100], midtermWeight: 100, finalWeight: 0 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'part-time-english',
    name: 'Part-Time English Program',
    authorName: 'System',
    isAdmin: true,
    levels: [
      {
        id: 'pte_foundation_a',
        name: 'Level Foundation A',
        gradingScale: [
          { grade: 'A', minScore: 90 },
          { grade: 'B', minScore: 80 },
          { grade: 'C', minScore: 70 },
          { grade: 'D', minScore: 60 },
          { grade: 'E', minScore: 50 },
          { grade: 'F', minScore: 0 }
        ],
        subjects: [
          {
            id: 'pte_fa_eng',
            name: 'English',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'pte_fa_eng_voc', name: 'Vocabulary', weight: 40, itemCount: 1, itemMaxScores: [100] },
              { id: 'pte_fa_eng_dict', name: 'Dictation', weight: 10, itemCount: 1, itemMaxScores: [100] },
              { id: 'pte_fa_eng_spe', name: 'Speaking', weight: 50, itemCount: 1, itemMaxScores: [100] }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'era-program',
    name: 'ERA Program',
    authorName: 'System',
    isAdmin: true,
    levels: []
  },
  {
    id: 'level-foundation-program',
    name: 'Level Foundation Program',
    authorName: 'System',
    isAdmin: true,
    levels: []
  },
  {
    id: 'khmer-program',
    name: 'Khmer Program',
    authorName: 'System',
    isAdmin: true,
    levels: []
  },
  {
    id: 'dpss-program',
    name: 'DPSS Program',
    authorName: 'System',
    isAdmin: true,
    levels: [
      {
        id: 'dpss_level_6',
        name: 'Level 6',
        attendanceWeight: 0,
        subjects: [
          {
            id: 'dpss_l6_general',
            name: 'General English',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            fullModeMidtermWeight: 8,
            fullModeFinalWeight: 62,
            categories: [
              { id: 'l6_speaking_quiz', name: 'Speaking Quiz', weight: 5, itemCount: 1, itemMaxScores: [100] },
              { id: 'l6_campaign', name: 'Campaign', weight: 7.5, itemCount: 1, itemMaxScores: [100] },
              { id: 'l6_voice_assignment', name: 'Voice-recorded Assignment', weight: 7.5, itemCount: 1, itemMaxScores: [100] },
              { id: 'l6_english_env', name: 'English Environment', weight: 5, itemCount: 1, itemMaxScores: [100] },
              { id: 'l6_participation', name: 'Home. & Class Participation', weight: 5, itemCount: 1, itemMaxScores: [100] },
              // Midterm Categories (Total weight 8% in full mode, 100% in midterm mode)
              { id: 'l6_mt_speaking', name: 'Midterm: Speaking', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l6_mt_vocab', name: 'Midterm: Vocabulary', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l6_mt_dictation', name: 'Midterm: Dictation', weight: 0.4, midtermWeight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l6_mt_listening', name: 'Midterm: Listening', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l6_mt_reading', name: 'Midterm: Reading', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l6_mt_grammar', name: 'Midterm: Grammar', weight: 1.6, midtermWeight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l6_mt_traffic', name: 'Midterm: Traffic Law', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              // Final Categories (Total weight 62% in full mode, 100% in final mode)
              { id: 'l6_ft_speaking', name: 'Final: Speaking', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l6_ft_vocab', name: 'Final: Vocabulary', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l6_ft_dictation', name: 'Final: Dictation', weight: 3.1, finalWeight: 5, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l6_ft_listening', name: 'Final: Listening', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l6_ft_reading', name: 'Final: Reading', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l6_ft_grammar', name: 'Final: Grammar', weight: 12.4, finalWeight: 20, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l6_ft_traffic', name: 'Final: Traffic Law', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
            ]
          }
        ]
      },
      {
        id: 'dpss_level_7',
        name: 'Level 7',
        attendanceWeight: 0,
        subjects: [
          {
            id: 'dpss_l7_general',
            name: 'General English',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            fullModeMidtermWeight: 8,
            fullModeFinalWeight: 62,
            categories: [
              { id: 'l7_speaking_quiz', name: 'Speaking Quiz', weight: 5, itemCount: 1, itemMaxScores: [100] },
              { id: 'l7_campaign', name: 'Campaign', weight: 7.5, itemCount: 1, itemMaxScores: [100] },
              { id: 'l7_voice_assignment', name: 'Voice-recorded Assignment', weight: 7.5, itemCount: 1, itemMaxScores: [100] },
              { id: 'l7_english_env', name: 'English Environment', weight: 5, itemCount: 1, itemMaxScores: [100] },
              { id: 'l7_participation', name: 'Home. & Class Participation', weight: 5, itemCount: 1, itemMaxScores: [100] },
              // Midterm Categories (Total weight 8% in full mode, 100% in midterm mode)
              { id: 'l7_mt_speaking', name: 'Midterm: Speaking', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l7_mt_vocab', name: 'Midterm: Vocabulary', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l7_mt_dictation', name: 'Midterm: Dictation', weight: 0.4, midtermWeight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l7_mt_listening', name: 'Midterm: Listening', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l7_mt_reading', name: 'Midterm: Reading', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l7_mt_grammar', name: 'Midterm: Grammar', weight: 1.6, midtermWeight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              { id: 'l7_mt_traffic', name: 'Midterm: Traffic Law', weight: 1.2, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
              // Final Categories (Total weight 62% in full mode, 100% in final mode)
              { id: 'l7_ft_speaking', name: 'Final: Speaking', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l7_ft_vocab', name: 'Final: Vocabulary', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l7_ft_dictation', name: 'Final: Dictation', weight: 3.1, finalWeight: 5, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l7_ft_listening', name: 'Final: Listening', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l7_ft_reading', name: 'Final: Reading', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l7_ft_grammar', name: 'Final: Grammar', weight: 12.4, finalWeight: 20, itemCount: 1, itemMaxScores: [100], isFinal: true },
              { id: 'l7_ft_traffic', name: 'Final: Traffic Law', weight: 9.3, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'math-program',
    name: 'Math Program',
    authorName: 'System',
    isAdmin: true,
    levels: []
  },
  {
    id: 'mtis-program',
    name: 'MTIS Program',
    authorName: 'System',
    isAdmin: true,
    levels: [
      {
        id: 'mtis_l1',
        name: 'MTIS Level 1',
        customDivisor: 5,
        midtermCustomDivisor: 4,
        finalCustomDivisor: 4,
        gradingScale: [
          { grade: 'A+', minScore: 90 },
          { grade: 'A', minScore: 85 },
          { grade: 'A-', minScore: 80 },
          { grade: 'B+', minScore: 75 },
          { grade: 'B', minScore: 70 },
          { grade: 'B-', minScore: 65 },
          { grade: 'C+', minScore: 60 },
          { grade: 'C', minScore: 55 },
          { grade: 'C-', minScore: 50 },
          { grade: 'D', minScore: 45 },
          { grade: 'E', minScore: 40 },
          { grade: 'F', minScore: 0 },
        ],
        subjects: [
          {
            id: 'mtis_l1_attendance',
            name: 'Attendance',
            targetWeight: 100,
            midtermTargetWeight: 0,
            finalTargetWeight: 0,
            categories: [
              {
                id: 'mtis_l1_att_main',
                name: 'Attendance',
                weight: 100,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              }
            ]
          },
          {
            id: 'mtis_l1_english',
            name: 'English Language Arts',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'mtis_l1_eng_read', name: 'Reading Quiz', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_eng_write', name: 'Writing Project', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_eng_speak', name: 'Listening & Speaking', weight: 10, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_eng_homework', name: 'Classwork & Homework', weight: 10, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_eng_mid', name: 'Midterm Test', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100, finalWeight: 0 },
              { id: 'mtis_l1_eng_fin', name: 'Final Test', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'mtis_l1_math',
            name: 'Mathematics',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'mtis_l1_math_quiz', name: 'Weekly Quizzes', weight: 20, itemCount: 5, itemMaxScores: [100, 100, 100, 100, 100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_math_class', name: 'Class Activities', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_math_hw', name: 'Homework', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_math_mid', name: 'Midterm Exam', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100, finalWeight: 0 },
              { id: 'mtis_l1_math_fin', name: 'Final Exam', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'mtis_l1_science',
            name: 'Science',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'mtis_l1_sci_quiz', name: 'Science Quizzes', weight: 20, itemCount: 2, itemMaxScores: [100, 100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_sci_lab', name: 'Lab Reports', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_sci_proj', name: 'Science Project', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_sci_mid', name: 'Midterm Exam', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100, finalWeight: 0 },
              { id: 'mtis_l1_sci_fin', name: 'Final Exam', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'mtis_l1_social',
            name: 'Social Studies',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'mtis_l1_soc_classwork', name: 'Classwork', weight: 25, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_soc_proj', name: 'Research Project', weight: 25, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l1_soc_mid', name: 'Midterm Exam', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100, finalWeight: 0 },
              { id: 'mtis_l1_soc_fin', name: 'Final Exam', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, midtermWeight: 0, finalWeight: 100 }
            ]
          }
        ]
      },
      {
        id: 'mtis_l2',
        name: 'MTIS Level 2',
        customDivisor: 5,
        midtermCustomDivisor: 4,
        finalCustomDivisor: 4,
        gradingScale: [
          { grade: 'A+', minScore: 90 },
          { grade: 'A', minScore: 85 },
          { grade: 'A-', minScore: 80 },
          { grade: 'B+', minScore: 75 },
          { grade: 'B', minScore: 70 },
          { grade: 'B-', minScore: 65 },
          { grade: 'C+', minScore: 60 },
          { grade: 'C', minScore: 55 },
          { grade: 'C-', minScore: 50 },
          { grade: 'D', minScore: 45 },
          { grade: 'E', minScore: 40 },
          { grade: 'F', minScore: 0 },
        ],
        subjects: [
          {
            id: 'mtis_l2_attendance',
            name: 'Attendance',
            targetWeight: 100,
            midtermTargetWeight: 0,
            finalTargetWeight: 0,
            categories: [
              {
                id: 'mtis_l2_att_main',
                name: 'Attendance',
                weight: 100,
                itemCount: 1,
                itemMaxScores: [100],
                midtermWeight: 0,
                finalWeight: 0,
              }
            ]
          },
          {
            id: 'mtis_l2_english',
            name: 'English Language Arts',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'mtis_l2_eng_read', name: 'Reading Quiz', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_eng_write', name: 'Writing Project', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_eng_speak', name: 'Listening & Speaking', weight: 10, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_eng_homework', name: 'Classwork & Homework', weight: 10, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_eng_mid', name: 'Midterm Test', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100, finalWeight: 0 },
              { id: 'mtis_l2_eng_fin', name: 'Final Test', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'mtis_l2_math',
            name: 'Mathematics',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'mtis_l2_math_quiz', name: 'Weekly Quizzes', weight: 20, itemCount: 5, itemMaxScores: [100, 100, 100, 100, 100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_math_class', name: 'Class Activities', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_math_hw', name: 'Homework', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_math_mid', name: 'Midterm Exam', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100, finalWeight: 0 },
              { id: 'mtis_l2_math_fin', name: 'Final Exam', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'mtis_l2_science',
            name: 'Science',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'mtis_l2_sci_quiz', name: 'Science Quizzes', weight: 20, itemCount: 2, itemMaxScores: [100, 100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_sci_lab', name: 'Lab Reports', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_sci_proj', name: 'Science Project', weight: 15, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_sci_mid', name: 'Midterm Exam', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100, finalWeight: 0 },
              { id: 'mtis_l2_sci_fin', name: 'Final Exam', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, midtermWeight: 0, finalWeight: 100 }
            ]
          },
          {
            id: 'mtis_l2_social',
            name: 'Social Studies',
            targetWeight: 100,
            midtermTargetWeight: 100,
            finalTargetWeight: 100,
            categories: [
              { id: 'mtis_l2_soc_classwork', name: 'Classwork', weight: 25, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_soc_proj', name: 'Research Project', weight: 25, itemCount: 1, itemMaxScores: [100], midtermWeight: 0, finalWeight: 0 },
              { id: 'mtis_l2_soc_mid', name: 'Midterm Exam', weight: 20, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 100, finalWeight: 0 },
              { id: 'mtis_l2_soc_fin', name: 'Final Exam', weight: 30, itemCount: 1, itemMaxScores: [100], isFinal: true, midtermWeight: 0, finalWeight: 100 }
            ]
          }
        ]
      }
    ]
  }
];
