import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

// --- Mock Data ---
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

const QUESTIONS_DATA = [
  {
    id: 'q1',
    number: '01',
    type: 'MCQ',
    points: '+1.0 Mark',
    pointsColor: '#10B981',
    pointsBg: '#D1FAE5',
    questionText: 'What is the value of x in the equation 2x + 5 = 15?',
    studentAnswer: 'x = 5',
    isCorrect: true,
  },
  {
    id: 'q2',
    number: '02',
    type: 'MCQ',
    points: '0.0 Marks',
    pointsColor: '#EF4444',
    pointsBg: '#FEE2E2',
    questionText: 'Identify the prime number among the following options:',
    studentAnswer: '9',
    correctAnswer: '11',
    isCorrect: false,
  },
  {
    id: 'q3',
    number: '03',
    type: 'DESCRIPTIVE',
    points: 'Max 5.0 Marks',
    pointsColor: '#3B3CFF',
    pointsBg: '#EEF2FF',
    questionText: 'Explain the Pythagorean theorem and provide a real-world application.',
    studentAnswer: '"The Pythagorean theorem states that in a right-angled triangle, the square of the hypotenuse is equal to the sum of the squares of the other two sides (a² + b² = c²). A real-world application is architecture, where builders use it to..."',
  },
];

export default function EvaluateResponseScreen() {
  const router = useRouter(); 
  const [marksObtained, setMarksObtained] = useState('0.0');
  const [feedback, setFeedback] = useState('Great work on the application part...');

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/admin/exam' as any)} style={styles.backButton}>
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
              <Ionicons name="person" size={20} color="#3B3CFF" />
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

        {/* Questions List */}
        {QUESTIONS_DATA.map((q) => (
          <View key={q.id} style={styles.card}>
            {/* Question Header */}
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumberText}>QUESTION {q.number} • {q.type}</Text>
              <Text style={[styles.pointsBadge, { color: q.pointsColor, backgroundColor: q.pointsBg }]}>
                {q.points}
              </Text>
            </View>
            
            <Text style={styles.questionText}>{q.questionText}</Text>

            {/* Render based on Question Type */}
            {q.type === 'MCQ' ? (
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
                  <Text style={styles.correctAnswerNote}>Correct answer: {q.correctAnswer}</Text>
                )}
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
                <Text style={styles.totalMarksText}>/ 15.0</Text>
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
          />
        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Save Grade</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50, // Safe area adjust
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginLeft: 12,
  },
  headerRightAction: {
    color: '#3B3CFF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },

  // Student Info Card
  studentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  studentNameCol: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  studentId: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  studentDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studentDetailBlock: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },

  // Questions
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  pointsBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  questionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 22,
  },
  
  // MCQ Answer Styles
  mcqAnswerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  mcqCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  mcqIncorrect: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  mcqAnswerText: {
    fontSize: 15,
    fontWeight: '600',
  },
  correctAnswerNote: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 8,
    marginLeft: 4,
  },

  // Descriptive Answer Style
  descriptiveBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  descriptiveText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 22,
  },

  // Grading Section
  gradingSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  marksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  marksInputWrapper: {
    flex: 2,
  },
  totalMarksWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  marksInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#111827',
  },
  totalMarksBox: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalMarksText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  feedbackInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 100,
    fontSize: 14,
    color: '#4B5563',
  },

  // Footer
  footer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  saveBtn: {
    backgroundColor: '#3B3CFF',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B3CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});