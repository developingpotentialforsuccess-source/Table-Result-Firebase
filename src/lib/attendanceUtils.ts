import { Student, TeacherSettings } from '../types';

export function calculateAttendanceMetrics(student: Student, settings: TeacherSettings): { percentage: number, frequency: number } {
  if (!student.attendanceRecords) return { percentage: 100, frequency: 0 };
  
  let frequency = 0;

  Object.values(student.attendanceRecords).forEach(status => {
    if (status === 'Absent') {
      frequency += 1;
    } else if (status === 'Permission') {
      frequency += 0.25;
    }
  });

  const penaltyMultiplier = settings.attendanceAbsencePenalty ?? 7.5; 
  const rawPercentage = 100 - (frequency * penaltyMultiplier);
  const percentage = Math.max(0, Math.round(rawPercentage * 100) / 100);

  return { percentage, frequency };
}

export function calculateAttendancePercentage(student: Student, settings: TeacherSettings): number {
  return calculateAttendanceMetrics(student, settings).percentage;
}

export function generateDateRange(startStr?: string, endStr?: string, daysOfWeek?: 'Mon-Fri' | 'Mon-Sat' | 'Mon-Sun'): Date[] {
  const dates: Date[] = [];
  if (!startStr || !endStr) return dates;
  
  const start = new Date(startStr);
  const end = new Date(endStr);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return dates;
  if (start > end) return dates;

  const mode = daysOfWeek || 'Mon-Fri';

  let current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    
    let includeDay = false;
    if (mode === 'Mon-Fri') {
      includeDay = day !== 0 && day !== 6;
    } else if (mode === 'Mon-Sat') {
      includeDay = day !== 0;
    } else if (mode === 'Mon-Sun') {
      includeDay = true;
    }

    if (includeDay) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}
