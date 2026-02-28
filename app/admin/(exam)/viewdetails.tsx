import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle,  Path } from "react-native-svg";

// --- Firebase Imports ---
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

// --- Background Graphics ---
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

export default function EvaluateResponseScreen() {
  const router = useRouter(); 
  const { examId, responseId } = useLocalSearchParams(); 

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<any[]>([]);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  // --- 1. Fetch Data from DB ---
  useEffect(() => {
    const fetchDetails = async () => {
      if (!examId || !responseId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch the student's response
        const responseRef = doc(db, 'responses', responseId as string);
        const responseSnap = await getDoc(responseRef);
        
        if (!responseSnap.exists()) {
          Alert.alert("Error", "Student response not found.");
          setLoading(false);
          return;
        }
        
        const responseData = responseSnap.data();
        const submittedDate = responseData.submittedAt?.toDate() || new Date();

        setStudentInfo({
          name: responseData.userName || 'Unknown Student',
          email: responseData.userEmail || 'No email',
          score: responseData.score || 0,
          status: 'SUBMITTED',
          statusBg: '#D1FAE5',
          statusColor: '#10B981',
          submissionTime: submittedDate.toLocaleDateString() + ' ' + submittedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          initials: (responseData.userName || 'U').substring(0, 1).toUpperCase(),
        });

        // Fetch the exam to get the questions
        const examRef = doc(db, 'exams', examId as string);
        const examSnap = await getDoc(examRef);
        
        if (examSnap.exists()) {
          // FIX: Explicitly cast to 'any' to satisfy TypeScript
          const examData = examSnap.data() as any; 
          const studentAnswersMap = responseData.answers || {}; 

          if (examData.questions) {
            // Map student answers to the exam questions
            const mappedQuestions = examData.questions.map((q: any, index: number) => {
              const studentAns = studentAnswersMap[q.id] || studentAnswersMap[index.toString()];
              
              // Basic Correctness check (assuming q.correctAnswer holds the right answer)
              // This can be adjusted based on how your DB is structured
              const isCorrect = studentAns === q.correctAnswer; 

              return {
                ...q,
                number: index + 1,
                studentAnswer: studentAns || 'No answer provided',
                isCorrect: isCorrect,
                awardedPoints: isCorrect ? q.marks : 0
              };
            });
            
            setQuestions(mappedQuestions);
          }
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        Alert.alert("Error", "Could not fetch evaluation details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [examId, responseId]);

  if (loading) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B3CFF" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <BackgroundDecorations />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Response Details</Text>
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Student Info Card */}
        {studentInfo && (
          <View style={styles.card}>
            <View style={styles.studentHeaderRow}>
              <View style={styles.avatarPlaceholder}>
                <Text style={{color: '#3B3CFF', fontWeight:'bold', fontSize:18}}>
                  {studentInfo.initials}
                </Text>
              </View>
              <View style={styles.studentNameCol}>
                <Text style={styles.studentName}>{studentInfo.name}</Text>
                <Text style={styles.studentId}>{studentInfo.email}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: studentInfo.statusBg }]}>
                <Text style={[styles.statusText, { color: studentInfo.statusColor }]}>
                  {studentInfo.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.studentDetailsRow}>
              <View style={styles.studentDetailBlock}>
                <Text style={styles.detailLabel}>TOTAL SCORE</Text>
                <Text style={[styles.detailValue, { color: '#3B3CFF', fontSize: 16 }]}>{studentInfo.score} Pts</Text>
              </View>
              <View style={styles.studentDetailBlock}>
                <Text style={styles.detailLabel}>SUBMISSION TIME</Text>
                <Text style={styles.detailValue}>{studentInfo.submissionTime}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Dynamic Questions List */}
        {questions.length === 0 ? (
           <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>No questions found.</Text>
        ) : (
          questions.map((q, index) => (
            <View key={q.id || index} style={styles.card}>
              
              {/* Question Header */}
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumberText}>QUESTION {q.number} • {q.type || 'General'}</Text>
                <View style={[
                    styles.pointsBadge, 
                    { backgroundColor: q.isCorrect ? '#D1FAE5' : '#FEE2E2' }
                ]}>
                  <Text style={{ 
                      fontSize: 11, 
                      fontWeight: '700', 
                      color: q.isCorrect ? '#10B981' : '#EF4444' 
                  }}>
                    {q.isCorrect ? `+${q.marks}` : '0'} / {q.marks || 0} Marks
                  </Text>
                </View>
              </View>
              
              <Text style={styles.questionText}>{q.text}</Text>

              {/* Student Answer Display */}
              {q.type === 'Single Correct' || q.type === 'MCQ' || q.type === 'multiple_choice' ? (
                <View>
                  <View style={[
                    styles.mcqAnswerBox, 
                    q.isCorrect ? styles.mcqCorrect : styles.mcqIncorrect
                  ]}>
                    <Text style={[
                      styles.mcqAnswerText, 
                      q.isCorrect ? { color: '#065F46' } : { color: '#991B1B' }
                    ]}>
                      {q.studentAnswer}
                    </Text>
                    <Ionicons 
                      name={q.isCorrect ? "checkmark-circle" : "close-circle"} 
                      size={20} 
                      color={q.isCorrect ? "#10B981" : "#EF4444"} 
                    />
                  </View>
                  {!q.isCorrect && q.correctAnswer && (
                    <Text style={styles.correctAnswerNote}>
                      Correct Answer: {q.correctAnswer}
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.descriptiveBox}>
                  <Text style={styles.descriptiveText}>{q.studentAnswer}</Text>
                </View>
              )}
            </View>
          ))
        )}

      </ScrollView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#ffffff' },
  dot: { position: "absolute", borderRadius: 999 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: 'transparent' },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827', flex: 1, marginLeft: 12 },
  scrollArea: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  
  // Student Info
  studentHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  studentNameCol: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  studentId: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700' },
  studentDetailsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  studentDetailBlock: { flex: 1 },
  detailLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', marginBottom: 4 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827' },

  // Questions
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  questionNumberText: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5 },
  pointsBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden' },
  questionText: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 16, lineHeight: 22 },
  
  // Answer Styles
  mcqAnswerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  mcqCorrect: { backgroundColor: '#F0FDF4', borderColor: '#10B981' },
  mcqIncorrect: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  mcqAnswerText: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 10 },
  correctAnswerNote: { fontSize: 13, color: '#059669', marginTop: 8, marginLeft: 4, fontWeight: '600' },
  descriptiveBox: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  descriptiveText: { fontSize: 14, color: '#4B5563', fontStyle: 'italic', lineHeight: 22 },
});