import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { Level, ClassRecord, Student } from '../types';
import { saveLevel, saveClassRecord, saveStudent, getLocalStudents } from './firestoreUtils';

export interface BackupPayload {
  version: string;
  exportedAt: string;
  levels: Level[];
  classRecords: Array<ClassRecord & { studentsList?: Student[] }>;
}

/**
 * Creates the backup data structure without triggering a download.
 */
export async function createBackupData(user: any, levels: Level[], classRecords: ClassRecord[]): Promise<any> {
  const userId = user.uid;
  const backupClassRecords: Array<ClassRecord & { studentsList?: Student[] }> = [];

  for (const cr of classRecords) {
    let studentsList: Student[] = [];
    if (!isFirebaseConfigured()) {
      studentsList = getLocalStudents(userId, cr.id);
    } else {
      const studentsSnapshot = await getDocs(collection(db, 'classes', cr.id, 'students'));
      studentsList = studentsSnapshot.docs.map(d => d.data() as Student);
    }
    
    backupClassRecords.push({
      ...cr,
      studentsList
    });
  }

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    userId: user.uid,
    userEmail: user.email,
    levels,
    classRecords: backupClassRecords
  };
}
/**
 * Creates and downloads a JSON file containing the full website backup:
 * - All Class records (metadata)
 * - All Students and their grade scores for every class
 */
export async function exportFullBackup(userId: string, levels: Level[], classRecords: ClassRecord[]): Promise<void> {
  try {
    const backupClassRecords: Array<ClassRecord & { studentsList?: Student[] }> = [];

    for (const cr of classRecords) {
      // Fetch all students for this class
      let studentsList: Student[] = [];
      if (!isFirebaseConfigured()) {
        studentsList = getLocalStudents(userId, cr.id);
      } else {
        const studentsSnapshot = await getDocs(collection(db, 'classes', cr.id, 'students'));
        studentsList = studentsSnapshot.docs.map(d => d.data() as Student);
      }
      
      backupClassRecords.push({
        ...cr,
        studentsList
      });
    }

    const payload: BackupPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      levels,
      classRecords: backupClassRecords
    };

    // Trigger download of JSON file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const dateString = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute("download", `dps_gradebook_backup_${dateString}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (error) {
    console.error("Failed to export backup:", error);
    throw error;
  }
}

/**
 * Parses and restores full backup data into Firestore/Local structures.
 */
export async function importFullBackup(userId: string, backupJsonStr: string): Promise<void> {
  try {
    const payload: BackupPayload = JSON.parse(backupJsonStr);
    
    if (!payload.levels || !Array.isArray(payload.levels) || !payload.classRecords || !Array.isArray(payload.classRecords)) {
      throw new Error("Invalid backup file format. Must contain levels and classRecords.");
    }

    // 1. Restore Levels
    for (const lvl of payload.levels) {
      if (lvl && lvl.id) {
        await saveLevel(userId, lvl);
      }
    }

    // 2. Restore Class Records and their Students
    for (const cr of payload.classRecords) {
      if (cr && cr.id) {
        // Extract student list
        const { studentsList, ...metadata } = cr;
        
        // Save class record metadata
        await saveClassRecord(userId, metadata as ClassRecord);

        // Save each student to this class record's subcollection
        if (studentsList && Array.isArray(studentsList)) {
          for (const student of studentsList) {
            if (student && student.id) {
              await saveStudent(userId, cr.id, student);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Failed to import backup:", error);
    throw error;
  }
}
