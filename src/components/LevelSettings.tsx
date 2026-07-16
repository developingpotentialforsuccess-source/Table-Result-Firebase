import React, { useState } from 'react';
import { Level, Subject, Category, getLevelTotalWeight, getSubjectWeight } from '../types';
import { isMidtermCategory, isFinalCategory } from "../lib/categoryUtils";
import { X, Plus, Trash2, ChevronDown, ChevronRight, Edit2, Lock, GraduationCap, Check, Sparkles, Loader2 } from 'lucide-react';



interface Props {
  level: Level;
  onUpdateLevel: (level: Level) => void;
  onClose: () => void;
  hideHeader?: boolean;
}

export default function LevelSettings({ level, onUpdateLevel, onClose, hideHeader = false }: Props) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [activeGradingTab, setActiveGradingTab] = useState<'full' | 'midterm' | 'final'>('full');
  const [activeScaleType, setActiveScaleType] = useState<'grade' | 'status'>('grade');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryWeight, setNewCategoryWeight] = useState('');
  const [newCategoryItems, setNewCategoryItems] = useState('1');
  const [newCategoryIsMidterm, setNewCategoryIsMidterm] = useState<boolean>(false);
  const [newCategoryIsFinal, setNewCategoryIsFinal] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLocked, setIsLocked] = useState(() => {
    const adminCode = (localStorage.getItem("gradecalc_access_code") || "").trim().toUpperCase();
    const isLocalUnlocked = localStorage.getItem("gradecalc_level_structure_unlocked") === "true";
    const isAdmin = ["DPS", "DPSS", "BPS", "BPSS"].includes(adminCode);
    return !(isAdmin || isLocalUnlocked);
  });
  const [showSmartImport, setShowSmartImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const totalWeight = getLevelTotalWeight(level);

  const handleUnlock = () => {
    const code = verificationCode.trim().toUpperCase();
    if (["DPSS", "DPS", "BPS", "BPSS"].includes(code)) {
      setIsLocked(false);
      setVerificationCode('');
      localStorage.setItem("gradecalc_level_structure_unlocked", "true");
    }
  };

  const handleUpdateLevelName = (name: string) => {
    onUpdateLevel({ ...level, name });
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) return;
    const newSubject: Subject = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSubjectName.trim(),
      categories: []
    };
    onUpdateLevel({ ...level, subjects: [...level.subjects, newSubject] });
    setNewSubjectName('');
    setExpandedSubject(newSubject.id);
  };

  const handleUpdateGradingScale = (mode: 'full' | 'midterm' | 'final', index: number, field: 'grade' | 'minScore', value: any) => {
    let key: string;
    if (activeScaleType === 'status') {
      key = mode === 'full' ? 'statusScale' : (mode === 'midterm' ? 'midtermStatusScale' : 'finalStatusScale');
    } else {
      key = mode === 'full' ? 'gradingScale' : (mode === 'midterm' ? 'midtermGradingScale' : 'finalGradingScale');
    }
    
    const currentScale = [...((level as any)[key] || [])];
    if (field === 'minScore') {
      currentScale[index] = { ...currentScale[index], minScore: value === '' ? undefined : Number(value) };
    } else {
      currentScale[index] = { ...currentScale[index], grade: value };
    }
    onUpdateLevel({ ...level, [key]: currentScale });
  };

  const handleAddGradingLevel = (mode: 'full' | 'midterm' | 'final') => {
    let key: string;
    if (activeScaleType === 'status') {
      key = mode === 'full' ? 'statusScale' : (mode === 'midterm' ? 'midtermStatusScale' : 'finalStatusScale');
    } else {
      key = mode === 'full' ? 'gradingScale' : (mode === 'midterm' ? 'midtermGradingScale' : 'finalGradingScale');
    }
    
    const currentScale = [...((level as any)[key] || [])];
    currentScale.push({ grade: activeScaleType === 'status' ? 'Pass' : 'A', minScore: 50 });
    onUpdateLevel({ ...level, [key]: currentScale });
  };

  const handleRemoveGradingLevel = (mode: 'full' | 'midterm' | 'final', index: number) => {
    let key: string;
    if (activeScaleType === 'status') {
      key = mode === 'full' ? 'statusScale' : (mode === 'midterm' ? 'midtermStatusScale' : 'finalStatusScale');
    } else {
      key = mode === 'full' ? 'gradingScale' : (mode === 'midterm' ? 'midtermGradingScale' : 'finalGradingScale');
    }
    
    const currentScale = ((level as any)[key] || []).filter((_: any, i: number) => i !== index);
    onUpdateLevel({ ...level, [key]: currentScale });
  };

  const handleUpdateSubjectName = (subjectId: string, name: string) => {
    const newSubjects = level.subjects.map(s => s.id === subjectId ? { ...s, name } : s);
    onUpdateLevel({ ...level, subjects: newSubjects });
  };

  const handleUpdateSubjectTarget = (
    subjectId: string, 
    field: 'targetWeight' | 'midtermTargetWeight' | 'finalTargetWeight' | 'midtermMaxScore' | 'finalMaxScore' | 'fullModeMidtermWeight' | 'fullModeFinalWeight', 
    value: number
  ) => {
    const newSubjects = level.subjects.map(s => {
      if (s.id === subjectId) {
        let updatedSubject = { ...s, [field]: value };
        
        // Auto-sync category weights if fullModeMidtermWeight or fullModeFinalWeight is changed
        if (field === 'fullModeMidtermWeight' && typeof value === 'number') {
          updatedSubject.categories = s.categories.map(c => {
            if (isMidtermCategory(c.name)) {
              return { ...c, weight: value };
            }
            return c;
          });
        } else if (field === 'fullModeFinalWeight' && typeof value === 'number') {
          updatedSubject.categories = s.categories.map(c => {
            if (isFinalCategory(c.name)) {
              return { ...c, weight: value };
            }
            return c;
          });
        }
        
        return updatedSubject;
      }
      return s;
    });
    onUpdateLevel({ ...level, subjects: newSubjects });
  };

  const handleDeleteSubject = (subjectId: string) => {
    onUpdateLevel({ ...level, subjects: level.subjects.filter(s => s.id !== subjectId) });
  };

  const handleAddCategory = (subjectId: string) => {
    if (!newCategoryName.trim() || !newCategoryWeight || !newCategoryItems) return;
    const count = Number(newCategoryItems);
    
    // Auto-fill category weight from subject's fullModeMidtermWeight / fullModeFinalWeight if applicable
    const subject = level.subjects.find(s => s.id === subjectId);
    let finalWeight = Number(newCategoryWeight);
    if (subject) {
      if (isMidtermCategory(newCategoryName) && typeof subject.fullModeMidtermWeight === 'number') {
        finalWeight = subject.fullModeMidtermWeight;
      } else if (isFinalCategory(newCategoryName) && typeof subject.fullModeFinalWeight === 'number') {
        finalWeight = subject.fullModeFinalWeight;
      }
    }

    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategoryName.trim(),
      weight: finalWeight,
      isMidterm: newCategoryIsMidterm,
      isFinal: newCategoryIsFinal,
      itemCount: count,
      itemMaxScores: Array(count).fill(100)
    };
    const newSubjects = level.subjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, categories: [...s.categories, newCategory] };
      }
      return s;
    });
    onUpdateLevel({ ...level, subjects: newSubjects });
    setNewCategoryName('');
    setNewCategoryWeight('');
    setNewCategoryItems('1');
    setNewCategoryIsMidterm(false);
    setNewCategoryIsFinal(false);
  };

  const handleUpdateCategory = (subjectId: string, categoryId: string, field: keyof Category, value: any) => {
    const newSubjects = level.subjects.map(s => {
      if (s.id === subjectId) {
        return {
          ...s,
          categories: s.categories.map(c => {
            if (c.id === categoryId) {
              const updatedCategory = { ...c, [field]: value };
              
              // If name changes, check if it matches midterm/final and auto-assign weight
              if (field === 'name') {
                if (isMidtermCategory(value) && typeof s.fullModeMidtermWeight === 'number') {
                  updatedCategory.weight = s.fullModeMidtermWeight;
                } else if (isFinalCategory(value) && typeof s.fullModeFinalWeight === 'number') {
                  updatedCategory.weight = s.fullModeFinalWeight;
                }
              }
              
              if (field === 'itemCount') {
                const count = Number(value);
                const currentScores = updatedCategory.itemMaxScores || [];
                // Resize array: keep existing scores, default new ones to 100
                updatedCategory.itemMaxScores = Array.from({ length: count }, (_, i) => currentScores[i] ?? 100);
              }
              return updatedCategory;
            }
            return c;
          })
        };
      }
      return s;
    });
    onUpdateLevel({ ...level, subjects: newSubjects });
  };

  const handleDeleteCategory = (subjectId: string, categoryId: string) => {
    const newSubjects = level.subjects.map(s => {
      if (s.id === subjectId) {
        return { ...s, categories: s.categories.filter(c => c.id !== categoryId) };
      }
      return s;
    });
    onUpdateLevel({ ...level, subjects: newSubjects });
  };

  const handleSmartImport = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    try {
      const response = await fetch('/api/ai/parse-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: importText })
      });
      if (!response.ok) throw new Error('Failed to parse config');
      const parsed = await response.json();
      
      const newLevel: Level = {
        ...level,
        name: parsed.name || level.name,
        subjects: (parsed.subjects || []).map((s: any) => ({
          ...s,
          id: Math.random().toString(36).substr(2, 9),
          categories: (s.categories || []).map((c: any) => ({
            ...c,
            id: Math.random().toString(36).substr(2, 9),
            itemCount: c.itemCount || 1,
            itemMaxScores: Array(c.itemCount || 1).fill(100)
          }))
        }))
      };
      
      onUpdateLevel(newLevel);
      setShowSmartImport(false);
      setImportText('');
    } catch (err: any) {
      alert("Smart Import Error: " + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
      {!hideHeader && (
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex-1">
            <input
              type="text"
              value={level.name}
              onChange={(e) => handleUpdateLevelName(e.target.value)}
              className="text-xl font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors px-1 w-full max-w-sm"
              placeholder="Level Name"
              disabled={isLocked}
            />
            <p className="text-sm text-slate-500 px-1 mt-1">Configure subjects, assignments, and test weights for this level.</p>
          </div>
          <div className="flex items-center gap-3">
            {!isLocked && (
              <button
                onClick={() => setShowSmartImport(!showSmartImport)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-bold uppercase tracking-tight ${
                  showSmartImport 
                    ? 'bg-purple-600 text-white border-purple-700 shadow-md' 
                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Smart Import
              </button>
            )}
            {!isLocked && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                <Edit2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">Editing Unlocked</span>
                <button 
                  onClick={() => setIsLocked(true)}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 ml-2"
                >
                  Lock
                </button>
              </div>
            )}
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      
      <div className="p-5 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {showSmartImport && !isLocked && (
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl mb-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h4 className="text-sm font-bold text-purple-800 uppercase tracking-tight">Paste Configuration</h4>
              </div>
              <button onClick={() => setShowSmartImport(false)} className="text-purple-400 hover:text-purple-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-purple-700 mb-3 leading-relaxed">
              Paste your level description, subject list, or weight distribution here. 
              Gemini will automatically structure it into subjects and categories.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Example: Mini test has Speaking, Vocab, Grammar. Final test is 62%..."
              className="w-full h-32 bg-white border border-purple-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-purple-200"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSmartImport}
                disabled={isImporting || !importText.trim()}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all disabled:opacity-50 shadow-sm"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Apply Config
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {isLocked && (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex items-start gap-3 mb-4">
            <Lock className="w-5 h-5 text-slate-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-slate-700">Level Structure Locked</h4>
              <p className="text-xs text-slate-500 mt-1">
                The structure of this level is locked to prevent accidental changes to standard templates. 
                Enter the access code (DPSS or BPS) below to modify subjects, categories, or weights.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <input 
                  type="password"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter code"
                  className="w-32 text-xs bg-white border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                />
                <button 
                  onClick={handleUnlock}
                  className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        )}
        
        {!isLocked && (
          <div className="space-y-4 mb-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    Program
                  </label>
                  <input
                    type="text"
                    list="program-list"
                    value={level.program || ''}
                    onChange={(e) => onUpdateLevel({ ...level, program: e.target.value })}
                    placeholder="e.g. Part-time English"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                  <datalist id="program-list">
                    <option value="English" />
                    <option value="Full-time English" />
                    <option value="Part-time English program" />
                    <option value="Khmer program" />
                    <option value="Math program" />
                    <option value="ERA program" />
                    <option value="Level Foundation program" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">
                    Term / Year
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={level.term || ''}
                      onChange={(e) => onUpdateLevel({ ...level, term: e.target.value })}
                      placeholder="Term (e.g. Term 1)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                    <input
                      type="text"
                      value={level.year || ''}
                      onChange={(e) => onUpdateLevel({ ...level, year: e.target.value })}
                      placeholder="Year (e.g. 2024)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Archive Level</h4>
                    <p className="text-[10px] text-slate-500">Hide from active lists.</p>
                  </div>
                  <button
                    onClick={() => onUpdateLevel({ ...level, isArchived: !level.isArchived })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      level.isArchived ? 'bg-orange-500' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        level.isArchived ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-slate-800">Attendance Config (Standalone)</h4>
                  <p className="text-xs text-slate-500 mt-1">Set the weight of attendance in the final term result (e.g. 10%). Leave blank for 0%.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600">Weight:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={level.attendanceWeight ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? undefined : Number(e.target.value);
                      if (onUpdateLevel) onUpdateLevel({ ...level, attendanceWeight: val });
                    }}
                    className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                    placeholder="0"
                  />
                  <span className="text-slate-500 text-sm font-medium">%</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="block md:hidden bg-blue-50 border border-blue-100 text-blue-700 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
          <span className="animate-pulse">↔️</span>
          <span><strong>Tip:</strong> Swipe left/right on any subject card to view all weights, categories, and exam settings.</span>
        </div>
        
        {level.subjects.map((subject) => {
          const isExpanded = expandedSubject === subject.id;
          const subjectWeight = getSubjectWeight(subject);
          const midSum = subject.categories.reduce((sum, cat) => {
            if (isMidtermCategory(cat)) return sum + (cat.midtermWeight ?? cat.weight);
            return sum;
          }, 0);
          const finSum = subject.categories.reduce((sum, cat) => {
            if (isFinalCategory(cat)) return sum + (cat.finalWeight ?? cat.weight);
            return sum;
          }, 0);
          
          return (
            <div key={subject.id} className="border border-slate-200 rounded-xl overflow-x-auto [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
              <div className="min-w-[720px] md:min-w-0">
                <div className="bg-slate-50 p-3 flex items-center gap-3">
                <button
                  onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors"
                >
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={subject.name}
                  onChange={(e) => handleUpdateSubjectName(subject.id, e.target.value)}
                  className="flex-1 min-w-[120px] bg-transparent font-medium text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1"
                  placeholder="Subject Name"
                  disabled={isLocked}
                />
                <div className="flex items-center gap-1.5 ml-auto">
                    <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold" title="Total weight of this subject in the level (usually sum to 100%)">Subject Wt %</span>
                    <div className="relative">
                      <input 
                        type="number"
                        min="0"
                        value={subject.targetWeight ?? ''}
                        onChange={(e) => handleUpdateSubjectTarget(subject.id, 'targetWeight', e.target.value === '' ? undefined : Number(e.target.value) as any)}
                        className="w-14 bg-white border border-slate-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-200 mx-1"></div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-orange-600 uppercase font-bold text-center" title="Midterm in Final Term">Midterm in Final Term</span>
                    <input 
                      type="number"
                      min="0"
                      value={subject.fullModeMidtermWeight ?? ''}
                      onChange={(e) => handleUpdateSubjectTarget(subject.id, 'fullModeMidtermWeight' as any, e.target.value === '' ? undefined : Number(e.target.value) as any)}
                      className="w-14 bg-orange-50 border border-orange-200 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold text-orange-700"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-teal-600 uppercase font-bold text-center" title="Final Term Result">Final Term Result</span>
                    <input 
                      type="number"
                      min="0"
                      value={subject.fullModeFinalWeight ?? ''}
                      onChange={(e) => handleUpdateSubjectTarget(subject.id, 'fullModeFinalWeight' as any, e.target.value === '' ? undefined : Number(e.target.value) as any)}
                      className="w-14 bg-teal-50 border border-teal-200 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold text-teal-700"
                    />
                  </div>
                  <div className="h-8 w-px bg-slate-200 mx-1 hidden"></div>
                  <div className="flex flex-col items-center gap-1 hidden">
                    <span className="text-[10px] text-blue-500 uppercase font-bold" title="Midterm weight">Mid %</span>
                    <div className="relative">
                      <input 
                        type="number"
                        min="0"
                        value={subject.midtermTargetWeight ?? ''}
                        onChange={(e) => handleUpdateSubjectTarget(subject.id, 'midtermTargetWeight', e.target.value === '' ? undefined : Number(e.target.value) as any)}
                        className="w-14 bg-blue-50 border border-blue-200 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-semibold text-blue-700"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1 hidden">
                    <span className="text-[10px] text-purple-500 uppercase font-bold" title="Final weight">Final %</span>
                    <div className="relative">
                      <input 
                        type="number"
                        min="0"
                        value={subject.finalTargetWeight ?? ''}
                        onChange={(e) => handleUpdateSubjectTarget(subject.id, 'finalTargetWeight', e.target.value === '' ? undefined : Number(e.target.value) as any)}
                        className="w-14 bg-purple-50 border border-purple-200 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-semibold text-purple-700"
                      />
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-200 mx-1"></div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-blue-600 uppercase font-bold" title="Midterm Max Score">Mid Max</span>
                    <input 
                      type="number"
                      min="1"
                      value={subject.midtermMaxScore ?? ''}
                      onChange={(e) => handleUpdateSubjectTarget(subject.id, 'midtermMaxScore' as any, e.target.value === '' ? undefined : Number(e.target.value) as any)}
                      className="w-14 bg-blue-100/50 border border-blue-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold text-blue-800"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-purple-600 uppercase font-bold" title="Final Max Score">Fin Max</span>
                    <input 
                      type="number"
                      min="1"
                      value={subject.finalMaxScore ?? ''}
                      onChange={(e) => handleUpdateSubjectTarget(subject.id, 'finalMaxScore' as any, e.target.value === '' ? undefined : Number(e.target.value) as any)}
                      className="w-14 bg-purple-100/50 border border-purple-300 rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-bold text-purple-800"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    midSum !== 100 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'
                  }`} title="Sum of weights for categories included in Midterm Test">
                    Mid Sum: {midSum}%
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    finSum !== 100 ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-green-50 text-green-700 border-green-200'
                  }`} title="Sum of weights for categories included in Final Test">
                    Fin Sum: {finSum}%
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${
                    subjectWeight !== 100
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`} title={subjectWeight !== 100 ? 'Warning: Category weights should sum up to exactly 100%' : 'Category weights sum to 100%'}>
                    Cat. Sum: {subjectWeight}%
                  </span>
                      {!isLocked && (
                        <button
                          onClick={() => handleDeleteSubject(subject.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 border-t border-slate-200 space-y-3 bg-white">
                  {subject.categories.length > 0 ? (
                    <div className="space-y-2">
                      {subject.categories.map(category => {
                        const isMid = !!category.isMidterm;
                        const isFin = !!category.isFinal;
                        const isCategoryLocked = isLocked;

                        let borderClass = "border-slate-100 bg-slate-50";
                        if (isMid) {
                          borderClass = "border-orange-200 bg-orange-50/20 border-l-4 border-l-orange-500";
                        } else if (isFin) {
                          borderClass = "border-teal-200 bg-teal-50/20 border-l-4 border-l-teal-500";
                        }

                        return (
                          <div key={category.id} className={`flex items-center gap-3 p-2 rounded-lg border transition-all ${borderClass}`}>
                            <div className="flex-1">
                              <input
                                type="text"
                                value={category.name}
                                onChange={(e) => handleUpdateCategory(subject.id, category.id, 'name', e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Category (e.g., Quizzes)"
                                disabled={isCategoryLocked}
                              />
                              <div className="flex items-center gap-3 mt-1.5 px-1 hidden">
                                <label className="text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer font-medium hover:text-slate-700">
                                  <input 
                                    type="checkbox" 
                                    checked={!!category.isMidterm} 
                                    onChange={(e) => handleUpdateCategory(subject.id, category.id, 'isMidterm', e.target.checked)} 
                                    className="rounded border-slate-300 w-3 h-3 text-blue-600 focus:ring-blue-500" 
                                  />
                                  Is Mid-Term Exam
                                </label>
                                <label className="text-[10px] text-slate-500 flex items-center gap-1 cursor-pointer font-medium hover:text-slate-700">
                                  <input 
                                    type="checkbox" 
                                    checked={!!category.isFinal} 
                                    onChange={(e) => handleUpdateCategory(subject.id, category.id, 'isFinal', e.target.checked)} 
                                    className="rounded border-slate-300 w-3 h-3 text-purple-600 focus:ring-purple-500" 
                                  />
                                  Is Final Exam
                                </label>
                              </div>
                            </div>
                            <div className="w-24 relative flex items-center gap-2">
                              <span className="text-xs text-slate-500 w-12">Items:</span>
                              <input
                                type="number"
                                min="1"
                                value={category.itemCount ?? ''}
                                onChange={(e) => handleUpdateCategory(subject.id, category.id, 'itemCount', e.target.value === '' ? undefined : Number(e.target.value))}
                                className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                title="Number of items (e.g., 5 quizzes)"
                              />
                            </div>
                            
                            {!isMid && !isFin ? (
                              <div className="w-20 relative flex flex-col items-center gap-1">
                                <span className="text-[10px] text-slate-500 uppercase font-bold" title="Weight of this category in Full Term">Weight %</span>
                                <div className="relative w-full">
                                  <input
                                    type="number"
                                    min="0"
                                    value={category.weight ?? ''}
                                    onChange={(e) => handleUpdateCategory(subject.id, category.id, 'weight', e.target.value === '' ? undefined : Number(e.target.value))}
                                    className="w-full bg-white border border-slate-300 rounded-md pl-5 pr-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-semibold"
                                  />
                                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">W</span>
                                </div>
                              </div>
                            ) : (
                              <div className="w-20 relative flex flex-col items-center justify-end h-[42px]">
                                <span className="text-[10px] text-slate-400 uppercase font-bold text-center italic leading-tight">Configured in Subject Header</span>
                              </div>
                            )}

                            <div className="w-12 relative flex flex-col items-center gap-1">
                              <span className="text-[10px] text-blue-500 uppercase font-bold">Mid</span>
                              <input 
                                type="checkbox"
                                checked={!!category.isMidterm}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  handleUpdateCategory(subject.id, category.id, 'isMidterm', checked);
                                  if (checked && category.midtermWeight === undefined) {
                                    handleUpdateCategory(subject.id, category.id, 'midtermWeight', category.weight || 0);
                                  }
                                  // We do NOT set midtermWeight to undefined when unchecking, 
                                  // because isMidterm=false already excludes it from midterm mode.
                                }}
                                className="w-5 h-5 rounded text-blue-600 border-blue-300 focus:ring-blue-500"
                              />
                            </div>

                            <div className="w-12 relative flex flex-col items-center gap-1">
                              <span className="text-[10px] text-purple-500 uppercase font-bold">Final</span>
                              <input 
                                type="checkbox"
                                checked={!!category.isFinal}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  handleUpdateCategory(subject.id, category.id, 'isFinal', checked);
                                  if (checked && category.finalWeight === undefined) {
                                    handleUpdateCategory(subject.id, category.id, 'finalWeight', category.weight || 0);
                                  }
                                }}
                                className="w-5 h-5 rounded text-purple-600 border-purple-300 focus:ring-blue-500"
                              />
                            </div>

                            <div className="flex items-center gap-1">
                              {!isCategoryLocked && (
                                <button
                                  onClick={() => handleDeleteCategory(subject.id, category.id)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic px-2">No categories defined yet.</p>
                  )}

                  {!isLocked && (
                    <div className="space-y-3 p-2 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 mt-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <span className="text-[10px] text-slate-500 uppercase font-bold px-1">Category Name</span>
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="New Category (e.g., Assignment)"
                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="w-20">
                        <span className="text-[10px] text-slate-500 uppercase font-bold px-1">Items</span>
                        <input
                          type="number"
                          min="1"
                          value={newCategoryItems}
                          onChange={(e) => setNewCategoryItems(e.target.value)}
                          placeholder="Items"
                          className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-4">
                        {!newCategoryIsMidterm && !newCategoryIsFinal ? (
                          <div className="w-24">
                            <span className="text-[10px] text-slate-500 uppercase font-bold px-1">Weight %</span>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                value={newCategoryWeight}
                                onChange={(e) => setNewCategoryWeight(e.target.value)}
                                placeholder="0"
                                className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-6 text-center font-semibold"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">%</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 flex flex-col justify-end h-[46px]">
                            <span className="text-[10px] text-slate-400 uppercase font-bold text-center italic leading-tight">Configured in Subject Header</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 pt-5">
                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={newCategoryIsMidterm}
                              onChange={(e) => setNewCategoryIsMidterm(e.target.checked)}
                              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                            />
                            Midterm Exam
                          </label>

                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={newCategoryIsFinal}
                              onChange={(e) => setNewCategoryIsFinal(e.target.checked)}
                              className="w-4 h-4 rounded text-purple-600 border-slate-300 focus:ring-purple-500"
                            />
                            Final Exam
                          </label>
                        </div>
                      </div>

                      <div className="flex items-end h-full pt-5">
                        <button
                          onClick={() => handleAddCategory(subject.id)}
                          disabled={!newCategoryName || !newCategoryWeight || !newCategoryItems}
                          className="px-6 py-2 text-sm font-bold text-white bg-slate-800 rounded-md hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider cursor-pointer"
                        >
                          Add Category
                        </button>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              )}
              </div>
            </div>
          );
        })}

        {!isLocked && (
          <div className="flex items-center gap-3 p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="Add new subject (e.g., Mathematics)"
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddSubject}
              disabled={!newSubjectName.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add Subject
            </button>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Level SCALES</h3>
              <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-black uppercase w-full sm:w-auto">
                <button
                  onClick={() => setActiveScaleType('grade')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${activeScaleType === 'grade' ? 'bg-white text-blue-700 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Grade Scale
                </button>
                <button
                  onClick={() => setActiveScaleType('status')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${activeScaleType === 'status' ? 'bg-white text-orange-700 shadow-md ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Check className="w-4 h-4" />
                  Status Scale
                </button>
              </div>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={() => setActiveGradingTab('full')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-md transition-all text-center ${activeGradingTab === 'full' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Full Term
              </button>
              <button
                onClick={() => setActiveGradingTab('midterm')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-md transition-all text-center ${activeGradingTab === 'midterm' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Mid-term
              </button>
              <button
                onClick={() => setActiveGradingTab('final')}
                className={`flex-1 sm:flex-initial px-3 py-1 rounded-md transition-all text-center ${activeGradingTab === 'final' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Final Test
              </button>
            </div>
          </div>

          <div className={`bg-white p-4 rounded-xl border ${activeScaleType === 'status' ? 'border-amber-200 bg-amber-50/10' : 'border-slate-200'} shadow-sm space-y-4`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">
                Configure <strong>{activeScaleType.toUpperCase()}</strong> thresholds and labels specifically for this level in <strong>{activeGradingTab.toUpperCase()}</strong> mode.
              </p>
              <button
                onClick={() => handleAddGradingLevel(activeGradingTab)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg transition-colors border ${
                  activeScaleType === 'status' ? 'text-amber-600 bg-amber-50 border-amber-100 hover:bg-amber-100' : 'text-blue-600 bg-blue-50 border-blue-100 hover:bg-blue-50'
                }`}
              >
                <Plus className="w-3 h-3" />
                Add Range
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(() => {
                let currentScale: any[];
                if (activeScaleType === 'status') {
                  currentScale = activeGradingTab === 'full' ? level.statusScale : (activeGradingTab === 'midterm' ? level.midtermStatusScale : level.finalStatusScale);
                } else {
                  currentScale = activeGradingTab === 'full' ? level.gradingScale : (activeGradingTab === 'midterm' ? level.midtermGradingScale : level.finalGradingScale);
                }
                
                return (currentScale || [])?.map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-2 p-2 bg-white rounded-lg border ${activeScaleType === 'status' ? 'border-amber-200 shadow-sm' : 'border-slate-200'}`}>
                    <input
                      type="text"
                      value={item.grade}
                      onChange={(e) => handleUpdateGradingScale(activeGradingTab, idx, 'grade', e.target.value)}
                      className="w-20 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-sm font-bold text-slate-600 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-center"
                      placeholder="Label"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.minScore}
                        onChange={(e) => handleUpdateGradingScale(activeGradingTab, idx, 'minScore', e.target.value)}
                        className="w-full bg-white border-2 border-slate-200 rounded pl-3 pr-7 py-1.5 text-base font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none text-right"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">%</span>
                    </div>
                    <button
                      onClick={() => handleRemoveGradingLevel(activeGradingTab, idx)}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ));
              })()}
              {(() => {
                let currentScale: any[];
                if (activeScaleType === 'status') {
                  currentScale = activeGradingTab === 'full' ? level.statusScale : (activeGradingTab === 'midterm' ? level.midtermStatusScale : level.finalStatusScale);
                } else {
                  currentScale = activeGradingTab === 'full' ? level.gradingScale : (activeGradingTab === 'midterm' ? level.midtermGradingScale : level.finalGradingScale);
                }
                if (!currentScale?.length) {
                  return (
                    <div className="col-span-full py-4 text-center text-xs text-slate-400 italic">
                      No custom {activeScaleType} scale defined for this mode. Using teacher's global settings.
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>

        <div className={`mt-6 p-4 rounded-xl flex items-center justify-between text-sm font-medium border ${totalWeight === 100 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
          <div className="flex flex-col">
            <span className="text-base font-semibold">Total Level Weight: {totalWeight}%</span>
            {totalWeight !== 100 && (
              <span className="text-xs font-normal mt-0.5">Please ensure the sum of all category weights across subjects equals 100% (or your desired scale).</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

