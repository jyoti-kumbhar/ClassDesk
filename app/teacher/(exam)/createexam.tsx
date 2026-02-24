import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- Default Empty State ---
const DEFAULT_QUESTION = {
  id: 'q1',
  number: 1,
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

export default function CreateExamScreen() {
  const router = useRouter();
  const [examName, setExamName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [questions, setQuestions] = useState([DEFAULT_QUESTION]);

  const handleAddQuestion = () => {
    const newQuestion = {
      ...DEFAULT_QUESTION,
      id: `q${questions.length + 1}`,
      number: questions.length + 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <View style={styles.mainContainer}>
      
      {/* Background Graphics */}
      <BackgroundDecorations />

      <KeyboardAvoidingView 
        style={styles.keyboardContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/admin/exam' as any)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Create MCQ Exam</Text>
            <Text style={styles.headerSubtitle}>Design your assessment questions</Text>
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
          {questions.map((q) => (
            <View key={q.id} style={styles.card}>
              {/* Question Header */}
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

              {/* Question Footer */}
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
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="trash-outline" size={20} color="#6B7280" />
                  </TouchableOpacity>
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
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFF9F0' }, // Theme background
  keyboardContainer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  backButton: { marginRight: 16 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  headerSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
  profileButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FDE68A', justifyContent: 'center', alignItems: 'center' },
  profilePlaceholder: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FCD34D' },
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
  dropdownButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  dropdownText: { fontSize: 13, fontWeight: '600', color: '#111827', marginRight: 8 },
  optionsContainer: { gap: 12, marginBottom: 20 },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  optionLabelBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  optionLabelText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  optionInput: { flex: 1, height: 44, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12, fontSize: 14, color: '#111827' },
  deleteOptionBtn: { padding: 10, marginLeft: 4 },
  questionFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  marksContainer: { flexDirection: 'row', alignItems: 'center' },
  marksLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginRight: 12, letterSpacing: 0.5 },
  marksInput: { width: 60, height: 36, backgroundColor: '#F3F4F6', borderRadius: 8, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#111827' },
  questionActions: { flexDirection: 'row', gap: 16 },
  iconButton: { padding: 4 },
  
  // Dashed Add Question Button
  addQuestionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D1D5DB', 
    borderStyle: 'dashed',
    borderRadius: 24, 
    paddingVertical: 18,
    marginTop: 8,
    backgroundColor: '#FFF' // Ensure it stands out against bg
  },
  addQuestionText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  bottomBar: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 20, gap: 12 },
  draftButton: { flex: 1, height: 56, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  draftButtonText: { color: '#111827', fontSize: 16, fontWeight: '700' },
  publishButton: { flex: 2, height: 56, borderRadius: 16, backgroundColor: '#3B3CFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  publishButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});