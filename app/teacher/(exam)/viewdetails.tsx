import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle, Line, Path } from "react-native-svg";
import { ExamDatabase } from '../../services/examDatabase';

const { width } = Dimensions.get('window');
const STUDENT_INFO = {
    name: 'Amara Walker',
    id: 'ID: CD-2024-8832',
    status: 'SUBMITTED',
    statusBg: '#D1FAE5',
    statusColor: '#10B981',
    class: 'Grade 10 - Section B',
    submissionTime: 'Oct 24, 10:45 AM',
    initials: 'A',
};

// --- Background Graphics ---
const BackgroundDecorations = () => (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ position: "absolute", top: 30, right: -40 }}>
            <Svg height="200" width="200" viewBox="0 0 200 200">
                <Circle cx="100" cy="100" r="80" fill="#F3E8FF" opacity={0.6} />
                <Circle cx="100" cy="100" r="50" fill="#E9D5FF" opacity={0.4} />
            </Svg>
        </View>
        <View style={{ position: "absolute", top: 60, left: 20 }}>
            <Svg height="100" width="120" viewBox="0 0 120 100">
                <Line x1="10" y1="0" x2="10" y2="60" stroke="#BAE6FD" strokeWidth="2" strokeDasharray="5, 5" />
                <Path d="M 10 60 Q 10 90 40 90 L 80 90" stroke="#BAE6FD" strokeWidth="2" fill="none" />
                <Circle cx="80" cy="90" r="4" fill="#60A5FA" opacity={0.6} />
            </Svg>
        </View>
        <View style={{ position: "absolute", top: 220, width: width, alignItems: 'center', opacity: 0.4 }}>
            <Svg height="150" width={width} viewBox={`0 0 ${width} 150`}>
                <Path d={`M -20 75 C ${width * 0.3} 120, ${width * 0.7} 30, ${width + 20} 75`} stroke="#99F6E4" strokeWidth="3" fill="none" />
                <Path d={`M -20 90 C ${width * 0.3} 135, ${width * 0.7} 45, ${width + 20} 90`} stroke="#CCFBF1" strokeWidth="2" fill="none" strokeDasharray="10, 10" />
                <Circle cx={width * 0.2} cy="85" r="3" fill="#34D399" />
                <Circle cx={width * 0.8} cy="65" r="5" stroke="#34D399" strokeWidth="2" fill="#FFF" />
            </Svg>
        </View>
    </View>
);

export default function EvaluateResponseScreen() {
    const router = useRouter();
    const { examId } = useLocalSearchParams();

    // --- State ---
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<any[]>([]);
    const [totalScore, setTotalScore] = useState(0);

    // Form State
    const [marksObtained, setMarksObtained] = useState('');
    const [feedback, setFeedback] = useState('Great work!');

    // --- 1. Fetch Data from DB ---
    useEffect(() => {
        const fetchExamDetails = async () => {
            if (examId) {
                try {
                    const examData = await ExamDatabase.getExamById(examId as string);
                    
                    // FIX: Type assertion to access 'questions' property
                    const exam = examData as any;

                    if (exam && exam.questions) {
                        const questionsWithMockAnswers = exam.questions.map((q: any) => {
                            const isCorrectMock = Math.random() > 0.4;
                            return {
                                ...q,
                                studentAnswer: q.options && q.options.length > 0 ? q.options[0].text : 'This is a sample descriptive answer.',
                                isCorrect: isCorrectMock,
                                awardedPoints: isCorrectMock ? q.marks : '0'
                            };
                        });

                        setQuestions(questionsWithMockAnswers);

                        const total = questionsWithMockAnswers.reduce((sum: number, q: any) => sum + Number(q.marks || 0), 0);
                        setTotalScore(total);

                        const obtained = questionsWithMockAnswers.reduce((sum: number, q: any) => sum + Number(q.awardedPoints || 0), 0);
                        setMarksObtained(obtained.toString());
                    }
                } catch (error) {
                    console.error("Error fetching exam:", error);
                    Alert.alert("Error", "Could not fetch exam details.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchExamDetails();
    }, [examId, router]); // Added router to dependencies

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

            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Evaluate Response</Text>
                    <Text style={styles.headerRightAction}>Reviewing</Text>
                </View>

                <ScrollView
                    style={styles.scrollArea}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >

                    {/* Student Info Card */}
                    <View style={styles.card}>
                        <View style={styles.studentHeaderRow}>
                            <View style={styles.avatarPlaceholder}>
                                <Text style={{ color: '#3B3CFF', fontWeight: 'bold', fontSize: 18 }}>
                                    {STUDENT_INFO.initials}
                                </Text>
                            </View>
                            <View style={styles.studentNameCol}>
                                <Text style={styles.studentName}>{STUDENT_INFO.name}</Text>
                                <Text style={styles.studentId}>{STUDENT_INFO.id}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: STUDENT_INFO.statusBg }]}>
                                <Text style={[styles.statusText, { color: STUDENT_INFO.statusColor }]}>
                                    {STUDENT_INFO.status}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.studentDetailsRow}>
                            <View style={styles.studentDetailBlock}>
                                <Text style={styles.detailLabel}>CLASS</Text>
                                <Text style={styles.detailValue}>{STUDENT_INFO.class}</Text>
                            </View>
                            <View style={styles.studentDetailBlock}>
                                <Text style={styles.detailLabel}>SUBMISSION TIME</Text>
                                <Text style={styles.detailValue}>{STUDENT_INFO.submissionTime}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Dynamic Questions List */}
                    {questions.map((q, index) => (
                        <View key={q.id || index} style={styles.card}>

                            <View style={styles.questionHeader}>
                                <Text style={styles.questionNumberText}>QUESTION {q.number} • {q.type}</Text>
                                <View style={[
                                    styles.pointsBadge,
                                    {
                                        backgroundColor: q.isCorrect ? '#D1FAE5' : '#FEE2E2'
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '700',
                                        color: q.isCorrect ? '#10B981' : '#EF4444'
                                    }}>
                                        {q.isCorrect ? `+${q.marks}` : '0.0'} Marks
                                    </Text>
                                </View>
                            </View>

                            <Text style={styles.questionText}>{q.text}</Text>

                            {q.type === 'Single Correct' || q.type === 'MCQ' ? (
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
                                </View>
                            ) : (
                                <View style={styles.descriptiveBox}>
                                    <Text style={styles.descriptiveText}>{q.studentAnswer}</Text>
                                </View>
                            )}
                        </View>
                    ))}

                    {/* Grading Section */}
                    <View style={styles.gradingSection}>
                        <View style={styles.marksRow}>
                            <View style={styles.marksInputWrapper}>
                                <Text style={styles.inputLabel}>MARKS OBTAINED</Text>
                                <TextInput
                                    style={styles.marksInput}
                                    value={marksObtained}
                                    onChangeText={setMarksObtained}
                                    keyboardType="decimal-pad"
                                />
                            </View>
                            <View style={styles.totalMarksWrapper}>
                                <Text style={styles.inputLabel}>TOTAL</Text>
                                <View style={styles.totalMarksBox}>
                                    <Text style={styles.totalMarksText}>
                                        / {totalScore.toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.inputLabel}>FEEDBACK COMMENT</Text>
                        <TextInput
                            style={styles.feedbackInput}
                            value={feedback}
                            onChangeText={setFeedback}
                            multiline
                            textAlignVertical="top"
                            placeholder="Enter feedback for the student..."
                        />
                    </View>

                </ScrollView>

                {/* Save Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.saveBtn}
                        activeOpacity={0.8}
                        onPress={() => {
                            Alert.alert("Success", "Evaluation saved successfully!", [
                                { text: "OK", onPress: () => router.back() }
                            ]);
                        }}
                    >
                        <Text style={styles.saveBtnText}>Save Grade</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#FFF9F0' },
    keyboardContainer: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, backgroundColor: 'transparent' },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827', flex: 1, marginLeft: 12 },
    headerRightAction: { color: '#3B3CFF', fontSize: 14, fontWeight: '600' },
    scrollArea: { flex: 1 },
    contentContainer: { padding: 20, paddingBottom: 40 },
    card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
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
    questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    questionNumberText: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5 },
    pointsBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
    questionText: { fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 16, lineHeight: 22 },
    mcqAnswerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
    mcqCorrect: { backgroundColor: '#F0FDF4', borderColor: '#10B981' },
    mcqIncorrect: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
    mcqAnswerText: { fontSize: 15, fontWeight: '600' },
    descriptiveBox: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
    descriptiveText: { fontSize: 14, color: '#4B5563', fontStyle: 'italic', lineHeight: 22 },
    gradingSection: { marginTop: 8, marginBottom: 20 },
    marksRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 16 },
    marksInputWrapper: { flex: 2 },
    totalMarksWrapper: { flex: 1 },
    inputLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 8 },
    marksInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, height: 48, paddingHorizontal: 16, fontSize: 15, color: '#111827' },
    totalMarksBox: { backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center' },
    totalMarksText: { fontSize: 15, fontWeight: '600', color: '#111827' },
    feedbackInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, height: 100, fontSize: 14, color: '#4B5563' },
    footer: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    saveBtn: { backgroundColor: '#3B3CFF', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});