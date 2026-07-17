import { CSSProperties } from 'react';

export interface Category {
  id: string;
  name: string;
  weight: number; // percentage of total grade (e.g., 5)
  itemCount: number; // number of items (e.g., 5 for 5 quizzes)
  itemMaxScores: number[]; // maximum raw score for each item in this category
  itemNames?: string[]; // custom names for each item
  midtermWeight?: number; // weight for midterm mode
  finalWeight?: number; // weight for final mode
  fullTermMidtermWeight?: number;
  fullTermFinalWeight?: number;
  isMidterm?: boolean; // explicitly marks category as the Mid-Term exam
  isFinal?: boolean; // explicitly marks category as the Final exam
}

export interface Subject {
  id: string;
  name: string;
  targetWeight?: number; // Intended target weight for the subject (e.g. 25%)
  midtermTargetWeight?: number; // Target weight for midterm mode
  finalTargetWeight?: number; // Target weight for final mode
  midtermMaxScore?: number;
  finalMaxScore?: number;
  fullModeMidtermWeight?: number;
  fullModeFinalWeight?: number;
  categories: Category[];
  isHidden?: boolean;
}

export interface GradingScale {
  grade: string;
  minScore: number;
}

export interface Level {
  id: string;
  name: string;
  program?: string;
  color?: string;
  term?: string;
  year?: string;
  isArchived?: boolean;
  subjects: Subject[];
  gradingScale: GradingScale[];
  midtermGradingScale?: GradingScale[];
  finalGradingScale?: GradingScale[];
  statusScale?: GradingScale[];
  midtermStatusScale?: GradingScale[];
  finalStatusScale?: GradingScale[];
  customDivisor?: number;
  midtermCustomDivisor?: number;
  finalCustomDivisor?: number;
  attendanceWeight?: number;
}

export interface Student {
  id: string;
  name: string;
  sex: 'Male' | 'Female';
  scores: Record<string, number>; // key: `${categoryId}_${itemIndex}`
  attendance: string;
  attendanceS1?: AttendanceStatus;
  attendanceS2?: AttendanceStatus;
  attendanceRecords?: Record<string, AttendanceStatus>;
  comment: string;
  isHidden?: boolean;
}

export interface TeacherSettings {
  headerDarkness?: string;
  subjectBgLevel?: string;
  colorMode: 'subject' | 'category' | 'monochrome';
  colorDensity: 'light' | 'medium' | 'dark';
  headerWeight: 'bold' | 'normal';
  headerItalic: boolean;
  headerUppercase: boolean;
  rowIndent: boolean;
  showPointsInResult: boolean;
  showScoreColumns: boolean;
  showAvgColumns: boolean;
  showWtdColumns: boolean;
  showExamAvgColumnsFullMode?: boolean;
  showExamWtdColumnsFullMode?: boolean;
  autoBackup?: boolean;
  scoreColor?: 'black' | 'red' | 'blue' | 'green' | 'purple';
  gradingScale?: GradingScale[];
  midtermGradingScale?: GradingScale[];
  finalGradingScale?: GradingScale[];
  statusScale?: GradingScale[];
  midtermStatusScale?: GradingScale[];
  finalStatusScale?: GradingScale[];
  treatBlanksAsZero?: boolean;
  keepAvgOnHide?: boolean;
  keepWtdOnHide?: boolean;
  hideStudentNames?: boolean;
  divideByAllSubjects?: boolean;
  resultDisplayMode?: 'avg' | 'wtd' | 'both';
  showCategoryWeight?: boolean;
  showCategoryHideIcon?: boolean;
  showCategoryIcon?: boolean;
  categoryResultMode?: 'avg' | 'wtd';
  showExamAvgPercent?: boolean;
  showExamWtdPercent?: boolean;
  keepColumnMode?: 'every' | 'wtd' | 'both';
  showRegularCategories?: boolean;
  showTermResult?: boolean;
  completelyHideHiddenCategories?: boolean;
  hideRegularCategories?: boolean;
  showItemConfig?: boolean;
  dailySessions?: 1 | 2;
  showAttendance?: boolean;
  attendanceAbsencePenalty?: number;
  attendancePermissionPenalty?: number;
  attendanceStartDate?: string;
  attendanceEndDate?: string;
  attendanceDaysOfWeek?: 'Mon-Fri' | 'Mon-Sat' | 'Mon-Sun';
  attendanceS1Label?: string;
  attendanceS2Label?: string;
  excelStyleIndex?: number;
  excelGridLineLevel?: 'none' | 'light' | 'medium' | 'heavy';
  excelHeaderColor?: string;
  headerBgColor?: string;
  hideWeightSymbol?: boolean;
  conditionalFormatting?: { min: number; max: number; color: string; id: string }[];
  avgColorMode?: 'auto' | 'manual';
  avgTextColor?: string;
  avgBgColor?: string;
  resultColorMode?: 'auto' | 'manual';
  resultTextColor?: string;
  resultBgColor?: string;
  totalColorMode?: 'auto' | 'manual';
  totalTextColor?: string;
  totalBgColor?: string;
  rankColorMode?: 'auto' | 'manual';
  rankTextColor?: string;
  rankBgColor?: string;
  quizNoScoreWeeks?: number;
  attendanceNoScoreWeeks?: number;
  quizNoScoreDays?: number;
  attendanceNoScoreDays?: number;
  showWeightInHeader?: boolean;
  hideSystemTemplates?: boolean;
}

export interface ManualColorOption {
  id: string;
  name: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
}

export const MANUAL_COLORS: ManualColorOption[] = [
  { id: 'black', name: 'Black', textClass: 'text-black', bgClass: 'bg-black/15', borderClass: 'border-black/25' },
  { id: 'white', name: 'White', textClass: 'text-slate-800', bgClass: 'bg-white', borderClass: 'border-slate-300' },
  { id: 'slate', name: 'Slate', textClass: 'text-slate-700', bgClass: 'bg-slate-100', borderClass: 'border-slate-300' },
  { id: 'red', name: 'Red', textClass: 'text-red-700', bgClass: 'bg-red-100', borderClass: 'border-red-300' },
  { id: 'orange', name: 'Orange', textClass: 'text-orange-700', bgClass: 'bg-orange-100', borderClass: 'border-orange-300' },
  { id: 'amber', name: 'Amber', textClass: 'text-amber-700', bgClass: 'bg-amber-100', borderClass: 'border-amber-300' },
  { id: 'green', name: 'Green', textClass: 'text-green-700', bgClass: 'bg-green-100', borderClass: 'border-green-300' },
  { id: 'teal', name: 'Teal', textClass: 'text-teal-700', bgClass: 'bg-teal-100', borderClass: 'border-teal-300' },
  { id: 'blue', name: 'Blue', textClass: 'text-blue-700', bgClass: 'bg-blue-100', borderClass: 'border-blue-300' },
  { id: 'indigo', name: 'Indigo', textClass: 'text-indigo-700', bgClass: 'bg-indigo-100', borderClass: 'border-indigo-300' },
  { id: 'purple', name: 'Purple', textClass: 'text-purple-700', bgClass: 'bg-purple-100', borderClass: 'border-purple-300' },
  { id: 'pink', name: 'Pink', textClass: 'text-pink-700', bgClass: 'bg-pink-100', borderClass: 'border-pink-300' },
];

export type AttendanceStatus = 'Present' | 'Absent' | 'Permission' | 'None';

export interface ClassRecord {
  id: string;
  termName: string;
  className: string;
  teacherName: string;
  levelId: string;
  isPinned?: boolean;
  accessCode?: string;
  settings?: TeacherSettings;
  studentCount?: number;
  students?: Student[];
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
  lastQuizFilledAt?: string;
  lastAttendanceFilledAt?: string;
}

export function calculateGrade(
  score: number,
  resultMode: 'full' | 'midterm' | 'final' = 'full',
  settings?: TeacherSettings,
  level?: Level
): string {
  const isMidtermOrFinal = resultMode === 'midterm' || resultMode === 'final';
  
  const isOldStatusScale = (s?: { grade: string }[]) => {
    if (!s || s.length === 0) return false;
    return s.some(item => item.grade === 'Pass' || item.grade === 'Repeat' || item.grade === 'Fail +');
  };

  const levelGrading = isMidtermOrFinal 
    ? (resultMode === 'midterm' ? level?.midtermGradingScale : level?.finalGradingScale)
    : level?.gradingScale;

  const settingsGrading = isMidtermOrFinal
    ? (resultMode === 'midterm' ? settings?.midtermGradingScale : settings?.finalGradingScale)
    : settings?.gradingScale;

  const scale = (levelGrading && !isOldStatusScale(levelGrading) ? levelGrading : null) || 
                (settingsGrading && !isOldStatusScale(settingsGrading) ? settingsGrading : null) || [
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

  const sortedScale = [...scale].sort((a, b) => b.minScore - a.minScore);
  for (const item of sortedScale) {
    if (score >= item.minScore) {
      return item.grade;
    }
  }
  return sortedScale[sortedScale.length - 1]?.grade || 'F';
}

export function calculateStatus(
  score: number,
  resultMode: 'full' | 'midterm' | 'final',
  settings?: TeacherSettings,
  attendance?: string,
  level?: Level
): string {
  const isMidtermOrFinal = resultMode === 'midterm' || resultMode === 'final';

  if (isMidtermOrFinal) {
    const levelScale = resultMode === 'midterm' ? level?.midtermStatusScale : level?.finalStatusScale;
    const settingsScale = resultMode === 'midterm' ? settings?.midtermStatusScale : settings?.finalStatusScale;
    
    // Fallback to legacy status scale if new ones aren't defined
    const scale = levelScale || settingsScale || [
      { grade: 'Pass', minScore: 70 },
      { grade: 'Fail', minScore: 0 },
    ];
    const sortedScale = [...scale].sort((a, b) => b.minScore - a.minScore);
    for (const item of sortedScale) {
      if (score >= item.minScore) {
        return item.grade;
      }
    }
    return sortedScale[sortedScale.length - 1]?.grade || 'Fail';
  } else {
    const scale = level?.statusScale || settings?.statusScale || [
      { grade: 'Pass', minScore: 70 },
      { grade: 'Repeat', minScore: 60 },
      { grade: 'Fail +', minScore: 0 },
    ];
    const sortedScale = [...scale].sort((a, b) => b.minScore - a.minScore);
    let status = '';
    let matched = false;
    for (const item of sortedScale) {
      if (score >= item.minScore) {
        status = item.grade;
        matched = true;
        break;
      }
    }
    if (!matched) {
      status = sortedScale[sortedScale.length - 1]?.grade || 'Fail +';
    }

    const attendanceVal = parseFloat(attendance || "100");
    if (!isNaN(attendanceVal) && attendanceVal < 70) {
      status = "Fail";
    }
    return status;
  }
}

export function isMidtermCategoryName(name: string): boolean {
  const n = name.toUpperCase();
  return n.includes("MID-TERM") || n.includes("MID TERM") || n.includes("MIDTERM") || n.includes("MID EXAM") || n.includes("MID TEST") || n.includes("GRAMMAR TEST");
}

export function isFinalCategoryName(name: string): boolean {
  const n = name.toUpperCase();
  return n.includes("FINAL") || n.includes("SPEAKING");
}

export function isMidtermCat(cat: Category): boolean {
  if (cat.isMidterm === true) return true;
  if (cat.isMidterm === false) return false;
  if ((cat.midtermWeight && cat.midtermWeight > 0) && (!cat.finalWeight || cat.finalWeight === 0) && (!cat.weight || cat.weight === 0)) {
    return true;
  }
  return isMidtermCategoryName(cat.name);
}

export function isFinalCat(cat: Category): boolean {
  if (cat.isFinal === true) return true;
  if (cat.isFinal === false) return false;
  if ((cat.finalWeight && cat.finalWeight > 0) && (!cat.midtermWeight || cat.midtermWeight === 0) && (!cat.weight || cat.weight === 0)) {
    return true;
  }
  return isFinalCategoryName(cat.name);
}

export function getSubjectWeight(subject: Subject, resultMode: 'full' | 'midterm' | 'final' = 'full'): number {
  if (resultMode === 'midterm') {
    return subject.midtermTargetWeight !== undefined && subject.midtermTargetWeight > 0 
      ? subject.midtermTargetWeight 
      : (subject.midtermMaxScore || 100);
  }
  if (resultMode === 'final') {
    return subject.finalTargetWeight !== undefined && subject.finalTargetWeight > 0 
      ? subject.finalTargetWeight 
      : (subject.finalMaxScore || 100);
  }
  
  const catWeight = subject.categories
    .filter(cat => !isMidtermCat(cat) && !isFinalCat(cat))
    .reduce((sum, cat) => sum + (cat.weight || 0), 0);
  return catWeight + (subject.fullModeMidtermWeight ?? 0) + (subject.fullModeFinalWeight ?? 0);
}

export function getLevelTotalWeight(level: Level): number {
  return level.subjects.reduce((sum, sub) => {
    const target = sub.targetWeight !== undefined && sub.targetWeight > 0 ? sub.targetWeight : getSubjectWeight(sub);
    return sum + target;
  }, 0);
}

export interface PaperStyle {
  id: string;
  name: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  tableHeaderClass?: string;
  customStyle?: CSSProperties;
}

export const PAPER_STYLES: PaperStyle[] = [
  { id: 'white_smooth', name: 'White Smooth (Default)', bgClass: 'bg-white', borderClass: 'border-slate-200', textClass: 'text-slate-800' },
  { id: 'rose_dot', name: 'Rose Dot', bgClass: 'bg-[#fff5f5]', borderClass: 'border-rose-100', textClass: 'text-rose-950', customStyle: { backgroundImage: 'radial-gradient(#fda4af 1px, transparent 1px)', backgroundSize: '16px 16px' } },
  { id: 'soft_peach', name: 'Soft Peach', bgClass: 'bg-[#fffaf0]', borderClass: 'border-orange-100', textClass: 'text-amber-950', customStyle: { backgroundImage: 'radial-gradient(#fed7aa 1px, transparent 1px)', backgroundSize: '16px 16px' } },
  { id: 'lavender_grid', name: 'Lavender Grid', bgClass: 'bg-[#faf5ff]', borderClass: 'border-purple-100', textClass: 'text-purple-950', customStyle: { backgroundImage: 'linear-gradient(to right, #e9d5ff 1px, transparent 1px), linear-gradient(to bottom, #e9d5ff 1px, transparent 1px)', backgroundSize: '20px 20px' } },
  { id: 'mint_mist', name: 'Mint Mist', bgClass: 'bg-[#f0fdf4]', borderClass: 'border-emerald-100', textClass: 'text-emerald-950', customStyle: { backgroundImage: 'radial-gradient(#a7f3d0 1px, transparent 1px)', backgroundSize: '18px 18px' } },
  { id: 'sky_sketch', name: 'Sky Sketch', bgClass: 'bg-[#f0f9ff]', borderClass: 'border-sky-100', textClass: 'text-sky-950', customStyle: { backgroundImage: 'linear-gradient(to right, #bae6fd 1px, transparent 1px), linear-gradient(to bottom, #bae6fd 1px, transparent 1px)', backgroundSize: '20px 20px' } },
  { id: 'vintage_cream', name: 'Vintage Cream', bgClass: 'bg-[#fdfbf7]', borderClass: 'border-yellow-100', textClass: 'text-amber-900', customStyle: { backgroundImage: 'radial-gradient(#fef08a 0.8px, transparent 0.8px)', backgroundSize: '14px 14px' } },
  { id: 'sand_shell', name: 'Sand Shell', bgClass: 'bg-[#fafaf9]', borderClass: 'border-stone-200', textClass: 'text-stone-800' },
  { id: 'classic_linen', name: 'Classic Linen', bgClass: 'bg-[#fafaf6]', borderClass: 'border-stone-200', textClass: 'text-stone-900', customStyle: { backgroundImage: 'linear-gradient(90deg, rgba(200,200,200,0.05) 50%, transparent 50%), linear-gradient(rgba(200,200,200,0.05) 50%, transparent 50%)', backgroundSize: '4px 4px' } },
  { id: 'cherry_blossom', name: 'Cherry Blossom', bgClass: 'bg-[#fff0f3]', borderClass: 'border-pink-100', textClass: 'text-pink-900' },
  { id: 'apricot_tint', name: 'Apricot Tint', bgClass: 'bg-[#fffdf5]', borderClass: 'border-amber-200/60', textClass: 'text-amber-900' },
  { id: 'matcha_latte', name: 'Matcha Latte', bgClass: 'bg-[#f4f9f4]', borderClass: 'border-green-200/50', textClass: 'text-emerald-900' },
  { id: 'ice_blue', name: 'Ice Blue', bgClass: 'bg-[#f5faff]', borderClass: 'border-blue-200/50', textClass: 'text-blue-900' },
  { id: 'lemon_chiffon', name: 'Lemon Chiffon', bgClass: 'bg-[#fffbeb]', borderClass: 'border-yellow-200/60', textClass: 'text-yellow-900' },
  { id: 'sage_soft', name: 'Sage Soft', bgClass: 'bg-[#f1f5f2]', borderClass: 'border-stone-300/60', textClass: 'text-stone-800' },
  { id: 'lilac_pastel', name: 'Lilac Pastel', bgClass: 'bg-[#fdf4ff]', borderClass: 'border-fuchsia-100', textClass: 'text-fuchsia-900' },
  { id: 'slate_whisper', name: 'Slate Whisper', bgClass: 'bg-[#f8fafc]', borderClass: 'border-slate-200', textClass: 'text-slate-800' },
  { id: 'parchment_antique', name: 'Parchment Antique', bgClass: 'bg-[#faf6e8]', borderClass: 'border-amber-200', textClass: 'text-amber-950', customStyle: { backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '10px 100%' } },
  { id: 'plum_blossom', name: 'Plum Blossom', bgClass: 'bg-[#fdf2f8]', borderClass: 'border-pink-200/50', textClass: 'text-pink-950' },
  { id: 'foggy_blue', name: 'Foggy Blue', bgClass: 'bg-[#f1f5f9]', borderClass: 'border-slate-300/50', textClass: 'text-slate-800' }
];

export interface Wallpaper {
  id: string;
  name: string;
  bgClass: string;
}

export const WALLPAPERS: Wallpaper[] = [
  { id: 'default_slate', name: 'Default Slate', bgClass: 'bg-slate-50' },
  { id: 'light_green', name: 'Light Pastel Green', bgClass: 'bg-[#f2faf5]' },
  { id: 'light_purple', name: 'Light Pastel Purple', bgClass: 'bg-[#f7f2fa]' },
  { id: 'light_blue', name: 'Light Pastel Blue', bgClass: 'bg-[#f2f7fa]' },
  { id: 'light_pink', name: 'Light Pastel Pink', bgClass: 'bg-[#faf2f5]' },
  { id: 'light_peach', name: 'Light Pastel Peach', bgClass: 'bg-[#faf6f2]' },
  { id: 'light_yellow', name: 'Light Pastel Yellow', bgClass: 'bg-[#f9faf2]' },
  { id: 'cream_alabaster', name: 'Cream Alabaster', bgClass: 'bg-[#fbfaf7]' },
  { id: 'warm_oatmeal', name: 'Warm Oatmeal', bgClass: 'bg-[#f7f5f0]' },
  { id: 'muted_sage', name: 'Muted Sage', bgClass: 'bg-[#f3f6f3]' },
  { id: 'ocean_air', name: 'Ocean Air', bgClass: 'bg-[#f0f4f8]' },
  { id: 'morning_mist', name: 'Morning Mist', bgClass: 'bg-[#edf2f4]' },
  { id: 'rose_quartz', name: 'Rose Quartz', bgClass: 'bg-[#faf0f2]' },
  { id: 'lavender_frost', name: 'Lavender Frost', bgClass: 'bg-[#f4f0fa]' },
  { id: 'honeydew', name: 'Honeydew', bgClass: 'bg-[#f0faf4]' },
  { id: 'chiffon_lemon', name: 'Chiffon Lemon', bgClass: 'bg-[#fcfae6]' },
  { id: 'warm_sand', name: 'Warm Sand', bgClass: 'bg-[#faf6f0]' },
  { id: 'linen_blush', name: 'Linen Blush', bgClass: 'bg-[#faf2f0]' },
  { id: 'quiet_teal', name: 'Quiet Teal', bgClass: 'bg-[#f0fafc]' },
  { id: 'cotton_white', name: 'Cotton White', bgClass: 'bg-[#fafafa]' }
];



export type NeuralEngine = 'gemini-1.5-pro' | 'gemini-1.5-flash' | 'gemini-3-flash-preview' | 'gpt-4' | string;
export interface QuickSource { data: string; mimeType: string; }
export interface OutlineItem { id: string; title: string; expanded?: boolean; children?: OutlineItem[]; }
export type ExternalKeys = Record<string, string>;
