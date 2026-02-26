// services/examDatabase.ts
import { db } from '../../firebase/firebaseConfig'
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy 
} from 'firebase/firestore';

export const ExamDatabase = {
  // 1. Fetch All Exams from Firebase
  getExams: async () => {
    try {
      const q = query(collection(db, "exams"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Error fetching exams:", e);
      return [];
    }
  },

  // 2. Add New Exam to Firebase
  addExam: async (newExam: any) => {
    try {
      await addDoc(collection(db, "exams"), {
        ...newExam,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding exam:", e);
      throw e;
    }
  },

  // 3. Update Exam
  updateExam: async (id: string, updatedData: any) => {
    try {
      const examRef = doc(db, "exams", id);
      await updateDoc(examRef, updatedData);
    } catch (e) {
      console.error("Error updating exam:", e);
      throw e; // Added throw so the UI knows it failed
    }
  },

  // --- NEW METHOD ADDED HERE ---
  // 4. Update Exam Status (Specifically for Ending Exams)
  updateExamStatus: async (id: string, status: 'COMPLETED' | 'PUBLISHED' | 'DRAFT') => {
    try {
      const examRef = doc(db, "exams", id);
      await updateDoc(examRef, { status });
    } catch (e) {
      console.error("Error updating exam status:", e);
      throw e;
    }
  },

  // 5. Delete Exam
  deleteExam: async (id: string) => {
    try {
      await deleteDoc(doc(db, "exams", id));
    } catch (e) {
      console.error("Error deleting exam:", e);
      throw e;
    }
  },

  // 6. Get Single Exam
  getExamById: async (id: string) => {
    try {
      const examRef = doc(db, "exams", id);
      const snapshot = await getDoc(examRef);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (e) {
      console.error("Error fetching single exam:", e);
      return null;
    }
  }
};