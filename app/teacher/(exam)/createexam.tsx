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
  Alert,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { ExamDatabase } from '../services/examDatabase';

const { width } = Dimensions.get('window');

// --- Helper: Default Empty Question Structure ---
const DEFAULT_QUESTION = () => ({
  id: `q${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  number: 1,
  type: 'Single Correct',
  text: '',
  marks: '1',
  correctOption: 'a', 
  options: [
    { id: 'a', label: 'A', text: '' },
    { id: 'b', label: 'B', text: '' },
    { id: 'c', label: 'C', text: '' },
    { id: 'd', label: 'D', text: '' },
  ]
});

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
  </View>
);

export default function CreateExamScreen() {
  const router = useRouter();
  
  // --- Form State ---
  const [examName, setExamName] = useState('');
  const [subject, setSubject] = useState(''); 
  const [duration, setDuration] = useState('60'); 
  const [instructions, setInstructions] = useState('');
  const [questions, setQuestions] = useState([DEFAULT_QUESTION()]);
  const [loading, setLoading] = useState(false);

  // --- Class Dropdown State ---
  const [classList, setClassList] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  // 1. Fetch Classes for Dropdown (Fixed for your 'grade' field)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Fetching without orderBy first to avoid index errors
        const q = collection(db, "classes");
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.grade || "Unnamed Class", // Map 'grade' field from DB to 'name' for UI
          };
        });
        setClassList(fetched);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);

  const handleAddQuestion = () => {
    const newQuestion = {
      ...DEFAULT_QUESTION(),
      number: questions.length + 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    // @ts-ignore
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = text;
    setQuestions(updated);
  };

  const deleteQuestion = (index: number) => {
    if (questions.length === 1) return Alert.alert("Error", "Need at least one question.");
    const updated = questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, number: i + 1 }));
    setQuestions(updated);
  };

  const handleSave = async (status: 'DRAFT' | 'ONGOING') => {
    if (!examName.trim() || !selectedClass || !subject.trim()) {
      Alert.alert("Missing Info", "Please fill Name, Subject, and Select a Class.");
      return;
    }

    setLoading(true);
    try {
      const newExam = {
        examId: `EX-${Math.floor(1000 + Math.random() * 9000)}`,
        title: examName,
        subject,
        durationMinutes: parseInt(duration) || 0,
        classId: selectedClass.id,
        className: selectedClass.name, // This saves the 'grade' value as the class name
        teacher: 'Prof. Bharat', 
        dateTime: new Date().toLocaleString(),
        status,
        instructions,
        questions
      };

      await ExamDatabase.addExam(newExam);
      Alert.alert("Success", "Exam saved!", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error) {
      Alert.alert("Error", "Failed to save exam.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <BackgroundDecorations />
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Create Exam</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          
          {/* Settings Card */}
          <View style={styles.card}>
            <Text style={styles.inputLabel}>ASSIGN TO CLASS</Text>
            <TouchableOpacity style={styles.dropdown} onPress={() => setShowClassDropdown(true)}>
              <Text style={styles.dropdownText}>{selectedClass ? selectedClass.name : "Select Class..."}</Text>
              <Ionicons name="chevron-down" size={20} color="#4B5563" />
            </TouchableOpacity>

            <Text style={[styles.inputLabel, { marginTop: 16 }]}>EXAM TITLE</Text>
            <TextInput style={styles.textInput} value={examName} onChangeText={setExamName} placeholder="Final Assessment" />

            <View style={styles.row}>
               <View style={{flex:1, marginRight: 10}}>
                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>SUBJECT</Text>
                  <TextInput style={styles.textInput} value={subject} onChangeText={setSubject} placeholder="Maths" />
               </View>
               <View style={{flex:1}}>
                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>TIMER (MINS)</Text>
                  <TextInput style={styles.textInput} value={duration} onChangeText={setDuration} keyboardType="numeric" placeholder="60" />
               </View>
            </View>
          </View>

          {/* Question Builder */}
          {questions.map((q, qIndex) => (
            <View key={q.id} style={styles.card}>
              <View style={styles.questionHeader}>
                <View style={styles.questionBadge}><Text style={styles.questionBadgeText}>Q {q.number}</Text></View>
                <TouchableOpacity onPress={() => deleteQuestion(qIndex)}><Ionicons name="trash-outline" size={20} color="#EF4444" /></TouchableOpacity>
              </View>

              <TextInput 
                style={[styles.textInput, styles.questionTextArea]} 
                value={q.text} 
                onChangeText={(t) => updateQuestion(qIndex, 'text', t)} 
                placeholder="Type your question here..." 
                multiline 
              />

              <Text style={[styles.inputLabel, {marginBottom: 10}]}>OPTIONS (Tap A/B/C/D to set correct answer)</Text>
              <View style={styles.optionsContainer}>
                {q.options.map((opt, optIndex) => (
                  <View key={opt.id} style={styles.optionRow}>
                    <TouchableOpacity 
                      onPress={() => updateQuestion(qIndex, 'correctOption', opt.id)}
                      style={[styles.optionLabelBox, q.correctOption === opt.id && {backgroundColor: '#10B981', borderColor: '#10B981'}]}
                    >
                      <Text style={[styles.optionLabelText, q.correctOption === opt.id && {color: '#FFF'}]}>{opt.label}</Text>
                    </TouchableOpacity>
                    <TextInput 
                      style={styles.optionInput} 
                      value={opt.text} 
                      onChangeText={(t) => updateOption(qIndex, optIndex, t)} 
                      placeholder={`Option ${opt.label} text`} 
                    />
                  </View>
                ))}
              </View>

              <View style={styles.questionFooter}>
                <View style={styles.marksContainer}>
                  <Text style={styles.marksLabel}>POINTS</Text>
                  <TextInput 
                    style={styles.marksInput} 
                    value={q.marks} 
                    onChangeText={(t) => updateQuestion(qIndex, 'marks', t)} 
                    keyboardType="numeric" 
                  />
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addQuestionBtn} onPress={handleAddQuestion}>
            <Ionicons name="add-circle-outline" size={22} color="#6B7280" />
            <Text style={styles.addQuestionText}>Add New Question</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.draftButton} onPress={() => handleSave('DRAFT')} disabled={loading}>
            <Text style={styles.draftButtonText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishButton} onPress={() => handleSave('ONGOING')} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.publishButtonText}>Publish Exam</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Class Modal */}
      <Modal visible={showClassDropdown} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Class</Text>
            <FlatList 
              data={classList} 
              keyExtractor={(i) => i.id} 
              renderItem={({item}) => (
                <TouchableOpacity style={styles.classItem} onPress={() => { setSelectedClass(item); setShowClassDropdown(false); }}>
                  <Text style={styles.classItemText}>{item.name}</Text>
                  {selectedClass?.id === item.id && <Ionicons name="checkmark-circle" size={20} color="#10B981" />}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowClassDropdown(false)} style={{marginTop: 15, alignSelf: 'center'}}>
              <Text style={{color:'#EF4444', fontWeight:'700'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFF9F0' },
  keyboardContainer: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
  backButton: { marginRight: 16 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  headerSubtitle: { fontSize: 13, color: '#6B7280' },
  scrollArea: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40, gap: 20 },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F3F4F6', elevation: 1 },
  inputLabel: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginBottom: 8, letterSpacing: 1 },
  textInput: { backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 15, color: '#111827', borderWidth:1, borderColor:'#F3F4F6' },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12 },
  dropdownText: { fontSize: 16, fontWeight: '600', color: '#111827' },
  row: { flexDirection: 'row' },
  questionTextArea: { height: 80, paddingTop: 12, marginBottom: 15, textAlignVertical: 'top' },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  questionBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  questionBadgeText: { color: '#3B3CFF', fontSize: 12, fontWeight: '800' },
  optionsContainer: { gap: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center' },
  optionLabelBox: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1.5, borderColor: '#E5E7EB' },
  optionLabelText: { fontSize: 14, fontWeight: '800', color: '#6B7280' },
  optionInput: { flex: 1, height: 40, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', fontSize: 14, paddingHorizontal: 5 },
  questionFooter: { marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  marksContainer: { flexDirection: 'row', alignItems: 'center' },
  marksLabel: { fontSize: 10, fontWeight: '800', color: '#9CA3AF', marginRight: 10 },
  marksInput: { width: 50, height: 30, backgroundColor: '#F3F4F6', borderRadius: 6, textAlign: 'center', fontWeight: '700' },
  addQuestionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed', borderRadius: 15, padding: 15, backgroundColor: '#FFF' },
  addQuestionText: { color: '#6B7280', fontSize: 15, fontWeight: '600', marginLeft: 8 },
  bottomBar: { flexDirection: 'row', padding: 20, gap: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  draftButton: { flex: 1, height: 50, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  draftButtonText: { fontWeight: '700' },
  publishButton: { flex: 2, height: 50, borderRadius: 12, backgroundColor: '#3B3CFF', justifyContent: 'center', alignItems: 'center' },
  publishButtonText: { color: '#FFF', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 30 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 15 },
  classItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  classItemText: { fontSize: 16, fontWeight: '600' }
});