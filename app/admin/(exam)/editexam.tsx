import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';

// --- Mock Initial Data based on Image 28 ---
const INITIAL_EXAM_DATA = {
  examName: 'Midterm Physics Assessment',
  instructions: 'Please answer all questions. There is no negative marking.',
  questions: [
    {
      id: 'q1',
      number: 1,
      type: 'Single Correct',
      text: 'What is the SI unit of force?',
      marks: '1',
      options: [
        { id: 'a', label: 'A', text: 'Newton' },
        { id: 'b', label: 'B', text: 'Joule' },
        { id: 'c', label: 'C', text: 'Watt' },
        { id: 'd', label: 'D', text: 'Pascal' },
      ]
    }
  ]
};

export default function EditExamScreen() {
  const router = useRouter();
  // Retrieves the examId passed from the previous screen
  const { examId } = useLocalSearchParams(); 

  const [examName, setExamName] = useState(INITIAL_EXAM_DATA.examName);
  const [instructions, setInstructions] = useState(INITIAL_EXAM_DATA.instructions);
  const [questions, setQuestions] = useState(INITIAL_EXAM_DATA.questions);

  // 1. Using examId to mock a data fetch (clears unused variable warning)
  useEffect(() => {
    if (examId) {
      console.log(`Simulating fetch for Exam ID: ${examId}`);
      // In the future: fetch exam data from backend using this ID
    }
  }, [examId]);

  // 2. Function to delete a question (clears setQuestions unused warning)
  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/admin/exam' as any)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Edit MCQ Exam</Text>
          <Text style={styles.headerSubtitle}>Modify assessment questions</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profilePlaceholder} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Exam Details Form */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>EXAM NAME</Text>
          <TextInput
            style={styles.textInput}
            value={examName}
            onChangeText={setExamName}
            placeholder="e.g. Midterm Physics Assessment"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={[styles.inputLabel, { marginTop: 16 }]}>INSTRUCTIONS (OPTIONAL)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={instructions}
            onChangeText={setInstructions}
            placeholder="Add instructions for students..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Questions List */}
        {questions.map((q, index) => (
          <View key={q.id} style={styles.card}>
            {/* Question Header (Badge & Dropdown) */}
            <View style={styles.questionHeader}>
              <View style={styles.questionBadge}>
                <Text style={styles.questionBadgeText}>Question {q.number}</Text>
              </View>
              <TouchableOpacity style={styles.dropdownButton}>
                <Text style={styles.dropdownText}>{q.type}</Text>
                <Ionicons name="chevron-down" size={16} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {/* Question Text */}
            <TextInput
              style={[styles.textInput, styles.questionTextArea]}
              value={q.text}
              placeholder="Type your question here..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />

            {/* Options */}
            <View style={styles.optionsContainer}>
              {q.options.map((opt) => (
                <View key={opt.id} style={styles.optionRow}>
                  <View style={styles.optionLabelBox}>
                    <Text style={styles.optionLabelText}>{opt.label}</Text>
                  </View>
                  <TextInput
                    style={styles.optionInput}
                    value={opt.text}
                    placeholder={`Option ${opt.label}`}
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity style={styles.deleteOptionBtn}>
                    <Ionicons name="close" size={20} color="#D1D5DB" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Question Footer (Marks & Actions) */}
            <View style={styles.questionFooter}>
              <View style={styles.marksContainer}>
                <Text style={styles.marksLabel}>MARKS</Text>
                <TextInput
                  style={styles.marksInput}
                  value={q.marks}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.questionActions}>
                <TouchableOpacity style={styles.iconButton}>
                  <Ionicons name="copy-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
                {/* Delete Button wired up here */}
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => handleDeleteQuestion(q.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.draftButton}>
          <Text style={styles.draftButtonText}>Save Draft</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.publishButton}>
          <Text style={styles.publishButtonText}>Publish Exam</Text>
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
    paddingHorizontal: 20,
    paddingTop: 50, // Safe area adjust
    paddingBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  backButton: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDE68A', // Mock profile color from image
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FCD34D',
  },
  scrollArea: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  
  // Inputs
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    height: 80,
    paddingTop: 16,
  },
  questionTextArea: {
    height: 100,
    paddingTop: 16,
    marginBottom: 20,
  },

  // Question Header
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  questionBadgeText: {
    color: '#3B3CFF',
    fontSize: 12,
    fontWeight: '700',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },

  // Options List
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLabelBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  optionInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
  },
  deleteOptionBtn: {
    padding: 10,
    marginLeft: 4,
  },

  // Question Footer
  questionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marksLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginRight: 12,
    letterSpacing: 0.5,
  },
  marksInput: {
    width: 60,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  questionActions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },

  // Bottom Bar Actions
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Safe area adjust
    backgroundColor: '#F9FAFB',
    gap: 12,
  },
  draftButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  draftButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },
  publishButton: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#3B3CFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B3CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  publishButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});