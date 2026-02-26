import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';

// --- Firebase Imports ---
import { auth, db } from '../../../firebase/firebaseConfig'; 
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

// 1. FIXED: Define Interface at the top level
interface Exam {
  id: string;
  title?: string;
  className?: string;
  subject?: string;
  totalMarks?: number;
  duration: number; 
  examDate?: { seconds: number; nanoseconds: number }; 
  [key: string]: any; 
}

// --- Background Decorations ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#E0E7FF" opacity={0.6} />
      </Svg>
    </View>
    <View style={[styles.bgCircle, { top: 60, left: -20, backgroundColor: "#DBEAFE", width: 100, height: 100, opacity: 0.5 }]} />
    <View style={[styles.bgDot, { top: 150, right: 80, backgroundColor: "#818CF8", opacity: 0.6 }]} />
    <View style={[styles.bgDot, { bottom: 100, left: 40, backgroundColor: "#C7D2FE", width: 20, height: 20 }]} />
  </View>
);

export default function ExamsScreen() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          setLoading(false);
          return;
        }

        const userData = userDocSnap.data();
        const joinedClassIds = userData.joinedClasses || [];

        const examsRef = collection(db, 'exams');
        let querySnapshot;

        if (joinedClassIds.length > 0) {
          const q = query(examsRef, where('classId', 'in', joinedClassIds));
          querySnapshot = await getDocs(q);
        } else {
          querySnapshot = await getDocs(examsRef);
        }

        // 2. FIXED: Map and cast to Exam interface
        const fetchedExams: Exam[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Capture duration from any likely field name
            duration: Number(data.duration ?? data.examDuration ?? data.timeLimit ?? 0)
          } as Exam;
        });

        fetchedExams.sort((a, b) => (a.examDate?.seconds || 0) - (b.examDate?.seconds || 0));
        setExams(fetchedExams);
        
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
      weekday: 'short', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Exams</Text>
          <Text style={styles.pageSubtitle}>Upcoming tests & assessments</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 60 }} />
        ) : exams.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#D1D5DB" />
            <Text style={styles.emptyText}>No upcoming exams scheduled.</Text>
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
                
                {/* 3. DURATION DISPLAYED HERE */}
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
                  <Text style={styles.detailText}>
                    {exam.duration > 0 ? `${exam.duration} mins` : 'N/A'}
                  </Text>
                </View>
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
  container: { flex: 1, backgroundColor: '#F9FAFB' },
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