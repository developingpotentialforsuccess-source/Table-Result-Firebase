import { Category } from "../types";

export const getStudentScoreValue = (
  scores: Record<string, number> | undefined,
  categoryId: string,
  itemIndex: number,
  mode: 'full' | 'midterm' | 'final',
  category?: Category
) => {
  if (!scores) return undefined;
  if (categoryId.startsWith('exam_')) return scores[`${categoryId}_${itemIndex}`];

  if (mode === 'midterm' || (mode === 'full' && category?.isMidterm)) {
    const midKey = `${categoryId}_${itemIndex}_midterm`;
    if (scores[midKey] !== undefined) return scores[midKey];
  }
  
  if (mode === 'final' || (mode === 'full' && category?.isFinal)) {
    const finalKey = `${categoryId}_${itemIndex}_final`;
    if (scores[finalKey] !== undefined) return scores[finalKey];
  }

  return scores[`${categoryId}_${itemIndex}`];
};

export const isMidtermCategory = (cat: Category | string) => {
  if (typeof cat === 'string') {
    const n = cat.toUpperCase();
    return n.includes("MID-TERM") || n.includes("MID TERM") || n.includes("MIDTERM") || n.includes("MID EXAM") || n.includes("MID TEST") || n.includes("GRAMMAR TEST");
  }
  
  if (cat.isMidterm === true) return true;
  if (cat.isMidterm === false) return false;
  
  // Implicit rule: If it has midtermWeight, but no finalWeight and no full term weight, it's a dedicated midterm category
  if ((cat.midtermWeight && cat.midtermWeight > 0) && (!cat.finalWeight || cat.finalWeight === 0) && (!cat.weight || cat.weight === 0)) {
    return true;
  }

  const n = cat.name.toUpperCase();
  return n.includes("MID-TERM") || n.includes("MID TERM") || n.includes("MIDTERM") || n.includes("MID EXAM") || n.includes("MID TEST") || n.includes("GRAMMAR TEST");
};

export const isFinalCategory = (cat: Category | string) => {
  if (typeof cat === 'string') {
    const n = cat.toUpperCase();
    return n.includes("FINAL") || n.includes("SPEAKING");
  }
  
  if (cat.isFinal === true) return true;
  if (cat.isFinal === false) return false;
  
  // Implicit rule
  if ((cat.finalWeight && cat.finalWeight > 0) && (!cat.midtermWeight || cat.midtermWeight === 0) && (!cat.weight || cat.weight === 0)) {
    return true;
  }

  const n = cat.name.toUpperCase();
  return n.includes("FINAL") || n.includes("SPEAKING");
};

export const isSubjectActiveInMode = (subject: any, mode: 'full' | 'midterm' | 'final') => {
  if (mode === 'full') return true;
  if (mode === 'midterm') {
    return subject.categories.some((cat: any) => 
      (cat.midtermWeight !== undefined && cat.midtermWeight > 0) || isMidtermCategory(cat)
    );
  }
  if (mode === 'final') {
    return subject.categories.some((cat: any) => 
      (cat.finalWeight !== undefined && cat.finalWeight > 0) || isFinalCategory(cat)
    );
  }
  return true;
};
