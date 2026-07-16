import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users } from 'lucide-react';
import { Student, ClassRecord, Level, calculateGrade } from '../types';
import { isMidtermCategory, isFinalCategory, getStudentScoreValue, isSubjectActiveInMode } from "../lib/categoryUtils";

interface DashboardProps {
  currentRecord: ClassRecord;
  students: Student[];
  currentLevel: Level;
  resultMode: 'full' | 'midterm' | 'final';
}

const DEFAULT_GRADING_SCALE = [
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
];



export const Dashboard: React.FC<DashboardProps> = ({ currentRecord, students, currentLevel, resultMode }) => {
  const stats = useMemo(() => {
    if (!currentRecord || !currentLevel) return null;
    const activeStudents = (students || []).filter(s => !s.isHidden);
    if (activeStudents.length === 0) return null;

    let totalScore = 0;
    const subjectAvgs: Record<string, { total: number; count: number }> = {};
    const studentsData: any[] = [];
    
    activeStudents.forEach((student, studentIndex) => {
      let performancePct = 0;



      const calculateModePct = (subject: any, mode: 'midterm' | 'final' | 'full') => {
        let points = 0;
        let weight = 0;
        let hasAnyScore = false;

        subject.categories.forEach((cat: any) => {
          const isMid = isMidtermCategory(cat);
          const isFin = isFinalCategory(cat);
          
          const isVisibleInMode = mode === 'full' 
            ? true 
            : mode === 'midterm' 
              ? isMid
              : isFin;

          if (!isVisibleInMode) return;

          const activeWeight = mode === 'midterm'
            ? (cat.midtermWeight ?? cat.weight)
            : mode === 'final'
              ? (cat.finalWeight ?? cat.weight)
              : cat.weight;

          let catEarned = 0;
          let catMax = 0;
          let hasCatScore = false;
          for (let i = 0; i < cat.itemCount; i++) {
            const s = getStudentScoreValue(student.scores, cat.id, i, mode, cat);
            if (typeof s === 'number') {
              catEarned += s;
              catMax += (cat.itemMaxScores?.[i] || 100);
              hasCatScore = true;
              hasAnyScore = true;
            } else if (currentRecord.settings?.treatBlanksAsZero) {
              catEarned += 0;
              catMax += (cat.itemMaxScores?.[i] || 100);
              hasCatScore = true;
            }
          }
          const catPct = catMax > 0 ? (catEarned / catMax) * 100 : 0;
          
          if (hasCatScore && activeWeight > 0) {
            points += (catPct / 100) * activeWeight;
            weight += activeWeight;
          }
        });
        
        if (!hasAnyScore) return 0;
        return weight > 0 ? (points / weight) * 100 : 0;
      };

      let totalWeightedSum = 0;
      let totalWeightSum = 0;

      currentLevel.subjects.forEach(subject => {
        let hasSubjectScore = false;
        let subjectPercentage = 0;

        const midKey = `exam_midterm_${subject.id}_-1`;
        const finalKey = `exam_final_${subject.id}_-1`;

        let midResult = calculateModePct(subject, 'midterm');
        let hasMidScore = false;
        const midScore = student.scores[midKey];
        if (typeof midScore === 'number') {
          const midMax = subject.midtermMaxScore || 100;
          midResult = (midScore / midMax) * 100;
          hasMidScore = true;
        }

        let finalResult = calculateModePct(subject, 'final');
        let hasFinalScore = false;
        const finalScore = student.scores[finalKey];
        if (typeof finalScore === 'number') {
          const finalMax = subject.finalMaxScore || 100;
          finalResult = (finalScore / finalMax) * 100;
          hasFinalScore = true;
        }

        if (resultMode === 'midterm') {
          subjectPercentage = midResult;
          hasSubjectScore = hasMidScore || subject.categories.some((cat: any) => {
            if (isFinalCategory(cat)) return false;
            for (let i = 0; i < cat.itemCount; i++) {
              if (typeof getStudentScoreValue(student.scores, cat.id, i, 'midterm', cat) === 'number') return true;
            }
            return false;
          });
        } else if (resultMode === 'final') {
          subjectPercentage = finalResult;
          hasSubjectScore = hasFinalScore || subject.categories.some((cat: any) => {
            if (isMidtermCategory(cat)) return false;
            for (let i = 0; i < cat.itemCount; i++) {
              if (typeof getStudentScoreValue(student.scores, cat.id, i, 'final', cat) === 'number') return true;
            }
            return false;
          });
        } else {
          // COMPREHENSIVE TERMLY RESULT CALCULATION
          let otherWeightedSum = 0;
          let otherWeightTotal = 0;
          subject.categories.forEach((cat: any) => {
            if (isMidtermCategory(cat) || isFinalCategory(cat)) return;
            
            let catEarned = 0;
            let catMax = 0;
            let hasCatScore = false;
            for (let i = 0; i < cat.itemCount; i++) {
              const s = getStudentScoreValue(student.scores, cat.id, i, 'full', cat);
              if (typeof s === 'number') {
                catEarned += s;
                catMax += (cat.itemMaxScores?.[i] || 100);
                hasCatScore = true;
              } else if (currentRecord.settings?.treatBlanksAsZero) {
                catEarned += 0;
                catMax += (cat.itemMaxScores?.[i] || 100);
                hasCatScore = true;
              }
            }
            const catPct = catMax > 0 ? (catEarned / catMax) * 100 : 0;
            if (hasCatScore && cat.weight > 0) {
              otherWeightedSum += (catPct / 100) * cat.weight;
              otherWeightTotal += cat.weight;
            }
          });
          
          const midWeightContrib = subject.fullModeMidtermWeight ?? 0;
          const finalWeightContrib = subject.fullModeFinalWeight ?? 0;
          const totalComponentsWeight = otherWeightTotal + midWeightContrib + finalWeightContrib;
          
          const catPoints = otherWeightedSum;
          const midPoints = (midResult / 100) * midWeightContrib;
          const finPoints = (finalResult / 100) * finalWeightContrib;
          
          const subjectScoreRaw = catPoints + midPoints + finPoints;
          
          subjectPercentage = totalComponentsWeight > 0 ? (subjectScoreRaw / totalComponentsWeight) * 100 : 0;
          
          hasSubjectScore = hasMidScore || hasFinalScore || subject.categories.some((cat: any) => {
            for (let i = 0; i < cat.itemCount; i++) {
              if (typeof getStudentScoreValue(student.scores, cat.id, i, 'full', cat) === 'number') return true;
            }
            return false;
          });
        }

        if (!subjectAvgs[subject.name]) subjectAvgs[subject.name] = { total: 0, count: 0 };
        subjectAvgs[subject.name].total += subjectPercentage;
        subjectAvgs[subject.name].count++;

        const targetWeight = resultMode === 'midterm' 
          ? (subject.midtermTargetWeight ?? subject.targetWeight ?? 100)
          : resultMode === 'final'
            ? (subject.finalTargetWeight ?? subject.targetWeight ?? 100)
            : (subject.targetWeight ?? 100);

        const divideByAll = currentRecord.settings?.divideByAllSubjects !== false;
        const isActive = isSubjectActiveInMode(subject, resultMode);

        if (isActive) {
          if (divideByAll || hasSubjectScore) {
            totalWeightSum += targetWeight;
          }
          if (hasSubjectScore) {
            totalWeightedSum += (subjectPercentage / 100) * targetWeight;
          }
        }
      });

      const effectiveDivisor = resultMode === 'midterm'
        ? (currentLevel?.midtermCustomDivisor ? currentLevel.midtermCustomDivisor * 100 : totalWeightSum)
        : resultMode === 'final'
          ? (currentLevel?.finalCustomDivisor ? currentLevel.finalCustomDivisor * 100 : totalWeightSum)
          : (currentLevel?.customDivisor ? currentLevel.customDivisor * 100 : totalWeightSum);

      performancePct = effectiveDivisor > 0 ? (totalWeightedSum / effectiveDivisor) * 100 : 0;
      totalScore += performancePct;

      const grade = calculateGrade(performancePct, resultMode, currentRecord.settings, currentLevel);

      studentsData.push({
        id: student.id,
        name: currentRecord.settings?.hideStudentNames ? `Student ${studentIndex + 1}` : student.name,
        sex: student.sex,
        score: performancePct,
        grade,
        attendance: student.attendance
      });
    });

    const studentsByScore = [
      { name: '90-100', value: studentsData.filter(s => s.score >= 90).length },
      { name: '80-89', value: studentsData.filter(s => s.score >= 80 && s.score < 90).length },
      { name: '70-79', value: studentsData.filter(s => s.score >= 70 && s.score < 80).length },
      { name: '60-69', value: studentsData.filter(s => s.score >= 60 && s.score < 70).length },
      { name: '<60', value: studentsData.filter(s => s.score < 60).length },
    ];

    const participationData = Object.entries(subjectAvgs).map(([name, data]) => ({
      name: name.substring(0, 15).toUpperCase(),
      rate: parseFloat((data.total / data.count).toFixed(2))
    })).sort((a,b) => b.rate - a.rate);

    const examResultsData = currentLevel.subjects.map(sub => {
      const avg = subjectAvgs[sub.name] ? subjectAvgs[sub.name].total / subjectAvgs[sub.name].count : 0;
      const passCount = students.length > 0 ? Math.round(students.length * (avg/100)) : 0;
      const failCount = students.length - passCount;
      return {
        name: sub.name.substring(0, 10).toUpperCase(),
        Pass: passCount,
        Fail: failCount
      };
    });

    const tableData = studentsData.map((student, idx) => ({
        id: student.id || (idx+1).toString(),
        name: student.name,
        gender: student.sex || 'Male',
        grade: student.grade || '-',
        average: student.score?.toFixed(2) + '%',
        avgVal: student.score || 0,
        attendance: student.attendance || '100%',
    }));

    const topSubjects = Object.entries(subjectAvgs).map(([name, data]) => ({ name: name.toUpperCase(), avg: (data.total / data.count).toFixed(2) })).slice(0, 5);

    return {
      totalStudents: students.length,
      averageScore: totalScore / (students.length || 1),
      studentsByScore,
      participationData,
      examResultsData,
      tableData,
      topSubjects
    };
  }, [currentRecord, students, currentLevel, resultMode]);

  if (!stats) return <div className="p-8 text-center text-slate-500">No data available for dashboard.</div>;

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-2 w-full md:w-48 border-r border-slate-100 pr-4">
           <div className="text-xs text-slate-500 font-semibold mb-1">Select Year</div>
           <select className="border border-slate-300 rounded p-1 text-sm bg-slate-50"><option>All</option></select>
           <div className="text-xs text-slate-500 font-semibold mb-1 mt-2">Select Grade</div>
           <select className="border border-slate-300 rounded p-1 text-sm bg-slate-50"><option>All</option></select>
        </div>
        
        <div className="flex items-center gap-4 border-r border-slate-100 pr-4 pl-2 min-w-[150px]">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Students</p>
            <p className="text-2xl font-bold text-slate-800">{stats.totalStudents}</p>
          </div>
        </div>

        <div className="flex-1 pl-2">
          <p className="text-xs font-semibold text-slate-700 mb-3">Avg. Subject Score</p>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {stats.topSubjects.map((sub, i) => (
              <div key={i} className="flex-1 min-w-[80px] text-center border-r border-slate-100 last:border-0">
                <p className="text-[10px] text-slate-500 truncate px-1" title={sub.name}>{sub.name}</p>
                <p className="text-lg font-bold text-slate-700 mt-1">{sub.avg}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table Row */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm">Academic Details of Students</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-600 bg-slate-50/80 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 border-r border-slate-200">Student ID</th>
                <th className="px-4 py-3 border-r border-slate-200">Student Name</th>
                <th className="px-4 py-3 border-r border-slate-200">Gender</th>
                <th className="px-4 py-3 border-r border-slate-200">Grade Name</th>
                <th className="px-4 py-3 border-r border-slate-200 text-center">Average Marks</th>
                <th className="px-4 py-3 text-center">Attendance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.tableData.slice(0, 5).map((row, i) => {
                const avg = row.avgVal;
                let colorClass = "text-red-600";
                if (avg >= 70) colorClass = "text-emerald-600";
                else if (avg >= 60) colorClass = "text-orange-500";

                return (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 border-r border-slate-100 text-slate-600">{row.id}</td>
                    <td className="px-4 py-3 border-r border-slate-100 font-medium text-slate-800">{row.name}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-slate-600">{row.gender}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-slate-600">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-bold border ${
                        row.grade.startsWith("A")
                          ? "bg-purple-100 text-purple-800 border-purple-200"
                          : row.grade.startsWith("B")
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : row.grade.startsWith("C")
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : row.grade.startsWith("D")
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : row.grade.startsWith("E")
                                  ? "bg-orange-100 text-orange-800 border-orange-200"
                                  : row.grade.startsWith("P") || row.grade.toLowerCase().includes("pass")
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                      }`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className={`px-4 py-3 border-r border-slate-100 text-center font-bold ${colorClass}`}>{row.average}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{row.attendance}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {stats.tableData.length > 5 && (
           <div className="p-2 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
             Showing 5 of {stats.tableData.length} records.
           </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">Students by Score</h3>
          <p className="text-[10px] text-slate-500 mb-4">Drill down to show the number of students by score bracket.</p>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={stats.studentsByScore}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Subject Average by Branch</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={stats.participationData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} width={80} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="rate" fill="#3b82f6" radius={[0, 2, 2, 0]} barSize={24} label={{ position: 'right', fill: '#64748b', fontSize: 10, formatter: (v:any)=>`${v}%` }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-80">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Examination Results by Branch</h3>
          <div className="flex justify-center gap-4 mb-2 text-[10px] font-medium text-slate-600">
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#22c55e] rounded-sm"></div> Pass</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 bg-[#ef4444] rounded-sm"></div> Fail</span>
          </div>
          <ResponsiveContainer width="100%" height="75%">
            <BarChart data={stats.examResultsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="Pass" stackId="a" fill="#22c55e" radius={[0, 0, 2, 2]} />
              <Bar dataKey="Fail" stackId="a" fill="#ef4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
