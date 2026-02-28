import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';

// --- Firebase Imports ---
import { db } from "../../../firebase/firebaseConfig"; 
import { collection, query, where, getDocs } from "firebase/firestore";

const { width: W } = Dimensions.get('window');

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#f1db90" opacity={0.5} />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" opacity={0.5} /> 
      </Svg>
    </View>
    <View style={{ position: "absolute", top: 220, right: 0, opacity: 0.2 }}>
        <Svg height="100" width="60" viewBox="0 0 60 100">
          <Path d="M10 10 Q 50 30 10 50 T 10 90" stroke="#FF8A65" strokeWidth="3" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", top: 180, left: -10, opacity: 0.15 }}>
        <Svg height="60" width="100" viewBox="0 0 100 60">
          <Path d="M10 30 Q 30 10 50 30 T 90 30" stroke="#4461F2" strokeWidth="3" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.3 }}>
       <Svg height="150" width="300" viewBox="0 0 100 100">
         <Circle cx="20" cy="150" r="150" fill="#f39dbec9" />
       </Svg>
    </View>
    <View style={[styles.bgDot, { top: 120, right: 80, backgroundColor: "#657cff" }]} />
    <View style={[styles.bgDot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
  </View>
);

export default function MembersScreen() {
  const { classId, className } = useLocalSearchParams();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classId) return;
      
      try {
        // Query users where joinedClasses array contains this classId
        const q = query(
          collection(db, "users"), 
          where("joinedClasses", "array-contains", classId)
        );
        
        const querySnapshot = await getDocs(q);
        const studentList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
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
                    ID: {student.studentId || student.id.slice(0, 6).toUpperCase()}  •  {student.email || 'No Email'}
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