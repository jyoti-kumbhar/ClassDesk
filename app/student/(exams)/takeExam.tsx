import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert, 
  AppState, 
  BackHandler 
} from 'react-native';
// Removed unused Ionicons, Platform, and StatusBar
import Svg, { Path } from 'react-native-svg';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

// --- Firebase Imports ---
import { db, auth } from '../../../firebase/firebaseConfig'; 
import { doc, getDoc, collection, getDocs, addDoc, query, where, limit } from 'firebase/firestore'; 

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#f1db90" />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" /> 
      </Svg>
    </View>
    <View style={[styles.bgCircle, { top: 40, left: -20, backgroundColor: "#f5d29d", width: 100, height: 100 }]} />
    <View style={[styles.bgDot, { top: 120, right: 80, backgroundColor: "#657cff" }]} />
  </View>
);

export default function ActiveExamScreen() {
  const { examId } = useLocalSearchParams(); 
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [examDetails, setExamDetails] = useState<any>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null); 

  const warningCount = useRef(0);

  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const user = auth.currentUser;
      
      let totalScore = 0;
      let totalPossibleMarks = 0;

      const formattedResponses = questions.map((q, index) => {
        const selectedOptId = answers[q.id || index];
        const isCorrect = q.correctOptionId === selectedOptId;
        const qMarks = Number(q.marks || 1);
        totalPossibleMarks += qMarks;
        if (isCorrect) totalScore += qMarks;

        return {
          questionId: q.id || index,
          questionText: q.text,
          selectedOptionId: selectedOptId || null,
          isCorrect,
          marksGained: isCorrect ? qMarks : 0,
        };
      });

      await addDoc(collection(db, 'responses'), {
        examId,
        examName: examDetails.title,
        userId: user?.uid,
        userName: user?.displayName,
        userEmail: user?.email,
        responses: formattedResponses,
        submittedAt: new Date(),
        score: totalScore,
        totalPossibleMarks: totalPossibleMarks
      });

      router.replace('/student/(main)/exam');
    } catch (error) {
      console.error("Submission Error:", error);
      setIsSubmitting(false);
    }
  }, [examId, examDetails.title, answers, questions, isSubmitting, router]);

  const handleCheatAttempt = useCallback(async (reason: string) => {
    if (isSubmitting || timeLeft === null || timeLeft <= 0 || loading) return;
    
    warningCount.current += 1;
    const user = auth.currentUser;
    try {
      await addDoc(collection(db, 'alerts'), {
        examId, 
        studentName: user?.displayName, 
        message: reason, 
        timestamp: new Date()
      });
    } catch {
        // Ignored error 'e' to satisfy linter
    }

    if (warningCount.current >= 3) {
      Alert.alert("Exam Terminated", "Maximum warnings exceeded.");
      handleSubmit(true);
    } else {
      Alert.alert(`Warning ${warningCount.current}/3`, reason);
    }
  }, [examId, isSubmitting, timeLeft, loading, handleSubmit]);

  useEffect(() => {
    const initExam = async () => {
      if (!examId || !auth.currentUser) return;
      try {
        const respQuery = query(
          collection(db, 'responses'), 
          where('examId', '==', examId), 
          where('userId', '==', auth.currentUser.uid),
          limit(1)
        );
        const respSnap = await getDocs(respQuery);
        if (!respSnap.empty) {
          Alert.alert("Denied", "Exam already submitted.");
          router.replace('/student/(main)/exam');
          return;
        }

        const examSnap = await getDoc(doc(db, 'exams', examId as string));
        if (examSnap.exists()) {
          const data = examSnap.data();
          setExamDetails({ title: data.title, className: data.className });
          const minutes = Number(data.durationMinutes || 60);
          setTimeLeft(minutes * 60);
          setQuestions(data.questions || []);
        }
      } catch (error) {
        console.error("Init Error:", error);
      } finally {
        setLoading(false);
      }
    };
    initExam();
  }, [examId, router]); // Added router to dependency array

  // Timer logic
  useEffect(() => {
    if (!loading && !isSubmitting && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => (prev! > 0 ? prev! - 1 : 0)), 1000);
      return () => clearInterval(timer);
    }
  }, [loading, isSubmitting, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !isSubmitting) handleSubmit(true);
  }, [timeLeft, isSubmitting, handleSubmit]);

  // Secure Exam Listeners (AppState and BackButton)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        handleCheatAttempt("App minimized or tab switched");
      }
    });

    const backAction = () => {
      handleCheatAttempt("Back button pressed");
      return true; // Prevents the actual back navigation
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      subscription.remove();
      backHandler.remove();
    };
  }, [handleCheatAttempt]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading || isSubmitting) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadText}>{isSubmitting ? 'Finalizing...' : 'Syncing Exam...'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <BackgroundDecorations />
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSubtitle}>{examDetails.className?.toUpperCase()}</Text>
          <Text style={styles.headerTitle}>{examDetails.title}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>TIME LEFT</Text>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {questions.map((q, index) => (
          <View key={q.id || index} style={styles.questionCard}>
            <Text style={styles.questionText}>{index + 1}. {q.text}</Text>
            {q.options?.map((opt: any) => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.optionRow, answers[q.id || index] === opt.id && styles.optionRowSelected]}
                onPress={() => setAnswers(prev => ({ ...prev, [q.id || index]: opt.id }))}
              >
                <View style={[styles.radio, answers[q.id || index] === opt.id && styles.radioActive]} />
                <Text style={styles.optionText}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit(false)}>
          <Text style={styles.submitBtnText}>Submit Exam</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  loadText: { marginTop: 10, fontWeight: '600', color: '#4B5563' },
  bgCircle: { position: "absolute", borderRadius: 999 },
  bgDot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },
  headerContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 10, color: '#4F46E5', fontWeight: '800' },
  timerContainer: { alignItems: 'flex-end' },
  timerLabel: { fontSize: 10, fontWeight: '700', color: '#DC2626' },
  timerText: { fontSize: 18, fontWeight: 'bold', color: '#DC2626' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  questionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 15, elevation: 2 },
  questionText: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  optionRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 8, backgroundColor: '#F9FAFB' },
  optionRowSelected: { backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#4F46E5' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#D1D5DB', marginRight: 10 },
  radioActive: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  optionText: { fontSize: 14, color: '#4B5563' },
  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#E5E7EB' },
  submitBtn: { backgroundColor: '#1D4ED8', padding: 18, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});