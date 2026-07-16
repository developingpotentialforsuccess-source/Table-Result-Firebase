import React, { useState, useEffect } from 'react';
import { X, User, Save, Copy, FileText, Database, Trash2, Edit2, Plus, Bell, RefreshCw, Upload, Download } from 'lucide-react';
import { Level, Subject, PAPER_STYLES, WALLPAPERS, TeacherSettings, MANUAL_COLORS, ClassRecord } from '../types';
import LevelSettings from './LevelSettings';
import { SYSTEM_TEMPLATES } from '../lib/templates';
import { auth, db, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { exportFullBackup, importFullBackup } from '../lib/backupUtils';

interface Props {
  level: Level;
  levels: Level[];
  onUpdateLevel: (level: Level) => void;
  onReplaceLevels: (levels: Level[]) => void;
  onClose: () => void;
  paperStyle: string;
  onUpdatePaperStyle: (id: string) => void;
  wallpaper: string;
  onUpdateWallpaper: (id: string) => void;
  gridLineLevel: string;
  onUpdateGridLineLevel: (level: string) => void;
  settings: TeacherSettings;
  onUpdateSettings: (settings: TeacherSettings) => void;
  onOpenTemplateModal?: () => void;
  classRecords: ClassRecord[];
  onDeleteAllClasses?: () => void;
}

export default function SettingsModal({ level, levels, onUpdateLevel, onReplaceLevels, onClose, paperStyle, onUpdatePaperStyle, wallpaper, onUpdateWallpaper, gridLineLevel, onUpdateGridLineLevel, settings, onUpdateSettings, onOpenTemplateModal, classRecords, onDeleteAllClasses }: Props) {
  const [activeTab, setActiveTab] = useState<'level' | 'grading' | 'templates' | 'appearance' | 'account' | 'guide' | 'monitoring' | 'backup' | 'data'>('level');
  const [activeGradingTab, setActiveGradingTab] = useState<'full' | 'midterm' | 'final'>('full');
  const [activeScaleType, setActiveScaleType] = useState<'grade' | 'status'>('grade');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authError, setAuthError] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<{id: string, name: string, authorName: string, levels: Level[]}[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<{ id: string, authorId: string, name: string, levels: Level[] } | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [backupStatus, setBackupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [backupMessage, setBackupMessage] = useState('');
  const [unlockCode, setUnlockCode] = useState(() => {
    return localStorage.getItem("gradecalc_unlock_code") || "";
  });

  const getScaleValues = (mode: 'full' | 'midterm' | 'final', type: 'grade' | 'status') => {
    const isOldStatusScale = (s?: { grade: string }[]) => {
      if (!s || s.length === 0) return false;
      return s.some(item => item.grade === 'Pass' || item.grade === 'Repeat' || item.grade === 'Fail +');
    };

    if (type === 'status') {
      if (mode === 'full') return settings.statusScale || [{ grade: 'Pass', minScore: 70 }, { grade: 'Repeat', minScore: 60 }, { grade: 'Fail +', minScore: 0 }];
      if (mode === 'midterm') return settings.midtermStatusScale || [{ grade: 'Pass', minScore: 50 }, { grade: 'Fail', minScore: 0 }];
      return settings.finalStatusScale || [{ grade: 'Pass', minScore: 50 }, { grade: 'Fail', minScore: 0 }];
    } else {
      const defaultGradingScale = [
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
      const currentScale = mode === 'full' ? settings.gradingScale : (mode === 'midterm' ? settings.midtermGradingScale : settings.finalGradingScale);
      return (currentScale && !isOldStatusScale(currentScale)) ? currentScale : defaultGradingScale;
    }
  };

  const handleUpdateGlobalScale = (mode: 'full' | 'midterm' | 'final', index: number, field: 'grade' | 'minScore', val: any) => {
    const scale = [...getScaleValues(mode, activeScaleType)];
    if (field === 'minScore') {
      scale[index] = { ...scale[index], minScore: Math.max(0, Math.min(100, Number(val))) };
    } else {
      scale[index] = { ...scale[index], grade: val };
    }
    const key = activeScaleType === 'status' 
      ? (mode === 'full' ? 'statusScale' : mode === 'midterm' ? 'midtermStatusScale' : 'finalStatusScale')
      : (mode === 'full' ? 'gradingScale' : mode === 'midterm' ? 'midtermGradingScale' : 'finalGradingScale');
    onUpdateSettings({ ...settings, [key]: scale });
  };

  const handleAddGlobalScale = (mode: 'full' | 'midterm' | 'final') => {
    const scale = [...getScaleValues(mode, activeScaleType), { grade: activeScaleType === 'status' ? 'New Status' : 'New Grade', minScore: 50 }];
    const key = activeScaleType === 'status' 
      ? (mode === 'full' ? 'statusScale' : mode === 'midterm' ? 'midtermStatusScale' : 'finalStatusScale')
      : (mode === 'full' ? 'gradingScale' : mode === 'midterm' ? 'midtermGradingScale' : 'finalGradingScale');
    onUpdateSettings({ ...settings, [key]: scale });
  };

  const handleRemoveGlobalScale = (mode: 'full' | 'midterm' | 'final', index: number) => {
    const scale = getScaleValues(mode, activeScaleType).filter((_, i) => i !== index);
    const key = activeScaleType === 'status' 
      ? (mode === 'full' ? 'statusScale' : mode === 'midterm' ? 'midtermStatusScale' : 'finalStatusScale')
      : (mode === 'full' ? 'gradingScale' : mode === 'midterm' ? 'midtermGradingScale' : 'finalGradingScale');
    onUpdateSettings({ ...settings, [key]: scale });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      fetchTemplates();
    });
    return () => unsubscribe();
  }, []);

  const fetchTemplates = async () => {
    if (!isFirebaseConfigured()) {
      setSavedTemplates([]);
      return;
    }
    try {
      // Fetch globally shared templates
      const querySnapshot = await getDocs(collection(db, `templates`));
      const templates: any[] = [];
      querySnapshot.forEach((doc) => {
        templates.push({ id: doc.id, ...doc.data() });
      });
      setSavedTemplates(templates);
    } catch (e) {
      console.error("Error fetching templates:", e);
    }
  };

  const handleSaveTemplate = async () => {
    if (!isFirebaseConfigured()) {
      alert("Saving templates to the shared library requires cloud connection. Please set up Firebase first.");
      return;
    }
    if (!user) return;
    const code = prompt("Enter verification code to save a template to the library:");
    if (!code || code.trim().toLowerCase() !== "dpss") {
      alert("Invalid verification code. You cannot save templates to the library.");
      return;
    }
    const templateName = prompt("Enter template name (e.g., 'Foundation Term 1'):");
    if (!templateName) return;
    
    try {
      const templateId = Math.random().toString(36).substring(2, 9);
      await setDoc(doc(db, `templates`, templateId), {
        name: templateName,
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Teacher',
        levels: levels
      });
      fetchTemplates();
    } catch (e) {
      console.error("Error saving template:", e);
      alert("Failed to save template. Make sure you are signed in.");
    }
  };

  const handleLoadTemplate = (templateLevels: Level[]) => {
    if (confirm("This will replace all your current levels with the template. Are you sure?")) {
      onReplaceLevels(templateLevels);
      alert("Template applied to all levels!");
    }
  };

  const handleApplyToCurrentLevel = (templateLevels: Level[]) => {
    if (!templateLevels || templateLevels.length === 0) return;
    
    let selectedLevel = templateLevels[0];
    
    if (templateLevels.length > 1) {
      const optionsText = templateLevels.map((l, index) => `${index + 1}. ${l.name}`).join("\n");
      const choice = prompt(`This template contains multiple level profiles. Choose which one to apply to your current class (enter 1 to ${templateLevels.length}):\n\n${optionsText}`, "1");
      if (choice === null) return;
      const index = parseInt(choice) - 1;
      if (isNaN(index) || index < 0 || index >= templateLevels.length) {
        alert("Invalid choice!");
        return;
      }
      selectedLevel = templateLevels[index];
    }

    if (confirm(`Apply subjects from template profile "${selectedLevel.name}" to your current class profile "${level.name}"? This will overwrite your current subject weights and categories.`)) {
      const clonedSubjects = JSON.parse(JSON.stringify(selectedLevel.subjects || []));
      onUpdateLevel({ ...level, subjects: clonedSubjects });
      alert(`Applied "${selectedLevel.name}" subjects to your current class successfully!`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleRenameTemplate = async (templateId: string, authorId: string, currentName: string) => {
    if (!isFirebaseConfigured()) {
      alert("Renaming shared templates requires cloud connection.");
      return;
    }
    
    const code = unlockCode.trim().toUpperCase();
    if (!["DPSS", "DPS", "BPS", "BPSS"].includes(code)) {
      alert("Please enter the correct unlock code (DPSS or BPS) below the library to rename templates.");
      return;
    }

    const newName = prompt("Enter new name for this template:", currentName);
    if (!newName || newName === currentName) return;
    
    // Check if it's a system template
    const isSystem = SYSTEM_TEMPLATES.some(t => t.id === templateId);
    
    try {
      if (isSystem) {
        // For system templates, create a cloned version in their library with the new name
        const systemTemplate = SYSTEM_TEMPLATES.find(t => t.id === templateId);
        if (!systemTemplate) return;
        
        await setDoc(doc(db, `templates`, `${templateId}_renamed_${Date.now()}`), {
          name: newName,
          authorId: user?.uid || 'guest',
          authorName: user?.displayName || user?.email || 'Teacher',
          levels: systemTemplate.levels,
          originalSystemId: templateId // To help hide the original if we want
        });
        alert("System template renamed and saved to your library.");
      } else {
        // Regular template rename (check author if not unlocked by DPSS)
        // Actually the user said "I don't have to copy. I can rename it directly"
        // If they have DPSS, they can rename ANY template.
        await updateDoc(doc(db, `templates`, templateId), {
          name: newName
        });
      }
      fetchTemplates();
    } catch (e) {
      console.error("Error renaming template:", e);
      alert("Failed to rename template.");
    }
  };

  const handleSaveEditedTemplate = async () => {
    if (!isFirebaseConfigured()) {
      alert("Modifying shared templates requires cloud connection.");
      return;
    }
    if (!editingTemplate || !user || user.uid !== editingTemplate.authorId) return;
    try {
      await updateDoc(doc(db, `templates`, editingTemplate.id), {
        levels: editingTemplate.levels,
        name: editingTemplate.name
      });
      fetchTemplates();
      setEditingTemplate(null);
      alert("Template updated successfully!");
    } catch (e) {
      console.error("Error updating template:", e);
      alert("Failed to update template.");
    }
  };

  const handleDeleteTemplate = async (templateId: string, authorId: string) => {
    if (!isFirebaseConfigured()) {
      alert("Deleting shared templates requires cloud connection.");
      return;
    }
    
    const code = unlockCode.trim().toUpperCase();
    if (!["DPSS", "DPS", "BPS", "BPSS"].includes(code)) {
      alert("Please enter the correct unlock code (DPSS or BPS) below the library to delete templates.");
      return;
    }
    
    if (confirm("Are you sure you want to delete this template? This cannot be undone.")) {
      try {
        const isSystem = SYSTEM_TEMPLATES.some(t => t.id === templateId);
        if (isSystem) {
          alert("System templates cannot be permanently deleted from the source, but you can hide them or they will be removed from your view if we implemented hiding logic.");
          // For now, we just block system deletion but allow it for their own
          return;
        }
        await deleteDoc(doc(db, `templates`, templateId));
        fetchTemplates();
        alert("Template deleted successfully.");
      } catch (e) {
        console.error("Error deleting template:", e);
        alert("Failed to delete template.");
      }
    }
  };

  const handleDuplicateTemplate = async (template: {id: string, name: string, authorName: string, levels: Level[]}) => {
    if (!isFirebaseConfigured()) {
      alert("Duplicating templates in the shared library requires cloud connection.");
      return;
    }
    if (!user) {
      alert("Please sign in to duplicate templates.");
      return;
    }
    const code = prompt("Enter verification code to duplicate templates in the library:");
    if (!code || code.trim().toLowerCase() !== "dpss") {
      alert("Invalid verification code. You cannot duplicate templates in the library.");
      return;
    }
    
    try {
      const templateId = Math.random().toString(36).substring(2, 9);
      await setDoc(doc(db, `templates`, templateId), {
        name: template.name + ' (Copy)',
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Teacher',
        levels: template.levels
      });
      fetchTemplates();
      alert("Template duplicated successfully!");
    } catch (e) {
      console.error("Error duplicating template:", e);
      alert("Failed to duplicate template.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="flex items-center border-b border-slate-200">
          <div className="flex overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1">
            <button
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'level' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('level')}
            >
              Current Level
            </button>
            <button
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'guide' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('guide')}
            >
              Quick Guide
            </button>
            <button
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'grading' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('grading')}
            >
              Grading Style
            </button>
            <button
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'templates' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('templates')}
            >
              Templates & Sync
            </button>
            <button
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'appearance' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </button>
            <button
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'monitoring' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('monitoring')}
            >
              Teacher Monitoring
            </button>
            <button
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'backup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('backup')}
            >
              Backup & Restore
            </button>
            <button
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data' ? 'border-red-600 text-red-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('data')}
            >
              Data Management
            </button>
            <button
              className={`px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'account' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
          </div>
          <button onClick={onClose} className="p-4 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 relative">
          {activeTab === 'level' && (
             <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Level Profile Name
                    </label>
                    <input
                      type="text"
                      value={level.name}
                      onChange={(e) => {
                        onUpdateLevel({ ...level, name: e.target.value });
                      }}
                      className="text-lg font-bold text-slate-800 bg-transparent border-b border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors py-1 w-full max-w-md"
                      placeholder="e.g. Foundation 1"
                    />
                  </div>
                  {levels.length > 1 && (
                    <div className="flex items-center gap-2 self-start md:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete the level profile "${level.name}"? This cannot be undone.`)) {
                            const remaining = levels.filter(l => l.id !== level.id);
                            onReplaceLevels(remaining);
                            alert("Level deleted successfully!");
                          }
                        }}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 border border-red-100 shadow-sm cursor-pointer"
                        title="Delete this level profile"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Level
                      </button>
                    </div>
                  )}
                </div>
                
                <LevelSettings level={level} onUpdateLevel={onUpdateLevel} onClose={() => {}} hideHeader={true} />
             </div>
          )}

          {activeTab === 'guide' && (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-2">3. Quick Guide: How to Use the Weighting & Exam Inputs</h2>
                <p className="text-sm text-slate-500 mb-6">
                  When you expand a subject in the Level Settings, you will see these weight inputs. Here is exactly what they do and how to configure them:
                </p>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase text-xs font-bold border-b border-slate-200">
                        <th className="px-4 py-3 font-semibold">Input Field</th>
                        <th className="px-4 py-3 font-semibold">What it means</th>
                        <th className="px-4 py-3 font-semibold">How to use it</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30">Full %</td>
                        <td className="px-4 py-3">Subject Weight (Full Mode)</td>
                        <td className="px-4 py-3">The overall weight of this subject in the class profile when you are viewing the Full Year/Term mode (e.g., Math is 60%, Traffic Law is 5%, French is 35%). All subjects' Full % should sum up to 100%.</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30">Mid %</td>
                        <td className="px-4 py-3 text-blue-700 bg-blue-50/10">Subject Weight (Midterm View)</td>
                        <td className="px-4 py-3">The weight of this subject when you switch the table view specifically to Midterm Only.</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30">Final %</td>
                        <td className="px-4 py-3 text-purple-700 bg-purple-50/10">Subject Weight (Final View)</td>
                        <td className="px-4 py-3">The weight of this subject when you switch the table view specifically to Final Only.</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30">Mid Max</td>
                        <td className="px-4 py-3 text-blue-800 bg-blue-50/20">Midterm Exam Max Score</td>
                        <td className="px-4 py-3">The total maximum raw score for the Midterm Exam column (typically set to 100 or 50).</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30">Fin Max</td>
                        <td className="px-4 py-3 text-purple-800 bg-purple-50/20">Final Exam Max Score</td>
                        <td className="px-4 py-3">The total maximum raw score for the Final Exam column (typically set to 100 or 50).</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30">Full Mid %</td>
                        <td className="px-4 py-3 text-orange-700 bg-orange-50/10">Midterm Contribution (Full Mode)</td>
                        <td className="px-4 py-3">In Full Mode, this decides how much the student's Midterm score contributes to their final subject grade (typically set to 30%).</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap bg-slate-50/30">Full FN %</td>
                        <td className="px-4 py-3 text-teal-700 bg-teal-50/10">Final Contribution (Full Mode)</td>
                        <td className="px-4 py-3">In Full Mode, this decides how much the student's Final score contributes to their final subject grade (typically set to 70%).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                  <div className="flex gap-2 items-start">
                    <span className="text-xl">💡</span>
                    <div>
                      <h4 className="font-bold text-sm text-blue-950 uppercase tracking-wider">Simple Example:</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        If you want a student's final subject grade to be computed from <strong>30% Midterm</strong> and <strong>70% Final</strong>:
                      </p>
                      <ul className="list-disc list-inside text-xs text-blue-800 mt-2 space-y-1 pl-1">
                        <li>Set <strong>Full Mid %</strong> to <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">30</code></li>
                        <li>Set <strong>Full FN %</strong> to <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">70</code></li>
                      </ul>
                      <p className="text-sm text-blue-800 mt-3">
                        If they score <strong>100% on the Midterm</strong> and <strong>65.9% on the Final</strong>, their <strong>RESULT</strong> is automatically calculated as:
                      </p>
                      <div className="bg-white/80 p-3 rounded border border-blue-100 font-mono text-xs text-blue-900 mt-2 flex justify-center items-center">
                        (100% × 30%) + (65.9% × 70%) = 30 + 46.13 = <span className="font-bold text-blue-700 text-sm">76.13%</span>
                      </div>
                      <p className="text-xs text-blue-700/80 mt-2 italic">
                        This 76.13% then contributes its proportion of the Subject's weight (e.g. 25%) to their overall class total score.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-2">⚠️ Level Total Weight Warning</h3>
                <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <p>
                    <strong>What does "Level total weight is 25%" mean?</strong>
                  </p>
                  <p>
                    In this system, you define a <strong>Target Weight</strong> for each subject (e.g., Reading: 20%, Writing: 20%, etc.). 
                    The <strong>Level Total Weight</strong> is the sum of these target weights across ALL subjects in your current level profile.
                  </p>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="font-bold text-amber-900 mb-1">Standard Goal: 100%</p>
                    <p className="text-amber-800 text-xs">
                      Usually, you want your total subjects to add up to 100%. If you only have one subject worth 25% and nothing else, the system warns you because 75% of the student's total grade is "missing".
                    </p>
                  </div>
                  <p>
                    <strong>What if I put 20 or 25?</strong>
                    <br />
                    If you put 25 for Grammar, it means Grammar accounts for 25% of the student's overall grade. If you add 4 more subjects at 25% each, the total will be 100%, and the warning will disappear.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-2">❓ Handling Missed Quizzes & Absences</h3>
                <p className="text-sm text-slate-600 space-y-3 leading-relaxed">
                  <strong>How does the system calculate averages when a student misses a quiz?</strong>
                </p>
                <div className="mt-3 space-y-3 text-sm text-slate-600">
                  <p>
                    By default, any score cell left completely blank (marked as <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">-</code>) is <strong>ignored</strong> by the system. It does not count towards the earned points, but it also does not count towards the max possible score.
                  </p>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">Example: 5 Quizzes (Max 100 each)</span>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Student A</strong> does all 5 quizzes, scoring: <code className="text-slate-800">100, 100, 100, 50, 50</code>. Total = 400/500 = <span className="font-bold text-slate-900">80.0%</span></li>
                      <li><strong>Student B</strong> misses 2 quizzes and does only 3, scoring: <code className="text-slate-800">100, 100, 100, -, -</code>. Total = 300/300 = <span className="font-bold text-green-700">100.0%</span> (because empty quizzes are ignored).</li>
                    </ul>
                  </div>
                  <h4 className="font-bold text-slate-800 pt-2">How should I handle this?</h4>
                  <p>
                    If the student has an unexcused absence, you should manually enter <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-800">0</code> for the missed item so their average accurately penalizes them.
                  </p>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex gap-2.5 items-start mt-2">
                    <span className="text-lg">⭐</span>
                    <div>
                      <h5 className="font-bold text-amber-950 uppercase tracking-wider mb-1">New Auto-Option: Treat Blank/Unfilled Scores as 0%</h5>
                      <p className="text-amber-900 leading-relaxed">
                        To save you from forgetting to enter zeros, you can enable the brand-new <strong>"Treat Blank/Unfilled Scores as 0%"</strong> toggle in the <strong>Grading Style</strong> tab of these settings! When enabled, any empty grade cells will automatically count as a 0% in student grade averages instead of being ignored.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'grading' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Grading & Visual Style</h2>
                <p className="text-sm text-slate-500">Configure how colors and text appear in your grade table. These settings are specific to you.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl space-y-8">
                {/* Coloring Mode */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Coloring Mode</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'subject', name: 'By Subject', desc: 'Each subject has unique color' },
                      { id: 'category', name: 'By Category', desc: 'Same type (e.g. Homework) looks same' },
                      { id: 'monochrome', name: 'Monochrome', desc: 'Professional black & white' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => onUpdateSettings({ ...settings, colorMode: mode.id as any })}
                        className={`p-3 text-left rounded-lg border transition-all ${
                          settings.colorMode === mode.id 
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-100' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-sm font-bold text-slate-900">{mode.name}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">{mode.desc}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Color Density */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Color Density (Opacity)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'light', name: 'Light / Soft', desc: 'Subtle & elegant pastel' },
                      { id: 'medium', name: 'Medium / Normal', desc: 'Balanced standard colors' },
                      { id: 'dark', name: 'Dark / Strong', desc: 'Solid & bold distinction' }
                    ].map((density) => (
                      <button
                        key={density.id}
                        onClick={() => onUpdateSettings({ ...settings, colorDensity: density.id as any })}
                        className={`p-3 text-left rounded-lg border transition-all ${
                          settings.colorDensity === density.id 
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-100' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-sm font-bold text-slate-900">{density.name}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">{density.desc}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Global Grading Scales */}
                <section className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">Default Global Scales</label>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tight">Set global defaults for all classes</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-black uppercase">
                        <button
                          type="button"
                          onClick={() => setActiveScaleType('grade')}
                          className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${activeScaleType === 'grade' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Grade
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveScaleType('status')}
                          className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${activeScaleType === 'status' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Status
                        </button>
                      </div>
                      <div className="flex bg-slate-200 p-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-tight">
                        <button
                          type="button"
                          onClick={() => setActiveGradingTab('full')}
                          className={`px-3 py-1 rounded-md transition-all ${activeGradingTab === 'full' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Full Term
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveGradingTab('midterm')}
                          className={`px-3 py-1 rounded-md transition-all ${activeGradingTab === 'midterm' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Mid-term
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveGradingTab('final')}
                          className={`px-3 py-1 rounded-md transition-all ${activeGradingTab === 'final' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          Final Test
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 max-w-[70%]">
                        These are the global default scales. <strong>Class-specific</strong> scales in "Current Level" settings will override these.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAddGlobalScale(activeGradingTab)}
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-colors border ${
                          activeScaleType === 'status' ? 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100' : 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-50'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                        Add Range
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getScaleValues(activeGradingTab, activeScaleType).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-xs">
                          <input
                            type="text"
                            value={item.grade}
                            onChange={(e) => handleUpdateGlobalScale(activeGradingTab, idx, 'grade', e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-100 rounded px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="Grade Label"
                          />
                          <div className="w-16 relative">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={item.minScore}
                              onChange={(e) => handleUpdateGlobalScale(activeGradingTab, idx, 'minScore', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-100 rounded pl-2 pr-4 py-1 text-xs font-mono focus:ring-1 focus:ring-blue-500 outline-none text-right"
                            />
                            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">%</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveGlobalScale(activeGradingTab, idx)}
                            className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Header Text Styling */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Header Text Styling</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={settings.headerWeight === 'bold'}
                        onChange={(e) => onUpdateSettings({ ...settings, headerWeight: e.target.checked ? 'bold' : 'normal' })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Bold Headers</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={settings.headerItalic}
                        onChange={(e) => onUpdateSettings({ ...settings, headerItalic: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 italic">Italic Headers</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={settings.headerUppercase}
                        onChange={(e) => onUpdateSettings({ ...settings, headerUppercase: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">UPPERCASE</span>
                    </label>
                  </div>
                </section>

                {/* Table Layout */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Layout Preferences</label>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={settings.showCategoryHideIcon !== false}
                        onChange={(e) => onUpdateSettings({ ...settings, showCategoryHideIcon: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Show Category Hide Icon</span>
                        <span className="block text-xs text-slate-500">Show the eye slash icon to quickly hide categories</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={settings.showWeightInHeader}
                        onChange={(e) => onUpdateSettings({ ...settings, showWeightInHeader: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Show Weights in Header</span>
                        <span className="block text-xs text-slate-500">Display category weights (e.g. (30%)) in the column headers next to WTD</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={settings.completelyHideHiddenCategories}
                        onChange={(e) => onUpdateSettings({ ...settings, completelyHideHiddenCategories: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Completely Hide Categories</span>
                        <span className="block text-xs text-slate-500">Remove the hidden "eye icon" placeholder column when hiding a category</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={settings.rowIndent}
                        onChange={(e) => onUpdateSettings({ ...settings, rowIndent: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Student Row Indentation</span>
                        <span className="block text-xs text-slate-500">Adds spacing to the left of student names</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={settings.showPointsInResult}
                        onChange={(e) => onUpdateSettings({ ...settings, showPointsInResult: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Show Absolute Points in Result</span>
                        <span className="block text-xs text-slate-500">Display "Points / [Max]%" in addition to performance %</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={!!settings.treatBlanksAsZero}
                        onChange={(e) => onUpdateSettings({ ...settings, treatBlanksAsZero: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Treat Blank/Unfilled Scores as 0%</span>
                        <span className="block text-xs text-slate-500">If checked, empty gradebook cells will count as 0 in student averages instead of being ignored.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={settings.divideByAllSubjects !== false}
                        onChange={(e) => onUpdateSettings({ ...settings, divideByAllSubjects: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Calculate Average over All Subjects (MID/FINAL AVG)</span>
                        <span className="block text-xs text-slate-500">If checked, student average is divided by the total weight of all subjects in the level (unfilled subjects get 0%). If unchecked, average is computed only across subjects with scores.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={settings.hideWeightSymbol === true}
                        onChange={(e) => onUpdateSettings({ ...settings, hideWeightSymbol: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Compact Weight Labels (e.g. W40)</span>
                        <span className="block text-xs text-slate-500">Hide the % symbol and parentheses in weight column headers</span>
                      </div>
                    </label>

                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-blue-900 uppercase tracking-tight">Conditional Score Colors</label>
                        <button 
                          onClick={() => {
                            const newRules = [...(settings.conditionalFormatting || []), { id: Date.now().toString(), min: 0, max: 49, color: "#dc2626" }];
                            onUpdateSettings({ ...settings, conditionalFormatting: newRules });
                          }}
                          className="text-[10px] font-bold bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                        >
                          Add Rule
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {(settings.conditionalFormatting || []).map((rule, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded border border-blue-100">
                            <span className="text-[10px] font-bold text-slate-400">If % ≥</span>
                            <input 
                              type="number" 
                              value={rule.min} 
                              onChange={(e) => {
                                const newRules = [...settings.conditionalFormatting!];
                                newRules[idx].min = Number(e.target.value);
                                onUpdateSettings({ ...settings, conditionalFormatting: newRules });
                              }}
                              className="w-12 text-xs font-bold border rounded px-1"
                            />
                            <span className="text-[10px] font-bold text-slate-400">and ≤</span>
                            <input 
                              type="number" 
                              value={rule.max} 
                              onChange={(e) => {
                                const newRules = [...settings.conditionalFormatting!];
                                newRules[idx].max = Number(e.target.value);
                                onUpdateSettings({ ...settings, conditionalFormatting: newRules });
                              }}
                              className="w-12 text-xs font-bold border rounded px-1"
                            />
                            <span className="text-[10px] font-bold text-slate-400">Color:</span>
                            <input 
                              type="color" 
                              value={rule.color} 
                              onChange={(e) => {
                                const newRules = [...settings.conditionalFormatting!];
                                newRules[idx].color = e.target.value;
                                onUpdateSettings({ ...settings, conditionalFormatting: newRules });
                              }}
                              className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer"
                            />
                            <button 
                              onClick={() => {
                                const newRules = settings.conditionalFormatting!.filter((_, i) => i !== idx);
                                onUpdateSettings({ ...settings, conditionalFormatting: newRules });
                              }}
                              className="ml-auto text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        {(!settings.conditionalFormatting || settings.conditionalFormatting.length === 0) && (
                          <p className="text-[10px] text-slate-500 italic">No custom rules. Using system defaults (Red &lt; 50%, Blue ≥ 50%, Green ≥ 95%).</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Manual Color Configuration for Average & Result */}
                <section className="border-t border-slate-100 pt-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Manual Colors for Average & Result</label>
                  <p className="text-xs text-slate-500 mb-4">Choose if you want to display the Average and Result numbers in custom manually-selected colors or in standard black and white / theme colors.</p>
                  
                  {/* Live Preview Card */}
                  <div className="mb-6 p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-center justify-around gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Table Cell Preview:</span>
                    <div className="flex gap-6">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Average Column</span>
                        <div className={`px-4 py-2 rounded-md border text-sm font-bold shadow-sm transition-all text-center min-w-[5rem] ${
                          (settings.avgColorMode === 'manual')
                            ? `${MANUAL_COLORS.find(c => c.id === settings.avgBgColor)?.bgClass || 'bg-transparent'} ${MANUAL_COLORS.find(c => c.id === settings.avgTextColor)?.textClass || 'text-slate-900'} ${MANUAL_COLORS.find(c => c.id === settings.avgBgColor)?.borderClass || 'border-slate-200'}`
                            : 'bg-blue-50/50 text-blue-900 border-blue-200/40'
                        }`}>
                          92.4%
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Result Column</span>
                        <div className={`px-4 py-2 rounded-md border text-sm font-bold shadow-sm transition-all text-center min-w-[5rem] ${
                          (settings.resultColorMode === 'manual')
                            ? `${MANUAL_COLORS.find(c => c.id === settings.resultBgColor)?.bgClass || 'bg-transparent'} ${MANUAL_COLORS.find(c => c.id === settings.resultTextColor)?.textClass || 'text-slate-900'} ${MANUAL_COLORS.find(c => c.id === settings.resultBgColor)?.borderClass || 'border-slate-200'}`
                            : 'bg-blue-50/50 text-blue-900 border-blue-200/40'
                        }`}>
                          78.0
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Column</span>
                        <div className={`px-4 py-2 rounded-md border text-sm font-bold shadow-sm transition-all text-center min-w-[5rem] ${
                          (settings.totalColorMode === 'manual')
                            ? `${MANUAL_COLORS.find(c => c.id === settings.totalBgColor)?.bgClass || 'bg-transparent'} ${MANUAL_COLORS.find(c => c.id === settings.totalTextColor)?.textClass || 'text-slate-900'} ${MANUAL_COLORS.find(c => c.id === settings.totalBgColor)?.borderClass || 'border-slate-200'}`
                            : 'bg-blue-50/50 text-blue-900 border-blue-200/40'
                        }`}>
                          845
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Rank Column</span>
                        <div className={`px-4 py-2 rounded-md border text-sm font-bold shadow-sm transition-all text-center min-w-[5rem] ${
                          (settings.rankColorMode === 'manual')
                            ? `${MANUAL_COLORS.find(c => c.id === settings.rankBgColor)?.bgClass || 'bg-transparent'} ${MANUAL_COLORS.find(c => c.id === settings.rankTextColor)?.textClass || 'text-slate-900'} ${MANUAL_COLORS.find(c => c.id === settings.rankBgColor)?.borderClass || 'border-slate-200'}`
                            : 'bg-blue-50/50 text-blue-900 border-blue-200/40'
                        }`}>
                          1st
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Average Selector */}
                    <div className="bg-slate-50/30 p-4 rounded-xl border border-slate-200/60">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Average Score Style</h4>
                          <p className="text-[11px] text-slate-500">Applies to student final total averages.</p>
                        </div>
                        <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ ...settings, avgColorMode: 'auto' })}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${(!settings.avgColorMode || settings.avgColorMode === 'auto') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            Auto Theme
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ 
                              ...settings, 
                              avgColorMode: 'manual',
                              avgTextColor: settings.avgTextColor || 'black',
                              avgBgColor: settings.avgBgColor || 'white'
                            })}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${(settings.avgColorMode === 'manual') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            Manual
                          </button>
                        </div>
                      </div>

                      {settings.avgColorMode === 'manual' && (
                        <div className="space-y-4">
                          {/* Text Color */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Text Color (Select 1 of 12)</span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {MANUAL_COLORS.map((color) => (
                                <button
                                  key={`avg-text-${color.id}`}
                                  type="button"
                                  onClick={() => onUpdateSettings({ ...settings, avgTextColor: color.id })}
                                  className={`p-1.5 rounded-lg border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                                    (settings.avgTextColor || 'black') === color.id
                                      ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full ${color.bgClass} ${color.textClass} border ${color.borderClass} flex items-center justify-center text-[8px]`}>
                                    A
                                  </div>
                                  <span className="text-[9px] text-slate-700 font-medium">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Background Color */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Background Color (Select 1 of 12)</span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {MANUAL_COLORS.map((color) => (
                                <button
                                  key={`avg-bg-${color.id}`}
                                  type="button"
                                  onClick={() => onUpdateSettings({ ...settings, avgBgColor: color.id })}
                                  className={`p-1.5 rounded-lg border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                                    (settings.avgBgColor || 'white') === color.id
                                      ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded ${color.bgClass} border ${color.borderClass}`} />
                                  <span className="text-[9px] text-slate-700 font-medium">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Result Selector */}
                    <div className="bg-slate-50/30 p-4 rounded-xl border border-slate-200/60">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Result Score Style</h4>
                          <p className="text-[11px] text-slate-500">Applies to subject computed result numbers.</p>
                        </div>
                        <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ ...settings, resultColorMode: 'auto' })}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${(!settings.resultColorMode || settings.resultColorMode === 'auto') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            Auto Theme
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ 
                              ...settings, 
                              resultColorMode: 'manual',
                              resultTextColor: settings.resultTextColor || 'black',
                              resultBgColor: settings.resultBgColor || 'white'
                            })}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${(settings.resultColorMode === 'manual') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            Manual
                          </button>
                        </div>
                      </div>

                      {settings.resultColorMode === 'manual' && (
                        <div className="space-y-4">
                          {/* Text Color */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Text Color (Select 1 of 12)</span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {MANUAL_COLORS.map((color) => (
                                <button
                                  key={`result-text-${color.id}`}
                                  type="button"
                                  onClick={() => onUpdateSettings({ ...settings, resultTextColor: color.id })}
                                  className={`p-1.5 rounded-lg border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                                    (settings.resultTextColor || 'black') === color.id
                                      ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full ${color.bgClass} ${color.textClass} border ${color.borderClass} flex items-center justify-center text-[8px]`}>
                                    A
                                  </div>
                                  <span className="text-[9px] text-slate-700 font-medium">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Background Color */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Background Color (Select 1 of 12)</span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {MANUAL_COLORS.map((color) => (
                                <button
                                  key={`result-bg-${color.id}`}
                                  type="button"
                                  onClick={() => onUpdateSettings({ ...settings, resultBgColor: color.id })}
                                  className={`p-1.5 rounded-lg border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                                    (settings.resultBgColor || 'white') === color.id
                                      ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded ${color.bgClass} border ${color.borderClass}`} />
                                  <span className="text-[9px] text-slate-700 font-medium">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Total Selector */}
                    <div className="bg-slate-50/30 p-4 rounded-xl border border-slate-200/60">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Total Score Style</h4>
                          <p className="text-[11px] text-slate-500">Applies to grand total score numbers.</p>
                        </div>
                        <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ ...settings, totalColorMode: 'auto' })}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${(!settings.totalColorMode || settings.totalColorMode === 'auto') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            Auto Theme
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ 
                              ...settings, 
                              totalColorMode: 'manual',
                              totalTextColor: settings.totalTextColor || 'black',
                              totalBgColor: settings.totalBgColor || 'white'
                            })}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${(settings.totalColorMode === 'manual') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            Manual
                          </button>
                        </div>
                      </div>

                      {settings.totalColorMode === 'manual' && (
                        <div className="space-y-4">
                          {/* Text Color */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Text Color (Select 1 of 12)</span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {MANUAL_COLORS.map((color) => (
                                <button
                                  key={`total-text-${color.id}`}
                                  type="button"
                                  onClick={() => onUpdateSettings({ ...settings, totalTextColor: color.id })}
                                  className={`p-1.5 rounded-lg border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                                    (settings.totalTextColor || 'black') === color.id
                                      ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full ${color.bgClass} ${color.textClass} border ${color.borderClass} flex items-center justify-center text-[8px]`}>
                                    A
                                  </div>
                                  <span className="text-[9px] text-slate-700 font-medium">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Background Color */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Background Color (Select 1 of 12)</span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {MANUAL_COLORS.map((color) => (
                                <button
                                  key={`total-bg-${color.id}`}
                                  type="button"
                                  onClick={() => onUpdateSettings({ ...settings, totalBgColor: color.id })}
                                  className={`p-1.5 rounded-lg border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                                    (settings.totalBgColor || 'white') === color.id
                                      ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded ${color.bgClass} border ${color.borderClass}`} />
                                  <span className="text-[9px] text-slate-700 font-medium">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Rank Selector */}
                    <div className="bg-slate-50/30 p-4 rounded-xl border border-slate-200/60">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800">Rank Display Style</h4>
                          <p className="text-[11px] text-slate-500">Applies to student rank indicators.</p>
                        </div>
                        <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ ...settings, rankColorMode: 'auto' })}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${(!settings.rankColorMode || settings.rankColorMode === 'auto') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            Auto Theme
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ 
                              ...settings, 
                              rankColorMode: 'manual',
                              rankTextColor: settings.rankTextColor || 'black',
                              rankBgColor: settings.rankBgColor || 'white'
                            })}
                            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${(settings.rankColorMode === 'manual') ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                          >
                            Manual
                          </button>
                        </div>
                      </div>

                      {settings.rankColorMode === 'manual' && (
                        <div className="space-y-4">
                          {/* Text Color */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Text Color (Select 1 of 12)</span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {MANUAL_COLORS.map((color) => (
                                <button
                                  key={`rank-text-${color.id}`}
                                  type="button"
                                  onClick={() => onUpdateSettings({ ...settings, rankTextColor: color.id })}
                                  className={`p-1.5 rounded-lg border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                                    (settings.rankTextColor || 'black') === color.id
                                      ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full ${color.bgClass} ${color.textClass} border ${color.borderClass} flex items-center justify-center text-[8px]`}>
                                    A
                                  </div>
                                  <span className="text-[9px] text-slate-700 font-medium">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Background Color */}
                          <div>
                            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Background Color (Select 1 of 12)</span>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                              {MANUAL_COLORS.map((color) => (
                                <button
                                  key={`rank-bg-${color.id}`}
                                  type="button"
                                  onClick={() => onUpdateSettings({ ...settings, rankBgColor: color.id })}
                                  className={`p-1.5 rounded-lg border text-center transition-all text-xs font-bold flex flex-col items-center gap-1 cursor-pointer ${
                                    (settings.rankBgColor || 'white') === color.id
                                      ? 'border-blue-500 ring-2 ring-blue-100 bg-white'
                                      : 'border-slate-200 bg-white hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded ${color.bgClass} border ${color.borderClass}`} />
                                  <span className="text-[9px] text-slate-700 font-medium">{color.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Excel Export Styles */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Excel Export Visual Style</label>
                  <p className="text-xs text-slate-500 mb-3">Choose the default color theme used when exporting your data to Microsoft Excel.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 1, name: 'Standard Blue', color: 'bg-blue-600' },
                      { id: 2, name: 'Grayscale', color: 'bg-slate-700' },
                      { id: 3, name: 'Professional Green', color: 'bg-emerald-600' },
                      { id: 4, name: 'Vibrant Purple', color: 'bg-purple-600' },
                      { id: 5, name: 'High Contrast Dark', color: 'bg-black' },
                      { id: 6, name: 'DPS Corporate Navy', color: 'bg-blue-900' },
                      { id: 7, name: 'Warm Orange', color: 'bg-orange-600' },
                      { id: 8, name: 'Sky Blue', color: 'bg-sky-500' },
                      { id: 9, name: 'Rose Pink', color: 'bg-pink-500' },
                      { id: 10, name: 'Amber Gold', color: 'bg-amber-500' },
                      { id: 11, name: 'Teal', color: 'bg-teal-600' },
                      { id: 12, name: 'Slate Dark', color: 'bg-slate-800' }
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => onUpdateSettings({ ...settings, excelStyleIndex: style.id })}
                        className={`p-2 text-left rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                          (settings.excelStyleIndex ?? 6) === style.id 
                            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-200' 
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${style.color} shrink-0 shadow-sm`} />
                        <span className="text-[10px] font-bold text-slate-800 leading-tight">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Excel Grid Lines */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Excel Grid Line Thickness</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'none', name: 'None' },
                      { id: 'light', name: 'Hairline' },
                      { id: 'medium', name: 'Thin' },
                      { id: 'heavy', name: 'Thick' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => onUpdateSettings({ ...settings, excelGridLineLevel: mode.id as any })}
                        className={`p-2 text-center rounded-lg border transition-all cursor-pointer ${
                          (settings.excelGridLineLevel ?? 'medium') === mode.id 
                            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-200' 
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">{mode.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Daily Attendance */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Daily Attendance Tracking</label>
                  <p className="text-xs text-slate-500 mb-3">Configure the number of daily attendance sessions (e.g. 2 for Full Time with morning and afternoon sessions).</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 0, name: 'None', desc: 'No daily tracking toggles' },
                      { id: 1, name: '1 Session', desc: 'One attendance toggle per day' },
                      { id: 2, name: '2 Sessions', desc: 'Two attendance toggles per day' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => onUpdateSettings({ ...settings, dailySessions: mode.id as 1 | 2 })}
                        className={`p-3 text-left rounded-lg border transition-all cursor-pointer ${
                          (settings.dailySessions ?? 1) === mode.id 
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-100' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="block text-sm font-bold text-slate-900">{mode.name}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">{mode.desc}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={settings.showAttendance !== false}
                        onChange={(e) => onUpdateSettings({ ...settings, showAttendance: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Show Attendance Tracking</span>
                        <span className="block text-xs text-slate-500">Enable the full attendance tracker view</span>
                      </div>
                    </label>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Work Days Configuration</label>
                      <select 
                        value={settings.attendanceDaysOfWeek || 'Mon-Fri'}
                        onChange={(e) => onUpdateSettings({ ...settings, attendanceDaysOfWeek: e.target.value as any })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="Mon-Fri">Monday - Friday</option>
                        <option value="Mon-Sat">Monday - Saturday</option>
                        <option value="Mon-Sun">Monday - Sunday</option>
                      </select>
                      <p className="text-[10px] text-slate-500 mt-1">Select which days students are expected to attend.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Absence (A) Penalty</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={settings.attendanceAbsencePenalty ?? 1}
                        onChange={(e) => onUpdateSettings({ ...settings, attendanceAbsencePenalty: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Points deducted from ATTND % for each Absence.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Permission (P) Penalty</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={settings.attendancePermissionPenalty ?? 0.25}
                        onChange={(e) => onUpdateSettings({ ...settings, attendancePermissionPenalty: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">Points deducted from ATTND % for each Permission.</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                      <input 
                        type="date" 
                        value={settings.attendanceStartDate || ''}
                        onChange={(e) => onUpdateSettings({ ...settings, attendanceStartDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                      <input 
                        type="date" 
                        value={settings.attendanceEndDate || ''}
                        onChange={(e) => onUpdateSettings({ ...settings, attendanceEndDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {settings.dailySessions === 2 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">S1 Label (Teacher 1)</label>
                        <input 
                          type="text" 
                          value={settings.attendanceS1Label || 'S1'}
                          onChange={(e) => onUpdateSettings({ ...settings, attendanceS1Label: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="S1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">S2 Label (Teacher 2)</label>
                        <input 
                          type="text" 
                          value={settings.attendanceS2Label || 'S2'}
                          onChange={(e) => onUpdateSettings({ ...settings, attendanceS2Label: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="S2"
                        />
                      </div>
                    </div>
                  )}
                </section>

                {/* Hide / Unhide Style */}
                <section>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Regular Category Columns (Quiz, Homework, etc.)</label>
                  <p className="text-xs text-slate-500 mb-3">Choose which information columns to show inside each regular category group.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Show Scores</span>
                        <span className="block text-[10px] text-slate-500">Individual raw inputs</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.showScoreColumns}
                        onChange={(e) => onUpdateSettings({ ...settings, showScoreColumns: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Show AVG (%)</span>
                        <span className="block text-[10px] text-slate-500">Raw average %</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.showAvgColumns}
                        onChange={(e) => onUpdateSettings({ ...settings, showAvgColumns: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Show WTD (%)</span>
                        <span className="block text-[10px] text-slate-500">Weighted result %</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.showWtdColumns}
                        onChange={(e) => onUpdateSettings({ ...settings, showWtdColumns: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Hide Student Names</span>
                        <span className="block text-[10px] text-slate-500">Hide or anonymize names</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.hideStudentNames}
                        onChange={(e) => onUpdateSettings({ ...settings, hideStudentNames: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Exam Columns in "Termly Result" Mode</label>
                    <p className="text-xs text-slate-500 mb-3">Choose which exam columns (Midterm & Final) to display when viewing the Termly Result.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                        <div>
                          <span className="block text-sm font-bold text-slate-900">Show Exam AVG (%)</span>
                          <span className="block text-[10px] text-slate-500">Raw average for Midterm/Final</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={settings.showExamAvgColumnsFullMode !== false}
                          onChange={(e) => onUpdateSettings({ ...settings, showExamAvgColumnsFullMode: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                        <div>
                          <span className="block text-sm font-bold text-slate-900">Show Exam WTD (%)</span>
                          <span className="block text-[10px] text-slate-500">Weighted result for Midterm/Final</span>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={settings.showExamWtdColumnsFullMode !== false}
                          onChange={(e) => onUpdateSettings({ ...settings, showExamWtdColumnsFullMode: e.target.checked })}
                          className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-3">
                    <span className="block text-[11px] font-bold text-blue-800 uppercase tracking-wider">When Hiding a Category (Dropdown in Grade Table Headers):</span>
                    <p className="text-[11px] text-blue-600">You can hide individual category items to save table space, while still displaying their computed summaries:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <label className="flex items-start gap-3 cursor-pointer hover:bg-white/40 p-1.5 rounded-lg transition-colors">
                        <input 
                          type="checkbox" 
                          checked={!!settings.keepAvgOnHide}
                          onChange={(e) => onUpdateSettings({ ...settings, keepAvgOnHide: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-900">Keep "Average" Column</span>
                          <span className="block text-[10px] text-slate-500">Hides raw item columns but keeps the Average column visible.</span>
                        </div>
                      </label>
                      
                      <label className="flex items-start gap-3 cursor-pointer hover:bg-white/40 p-1.5 rounded-lg transition-colors">
                        <input 
                          type="checkbox" 
                          checked={!!settings.keepWtdOnHide}
                          onChange={(e) => onUpdateSettings({ ...settings, keepWtdOnHide: e.target.checked })}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-900">Keep "WTD" Column</span>
                          <span className="block text-[10px] text-slate-500">Hides raw item columns but keeps the Weighted (WTD) column visible.</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="p-6">
              {!isFirebaseConfigured() && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 space-y-1">
                  <span className="block text-sm font-bold uppercase tracking-wide">Offline Local Mode Active</span>
                  <p className="text-xs text-amber-700">
                    The shared community templates library is currently disabled because Firebase cloud setup is not completed or was declined.
                    However, you can still duplicate, design, and manage class profiles fully offline! All your work remains safe on this local device.
                  </p>
                </div>
              )}
              {editingTemplate ? (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Editing Template: {editingTemplate.name}</h2>
                      <p className="text-sm text-slate-500">Changes will be saved to your template library.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setEditingTemplate(null)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveEditedTemplate}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                  <LevelSettings 
                    level={editingTemplate.levels[0]} 
                    onUpdateLevel={(newLevel) => {
                      setEditingTemplate({
                        ...editingTemplate,
                        levels: [newLevel, ...editingTemplate.levels.slice(1)]
                      });
                    }} 
                    onClose={() => setEditingTemplate(null)} 
                    hideHeader={true} 
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">Templates Library</h2>
                      <p className="text-sm text-slate-500">Save your full level structures to the community library, or load existing ones.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {user && (
                        <button 
                          onClick={async () => {
                            const templateName = prompt("Enter a name for this new template (based on current class):", `${level.name} Template`);
                            if (!templateName) return;
                            
                            try {
                              const templateId = Math.random().toString(36).substring(2, 9);
                              await setDoc(doc(db, `templates`, templateId), {
                                name: templateName,
                                authorId: user.uid,
                                authorName: user.displayName || user.email || 'Teacher',
                                levels: [level]
                              });
                              fetchTemplates();
                              alert("Current class saved as a template successfully!");
                            } catch (e) {
                              console.error("Error saving current class as template:", e);
                              alert("Failed to save template.");
                            }
                          }} 
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
                        >
                          <Save className="w-4 h-4" />
                          Save Current Class as Template
                        </button>
                      )}
                      {onOpenTemplateModal && (
                        <button onClick={() => { onOpenTemplateModal(); onClose(); }} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium shadow-sm">
                          <Copy className="w-4 h-4" />
                          Use Class as Template
                        </button>
                      )}
                      {user ? (
                        <button onClick={handleSaveTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
                          <Save className="w-4 h-4" />
                          Save All My Levels as Template
                        </button>
                      ) : (
                        <button onClick={() => setActiveTab('account')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium border border-slate-200 shadow-sm">
                          <User className="w-4 h-4" />
                          Sign In to Save Templates
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-6">
                    {!selectedProgramId ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {SYSTEM_TEMPLATES.filter(p => p.levels.length > 0).map((program) => (
                          <button
                            key={program.id}
                            onClick={() => setSelectedProgramId(program.id)}
                            className="group bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-6"
                          >
                            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                              <Database className="w-10 h-10" />
                            </div>
                            <div>
                              <div className="flex items-center justify-center gap-2 mb-1">
                                <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-700 transition-colors">{program.name}</h3>
                                {program.isAdmin && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded border border-amber-200 tracking-tighter">Admin</span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500 mt-2 font-medium">{program.levels.length} levels available</p>
                            </div>
                            <div className="mt-4 px-6 py-2 bg-slate-50 rounded-full text-blue-600 text-xs font-bold uppercase tracking-wider group-hover:bg-blue-50 transition-colors">
                              Select Program
                            </div>
                          </button>
                        ))}

                        {savedTemplates.length > 0 && (
                          <button
                            onClick={() => setSelectedProgramId('saved')}
                            className="group bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-400 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center gap-6"
                          >
                            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                              <User className="w-10 h-10" />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-slate-800 group-hover:text-indigo-700 transition-colors">My Saved Library</h3>
                              <p className="text-sm text-slate-500 mt-2 font-medium">{savedTemplates.length} templates configured</p>
                            </div>
                            <div className="mt-4 px-6 py-2 bg-slate-50 rounded-full text-indigo-600 text-xs font-bold uppercase tracking-wider group-hover:bg-indigo-50 transition-colors">
                              View My Templates
                            </div>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedProgramId(null)}
                              className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-500 hover:text-blue-600 transition-all flex items-center gap-2 font-bold text-sm"
                            >
                              <Plus className="w-4 h-4 rotate-45" /> Back to Programs
                            </button>
                            <div className="h-6 w-px bg-slate-200" />
                            <h3 className="text-lg font-black text-slate-800">
                              {selectedProgramId === 'saved' ? 'My Saved Templates' : SYSTEM_TEMPLATES.find(p => p.id === selectedProgramId)?.name}
                            </h3>
                          </div>
                          <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-400 uppercase tracking-tighter border border-slate-200">
                            {selectedProgramId === 'saved' ? `${savedTemplates.length} items` : `${SYSTEM_TEMPLATES.find(p => p.id === selectedProgramId)?.levels.length} items`}
                          </span>
                        </div>

                        {selectedProgramId === 'saved' ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedTemplates.map(template => (
                              <div key={template.id} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="p-3 bg-indigo-50 rounded-xl shrink-0 group-hover:bg-indigo-100 transition-colors">
                                    <User className="w-6 h-6 text-indigo-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 truncate">
                                        <h4 className="font-bold text-slate-800 text-lg truncate leading-tight group-hover:text-indigo-700 transition-colors" title={template.name}>{template.name}</h4>
                                        {template.isAdmin && (
                                          <span className="shrink-0 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded border border-amber-200 tracking-tighter">Admin</span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button 
                                          onClick={() => handleRenameTemplate(template.id, (template as any).authorId, template.name)}
                                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Rename"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteTemplate(template.id, (template as any).authorId)}
                                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">{template.levels.length} levels configured</p>
                                  </div>
                                </div>
                                <div className="mt-auto pt-5 border-t border-slate-50 flex flex-col gap-2">
                                  <button 
                                    onClick={() => handleApplyToCurrentLevel(template.levels)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm shadow-indigo-200"
                                  >
                                    <Copy className="w-4 h-4" /> Apply to Class
                                  </button>
                                  {user && user.uid === (template as any).authorId && (
                                    <button 
                                      onClick={() => setEditingTemplate(template as any)}
                                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 active:scale-95 transition-all"
                                    >
                                      <Edit2 className="w-4 h-4" /> Edit Details
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(SYSTEM_TEMPLATES.find(p => p.id === selectedProgramId)?.levels || []).map((lvl) => (
                              <div key={lvl.id} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col">
                                <div className="flex items-start gap-4 mb-6">
                                  <div className="p-3 bg-blue-50 rounded-xl shrink-0 group-hover:bg-blue-100 transition-colors">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 truncate">
                                        <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-blue-700 transition-colors">{lvl.name}</h4>
                                        {SYSTEM_TEMPLATES.find(p => p.id === selectedProgramId)?.isAdmin && (
                                          <span className="shrink-0 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded border border-amber-200 tracking-tighter">Admin</span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRenameTemplate(lvl.id, 'system', lvl.name);
                                          }}
                                          className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                          title="Rename System Template"
                                        >
                                          <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTemplate(lvl.id, 'system');
                                          }}
                                          className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          title="Delete System Template"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1.5 font-medium flex items-center gap-2">
                                      <span className="px-1.5 py-0.5 bg-slate-100 rounded">{lvl.subjects.length} Subjects</span>
                                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                      <span>{lvl.subjects.reduce((acc, s) => acc + s.categories.length, 0)} Categories</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-auto pt-5 border-t border-slate-50 flex flex-col gap-2">
                                  <button 
                                    onClick={() => handleApplyToCurrentLevel([lvl])}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200"
                                  >
                                    <Copy className="w-4 h-4" /> Apply to Class
                                  </button>
                                  <button 
                                    onClick={() => handleDuplicateTemplate({
                                      id: `${selectedProgramId}_${lvl.id}_${Date.now()}`,
                                      name: `${lvl.name} Template`,
                                      authorName: 'System',
                                      levels: [lvl]
                                    })}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all"
                                  >
                                    <Copy className="w-4 h-4" /> Copy to My Library
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Unlock Code Section */}
                        <div className="mt-12 pt-8 border-t border-slate-200 max-w-md mx-auto text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                            <Lock className="w-3 h-3" />
                            Admin Template Management
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mb-2">Enter Unlock Code to Manage Library</h4>
                          <p className="text-xs text-slate-500 mb-4">Enter the DPS authorization code to rename or delete templates directly from the library.</p>
                          <div className="flex gap-2 max-w-xs mx-auto">
                            <input 
                              type="password"
                              value={unlockCode}
                              onChange={(e) => {
                                const val = e.target.value;
                                setUnlockCode(val);
                                localStorage.setItem("gradecalc_unlock_code", val);
                              }}
                              placeholder="Enter Code (e.g. DPSS or BPS)"
                              className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-center font-mono tracking-widest"
                            />
                          </div>
                          {["DPSS", "DPS", "BPS", "BPSS"].includes(unlockCode.trim().toUpperCase()) && (
                            <p className="mt-2 text-[10px] font-bold text-green-600 uppercase animate-pulse">✓ Library Unlocked - Administrative Access Granted</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
              </>
              )}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="p-6 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Layout & Branding</h3>
                  <p className="text-sm text-slate-500">Customize the background and header colors of your application.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">App Header Background</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <input 
                        type="color" 
                        value={settings.headerBgColor || '#ffffff'} 
                        onChange={(e) => onUpdateSettings({ ...settings, headerBgColor: e.target.value })}
                        className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                      />
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={settings.headerBgColor || '#ffffff'} 
                          onChange={(e) => onUpdateSettings({ ...settings, headerBgColor: e.target.value })}
                          className="w-full text-sm font-mono font-bold bg-transparent border-b border-slate-200 focus:outline-none"
                        />
                        <p className="text-[10px] text-slate-500 mt-1 italic">Choose a background color for the top info header.</p>
                      </div>
                      <button 
                        onClick={() => onUpdateSettings({ ...settings, headerBgColor: '#ffffff' })}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Excel Header Background</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
                      <input 
                        type="color" 
                        value={settings.excelHeaderColor || '#000000'} 
                        onChange={(e) => onUpdateSettings({ ...settings, excelHeaderColor: e.target.value })}
                        className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                      />
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={settings.excelHeaderColor || '#000000'} 
                          onChange={(e) => onUpdateSettings({ ...settings, excelHeaderColor: e.target.value })}
                          className="w-full text-sm font-mono font-bold bg-transparent border-b border-slate-200 focus:outline-none"
                        />
                        <p className="text-[10px] text-slate-500 mt-1 italic">Fixes "Dark Excel" issue. Choose a lighter color if needed.</p>
                      </div>
                      <button 
                        onClick={() => onUpdateSettings({ ...settings, excelHeaderColor: '#000000' })}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Appearance</h2>
                <p className="text-sm text-slate-500">Customize the look and feel of your workspace. These options are saved locally for you and do not affect other collaborators.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Interface Font</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        document.documentElement.style.setProperty('--font-sans', e.target.value);
                      }}
                      defaultValue="Inter, sans-serif"
                    >
                      <option value="Inter, sans-serif">Inter (Default)</option>
                      <option value="system-ui, sans-serif">System Default</option>
                      <option value="'Comic Sans MS', cursive, sans-serif">Comic Sans (Fun)</option>
                      <option value="'Times New Roman', serif">Times New Roman (Formal)</option>
                      <option value="'Space Grotesk', sans-serif">Space Grotesk (Modern)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                    <div>
                      <label className="block text-sm font-bold text-slate-800">Show Individual Score Columns</label>
                      <p className="text-[11px] text-slate-500">Hide these to see only weighted averages and save horizontal space.</p>
                    </div>
                    <button
                      onClick={() => onUpdateSettings({ ...settings, showScoreColumns: !settings.showScoreColumns })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.showScoreColumns !== false ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.showScoreColumns !== false ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                    <div>
                      <label className="block text-sm font-bold text-slate-800">Hide System Templates</label>
                      <p className="text-[11px] text-slate-500">Hide the built-in program library and only show your own saved templates.</p>
                    </div>
                    <button
                      onClick={() => onUpdateSettings({ ...settings, hideSystemTemplates: !settings.hideSystemTemplates })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.hideSystemTemplates ? 'bg-purple-600' : 'bg-slate-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.hideSystemTemplates ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Paper Style (20 options)</label>
                    <p className="text-xs text-slate-500 mb-2">Sets the background texture and style of the student grades table sheet.</p>
                    <select 
                      value={paperStyle}
                      onChange={(e) => onUpdatePaperStyle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    >
                      {PAPER_STYLES.map(style => (
                        <option key={style.id} value={style.id}>{style.name}</option>
                      ))}
                    </select>
                    
                    {/* Preview of current paper style */}
                    {(() => {
                      const currentStyle = PAPER_STYLES.find(p => p.id === paperStyle) || PAPER_STYLES[0];
                      return (
                        <div 
                          className={`p-4 rounded-lg border text-sm flex flex-col justify-center items-center h-16 shadow-inner ${currentStyle.bgClass} ${currentStyle.borderClass} ${currentStyle.textClass}`}
                          style={currentStyle.customStyle}
                        >
                          <span className="font-semibold">Sample Paper Texture</span>
                          <span className="text-xs opacity-85">Grid lines or dots appear here.</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Wallpaper Background (20 options)</label>
                    <p className="text-xs text-slate-500 mb-2">Sets the outer background color of the website. Soft colors keep text clearly visible.</p>
                    <select 
                      value={wallpaper}
                      onChange={(e) => onUpdateWallpaper(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    >
                      {WALLPAPERS.map(wp => (
                        <option key={wp.id} value={wp.id}>{wp.name}</option>
                      ))}
                    </select>

                    {/* Preview of current wallpaper background */}
                    {(() => {
                      const currentWp = WALLPAPERS.find(w => w.id === wallpaper) || WALLPAPERS[0];
                      return (
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">Live background color:</span>
                          <div className={`w-6 h-6 rounded border border-slate-300 shadow-sm ${currentWp.bgClass}`}></div>
                          <span className="text-xs font-semibold text-slate-700">{currentWp.name}</span>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Table Grid Line Intensity (4 options)</label>
                    <p className="text-xs text-slate-500 mb-2.5">Choose the line level thickness and dark contrast to see cells clearly. Perfect for large screens.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'light', name: 'Light / Thin', desc: 'Subtle lines' },
                        { id: 'medium', name: 'Medium / Classic', desc: 'Default standard' },
                        { id: 'bold', name: 'Bold / Distinct', desc: 'Darker borders' },
                        { id: 'black', name: 'Black / Contrast', desc: 'Maximum clarity' }
                      ].map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => onUpdateGridLineLevel(g.id)}
                          className={`px-2.5 py-2 text-left rounded-lg border transition-all cursor-pointer ${
                            gridLineLevel === g.id
                              ? 'bg-blue-50/70 border-blue-500 text-blue-900 ring-2 ring-blue-100'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="block text-xs font-bold">{g.name}</span>
                          <span className="block text-[10px] opacity-75">{g.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Filled Score Text Color</label>
                    <p className="text-xs text-slate-500 mb-2.5">Choose the font color for student scores filled in the table. Note this applies to individual teachers.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: 'black', name: 'Black (Default)', colorClass: 'text-slate-900', dotBg: 'bg-slate-900' },
                        { id: 'red', name: 'Red', colorClass: 'text-red-600', dotBg: 'bg-red-600' },
                        { id: 'blue', name: 'Blue', colorClass: 'text-blue-600', dotBg: 'bg-blue-600' },
                        { id: 'green', name: 'Green', colorClass: 'text-green-600', dotBg: 'bg-green-600' },
                        { id: 'purple', name: 'Purple', colorClass: 'text-purple-600', dotBg: 'bg-purple-600' },
                      ].map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => onUpdateSettings({ ...settings, scoreColor: c.id as any })}
                          className={`flex items-center gap-2 px-2.5 py-2 text-left rounded-lg border transition-all cursor-pointer ${
                            (settings.scoreColor || 'black') === c.id
                              ? 'bg-blue-50/70 border-blue-500 text-blue-900 ring-2 ring-blue-100'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full ${c.dotBg}`}></div>
                          <span className={`block text-xs font-bold ${c.colorClass}`}>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual Average and Result Colors customization */}
                  <div className="pt-6 border-t border-slate-100 space-y-6">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Average & Result Color Customization</h4>
                    
                    {/* Average Score Color */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-xs font-black text-slate-700 uppercase">Average Score Color Mode</label>
                          <span className="block text-[10px] text-slate-500">Choose whether to color average numbers automatically or select manually.</span>
                        </div>
                        <select
                          value={settings.avgColorMode || 'auto'}
                          onChange={(e) => onUpdateSettings({ ...settings, avgColorMode: e.target.value as any })}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="auto">Auto (Theme Colored)</option>
                          <option value="manual">Manual Selection</option>
                        </select>
                      </div>

                      {(settings.avgColorMode === 'manual') && (
                        <div className="space-y-2 pt-2 border-t border-slate-200/50">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Select Manual Color (12 options)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {MANUAL_COLORS.map((color) => (
                              <button
                                key={color.id}
                                type="button"
                                onClick={() => onUpdateSettings({ ...settings, avgTextColor: color.textClass, avgBgColor: color.bgClass })}
                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                  settings.avgBgColor === color.bgClass
                                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-100'
                                    : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <span className={`px-1.5 py-0.5 rounded ${color.bgClass} ${color.textClass} border border-slate-300`}>
                                  98.5
                                </span>
                                <span className="text-slate-600 truncate">{color.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Result Letter Grade Color */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-xs font-black text-slate-700 uppercase">Result / Status Color Mode</label>
                          <span className="block text-[10px] text-slate-500">Choose whether to color student status cards automatically or select manually.</span>
                        </div>
                        <select
                          value={settings.resultColorMode || 'auto'}
                          onChange={(e) => onUpdateSettings({ ...settings, resultColorMode: e.target.value as any })}
                          className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none"
                        >
                          <option value="auto">Auto (Theme Colored)</option>
                          <option value="manual">Manual Selection</option>
                        </select>
                      </div>

                      {(settings.resultColorMode === 'manual') && (
                        <div className="space-y-2 pt-2 border-t border-slate-200/50">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Select Manual Color (12 options)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {MANUAL_COLORS.map((color) => (
                              <button
                                key={color.id}
                                type="button"
                                onClick={() => onUpdateSettings({ ...settings, resultTextColor: color.textClass, resultBgColor: color.bgClass })}
                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                  settings.resultBgColor === color.bgClass
                                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-100'
                                    : 'bg-white border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                <span className={`px-1.5 py-0.5 rounded ${color.bgClass} ${color.textClass} border border-slate-300`}>
                                  Pass
                                </span>
                                <span className="text-slate-600 truncate">{color.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Teacher Monitoring & Alerts</h2>
                <p className="text-sm text-slate-500">Configure alert thresholds to carefully monitor if teachers are updating quiz scores and daily attendance on time.</p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-2xl space-y-6">
                {/* Quiz Monitoring */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Quiz Score Entry Alert</h4>
                      <p className="text-xs text-slate-500">Show a notification alert if no quiz scores are filled for the specified duration.</p>
                    </div>
                  </div>
                  <select 
                    value={settings.quizNoScoreDays ?? (settings.quizNoScoreWeeks ? settings.quizNoScoreWeeks * 7 : 0)}
                    onChange={(e) => onUpdateSettings({ ...settings, quizNoScoreDays: Number(e.target.value), quizNoScoreWeeks: 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Disabled (Do not notify)</option>
                    <option value={2}>Show alert if blank for 2 days</option>
                    <option value={3}>Show alert if blank for 3 days</option>
                    <option value={4}>Show alert if blank for 4 days</option>
                    <option value={5}>Show alert if blank for 5 days</option>
                    <option value={6}>Show alert if blank for 6 days</option>
                    <option value={7}>Show alert if blank for 1 week (7 days)</option>
                    <option value={14}>Show alert if blank for 2 weeks (14 days)</option>
                  </select>
                </div>

                {/* Attendance Monitoring */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Attendance Entry Alert</h4>
                      <p className="text-xs text-slate-500">Show a notification alert if daily attendance is not updated for the specified duration.</p>
                    </div>
                  </div>
                  <select 
                    value={settings.attendanceNoScoreDays ?? (settings.attendanceNoScoreWeeks ? settings.attendanceNoScoreWeeks * 7 : 0)}
                    onChange={(e) => onUpdateSettings({ ...settings, attendanceNoScoreDays: Number(e.target.value), attendanceNoScoreWeeks: 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Disabled (Do not notify)</option>
                    <option value={2}>Show alert if blank for 2 days</option>
                    <option value={3}>Show alert if blank for 3 days</option>
                    <option value={4}>Show alert if blank for 4 days</option>
                    <option value={5}>Show alert if blank for 5 days</option>
                    <option value={6}>Show alert if blank for 6 days</option>
                    <option value={7}>Show alert if blank for 1 week (7 days)</option>
                    <option value={14}>Show alert if blank for 2 weeks (14 days)</option>
                  </select>
                </div>

                {/* Info Note */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-1">How Monitoring Alerts Work:</span>
                  <p className="leading-relaxed">
                    The alert monitors updates in real-time. Once the teacher logs student attendance or enters scores inside any "Quiz" category (any category with "quiz" in its name), the warning notification will automatically disappear.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="p-6 space-y-6 max-w-xl mx-auto">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                    <Database className="w-6 h-6 animate-none" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-slate-800 uppercase">Backup & Restore Website Data</h3>
                    <p className="text-xs text-slate-500 font-medium">Export all levels, classes, student lists, and grades, or restore them from a previous backup file.</p>
                  </div>
                </div>

                {backupMessage && (
                  <div className={`p-4 rounded-xl text-xs font-bold border flex items-center gap-2 ${
                    backupStatus === 'success' ? 'bg-green-50 text-green-700 border-green-100' :
                    backupStatus === 'error' ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {backupStatus === 'loading' && <RefreshCw className="w-4 h-4 animate-spin shrink-0" />}
                    <span>{backupMessage}</span>
                  </div>
                )}

                {/* Backup (Export) Section */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-indigo-600" />
                    Export Full Backup
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Download a secure JSON file containing the complete dataset from this website. This includes all configured Level Profiles, all Teacher Class rosters, and every single student's attendance history and quiz grades. <strong>Keep this file safe as a recovery point.</strong>
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      setBackupStatus('loading');
                      setBackupMessage('Preparing data and downloading backup file...');
                      try {
                        const targetUserUid = auth.currentUser?.uid || 'default_teacher';
                        await exportFullBackup(targetUserUid, levels, classRecords);
                        setBackupStatus('success');
                        setBackupMessage('Backup file downloaded successfully!');
                      } catch (err: any) {
                        setBackupStatus('error');
                        setBackupMessage('Failed to download backup: ' + (err.message || err));
                      }
                    }}
                    disabled={backupStatus === 'loading'}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-indigo-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {backupStatus === 'loading' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download Full Backup (.JSON)
                  </button>
                </div>

                {/* Restore (Import) Section */}
                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-amber-600" />
                    Restore Website from Backup
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Upload a previously downloaded <code>.json</code> backup file to restore all settings, classes, and student grade records. <strong className="text-amber-600">WARNING: This will replace and overwrite your existing database with the data contained in the file.</strong>
                  </p>
                  <label className="block">
                    <span className="sr-only">Choose backup file</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const reader = new FileReader();
                        reader.onload = async (event) => {
                          const fileContent = event.target?.result as string;
                          setBackupStatus('loading');
                          setBackupMessage('Restoring all levels, classes, and student grades. Please do not close this window...');
                          try {
                            const targetUserUid = auth.currentUser?.uid || 'default_teacher';
                            await importFullBackup(targetUserUid, fileContent);
                            setBackupStatus('success');
                            setBackupMessage('All data was successfully restored! The page will now reload.');
                            setTimeout(() => {
                              window.location.reload();
                            }, 2000);
                          } catch (err: any) {
                            setBackupStatus('error');
                            setBackupMessage('Failed to import backup file. Make sure the file is valid. Error: ' + (err.message || err));
                          }
                        };
                        reader.readAsText(file);
                      }}
                      disabled={backupStatus === 'loading'}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 file:cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="p-6 max-w-md mx-auto">
              {!user ? (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">Sign In</h2>
                    <p className="text-sm text-slate-500">Sign in to sync your class records.</p>
                  </div>
                  
                  {authError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{authError}</div>}
                  
                  <div className="space-y-2">
                    <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
                      Continue with Google
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-8 h-8" />}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">{user.displayName || 'Teacher'}</h3>
                  <p className="text-sm text-slate-500 mb-6">{user.email}</p>
                  
                  <div className="bg-slate-50 p-4 rounded-lg mb-6 text-left space-y-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-1">Status: Logged In</p>
                      <p className="text-xs text-slate-500">Your class records and settings are synced and secured.</p>
                    </div>

                    <label className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer">
                      <div>
                        <span className="block text-sm font-bold text-slate-900">Auto Backup</span>
                        <span className="block text-[10px] text-slate-500">Automatically sync data to Cloud</span>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={settings.autoBackup !== false} // Default to true
                        onChange={(e) => onUpdateSettings({ ...settings, autoBackup: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <button onClick={handleLogout} className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
          {activeTab === 'data' && (
            <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 bg-red-50 border-2 border-red-100 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-600 text-white rounded-xl shadow-lg shadow-red-200">
                    <Trash2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-red-900 uppercase tracking-tight">Danger Zone: Reset Database</h3>
                    <p className="text-sm text-red-700 font-medium opacity-80">Irreversible actions that affect all your class records.</p>
                  </div>
                </div>
                
                <div className="bg-white/60 p-4 rounded-xl border border-red-200 mb-6">
                  <h4 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    IMPORTANT WARNING
                  </h4>
                  <ul className="text-xs text-red-700 space-y-1 font-medium list-disc pl-4">
                    <li>This will permanently delete ALL class profiles currently stored.</li>
                    <li>Student names, grades, and attendance records will be removed.</li>
                    <li>This action CANNOT be undone unless you have a manual backup file.</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      const code = prompt("To confirm deleting ALL classes, please type 'DELETE ALL' in capital letters:");
                      if (code === 'DELETE ALL') {
                        onDeleteAllClasses?.();
                      } else if (code !== null) {
                        alert("Confirmation failed. Incorrect phrase entered.");
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                    DELETE ALL CLASS RECORDS PERMANENTLY
                  </button>
                  <p className="text-[10px] text-center text-red-500 font-bold uppercase tracking-widest">
                    You currently have {classRecords.filter(c => !c.isDeleted).length} active classes in your library.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Clean Start</h3>
                <p className="text-sm text-slate-500 mb-4">If your application is lagging or has too many test records from various programs, clearing the database is the best way to start fresh with a clean workspace.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

