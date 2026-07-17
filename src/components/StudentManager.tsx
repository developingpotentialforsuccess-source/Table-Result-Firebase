import React, { useState } from "react";
import { Student } from "../types";
import { User, Plus, Trash2, Edit2, Check, UserPlus, UserMinus, MessageSquare, Info } from "lucide-react";

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (name: string, sex: "Male" | "Female", comment: string) => void;
  onUpdateStudentField: (id: string, field: string, value: any) => void;
  onDeleteStudent: (id: string) => void;
}

export function StudentManager({
  students,
  onAddStudent,
  onUpdateStudentField,
  onDeleteStudent,
}: StudentManagerProps) {
  const [nameInput, setNameInput] = useState("");
  const [sexInput, setSexInput] = useState<"Male" | "Female">("Male");
  const [commentInput, setCommentInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editComment, setEditComment] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      alert("Please enter a student name.");
      return;
    }
    onAddStudent(nameInput.trim(), sexInput, commentInput.trim());
    setNameInput("");
    setCommentInput("");
    setSexInput("Male");
  };

  const startEditing = (student: Student) => {
    setEditingStudentId(student.id);
    setEditName(student.name);
    setEditComment(student.comment || "");
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) {
      alert("Name cannot be empty.");
      return;
    }
    onUpdateStudentField(id, "name", editName.trim());
    onUpdateStudentField(id, "comment", editComment.trim());
    setEditingStudentId(null);
  };

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.comment || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const maleCount = students.filter((s) => s.sex === "Male").length;
  const femaleCount = students.filter((s) => s.sex === "Female").length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto text-slate-800">
      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 sm:p-4 text-center">
          <span className="block text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Total Students</span>
          <span className="text-xl sm:text-2xl font-black text-blue-900">{students.length}</span>
        </div>
        <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 sm:p-4 text-center">
          <span className="block text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">Male Students</span>
          <span className="text-xl sm:text-2xl font-black text-sky-900">{maleCount}</span>
        </div>
        <div className="bg-pink-50/70 border border-pink-100 rounded-xl p-3 sm:p-4 text-center">
          <span className="block text-[10px] font-black text-pink-500 uppercase tracking-widest mb-1">Female Students</span>
          <span className="text-xl sm:text-2xl font-black text-pink-900">{femaleCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column: Quick Add Form */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black tracking-tight text-slate-900 uppercase">Quick Add Student</h3>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Student Name *</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-800 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Gender / Sex</label>
              <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-bold shadow-inner select-none">
                <button
                  type="button"
                  onClick={() => setSexInput("Male")}
                  className={`flex-1 py-1.5 text-center rounded-md transition-all cursor-pointer ${sexInput === "Male" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setSexInput("Female")}
                  className={`flex-1 py-1.5 text-center rounded-md transition-all cursor-pointer ${sexInput === "Female" ? "bg-white text-pink-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Comment / Notes (Optional)</label>
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="e.g. Needs extra reading support"
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add to Roster
            </button>
          </form>
        </div>

        {/* Right column: Roster List */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black tracking-tight text-slate-900 uppercase">Student List ({filtered.length})</h3>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="px-3 py-1.5 text-[11px] font-bold border border-slate-200 rounded-lg bg-slate-50 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all max-w-[180px]"
            />
          </div>

          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {filtered.length > 0 ? (
              filtered.map((student) => {
                const isEditing = editingStudentId === student.id;

                return (
                  <div
                    key={student.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isEditing 
                        ? "bg-blue-50/40 border-blue-200" 
                        : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/60"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                          student.sex === "Female" 
                            ? "bg-pink-100 text-pink-700 border border-pink-200" 
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {student.name.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white font-bold"
                            />
                            <textarea
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              placeholder="Notes..."
                              className="w-full px-2.5 py-1 text-xs border border-blue-200 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white font-medium resize-none"
                              rows={2}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-800 truncate block">
                                {student.name}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase shrink-0 ${
                                  student.sex === "Female" 
                                    ? "bg-pink-100 text-pink-700" 
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {student.sex}
                              </span>
                            </div>
                            {student.comment ? (
                              <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">{student.comment}</span>
                              </p>
                            ) : (
                              <p className="text-[10px] text-slate-400 italic font-medium">No notes added.</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1.5 shrink-0 border-t sm:border-t-0 border-slate-200/50 pt-2 sm:pt-0">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEdit(student.id)}
                            className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors cursor-pointer"
                            title="Save Changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingStudentId(null)}
                            className="px-2 py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(student)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Edit Student Info"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${student.name} from this class roster? This will permanently delete their grades for this class.`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Remove Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center space-y-1">
                <Info className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">No students found</p>
                <p className="text-[10px] text-slate-400">Search query returned no results, or the class has no students.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
