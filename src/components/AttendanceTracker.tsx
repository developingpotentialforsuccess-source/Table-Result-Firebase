import React, { useState, useMemo } from 'react';
import { Student, TeacherSettings, AttendanceStatus } from '../types';
import { generateDateRange, calculateAttendanceMetrics } from '../lib/attendanceUtils';
import { Settings2, CalendarDays, Users, Search, X, Check } from 'lucide-react';

interface AttendanceTrackerProps {
  students: Student[];
  settings: TeacherSettings;
  program?: string;
  searchQuery?: string;
  onUpdateSettings?: (settings: TeacherSettings) => void;
  onUpdateStudentField: (studentId: string, field: string, value: any) => void;
  onUpdateAttendanceRecord: (studentId: string, dateKey: string, status: AttendanceStatus) => void;
  onMarkAllPresent: (dateKey: string) => void;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  students,
  settings,
  program = "",
  searchQuery = "",
  onUpdateSettings,
  onUpdateStudentField,
  onUpdateAttendanceRecord,
  onMarkAllPresent,
}) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly' | 'termly'>('weekly');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showConfig, setShowConfig] = useState(false);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(s => s.name.toLowerCase().includes(query));
  }, [students, searchQuery]);

  const visibleDates = useMemo(() => {
    let start, end;
    
    if (viewMode === 'termly') {
      if (settings.attendanceStartDate && settings.attendanceEndDate) {
        start = settings.attendanceStartDate;
        end = settings.attendanceEndDate;
      } else {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        start = new Date(currentYear, currentMonth, 1).toISOString();
        end = new Date(currentYear, currentMonth + 1, 0).toISOString();
      }
    } else if (viewMode === 'monthly') {
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      start = new Date(currentYear, currentMonth, 1).toISOString();
      end = new Date(currentYear, currentMonth + 1, 0).toISOString();
    } else if (viewMode === 'weekly') {
      const currentWeekStart = new Date(currentDate);
      const day = currentWeekStart.getDay();
      const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
      currentWeekStart.setDate(diff); // Monday
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // Sunday
      start = currentWeekStart.toISOString();
      end = currentWeekEnd.toISOString();
    }
    
    const rawDates = generateDateRange(start, end, settings.attendanceDaysOfWeek);
    
    return rawDates;
  }, [settings.attendanceStartDate, settings.attendanceEndDate, settings.attendanceDaysOfWeek, viewMode, currentDate]);

  const toggleStatus = (currentStatus?: AttendanceStatus): AttendanceStatus => {
    if (!currentStatus || currentStatus === 'None') return 'Present';
    if (currentStatus === 'Present') return 'Absent';
    if (currentStatus === 'Absent') return 'Permission';
    return 'None';
  };

  const getStatusColor = (status?: AttendanceStatus, session?: number) => {
    if (status === 'Present') return session === 2 ? 'text-indigo-600 font-black' : 'text-emerald-600 font-black';
    if (status === 'Absent') return session === 2 ? 'text-rose-600 font-black bg-rose-50/50' : 'text-red-600 font-black bg-red-50/50';
    if (status === 'Permission') return session === 2 ? 'text-amber-600 font-black bg-amber-50/50' : 'text-orange-600 font-black bg-orange-50/50';
    return 'text-slate-300';
  };

  const getStatusLabel = (status?: AttendanceStatus) => {
    if (status === 'Present') return '✓';
    if (status === 'Absent') return 'A';
    if (status === 'Permission') return 'P';
    return '-';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 gap-4">
        <div className="flex gap-2">
          <button onClick={() => setViewMode('weekly')} className={`px-4 py-1.5 text-sm rounded-lg transition-all font-bold ${viewMode === 'weekly' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Weekly</button>
          <button onClick={() => setViewMode('monthly')} className={`px-4 py-1.5 text-sm rounded-lg transition-all font-bold ${viewMode === 'monthly' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Monthly</button>
          <button onClick={() => setViewMode('termly')} className={`px-4 py-1.5 text-sm rounded-lg transition-all font-bold ${viewMode === 'termly' ? 'bg-blue-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>Termly</button>
        </div>
        
        <div className="flex items-center gap-4">
          {viewMode !== 'termly' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'monthly') newDate.setMonth(newDate.getMonth() - 1);
                  if (viewMode === 'weekly') newDate.setDate(newDate.getDate() - 7);
                  setCurrentDate(newDate);
                }}
                className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
              >
                &larr; Prev
              </button>
              <span className="font-bold text-slate-700 text-sm min-w-[200px] text-center">
                {viewMode === 'monthly' ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : 
                 (visibleDates.length > 0 ? `${visibleDates[0].toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })} - ${visibleDates[visibleDates.length - 1].toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}` : `Week of ${currentDate.toLocaleDateString()}`)}
              </span>
              <button 
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'monthly') newDate.setMonth(newDate.getMonth() + 1);
                  if (viewMode === 'weekly') newDate.setDate(newDate.getDate() + 7);
                  setCurrentDate(newDate);
                }}
                className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
              >
                Next &rarr;
              </button>
            </div>
          )}
          <button 
            onClick={() => setShowConfig(!showConfig)}
            className={`px-3 py-1.5 flex items-center gap-2 text-sm rounded border transition-colors ${showConfig ? 'bg-slate-200 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            <Settings2 className="w-4 h-4" />
            {showConfig ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {showConfig && (
        <div className="p-4 border-b border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 shadow-inner">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Start Date</label>
            <input 
              type="date" 
              value={settings.attendanceStartDate || ''}
              onChange={(e) => onUpdateSettings?.({ ...settings, attendanceStartDate: e.target.value })}
              className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> End Date</label>
            <input 
              type="date" 
              value={settings.attendanceEndDate || ''}
              onChange={(e) => onUpdateSettings?.({ ...settings, attendanceEndDate: e.target.value })}
              className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Days</label>
            <select 
              value={settings.attendanceDaysOfWeek || 'Mon-Fri'}
              onChange={(e) => onUpdateSettings?.({ ...settings, attendanceDaysOfWeek: e.target.value as any })}
              className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
            >
              <option value="Mon-Fri">Mon - Fri</option>
              <option value="Mon-Sat">Mon - Sat</option>
              <option value="Mon-Sun">Mon - Sun</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> Sessions/Day</label>
            <select 
              value={settings.dailySessions || 1}
              onChange={(e) => onUpdateSettings?.({ ...settings, dailySessions: parseInt(e.target.value) as 1 | 2 })}
              className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
            >
              <option value={1}>1 Session</option>
              <option value={2}>2 Sessions</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Penalty/Absence</label>
            <input 
              type="number" 
              step="0.1"
              value={settings.attendanceAbsencePenalty ?? 7.5}
              onChange={(e) => onUpdateSettings?.({ ...settings, attendanceAbsencePenalty: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
              title="Points deducted from 100 per 1.0 Frequency"
            />
          </div>
          {settings.dailySessions === 2 && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">S1 Label (e.g. Teacher 1)</label>
                <input 
                  type="text" 
                  value={settings.attendanceS1Label || 'S1'}
                  onChange={(e) => onUpdateSettings?.({ ...settings, attendanceS1Label: e.target.value })}
                  className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">S2 Label (e.g. Teacher 2)</label>
                <input 
                  type="text" 
                  value={settings.attendanceS2Label || 'S2'}
                  onChange={(e) => onUpdateSettings?.({ ...settings, attendanceS2Label: e.target.value })}
                  className="w-full px-2 py-1.5 rounded border border-slate-300 text-sm"
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar bg-slate-50/30">
        <table className="min-w-max w-full text-left text-sm text-slate-600 border-collapse table-fixed">
          <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-3 font-bold border-r border-b border-slate-200 sticky left-0 bg-slate-50 z-30 w-12 text-center">No</th>
              <th className="px-4 py-3 font-bold border-r border-b border-slate-200 sticky left-12 bg-slate-50 z-30 w-48">Student Name</th>
              <th className="px-2 py-3 font-bold border-r border-b border-slate-200 text-center bg-blue-50 w-20" title="Attendance Percentage">Att.</th>
              <th className="px-2 py-3 font-bold border-r border-b border-slate-200 text-center bg-emerald-50 w-24" title="Attendance Frequency (A=1, P=0.25)">Freq.</th>
              {visibleDates.map((date, i) => (
                <React.Fragment key={i}>
                  <th className={`px-2 py-3 font-bold border-r border-b border-slate-200 text-center ${viewMode === 'weekly' ? 'w-64' : 'w-24'}`} colSpan={settings.dailySessions === 2 ? 2 : 1}>
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{date.toLocaleDateString('default', { month: 'short', day: 'numeric' })}</span>
                        {settings.dailySessions !== 2 && (
                          <button 
                            onClick={() => onMarkAllPresent(`${date.toISOString().split('T')[0]}_S1`)}
                            className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-full transition-colors"
                            title="Mark All Present"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-bold uppercase">{date.toLocaleDateString('default', { weekday: 'long' })}</span>
                    </div>
                  </th>
                </React.Fragment>
              ))}
            </tr>
            {settings.dailySessions === 2 && visibleDates.length > 0 && (
              <tr>
                <th className="border-r border-b border-slate-200 sticky left-0 bg-slate-50 z-30"></th>
                <th className="border-r border-b border-slate-200 sticky left-12 bg-slate-50 z-30"></th>
                <th className="border-r border-b border-slate-200 bg-blue-50"></th>
                <th className="border-r border-b border-slate-200 bg-emerald-50"></th>
                {visibleDates.map((date, i) => (
                  <React.Fragment key={`sub_${i}`}>
                    <th className={`px-1 py-1 font-bold border-r border-b border-slate-200 text-center text-[10px] bg-blue-50/40 text-blue-700 ${viewMode === 'weekly' ? 'w-1/2' : 'w-10'}`}>
                      <div className="flex items-center justify-center gap-1">
                        {settings.attendanceS1Label || 'S1'}
                        <button 
                          onClick={() => onMarkAllPresent(`${date.toISOString().split('T')[0]}_S1`)}
                          className="p-0.5 hover:bg-blue-100 rounded transition-colors"
                          title="Mark All Present"
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </button>
                      </div>
                    </th>
                    <th className={`px-1 py-1 font-bold border-r border-b border-slate-200 text-center text-[10px] bg-purple-50/40 text-purple-700 ${viewMode === 'weekly' ? 'w-1/2' : 'w-10'}`}>
                      <div className="flex items-center justify-center gap-1">
                        {settings.attendanceS2Label || 'S2'}
                        <button 
                          onClick={() => onMarkAllPresent(`${date.toISOString().split('T')[0]}_S2`)}
                          className="p-0.5 hover:bg-purple-100 rounded transition-colors"
                          title="Mark All Present"
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </button>
                      </div>
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {filteredStudents.filter(s => !s.isHidden).map((student, idx) => {
              const metrics = calculateAttendanceMetrics(student, settings);
              const isEnglish = program.toLowerCase().includes('english');
              
              return (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  <td className="px-3 py-2 text-center border-r border-slate-200 font-medium text-slate-400 sticky left-0 bg-white z-10">{idx + 1}</td>
                  <td className={`px-4 py-2 border-r border-slate-200 font-bold text-slate-800 sticky left-12 bg-white z-10 truncate ${settings?.hideStudentNames ? 'filter blur-[3px] select-none' : ''}`}>
                    {settings?.hideStudentNames ? `Student ${idx + 1}` : student.name}
                  </td>
                  <td className="px-2 py-2 border-r border-slate-200 text-center font-bold text-blue-700 bg-blue-50/20">{metrics.percentage.toFixed(2)}</td>
                  <td className="px-2 py-2 border-r border-slate-200 text-center font-bold text-emerald-700 bg-emerald-50/20">{metrics.frequency.toFixed(2)}</td>
                  {visibleDates.map((date, i) => {
                      const dateStr = date.toISOString().split('T')[0];
                      const isSaturday = date.getDay() === 6;

                      if (settings.dailySessions === 2) {
                        const s1Key = `${dateStr}_S1`;
                        const s2Key = `${dateStr}_S2`;
                        const s1Raw = student.attendanceRecords?.[s1Key];
                        const s2Raw = student.attendanceRecords?.[s2Key];
                        
                        const s1Status = (isEnglish && isSaturday && (!s1Raw || s1Raw === 'None')) ? 'Present' : s1Raw;
                        const s2Status = (isEnglish && isSaturday && (!s2Raw || s2Raw === 'None')) ? 'Present' : s2Raw;

                        return (
                          <React.Fragment key={`cell_${i}`}>
                            <td className="px-0 py-0 border-r border-slate-200 text-center h-full bg-blue-50/5">
                              <button 
                                className={`w-full h-full min-h-[48px] text-lg hover:bg-slate-100 transition-colors ${getStatusColor(s1Status, 1)}`}
                                onClick={() => onUpdateAttendanceRecord(student.id, s1Key, toggleStatus(s1Raw))}
                              >
                                {getStatusLabel(s1Status)}
                              </button>
                            </td>
                            <td className="px-0 py-0 border-r border-slate-200 text-center h-full bg-purple-50/5">
                              <button 
                                className={`w-full h-full min-h-[48px] text-lg hover:bg-slate-100 transition-colors ${getStatusColor(s2Status, 2)}`}
                                onClick={() => onUpdateAttendanceRecord(student.id, s2Key, toggleStatus(s2Raw))}
                              >
                                {getStatusLabel(s2Status)}
                              </button>
                            </td>
                          </React.Fragment>
                        );
                      } else {
                        const s1Key = `${dateStr}_S1`;
                        const s1Raw = student.attendanceRecords?.[s1Key];
                        const s1Status = (isEnglish && isSaturday && (!s1Raw || s1Raw === 'None')) ? 'Present' : s1Raw;

                        return (
                          <td key={`cell_${i}`} className="px-0 py-0 border-r border-slate-200 text-center h-full">
                            <button 
                              className={`w-full h-full min-h-[48px] text-lg hover:bg-slate-100 transition-colors ${getStatusColor(s1Status, 1)}`}
                              onClick={() => onUpdateAttendanceRecord(student.id, s1Key, toggleStatus(s1Raw))}
                            >
                                {getStatusLabel(s1Status)}
                            </button>
                          </td>
                        );
                      }
                    })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
