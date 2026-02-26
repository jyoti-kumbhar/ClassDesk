import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@classes_data';

// --- Types ---
export interface Classroom {
  id: string;
  title: string;
  subject: string;
  section: string;
  students: number;
  // UI Customization
  iconText?: string; // For initials like "10A"
  iconName?: string; // For ionicons name like "flask"
  iconColor: string;
  iconBg: string;
}

// --- Initial Mock Data (Loads if DB is empty) ---
const INITIAL_CLASSES: Classroom[] = [
  {
    id: 'c1',
    title: '10-A Mathematics',
    subject: 'Mathematics',
    section: '10-A',
    students: 32,
    iconText: 'Σ',
    iconColor: '#4461F2',
    iconBg: '#EFF6FF',
  },
  {
    id: 'c2',
    title: '12-B Physics',
    subject: 'Physics',
    section: '12-B',
    students: 28,
    iconName: 'flask',
    iconColor: '#9333EA',
    iconBg: '#F3E8FF',
  },
  {
    id: 'c3',
    title: '9-C History',
    subject: 'History',
    section: '9-C',
    students: 45,
    iconName: 'earth',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
  }
];

export const ClassDatabase = {
  // 1. Get All Classes
  getClasses: async (): Promise<Classroom[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        return JSON.parse(jsonValue);
      } else {
        // Initialize with default data if empty
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CLASSES));
        return INITIAL_CLASSES;
      }
    } catch (e) {
      console.error("Error reading class data", e);
      return [];
    }
  },

  // 2. Add New Class
  addClass: async (newClass: Classroom) => {
    try {
      const currentClasses = await ClassDatabase.getClasses();
      const updatedClasses = [newClass, ...currentClasses];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedClasses));
      return true;
    } catch (e) {
      console.error("Error adding class", e);
      return false;
    }
  },

  // 3. Get Single Class
  getClassById: async (id: string) => {
    const all = await ClassDatabase.getClasses();
    return all.find((c) => c.id === id);
  },

  // 4. Delete Class
  deleteClass: async (id: string) => {
    try {
      const currentClasses = await ClassDatabase.getClasses();
      const newList = currentClasses.filter((c) => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      return true;
    } catch (e) {
      return false;
    }
  }
};