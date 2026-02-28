import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router'; 

// --- Firebase Imports ---
import { auth, db } from '../../../firebase/firebaseConfig'; 
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Soft Flowing Background Lines */}
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>

    {/* Top Right: Orbs */}
    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>

    {/* Middle Left: Bubble */}
    <View style={{ position: "absolute", top: 300, left: -40, opacity: 0.5 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Circle cx="40" cy="50" r="40" fill="#6EE7B7" opacity={0.4} />
        <Circle cx="60" cy="30" r="15" fill="#93C5FD" opacity={0.6} />
      </Svg>
    </View>

    {/* Bottom Right: Orbs */}
    <View style={{ position: "absolute", bottom: -50, right: -20, opacity: 0.6 }}>
      <Svg height="200" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="80" r="60" fill="#FDBA74" opacity={0.5} />
        <Circle cx="80" cy="40" r="30" fill="#FCA5A5" opacity={0.4} />
      </Svg>
    </View>

    {/* Floating Mini Bubbles */}
    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
    <View style={[styles.dot, { bottom: 120, left: 80, backgroundColor: "#F9A8D4", width: 10, height: 10, opacity: 0.8 }]} />
  </View>
);

// 1. Define the shape of your Exam data
interface Exam {
  id: string;
  title?: string;
  className?: string;
  subject?: string;
  totalMarks?: number;
  duration?: number;
  status?: string; // 👈 NEW: Added status to interface
  examDate?: { seconds: number; nanoseconds: number }; 
  [key: string]: any; 
}

export default function ExamsScreen() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter(); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("=== DEBUGGING EXAMS FETCH ===");
      
      if (!user) {
        console.log("-> No logged-in user found yet or user is signed out.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("1. Current User ID:", user.uid);

        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          console.log("-> User document does not exist in 'users' collection.");
          setLoading(false);
          return;
        }

        const userData = userDocSnap.data();
        const joinedClassIds = userData.joinedClasses || [];
        console.log("2. Student's joinedClasses array:", joinedClassIds);

        if (joinedClassIds.length === 0) {
          console.log("-> Student has not joined any classes (array is empty).");
          setExams([]);
          setLoading(false);
          return;
        }

        console.log("3. Querying 'exams' where 'classId' is IN:", joinedClassIds);
        const examsRef = collection(db, 'exams');
        const q = query(examsRef, where('classId', 'in', joinedClassIds));
        const querySnapshot = await getDocs(q);

        console.log(`4. Firestore returned ${querySnapshot.docs.length} matches.`);

        let fetchedExams: Exam[] = [];

        if (querySnapshot.docs.length === 0) {
            console.log("-> ⚠️ No matches found. Fetching ALL exams to display on screen...");
            const allExamsSnap = await getDocs(collection(db, 'exams'));
            
            fetchedExams = allExamsSnap.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
        } else {
            fetchedExams = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
        }

        // 👈 NEW: Filter out exams based on status field
        const ongoingExams = fetchedExams.filter(exam => exam.status === "ONGOING");
        console.log(`5. After filtering by status="ONGOING", ${ongoingExams.length} remain.`);

        // Sort the filtered exams
        ongoingExams.sort((a, b) => {
          const dateA = a.examDate?.seconds || 0;
          const dateB = b.examDate?.seconds || 0;
          return dateA - dateB; 
        });

        setExams(ongoingExams);
        
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const formatExamDate = (timestamp: any) => {
    if (!timestamp) return 'TBD';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Ongoing Exams</Text>
          <Text style={styles.pageSubtitle}>Tests active right now</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 60 }} />
        ) : exams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>No ongoing exams right now.</Text>
          </View>
        ) : (
          exams.map((exam) => (
            <View key={exam.id} style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconBox}>
                  <Ionicons name="create-outline" size={24} color="#4F46E5" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.examTitle}>{exam.title || 'Untitled Exam'}</Text>
                  <Text style={styles.classNameText}>{exam.className || exam.subject || 'Class'}</Text>
                </View>
                <View style={styles.marksBadge}>
                   <Text style={styles.marksText}>{exam.totalMarks || 100} pts</Text>
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
                  <Text style={styles.detailText}>{formatExamDate(exam.examDate)}</Text>
                </View>
                
                {exam.duration && (
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
                    <Text style={styles.detailText}>{exam.duration} mins</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity 
                style={styles.startButton}
                activeOpacity={0.8}
                onPress={() => {
                  router.push({
                    pathname: '/student/(exams)/takeExam',
                    params: { examId: exam.id } 
                });
              }}
              >
                <Text style={styles.startButtonText}>Start Exam</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  dot: { position: 'absolute', borderRadius: 100 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 },
  
  bgCircle: { position: "absolute", borderRadius: 999 },
  bgDot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },

  pageHeader: { marginBottom: 30 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: '#111827', marginBottom: 4 },
  pageSubtitle: { fontSize: 15, fontWeight: '500', color: '#6B7280' },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#9CA3AF', marginTop: 12, fontSize: 16, fontWeight: '500' },

  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 10, 
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  examTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 2 },
  classNameText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  marksBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  marksText: { fontSize: 13, fontWeight: '800', color: '#4B5563' },
  
  divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },
  
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },

  startButton: {
    marginTop: 20,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginRight: 6,
  }
});