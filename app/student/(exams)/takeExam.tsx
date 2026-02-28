import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar, ActivityIndicator, Alert, AppState, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';

// --- Firebase Imports ---
import { db, auth } from '../../../firebase/firebaseConfig'; 
import { doc, getDoc, collection, getDocs, addDoc } from 'firebase/firestore'; 

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

  // --- Logic Helpers ---
  const isTimerRunning = !loading && !isSubmitting && timeLeft !== null && timeLeft > 0;
  const isTimeUp = timeLeft === 0;

  // 1. Memoized Handlers
  const handleSubmit = useCallback(async (isAutoSubmit = false) => {
    if (isSubmitting) return;
    if (!isAutoSubmit && Object.keys(answers).length < questions.length) {
      Alert.alert("Incomplete Exam", "Please answer all questions before submitting.");
      return;
    }

    try {
      setIsSubmitting(true);
      const user = auth.currentUser;
      
      let totalScore = 0;
      let totalPossibleMarks = 0;

      const formattedResponses = questions.map((q, index) => {
        const selectedOptId = answers[q.id || index];
        const selectedOpt = q.options?.find((o: any) => o.id === selectedOptId);
        
        // 👈 CALCULATE MARKS
        const questionMarks = q.marks ? Number(q.marks) : 1;
        totalPossibleMarks += questionMarks;
        
        // Check if selected option matches the correct option defined in DB
        const isCorrect = q.correctOptionId === selectedOptId;
        if (isCorrect) {
          totalScore += questionMarks;
        }

        return {
          questionId: q.id || index,
          questionText: q.text,
          selectedOptionId: selectedOptId || null,
          selectedOptionText: selectedOpt ? selectedOpt.text : null,
          isCorrect,
          marksGained: isCorrect ? questionMarks : 0,
          marksWeight: questionMarks
        };
      });

      // 👈 SAVE RESPONSE WITH USER DETAILS AND SCORE
      await addDoc(collection(db, 'responses'), {
        examId,
        examName: examDetails.title,
        className: examDetails.className,
        userId: user?.uid || 'Unknown',
        userName: user?.displayName || 'Student',
        userEmail: user?.email || 'No Email', // Added email
        responses: formattedResponses,
        submittedAt: new Date(),
        isAutoSubmitted: isAutoSubmit, 
        warningsIssued: warningCount.current,
        score: totalScore, // Calculated marks
        totalPossibleMarks: totalPossibleMarks
      });

      router.replace('/student/(main)/exam');
    } catch (error) {
      console.error("Error submitting:", error);
      setIsSubmitting(false);
    }
  }, [examId, examDetails, answers, questions, isSubmitting, router]);

  const handleCheatAttempt = useCallback(async (reason: string) => {
    if (isSubmitting || timeLeft === null || timeLeft <= 0 || loading) return;

    warningCount.current += 1;
    const currentWarnings = warningCount.current;
    const user = auth.currentUser;

    try {
      // 👈 SAVE ALERTS WITH STUDENT NAME AND EMAIL
      await addDoc(collection(db, 'alerts'), {
        examId,
        examTitle: examDetails.title || 'Unknown Exam',
        studentId: user?.uid || 'Unknown',
        studentName: user?.displayName || 'Student',
        studentEmail: user?.email || 'No Email', // Added email
        message: reason,
        warningNumber: currentWarnings,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: new Date()
      });
    } catch (e) {
      console.error("Failed to log cheat alert:", e);
    }

    if (currentWarnings >= 3) {
      Alert.alert("Exam Terminated", "Maximum warnings exceeded. Auto-submitting...");
      handleSubmit(true);
    } else {
      Alert.alert(`Warning ${currentWarnings}/3`, `Activity detected: ${reason}.`);
    }
  }, [examId, examDetails.title, isSubmitting, timeLeft, loading, handleSubmit]);

  // 2. Data Fetching
  useEffect(() => {
    const fetchExamData = async () => {
      if (!examId) return;
      try {
        const examRef = doc(db, 'exams', examId as string);
        const examSnap = await getDoc(examRef);

        if (examSnap.exists()) {
          const data = examSnap.data();
          setExamDetails({
            title: data.title || 'Untitled Exam',
            className: data.className || 'Class',
          });

          const dbValue = data.duration ?? data.examDuration ?? data.timeLimit;
          const minutes = Number(dbValue);
          setTimeLeft(!isNaN(minutes) && minutes > 0 ? minutes * 60 : 60 * 60);

          if (data.questions && Array.isArray(data.questions)) {
            setQuestions(data.questions);
          } else {
            const qRef = collection(db, 'exams', examId as string, 'questions');
            const qSnap = await getDocs(qRef);
            setQuestions(qSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          }
        }
      } catch (error) {
        console.error("Error fetching exam:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExamData();
  }, [examId]);

  // 3. Timer Effect
  useEffect(() => {
    if (!isTimerRunning) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId); 
  }, [isTimerRunning]);

  // 4. Auto-Submit Effect
  useEffect(() => {
    if (isTimeUp && !isSubmitting && !loading) {
      handleSubmit(true);
    }
  }, [isTimeUp, isSubmitting, loading, handleSubmit]);

  // 5. Security Effects
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'inactive' || nextAppState === 'background') {
        handleCheatAttempt("Switched tabs or minimized the app");
      }
    });
    return () => subscription.remove();
  }, [handleCheatAttempt]);

  useEffect(() => {
    const backAction = () => {
      if (!isSubmitting && timeLeft !== null && timeLeft > 0) {
        handleCheatAttempt("Attempted to exit exam using back button");
        return true; 
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isSubmitting, timeLeft, handleCheatAttempt]);

  // 6. Formatting & Selection
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "-- : --";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  if (loading || isSubmitting) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 10, color: '#4B5563', fontWeight: '600' }}>
          {isSubmitting ? 'Submitting Exam...' : 'Loading Exam...'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <BackgroundDecorations />

      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSubtitle}>{examDetails.className?.toUpperCase()}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{examDetails.title}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>REMAINING</Text>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.warningBanner}>
          <Ionicons name="shield-checkmark" size={16} color="#B45309" />
          <Text style={styles.warningText}>Secure Exam Mode Active. Monitoring active.</Text>
        </View>

        {questions.map((q, index) => (
          <View key={q.id || index} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.questionNumberBadge}>
                <Text style={styles.questionNumberText}>QUESTION {index + 1}</Text>
              </View>
              <Text style={styles.marksText}>{q.marks ? Number(q.marks).toFixed(1) : '1.0'} Mark</Text>  
            </View>
            <Text style={styles.questionText}>{q.text}</Text>
            <View style={styles.optionsContainer}>
              {q.options?.map((opt: any) => {
                const isSelected = answers[q.id || index] === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                    onPress={() => handleSelectOption(q.id || index, opt.id)}
                  >
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <Text style={[styles.optionIdText, isSelected && styles.optionIdTextSelected]}>{opt.id}.</Text>
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit(false)}>
          <Text style={styles.submitBtnText}>Submit Exam</Text>
          <Ionicons name="send" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  bgCircle: { position: "absolute", borderRadius: 999 },
  bgDot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'rgba(255,255,255,0.85)',
    zIndex: 10,
  },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: '#4F46E5', letterSpacing: 1, marginBottom: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  timerContainer: { alignItems: 'flex-end', marginLeft: 10 },
  timerLabel: { fontSize: 10, fontWeight: '700', color: '#DC2626', letterSpacing: 0.5 },
  timerText: { fontSize: 18, fontWeight: 'bold', color: '#DC2626' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 140 },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 243, 199, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 24,
    gap: 10,
  },
  warningText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#92400E', lineHeight: 18 },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    elevation: 3,
  },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  questionNumberBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  questionNumberText: { fontSize: 10, fontWeight: '800', color: '#4F46E5', letterSpacing: 0.5 },
  marksText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  questionText: { fontSize: 16, fontWeight: 'bold', color: '#111827', lineHeight: 24, marginBottom: 24 },
  optionsContainer: { gap: 12 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 250, 251, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionRowSelected: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: '#FFF' },
  radioCircleSelected: { borderColor: '#4F46E5' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4F46E5' },
  optionIdText: { fontSize: 14, fontWeight: '800', color: '#6B7280', marginRight: 8 },
  optionIdTextSelected: { color: '#4F46E5' },
  optionText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#4B5563' },
  optionTextSelected: { color: '#111827' },
  bottomSection: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: 'rgba(249, 250, 251, 0.9)',
  },
  submitBtn: {
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
  },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF' },
});