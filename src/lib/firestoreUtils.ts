import { collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, query, writeBatch, where } from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from './firebase';
import { Level, ClassRecord, Student } from '../types';

// In-memory listener sets to mimic real-time Firebase subscriptions in offline mode
const levelsListeners = new Set<(levels: Level[]) => void>();
const classesListeners = new Set<(classes: ClassRecord[]) => void>();
const studentsListeners = new Map<string, Set<(students: Student[]) => void>>();

export function getLocalLevels(userId: string): Level[] {
  try {
    const saved = localStorage.getItem(`gradecalc_local_levels_${userId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function setLocalLevels(userId: string, levels: Level[]) {
  localStorage.setItem(`gradecalc_local_levels_${userId}`, JSON.stringify(levels));
  levelsListeners.forEach(listener => {
    try { listener(levels); } catch (e) { console.error(e); }
  });
}

export function getLocalClasses(userId: string): ClassRecord[] {
  try {
    const saved = localStorage.getItem(`gradecalc_local_classes_${userId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function setLocalClasses(userId: string, classes: ClassRecord[]) {
  localStorage.setItem(`gradecalc_local_classes_${userId}`, JSON.stringify(classes));
  classesListeners.forEach(listener => {
    try { listener(classes); } catch (e) { console.error(e); }
  });
}

export function getLocalStudents(userId: string, classId: string): Student[] {
  try {
    const saved = localStorage.getItem(`gradecalc_local_students_${userId}_${classId}`);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function setLocalStudents(userId: string, classId: string, students: Student[]) {
  localStorage.setItem(`gradecalc_local_students_${userId}_${classId}`, JSON.stringify(students));
  const listeners = studentsListeners.get(classId);
  if (listeners) {
    listeners.forEach(listener => {
      try { listener(students); } catch (e) { console.error(e); }
    });
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function saveLevel(userId: string, level: Level) {
  if (!isFirebaseConfigured()) {
    const levels = getLocalLevels(userId);
    const index = levels.findIndex(l => l.id === level.id);
    if (index !== -1) {
      levels[index] = level;
    } else {
      levels.push(level);
    }
    setLocalLevels(userId, levels);
    return;
  }

  const path = `levels/${level.id}`;
  try {
    await setDoc(doc(db, 'levels', level.id), { ...level, authorId: userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveLevelsBatch(userId: string, levels: Level[]) {
  if (!isFirebaseConfigured()) {
    const currentLevels = getLocalLevels(userId);
    levels.forEach(newLevel => {
      const index = currentLevels.findIndex(l => l.id === newLevel.id);
      if (index !== -1) {
        currentLevels[index] = newLevel;
      } else {
        currentLevels.push(newLevel);
      }
    });
    setLocalLevels(userId, currentLevels);
    return;
  }

  const path = `levels (batch)`;
  try {
    const batch = writeBatch(db);
    levels.forEach(level => {
      const levelRef = doc(db, 'levels', level.id);
      batch.set(levelRef, { ...level, authorId: userId });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteLevel(userId: string, levelId: string) {
  if (!isFirebaseConfigured()) {
    const levels = getLocalLevels(userId);
    const updated = levels.filter(l => l.id !== levelId);
    setLocalLevels(userId, updated);
    return;
  }

  const path = `levels/${levelId}`;
  try {
    await deleteDoc(doc(db, 'levels', levelId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveClassRecord(userId: string, classRecord: ClassRecord) {
  if (!isFirebaseConfigured()) {
    const classes = getLocalClasses(userId);
    const index = classes.findIndex(c => c.id === classRecord.id);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ...metadata } = classRecord;
    // @ts-ignore - explicitly removing students from the object if it exists
    delete metadata.students;

    if (index !== -1) {
      classes[index] = metadata as ClassRecord;
    } else {
      classes.push(metadata as ClassRecord);
    }
    setLocalClasses(userId, classes);
    return;
  }

  const path = `classes/${classRecord.id}`;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ...metadata } = classRecord;
    // @ts-ignore - explicitly removing students from the object if it exists
    delete metadata.students;
    await setDoc(doc(db, 'classes', classRecord.id), { ...metadata, authorId: userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveStudent(userId: string, classId: string, student: Student) {
  if (!isFirebaseConfigured()) {
    const students = getLocalStudents(userId, classId);
    const index = students.findIndex(s => s.id === student.id);
    if (index !== -1) {
      students[index] = student;
    } else {
      students.push(student);
    }
    setLocalStudents(userId, classId, students);
    return;
  }

  const path = `classes/${classId}/students/${student.id}`;
  try {
    await setDoc(doc(db, 'classes', classId, 'students', student.id), { ...student, authorId: userId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveStudentsBatch(userId: string, classId: string, batchStudents: Student[]) {
  if (!isFirebaseConfigured()) {
    const students = getLocalStudents(userId, classId);
    batchStudents.forEach(newStudent => {
      const index = students.findIndex(s => s.id === newStudent.id);
      if (index !== -1) {
        students[index] = newStudent;
      } else {
        students.push(newStudent);
      }
    });
    setLocalStudents(userId, classId, students);
    return;
  }

  const path = `classes/${classId}/students (batch)`;
  try {
    // Firestore batch has a limit of 500 operations. We need to chunk the student list.
    const CHUNK_SIZE = 500;
    for (let i = 0; i < batchStudents.length; i += CHUNK_SIZE) {
      const chunk = batchStudents.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);
      chunk.forEach(student => {
        const studentRef = doc(db, 'classes', classId, 'students', student.id);
        batch.set(studentRef, { ...student, authorId: userId });
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStudent(userId: string, classId: string, studentId: string) {
  if (!isFirebaseConfigured()) {
    const students = getLocalStudents(userId, classId);
    const updated = students.filter(s => s.id !== studentId);
    setLocalStudents(userId, classId, updated);
    return;
  }

  const path = `classes/${classId}/students/${studentId}`;
  try {
    await deleteDoc(doc(db, 'classes', classId, 'students', studentId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToStudents(userId: string, classId: string, callback: (students: Student[]) => void) {
  if (!isFirebaseConfigured()) {
    if (!studentsListeners.has(classId)) {
      studentsListeners.set(classId, new Set());
    }
    const listeners = studentsListeners.get(classId)!;
    listeners.add(callback);
    
    // Initial data load
    callback(getLocalStudents(userId, classId));
    
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0) {
        studentsListeners.delete(classId);
      }
    };
  }

  const path = `classes/${classId}/students`;
  // We filter by authorId for security even if the class is segmented
  const q = query(collection(db, 'classes', classId, 'students'), where('authorId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const students = snapshot.docs.map(doc => doc.data() as Student);
    callback(students);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function deleteClassRecordRef(userId: string, classId: string) {
  if (!isFirebaseConfigured()) {
    const classes = getLocalClasses(userId);
    const updated = classes.filter(c => c.id !== classId);
    setLocalClasses(userId, updated);
    
    // Clean up local students storage for this class
    localStorage.removeItem(`gradecalc_local_students_${userId}_${classId}`);
    return;
  }

  const path = `classes/${classId}`;
  try {
    await deleteDoc(doc(db, 'classes', classId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToLevels(userId: string, callback: (levels: Level[]) => void) {
  if (!isFirebaseConfigured()) {
    levelsListeners.add(callback);
    callback(getLocalLevels(userId));
    return () => {
      levelsListeners.delete(callback);
    };
  }

  const path = `levels`;
  const q = query(collection(db, 'levels'), where('authorId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const levels = snapshot.docs.map(doc => doc.data() as Level);
    callback(levels);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export function subscribeToClasses(userId: string, callback: (classes: ClassRecord[]) => void) {
  if (!isFirebaseConfigured()) {
    classesListeners.add(callback);
    callback(getLocalClasses(userId));
    return () => {
      classesListeners.delete(callback);
    };
  }

  const path = `classes`;
  const q = query(collection(db, 'classes'), where('authorId', '==', userId));
  return onSnapshot(q, (snapshot) => {
    const classes = snapshot.docs.map(doc => doc.data() as ClassRecord);
    callback(classes);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}
