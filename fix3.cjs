const fs = require('fs');
let content = fs.readFileSync('src/components/GradeTable.tsx', 'utf8');

const targetStr = `                      <span 
                        className="truncate max-w-[150px] uppercase cursor-help group/subject-name relative flex items-center gap-1" 
                        title={sc.subject.name}
                      >
                        {sc.subject.name}
                        <Search className="w-2.5 h-2.5 text-slate-400 group-hover/subject-name:text-blue-500 transition-colors" />
                        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover/subject-name:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-slate-700">
                          Weight: {getSubjectWeight(sc.subject, resultMode)}%
                        </span>
                      </span>`;

const newStr = `                      <span 
                        className="truncate max-w-[150px] uppercase cursor-help group/subject-name relative flex items-center gap-1" 
                        title={sc.subject.name}
                      >
                        {sc.subject.name} <span className="text-[10px] text-slate-500 font-bold ml-1">W {getSubjectWeight(sc.subject, resultMode)}%</span>
                        <Search className="w-2.5 h-2.5 text-slate-400 group-hover/subject-name:text-blue-500 transition-colors" />
                      </span>`;

if (content.includes(targetStr)) {
    content = content.replace(targetStr, newStr);
    fs.writeFileSync('src/components/GradeTable.tsx', content);
    console.log("Fixed Subject Header");
} else {
    console.log("Subject Header not found");
}
