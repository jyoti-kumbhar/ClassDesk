import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';

// --- Firebase Imports ---
import { db } from "../../../firebase/firebaseConfig"; 
import { collection, query, where, getDocs } from "firebase/firestore";

// --- Types ---
interface Student {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  username?: string;
  role: string;
}

// const { width: W } = Dimensions.get('window');

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>

    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>

    <View style={{ position: "absolute", bottom: -50, right: -20, opacity: 0.6 }}>
      <Svg height="200" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="80" r="60" fill="#FDBA74" opacity={0.5} />
        <Circle cx="80" cy="40" r="30" fill="#FCA5A5" opacity={0.4} />
      </Svg>
    </View>

    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
  </View>
);

export default function MembersScreen() {
  const { classId, className } = useLocalSearchParams();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classId) return;
      
      try {
        // Query users where joinedClasses array contains this classId
        // AND ensure they are actually students (just in case a teacher is in the array)
        const q = query(
          collection(db, "users"), 
          where("joinedClasses", "array-contains", classId),
          where("role", "==", "student") 
        );
        
        const querySnapshot = await getDocs(q);
        const studentList: Student[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Student, 'id'>)
        }));

        setStudents(studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [classId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4461F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundDecorations />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Information */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Class Members</Text>
          <Text style={styles.pageSubtitle}>
            {className || 'Class'} • {students.length} Students joined
          </Text>
        </View>

        {/* Students List */}
        <View style={styles.listContainer}>
          {students.length === 0 ? (
            <Text style={styles.emptyText}>No students have joined this class yet.</Text>
          ) : (
            students.map((student) => (
              <View key={student.id} style={styles.studentCard}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {(student.name || student.username || 'S').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.studentName}>{student.name || student.username || 'Anonymous Student'}</Text>
                  <Text style={styles.studentDetails}>
                    ID: {student.studentId || student.id.slice(0, 6).toUpperCase()}  •  {student.email || 'No Email'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  dot: { position: "absolute", borderRadius: 999 }, // Fixed style
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 120 },
  pageHeader: { marginBottom: 24 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 6 },
  pageSubtitle: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  listContainer: { gap: 12 },
  studentCard: { 
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 16,
    borderRadius: 18, 
    alignItems: 'center',
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    elevation: 1 
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E0E7FF'
  },
  avatarText: { fontSize: 18, fontWeight: 'bold', color: '#4461F2' },
  infoContainer: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  studentDetails: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontSize: 16 },
});