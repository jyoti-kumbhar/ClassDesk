import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- Mock Data ---
const RESPONSES_DATA = [
  {
    id: '1',
    name: 'Alice Johnson',
    dateTime: 'May 24, 2024 • 10:15 AM',
    status: 'SUBMITTED',
    statusColor: '#10B981',
    statusBg: '#D1FAE5',
    score: '88/100',
    duration: '45m',
    avatar: 'https://i.pravatar.cc/150?u=alice', 
  },
  {
    id: '2',
    name: 'Marcus Chen',
    dateTime: 'May 24, 2024 • 11:45 AM',
    status: 'LATE',
    statusColor: '#D97706',
    statusBg: '#FEF3C7',
    score: '92/100',
    duration: '58m',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    dateTime: 'May 24, 2024 • 10:52 AM',
    status: 'SUBMITTED',
    statusColor: '#10B981',
    statusBg: '#D1FAE5',
    score: '76/100',
    duration: '52m',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
  },
];

const MARKS_DATA = [
  { id: '1', initials: 'JD', name: 'John Doe', roll: 'Roll: #202401', score: '48/50', grade: 'A+', gradeColor: '#10B981', gradeBg: '#D1FAE5' },
  { id: '2', initials: 'SA', name: 'Sarah Anders', roll: 'Roll: #202402', score: '45/50', grade: 'A', gradeColor: '#10B981', gradeBg: '#D1FAE5' },
  { id: '3', initials: 'MT', name: 'Mike Tyson', roll: 'Roll: #202403', score: '32/50', grade: 'B-', gradeColor: '#D97706', gradeBg: '#FEF3C7' },
];

const QUESTIONS_DATA = [
  {
    id: 'q1',
    tag: 'Q1. CONCEPTUAL',
    questionText: 'What is the law of inertia?',
    type: 'MCQ',
    options: [
      { id: 'a', text: 'A. Objects in motion stay in motion', isCorrect: false },
      { id: 'b', text: "B. Newton's First Law of Motion", isCorrect: true },
      { id: 'c', text: 'C. Force equals mass times acceleration', isCorrect: false },
      { id: 'd', text: 'D. Action and reaction are equal', isCorrect: false },
    ]
  },
  {
    id: 'q2',
    tag: 'Q2. CALCULATION',
    questionText: 'Calculate the work done when a force of 10N moves an object 5m.',
    type: 'MCQ',
    options: [
      { id: 'a', text: 'A. 2 Joules', isCorrect: false },
      { id: 'b', text: 'B. 15 Joules', isCorrect: false },
      { id: 'c', text: 'C. 50 Joules', isCorrect: true },
      { id: 'd', text: 'D. 100 Joules', isCorrect: false },
    ]
  },
  {
    id: 'q3',
    tag: 'Q3. THEORY',
    questionText: 'Explain the concept of quantum entanglement in simple terms.',
    type: 'SUBJECTIVE',
    placeholder: 'Subjective response question type'
  }
];

const TABS = ['Questions', 'Responses', 'Marks'];

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

export default function MarksListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Responses'); 

  return (
    <View style={styles.mainContainer}>
      
      {/* Background Graphics */}
      <BackgroundDecorations />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/admin/exam' as any)} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Physics Finals</Text>
          <Text style={styles.headerSubtitle}>ID: EX-2088</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profilePlaceholder} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Top Tabs */}
        <View style={styles.tabContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder={
                activeTab === 'Marks' ? "Search by name or roll no..." : 
                activeTab === 'Questions' ? "Search questions..." : 
                "Search by student name"
              }
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter-outline" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* List Content */}
        <View style={styles.listContainer}>
          
          {/* Render Responses Tab */}
          {activeTab === 'Responses' && RESPONSES_DATA.map((item) => (
            <View key={item.id} style={styles.responseCard}>
              <View style={styles.responseCardTop}>
                <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{item.name}</Text>
                  <Text style={styles.studentDate}>{item.dateTime}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                  <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.responseCardBottom}>
                <View style={styles.statsRow}>
                  <View style={styles.statBlock}>
                    <Text style={styles.statLabel}>SCORE</Text>
                    <Text style={styles.statValue}>{item.score}</Text>
                  </View>
                  <View style={styles.statBlock}>
                    <Text style={styles.statLabel}>DURATION</Text>
                    <Text style={styles.statValue}>{item.duration}</Text>
                  </View>
                </View>
                
                {/* Navigate to Evaluate Response */}
                <TouchableOpacity 
                  style={styles.viewDetailsButton}
                  onPress={() => router.push({ pathname: '/admin/viewdetails' as any, params: { studentId: item.id } })}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Render Marks Tab */}
          {activeTab === 'Marks' && MARKS_DATA.map((item) => (
            <View key={item.id} style={styles.marksCard}>
              <View style={styles.marksInitialsBox}>
                <Text style={styles.marksInitialsText}>{item.initials}</Text>
              </View>
              <View style={styles.marksInfo}>
                <Text style={styles.marksName}>{item.name}</Text>
                <Text style={styles.marksRoll}>{item.roll}</Text>
              </View>
              <View style={styles.marksScoreSection}>
                <Text style={styles.marksScoreText}>{item.score}</Text>
                <View style={[styles.gradeBadge, { backgroundColor: item.gradeBg }]}>
                  <Text style={[styles.gradeText, { color: item.gradeColor }]}>{item.grade}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Render Questions Tab */}
          {activeTab === 'Questions' && QUESTIONS_DATA.map((q) => (
            <View key={q.id} style={styles.questionCard}>
              <View style={styles.questionCardHeader}>
                <View style={styles.questionTagBox}>
                  <Text style={styles.questionTagText}>{q.tag}</Text>
                </View>
                <View style={styles.questionActions}>
                  <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="pencil" size={16} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="trash" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <Text style={styles.questionMainText}>{q.questionText}</Text>

              {q.type === 'MCQ' && q.options && (
                <View style={styles.optionsContainer}>
                  {q.options.map((opt) => (
                    <View 
                      key={opt.id} 
                      style={[styles.optionBox, opt.isCorrect && styles.optionBoxCorrect]}
                    >
                      <Text style={[styles.optionText, opt.isCorrect && styles.optionTextCorrect]}>
                        {opt.text}
                      </Text>
                      {opt.isCorrect ? (
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      ) : (
                        <View style={styles.emptyCircle} />
                      )}
                    </View>
                  ))}
                </View>
              )}

              {q.type === 'SUBJECTIVE' && (
                <View style={styles.subjectiveBox}>
                  <Text style={styles.subjectiveText}>{q.placeholder}</Text>
                </View>
              )}

            </View>
          ))}

        </View>

      </ScrollView>

      {/* Download Report Button */}
      {activeTab === 'Marks' && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="download-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={styles.downloadButtonText}>Download Report</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFF9F0' }, // Theme background
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50, 
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: { marginRight: 16 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  profileButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  profilePlaceholder: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#D8B4FE' },
  
  scrollArea: { flex: 1, backgroundColor: 'transparent' },
  contentContainer: { padding: 20 },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#3B3CFF' },

  // Search
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#F3F4F6' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  filterBtn: { width: 50, height: 50, backgroundColor: '#FFF', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },

  listContainer: { gap: 16 },

  // Response Cards
  responseCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  responseCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  studentDate: { fontSize: 12, color: '#9CA3AF' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  responseCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statsRow: { flexDirection: 'row', gap: 24 },
  statBlock: { alignItems: 'flex-start' },
  statLabel: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
  viewDetailsButton: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#EFF6FF' },
  viewDetailsText: { color: '#3B3CFF', fontSize: 13, fontWeight: '600' },

  // Marks Cards
  marksCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  marksInitialsBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  marksInitialsText: { color: '#3B3CFF', fontWeight: '700', fontSize: 16 },
  marksInfo: { flex: 1 },
  marksName: { fontSize: 16, fontWeight: '600', color: '#111827' },
  marksRoll: { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  marksScoreSection: { alignItems: 'flex-end' },
  marksScoreText: { fontSize: 18, fontWeight: '700', color: '#3B3CFF', marginBottom: 4 },
  gradeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  gradeText: { fontSize: 10, fontWeight: '700' },

  // Questions Cards
  questionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  questionCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  questionTagBox: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  questionTagText: { color: '#3B3CFF', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  questionActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  questionMainText: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 20, lineHeight: 24 },
  optionsContainer: { gap: 12 },
  optionBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  optionBoxCorrect: { backgroundColor: '#ECFDF5', borderColor: '#10B981' },
  optionText: { fontSize: 14, color: '#4B5563', flex: 1 },
  optionTextCorrect: { color: '#065F46', fontWeight: '600' },
  emptyCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#D1D5DB' },
  subjectiveBox: { borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', borderRadius: 12, padding: 16, backgroundColor: '#F9FAFB' },
  subjectiveText: { fontSize: 14, fontStyle: 'italic', color: '#9CA3AF' },

  // Miscellaneous
  bottomButtonContainer: { padding: 20, backgroundColor: 'transparent', paddingBottom: 30 },
  downloadButton: { backgroundColor: '#3B3CFF', flexDirection: 'row', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  downloadButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});