import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";
import { ExamDatabase } from '../services/examDatabase';

const { width } = Dimensions.get('window');

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    
    {/* Top Right Large Soft Glow (Purple) */}
    <View style={{ position: "absolute", top: 30, right: -40 }}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill="#F3E8FF" opacity={0.6} />
        <Circle cx="100" cy="100" r="50" fill="#E9D5FF" opacity={0.4} />
      </Svg>
    </View>

    {/* Top Left - Dashed Connection Line */}
    <View style={{ position: "absolute", top: 60, left: 20 }}>
       <Svg height="100" width="120" viewBox="0 0 120 100">
          <Line x1="10" y1="0" x2="10" y2="60" stroke="#BAE6FD" strokeWidth="2" strokeDasharray="5, 5" />
          <Path d="M 10 60 Q 10 90 40 90 L 80 90" stroke="#BAE6FD" strokeWidth="2" fill="none" />
          <Circle cx="80" cy="90" r="4" fill="#60A5FA" opacity={0.6} />
       </Svg>
    </View>

    {/* Middle - The "Data Wave" */}
    <View style={{ position: "absolute", top: 220, width: width, alignItems: 'center', opacity: 0.4 }}>
       <Svg height="150" width={width} viewBox={`0 0 ${width} 150`}>
          <Path 
            d={`M -20 75 C ${width * 0.3} 120, ${width * 0.7} 30, ${width + 20} 75`} 
            stroke="#99F6E4" 
            strokeWidth="3" 
            fill="none" 
          />
          <Path 
            d={`M -20 90 C ${width * 0.3} 135, ${width * 0.7} 45, ${width + 20} 90`} 
            stroke="#CCFBF1" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="10, 10"
          />
          <Circle cx={width * 0.2} cy="85" r="3" fill="#34D399" />
          <Circle cx={width * 0.8} cy="65" r="5" stroke="#34D399" strokeWidth="2" fill="#FFF" />
       </Svg>
    </View>

    {/* Middle Right - Dot Grid Matrix */}
    <View style={{ position: "absolute", top: 380, right: 10, opacity: 0.3 }}>
       <Svg height="80" width="60">
             {[0, 15, 30].map((x) => 
               [0, 15, 30, 45].map((y) => (
                 <Circle key={`${x}-${y}`} cx={x + 5} cy={y + 5} r="1.5" fill="#FDBA74" />
               ))
             )}
       </Svg>
    </View>

    {/* Bottom Left - Geometric Stack */}
    <View style={{ position: "absolute", bottom: 100, left: -20 }}>
       <Svg height="120" width="120" viewBox="0 0 100 100">
             <Line x1="0" y1="50" x2="100" y2="50" stroke="#FDE68A" strokeWidth="40" opacity={0.3} transform="rotate(-45 50 50)" />
             <Line x1="20" y1="50" x2="80" y2="50" stroke="#F59E0B" strokeWidth="2" transform="rotate(-45 50 50)" />
       </Svg>
    </View>

    {/* Bottom Right - Abstract Playground */}
    <View style={{ position: "absolute", bottom: 40, right: -20, opacity: 0.9 }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        <Circle cx="200" cy="200" r="150" fill="#fdf0fd" />
        <Path 
          d="M 100 200 Q 120 120 200 100" 
          stroke="#fbccf9" 
          strokeWidth="30" 
          strokeLinecap="round" 
          fill="none" 
        />
        <Path 
          d="M 40 130 Q 70 80 100 130 T 160 130" 
          stroke="#c7bdf1" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none" 
        />
        <Circle cx="80" cy="180" r="4" fill="#93C5FD" />
        <Circle cx="180" cy="150" r="3" fill="#93C5FD" />
      </Svg>
    </View>
  </View>
);

export default function EditExamScreen() {
  const router = useRouter();
  const { examId } = useLocalSearchParams(); 

  // --- State Variables ---
  const [loading, setLoading] = useState(true);
  const [originalExam, setOriginalExam] = useState<any>(null); // Stores ID and metadata
  
  const [examName, setExamName] = useState('');
  const [subject, setSubject] = useState('');
  const [instructions, setInstructions] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);

  // --- 1. Fetch Data on Load ---
  useEffect(() => {
    const fetchExamData = async () => {
      if (examId) {
        try {
          const data = await ExamDatabase.getExamById(examId as string);
          if (data) {
            setOriginalExam(data);
            setExamName(data.title);
            setSubject(data.subject);
            setInstructions(data.instructions || '');
            setQuestions(data.questions || []);
          } else {
            Alert.alert("Error", "Exam not found.");
            router.back();
          }
        } catch (e) {
          console.error("Failed to load exam", e);
          Alert.alert("Error", "Could not load exam data.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchExamData();
  }, [examId]);

  // --- 2. Handlers for Editing ---

  // Add a new empty question
  const handleAddQuestion = () => {
    const newNum = questions.length + 1;
    const newQuestion = {
      id: `q${Date.now()}`,
      number: newNum,
      type: 'Single Correct',
      text: '',
      marks: '1',
      options: [
        { id: 'a', label: 'A', text: '' },
        { id: 'b', label: 'B', text: '' },
        { id: 'c', label: 'C', text: '' },
        { id: 'd', label: 'D', text: '' },
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  // Update question text or marks
  const updateQuestion = (index: number, field: string, value: string) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  // Update option text
  const updateOption = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    const updatedOptions = [...updated[qIndex].options];
    updatedOptions[optIndex] = { ...updatedOptions[optIndex], text: text };
    updated[qIndex].options = updatedOptions;
    setQuestions(updated);
  };

  // Delete a question
  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      Alert.alert("Cannot Delete", "You must have at least one question.");
      return;
    }
    const filtered = questions.filter((_, i) => i !== index);
    // Renumber the questions sequentially
    const renumbered = filtered.map((q, i) => ({ ...q, number: i + 1 }));
    setQuestions(renumbered);
  };

  // --- 3. Save Changes to Database ---
  const handleUpdate = async () => {
    if (!examName.trim() || !subject.trim()) {
      Alert.alert("Missing Info", "Exam Name and Subject are required.");
      return;
    }

    try {
      const updatedExam = {
        ...originalExam, // Keep the original ID, created date, etc.
        title: examName,
        subject: subject,
        instructions: instructions,
        questions: questions,
        // Update timestamp if desired:
        // dateTime: new Date().toDateString() 
      };

      await ExamDatabase.updateExam(updatedExam);
      
      Alert.alert("Success", "Exam updated successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update exam.");
    }
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4461F2" />
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
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Edit Exam</Text>
            <Text style={styles.headerSubtitle}>Modify content & settings</Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollArea} 
          contentContainerStyle={styles.contentContainer} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* Exam Details Section */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>EXAM NAME</Text>
            <TextInput
              style={styles.textInput}
              value={examName}
              onChangeText={setExamName}
              placeholder="Exam Name"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>SUBJECT</Text>
            <TextInput
              style={styles.textInput}
              value={subject}
              onChangeText={setSubject}
              placeholder="Subject"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>INSTRUCTIONS</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Instructions..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Questions List */}
          {questions.map((q, qIndex) => (
            <View key={q.id} style={styles.card}>
              
              {/* Question Header */}
              <View style={styles.questionHeader}>
                <View style={styles.questionBadge}>
                  <Text style={styles.questionBadgeText}>Question {q.number}</Text>
                </View>
                {/* Delete Button */}
                <TouchableOpacity onPress={() => handleDeleteQuestion(qIndex)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              {/* Question Text */}
              <TextInput
                style={[styles.textInput, styles.questionTextArea]}
                value={q.text}
                onChangeText={(text) => updateQuestion(qIndex, 'text', text)}
                placeholder="Question text..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
              />

              {/* Options */}
              <View style={styles.optionsContainer}>
                {q.options.map((opt: any, optIndex: number) => (
                  <View key={opt.id} style={styles.optionRow}>
                    <View style={styles.optionLabelBox}>
                      <Text style={styles.optionLabelText}>{opt.label}</Text>
                    </View>
                    <TextInput
                      style={styles.optionInput}
                      value={opt.text}
                      onChangeText={(text) => updateOption(qIndex, optIndex, text)}
                      placeholder={`Option ${opt.label}`}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                ))}
              </View>

              {/* Marks Input */}
              <View style={styles.questionFooter}>
                <View style={styles.marksContainer}>
                  <Text style={styles.marksLabel}>MARKS</Text>
                  <TextInput
                    style={styles.marksInput}
                    value={q.marks}
                    onChangeText={(text) => updateQuestion(qIndex, 'marks', text)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

            </View>
          ))}

          {/* Add Question Button */}
          <TouchableOpacity style={styles.addQuestionBtn} onPress={handleAddQuestion}>
            <Ionicons name="add-circle-outline" size={22} color="#6B7280" />
            <Text style={styles.addQuestionText}>Add Question</Text>
          </TouchableOpacity>

        </ScrollView>

        {/* Bottom Save Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
            <Text style={styles.updateButtonText}>Update Exam</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFF9F0' },
  keyboardContainer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  backButton: { marginRight: 16 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  scrollArea: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40, gap: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 8, letterSpacing: 0.5 },
  textInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 15, color: '#111827' },
  textArea: { height: 80, paddingTop: 16 },
  questionTextArea: { height: 100, paddingTop: 16, marginBottom: 20 },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  questionBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  questionBadgeText: { color: '#3B3CFF', fontSize: 12, fontWeight: '700' },
  optionsContainer: { gap: 12, marginBottom: 20 },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  optionLabelBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  optionLabelText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  optionInput: { flex: 1, height: 44, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: '#111827' },
  questionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  marksContainer: { flexDirection: 'row', alignItems: 'center' },
  marksLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginRight: 12, letterSpacing: 0.5 },
  marksInput: { width: 60, height: 36, backgroundColor: '#F3F4F6', borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#111827' },
  addQuestionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#D1D5DB', borderStyle: 'dashed', borderRadius: 24, paddingVertical: 18, marginTop: 8, backgroundColor: '#FFF' },
  addQuestionText: { color: '#6B7280', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  bottomBar: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: Platform.OS === 'ios' ? 34 : 20 },
  updateButton: { height: 56, borderRadius: 16, backgroundColor: '#4461F2', justifyContent: 'center', alignItems: 'center', shadowColor: '#4461F2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  updateButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});