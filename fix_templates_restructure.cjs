const fs = require('fs');
let code = fs.readFileSync('src/lib/templates.ts', 'utf8');

// For FTE
code = code.replace(/categories:\ \[\s*\{\ id:\ \`fte_\$\{i\}_g_1\`[\s\S]*?\]/g, 
`categories: [
              { id: \`fte_\$\{i\}_g_1\`, name: 'In-class Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_g_2\`, name: 'Weekly Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_g_3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_g_4\`, name: 'Journal', weight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_g_5\`, name: 'Class Participation and Homework', weight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_g_mt\`, name: 'Midterm Grammar Test', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`fte_\$\{i\}_g_ft\`, name: 'Final Grammar Test', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]`);

code = code.replace(/categories:\ \[\s*\{\ id:\ \`fte_\$\{i\}_w_1\`[\s\S]*?\]/g, 
`categories: [
              { id: \`fte_\$\{i\}_w_1\`, name: 'In-class Quiz', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_w_2\`, name: 'Weekly Quiz', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_w_3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_w_4\`, name: 'Class Participation and Homework', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_w_mt\`, name: 'Midterm Written Test', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`fte_\$\{i\}_w_ft\`, name: 'Final Written Test', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]`);

code = code.replace(/categories:\ \[\s*\{\ id:\ \`fte_\$\{i\}_r_1\`[\s\S]*?\]/g, 
`categories: [
              { id: \`fte_\$\{i\}_r_1\`, name: 'In-class Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_r_2\`, name: 'Weekly Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_r_3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_r_4\`, name: 'Class Participation and Homework', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_r_mt\`, name: 'Midterm Reading Test', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`fte_\$\{i\}_r_ft\`, name: 'Final Reading Test', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]`);

code = code.replace(/categories:\ \[\s*\{\ id:\ \`fte_\$\{i\}_l_1\`[\s\S]*?\]/g, 
`categories: [
              { id: \`fte_\$\{i\}_l_1\`, name: 'In-class Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_l_2\`, name: 'Weekly Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_l_3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_l_4\`, name: 'Class Participation and Homework', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`fte_\$\{i\}_l_mt\`, name: 'Midterm Test', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`fte_\$\{i\}_l_ft\`, name: 'Final Test', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]`);


// For PTE Core
code = code.replace(/categories:\ \[\s*\{\ id:\ \`pte_\$\{i\}_c1\`[\s\S]*?\]/g, 
`categories: [
              { id: \`pte_\$\{i\}_c1\`, name: 'In-class Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`pte_\$\{i\}_c2\`, name: 'Weekly Quizzes', weight: 15, itemCount: 10, itemMaxScores: Array(10).fill(100), isMidterm: true, isFinal: true },
              { id: \`pte_\$\{i\}_c3\`, name: 'Assignment', weight: 10, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`pte_\$\{i\}_c4\`, name: 'Journal', weight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`pte_\$\{i\}_c5\`, name: 'Class Participation and Homework', weight: 5, itemCount: 1, itemMaxScores: [100], isMidterm: true, isFinal: true },
              { id: \`pte_\$\{i\}_mt\`, name: 'Midterm Exam', weight: 0, itemCount: 1, itemMaxScores: [100], isMidterm: true, midtermWeight: 50 },
              { id: \`pte_\$\{i\}_ft\`, name: 'Final Exam', weight: 0, itemCount: 1, itemMaxScores: [100], isFinal: true, finalWeight: 50 }
            ]`);


fs.writeFileSync('src/lib/templates.ts', code);
console.log('Fixed templates.ts');
