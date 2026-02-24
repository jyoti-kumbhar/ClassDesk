import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- Mock Data ---
const EXAMS_DATA = [
  {
    id: '1',
    examId: 'ID: EX-2094',
    title: 'Midterm Calculus',
    subject: 'Mathematics',
    teacher: 'Robert Fox',
    dateTime: 'Today, 10:30 AM – 12:30 PM',
    status: 'ONGOING',
    statusBg: '#FEF3C7',
    statusColor: '#D97706',
    subjectIcon: 'book',
    subjectColor: '#3B3CFF',
    actionIcon: 'stop-circle',
    actionText: 'END EXAM',
    actionColor: '#EF4444',
  },
  {
    id: '2',
    examId: 'ID: EX-2105',
    title: 'World War II History',
    subject: 'History',
    teacher: 'Guy Hawkins',
    dateTime: 'Oct 24, 09:00 AM',
    status: 'DRAFT',
    statusBg: '#E0E7FF',
    statusColor: '#3B3CFF',
    subjectIcon: 'earth',
    subjectColor: '#D97706',
    actionIcon: 'trash',
    actionText: 'DELETE',
    actionColor: '#EF4444',
  },
  {
    id: '3',
    examId: 'ID: EX-2088',
    title: 'Physics Finals',
    subject: 'Physics',
    teacher: 'Bessie Cooper',
    dateTime: 'Oct 18, 02:00 PM',
    status: 'COMPLETED',
    statusBg: '#F3F4F6',
    statusColor: '#6B7280',
    subjectIcon: 'flask',
    subjectColor: '#A855F7',
    actionIcon: 'lock-closed',
    actionText: 'ENDED',
    actionColor: '#FCA5A5',
  },
];

const TABS = ['All Exams', 'Published', 'Drafts'];

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

// --- Main Component ---
export default function AdminExamsScreen() {
  const [activeTab, setActiveTab] = useState('All Exams');
  const router = useRouter(); 

  // Local filtering based on tab selection
  const filteredExams = EXAMS_DATA.filter(exam => {
    if (activeTab === 'Drafts') return exam.status === 'DRAFT';
    if (activeTab === 'Published') return exam.status !== 'DRAFT';
    return true; // All Exams
  });

  return (
    <View style={styles.container}>
      
      {/* Background Graphic */}
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Exams</Text>
          <Text style={styles.subtitleText}>Schedule and manage assessments</Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
          style={styles.createButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/admin/createexam' as any)} 
        >
          <Ionicons name="add" size={24} color="#FFF" style={styles.createIcon} />
          <Text style={styles.createButtonText}>Create Exam</Text>
        </TouchableOpacity>

        {/* Search and Filter Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search exams..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsContainer}>
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

        {/* Exams List */}
        <View style={styles.listContainer}>
          {filteredExams.map((exam) => (
            <View key={exam.id} style={styles.card}>
              
              {/* Top Row: Tags */}
              <View style={styles.cardTagsRow}>
                <View style={[styles.statusTag, { backgroundColor: exam.statusBg }]}>
                  <Text style={[styles.statusText, { color: exam.statusColor }]}>{exam.status}</Text>
                </View>
                <Text style={styles.examIdText}>{exam.examId}</Text>
              </View>

              {/* Title */}
              <Text style={styles.examTitle}>{exam.title}</Text>

              {/* Details Grid */}
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <View style={[styles.iconBox, { backgroundColor: `${exam.subjectColor}15` }]}>
                    {/* @ts-ignore */}
                    <Ionicons name={exam.subjectIcon} size={16} color={exam.subjectColor} />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>SUBJECT</Text>
                    <Text style={styles.detailValue}>{exam.subject}</Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <View style={[styles.iconBox, { backgroundColor: '#10B98115' }]}>
                    <Ionicons name="person" size={16} color="#10B981" />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>TEACHER</Text>
                    <Text style={styles.detailValue}>{exam.teacher}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.detailItemFull}>
                <View style={[styles.iconBox, { backgroundColor: '#6B728015' }]}>
                  <Ionicons name="calendar" size={16} color="#6B7280" />
                </View>
                <View>
                  <Text style={styles.detailLabel}>DATE & TIME</Text>
                  <Text style={styles.detailValue}>{exam.dateTime}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <TouchableOpacity 
                  style={styles.actionBtnPrimary}
                  onPress={() => router.push({ pathname: '/admin/editexam' as any, params: { examId: exam.id } })}
                >
                  <Ionicons name="pencil" size={16} color="#4B5563" />
                  <Text style={styles.actionBtnText}>EDIT</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionBtnPrimary}
                  onPress={() => router.push({ pathname: '/admin/markslist' as any, params: { examId: exam.id } })}
                >
                  <Ionicons name="bar-chart" size={16} color="#4B5563" />
                  <Text style={styles.actionBtnText}>VIEW MARKS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionBtnDanger, { borderColor: `${exam.actionColor}40` }]}>
                  {/* @ts-ignore */}
                  <Ionicons name={exam.actionIcon} size={16} color={exam.actionColor} />
                  <Text style={[styles.actionBtnTextDanger, { color: exam.actionColor }]}>
                    {exam.actionText}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </View>
        
      </ScrollView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  headerSection: { marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 4 },
  subtitleText: { fontSize: 15, color: '#6B7280', fontWeight: '400' },
  createButton: { backgroundColor: '#4461F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, marginBottom: 24, shadowColor: '#4461F2', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  createIcon: { marginRight: 6 },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#F3F4F6' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  filterBtn: { width: 50, height: 50, backgroundColor: '#FFF', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  tabsContainer: { flexDirection: 'row', marginBottom: 24, gap: 10 },
  tabButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F3F4F6' },
  tabButtonActive: { backgroundColor: '#4461F2', borderColor: '#4461F2' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  tabTextActive: { color: '#FFF' },
  listContainer: { gap: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#F9FAFB' },
  cardTagsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusTag: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, marginRight: 10 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  examIdText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  examTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 20 },
  detailsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  detailItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  detailItemFull: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  detailLabel: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginBottom: 2 },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtnPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6' },
  actionBtnText: { marginLeft: 6, fontSize: 11, fontWeight: '700', color: '#4B5563' },
  actionBtnDanger: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#FEF2F2', borderWidth: 1 },
  actionBtnTextDanger: { marginLeft: 6, fontSize: 11, fontWeight: '700' },
});