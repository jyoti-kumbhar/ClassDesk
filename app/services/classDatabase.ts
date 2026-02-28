import { db } from '../../firebase/firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  deleteDoc 
} from 'firebase/firestore';

export interface Classroom {
  id?: string;
  title: string;
  subject: string;
  section: string;
  students: number | any[]; // Handles both a flat number or an array of student objects
  iconText?: string; 
  iconName?: string; 
  iconColor: string;
  iconBg: string;
}

export const ClassDatabase = {
  // 1. Get All Classes from Firebase
  getClasses: async () => {
    try {
      const snapshot = await getDocs(collection(db, "classes"));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Error reading class data from Firebase", e);
      return [];
    }
  },

  // 2. Add New Class to Firebase
  addClass: async (newClass: Omit<Classroom, 'id'>) => {
    try {
      await addDoc(collection(db, "classes"), newClass);
      return true;
    } catch (e) {
      console.error("Error adding class to Firebase", e);
      return false;
    }
  },

  // 3. Get Single Class
  getClassById: async (id: string) => {
    try {
      const docRef = doc(db, "classes", id);
      const snapshot = await getDoc(docRef);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (e) {
      console.error("Error fetching single class", e);
      return null;
    }
  },

  // 4. Delete Class
  deleteClass: async (id: string) => {
    try {
      await deleteDoc(doc(db, "classes", id));
      return true;
    } catch (e) {
      console.error("Error deleting class", e);
      return false;
    }
  }
};