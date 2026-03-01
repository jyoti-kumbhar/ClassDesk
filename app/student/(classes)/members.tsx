import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';

// --- Firebase Imports ---
import { db } from "../../../firebase/firebaseConfig"; 
// Swapped getDocs for onSnapshot for real-time updates and added more specific query filters
import { collection, query, where, onSnapshot } from "firebase/firestore";


const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Top Right Triangle/Shape */}
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#f1db90" />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" /> 
      </Svg>
    </View>

    {/* Squiggles */}
    <View style={{ position: "absolute", top: 220, right: 0, opacity: 0.4 }}>
        <Svg height="100" width="60" viewBox="0 0 60 100">
            <Path d="M10 10 Q 50 30 10 50 T 10 90" stroke="#FF8A65" strokeWidth="3" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", top: 180, left: -10, opacity: 0.3, transform: [{ rotate: '20deg' }] }}>
        <Svg height="60" width="100" viewBox="0 0 100 60">
            <Path d="M10 30 Q 30 10 50 30 T 90 30" stroke="#4461F2" strokeWidth="3" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", top: 380, right: 30, opacity: 0.25, transform: [{ rotate: '-15deg' }] }}>
         <Svg height="80" width="80" viewBox="0 0 80 80">
            <Path d="M10 40 Q 40 10 70 40 T 10 70" stroke="#FFB74D" strokeWidth="2" strokeDasharray="5, 5" fill="none" />
         </Svg>
    </View>
    <View style={{ position: "absolute", top: 450, left: -20, opacity: 0.2 }}>
         <Svg height="120" width="60" viewBox="0 0 60 120">
            <Path d="M30 10 Q 60 40 30 70 T 30 130" stroke="#4FC3F7" strokeWidth="4" fill="none" />
         </Svg>
    </View>

    {/* Top Left Yellow Circle */}
    <View style={[styles.bgCircle, { top: 40, left: -20, backgroundColor: "#f5d29d", width: 100, height: 100 }]} />
    
    {/* Scattered Dots */}
    <View style={[styles.bgDot, { top: 120, right: 80, backgroundColor: "#657cff" }]} />
    <View style={[styles.bgDot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
    <View style={[styles.bgDot, { bottom: 150, right: 20, backgroundColor: "#FF8A65" }]} />
    
    {/* Bottom Left Shapes */}
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="150" width="300" viewBox="0 0 100 100">
         <Circle cx="20" cy="150" r="150" fill="#f39dbec9" />
         <Path d="M60 80 L30 60 L50 90 Z" fill="#4481f2" opacity={1}/>
       </Svg>
    </View>

    {/* Bottom Right Corner */}
    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 150, height: 150, backgroundColor: "#63caf3", borderRadius: 60, opacity: 0.5 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 80, backgroundColor: "#e9967c", borderRadius: 40 }} />
    </View>
  </View>
);

export default function MembersScreen() {
  const { classId, className } = useLocalSearchParams();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // OPTIMIZED QUERY:
    // Filters by class membership AND role on the server side to reduce data transfer.
    const q = query(
      collection(db, "users"), 
      where("joinedClasses", "array-contains", classId),
      where("role", "==", "student") 
    );
    
    // Use onSnapshot for better performance/caching compared to getDocs.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const studentList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        // Destructure only needed fields to keep the state light.
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
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Class Members</Text>
          <Text style={styles.pageSubtitle}>
            {className || 'Class'} • {students.length} Students joined
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