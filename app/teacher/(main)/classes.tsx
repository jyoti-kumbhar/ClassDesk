import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line } from "react-native-svg";
import { useRouter } from 'expo-router';

// --- Firebase Imports ---
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; 

// --- Helper: Random UI Styles ---
const getRandomStyle = () => {
  const styles = [
    { icon: 'flask', color: '#4461F2', bg: '#EEF2FF' },
    { icon: 'globe-outline', color: '#D97706', bg: '#FEF3C7' },
    { icon: 'time-outline', color: '#059669', bg: '#D1FAE5' },
    { icon: 'book-outline', color: '#DB2777', bg: '#FCE7F3' },
    { icon: 'calculator-outline', color: '#7C3AED', bg: '#EDE9FE' },
  ];
  return styles[Math.floor(Math.random() * styles.length)];
};

// --- Background Decorations ---
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

export default function ClassesScreen() {
  const router = useRouter();
  
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [classCode, setClassCode] = useState(''); 
  const [tags, setTags] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'classes'), orderBy('grade')); 
      const querySnapshot = await getDocs(q);
      const fetchedClasses = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClasses(fetchedClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
      Alert.alert("Error", "Could not fetch classes.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, className: string, classCode: string) => {
    Alert.alert(
      "Delete Class",
      `Are you sure you want to delete "${className}"? This will remove it from all students' dashboards.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              setLoading(true);
              const batch = writeBatch(db);

              // 1. Delete the class document
              const classRef = doc(db, 'classes', id);
              batch.delete(classRef);

              // 2. Remove classCode from all users in 'users' collection
              const usersRef = collection(db, 'users');
              const q = query(usersRef, where('classes', 'array-contains', classCode));
              const userDocs = await getDocs(q);

              userDocs.forEach((userDoc) => {
                const userData = userDoc.data();
                const updatedClasses = (userData.classes || []).filter((c: string) => c !== classCode);
                batch.update(doc(db, 'users', userDoc.id), { classes: updatedClasses });
              });

              await batch.commit();
              fetchClasses();
              Alert.alert("Deleted", "Class and user enrollments updated.");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Could not delete class.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleCreate = () => {
    setGrade('');
    setSubject('');
    setTeacher('');
    setClassCode(''); 
    setTags('');
    setCurrentId(null);
    setIsEditing(false);
    setModalVisible(true);
  };

  const handleEdit = (item: any) => {
    setGrade(item.grade);
    setSubject(item.subject);
    setTeacher(item.teacher);
    setClassCode(item.classCode || ''); 
    setTags(item.tags ? item.tags.join(', ') : '');
    setCurrentId(item.id);
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!grade || !subject || !teacher || !classCode) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
    const style = getRandomStyle();

    setLoading(true);
    try {
      const classData = {
        grade,
        subject,
        teacher,
        classCode: classCode.toUpperCase().trim(), 
        tags: tagArray,
      };

      if (isEditing && currentId) {
        const classRef = doc(db, 'classes', currentId);
        await updateDoc(classRef, {
            ...classData
        });
      } else {
        await addDoc(collection(db, 'classes'), {
          ...classData,
          notices: [],
          assignments: [],
          resources: [],
          icon: style.icon,
          iconColor: style.color,
          iconBg: style.bg,
          createdAt: new Date()
        });
      }

      setModalVisible(false);
      fetchClasses();
    } catch {
      Alert.alert("Error", "Could not save class.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (item: any) => {
    router.push({
      pathname: '/teacher/(classes)/notice', 
      params: { 
        id: item.id, 
        grade: item.grade,
        subject: item.subject,
        classCode: item.classCode
      }
    });
  };

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        <Text style={styles.pageTitle}>Manage Classes</Text>

        <TouchableOpacity style={styles.createBtn} activeOpacity={0.8} onPress={handleCreate}>
          <Ionicons name="add-circle" size={24} color="#FFF" />
          <Text style={styles.createBtnText}>Create New Class</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Classes</Text>
          <TouchableOpacity style={styles.filterBtn} onPress={fetchClasses}>
             <Ionicons name="refresh" size={16} color="#6B7280" />
             <Text style={styles.filterText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {loading && classes.length === 0 ? (
            <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 50 }} />
        ) : (
            <>
             {classes.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.iconWrapper, { backgroundColor: item.iconBg || '#EEF2FF' }]}>
                      {/* @ts-ignore */}
                      <Ionicons name={item.icon || 'flask'} size={24} color={item.iconColor || '#4461F2'} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.gradeText}>{item.grade}</Text>
                      <Text style={styles.subjectText}>{item.subject} • <Text style={{fontWeight: '700', color: '#4461F2'}}>{item.classCode}</Text></Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteIconButton} 
                      onPress={() => handleDelete(item.id, item.grade, item.classCode)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoBlock}>
                      <Text style={styles.infoLabel}>Teacher</Text>
                      <View style={styles.infoValueRow}>
                        <Ionicons name="person" size={14} color="#6B7280" />
                        <Text style={styles.infoValue}>{item.teacher}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.tagRow}>
                    {item.tags && item.tags.map((tag: string, idx: number) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                      <Ionicons name="pencil" size={16} color="#374151" />
                      <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewBtn} onPress={() => handleView(item)}>
                      <Ionicons name="eye" size={18} color="#FFF" />
                      <Text style={styles.viewBtnText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {classes.length === 0 && !loading && (
                  <Text style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 20 }}>No classes found.</Text>
              )}
            </>
        )}
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{isEditing ? 'Edit Class' : 'New Class'}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>Grade / Class Name</Text>
                <TextInput style={styles.input} placeholder="e.g. Grade 10 - A" value={grade} onChangeText={setGrade} />

                <Text style={styles.inputLabel}>Subject</Text>
                <TextInput style={styles.input} placeholder="e.g. Mathematics" value={subject} onChangeText={setSubject} />

                <Text style={styles.inputLabel}>Class Code</Text>
                <TextInput style={styles.input} placeholder="e.g. MATH101" value={classCode} onChangeText={setClassCode} autoCapitalize="characters" />

                <Text style={styles.inputLabel}>Teacher Name</Text>
                <TextInput style={styles.input} placeholder="e.g. Mr. Smith" value={teacher} onChangeText={setTeacher} />

                <Text style={styles.inputLabel}>Tags (comma separated)</Text>
                <TextInput style={styles.input} placeholder="MATH, SCIENCE" value={tags} onChangeText={setTags} />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>{isEditing ? 'Update Class' : 'Create Class'}</Text>}
                </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 }, 
  dateText: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 4 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  createBtn: { backgroundColor: '#4461F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, marginBottom: 30, elevation: 5 },
  createBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', padding: 5 },
  filterText: { color: '#6B7280', fontSize: 14, marginLeft: 4, fontWeight: '500' },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconWrapper: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  gradeText: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  subjectText: { fontSize: 14, color: '#6B7280' },
  deleteIconButton: { padding: 8, backgroundColor: '#FEF2F2', borderRadius: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoBlock: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  infoValueRow: { flexDirection: 'row', alignItems: 'center' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#111827', marginLeft: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { fontSize: 10, fontWeight: '700', color: '#4B5563' },
  actionRow: { flexDirection: 'row', gap: 12 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  editBtnText: { fontSize: 16, fontWeight: '600', color: '#374151', marginLeft: 6 },
  viewBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#4461F2' },
  viewBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF', marginLeft: 6 },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, fontSize: 16, color: '#111827' },
  saveBtn: { backgroundColor: '#4461F2', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 30, marginBottom: 20 },
  saveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});