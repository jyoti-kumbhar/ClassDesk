import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- Mock Data ---
const ASSIGNMENTS_DATA = [
  {
    id: '1',
    title: 'Chapter 4 Practice',
    subject: 'MATHEMATICS',
    dueDate: 'Due. Oct 24, 11:59 PM',
    score: '85',
    total: '100',
    scoreColor: '#111827',
  },
  {
    id: '2',
    title: 'Essay on Climate Change',
    subject: 'ENGLISH',
    dueDate: 'Due. Oct 21, 11:59 PM',
    score: '72',
    total: '100',
    scoreColor: '#D97706',
  },
  {
    id: '3',
    title: 'Photosynthesis Worksheet',
    subject: 'BIOLOGY',
    dueDate: 'Due. Oct 27, 11:59 PM',
    score: '90',
    total: '100',
    scoreColor: '#10B981',
  },
];

const STUDENT_MARKS_DATA = [
  {
    id: 's1',
    name: 'Alexander Wright',
    status: 'SUBMITTED',
    statusColor: '#10B981',
    statusBg: '#ECFDF5',
    hasFiles: true,
    score: '85',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Alex',
  },
  {
    id: 's2',
    name: 'Emma Thompson',
    status: 'LATE',
    statusColor: '#D97706',
    statusBg: '#FEF3C7',
    hasFiles: true,
    score: '72',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Emma',
  },
  {
    id: 's3',
    name: 'Liam Johnson',
    status: 'NOT SUBMITTED',
    statusColor: '#9CA3AF',
    statusBg: '#F3F4F6',
    hasFiles: false,
    score: '0',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Liam',
  },
  {
    id: 's4',
    name: 'Sophie Chen',
    status: 'SUBMITTED',
    statusColor: '#10B981',
    statusBg: '#ECFDF5',
    hasFiles: true,
    score: '95',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Sophie',
  },
];

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

export default function ClassAssignmentsScreen() {
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);

  // --- RENDER: Marks Detail Screen ---
  const renderMarksDetail = () => (
    <View style={styles.detailContainer}>
      <View style={styles.marksDetailHeaderRow}>
        <TouchableOpacity onPress={() => setSelectedAssignment(null)} style={styles.backBtnWrapper}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.marksHeaderSection}>
          <Text style={styles.marksTitle}>{selectedAssignment.title}</Text>
          <View style={styles.marksMetaRow}>
            <Text style={styles.marksSubject}>{selectedAssignment.subject}</Text>
            <Text style={styles.marksDueDate}>{selectedAssignment.dueDate}</Text>
          </View>
        </View>

        {/* Stats Boxes */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>SUBMITTED</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>24/30</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>LATE</Text>
            <Text style={[styles.statValue, { color: '#D97706' }]}>02</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>PENDING</Text>
            <Text style={[styles.statValue, { color: '#9CA3AF' }]}>04</Text>
          </View>
        </View>

        {/* Student List */}
        <View style={styles.studentsList}>
          {STUDENT_MARKS_DATA.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              
              <View style={styles.studentTopRow}>
                <View style={styles.studentInfoLeft}>
                  <View style={styles.avatarBox}>
                    <Image source={{ uri: student.avatar }} style={styles.avatarImg} />
                  </View>
                  <View>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <View style={[styles.statusPill, { backgroundColor: student.statusBg }]}>
                      <Text style={[styles.statusText, { color: student.statusColor }]}>{student.status}</Text>
                    </View>
                  </View>
                </View>
                
                {student.hasFiles ? (
                  <TouchableOpacity style={styles.viewFilesBtn}>
                    <Ionicons name="link" size={14} color="#3B3CFF" />
                    <Text style={styles.viewFilesText}>View Files</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.noFilesText}>No files</Text>
                )}
              </View>

              <View style={styles.studentBottomRow}>
                <Text style={styles.marksLabelBig}>MARKS</Text>
                <View style={styles.scoreInputWrapper}>
                  <View style={styles.scoreInputBox}>
                    <Text style={styles.scoreInputText}>{student.score}</Text>
                  </View>
                  <Text style={styles.scoreTotalBig}> / 100</Text>
                </View>
              </View>

            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Save Button */}
      <View style={styles.stickyBottomBar}>
        <TouchableOpacity style={styles.saveAllBtn}>
          <Ionicons name="save" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.saveAllBtnText}>Save All Marks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- RENDER: Assignments List ---
  const renderAssignmentsList = () => (
    <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.listContainer}>
        {ASSIGNMENTS_DATA.map((assignment) => (
          <View key={assignment.id} style={styles.card}>
            
            <Text style={styles.titleText}>{assignment.title}</Text>
            
            <View style={styles.metaRow}>
              <View style={styles.metaLeft}>
                <Text style={styles.subjectText}>{assignment.subject}</Text>
                <Text style={styles.dueDateText}>{assignment.dueDate}</Text>
              </View>
              
              <TouchableOpacity style={styles.scoreContainer} activeOpacity={0.7}>
                <Text style={[styles.scoreValue, { color: assignment.scoreColor }]}>
                  {assignment.score}
                </Text>
                <Text style={styles.scoreTotal}> / {assignment.total}</Text>
                <Ionicons name="chevron-forward" size={14} color="#9CA3AF" style={styles.chevronIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.actionsRow}>
              <Text style={styles.marksLabel}>MARKS</Text>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.viewBtn} 
                  onPress={() => setSelectedAssignment(assignment)}
                >
                  <Ionicons name="book" size={14} color="#3B3CFF" />
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.editBtn}>
                  <Ionicons name="pencil" size={14} color="#4B5563" />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Background stays persistent across both views */}
      <BackgroundDecorations />
      
      {selectedAssignment ? renderMarksDetail() : renderAssignmentsList()}
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFF9F0' }, // Theme background
  detailContainer: { flex: 1, backgroundColor: 'transparent' }, 
  contentContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  listContainer: { gap: 16 },
  
  // -- List Card Styles --
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  titleText: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 10 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  metaLeft: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flex: 1 },
  subjectText: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginRight: 8, letterSpacing: 0.5 },
  dueDateText: { fontSize: 12, color: '#9CA3AF' },
  scoreContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
  scoreValue: { fontSize: 16, fontWeight: '700' },
  scoreTotal: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
  chevronIcon: { marginLeft: 4, marginTop: 2 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marksLabel: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.5 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  viewBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  viewBtnText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: '#3B3CFF' },
  editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  editBtnText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: '#4B5563' },

  // -- Marks Detail View Styles --
  marksDetailHeaderRow: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backBtnWrapper: { padding: 4, alignSelf: 'flex-start' },
  marksHeaderSection: { marginBottom: 24 },
  marksTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 6 },
  marksMetaRow: { flexDirection: 'row', alignItems: 'center' },
  marksSubject: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginRight: 10, letterSpacing: 0.5 },
  marksDueDate: { fontSize: 13, color: '#9CA3AF', fontStyle: 'italic' },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: '800' },

  studentsList: { gap: 16, paddingBottom: 80 }, 
  studentCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  studentTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  studentInfoLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', marginRight: 12, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  studentName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  statusPill: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  viewFilesBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  viewFilesText: { fontSize: 12, fontWeight: '700', color: '#3B3CFF', marginLeft: 4 },
  noFilesText: { fontSize: 12, fontStyle: 'italic', color: '#9CA3AF', marginTop: 4 },

  studentBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marksLabelBig: { fontSize: 13, fontWeight: '700', color: '#6B7280', letterSpacing: 1 },
  scoreInputWrapper: { flexDirection: 'row', alignItems: 'center' },
  scoreInputBox: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, width: 60, height: 40, justifyContent: 'center', alignItems: 'center' },
  scoreInputText: { fontSize: 16, fontWeight: '700', color: '#111827' },
  scoreTotalBig: { fontSize: 16, fontWeight: '500', color: '#9CA3AF', marginLeft: 8 },

  stickyBottomBar: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  saveAllBtn: { backgroundColor: '#3B3CFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 56, borderRadius: 16, shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  saveAllBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});