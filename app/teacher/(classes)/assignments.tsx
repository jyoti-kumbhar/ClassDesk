import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line } from "react-native-svg";
import { useLocalSearchParams } from 'expo-router';

// Firebase Imports
import { 
  collection, 
  query, 
  where, 
  orderBy,
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  getDocs
} from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; 

const { width } = Dimensions.get('window');

// --- Background Component ---
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

    <View style={{ position: "absolute", top: 380, right: 10, opacity: 0.3 }}>
       <Svg height="80" width="60">
             {[0, 15, 30].map((x) => 
               [0, 15, 30, 45].map((y) => (
                 <Circle key={`${x}-${y}`} cx={x + 5} cy={y + 5} r="1.5" fill="#FDBA74" />
               ))
             )}
       </Svg>
    </View>

    <View style={{ position: "absolute", bottom: 100, left: -20 }}>
       <Svg height="120" width="120" viewBox="0 0 100 100">
             <Line x1="0" y1="50" x2="100" y2="50" stroke="#FDE68A" strokeWidth="40" opacity={0.3} transform="rotate(-45 50 50)" />
             <Line x1="20" y1="50" x2="80" y2="50" stroke="#F59E0B" strokeWidth="2" transform="rotate(-45 50 50)" />
       </Svg>
    </View>

    <View style={{ position: "absolute", bottom: 40, right: -20, opacity: 0.9 }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        <Circle cx="200" cy="200" r="150" fill="#fdf0fd" />
        <Path d="M 100 200 Q 120 120 200 100" stroke="#fbccf9" strokeWidth="30" strokeLinecap="round" fill="none" />
        <Path d="M 40 130 Q 70 80 100 130 T 160 130" stroke="#c7bdf1" strokeWidth="3" strokeLinecap="round" fill="none" />
        <Circle cx="80" cy="180" r="4" fill="#93C5FD" />
        <Circle cx="180" cy="150" r="3" fill="#93C5FD" />
      </Svg>
    </View>
  </View>
);

export default function ClassAssignmentsScreen() {
  const params = useLocalSearchParams();
  const currentClassId = (params.id as string) || ''; 
  const currentClassName = (params.className as string) || 'default-class'; 

  // UI State
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  // Data State
  const [assignments, setAssignments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]); 
  const [marks, setMarks] = useState<Record<string, string>>({}); 

  // Edit Form State
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editTotal, setEditTotal] = useState("100");

  // --- 1. Fetch Assignments ---
  useEffect(() => {
    const q = query(
      collection(db, "notices"), 
      where("className", "==", currentClassName),
      where("type", "==", "assignment"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAssignments(fetched);
      setLoading(false);
    }, (error) => {
        console.error("Fetch Error:", error);
        setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentClassName]);

  // --- 2. Fetch Real Students & Marks ---
  useEffect(() => {
    const fetchStudentsAndMarks = async (assignmentId: string) => {
      setDetailsLoading(true);
      try {
        // Query 1: Get REAL students belonging to this class
        const studentsQuery = query(
          collection(db, "classMembers"), 
          where("classId", "==", currentClassId),
          where("role", "==", "student")
        );

        // Query 2: Get the marks for this specific assignment
        const marksRef = collection(db, `assignments/${assignmentId}/marks`);

        // Execute both network requests concurrently
        const [studentsSnap, marksSnap] = await Promise.all([
          getDocs(studentsQuery),
          getDocs(marksRef)
        ]);

        // Process Marks
        const loadedMarks: Record<string, string> = {};
        marksSnap.docs.forEach(doc => {
          loadedMarks[doc.id] = doc.data().score;
        });

        // Process Students (Mock Data Removed!)
        const loadedStudents = studentsSnap.docs.map(doc => {
          const studentData = doc.data();
          return {
            id: doc.id,
            name: studentData.name || 'Unknown Student',
            avatar: studentData.avatar || null,
            status: loadedMarks[doc.id] ? 'GRADED' : 'PENDING'
          };
        });

        setStudents(loadedStudents);
        setMarks(loadedMarks);
      } catch (error) {
        console.log("Error fetching students/marks:", error);
      } finally {
        setDetailsLoading(false);
      }
    };

    if (selectedAssignment) {
      fetchStudentsAndMarks(selectedAssignment.id);
    }
  }, [selectedAssignment, currentClassId]);

  // --- 3. Handle Delete ---
  const handleDelete = (id: string) => {
    Alert.alert("Delete Assignment", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "notices", id));
            setSelectedAssignment(null); 
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Could not delete assignment.");
          }
        }
      }
    ]);
  };

  // --- 4. Handle Edit ---
  const openEditModal = (assignment: any) => {
    setEditTitle(assignment.title);
    setEditDesc(assignment.description);
    setEditTotal(assignment.total ? String(assignment.total) : "100");
    setEditModalVisible(true);
  };

  const saveAssignmentChanges = async () => {
    if (!selectedAssignment) return;
    try {
      const ref = doc(db, "notices", selectedAssignment.id);
      await updateDoc(ref, {
        title: editTitle,
        description: editDesc,
        total: editTotal
      });
      setSelectedAssignment((prev: any) => ({ ...prev, title: editTitle, description: editDesc, total: editTotal }));
      setEditModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Update failed.");
    } 
  };

  // --- 5. Save Marks ---
  const handleSaveMarks = async () => {
    if (!selectedAssignment) return;
    setDetailsLoading(true);
    try {
      const promises = students.map(student => {
        const score = marks[student.id];
        if (score !== undefined && score !== "") {
           const markDocRef = doc(db, `assignments/${selectedAssignment.id}/marks`, student.id);
           return setDoc(markDocRef, { score }, { merge: true });
        }
        return Promise.resolve(); 
      });

      await Promise.all(promises);
      
      // Update local status to graded
      setStudents(prev => prev.map(s => marks[s.id] ? {...s, status: 'GRADED'} : s));
      
      Alert.alert("Saved", "Student marks have been updated.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save marks.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateMark = (studentId: string, val: string) => {
    setMarks(prev => ({ ...prev, [studentId]: val }));
  };

  // --- FILTER LOGIC ---
  const filteredAssignments = assignments.filter(assignment => {
      const queryLower = searchQuery.toLowerCase().trim();
      if (!queryLower) return true;
      const title = (assignment.title || "").toLowerCase();
      const subject = (assignment.subject || "").toLowerCase();
      return title.includes(queryLower) || subject.includes(queryLower);
  });

  // --- RENDER: Marks Detail Screen ---
  const renderMarksDetail = () => (
    <View style={styles.detailContainer}>
      <View style={styles.marksDetailHeaderRow}>
        <TouchableOpacity onPress={() => setSelectedAssignment(null)} style={styles.backBtnWrapper}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{flexDirection:'row', gap: 10}}>
             <TouchableOpacity onPress={() => openEditModal(selectedAssignment)} style={styles.iconBtn}>
                <Ionicons name="pencil" size={20} color="#4B5563" />
             </TouchableOpacity>
             <TouchableOpacity onPress={() => handleDelete(selectedAssignment.id)} style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
             </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.marksHeaderSection}>
          <View style={{flexDirection:'row', alignItems:'center', gap: 8, marginBottom: 6}}>
             <Text style={styles.marksTitle}>{selectedAssignment.title}</Text>
             {selectedAssignment.status === 'draft' && (
                <View style={{backgroundColor:'#FEF3C7', paddingHorizontal:6, paddingVertical:2, borderRadius:4}}>
                    <Text style={{fontSize:10, fontWeight:'700', color:'#D97706'}}>DRAFT</Text>
                </View>
             )}
          </View>
          {selectedAssignment.subject && (
              <Text style={{color: '#6B7280', fontWeight: '600', marginBottom: 4}}>{selectedAssignment.subject}</Text>
          )}
          <Text style={styles.marksDesc}>{selectedAssignment.description}</Text>
          <View style={styles.marksMetaRow}>
             <Text style={styles.marksSubject}>Max Score: {selectedAssignment.total || 100}</Text>
          </View>
        </View>

        {detailsLoading ? (
            <ActivityIndicator size="large" color="#3B3CFF" style={{marginTop: 40}} />
        ) : (
            <View style={styles.studentsList}>
              {students.map((student) => (
                <View key={student.id} style={styles.studentCard}>
                  <View style={styles.studentTopRow}>
                    <View style={styles.studentInfoLeft}>
                      {student.avatar ? (
                          <View style={styles.avatarBox}>
                            <Image source={{ uri: student.avatar }} style={styles.avatarImg} />
                          </View>
                      ) : (
                          <View style={styles.avatarBox}>
                             <Text style={{fontWeight: 'bold', color: '#9CA3AF'}}>{student.name.substring(0, 2).toUpperCase()}</Text>
                          </View>
                      )}
                      
                      <View>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <View style={[styles.statusPill, { backgroundColor: student.status === 'GRADED' ? '#ECFDF5' : '#FEF3C7' }]}>
                          <Text style={[styles.statusText, { color: student.status === 'GRADED' ? '#10B981' : '#D97706' }]}>{student.status}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.studentBottomRow}>
                    <Text style={styles.marksLabelBig}>MARKS</Text>
                    <View style={styles.scoreInputWrapper}>
                      <TextInput 
                        style={styles.scoreInputBox}
                        value={marks[student.id] || ""}
                        onChangeText={(text) => updateMark(student.id, text)}
                        keyboardType="numeric"
                        placeholder="0"
                      />
                      <Text style={styles.scoreTotalBig}> / {selectedAssignment.total || 100}</Text>
                    </View>
                  </View>
                </View>
              ))}
              {students.length === 0 && <Text style={{textAlign: 'center', color: '#9CA3AF'}}>No students enrolled yet.</Text>}
            </View>
        )}
      </ScrollView>

      <View style={styles.stickyBottomBar}>
        <TouchableOpacity style={styles.saveAllBtn} onPress={handleSaveMarks} disabled={detailsLoading}>
          {detailsLoading ? <ActivityIndicator color="#FFF"/> : (
             <>
               <Ionicons name="save" size={20} color="#FFF" style={{ marginRight: 8 }} />
               <Text style={styles.saveAllBtnText}>Save All Marks</Text>
             </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- RENDER: Assignments List ---
  const renderAssignmentsList = () => (
    <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* --- SEARCH BAR --- */}
      <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={{marginRight: 10}} />
          <TextInput 
              style={styles.searchInput}
              placeholder="Search by title or subject..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
          )}
      </View>

      {loading ? (
          <ActivityIndicator size="large" color="#3B3CFF" style={{marginTop: 40}} />
      ) : (
          <View style={styles.listContainer}>
            {filteredAssignments.length === 0 ? (
                <Text style={{textAlign:'center', color:'#9CA3AF', marginTop: 40}}>
                    {searchQuery ? "No matching assignments found." : "No assignments yet."}
                </Text>
            ) : (
                filteredAssignments.map((assignment) => (
                <View key={assignment.id} style={styles.card}>
                    
                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.titleText}>{assignment.title}</Text>
                            {assignment.subject && (
                                <Text style={styles.subjectTextSmall}>{assignment.subject}</Text>
                            )}
                            {assignment.status === 'draft' && (
                                <Text style={{fontSize:10, fontWeight:'700', color:'#D97706', marginBottom:4, marginTop: 4}}>DRAFT</Text>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => handleDelete(assignment.id)}>
                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.metaRow}>
                        <Text style={styles.subjectText}>Total: {assignment.total || 100} pts</Text>
                        <Text style={styles.dueDateText}>
                            {assignment.createdAt?.seconds 
                              ? new Date(assignment.createdAt.seconds * 1000).toLocaleDateString() 
                              : 'Just now'}
                        </Text>
                    </View>

                    <View style={styles.actionsRow}>
                        <TouchableOpacity 
                            style={styles.viewBtn} 
                            onPress={() => setSelectedAssignment(assignment)}
                        >
                            <Ionicons name="book" size={14} color="#3B3CFF" />
                            <Text style={styles.viewBtnText}>Grade Students</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                ))
            )}
          </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.mainContainer}>
      <BackgroundDecorations />
      
      {selectedAssignment ? renderMarksDetail() : renderAssignmentsList()}

      {/* Edit Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Edit Assignment</Text>
                  
                  <Text style={styles.label}>Title</Text>
                  <TextInput style={styles.input} value={editTitle} onChangeText={setEditTitle} />
                  
                  <Text style={styles.label}>Description</Text>
                  <TextInput style={[styles.input, {height: 80}]} multiline value={editDesc} onChangeText={setEditDesc} />

                  <Text style={styles.label}>Total Marks</Text>
                  <TextInput style={styles.input} keyboardType="numeric" value={editTotal} onChangeText={setEditTotal} />

                  <View style={{flexDirection:'row', gap: 10, marginTop: 20}}>
                      <TouchableOpacity style={[styles.btn, {backgroundColor:'#EEE'}]} onPress={() => setEditModalVisible(false)}>
                          <Text>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btn, {backgroundColor:'#3B3CFF'}]} onPress={saveAssignmentChanges}>
                          <Text style={{color:'white'}}>Save</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#ffffff' }, 
  detailContainer: { flex: 1, backgroundColor: 'transparent' }, 
  contentContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  listContainer: { gap: 16 },
  
  // -- Search Bar --
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    height: '100%',
  },

  // -- List Card Styles --
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  titleText: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 2 },
  subjectTextSmall: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  subjectText: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginRight: 8, letterSpacing: 0.5 },
  dueDateText: { fontSize: 12, color: '#9CA3AF' },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  viewBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  viewBtnText: { marginLeft: 6, fontSize: 13, fontWeight: '600', color: '#3B3CFF' },

  // -- Marks Detail View Styles --
  marksDetailHeaderRow: { flexDirection:'row', justifyContent:'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  backBtnWrapper: { padding: 4 },
  iconBtn: { padding: 8, backgroundColor: '#FFF', borderRadius: 8 },
  marksHeaderSection: { marginBottom: 24 },
  marksTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 0 },
  marksDesc: { fontSize: 14, color: '#4B5563', marginBottom: 8 },
  marksMetaRow: { flexDirection: 'row', alignItems: 'center' },
  marksSubject: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginRight: 10, letterSpacing: 0.5 },

  studentsList: { gap: 16, paddingBottom: 80 }, 
  studentCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  studentTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  studentInfoLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', marginRight: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  avatarImg: { width: '100%', height: '100%' },
  studentName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  statusPill: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  studentBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marksLabelBig: { fontSize: 13, fontWeight: '700', color: '#6B7280', letterSpacing: 1 },
  scoreInputWrapper: { flexDirection: 'row', alignItems: 'center' },
  scoreInputBox: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, width: 70, height: 40, textAlign: 'center', fontSize: 16, fontWeight: '700', color: '#111827' },
  scoreTotalBig: { fontSize: 16, fontWeight: '500', color: '#9CA3AF', marginLeft: 8 },

  stickyBottomBar: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  saveAllBtn: { backgroundColor: '#3B3CFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 56, borderRadius: 16, shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  saveAllBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  label: { fontSize: 12, color: '#6B7280', marginBottom: 5, fontWeight:'600' },
  input: { backgroundColor: '#F3F4F6', borderRadius: 8, padding: 12, marginBottom: 15 },
  btn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', justifyContent:'center' }
});