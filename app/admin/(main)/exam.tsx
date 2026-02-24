import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Added SVG imports
import Svg, { Path, Circle } from 'react-native-svg';

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    
    {/* Soft Flowing Background Lines */}
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>

    {/* Top Right Orbs */}
    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>

    {/* Middle Left Bubble */}
    <View style={{ position: "absolute", top: 300, left: -40, opacity: 0.5 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Circle cx="40" cy="50" r="40" fill="#6EE7B7" opacity={0.4} />
        <Circle cx="60" cy="30" r="15" fill="#93C5FD" opacity={0.6} />
      </Svg>
    </View>

    {/* Bottom Right Orbs */}
    <View style={{ position: "absolute", bottom: -50, right: -20, opacity: 0.6 }}>
      <Svg height="200" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="80" r="60" fill="#FDBA74" opacity={0.5} />
        <Circle cx="80" cy="40" r="30" fill="#FCA5A5" opacity={0.4} />
      </Svg>
    </View>

    {/* Floating Mini Bubbles */}
    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
    <View style={[styles.dot, { bottom: 120, left: 80, backgroundColor: "#F9A8D4", width: 10, height: 10, opacity: 0.8 }]} />
  </View>
);

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

export default function AdminExamsScreen() {
  const [activeTab, setActiveTab] = useState('All Exams');
  const router = useRouter();

  const filteredExams = EXAMS_DATA.filter(exam => {
    if (activeTab === 'Drafts') return exam.status === 'DRAFT';
    if (activeTab === 'Published') return exam.status !== 'DRAFT';
    return true;
  });

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
      >
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

        {/* Search Row */}
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

        {/* Tabs */}
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

        {/* List */}
        <View style={styles.listContainer}>
          {filteredExams.map((exam) => (
            <View key={exam.id} style={styles.card}>
              <View style={styles.cardTagsRow}>
                <View style={[styles.statusTag, { backgroundColor: exam.statusBg }]}>
                  <Text style={[styles.statusText, { color: exam.statusColor }]}>{exam.status}</Text>
                </View>
                <Text style={styles.examIdText}>{exam.examId}</Text>
              </View>

              <Text style={styles.examTitle}>{exam.title}</Text>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <View style={[styles.iconBox, { backgroundColor: `${exam.subjectColor}15` }]}>
                    <Ionicons name={exam.subjectIcon as any} size={16} color={exam.subjectColor} />
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
                  <Ionicons name={exam.actionIcon as any} size={16} color={exam.actionColor} />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  dot: { position: 'absolute', borderRadius: 100 },
  headerSection: { marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 4 },
  subtitleText: { fontSize: 15, color: '#6B7280', fontWeight: '400' },
  createButton: { backgroundColor: '#3B3CFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, marginBottom: 24, shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  createIcon: { marginRight: 6 },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#F3F4F6' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  filterBtn: { width: 50, height: 50, backgroundColor: '#FFF', borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  tabsContainer: { flexDirection: 'row', marginBottom: 24, gap: 10 },
  tabButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F3F4F6' },
  tabButtonActive: { backgroundColor: '#3B3CFF', borderColor: '#3B3CFF' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  tabTextActive: { color: '#FFF' },
  listContainer: { gap: 16 },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#F9FAFB' },
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
  actionBtnPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(249, 250, 251, 0.8)', borderWidth: 1, borderColor: '#F3F4F6' },
  actionBtnText: { marginLeft: 6, fontSize: 11, fontWeight: '700', color: '#4B5563' },
  actionBtnDanger: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: 'rgba(254, 242, 242, 0.8)', borderWidth: 1 },
  actionBtnTextDanger: { marginLeft: 6, fontSize: 11, fontWeight: '700' },
});