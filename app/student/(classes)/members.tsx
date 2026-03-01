import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
// --- Firebase Imports ---
import { db } from "../../../firebase/firebaseConfig";
// Swapped getDocs for onSnapshot for real-time updates and added more specific query filters
import { collection, onSnapshot, query, where } from "firebase/firestore";


const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: 30, right: -40 }}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill="#F3E8FF" opacity={0.6} />
        <Circle cx="100" cy="100" r="50" fill="#E9D5FF" opacity={0.4} />
      </Svg>
    </View>
    <View style={{ position: "absolute", bottom: 40, right: -20, opacity: 0.9 }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        <Circle cx="200" cy="200" r="150" fill="#fdf0fd" />
        <Path d="M 100 200 Q 120 120 200 100" stroke="#fbccf9" strokeWidth="30" strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  </View>
);

export default function MembersScreen() {
  const params = useGlobalSearchParams();
  
  // 1. ROBUST ID PARSING (Fixes the missing ID bug)
  const extractedId = params.id || params.classId || params.class_id;
  const currentClassId = typeof extractedId === "string" ? extractedId : (Array.isArray(extractedId) ? extractedId[0] : "");
  const currentClassName = typeof params.className === "string" ? params.className : (typeof params.grade === "string" ? params.grade : 'Class');

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2. USE THE ROBUST ID
    if (!currentClassId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, "users"), 
      where("joinedClasses", "array-contains", currentClassId),
      where("role", "==", "student") 
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        studentId: doc.data().studentId,
        username: doc.data().username,
      }));

      setStudents(studentList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching students:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentClassId]); // <-- Don't forget to update the dependency array!

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
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Class Members</Text>
          <Text style={styles.pageSubtitle}>
            {/* 3. USE THE ROBUST CLASS NAME */}
            {currentClassName} • {students.length} Students joined
          </Text>
        </View>

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
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 120 },
  bgDot: { position: "absolute", width: 12, height: 12, borderRadius: 6, opacity: 0.3 },
  bgCircle: { position: "absolute", borderRadius: 999 },
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