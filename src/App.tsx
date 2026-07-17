import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Settings,
  Plus,
  Download,
  Calculator,
  GraduationCap,
  Users,
  FolderOpen,
  Save,
  FileSpreadsheet,
  FileText,
  Search,
  Maximize,
  Minimize,
  Pin,
  LogOut,
  Trash2,
  Edit2,
  Copy,
  Lock,
  Sparkles,
  LayoutDashboard,
  Table2,
  ChevronDown,
  Check,
  X,
  ArrowUpDown,
  Unlock,
  Calendar,
  Bell,
  RefreshCw,
  Clipboard,
  SlidersHorizontal,
  Eye,
  EyeOff,
  User as UserIcon,
  UserPlus,
  BookOpen,
  AlertTriangle,
  Info,
  Database
} from "lucide-react";
import {
  Level,
  Student,
  GradingScale,
  ClassRecord,
  TeacherSettings,
  AttendanceStatus,
  getLevelTotalWeight,
  calculateGrade,
  PAPER_STYLES,
  WALLPAPERS,
} from "./types";
import SettingsModal from "./components/SettingsModal";
import GradeTable from "./components/GradeTable";
import { Dashboard } from "./components/Dashboard";
import { AttendanceTracker } from "./components/AttendanceTracker";
import { exportToPDF } from "./lib/exportUtils";
import { parsePastedClassProfile } from "./lib/parsePaste";
import { exportToExcelFull } from "./lib/excelExport";
import { exportToPDFFull } from "./lib/pdfExport";
import { SYSTEM_TEMPLATES } from "./lib/templates";
import { exportFullBackup, importFullBackup, createBackupData } from "./lib/backupUtils";
import { auth, googleProvider, db, isFirebaseConfigured } from "./lib/firebase";
import { saveToDrive } from "./lib/googleDriveUtils";
import { collection, getDocs, addDoc, updateDoc, query, where } from "firebase/firestore";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  subscribeToLevels,
  subscribeToClasses,
  subscribeToStudents,
  saveLevel,
  saveLevelsBatch,
  saveClassRecord,
  saveStudent,
  saveStudentsBatch,
  deleteStudent,
  deleteClassRecordRef,
  deleteLevel,
  getLocalLevels,
  getLocalClasses,
  getLocalStudents,
} from "./lib/firestoreUtils";
import { isMidtermCategory, isFinalCategory } from "./lib/categoryUtils";

const DEFAULT_SETTINGS: TeacherSettings = {
  colorMode: 'monochrome',
  colorDensity: 'dark',
  headerWeight: 'bold',
  headerItalic: false,
  headerUppercase: false,
  rowIndent: false,
  showPointsInResult: false,
  showScoreColumns: true,
  showAvgColumns: false,
  showWtdColumns: true,
  autoBackup: true,
  scoreColor: 'black',
  treatBlanksAsZero: true,
  keepAvgOnHide: true,
  keepWtdOnHide: false,
  divideByAllSubjects: true,
  resultDisplayMode: 'wtd',
  showCategoryWeight: true,
  showCategoryHideIcon: false,
  completelyHideHiddenCategories: true,
  showWeightInHeader: true,
  dailySessions: 2,
  showAttendance: true,
  attendanceAbsencePenalty: 7.5,
  attendancePermissionPenalty: 0.25,
  attendanceStartDate: '2026-07-06',
  attendanceEndDate: '2026-07-31',
  attendanceS1Label: 'S1',
  attendanceS2Label: 'S2',
  excelStyleIndex: 6, // Default to DPS Corporate Navy
  excelGridLineLevel: 'medium',
  excelHeaderColor: '#000000',
  headerBgColor: 'transparent',
  hideWeightSymbol: false,
  conditionalFormatting: [
    { id: '1', min: 95, max: 100, color: '#059669' }, // light green
    { id: '2', min: 50, max: 94.99, color: '#2563eb' }, // blue
    { id: '3', min: 0, max: 49.99, color: '#dc2626' }, // red
  ],
  attendanceDaysOfWeek: 'Mon-Fri',
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
  midtermGradingScale: [
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
  finalGradingScale: [
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
  statusScale: [
    { grade: 'Pass', minScore: 70 },
    { grade: 'Repeat', minScore: 60 },
    { grade: 'Fail +', minScore: 0 },
  ],
  midtermStatusScale: [
    { grade: 'Pass', minScore: 50 },
    { grade: 'Fail', minScore: 0 },
  ],
  finalStatusScale: [
    { grade: 'Pass', minScore: 50 },
    { grade: 'Fail', minScore: 0 },
  ],
  quizNoScoreWeeks: 0,
  attendanceNoScoreWeeks: 0,
};

const SAMPLE_TEACHERS = [
  "Davina",
  "Sek Sokha",
  "Sok Sopheap",
  "Chan Srey",
  "Keo Sarath",
  "Nguon Vanna",
  "Ouk Davin",
  "Seng Dara",
  "Tep Bopha",
  "DPS Admin",
];

const DEFAULT_GRADING_SCALE: GradingScale[] = [
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

const DEFAULT_MIDTERM_FINAL_SCALE: GradingScale[] = [
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

const SAMPLE_5_SUBJECTS: Level = {
  id: "sample_5_subj",
  name: "Sample 5 Subjects (20% each)",
  gradingScale: DEFAULT_GRADING_SCALE,
  subjects: ["Reading", "Vocabulary", "Listening", "Speaking", "Grammar", "Traffic Law"].map(
    (name, i) => ({
      id: `s_sample_${i}`,
      name,
      targetWeight: 16.66,
      categories: [
        {
          id: `c_cp_${i}`,
          name: "Class Participation",
          weight: 10,
          itemCount: 1,
          itemMaxScores: [100],
        },
        {
          id: `c_ass_${i}`,
          name: "Assignment",
          weight: 10,
          itemCount: 1,
          itemMaxScores: [100],
        },
        {
          id: `c_mid_${i}`,
          name: "Midterm",
          weight: 30,
          itemCount: 1,
          itemMaxScores: [100],
        },
        {
          id: `c_fin_${i}`,
          name: "Final",
          weight: 50,
          itemCount: 1,
          itemMaxScores: [100],
        },
      ],
    }),
  ),
};

const DEFAULT_LEVELS: Level[] = [
  {
    id: "pte_foundation_a",
    name: "Level Foundation A",
    gradingScale: DEFAULT_GRADING_SCALE,
    program: "Part-time English",
    subjects: [
      {
        id: "fa_eng",
        name: "English",
        targetWeight: 100,
        categories: [
          { id: "fa_voc", name: "Vocabulary", weight: 40, itemCount: 1, itemMaxScores: [100] },
          { id: "fa_dict", name: "Dictation", weight: 10, itemCount: 1, itemMaxScores: [100] },
          { id: "fa_spe", name: "Speaking", weight: 50, itemCount: 1, itemMaxScores: [100] }
        ]
      }
    ]
  },
  {
    id: "fte_2a",
    name: "Level 2A",
    gradingScale: DEFAULT_GRADING_SCALE,
    program: "Full-time English",
    subjects: [
      {
        id: "fte_2a_read",
        name: "Reading",
        targetWeight: 100,
        categories: [
          { id: "fte_2a_read_wq", name: "Weekly Quiz", weight: 20, itemCount: 5, itemMaxScores: [100,100,100,100,100] },
          { id: "fte_2a_read_mt", name: "Midterm", weight: 30, itemCount: 1, itemMaxScores: [100], isMidterm: true },
          { id: "fte_2a_read_ft", name: "Final", weight: 50, itemCount: 1, itemMaxScores: [100], isFinal: true }
        ]
      }
    ]
  },
  {
    id: "khmer_l1",
    name: "Khmer Level 1",
    gradingScale: DEFAULT_GRADING_SCALE,
    program: "Khmer Program",
    subjects: [
      {
        id: "khmer_l1_reading",
        name: "Reading",
        targetWeight: 50,
        categories: [{ id: "khmer_l1_read_main", name: "Reading", weight: 100, itemCount: 1, itemMaxScores: [100] }]
      },
      {
        id: "khmer_l1_writing",
        name: "Writing",
        targetWeight: 50,
        categories: [{ id: "khmer_l1_writ_main", name: "Writing", weight: 100, itemCount: 1, itemMaxScores: [100] }]
      }
    ]
  },
  {
    id: "math_l1",
    name: "Math Level 1",
    gradingScale: DEFAULT_GRADING_SCALE,
    program: "Math Program",
    subjects: [
      {
        id: "math_l1_main",
        name: "Math",
        targetWeight: 100,
        categories: [{ id: "math_l1_cat", name: "Math Quiz", weight: 100, itemCount: 1, itemMaxScores: [100] }]
      }
    ]
  },
  {
    id: "dpss_l6",
    name: "DPSS Level 6",
    gradingScale: DEFAULT_GRADING_SCALE,
    program: "DPSS Program",
    subjects: [
      {
        id: "dpss_l6_general",
        name: "General English",
        targetWeight: 100,
        midtermTargetWeight: 100,
        finalTargetWeight: 100,
        fullModeMidtermWeight: 8,
        fullModeFinalWeight: 62,
        categories: [
          { id: "l6_speaking_quiz", name: "Speaking Quiz", weight: 10, itemCount: 1, itemMaxScores: [100] },
          { id: "l6_campaign", name: "Campaign", weight: 10, itemCount: 1, itemMaxScores: [100] },
          { id: "l6_participation", name: "Participation", weight: 10, itemCount: 1, itemMaxScores: [100] },
          { id: "l6_mt_speaking", name: "Midterm: Speaking", weight: 10, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
          { id: "l6_mt_vocab", name: "Midterm: Vocabulary", weight: 10, midtermWeight: 15, itemCount: 1, itemMaxScores: [100], isMidterm: true },
          { id: "l6_ft_speaking", name: "Final: Speaking", weight: 25, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true },
          { id: "l6_ft_vocab", name: "Final: Vocabulary", weight: 25, finalWeight: 15, itemCount: 1, itemMaxScores: [100], isFinal: true }
        ]
      }
    ]
  }
];

const LEVEL_ORDER = [
  "level 1a",
  "level 1b",
  "level foundation a",
  "level pre 2ai",
  "level pre 2aii",
  "level 2a",
  "level 2b",
  "level 3a",
  "level 3b",
  "level 4a",
  "level 4b",
  "level 5a",
  "level 5b"
];

export function sortLevels(levelsList: Level[]): Level[] {
  return [...levelsList].sort((a, b) => {
    const aName = a.name.toLowerCase().trim();
    const bName = b.name.toLowerCase().trim();
    
    // Find index in our defined order - more robust matching
    const aIdx = LEVEL_ORDER.findIndex(name => {
      const target = name.toLowerCase().trim();
      return aName === target || aName.startsWith(target + " ") || aName === target.replace("level ", "");
    });
    const bIdx = LEVEL_ORDER.findIndex(name => {
      const target = name.toLowerCase().trim();
      return bName === target || bName.startsWith(target + " ") || bName === target.replace("level ", "");
    });
    
    if (aIdx !== -1 && bIdx !== -1) {
      return aIdx - bIdx;
    }
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    
    // Fallback: alphabetical
    return a.name.localeCompare(b.name);
  });
}

import { StudentManager } from "./components/StudentManager";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [levels, setLevels] = useState<Level[]>([]);
  const [classRecords, setClassRecords] = useState<ClassRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  const pendingSaveRef = useRef<{ [recordId: string]: any }>({});

  const updateRecordLocallyAndDebounceSave = (updatedRecord: ClassRecord) => {
    // 1. Update React local state immediately
    setClassRecords((prev) =>
      prev.map((cr) => (cr.id === updatedRecord.id ? updatedRecord : cr))
    );

    // 2. Clear any existing timer for this record ID
    if (pendingSaveRef.current[updatedRecord.id]) {
      clearTimeout(pendingSaveRef.current[updatedRecord.id]);
    }

    // 3. Set a new timer to save to Firestore after 600ms
    pendingSaveRef.current[updatedRecord.id] = setTimeout(async () => {
      if (user) {
        try {
          await saveClassRecord(user.uid, updatedRecord);
        } catch (err) {
          console.error("Failed to save class record:", err);
        }
      }
      delete pendingSaveRef.current[updatedRecord.id];
    }, 600);
  };

  const [currentRecordId, setCurrentRecordId] = useState<string>("");
  const currentRecordIdRef = useRef(currentRecordId);
  useEffect(() => {
    currentRecordIdRef.current = currentRecordId;
  }, [currentRecordId]);
  const [showSettings, setShowSettings] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showViewSettingsMenu, setShowViewSettingsMenu] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeView, setActiveView] = useState<'grades' | 'students' | 'attendance'>('grades');

  const [paperStyle, setPaperStyle] = useState<string>(() => {
    return localStorage.getItem("gradecalc_paper_style") || "white_smooth";
  });
  const [wallpaper, setWallpaper] = useState<string>(() => {
    return localStorage.getItem("gradecalc_wallpaper") || "default_slate";
  });
  const [gridLineLevel, setGridLineLevel] = useState<string>(() => {
    return localStorage.getItem("gradecalc_grid_line_level") || "medium";
  });
  const [pinnedIds, setPinnedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("gradecalc_pinned_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentTab, setCurrentTab] = useState<"grades" | "students" | "dashboard">("grades");

  const [resultMode, setResultMode] = useState<"full" | "midterm" | "final">(
    () => {
      return (
        (localStorage.getItem("gradecalc_result_mode") as
          "full" | "midterm" | "final") || "full"
      );
    },
  );

  const [accessCode, setAccessCode] = useState<string>(() => {
    return localStorage.getItem("gradecalc_access_code") || "";
  });

  const [selectedTeacher, setSelectedTeacher] = useState<string>(() => {
    return localStorage.getItem("gradecalc_selected_teacher") || "all";
  });

  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedTerm, setSelectedTerm] = useState<string>("all");
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [isLevelsLoading, setIsLevelsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [showCreateLevelModal, setShowCreateLevelModal] = useState(false);
  const [levelToRename, setLevelToRename] = useState<Level | null>(null);
  const [newLevelProfileName, setNewLevelProfileName] = useState("");
  const [newLevelColor, setNewLevelColor] = useState("#4f46e5");
  const hasInitializedLevelsRef = useRef(false);
  const hasCheckedSampleSeedingRef = useRef(false);

  const [unlockedClassIds, setUnlockedClassIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("gradecalc_unlocked_class_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toggle persistent lock/unlock for a class on this device
  const handleTogglePersistUnlock = (classId: string) => {
    setUnlockedClassIds((prev) => {
      const isUnlocked = prev.includes(classId);
      const updated = isUnlocked
        ? prev.filter((id) => id !== classId)
        : [...prev, classId];
      localStorage.setItem("gradecalc_unlocked_class_ids", JSON.stringify(updated));
      return updated;
    });
  };

  // Template / Duplication Modal State
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateClassName, setTemplateClassName] = useState("");
  const [templateTermName, setTemplateTermName] = useState("");
  const [templateTeacherName, setTemplateTeacherName] = useState("");
  const [templateLevelId, setTemplateLevelId] = useState("");
  const [templateRosterOption, setTemplateRosterOption] = useState<
    "empty" | "copy_names" | "copy_all"
  >("copy_names");
  const [templateAccessCode, setTemplateAccessCode] = useState("");
  const [templateVerificationCode, setTemplateVerificationCode] = useState("");
  const [templateError, setTemplateError] = useState("");

  const [newClassName, setNewClassName] = useState("");
  const [newTermName, setNewTermName] = useState("Term 1, 2026");
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newLevelId, setNewLevelId] = useState("empty_no_subjects");
  const [newAccessCode, setNewAccessCode] = useState("");
  const [newClassError, setNewClassError] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [copyStudentsFromTemplate, setCopyStudentsFromTemplate] = useState(false);
  const [classCreationSource, setClassCreationSource] = useState<"scratch" | "existing" | "template" | "paste">("scratch");
  const [newPastedContent, setNewPastedContent] = useState("");
  const [selectedTemplateLibraryId, setSelectedTemplateLibraryId] = useState<string>("");
  const [selectedLevelFromLibraryId, setSelectedLevelFromLibraryId] = useState<string>("");
  const [savedTemplates, setSavedTemplates] = useState<{ id: string, name: string, authorName: string, levels: Level[] }[]>(SYSTEM_TEMPLATES);
  const [classSortBy, setClassSortBy] = useState<"name" | "level">("name");

  const [excelDetailMode, setExcelDetailMode] = useState<'subjects' | 'categories' | 'both'>(() => {
    return (localStorage.getItem("gradecalc_excel_detail_mode") as 'subjects' | 'categories' | 'both') || 'both';
  });

  const handleUpdateExcelDetailMode = (mode: 'subjects' | 'categories' | 'both') => {
    setExcelDetailMode(mode);
    localStorage.setItem("gradecalc_excel_detail_mode", mode);
  };

  const handleUpdateResultMode = (mode: "full" | "midterm" | "final") => {
    setResultMode(mode);
    localStorage.setItem("gradecalc_result_mode", mode);
  };

  const handleUpdatePaperStyle = (style: string) => {
    setPaperStyle(style);
    localStorage.setItem("gradecalc_paper_style", style);
  };

  const handleUpdateWallpaper = (wp: string) => {
    setWallpaper(wp);
    localStorage.setItem("gradecalc_wallpaper", wp);
  };

  const handleUpdateGridLineLevel = (level: string) => {
    setGridLineLevel(level);
    localStorage.setItem("gradecalc_grid_line_level", level);
  };

  const handleUpdateAccessCode = (code: string) => {
    setAccessCode(code);
    localStorage.setItem("gradecalc_access_code", code);
  };

  const togglePin = (id: string) => {
    setPinnedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id];
      localStorage.setItem("gradecalc_pinned_ids", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    setIsLevelsLoading(true);
    setInitError(null);

    const unsubLevels = subscribeToLevels(user.uid, (fetchedLevels) => {
      setIsLevelsLoading(false);
      if (fetchedLevels.length === 0 && !hasInitializedLevelsRef.current) {
        hasInitializedLevelsRef.current = true;
        // Initialize default levels for new users
        setLevels(sortLevels(DEFAULT_LEVELS));
        saveLevelsBatch(user.uid, DEFAULT_LEVELS).catch(err => {
          console.error("Failed to seed default levels:", err);
        });
      } else {
        setLevels(sortLevels(fetchedLevels));
      }
    });
    const unsubClasses = subscribeToClasses(user.uid, (fetchedClasses) => {
      setClassRecords(fetchedClasses);
      const activeClasses = fetchedClasses.filter(c => !c.isDeleted);
      if (activeClasses.length > 0) {
        if (!currentRecordIdRef.current || !activeClasses.some(c => c.id === currentRecordIdRef.current)) {
          setCurrentRecordId(activeClasses[0].id);
        }
      } else {
        // Automatically seed default class so they never see "No Classes Found"
        const defaultClassId = Math.random().toString(36).substr(2, 9);
        const defaultClass: ClassRecord = {
          id: defaultClassId,
          termName: "Term 1, 2026",
          className: "Grade 10 - Section A",
          teacherName: "Teacher Name",
          levelId: "pte_foundation_a",
          accessCode: "dps",
          studentCount: 0,
          settings: DEFAULT_SETTINGS,
          createdAt: new Date().toISOString(),
        };
        saveClassRecord(user.uid, defaultClass);
        setCurrentRecordId(defaultClassId);
      }
    });

    return () => {
      unsubLevels();
      unsubClasses();
    };
  }, [user]);

  // Seed sample classes for all major programs if they do not have one
  useEffect(() => {
    if (isLevelsLoading || !user || levels.length === 0 || classRecords.length === 0) {
      return;
    }

    if (hasCheckedSampleSeedingRef.current) {
      return;
    }
    hasCheckedSampleSeedingRef.current = true;

    const generateSampleScoresForLevel = (lvl: Level | undefined): Record<string, number> => {
      const scores: Record<string, number> = {};
      if (!lvl) return scores;

      lvl.subjects.forEach(subj => {
        subj.categories.forEach(cat => {
          const count = cat.itemCount || 1;
          for (let i = 0; i < count; i++) {
            const randomScore = Math.floor(Math.random() * 21) + 78; // 78 to 98
            scores[`${cat.id}_${i}`] = randomScore;
          }
        });
      });

      return scores;
    };

    const seedSamples = async () => {
      const activeClasses = classRecords.filter(c => !c.isDeleted);
      
      const programsToCheck = [
        { 
          key: "Part-time English",
          className: "Grade 10 - Part-Time English (Sample)",
          levelId: "pte_foundation_a",
          defaultLevel: DEFAULT_LEVELS.find(l => l.id === "pte_foundation_a")
        },
        { 
          key: "Full-time English",
          className: "Grade 2A - Full-Time English (Sample)",
          levelId: "fte_2a",
          defaultLevel: DEFAULT_LEVELS.find(l => l.id === "fte_2a")
        },
        { 
          key: "Khmer Program",
          className: "Grade 4 - Khmer Language (Sample)",
          levelId: "khmer_l1",
          defaultLevel: DEFAULT_LEVELS.find(l => l.id === "khmer_l1")
        },
        { 
          key: "Math Program",
          className: "Grade 8 - Mathematics (Sample)",
          levelId: "math_l1",
          defaultLevel: DEFAULT_LEVELS.find(l => l.id === "math_l1")
        },
        { 
          key: "DPSS Program",
          className: "Level 6 - DPSS Program (Sample)",
          levelId: "dpss_l6",
          defaultLevel: DEFAULT_LEVELS.find(l => l.id === "dpss_l6")
        }
      ];

      let didSeed = false;

      for (const prog of programsToCheck) {
        // Check if there is an active class for this program
        const hasClassForProgram = activeClasses.some(c => {
          const l = levels.find(lvl => lvl.id === c.levelId);
          return l && l.program && l.program.toLowerCase() === prog.key.toLowerCase();
        });

        if (!hasClassForProgram) {
          console.log(`[Auto-Seeding] Seeding sample class for program: ${prog.key}`);
          
          // 1. Ensure the Level exists
          let targetLevelId = prog.levelId;
          const hasLevel = levels.some(l => l.id === prog.levelId);
          if (!hasLevel && prog.defaultLevel) {
            await saveLevel(user.uid, prog.defaultLevel);
          }

          // 2. Create the Class Record
          const classId = `sample_${prog.levelId}_${Math.random().toString(36).substr(2, 5)}`;
          const sampleClass: ClassRecord = {
            id: classId,
            termName: "Term 1, 2026",
            className: prog.className,
            teacherName: "Sample Teacher",
            levelId: targetLevelId,
            accessCode: "dps",
            studentCount: 3,
            settings: DEFAULT_SETTINGS,
            createdAt: new Date().toISOString(),
          };

          await saveClassRecord(user.uid, sampleClass);

          // 3. Create 3 sample students with populated grades so the user has actual data to look at!
          const sexChoices: ("Male" | "Female")[] = ["Male", "Female", "Male"];
          const sampleNames = prog.key.includes("Khmer") 
            ? ["Sokha Mean (Khmer Sample)", "Chanthou Kim (Khmer Sample)", "Narith Seng (Khmer Sample)"]
            : prog.key.includes("DPSS")
            ? ["Rathana Long (DPSS Sample)", "Sreyneang Chay (DPSS Sample)", "Borey Chet (DPSS Sample)"]
            : prog.key.includes("Math")
            ? ["Kosal Mao (Math Sample)", "Vannak Meas (Math Sample)", "Sreypich Phun (Math Sample)"]
            : ["John Doe (English Sample)", "Sophia Reed (English Sample)", "Ethan Hunt (English Sample)"];

          const sampleStudents: Student[] = [
            {
              id: `${classId}_student_1`,
              name: sampleNames[0],
              sex: sexChoices[0],
              scores: generateSampleScoresForLevel(prog.defaultLevel || levels.find(l => l.id === targetLevelId)),
              attendance: "100%",
              comment: "Excellent performance and active participation in class."
            },
            {
              id: `${classId}_student_2`,
              name: sampleNames[1],
              sex: sexChoices[1],
              scores: generateSampleScoresForLevel(prog.defaultLevel || levels.find(l => l.id === targetLevelId)),
              attendance: "95%",
              comment: "Great effort. Highly engaged in group work."
            },
            {
              id: `${classId}_student_3`,
              name: sampleNames[2],
              sex: sexChoices[2],
              scores: generateSampleScoresForLevel(prog.defaultLevel || levels.find(l => l.id === targetLevelId)),
              attendance: "90%",
              comment: "Consistent and solid worker. Well done."
            }
          ];

          await saveStudentsBatch(user.uid, classId, sampleStudents);
          didSeed = true;
        }
      }

      if (didSeed) {
        console.log("[Auto-Seeding] Finished seeding sample classes successfully!");
      }
    };

    seedSamples().catch(err => {
      console.error("[Auto-Seeding] Error seeding samples:", err);
    });
  }, [isLevelsLoading, user, levels, classRecords]);

  // Subscribe to students of the current class
  useEffect(() => {
    if (!user || !currentRecordId) {
      setStudents([]);
      return;
    }

    setStudentsLoading(true);
    
    // 1. First, check if the current class in classRecords has embedded students (Migration)
    const activeClass = classRecords.find(c => c.id === currentRecordId);
    if (activeClass && (activeClass as any).students && (activeClass as any).students.length > 0) {
      const embeddedStudents = (activeClass as any).students as Student[];
      // Migrate embedded students to sub-collection
      Promise.all(embeddedStudents.map(s => saveStudent(user.uid, currentRecordId, s))).then(() => {
        // After migration, update the class record to remove the embedded array
        const updated = { ...activeClass };
        delete (updated as any).students;
        updated.studentCount = embeddedStudents.length;
        saveClassRecord(user.uid, updated);
      });
    }

    const unsubscribe = subscribeToStudents(user.uid, currentRecordId, (fetchedStudents) => {
      setStudents(fetchedStudents);
      setStudentsLoading(false);
      
      // Update student count in the class metadata if it differs
      const activeClass = classRecords.find(c => c.id === currentRecordId);
      if (activeClass && activeClass.studentCount !== fetchedStudents.length) {
        saveClassRecord(user.uid, { ...activeClass, studentCount: fetchedStudents.length });
      }
    });

    return () => unsubscribe();
  }, [user, currentRecordId, classRecords.length]);

  useEffect(() => {
    if (!user || levels.length === 0) return;
    const hasSample = levels.some((l) => l.id === "sample_5_subj");
    if (
      !hasSample &&
      !localStorage.getItem("gradecalc_sample_template_added")
    ) {
      const newLevels = sortLevels([...levels, SAMPLE_5_SUBJECTS]);
      setLevels(newLevels);
      saveLevel(user.uid, SAMPLE_5_SUBJECTS);
      localStorage.setItem("gradecalc_sample_template_added", "true");
    }

    // Check if the sample class record exists
    if (
      !classRecords.some((cr) => cr.levelId === "sample_5_subj") &&
      !localStorage.getItem("gradecalc_sample_class_added")
    ) {
      const sampleStudent: Student = {
        id: "student_sample_1",
        name: "Test Student",
        sex: "Male",
        scores: {},
        attendance: "",
        comment: "",
      };
      // Populate scores for the test student
      SAMPLE_5_SUBJECTS.subjects.forEach((subj) => {
        subj.categories.forEach((cat) => {
          sampleStudent.scores[`${cat.id}_0`] = 100;
        });
      });

      const newClassRecord: ClassRecord = {
        id: "cr_sample_test_" + Date.now(),
        className: "Sample Testing Class",
        termName: "Term 1",
        teacherName: "Teacher",
        levelId: "sample_5_subj",
        studentCount: 1,
      };
      setClassRecords((prev) => [...prev, newClassRecord]);
      saveClassRecord(user.uid, newClassRecord);
      saveStudent(user.uid, newClassRecord.id, sampleStudent);
      localStorage.setItem("gradecalc_sample_class_added", "true");
    }
  }, [user, levels, classRecords]);

  const fetchTemplates = async () => {
    if (!user) return;
    if (!isFirebaseConfigured()) {
      setSavedTemplates(SYSTEM_TEMPLATES);
      return;
    }
    try {
      const querySnapshot = await getDocs(collection(db, "templates"));
      const userTemplates: any[] = [];
      querySnapshot.forEach((doc) => {
        userTemplates.push({ id: doc.id, ...doc.data() });
      });
      setSavedTemplates([...SYSTEM_TEMPLATES, ...userTemplates]);
    } catch (e) {
      console.error("Error fetching templates in App.tsx:", e);
      setSavedTemplates(SYSTEM_TEMPLATES);
    }
  };

  const handlePublishTemplate = async () => {
    if (!currentRecord) return;
    
    if (!isFirebaseConfigured()) {
      alert("Firebase is not configured yet. Please use the AI Studio tool to set up Firebase for this app to enable template publishing to the cloud library.");
      return;
    }

    if (!user) {
      alert("Please login first to publish templates to the library.");
      handleLogin();
      return;
    }

    const templateName = prompt("Enter a name for this template (e.g., Program English):", currentRecord.className);
    if (!templateName) return;

    try {
      const level = levels.find(l => l.id === currentRecord.levelId);
      if (!level) {
        alert("Could not find the level profile to save.");
        return;
      }
      
      const newTemplate = {
        name: templateName,
        authorName: currentRecord.teacherName || user.displayName || "Admin",
        authorEmail: user.email,
        levels: [level],
        createdAt: new Date().toISOString(),
        isAdmin: true
      };
      
      await addDoc(collection(db, "templates"), newTemplate);
      alert("Template successfully published to the library!");
      fetchTemplates();
    } catch (e) {
      console.error("Error publishing template:", e);
      alert("Failed to publish template. Error: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  const handleSaveAdminTemplate = async () => {
    if (!currentRecord) return;
    
    if (!isFirebaseConfigured()) {
      alert("Firebase is not configured yet. Set up Firebase to sync templates.");
      return;
    }

    if (!user) {
      alert("Please login first.");
      handleLogin();
      return;
    }

    const templateName = prompt("Enter template name to sync/save:", currentRecord.className);
    if (!templateName) return;

    try {
      const level = levels.find(l => l.id === currentRecord.levelId);
      if (!level) {
        alert("Level not found.");
        return;
      }

      // Check if a template with this name already exists by this user
      const q = query(
        collection(db, "templates"), 
        where("name", "==", templateName),
        where("authorEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          levels: [level],
          lastSyncedAt: new Date().toISOString(),
          isAdmin: true
        });
        alert(`Template "${templateName}" synced and updated successfully!\n\nWhere to find it:\nOpen "Level settings" -> click the "Templates & Sync" tab -> select the "My Saved Library" folder at the bottom to view or apply your template.`);
      } else {
        // Create new
        const newTemplate = {
          name: templateName,
          authorName: currentRecord.teacherName || user.displayName || "Admin",
          authorEmail: user.email,
          levels: [level],
          createdAt: new Date().toISOString(),
          lastSyncedAt: new Date().toISOString(),
          isAdmin: true
        };
        await addDoc(collection(db, "templates"), newTemplate);
        alert(`New Admin Template "${templateName}" saved and synced successfully!\n\nWhere to find it:\nOpen "Level settings" -> click the "Templates & Sync" tab -> select the "My Saved Library" folder at the bottom to view or apply your template.`);
      }
      fetchTemplates();
    } catch (e) {
      console.error("Error syncing admin template:", e);
      alert("Failed to sync template.");
    }
  };

  const handleDownloadFullBackup = async (timeframe: string = "all") => {
    if (!user) return;
    
    const confirmBackup = confirm(`This will gather ${timeframe === 'all' ? 'ALL' : 'the recent'} class records, students, and level settings into one file for safe backup. Proceed?`);
    if (!confirmBackup) return;

    try {
      const backupData: any = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        userId: user.uid,
        userEmail: user.email || "local",
        levels: [],
        classRecords: [],
        students: {} // recordId -> Student[]
      };

      // 1. Fetch Levels
      backupData.levels = levels;

      // 2. Fetch Class Records
      let filteredRecords = classRecords;
      if (timeframe !== 'all') {
        const now = Date.now();
        const limits: Record<string, number> = {
          '1d': 24 * 60 * 60 * 1000,
          '3d': 3 * 24 * 60 * 60 * 1000,
          '1w': 7 * 24 * 60 * 60 * 1000,
          '1m': 30 * 24 * 60 * 60 * 1000,
          '3m': 90 * 24 * 60 * 60 * 1000,
          '6m': 180 * 24 * 60 * 60 * 1000,
        };
        const limit = limits[timeframe] || 0;
        
        filteredRecords = classRecords.filter(r => {
           const time = new Date(r.updatedAt || r.createdAt || Date.now()).getTime();
           return (now - time) <= limit;
        });
      }
      backupData.classRecords = filteredRecords;

      // 3. Fetch Students for each class
      const fetchPromises = filteredRecords.map(async (record) => {
        if (!isFirebaseConfigured()) {
          backupData.students[record.id] = getLocalStudents(user.uid, record.id);
        } else {
          try {
            const q = query(collection(db, "classes", record.id, "students"));
            const snapshot = await getDocs(q);
            backupData.students[record.id] = snapshot.docs.map(doc => doc.data());
          } catch (e) {
            console.warn(`Could not fetch students for class ${record.id}`, e);
            backupData.students[record.id] = [];
          }
        }
      });

      await Promise.all(fetchPromises);

      // 4. Create and trigger download
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `gradecalc_full_backup_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert("Full Backup downloaded successfully! Store this file in a safe place.");
    } catch (err) {
      console.error("Backup failed:", err);
      alert("Failed to create backup. Check console for details.");
    }
  };

  const handleSyncToDrive = async () => {
    if (!user) {
      alert("Please login first to sync data to Drive.");
      return;
    }

    const confirmSync = confirm("This will create or update a 'gradecalc_backup.json' file in your Google Drive with all your current classes and settings. Proceed?");
    if (!confirmSync) return;

    try {
      const backupData = await createBackupData(user, levels, classRecords);
      const fileId = await saveToDrive(`gradecalc_backup_${user.email?.replace(/[@.]/g, '_')}.json`, backupData);
      alert(`Successfully synced to Google Drive! (File ID: ${fileId})`);
    } catch (err) {
      console.error("Google Drive sync failed:", err);
      alert("Failed to sync to Google Drive. " + (err instanceof Error ? err.message : String(err)));
    }
  };
  const handleImportBackup = async (file: File) => {
    if (!user) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (!data.levels || !data.classRecords || !data.students) {
          throw new Error("Invalid backup file format. Missing core data structure.");
        }

        const confirmRestore = confirm(`Import Summary:\n- ${data.classRecords.length} Classes\n- ${data.levels.length} Level Profiles\n\nThis will restore these records to your account. Continue?`);
        if (!confirmRestore) return;

        // 1. Restore Levels
        for (const level of data.levels) {
          await saveLevel(user.uid, level);
        }

        // 2. Restore Classes and Students
        for (const record of data.classRecords) {
          await saveClassRecord(user.uid, record);
          const classStudents = data.students[record.id] || [];
          if (classStudents.length > 0) {
            await saveStudentsBatch(user.uid, record.id, classStudents);
          }
        }

        alert("Data successfully restored! The app will reload now.");
        window.location.reload();
      } catch (err) {
        console.error("Import failed:", err);
        alert("Failed to import backup. Please ensure the file is a valid .json backup from this app.");
      }
    };
    reader.readAsText(file);
  };

  const handleShareClass = () => {
    if (!currentRecord) return;
    // Get the current URL but strip any params
    const baseUrl = window.location.origin + window.location.pathname;
    const lockCode = currentRecord.accessCode || "None";
    const shareText = `Check out this class: ${currentRecord.className}\nURL: ${baseUrl}\nLock Code: ${lockCode}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Share information copied to clipboard!\n\n" + shareText);
      }).catch(err => {
        console.error("Clipboard error:", err);
        alert("Here is the share information:\n\n" + shareText);
      });
    } else {
      alert("Here is the share information (Clipboard access denied):\n\n" + shareText);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTemplates();
    }
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLevels([]);
      setClassRecords([]);
      setCurrentRecordId("");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const filteredRecords = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const code = accessCode.trim().toLowerCase();
    const isAdmin = code === "dps" || code === "dpss";

    const filtered = classRecords
      .filter((cr) => !cr.isDeleted)
      .map((cr) => ({
        ...cr,
        isPinned: pinnedIds.includes(cr.id),
      }))
      .filter((cr) => {
        const lvl = levels.find(l => l.id === cr.levelId);
        
        // Archive Filter
        if (!showArchived && lvl?.isArchived) {
          return false;
        }

        // Teacher Filter
        if (selectedTeacher !== "all") {
          if ((cr.teacherName || "").toLowerCase() !== selectedTeacher.toLowerCase()) {
            return false;
          }
        }

        // Program Filter
        if (selectedProgram !== "all") {
          if ((lvl?.program || "").toLowerCase() !== selectedProgram.toLowerCase()) {
            return false;
          }
        }

        // Year Filter
        if (selectedYear !== "all") {
          if ((lvl?.year || "").toLowerCase() !== selectedYear.toLowerCase()) {
            return false;
          }
        }

        // Term Filter
        if (selectedTerm !== "all") {
          if ((lvl?.term || "").toLowerCase() !== selectedTerm.toLowerCase()) {
            return false;
          }
        }

        // Search Query Filter
        return (
          cr.className.toLowerCase().includes(query) ||
          cr.teacherName.toLowerCase().includes(query) ||
          cr.termName.toLowerCase().includes(query) ||
          (lvl?.name.toLowerCase() || "").includes(query)
        );
      });

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (classSortBy === "level") {
        const nameA = (levels.find((l) => l.id === a.levelId)?.name || "").toLowerCase();
        const nameB = (levels.find((l) => l.id === b.levelId)?.name || "").toLowerCase();
        const comp = nameA.localeCompare(nameB);
        if (comp !== 0) return comp;
      }

      return a.className.localeCompare(b.className);
    });
  }, [classRecords, levels, searchQuery, pinnedIds, accessCode, classSortBy, selectedTeacher, selectedProgram, selectedYear, selectedTerm, showArchived]);

  const activeClasses = useMemo(() => {
    return classRecords.filter((cr) => !cr.isDeleted);
  }, [classRecords]);

  const currentRecord = useMemo(() => {
    return activeClasses.find((cr) => cr.id === currentRecordId) || activeClasses[0];
  }, [activeClasses, currentRecordId]);

  const filteredTemplates = useMemo(() => {
    if (currentRecord?.settings?.hideSystemTemplates) {
      return savedTemplates.filter(t => t.authorName !== 'System');
    }
    return savedTemplates;
  }, [savedTemplates, currentRecord?.settings?.hideSystemTemplates]);
  const currentLevel =
    levels.find((l) => l.id === currentRecord?.levelId) || levels[0];
  const totalWeight = currentLevel ? getLevelTotalWeight(currentLevel) : 0;

  const monitoringAlerts = useMemo(() => {
    if (!currentRecord) return [];
    const alerts: string[] = [];
    const settings = currentRecord.settings || DEFAULT_SETTINGS;

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    // Quiz Monitoring Alert
    const quizDaysThreshold = settings.quizNoScoreDays ?? (settings.quizNoScoreWeeks ? settings.quizNoScoreWeeks * 7 : 0);
    if (quizDaysThreshold > 0) {
      const quizThresholdMs = quizDaysThreshold * ONE_DAY_MS;
      const quizBaseline = currentRecord.lastQuizFilledAt 
        ? new Date(currentRecord.lastQuizFilledAt) 
        : currentRecord.createdAt 
          ? new Date(currentRecord.createdAt) 
          : currentRecord.settings?.attendanceStartDate 
            ? new Date(currentRecord.settings.attendanceStartDate)
            : null;

      if (quizBaseline) {
        const timeElapsed = Date.now() - quizBaseline.getTime();
        if (timeElapsed > quizThresholdMs) {
          const days = Math.floor(timeElapsed / ONE_DAY_MS);
          const thresholdStr = quizDaysThreshold % 7 === 0 
            ? `${quizDaysThreshold / 7} week${quizDaysThreshold / 7 > 1 ? 's' : ''}` 
            : `${quizDaysThreshold} day${quizDaysThreshold > 1 ? 's' : ''}`;
          alerts.push(`No quiz scores have been entered for this class in the last ${days} days (Configured alert threshold: ${thresholdStr}).`);
        }
      }
    }

    // Attendance Monitoring Alert
    const attendanceDaysThreshold = settings.attendanceNoScoreDays ?? (settings.attendanceNoScoreWeeks ? settings.attendanceNoScoreWeeks * 7 : 0);
    if (attendanceDaysThreshold > 0) {
      const attendanceThresholdMs = attendanceDaysThreshold * ONE_DAY_MS;
      const attendanceBaseline = currentRecord.lastAttendanceFilledAt 
        ? new Date(currentRecord.lastAttendanceFilledAt) 
        : currentRecord.createdAt 
          ? new Date(currentRecord.createdAt) 
          : currentRecord.settings?.attendanceStartDate 
            ? new Date(currentRecord.settings.attendanceStartDate)
            : null;

      if (attendanceBaseline) {
        const timeElapsed = Date.now() - attendanceBaseline.getTime();
        if (timeElapsed > attendanceThresholdMs) {
          const days = Math.floor(timeElapsed / ONE_DAY_MS);
          const thresholdStr = attendanceDaysThreshold % 7 === 0 
            ? `${attendanceDaysThreshold / 7} week${attendanceDaysThreshold / 7 > 1 ? 's' : ''}` 
            : `${attendanceDaysThreshold} day${attendanceDaysThreshold > 1 ? 's' : ''}`;
          alerts.push(`Daily attendance has not been updated for this class in the last ${days} days (Configured alert threshold: ${thresholdStr}).`);
        }
      }
    }

    return alerts;
  }, [currentRecord]);

  // Check if current class is unlocked
  const hasAccessToCurrent = useMemo(() => {
    if (!currentRecord?.accessCode) return true; // no access code required
    if (unlockedClassIds.includes(currentRecord.id)) return true; // unlocked on this device
    
    const code = accessCode.trim().toLowerCase();
    if (code === "dps" || code === "dpss") return true; // admin code
    
    if (currentRecord.accessCode.toLowerCase() === code) return true; // teacher code matches class code
    
    return false;
  }, [currentRecord, unlockedClassIds, accessCode]);

  const handleUpdateSettings = (newSettings: TeacherSettings) => {
    if (!currentRecord || !user) return;
    const updated = { ...currentRecord, settings: newSettings };
    updateRecordLocallyAndDebounceSave(updated);
  };

  const handleUpdateLevel = (updatedLevel: Level) => {
    if (!user) return;
    saveLevel(user.uid, updatedLevel);
  };

  const handleReplaceLevels = (newLevels: Level[]) => {
    if (!user) return;
    
    // Find levels that were in current list but are NOT in the new list, and delete them
    const deletedLevels = levels.filter((oldL) => !newLevels.some((newL) => newL.id === oldL.id));
    deletedLevels.forEach((l) => {
      deleteLevel(user.uid, l.id);
    });

    // Save/update the remaining ones
    newLevels.forEach((l) => saveLevel(user.uid, l));

    // If the currently selected level was deleted, switch to the first remaining one
    if (currentRecord && deletedLevels.some((dl) => dl.id === currentRecord.levelId)) {
      if (newLevels.length > 0) {
        handleUpdateCurrentRecord("levelId", newLevels[0].id);
      }
    }
  };

  const handleUpdateCurrentRecord = (field: keyof ClassRecord, value: any) => {
    if (!currentRecord || !user) return;
    const updated = { ...currentRecord, [field]: value };
    updateRecordLocallyAndDebounceSave(updated);
  };

  // Migration logic for users who were using the "default_teacher" mock
  useEffect(() => {
    if (!user || user.uid === 'default_teacher') return;

    const performMigration = async () => {
      const hasMigrated = localStorage.getItem(`gradecalc_migrated_${user.uid}`);
      if (hasMigrated) return;

      const localLevels = getLocalLevels('default_teacher');
      const localClasses = getLocalClasses('default_teacher');

      if (localLevels.length > 0 || localClasses.length > 0) {
        console.log(`[Migration] Migrating ${localLevels.length} levels and ${localClasses.length} classes for user ${user.uid}`);
        
        try {
          if (localLevels.length > 0) {
            await saveLevelsBatch(user.uid, localLevels);
          }
          
          if (localClasses.length > 0) {
            for (const cls of localClasses) {
              await saveClassRecord(user.uid, cls);
              const classStudents = getLocalStudents('default_teacher', cls.id);
              if (classStudents.length > 0) {
                await saveStudentsBatch(user.uid, cls.id, classStudents);
              }
            }
          }
          
          localStorage.setItem(`gradecalc_migrated_${user.uid}`, 'true');
          console.log("[Migration] Migration completed successfully.");
        } catch (err) {
          console.error("[Migration] Error during migration:", err);
        }
      } else {
        localStorage.setItem(`gradecalc_migrated_${user.uid}`, 'true');
      }
    };

    performMigration();
  }, [user]);

  const handleCreateNewRecord = () => {
    if (!user) return;
    setNewClassName("");
    setNewTermName("Term 1, 2026");
    setNewTeacherName(user.displayName || "Teacher Name");
    setNewLevelId(levels[0]?.id || "");
    setNewAccessCode(accessCode || "");
    setNewClassError("");
    setSelectedTemplateId("");
    setCopyStudentsFromTemplate(false);
    setClassCreationSource("scratch");
    setSelectedTemplateLibraryId("");
    fetchTemplates();
    setShowClassModal(true);
  };

  const [isCreatingClass, setIsCreatingClass] = useState(false);

  const handleConfirmCreateClass = async () => {
    if (!user || isCreatingClass) return;
    if (!newClassName.trim()) {
      setNewClassError("Class Name is required.");
      return;
    }
    if (!newAccessCode.trim()) {
      setNewClassError("You must create an access code first to access this class.");
      return;
    }

    setIsCreatingClass(true);
    setNewClassError("");

    try {
      const cleanAccessCode = newAccessCode.trim().toLowerCase();
      const newClassId = Math.random().toString(36).substr(2, 9);
      
      let resolvedLevelId = "";

      if (classCreationSource === "scratch") {
        if (newLevelId === "empty_no_subjects" || !newLevelId) {
          const newEmptyLevelId = "level_empty_" + Math.random().toString(36).substr(2, 9);
          const newEmptyLevel: Level = {
            id: newEmptyLevelId,
            name: newClassName.trim() + " Profile",
            subjects: [], // COMPLETELY EMPTY! No table, no columns!
            gradingScale: DEFAULT_GRADING_SCALE,
            statusScale: [
              { grade: 'Pass', minScore: 70 },
              { grade: 'Repeat', minScore: 60 },
              { grade: 'Fail +', minScore: 0 },
            ],
            attendanceWeight: 0,
          };
          saveLevel(user.uid, newEmptyLevel).catch(err => console.error("Failed to save new level in background:", err));
          resolvedLevelId = newEmptyLevelId;
        } else {
          // They chose an existing level. Make a clean copy of it so changes don't leak across classes
          const chosenLvl = levels.find(l => l.id === newLevelId);
          if (chosenLvl) {
            const newCopiedLevelId = "level_copy_" + Math.random().toString(36).substr(2, 9);
            const copiedLevel: Level = {
              ...chosenLvl,
              id: newCopiedLevelId,
              name: newClassName.trim() + " Profile"
            };
            saveLevel(user.uid, copiedLevel).catch(err => console.error("Failed to copy chosen level in background:", err));
            resolvedLevelId = newCopiedLevelId;
          } else {
            resolvedLevelId = newLevelId;
          }
        }
      } else if (classCreationSource === "template") {
        if (!selectedTemplateLibraryId) {
          throw new Error("Please select a template from the library.");
        }
        
        const chosenTemplate = savedTemplates.find(t => t.id === selectedTemplateLibraryId);
        if (chosenTemplate && chosenTemplate.levels && chosenTemplate.levels.length > 0) {
          const newCopiedLevelId = "level_" + Math.random().toString(36).substr(2, 9);
          const sourceLevel = chosenTemplate.levels[0];
          
          const copiedLevel: Level = {
            ...sourceLevel,
            id: newCopiedLevelId,
            name: newClassName.trim() + " Level Profile"
          };
          
          saveLevel(user.uid, copiedLevel).catch(err => console.error("Failed to save template level in background:", err));
          resolvedLevelId = newCopiedLevelId;
        } else {
          throw new Error("The selected template contains no levels or could not be found.");
        }
      } else if (classCreationSource === "paste") {
        if (cleanAccessCode !== "dp-s-s") {
          throw new Error("You must use the access code 'DP-S-S' to use the Paste feature.");
        }
        const parsedSubjects = parsePastedClassProfile(newPastedContent);
        const newPastedLevelId = "level_" + Math.random().toString(36).substr(2, 9);
        const copiedLevel: Level = {
          id: newPastedLevelId,
          name: newClassName.trim() + " Profile",
          subjects: parsedSubjects,
          gradingScale: levels[0]?.gradingScale || [],
          statusScale: levels[0]?.statusScale || [],
          attendanceWeight: 0, // Make attendance standalone without skewing grades
        };
        saveLevel(user.uid, copiedLevel).catch(err => console.error("Failed to save pasted level in background:", err));
        resolvedLevelId = newPastedLevelId;
      } else if (classCreationSource === "existing") {
        if (!selectedTemplateId) {
          throw new Error("Please select an existing class to load from.");
        }
        const templateRecord = classRecords.find((r) => r.id === selectedTemplateId);
        if (templateRecord) {
          resolvedLevelId = templateRecord.levelId;
        }
      }

      const newRecord: ClassRecord = {
        id: newClassId,
        termName: newTermName.trim() || "Term 1, 2026",
        className: newClassName.trim(),
        teacherName: newTeacherName.trim() || "Teacher Name",
        levelId: resolvedLevelId,
        accessCode: cleanAccessCode,
        studentCount: 0,
        settings: DEFAULT_SETTINGS,
        createdAt: new Date().toISOString(),
      };

      if (classCreationSource === "existing" && selectedTemplateId && copyStudentsFromTemplate) {
        const templateRecord = classRecords.find((r) => r.id === selectedTemplateId);
        if (templateRecord) {
          try {
            let templateStudents: Student[] = [];
            if (!isFirebaseConfigured()) {
              templateStudents = getLocalStudents(user.uid, selectedTemplateId);
            } else {
              const snapshot = await getDocs(collection(db, 'classes', selectedTemplateId, 'students'));
              templateStudents = snapshot.docs.map(doc => doc.data() as Student);
            }
            const newStudents: Student[] = templateStudents.map(s => ({
              id: Math.random().toString(36).substr(2, 9),
              name: s.name,
              sex: s.sex || "Male",
              scores: {},
              attendance: "",
              comment: "",
            }));
            
            if (newStudents.length > 0) {
              saveStudentsBatch(user.uid, newClassId, newStudents).catch(err => console.error("Failed to save copied students in background:", err));
            }
            newRecord.studentCount = templateStudents.length;
          } catch (err) {
            console.error("Failed to copy student roster:", err);
          }
        }
      }

      saveClassRecord(user.uid, newRecord).catch(err => console.error("Failed to save new class record in background:", err));
      setCurrentRecordId(newRecord.id);
      setAccessCode(newAccessCode.trim());
      localStorage.setItem("gradecalc_access_code", newAccessCode.trim());
      setShowClassModal(false);
    } catch (err: any) {
      console.error("Failed to create class profile:", err);
      setNewClassError(err.message || "Failed to save the new class profile. Please try again.");
    } finally {
      setIsCreatingClass(false);
    }
  };

  const handleOpenTemplateModal = () => {
    if (!currentRecord) return;
    setTemplateClassName(currentRecord.className + " (Copy)");
    setTemplateTermName(currentRecord.termName);
    setTemplateTeacherName(currentRecord.teacherName);
    setTemplateLevelId(currentRecord.levelId);
    setTemplateAccessCode(currentRecord.accessCode || "");
    const activeCode = (accessCode || "").trim().toUpperCase();
    if (["DPS", "DPSS", "BPS", "BPSS"].includes(activeCode)) {
      setTemplateVerificationCode(activeCode);
    } else {
      setTemplateVerificationCode("");
    }
    setTemplateRosterOption("copy_names");
    setTemplateError("");
    setShowTemplateModal(true);
  };

  const handleCreateFromTemplate = () => {
    if (!user || !currentRecord) return;
    if (!templateClassName.trim()) {
      setTemplateError("Class Name is required.");
      return;
    }
    if (!templateAccessCode.trim()) {
      setTemplateError("Access lock code is required to secure this new class.");
      return;
    }
    const vCode = templateVerificationCode.trim().toLowerCase();
    if (vCode !== "dpss" && vCode !== "dps" && vCode !== "bps" && vCode !== "bpss") {
      setTemplateError("Invalid verification code. You must type 'DPSS' or 'BPS' to prevent messy templates.");
      return;
    }

    const newClassId = Math.random().toString(36).substr(2, 9);
    const newRecord: ClassRecord = {
      id: newClassId,
      termName: templateTermName.trim() || "New Term",
      className: templateClassName.trim() || "New Class",
      teacherName: templateTeacherName.trim() || "Teacher Name",
      levelId: templateLevelId || currentLevel.id,
      accessCode: templateAccessCode.trim().toLowerCase(),
      studentCount: 0,
      settings: currentRecord.settings ? { ...currentRecord.settings } : DEFAULT_SETTINGS,
      createdAt: new Date().toISOString(),
    };

    if (templateRosterOption === "copy_all" || templateRosterOption === "copy_names") {
      students.forEach((s) => {
        const ns: Student = {
          id: Math.random().toString(36).substr(2, 9),
          name: s.name,
          sex: s.sex || "Male",
          scores: templateRosterOption === "copy_all" ? { ...s.scores } : {},
          attendance: templateRosterOption === "copy_all" ? s.attendance : "",
          comment: templateRosterOption === "copy_all" ? s.comment : "",
          attendanceRecords: templateRosterOption === "copy_all" ? { ...(s.attendanceRecords || {}) } : {},
        };
        saveStudent(user.uid, newClassId, ns);
      });
      newRecord.studentCount = students.length;
    }

    saveClassRecord(user.uid, newRecord);
    setCurrentRecordId(newRecord.id);
    setAccessCode(templateAccessCode.trim());
    localStorage.setItem("gradecalc_access_code", templateAccessCode.trim());
    setShowTemplateModal(false);
  };

  const handleCreateLevel = () => {
    if (!user) return;
    setNewLevelProfileName("Level One Foundation One");
    setLevelToRename(null);
    setShowCreateLevelModal(true);
  };

  const handleConfirmCreateLevel = () => {
    if (!user || !newLevelProfileName.trim()) return;
    const finalName = newLevelProfileName.trim();
    
    if (levelToRename) {
      const updated = { ...levelToRename, name: finalName, color: newLevelColor };
      saveLevel(user.uid, updated);
      setLevelToRename(null);
    } else {
      const newLevel: Level = {
        id: Math.random().toString(36).substr(2, 9),
        name: finalName,
        color: newLevelColor,
        subjects: [],
        gradingScale: DEFAULT_GRADING_SCALE,
      };
      saveLevel(user.uid, newLevel);
      handleUpdateCurrentRecord("levelId", newLevel.id);
    }
    setShowCreateLevelModal(false);
    setNewLevelProfileName("");
    setNewLevelColor("#4f46e5");
  };

  const handleRenameLevel = () => {
    if (!user || !currentLevel) return;
    setNewLevelProfileName(currentLevel.name);
    setNewLevelColor(currentLevel.color || "#4f46e5");
    setLevelToRename(currentLevel);
    setShowCreateLevelModal(true);
  };

  const handleDeleteLevel = () => {
    if (!user || levels.length <= 1) return;
    if (confirm(`Are you sure you want to delete ${currentLevel.name}?`)) {
      deleteLevel(user.uid, currentLevel.id);
      const remaining = levels.filter((l) => l.id !== currentLevel.id);
      if (remaining.length > 0) {
        handleUpdateCurrentRecord("levelId", remaining[0].id);
      }
    }
  };

  const handleDeleteCurrentRecord = () => {
    if (!currentRecord || !user) return;
    const updated: ClassRecord = {
      ...currentRecord,
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    };
    saveClassRecord(user.uid, updated);
  };

  const handleDeleteAllClasses = async () => {
    if (!user || !confirm("CRITICAL: You are about to delete ALL classes in your database (including system classes). This will also delete all students and grades. Are you absolutely sure?")) return;
    
    try {
      // Delete ALL classes in the record list, regardless of deleted status
      for (const cr of classRecords) {
        await deleteClassRecordRef(user.uid, cr.id);
      }
      alert("All classes have been deleted successfully.");
      setCurrentRecordId("");
    } catch (error) {
      console.error("Error deleting all classes:", error);
      alert("Failed to delete all classes. Please check your connection.");
    }
  };

  const handleRestoreClass = (classId: string) => {
    if (!user) return;
    const record = classRecords.find((r) => r.id === classId);
    if (record) {
      const updated: ClassRecord = {
        ...record,
        isDeleted: false,
        deletedAt: undefined,
      };
      saveClassRecord(user.uid, updated);
      setCurrentRecordId(classId);
    }
  };

  const handlePermanentDeleteClass = (classId: string) => {
    if (!user) return;
    const record = classRecords.find((r) => r.id === classId);
    if (record) {
      if (confirm(`CRITICAL WARNING: Are you sure you want to PERMANENTLY delete the class "${record.className}"? This will delete all students and score histories forever. This action cannot be undone.`)) {
        deleteClassRecordRef(user.uid, classId);
        // Switch current record if we deleted it
        if (currentRecordId === classId) {
          const remaining = classRecords.filter((cr) => cr.id !== classId && !cr.isDeleted);
          if (remaining.length > 0) {
            setCurrentRecordId(remaining[0].id);
          }
        }
      }
    }
  };

  const handleAddStudent = () => {
    if (!currentRecord || !user) return;
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Student",
      sex: "Male",
      scores: {},
      attendance: "",
      comment: "",
    };
    saveStudent(user.uid, currentRecord.id, newStudent);
  };

  const isQuizCategory = (catId: string) => {
    if (!currentLevel) return false;
    for (const sub of currentLevel.subjects) {
      for (const cat of sub.categories) {
        if (cat.id === catId) {
          return cat.name.toLowerCase().includes("quiz");
        }
      }
    }
    return false;
  };

  const handleBulkUpdateStudentScores = (
    updates: { id: string; categoryId: string; itemIndex: number; value: any }[]
  ) => {
    if (!currentRecord || !user || updates.length === 0) return;
    let hasQuizUpdate = false;
    updates.forEach(u => {
      const student = students.find(s => s.id === u.id);
      if (student) {
        const newScores = { ...student.scores };
        const scoreKey = `${u.categoryId}_${u.itemIndex}`;
        if (u.value === undefined || u.value === null || u.value === "") {
          delete newScores[scoreKey];
        } else {
          newScores[scoreKey] = u.value;
        }
        saveStudent(user.uid, currentRecord.id, { ...student, scores: newScores });
        if (isQuizCategory(u.categoryId)) {
          hasQuizUpdate = true;
        }
      }
    });
    if (hasQuizUpdate) {
      handleUpdateCurrentRecord("lastQuizFilledAt", new Date().toISOString());
    }
  };

  const handleUpdateStudentScore = (
    id: string,
    categoryId: string,
    itemIndex: number,
    value: any,
  ) => {
    if (!currentRecord || !user) return;
    const student = students.find(s => s.id === id);
    if (student) {
      const newScores = { ...student.scores };
      let scoreKey = `${categoryId}_${itemIndex}`;

      // Support midterm/final mode suffixes
      if (!categoryId.startsWith('exam_')) {
        if (resultMode === 'midterm') {
          scoreKey = `${categoryId}_${itemIndex}_midterm`;
        } else if (resultMode === 'final') {
          scoreKey = `${categoryId}_${itemIndex}_final`;
        } else if (resultMode === 'full') {
          const cat = currentLevel?.subjects
            .flatMap(s => s.categories)
            .find(c => c.id === categoryId);
          if (cat?.isMidterm) {
            scoreKey = `${categoryId}_${itemIndex}_midterm`;
          } else if (cat?.isFinal) {
            scoreKey = `${categoryId}_${itemIndex}_final`;
          }
        }
      }

      if (value === undefined || value === null || value === "") {
        delete newScores[scoreKey];
      } else {
        newScores[scoreKey] = value;
      }
      saveStudent(user.uid, currentRecord.id, { ...student, scores: newScores });
      if (isQuizCategory(categoryId)) {
        handleUpdateCurrentRecord("lastQuizFilledAt", new Date().toISOString());
      }
    }
  };

  const handleUpdateStudentField = (id: string, field: string, value: any) => {
    if (!currentRecord || !user) return;
    const student = students.find(s => s.id === id);
    if (student) {
      const updatedStudent = { ...student };
      if (value === undefined || value === null || value === "") {
        // @ts-ignore
        delete updatedStudent[field];
      } else {
        // @ts-ignore
        updatedStudent[field] = value;
      }
      saveStudent(user.uid, currentRecord.id, updatedStudent);
      if (field === 'attendance') {
        handleUpdateCurrentRecord("lastAttendanceFilledAt", new Date().toISOString());
      }
    }
  };

  const handleUpdateAttendanceRecord = (id: string, dateKey: string, status: AttendanceStatus) => {
    if (!currentRecord || !user) return;
    const student = students.find(s => s.id === id);
    if (student) {
      const newRecords = { ...(student.attendanceRecords || {}) };
      if (status === 'None') {
        delete newRecords[dateKey];
      } else {
        newRecords[dateKey] = status;
      }
      saveStudent(user.uid, currentRecord.id, { ...student, attendanceRecords: newRecords });
      handleUpdateCurrentRecord("lastAttendanceFilledAt", new Date().toISOString());
    }
  };

  const handleMarkAllPresent = (dateKey: string) => {
    if (!currentRecord || !user || students.length === 0) return;
    
    const activeStudents = students.filter(s => !s.isHidden);
    const updatedStudents = activeStudents.map(student => {
      const newRecords = { ...(student.attendanceRecords || {}) };
      newRecords[dateKey] = 'Present';
      return { ...student, attendanceRecords: newRecords };
    });
    
    saveStudentsBatch(user.uid, currentRecord.id, updatedStudents);
    handleUpdateCurrentRecord("lastAttendanceFilledAt", new Date().toISOString());
  };

  const handleDeleteStudent = (id: string) => {
    if (!currentRecord || !user) return;
    deleteStudent(user.uid, currentRecord.id, id);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "T";
  const getTeacherColor = (name: string) => {
    const colors = [
      "bg-red-100 text-red-700 border-red-200/50",
      "bg-blue-100 text-blue-700 border-blue-200/50",
      "bg-green-100 text-green-700 border-green-200/50",
      "bg-yellow-100 text-yellow-700 border-yellow-200/50",
      "bg-purple-100 text-purple-700 border-purple-200/50",
      "bg-pink-100 text-pink-700 border-pink-200/50",
      "bg-indigo-100 text-indigo-700 border-indigo-200/50",
      "bg-teal-100 text-teal-700 border-teal-200/50",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const getTeacherColorClasses = (name: string) => {
    const colors = [
      {
        text: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-950/40",
        border: "border-indigo-100 dark:border-indigo-900/50",
        hoverBg: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
        pill: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800",
        solidBg: "bg-indigo-600 text-white",
        glow: "shadow-indigo-500/10"
      },
      {
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        border: "border-emerald-100 dark:border-emerald-900/50",
        hoverBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
        pill: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800",
        solidBg: "bg-emerald-600 text-white",
        glow: "shadow-emerald-500/10"
      },
      {
        text: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-50 dark:bg-rose-950/40",
        border: "border-rose-100 dark:border-rose-900/50",
        hoverBg: "hover:bg-rose-100 dark:hover:bg-rose-900/30",
        pill: "bg-rose-100 text-rose-800 dark:bg-rose-900/80 dark:text-rose-200 border border-rose-200 dark:border-rose-800",
        solidBg: "bg-rose-600 text-white",
        glow: "shadow-rose-500/10"
      },
      {
        text: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/40",
        border: "border-amber-100 dark:border-amber-900/50",
        hoverBg: "hover:bg-amber-100 dark:hover:bg-amber-900/30",
        pill: "bg-amber-100 text-amber-800 dark:bg-amber-900/80 dark:text-amber-200 border border-amber-200 dark:border-amber-800",
        solidBg: "bg-amber-600 text-white",
        glow: "shadow-amber-500/10"
      },
      {
        text: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950/40",
        border: "border-purple-100 dark:border-purple-900/50",
        hoverBg: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
        pill: "bg-purple-100 text-purple-800 dark:bg-purple-900/80 dark:text-purple-200 border border-purple-200 dark:border-purple-800",
        solidBg: "bg-purple-600 text-white",
        glow: "shadow-purple-500/10"
      },
      {
        text: "text-cyan-600 dark:text-cyan-400",
        bg: "bg-cyan-50 dark:bg-cyan-950/40",
        border: "border-cyan-100 dark:border-cyan-900/50",
        hoverBg: "hover:bg-cyan-100 dark:hover:bg-cyan-900/30",
        pill: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/80 dark:text-cyan-200 border border-cyan-200 dark:border-cyan-800",
        solidBg: "bg-cyan-600 text-white",
        glow: "shadow-cyan-500/10"
      },
      {
        text: "text-teal-600 dark:text-teal-400",
        bg: "bg-teal-50 dark:bg-teal-950/40",
        border: "border-teal-100 dark:border-teal-900/50",
        hoverBg: "hover:bg-teal-100 dark:hover:bg-teal-900/30",
        pill: "bg-teal-100 text-teal-800 dark:bg-teal-900/80 dark:text-teal-200 border border-teal-200 dark:border-teal-800",
        solidBg: "bg-teal-600 text-white",
        glow: "shadow-teal-500/10"
      },
      {
        text: "text-fuchsia-600 dark:text-fuchsia-400",
        bg: "bg-fuchsia-50 dark:bg-fuchsia-950/40",
        border: "border-fuchsia-100 dark:border-fuchsia-900/50",
        hoverBg: "hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/30",
        pill: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/80 dark:text-fuchsia-200 border border-fuchsia-200 dark:border-fuchsia-800",
        solidBg: "bg-fuchsia-600 text-white",
        glow: "shadow-fuchsia-500/10"
      },
      {
        text: "text-sky-600 dark:text-sky-400",
        bg: "bg-sky-50 dark:bg-sky-950/40",
        border: "border-sky-100 dark:border-sky-900/50",
        hoverBg: "hover:bg-sky-100 dark:hover:bg-sky-900/30",
        pill: "bg-sky-100 text-sky-800 dark:bg-sky-900/80 dark:text-sky-200 border border-sky-200 dark:border-sky-800",
        solidBg: "bg-sky-600 text-white",
        glow: "shadow-sky-500/10"
      },
      {
        text: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-950/40",
        border: "border-orange-100 dark:border-orange-900/50",
        hoverBg: "hover:bg-orange-100 dark:hover:bg-orange-900/30",
        pill: "bg-orange-100 text-orange-800 dark:bg-orange-900/80 dark:text-orange-200 border border-orange-200 dark:border-orange-800",
        solidBg: "bg-orange-600 text-white",
        glow: "shadow-orange-500/10"
      }
    ];
    const clean = (name || "").trim();
    if (!clean) return {
      text: "text-slate-700",
      bg: "bg-slate-50",
      border: "border-slate-200",
      hoverBg: "hover:bg-slate-100",
      pill: "bg-slate-100 text-slate-800 border border-slate-200",
      solidBg: "bg-slate-600 text-white",
      glow: "shadow-slate-500/10"
    };
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const uniqueTeachers = useMemo(() => {
    const teachersSet = new Set<string>();
    classRecords.forEach((cr) => {
      if (cr.teacherName && cr.teacherName.trim()) {
        teachersSet.add(cr.teacherName.trim());
      }
    });
    return Array.from(teachersSet).sort();
  }, [classRecords]);

  const uniquePrograms = useMemo(() => {
    const programsSet = new Set<string>();
    levels.forEach((l) => {
      if (l.program && l.program.trim()) {
        programsSet.add(l.program.trim());
      }
    });
    return Array.from(programsSet).sort();
  }, [levels]);

  const uniqueYears = useMemo(() => {
    const yearsSet = new Set<string>();
    levels.forEach((l) => {
      if (l.year && l.year.trim()) {
        yearsSet.add(l.year.trim());
      }
    });
    return Array.from(yearsSet).sort();
  }, [levels]);

  const uniqueTerms = useMemo(() => {
    const termsSet = new Set<string>();
    levels.forEach((l) => {
      if (l.term && l.term.trim()) {
        termsSet.add(l.term.trim());
      }
    });
    return Array.from(termsSet).sort();
  }, [levels]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-slate-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 max-w-sm w-full">
          <div className="bg-blue-600 p-3 rounded-xl inline-flex mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">
            Teacher Grade Calculator
          </h2>
          <p className="text-slate-500 mb-6">
            Sign in to manage your classes and grading structures with real-time sync.
          </p>
          <button
            onClick={handleLogin}
            className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (isLevelsLoading || (levels.length === 0 && !initError)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-center mb-4">
            <Database className="w-10 h-10 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Initializing Data
          </h2>
          <p className="text-slate-500 mb-4 animate-pulse">
            Connecting to Firestore and setting up your default levels...
          </p>
          <div className="w-48 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-red-200 max-w-md">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Connection Error
          </h2>
          <p className="text-red-500 mb-6 text-sm">
            {initError}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!currentRecord) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 flex-col">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200 max-w-md w-full">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            No Classes Found
          </h2>
          <p className="text-slate-500 mb-6">
            You don't have any class records yet. Create one to get started.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCreateNewRecord}
              className="px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create New Class
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWp = WALLPAPERS.find((w) => w.id === wallpaper) || WALLPAPERS[0];
  const currentPaper =
    PAPER_STYLES.find((p) => p.id === paperStyle) || PAPER_STYLES[0];

  return (
    <div
      className={`min-h-screen ${currentWp.bgClass} text-slate-900 font-sans flex flex-col transition-colors duration-200`}
    >
      {/* Header */}
      <header 
        className="border-b border-slate-200 px-4 sm:px-6 py-4 relative z-30 shadow-sm transition-colors duration-500"
        style={{ backgroundColor: currentRecord?.settings?.headerBgColor || '#ffffff' }}
      >
        <div className="max-w-[1400px] mx-auto space-y-4">
          {/* Top Brand & Status Line */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg shrink-0 bg-orange-500 text-white shadow-sm">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h1 className={`text-lg font-black tracking-tight flex items-center gap-2 ${currentRecord?.settings?.headerBgColor && currentRecord.settings.headerBgColor !== 'transparent' && currentRecord.settings.headerBgColor !== '#ffffff' ? 'text-white' : 'text-slate-900'}`}>
                  DEVELOPING POTENTIAL FOR SUCCESS
                  <span className="text-[10px] bg-orange-100 text-orange-800 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {resultMode === 'full' ? 'Full Term' : resultMode === 'midterm' ? 'Mid-Term' : 'Final Exam'}
                  </span>
                </h1>
                <div className={`text-xs font-medium flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 ${currentRecord?.settings?.headerBgColor && currentRecord.settings.headerBgColor !== 'transparent' && currentRecord.settings.headerBgColor !== '#ffffff' ? 'text-white' : 'text-slate-700'}`}>
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-2.5 py-1 rounded-lg border border-emerald-600 shadow-sm">
                    <UserIcon className="w-3.5 h-3.5 opacity-90" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Teacher:</span>
                    <span className="font-black text-xs uppercase tracking-wide">{currentRecord?.teacherName || "Teacher"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-500 text-white px-2.5 py-1 rounded-lg border border-blue-600 shadow-sm">
                    <BookOpen className="w-3.5 h-3.5 opacity-90" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Class:</span>
                    <span className="font-black text-xs uppercase tracking-wide">{currentRecord?.className || "Class Name"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-purple-500 text-white px-2.5 py-1 rounded-lg border border-purple-600 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 opacity-90" />
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Term:</span>
                    <span className="font-black text-xs uppercase tracking-wide">{currentRecord?.termName || "Term Name"}</span>
                  </div>
                  {totalWeight !== 100 && totalWeight > 0 && (
                    <div className="flex items-center gap-1.5 bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-300 shadow-sm ml-auto">
                      <AlertTriangle className="w-3.5 h-3.5 opacity-90 text-amber-600" />
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Warning:</span>
                      <span className="font-black text-xs uppercase tracking-wide">Level total weight is {totalWeight}%</span>
                    </div>
                  )}
                  {totalWeight === 0 && (
                    <div className="flex items-center gap-1.5 bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-300 shadow-sm ml-auto">
                      <Info className="w-3.5 h-3.5 opacity-90 text-blue-600" />
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Info:</span>
                      <span className="font-black text-xs uppercase tracking-wide">Configure subjects in Level Config</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Code / Lock and Search Zone */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Access Code Box */}
              <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200/80 shrink-0">
                <div className="flex items-center px-2 text-slate-500" title="Enter Teacher Code or DPS for Admin override">
                  <Lock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">My Code:</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Davina"
                  value={accessCode}
                  onChange={(e) => handleUpdateAccessCode(e.target.value)}
                  className="bg-transparent border-0 focus:ring-0 text-xs w-20 outline-none font-bold text-slate-800 uppercase px-1"
                />
                {["DPS", "DPSS", "BPS", "BPSS"].includes(accessCode.toUpperCase().trim()) ? (
                  <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded ml-1 animate-pulse">
                    ADMIN
                  </span>
                ) : (
                  currentRecord && (
                    <button
                      onClick={() => handleTogglePersistUnlock(currentRecord.id)}
                      className="ml-1 p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
                      title={unlockedClassIds.includes(currentRecord.id) ? "Lock class on this device" : "Unlock class on this device (Enter correct code first)"}
                    >
                      {unlockedClassIds.includes(currentRecord.id) ? (
                         <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                         <Lock className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )
                )}
              </div>

              {/* Class Search input */}
              <div className="flex items-center bg-slate-50 rounded-lg px-2 py-1 border border-slate-200/80">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
                <input
                  type="text"
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 focus:ring-0 text-xs w-28 outline-none font-medium text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Sub-toolbar: Active Class Selector & Action Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left side: Class Select + Pin + New */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Class:</span>
              
              <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm mr-1">
                <select
                  value={selectedTeacher}
                  onChange={(e) => {
                    setSelectedTeacher(e.target.value);
                    localStorage.setItem("gradecalc_selected_teacher", e.target.value);
                  }}
                  className="px-2 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border-r border-slate-200 focus:ring-0 cursor-pointer outline-none min-w-[100px] max-w-[140px] truncate"
                  title="Filter by teacher"
                >
                  <option value="all">All Teachers</option>
                  {uniqueTeachers.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="px-2 py-1.5 text-xs font-bold text-slate-700 bg-white border-r border-slate-200 focus:ring-0 cursor-pointer outline-none min-w-[100px] max-w-[140px] truncate"
                  title="Filter by program"
                >
                  <option value="all">All Programs</option>
                  {uniquePrograms.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <select
                  value={currentRecordId}
                  onChange={(e) => setCurrentRecordId(e.target.value)}
                  className="px-2 py-1.5 text-xs font-black text-blue-700 bg-blue-50 focus:ring-0 cursor-pointer outline-none min-w-[150px] max-w-[200px] truncate"
                  title="Select active class"
                >
                  <optgroup label="Pinned Classes">
                    {filteredRecords.filter(r => pinnedIds.includes(r.id)).map(r => (
                      <option key={r.id} value={r.id}>📌 {r.className} ({r.teacherName})</option>
                    ))}
                    {pinnedIds.length === 0 && <option disabled>No pinned classes</option>}
                  </optgroup>
                  <optgroup label="All Classes">
                    {filteredRecords.filter(r => !pinnedIds.includes(r.id)).map(r => (
                      <option key={r.id} value={r.id}>{r.className} ({r.teacherName})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <button
                onClick={() => togglePin(currentRecordId)}
                className={`p-1.5 rounded-lg border transition-all ${pinnedIds.includes(currentRecordId) ? 'bg-amber-100 border-amber-300 text-amber-600 shadow-inner' : 'bg-white border-slate-300 text-slate-400 hover:text-slate-600'}`}
                title={pinnedIds.includes(currentRecordId) ? "Unpin class" : "Pin class for quick access"}
              >
                <Pin className={`w-4 h-4 ${pinnedIds.includes(currentRecordId) ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleCreateNewRecord}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors border border-blue-700 rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Class
              </button>

              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-black rounded-lg border transition-all ${
                  showArchived 
                    ? "bg-orange-100 text-orange-700 border-orange-200" 
                    : "bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600 hover:border-slate-300"
                }`}
                title={showArchived ? "Hiding archived levels" : "Showing archived levels"}
              >
                {showArchived ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                ARCHIVED
              </button>

              {/* Sort selector segmented buttons */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-[10px] mr-1 shadow-inner select-none shrink-0">
                <button
                  type="button"
                  onClick={() => setClassSortBy("name")}
                  className={`px-2 py-1 font-black rounded-md transition-all cursor-pointer ${classSortBy === "name" ? "bg-white text-blue-700 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  title="Sort class options alphabetically by name"
                >
                  BY NAME
                </button>
                <button
                  type="button"
                  onClick={() => setClassSortBy("level")}
                  className={`px-2 py-1 font-black rounded-md transition-all cursor-pointer ${classSortBy === "level" ? "bg-white text-blue-700 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  title="Sort class options by grading level profile"
                >
                  BY LEVEL
                </button>
              </div>

              <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm">
                <select
                  value={currentRecordId}
                  onChange={(e) => setCurrentRecordId(e.target.value)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-transparent border-0 focus:ring-0 min-w-[140px] max-w-[220px] cursor-pointer outline-none truncate"
                >
                  {filteredRecords.length > 0 ? (
                    Object.entries(
                      filteredRecords.reduce(
                        (acc, cr) => {
                          const t = cr.teacherName || "Unknown Teacher";
                          if (!acc[t]) acc[t] = [];
                          acc[t].push(cr);
                          return acc;
                        },
                        {} as Record<string, ClassRecord[]>,
                      ),
                    ).map(([teacher, records]) => (
                      <optgroup key={teacher} label={teacher}>
                        {(records as ClassRecord[]).map((cr) => (
                          <option key={cr.id} value={cr.id}>
                            {pinnedIds.includes(cr.id) ? "📌 " : ""}
                            {cr.className} ({cr.termName})
                          </option>
                        ))}
                      </optgroup>
                    ))
                  ) : (
                    <option disabled>No classes found</option>
                  )}
                </select>
                <button
                  onClick={() => togglePin(currentRecord?.id || "")}
                  className={`p-2 border-l border-slate-200 transition-colors ${pinnedIds.includes(currentRecord?.id || "") ? "text-amber-500 bg-amber-50/50 hover:bg-amber-100/50" : "text-slate-400 hover:text-blue-600"}`}
                  title={pinnedIds.includes(currentRecord?.id || "") ? "Unpin Class" : "Pin Class"}
                >
                  <Pin className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              <button
                onClick={handleCreateNewRecord}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-blue-600 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                title="Create New Class Profile"
              >
                <Plus className="w-3.5 h-3.5" />
                New Class
              </button>

              {currentRecord && (
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to move the class "${currentRecord.className}" to the Recycle Bin? You can restore it anytime.`)) {
                      handleDeleteCurrentRecord();
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                  title="Move Class to Recycle Bin"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Class
                </button>
              )}

              <button
                onClick={() => setShowRecycleBin(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer shadow-sm shrink-0"
                title="Recycle Bin for Deleted Classes"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-600" />
                Recycle Bin ({classRecords.filter(c => c.isDeleted).length})
              </button>
            </div>

            {/* Right side: View, Mode, Config, Export */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Segmented Control for Switch Tab */}
              <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 shadow-inner">
                <button
                  onClick={() => setCurrentTab("grades")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${currentTab === "grades" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  Grades
                </button>
                <button
                  onClick={() => setCurrentTab("dashboard")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${currentTab === "dashboard" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>
              </div>

              {/* Level Config */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold transition-all border rounded-lg shadow-sm cursor-pointer ${showSettings ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"}`}
              >
                <Settings className="w-3.5 h-3.5" />
                Level Config
              </button>

              {/* Export Button */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors border border-slate-300 rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
                  title="Export Options"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Export
                  <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
                </button>
                {showExportMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowExportMenu(false)}
                    ></div>
                    <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-[80vh] overflow-y-auto">
                      <div className="p-2">
                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">Grid Line Level</p>
                        <select
                          value={gridLineLevel}
                          onChange={(e) => setGridLineLevel(e.target.value)}
                          className="w-full text-sm border-slate-200 rounded p-1 mb-2 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="none">None</option>
                          <option value="light">Light</option>
                          <option value="medium">Medium</option>
                          <option value="heavy">Heavy</option>
                        </select>
                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">Header Darkness</p>
                        <select
                          value={currentRecord?.settings?.headerDarkness || 'black'}
                          onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, headerDarkness: e.target.value})}
                          className="w-full text-sm border-slate-200 rounded p-1 mb-2 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="black">Black</option>
                          <option value="dark">Dark Gray</option>
                          <option value="medium">Medium Gray</option>
                          <option value="light">Light Gray</option>
                          <option value="none">None (White)</option>
                        </select>
                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">Subject BG Level</p>
                        <select
                          value={currentRecord?.settings?.subjectBgLevel || 'light'}
                          onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, subjectBgLevel: e.target.value})}
                          className="w-full text-sm border-slate-200 rounded p-1 mb-2 text-slate-700 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="light">Pastel (Light)</option>
                          <option value="medium">Medium</option>
                          <option value="dark">Vibrant (Dark)</option>
                          <option value="none">None (White)</option>
                        </select>
                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">Excel Detail Mode</p>
                        <div className="flex gap-1 mb-3 px-2">
                          {(['subjects', 'categories', 'both'] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => handleUpdateExcelDetailMode(mode)}
                              className={`flex-1 py-1.5 px-1 rounded text-[9px] font-bold uppercase tracking-wider transition-all border ${
                                excelDetailMode === mode 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">Excel Export Styles</p>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 1, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-blue-600" /> Style 1: Standard Blue
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 2, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-800 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-slate-600" /> Style 2: Minimalist Grayscale
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 3, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-green-600" /> Style 3: Professional Green
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 4, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-purple-600" /> Style 4: Vibrant Purple
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 5, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-gray-100 hover:text-black rounded-md transition-colors font-semibold border-b border-slate-100 pb-2 mb-1 cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-black" /> Style 5: High Contrast Dark
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 6, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-blue-900" /> Style 6: DPS Corporate Navy
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 7, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-orange-50 hover:text-orange-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-orange-600" /> Style 7: Warm Orange
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 8, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-sky-600" /> Style 8: Sky Blue
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 9, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-pink-50 hover:text-pink-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-pink-600" /> Style 9: Rose Pink
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 10, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-amber-600" /> Style 10: Amber Gold
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 11, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-teal-600" /> Style 11: Teal
                        </button>
                        <button
                          onClick={() => { exportToExcelFull(currentRecord, currentLevel, 12, gridLineLevel, students, excelDetailMode); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-slate-700" /> Style 12: Slate Dark
                        </button>
                      </div>
                      <div className="p-2">
                        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">PDF</p>
                        <button
                          onClick={() => { exportToPDF(currentRecord, currentLevel, 'midterm', students); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-red-600" /> Mid-Term Only
                        </button>
                        <button
                          onClick={() => { exportToPDF(currentRecord, currentLevel, 'final', students); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-red-600" /> Final Test Only
                        </button>
                        <button
                          onClick={() => { exportToPDF(currentRecord, currentLevel, 'full', students); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-red-600" /> Full Term Results Only
                        </button>
                        <button
                          onClick={() => { exportToPDFFull(currentRecord, currentLevel, students); setShowExportMenu(false); }}
                          className="w-full text-left flex items-center gap-2 px-2 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-red-600" /> All PDF Results (Mid + Final + Full)
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleAddStudent}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 border border-transparent"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>

              {/* Connection Status Badge */}
              {isFirebaseConfigured() ? (
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  CLOUD SYNCED
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-bold rounded-lg border bg-amber-50 text-amber-700 border-amber-200 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  LOCAL (NO SYNC)
                </div>
              )}

              {/* User Profile Info */}
              {user && (
                <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg shrink-0">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || "User"} 
                      className="w-6 h-6 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      {getInitials(user.displayName || user.email || "U")}
                    </div>
                  )}
                  <div className="flex flex-col text-left max-w-[120px]">
                    <span className="text-[9px] font-black leading-none text-slate-700 truncate">
                      {user.displayName || "User"}
                    </span>
                    <span className="text-[8px] font-bold leading-none text-slate-400 truncate mt-0.5" title={user.email || ""}>
                      {user.email || "Offline"}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="p-2 ml-1 text-slate-500 hover:text-red-600 bg-white border border-slate-300 rounded-lg shadow-sm transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-2 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6 flex-1 flex flex-col w-full">
        {/* Teacher Monitoring Alerts */}
        {monitoringAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 shadow-sm animate-in fade-in duration-200 shrink-0">
            <Bell className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">Teacher Activity Monitoring Alerts</h4>
              <ul className="list-disc pl-4 space-y-1">
                {monitoringAlerts.map((alert, index) => (
                  <li key={index} className="text-[11px] text-amber-700 font-bold leading-normal">
                    {alert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Class Record Meta Info - Enlarged Profile Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-8 flex flex-wrap gap-6 sm:gap-8 items-center shrink-0 transition-all hover:shadow-2xl hover:border-blue-100">
          <div className="flex-1 min-w-[140px] sm:min-w-[200px] bg-slate-50 p-3 rounded-xl border border-slate-100 group transition-all">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 group-hover:text-slate-600 transition-colors">
              Term / Semester
            </label>
            <input
              type="text"
              value={currentRecord.termName}
              onChange={(e) =>
                handleUpdateCurrentRecord("termName", e.target.value)
              }
              className="w-full text-lg font-black text-slate-900 border-b-2 border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent px-1 py-0.5 transition-all"
              placeholder="e.g. Term 1, 2024"
            />
          </div>
          <div className="flex-1 min-w-[140px] sm:min-w-[200px] bg-blue-50/50 p-3 rounded-xl border border-blue-100 group transition-all">
            <label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1 group-hover:text-blue-700 transition-colors">
              Class Name
            </label>
            <input
              type="text"
              value={currentRecord.className}
              onChange={(e) =>
                handleUpdateCurrentRecord("className", e.target.value)
              }
              className="w-full text-lg font-black text-blue-900 border-b-2 border-transparent hover:border-blue-200 focus:border-blue-500 focus:outline-none bg-transparent px-1 py-0.5 transition-all"
              placeholder="e.g. Morning Class A"
            />
          </div>
          <div className="flex-1 min-w-[140px] sm:min-w-[200px] bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 group transition-all">
            <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1 group-hover:text-emerald-700 transition-colors">
              Teacher
            </label>
            <div className="flex items-center gap-2 relative">
              <div
                className={`w-8 h-8 rounded-lg flex shrink-0 items-center justify-center text-xs font-black shadow-sm ${getTeacherColor(currentRecord.teacherName)}`}
              >
                {getInitials(currentRecord.teacherName)}
              </div>
              <input
                type="text"
                list="sample-teachers"
                value={currentRecord.teacherName}
                onChange={(e) =>
                  handleUpdateCurrentRecord("teacherName", e.target.value)
                }
                className="w-full text-lg font-black text-emerald-900 border-b-2 border-transparent hover:border-emerald-200 focus:border-emerald-500 focus:outline-none bg-transparent px-1 py-0.5 transition-all"
                placeholder="Teacher Name"
              />
              <datalist id="sample-teachers">
                {SAMPLE_TEACHERS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
          </div>
          {["DPS", "DPSS", "BPS", "BPSS"].includes((accessCode || "").toUpperCase().trim()) && (
            <div className="flex flex-row sm:flex-col items-center justify-center gap-2 shrink-0">
               <button 
                  onClick={handlePublishTemplate}
                  className="bg-purple-100 hover:bg-purple-600 hover:text-white text-purple-700 text-[10px] font-black py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all border border-purple-200 shadow-sm uppercase tracking-widest whitespace-nowrap"
                  title="Share this level's structure as a template"
               >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Share
               </button>
               <button 
                  onClick={handleSaveAdminTemplate}
                  className="bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-700 text-[10px] font-black py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-all border border-blue-200 shadow-sm uppercase tracking-widest whitespace-nowrap"
                  title="Save current class profile to template library and sync"
               >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Save
               </button>
            </div>
          )}
          <div className="flex-1 min-w-[140px] sm:min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Class Lock Code
            </label>
            <div className="flex items-center gap-2 relative">
              <Lock className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={currentRecord.accessCode || ""}
                onChange={(e) =>
                  handleUpdateCurrentRecord("accessCode", e.target.value)
                }
                className="w-full text-base font-semibold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent px-1 py-0.5 transition-colors uppercase"
                placeholder="e.g. DAVINA"
              />
            </div>
          </div>
          <div 
            className="flex-1 min-w-[140px] sm:min-w-[200px] p-2 rounded-lg border transition-all duration-300"
            style={{ 
              backgroundColor: currentLevel?.color ? `${currentLevel.color}15` : '#f5f3ff', // 15 is hex for ~8% opacity
              borderColor: currentLevel?.color ? `${currentLevel.color}40` : '#e0e7ff'
            }}
          >
            <label 
              className="block text-[10px] font-extrabold uppercase tracking-wider mb-1"
              style={{ color: currentLevel?.color || '#6366f1' }}
            >
              Level Profile
            </label>
            <div className="flex items-center gap-1">
              <select
                value={currentRecord.levelId}
                onChange={(e) =>
                  handleUpdateCurrentRecord("levelId", e.target.value)
                }
                className="w-full text-base font-bold border-b-2 border-transparent hover:border-indigo-200 focus:border-indigo-500 focus:outline-none bg-transparent px-1 py-0.5 transition-colors cursor-pointer"
                style={{ color: currentLevel?.color || '#312e81' }}
              >
                {(() => {
                  const availableLevels = levels.filter(lvl => 
                    lvl.id === currentRecord.levelId || 
                    (!lvl.isArchived && (lvl.subjects.length > 0 || classRecords.some(c => !c.isDeleted && c.levelId === lvl.id)))
                  );
                  
                  const archivedLevels = levels.filter(lvl => 
                    lvl.isArchived && lvl.id !== currentRecord.levelId
                  );

                  const grouped = availableLevels.reduce((acc, lvl) => {
                    const prog = lvl.program || "Other Levels";
                    if (!acc[prog]) acc[prog] = [];
                    acc[prog].push(lvl);
                    return acc;
                  }, {} as Record<string, Level[]>);

                  return (
                    <>
                      {Object.entries(grouped).map(([program, lvls]) => (
                        <optgroup key={program} label={program as string}>
                          {(lvls as Level[]).map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </optgroup>
                      ))}
                      {archivedLevels.length > 0 && (
                        <optgroup label="Archived / Previous Years">
                          {archivedLevels.map(l => (
                            <option key={l.id} value={l.id}>{l.name} (Archived)</option>
                          ))}
                        </optgroup>
                      )}
                    </>
                  );
                })()}
              </select>
              <button
                onClick={handleRenameLevel}
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                title="Rename Current Level"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleCreateLevel}
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded transition-colors"
                title="Create New Level"
              >
                <Plus className="w-4 h-4" />
              </button>
              {levels.length > 1 && (
                <button
                  onClick={handleDeleteLevel}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded transition-colors"
                  title="Delete Current Level"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

            {showSettings && (
              <SettingsModal
                level={currentLevel}
                levels={levels}
                onUpdateLevel={handleUpdateLevel}
                onReplaceLevels={handleReplaceLevels}
                onClose={() => setShowSettings(false)}
                paperStyle={paperStyle}
                onUpdatePaperStyle={handleUpdatePaperStyle}
                wallpaper={wallpaper}
                onUpdateWallpaper={handleUpdateWallpaper}
                gridLineLevel={gridLineLevel}
                onUpdateGridLineLevel={handleUpdateGridLineLevel}
                settings={currentRecord.settings || DEFAULT_SETTINGS}
                onUpdateSettings={handleUpdateSettings}
                onOpenTemplateModal={handleOpenTemplateModal}
                classRecords={classRecords}
                onDeleteAllClasses={handleDeleteAllClasses}
              />
            )}

        {/* Template Duplication Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Create Class from Template
                </h3>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  X
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-500">
                  Instantly duplicate this class setup to another teacher,
                  rename it, and select a new target level profile! This saves a
                  tremendous amount of time.
                </p>

                {templateError && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    {templateError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    New Class Name
                  </label>
                  <input
                    type="text"
                    value={templateClassName}
                    onChange={(e) => setTemplateClassName(e.target.value)}
                    placeholder="e.g. Foundation 2 Class B"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      New Term Name
                    </label>
                    <input
                      type="text"
                      value={templateTermName}
                      onChange={(e) => setTemplateTermName(e.target.value)}
                      placeholder="e.g. Term 3, 2026"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Teacher
                    </label>
                    <input
                      type="text"
                      list="sample-teachers"
                      value={templateTeacherName}
                      onChange={(e) => setTemplateTeacherName(e.target.value)}
                      placeholder="Teacher Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Level Profile
                    </label>
                    <select
                      value={templateLevelId}
                      onChange={(e) => setTemplateLevelId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    >
                      {(() => {
                        const availableLevels = levels.filter(lvl => 
                          lvl.id === templateLevelId || 
                          (!lvl.isArchived && (lvl.subjects.length > 0 || classRecords.some(c => !c.isDeleted && c.levelId === lvl.id)))
                        );
                        
                        const archivedLevels = levels.filter(lvl => 
                          lvl.isArchived && lvl.id !== templateLevelId
                        );

                        const grouped = availableLevels.reduce((acc, lvl) => {
                          const prog = lvl.program || "Other Levels";
                          if (!acc[prog]) acc[prog] = [];
                          acc[prog].push(lvl);
                          return acc;
                        }, {} as Record<string, Level[]>);

                        return (
                          <>
                            {Object.entries(grouped).map(([program, lvls]) => (
                              <optgroup key={program} label={program as string}>
                                {(lvls as Level[]).map(l => (
                                  <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                              </optgroup>
                            ))}
                            {archivedLevels.length > 0 && (
                              <optgroup label="Archived / Previous Years">
                                {archivedLevels.map(l => (
                                  <option key={l.id} value={l.id}>{l.name} (Archived)</option>
                                ))}
                              </optgroup>
                            )}
                          </>
                        );
                      })()}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Lock Code
                    </label>
                    <input
                      type="text"
                      value={templateAccessCode}
                      onChange={(e) => setTemplateAccessCode(e.target.value)}
                      placeholder="e.g. DAVINA"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Template Code Verification (Type 'DPSS' or 'BPS')
                  </label>
                  <input
                    type="text"
                    value={templateVerificationCode}
                    onChange={(e) => setTemplateVerificationCode(e.target.value)}
                    placeholder="Enter DPSS or BPS to verify"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-bold placeholder:normal-case placeholder:font-normal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Student Roster Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="roster_option"
                        value="copy_names"
                        checked={templateRosterOption === "copy_names"}
                        onChange={() => setTemplateRosterOption("copy_names")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">
                        Duplicate student list but{" "}
                        <strong>clear grades to 0</strong> (Recommended
                        Template)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="roster_option"
                        value="copy_all"
                        checked={templateRosterOption === "copy_all"}
                        onChange={() => setTemplateRosterOption("copy_all")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">
                        Duplicate student list{" "}
                        <strong>with all current grades</strong>
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="roster_option"
                        value="empty"
                        checked={templateRosterOption === "empty"}
                        onChange={() => setTemplateRosterOption("empty")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700">
                        Create class with an{" "}
                        <strong>empty student roster</strong>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFromTemplate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create From Template
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateLevelModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-black tracking-tight text-slate-800 uppercase flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  {levelToRename ? "Rename Level Profile" : "New Level Profile"}
                </h3>
                <button onClick={() => setShowCreateLevelModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Profile Name
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={newLevelProfileName}
                    onChange={(e) => setNewLevelProfileName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConfirmCreateLevel()}
                    placeholder="e.g. Foundation Level A"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Profile Color
                  </label>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <input 
                      type="color"
                      value={newLevelColor}
                      onChange={(e) => setNewLevelColor(e.target.value)}
                      className="w-12 h-12 p-0 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden shrink-0 shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-black text-slate-600 mb-1 uppercase tracking-wider">Accent Color</div>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight">This color will be used to identify this level in the profile selector and headers.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'].map(c => (
                      <button 
                        key={c}
                        onClick={() => setNewLevelColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 active:scale-95 ${newLevelColor === c ? 'border-slate-400 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">
                  {levelToRename 
                    ? "Updating the name or color will help you identify this grading structure when creating new classes." 
                    : "Create a new profile to define subjects, assignments, and test weights from scratch."}
                </p>
              </div>
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowCreateLevelModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCreateLevel}
                  disabled={!newLevelProfileName.trim()}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {levelToRename ? "Update Profile" : "Create Profile"}
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Class Creation Modal */}
        {showClassModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full my-auto border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Create New Class Profile
                </h3>
                <button
                  onClick={() => setShowClassModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                {newClassError && (
                  <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                    {newClassError}
                  </div>
                )}
                {/* How would you like to set up this class? */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    How would you like to set up this class?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setClassCreationSource("scratch");
                        setSelectedTemplateId("");
                        setSelectedTemplateLibraryId("");
                        setNewClassName("");
                        setNewTermName("Term 1, 2026");
                        setNewTeacherName(user?.displayName || "Teacher Name");
                        setNewLevelId(levels[0]?.id || "");
                        setCopyStudentsFromTemplate(false);
                        setNewPastedContent("");
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        classCreationSource === "scratch"
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                    >
                      <Plus className="w-5 h-5 mb-1 text-blue-600" />
                      <span className="text-[10px] uppercase tracking-wider font-extrabold">Scratch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setClassCreationSource("existing");
                        setSelectedTemplateLibraryId("");
                        setNewClassName("");
                        setNewTermName("Term 1, 2026");
                        setNewTeacherName(user?.displayName || "Teacher Name");
                        setNewPastedContent("");
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        classCreationSource === "existing"
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-sm"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                    >
                      <FolderOpen className="w-5 h-5 mb-1 text-indigo-600" />
                      <span className="text-[10px] uppercase tracking-wider font-extrabold">Existing Class</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setClassCreationSource("template");
                        setSelectedTemplateId("");
                        setNewClassName("");
                        setNewTermName("Term 1, 2026");
                        setNewTeacherName(user?.displayName || "Teacher Name");
                        setCopyStudentsFromTemplate(false);
                        setNewPastedContent("");
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        classCreationSource === "template"
                          ? "border-purple-500 bg-purple-50 text-purple-700 font-bold shadow-sm"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                    >
                      <Sparkles className="w-5 h-5 mb-1 text-purple-600" />
                      <span className="text-[10px] uppercase tracking-wider font-extrabold">Template & Sync</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setClassCreationSource("paste");
                        setSelectedTemplateId("");
                        setSelectedTemplateLibraryId("");
                        setNewClassName("");
                        setNewTermName("Term 1, 2026");
                        setNewTeacherName(user?.displayName || "Teacher Name");
                        setNewAccessCode("DP-S-S");
                        setCopyStudentsFromTemplate(false);
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        classCreationSource === "paste"
                          ? "border-green-500 bg-green-50 text-green-700 font-bold shadow-sm"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                    >
                      <Clipboard className="w-5 h-5 mb-1 text-green-600" />
                      <span className="text-[10px] uppercase tracking-wider font-extrabold">Paste Text</span>
                    </button>
                  </div>
                </div>

                {/* Conditional load template selectors */}
                {classCreationSource === "existing" && (
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-1.5 text-blue-800">
                      <FolderOpen className="w-3.5 h-3.5" />
                      <label className="block text-[10px] font-black uppercase tracking-widest">
                        Load From Existing Class
                      </label>
                    </div>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => {
                        const templateId = e.target.value;
                        setSelectedTemplateId(templateId);
                        if (templateId) {
                          const templateRecord = classRecords.find((r) => r.id === templateId);
                          if (templateRecord) {
                            setNewClassName(templateRecord.className + " (Copy)");
                            setNewTermName(templateRecord.termName);
                            setNewTeacherName(templateRecord.teacherName);
                            setNewLevelId(templateRecord.levelId);
                            setNewAccessCode(templateRecord.accessCode || "");
                          }
                        } else {
                          setNewClassName("");
                          setNewTermName("Term 1, 2026");
                          setNewTeacherName(user?.displayName || "Teacher Name");
                          setNewLevelId(levels[0]?.id || "");
                          setNewAccessCode("");
                          setCopyStudentsFromTemplate(false);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-blue-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 rounded-lg outline-none font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="">-- Choose existing class to copy --</option>
                      {classRecords.map((cr) => (
                        <option key={cr.id} value={cr.id}>
                          {cr.className} ({cr.teacherName})
                        </option>
                      ))}
                    </select>

                    {selectedTemplateId && (
                      <label className="flex items-center gap-2 mt-1.5 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={copyStudentsFromTemplate}
                          onChange={(e) => setCopyStudentsFromTemplate(e.target.checked)}
                          className="rounded border-blue-200 text-blue-600 focus:ring-blue-500/20 w-3.5 h-3.5"
                        />
                        <span className="text-[10px] font-bold text-blue-900">
                          Also copy student names roster (without grades)
                        </span>
                      </label>
                    )}
                  </div>
                )}

                {classCreationSource === "template" && (
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50/50 border border-purple-100 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-1.5 text-purple-800">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <label className="block text-[10px] font-black uppercase tracking-widest">
                        Load From Template Library
                      </label>
                    </div>
                    <select
                      value={selectedTemplateLibraryId}
                      onChange={(e) => {
                        const libId = e.target.value;
                        setSelectedTemplateLibraryId(libId);
                        setSelectedLevelFromLibraryId("");
                        if (libId) {
                          const chosenTemplate = filteredTemplates.find((t) => t.id === libId);
                          if (chosenTemplate) {
                            setNewClassName(chosenTemplate.name + " Class");
                            setNewTermName("Term 1, 2026");
                            setNewTeacherName(user?.displayName || "Teacher Name");
                          }
                        } else {
                          setNewClassName("");
                          setNewTermName("Term 1, 2026");
                          setNewTeacherName(user?.displayName || "Teacher Name");
                        }
                      }}
                      className="w-full px-3 py-2 text-xs bg-white border border-purple-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 rounded-lg outline-none font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="">-- Choose program from library --</option>
                      {filteredTemplates.filter(t => t.levels.length > 0).map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name} ({template.authorName || "Teacher"})
                        </option>
                      ))}
                    </select>

                    {selectedTemplateLibraryId && (
                      <select
                        value={selectedLevelFromLibraryId}
                        onChange={(e) => {
                          const lvlId = e.target.value;
                          setSelectedLevelFromLibraryId(lvlId);
                          const program = filteredTemplates.find((t) => t.id === selectedTemplateLibraryId);
                          const chosenLevel = program?.levels.find((l) => l.id === lvlId);
                          if (chosenLevel) {
                            setNewLevelId(chosenLevel.id);
                            setNewClassName(`${program?.name || ""} - ${chosenLevel.name}`);
                          }
                        }}
                        className="w-full px-3 py-2 mt-2 text-xs bg-white border border-purple-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 rounded-lg outline-none font-bold text-slate-700 cursor-pointer"
                      >
                        <option value="">-- Choose level --</option>
                        {(filteredTemplates.find((t) => t.id === selectedTemplateLibraryId)?.levels || []).map((lvl) => (
                          <option key={lvl.id} value={lvl.id}>
                            {lvl.name}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="text-[10px] text-purple-600 font-medium leading-relaxed">
                      This will import the template's grading structure and subjects to configure your new class automatically.
                    </p>
                  </div>
                )}

                {classCreationSource === "paste" && (
                  <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50/50 border border-green-100 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-1.5 text-green-800">
                      <Clipboard className="w-3.5 h-3.5" />
                      <label className="block text-[10px] font-black uppercase tracking-widest">
                        Paste Template Content
                      </label>
                    </div>
                    <textarea
                      value={newPastedContent}
                      onChange={(e) => setNewPastedContent(e.target.value)}
                      placeholder="Paste your class profile text here... (e.g. Reading 70%, Dictation 30%)"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 rounded-xl outline-none text-slate-700 transition-all min-h-[120px]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Class Name *
                  </label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g. Grade 1 English / Phonics 1A"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl outline-none font-semibold text-slate-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Term / Semester
                  </label>
                  <input
                    type="text"
                    value={newTermName}
                    onChange={(e) => setNewTermName(e.target.value)}
                    placeholder="e.g. Term 1, 2026"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl outline-none font-semibold text-slate-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    Teacher Name
                  </label>
                  <input
                    type="text"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    placeholder="e.g. Teacher Davina"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl outline-none font-semibold text-slate-800 transition-all"
                  />
                </div>

                {classCreationSource === "scratch" && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                      Level Config Profile
                    </label>
                    <select
                      value={newLevelId}
                      onChange={(e) => setNewLevelId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-xl outline-none font-bold text-slate-700 transition-all cursor-pointer"
                    >
                      <option value="empty_no_subjects">Empty Level Profile (No Table, No Columns)</option>
                      {(() => {
                        const availableLevels = levels.filter(lvl => 
                          lvl.id === newLevelId || 
                          (!lvl.isArchived && (lvl.subjects.length > 0 || classRecords.some(c => !c.isDeleted && c.levelId === lvl.id)))
                        );
                        
                        const archivedLevels = levels.filter(lvl => 
                          lvl.isArchived && lvl.id !== newLevelId
                        );

                        const grouped = availableLevels.reduce((acc, lvl) => {
                          const prog = lvl.program || "Other Levels";
                          if (!acc[prog]) acc[prog] = [];
                          acc[prog].push(lvl);
                          return acc;
                        }, {} as Record<string, Level[]>);

                        return (
                          <>
                            {Object.entries(grouped).map(([program, lvls]) => (
                              <optgroup key={program} label={program as string}>
                                {(lvls as Level[]).map(l => (
                                  <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                              </optgroup>
                            ))}
                            {archivedLevels.length > 0 && (
                              <optgroup label="Archived / Previous Years">
                                {archivedLevels.map(l => (
                                  <option key={l.id} value={l.id}>{l.name} (Archived)</option>
                                ))}
                              </optgroup>
                            )}
                          </>
                        );
                      })()}
                    </select>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <label className="block text-[10px] font-black text-blue-800 uppercase tracking-widest">
                      Create Teacher Access Code *
                    </label>
                  </div>
                  <input
                    type="text"
                    value={newAccessCode}
                    onChange={(e) => setNewAccessCode(e.target.value)}
                    placeholder="e.g. DAVINA"
                    className="w-full px-3.5 py-2 text-sm uppercase bg-white border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 rounded-lg outline-none font-black text-blue-900 transition-all"
                  />
                  <p className="text-[10px] text-slate-500 leading-normal">
                    This security code ensures only you can access, edit, and view this class record. Write it down carefully!
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCreateClass}
                  disabled={isCreatingClass}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10 flex items-center gap-1.5"
                >
                  {isCreatingClass ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {isCreatingClass ? "Creating..." : "Create Class Profile"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recycle Bin Modal */}
        {showRecycleBin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full border border-slate-100 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-amber-600" />
                  Recycle Bin
                </h3>
                <button
                  onClick={() => setShowRecycleBin(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer animate-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[400px] overflow-y-auto space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Classes moved to the Recycle Bin can be recovered at any time. Permanently deleting a class destroys all records and grade metrics forever.
                </p>

                {classRecords.filter(c => c.isDeleted).length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {classRecords.filter(c => c.isDeleted).map((cr) => (
                      <div key={cr.id} className="p-4 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-slate-800 truncate">{cr.className}</h4>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            Teacher: <span className="font-bold text-slate-700">{cr.teacherName}</span> • Term: <span className="font-bold text-slate-700">{cr.termName}</span>
                          </p>
                          {cr.deletedAt && (
                            <p className="text-[10px] text-amber-600 font-semibold mt-1">
                              Deleted: {new Date(cr.deletedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleRestoreClass(cr.id)}
                            className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                            title="Restore class and all grades"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => handlePermanentDeleteClass(cr.id)}
                            className="p-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                            title="Permanently Delete Class"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                    <Trash2 className="w-8 h-8 text-slate-300 mx-auto animate-none" />
                    <p className="text-sm font-bold text-slate-700">Recycle Bin is Empty</p>
                    <p className="text-xs text-slate-400">Classes you delete will appear here for recovery.</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowRecycleBin(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div
          className={`shadow-sm border flex flex-col ${isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "rounded-xl flex-1 min-h-[400px]"} ${currentPaper.bgClass} ${currentPaper.borderClass} ${currentPaper.textClass}`}
          style={currentPaper.customStyle}
        >
          <div className="px-3 sm:px-5 py-2.5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between bg-black/[0.01] shrink-0 gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="flex items-center gap-3 sm:gap-4 border-b sm:border-b-0 border-slate-100 pb-2 sm:pb-0 shrink-0">
                <button 
                  onClick={() => setActiveView('grades')}
                  className={`text-base sm:text-lg font-bold flex items-center gap-2 pb-1 transition-colors whitespace-nowrap shrink-0 ${activeView === 'grades' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  Student Rosters
                </button>
                <button 
                  onClick={() => setActiveView('students')}
                  className={`text-base sm:text-lg font-bold flex items-center gap-2 pb-1 transition-colors whitespace-nowrap shrink-0 ${activeView === 'students' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Students
                </button>
                {(currentRecord?.settings?.showAttendance !== false) && (
                  <button 
                    onClick={() => setActiveView('attendance')}
                    className={`text-base sm:text-lg font-bold flex items-center gap-2 pb-1 transition-colors whitespace-nowrap shrink-0 ${activeView === 'attendance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    Attendance
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {/* Mobile Quick Mode Toggle */}
                <div className="flex sm:hidden items-center gap-1.5 shrink-0">
                  <div className={`flex items-center border rounded-lg px-2 shadow-sm transition-all ${
                    resultMode === 'full' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                    resultMode === 'midterm' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                    'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    <select
                      value={resultMode}
                      onChange={(e) => handleUpdateResultMode(e.target.value as "full" | "midterm" | "final")}
                      className="bg-transparent text-[10px] font-black outline-none cursor-pointer py-1.5 uppercase tracking-tighter"
                    >
                      <option value="full">Termly</option>
                      <option value="midterm">Midterm</option>
                      <option value="final">Final</option>
                    </select>
                  </div>
                </div>

                {/* Desktop Mode Select */}
                <div className={`hidden sm:flex items-center border rounded-lg px-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shrink-0 ${
                  resultMode === 'full' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                  resultMode === 'midterm' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  <span className={`text-[10px] font-black uppercase tracking-widest mr-2 border-r pr-2 py-1 ${
                    resultMode === 'full' ? 'text-emerald-500 border-emerald-200' :
                    resultMode === 'midterm' ? 'text-amber-500 border-amber-200' :
                    'text-rose-500 border-rose-200'
                  }`}>Mode</span>
                  <select
                    value={resultMode}
                    onChange={(e) => handleUpdateResultMode(e.target.value as "full" | "midterm" | "final")}
                    className="bg-transparent text-sm font-bold outline-none cursor-pointer py-1 text-inherit"
                  >
                    <option value="full" className="text-slate-700 bg-white">Termly Result</option>
                    <option value="midterm" className="text-slate-700 bg-white">Mid-term Test</option>
                    <option value="final" className="text-slate-700 bg-white">Final Test</option>
                  </select>
                </div>

                {/* Settings Dropdown */}
                <div className="relative shrink-0">
                  <button 
                    onClick={() => setShowViewSettingsMenu(!showViewSettingsMenu)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm ${
                      showViewSettingsMenu ? "bg-slate-100 border-slate-300 text-blue-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Settings</span>
                    <span className="sm:hidden text-[10px] uppercase">Settings</span>
                    <ChevronDown className={`w-3 h-3 opacity-50 ml-1 transition-transform ${showViewSettingsMenu ? "rotate-180" : ""}`} />
                  </button>
                  {showViewSettingsMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowViewSettingsMenu(false)}></div>
                      <div className="absolute bottom-full left-0 mb-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl transition-all z-50 max-h-[80vh] overflow-y-auto">
                        <div className="p-4 flex flex-col gap-4">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visibility Settings</span>
                            
                            <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                              <span>Show Category Icon</span>
                              <input 
                                type="checkbox" 
                                checked={currentRecord?.settings?.showCategoryIcon !== false}
                                onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, showCategoryIcon: e.target.checked})}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                              />
                            </label>

                            <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                              <span>Show Score Columns</span>
                              <input 
                                type="checkbox" 
                                checked={currentRecord?.settings?.showScoreColumns !== false}
                                onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, showScoreColumns: e.target.checked})}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                              />
                            </label>

                            <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                              <span>Hide Student's Name</span>
                              <input 
                                type="checkbox" 
                                checked={currentRecord?.settings?.hideStudentNames === true}
                                onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, hideStudentNames: e.target.checked})}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                              />
                            </label>

                            <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                              <span>Show Regular Categories</span>
                              <input 
                                type="checkbox" 
                                checked={currentRecord?.settings?.hideRegularCategories !== true}
                                onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, hideRegularCategories: !e.target.checked})}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                              />
                            </label>

                            <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                              <span>Show Column Term Result</span>
                              <input 
                                type="checkbox" 
                                checked={currentRecord?.settings?.showTermResult !== false}
                                onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, showTermResult: e.target.checked})}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                              />
                            </label>

                            <label className="flex items-center justify-between gap-2 text-sm font-medium text-slate-700 cursor-pointer hover:text-blue-600 transition-colors">
                              <span>Show Item Config (MAX, etc.)</span>
                              <input 
                                type="checkbox" 
                                checked={currentRecord?.settings?.showItemConfig !== false}
                                onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, showItemConfig: e.target.checked})}
                                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                              />
                            </label>
                          </div>

                          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculation Display</span>
                            
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Category Result Mode</span>
                              <select 
                                value={currentRecord?.settings?.categoryResultMode || 'wtd'}
                                onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, categoryResultMode: e.target.value as 'avg'|'wtd'})}
                                className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 outline-none focus:border-blue-500 bg-slate-50"
                              >
                                <option value="avg">Show AVG percent</option>
                                <option value="wtd">Show WTD percent</option>
                              </select>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Exam Result Mode</span>
                              <div className="flex gap-2">
                                <label className="flex items-center gap-1 text-[10px] font-bold text-slate-600 cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name="exam_mode"
                                    checked={currentRecord?.settings?.showExamAvgPercent === true}
                                    onChange={() => handleUpdateSettings({...currentRecord!.settings!, showExamAvgPercent: true, showExamWtdPercent: false})}
                                    className="w-3 h-3 text-blue-600"
                                  />
                                  AVG %
                                </label>
                                <label className="flex items-center gap-1 text-[10px] font-bold text-slate-600 cursor-pointer">
                                  <input 
                                    type="radio" 
                                    name="exam_mode"
                                    checked={currentRecord?.settings?.showExamWtdPercent === true}
                                    onChange={() => handleUpdateSettings({...currentRecord!.settings!, showExamWtdPercent: true, showExamAvgPercent: false})}
                                    className="w-3 h-3 text-blue-600"
                                  />
                                  WTD %
                                </label>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Keep Columns</span>
                              <select 
                                value={currentRecord?.settings?.keepColumnMode || 'both'}
                                onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, keepColumnMode: e.target.value as 'every'|'wtd'|'both'})}
                                className="w-full text-xs font-bold border border-slate-200 rounded p-1.5 outline-none focus:border-blue-500 bg-slate-50"
                              >
                                <option value="every">Keep every column</option>
                                <option value="wtd">Keep WTD column</option>
                                <option value="both">Both</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Result View</span>
                            <select 
                              value={currentRecord?.settings?.resultDisplayMode || 'both'}
                              onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, resultDisplayMode: e.target.value as 'both'|'avg'|'wtd'})}
                              className="w-full text-xs font-bold border border-slate-200 rounded p-2 outline-none focus:border-blue-500 bg-slate-50"
                            >
                              <option value="both">Both (Wtd & Avg)</option>
                              <option value="wtd">Weight Only</option>
                              <option value="avg">Average Only</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-2 pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Excel Export Defaults</span>
                            <div className="space-y-3">
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Header Darkness</span>
                                <select
                                  value={currentRecord?.settings?.headerDarkness || 'black'}
                                  onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, headerDarkness: e.target.value})}
                                  className="w-full text-xs border border-slate-200 rounded p-1.5 mt-1 text-slate-700 focus:ring-blue-500 bg-slate-50"
                                >
                                  <option value="black">Black</option>
                                  <option value="dark">Dark Gray</option>
                                  <option value="medium">Medium Gray</option>
                                  <option value="light">Light Gray</option>
                                  <option value="none">None (White)</option>
                                </select>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Subject BG Level</span>
                                <select
                                  value={currentRecord?.settings?.subjectBgLevel || 'light'}
                                  onChange={(e) => handleUpdateSettings({...currentRecord!.settings!, subjectBgLevel: e.target.value})}
                                  className="w-full text-xs border border-slate-200 rounded p-1.5 mt-1 text-slate-700 focus:ring-blue-500 bg-slate-50"
                                >
                                  <option value="light">Pastel (Light)</option>
                                  <option value="medium">Medium</option>
                                  <option value="dark">Vibrant (Dark)</option>
                                  <option value="none">None (White)</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="sm:hidden flex flex-col gap-2 pt-3 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grading Mode</span>
                            <select
                              value={resultMode}
                              onChange={(e) => handleUpdateResultMode(e.target.value as "full" | "midterm" | "final")}
                              className="w-full text-xs font-bold border border-slate-200 rounded p-2 outline-none focus:border-blue-500 bg-slate-50"
                            >
                              <option value="full">Termly Result</option>
                              <option value="midterm">Mid-term Test</option>
                              <option value="final">Final Test</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Compact View Toggle */}
                <button
                  onClick={() => handleUpdateSettings({
                    ...currentRecord!.settings!,
                    showScoreColumns: !currentRecord!.settings!.showScoreColumns
                  })}
                  className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all shadow-sm shrink-0 ${
                    currentRecord?.settings?.showScoreColumns 
                      ? "bg-white border-slate-200 text-slate-600 hover:bg-slate-50" 
                      : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {currentRecord?.settings?.showScoreColumns ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                  <span className="hidden lg:inline">{currentRecord?.settings?.showScoreColumns ? "Compact View" : "Detailed View"}</span>
                  <span className="lg:hidden">{currentRecord?.settings?.showScoreColumns ? "Compact" : "Detailed"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center bg-white/50 border border-slate-200 rounded-full px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-2 text-sm outline-none bg-transparent w-full font-bold text-slate-700"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded shadow-sm transition-colors border border-slate-200 shrink-0"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-transparent relative">
            {!hasAccessToCurrent && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full text-center">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight text-slate-800 mb-2 uppercase">Class Locked</h3>
                  <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">
                    This class profile is secured by the teacher's access code. Please enter the correct code in the top header.
                  </p>
                  <div className="text-xs font-bold text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Need persistent access on this device?<br/>
                    Enter code above, then click the 🔓 button.
                  </div>
                </div>
              </div>
            )}
            {selectedProgram !== "all" && filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-3xl m-6 text-center max-w-md mx-auto shadow-sm">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">No Classes in "{selectedProgram}"</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  There are currently no active class records assigned to the program <strong>"{selectedProgram}"</strong>. 
                  You can clear the filter to view other classes, or configure a class level profile under <strong>Level settings</strong> to place it in this program.
                </p>
                <button
                  onClick={() => setSelectedProgram("all")}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Show All Programs
                </button>
              </div>
            ) : currentTab === "dashboard" ? (
              <Dashboard currentRecord={currentRecord} students={students} currentLevel={currentLevel} resultMode={resultMode} />
            ) : activeView === 'students' ? (
              <StudentManager 
                students={students}
                onAddStudent={handleAddStudent}
                onUpdateStudentField={handleUpdateStudentField}
                onDeleteStudent={handleDeleteStudent}
              />
            ) : activeView === 'attendance' ? (
              <AttendanceTracker 
                students={students}
                settings={currentRecord.settings || DEFAULT_SETTINGS}
                searchQuery={searchQuery}
                onUpdateSettings={handleUpdateSettings}
                onUpdateStudentField={handleUpdateStudentField}
                onUpdateAttendanceRecord={handleUpdateAttendanceRecord}
                onMarkAllPresent={handleMarkAllPresent}
              />
            ) : (
              <GradeTable
                level={currentLevel}
                onUpdateLevel={handleUpdateLevel}
                students={students}
                searchQuery={searchQuery}
                onUpdateStudent={handleUpdateStudentScore}
                onUpdateStudentField={handleUpdateStudentField}
                onBulkUpdateStudentScores={handleBulkUpdateStudentScores}
                onDeleteStudent={handleDeleteStudent}
                resultMode={resultMode}
                paperStyle={paperStyle}
                gridLineLevel={gridLineLevel}
                settings={currentRecord.settings || DEFAULT_SETTINGS}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
