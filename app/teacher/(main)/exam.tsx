import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
const TABS = ['All Exams', 'Published', 'Drafts'];

const getExamStyles = (status: string, subject: string) => {
  let styles = { 
    bg: '#F3F4F6', color: '#6B7280', 
    icon: 'eye' as keyof typeof Ionicons.glyphMap, 
    action: 'VIEW', actionColor: '#6B7280',
    subIcon: 'book' as keyof typeof Ionicons.glyphMap, subColor: '#6B7280'
  };

  if (status === 'PUBLISHED' || status === 'ONGOING') {
    styles.bg = '#FEF3C7'; styles.color = '#D97706';
    styles.icon = 'stop-circle' as keyof typeof Ionicons.glyphMap; 
    styles.action = 'END EXAM'; styles.actionColor = '#EF4444';
  } else if (status === 'DRAFT') {
    styles.bg = '#E0E7FF'; styles.color = '#3B3CFF';
    styles.icon = 'trash' as keyof typeof Ionicons.glyphMap; 
    styles.action = 'DELETE'; styles.actionColor = '#EF4444';
  } else if (status === 'COMPLETED') {
    styles.bg = '#DCFCE7'; styles.color = '#166534';
    styles.icon = 'checkmark-done-circle' as keyof typeof Ionicons.glyphMap; 
    styles.action = 'ENDED'; styles.actionColor = '#166534';
  }

  const normalizedSubject = subject?.toLowerCase() || '';
  if (normalizedSubject.includes('math')) { styles.subColor = '#4461F2'; styles.subIcon = 'calculator'; }
  else if (normalizedSubject.includes('history')) { styles.subColor = '#D97706'; styles.subIcon = 'earth'; }
  else if (normalizedSubject.includes('physic') || normalizedSubject.includes('science')) { styles.subColor = '#A855F7'; styles.subIcon = 'flask'; }
  return styles;
};

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: 30, right: -40 }}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill="#F3E8FF" opacity={0.6} />
      </Svg>
    </View>
  </View>
);

export default function AdminExamsScreen() {
  const router = useRouter(); 
  const [activeTab, setActiveTab] = useState('All Exams');
  const [exams, setExams] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(useCallback(() => { loadExams(); }, []));

  const loadExams = async () => {
    try {
      setLoading(true);
      const data = await ExamDatabase.getExams();
      setExams(data);
    } catch {
      Alert.alert("Error", "Could refresh exams.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndExam = (id: string) => {
    Alert.alert("End Exam", "Finalize this exam? Students can no longer submit.", [
      { text: "Cancel", style: 'cancel' },
      { text: "End Now", style: 'destructive', onPress: async () => {
          try {
            await ExamDatabase.updateExamStatus(id, 'COMPLETED');
            loadExams();
          } catch (err) {
            console.error(err); // Fixed ESLint 'error' unused warning
            Alert.alert("Error", "Failed to end exam.");
          }
      }}
    ]);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Draft", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: 'cancel' },
      { text: "Delete", style: 'destructive', onPress: async () => {
          await ExamDatabase.deleteExam(id);
          loadExams();
      }}
    ]);
  };

  const filteredExams = exams.filter(exam => {
    const matchesTab = activeTab === 'All Exams' ? true :
      activeTab === 'Published' ? (exam.status === 'PUBLISHED' || exam.status === 'ONGOING') :
      activeTab === 'Drafts' ? exam.status === 'DRAFT' : true;
    return matchesTab && exam.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Exams</Text>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={() => router.push('/teacher/(exam)/createexam')}>
          <Ionicons name="add" size={24} color="#FFF" />
          <Text style={styles.createButtonText}>Create New Exam</Text>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput style={styles.searchInput} placeholder="Search..." value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        <View style={styles.tabsContainer}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? <ActivityIndicator size="large" color="#4461F2" /> : (
          <View style={styles.listContainer}>
            {filteredExams.map((exam) => {
              const ui = getExamStyles(exam.status, exam.subject);
              const isPublished = exam.status === 'PUBLISHED' || exam.status === 'ONGOING';
              const isDraft = exam.status === 'DRAFT';

              return (
                <View key={exam.id} style={styles.card}>
                  <Text style={styles.examTitle}>{exam.title}</Text>
                  
                  <View style={styles.actionsRow}>
                    {/* Requirement 1: Hide Edit for Published */}
                    {!isPublished && exam.status !== 'COMPLETED' && (
                      <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => router.push({ pathname: '/teacher/(exam)/editexam', params: { examId: exam.id } })}>
                        <Ionicons name="pencil" size={14} color="#4B5563" />
                        <Text style={styles.actionBtnText}>EDIT</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity style={styles.actionBtnPrimary} onPress={() => router.push({ pathname: '/teacher/(exam)/markslist', params: { examId: exam.id } })}>
                      <Ionicons name="bar-chart" size={14} color="#4B5563" />
                      <Text style={styles.actionBtnText}>MARKS</Text>
                    </TouchableOpacity>

                    {/* Requirement 2 & 3: End or Delete */}
                    <TouchableOpacity 
                      style={[styles.actionBtnDanger, { borderColor: ui.actionColor + '40' }]}
                      disabled={exam.status === 'COMPLETED'}
                      onPress={() => isDraft ? handleDelete(exam.id) : isPublished ? handleEndExam(exam.id) : null}
                    >
                      <Ionicons name={ui.icon} size={14} color={ui.actionColor} />
                      <Text style={[styles.actionBtnTextDanger, { color: ui.actionColor }]}>{ui.action}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  headerSection: { marginBottom: 20 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  createButton: { backgroundColor: '#4461F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, marginBottom: 24 },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600', marginLeft: 6 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 50, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10 },
  tabsContainer: { flexDirection: 'row', marginBottom: 24, gap: 10 },
  tabButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#FFF' },
  tabButtonActive: { backgroundColor: '#4461F2' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  tabTextActive: { color: '#FFF' },
  listContainer: { gap: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 2 },
  examTitle: { fontSize: 19, fontWeight: '700', color: '#111827', marginBottom: 18 },
  actionsRow: { flexDirection: 'row', gap: 10 },
  actionBtnPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6' },
  actionBtnText: { marginLeft: 6, fontSize: 11, fontWeight: '700', color: '#4B5563' },
  actionBtnDanger: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#FEF2F2', borderWidth: 1 },
  actionBtnTextDanger: { marginLeft: 6, fontSize: 11, fontWeight: '700' },
});