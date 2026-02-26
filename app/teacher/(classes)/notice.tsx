import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  Linking,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from "react-native-svg";
import { useLocalSearchParams, router } from 'expo-router'; // UPDATED: Added router here
import DateTimePicker from '@react-native-community/datetimepicker'; 

// Firebase Imports
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  onSnapshot, 
  query, 
  orderBy,
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; 

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: 30, right: -40 }}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill="#F3E8FF" opacity={0.6} />
        <Circle cx="100" cy="100" r="50" fill="#E9D5FF" opacity={0.4} />
      </Svg>
    </View>
  </View>
);

export default function ClassNoticesScreen() {
  const params = useLocalSearchParams();
  // Safe fallback to prevent undefined error
  const currentClassId = (params.id as string) || ""; 
  const currentClassName = (params.grade as string) || 'Classroom'; 
  const currentSubject = (params.subject as string) || 'General';

  // UI State
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeForm, setActiveForm] = useState<'notice' | 'assignment' | 'resource' | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [notices, setNotices] = useState<any[]>([]);
  const [dbClassCode, setDbClassCode] = useState("Loading...");

  // Form Input State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState(""); 
  const [formSubject, setFormSubject] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewNotice, setViewNotice] = useState<any | null>(null);

  // 1. Fetch Class Code from DB specifically
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!currentClassId) return;
      try {
        const classRef = doc(db, 'classes', currentClassId);
        const classSnap = await getDoc(classRef);
        if (classSnap.exists()) {
          setDbClassCode(classSnap.data().classCode || "N/A");
        }
      } catch (error) {
        console.error("Error fetching class code:", error);
      }
    };
    fetchClassDetails();
  }, [currentClassId]);

  // 4. Fetch only notices belonging to this class
  useEffect(() => {
    if (!currentClassId) return;

    const q = query(
      collection(db, "notices"), 
      where("classId", "==", currentClassId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotices = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotices(fetchedNotices);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [currentClassId]);

  const openForm = (formType: 'notice' | 'assignment' | 'resource', item?: any) => {
    setShowDropdown(false);
    setActiveForm(formType);
    
    if (item) {
      setEditingId(item.id);
      setTitle(item.title);
      setFormSubject(item.subject || currentSubject);
      setDescription(item.description);
      setLink(item.link || "");
      setTotalMarks(item.total ? String(item.total) : "100");
      setDeadline(item.deadline ? new Date(item.deadline.seconds * 1000) : new Date());
    } else {
      setEditingId(null);
      setTitle("");
      setFormSubject(currentSubject);
      setDescription("");
      setLink("");
      setTotalMarks("100");
      setDeadline(new Date());
    }
  };

  // 3. Save notice, assignment, resource with class name and code
  const handleSave = async (status: 'published' | 'draft') => {
    // FIX: Ensure classId is not undefined before calling Firebase
    if (!currentClassId) {
      Alert.alert("Error", "Class identification lost. Please reload the screen.");
      return;
    }

    if (!title) {
      Alert.alert("Missing Fields", "Please add a title.");
      return;
    }

    setLoading(true);
    try {
      const data = {
        classId: currentClassId,
        className: currentClassName, 
        classCode: dbClassCode,       
        subject: formSubject || currentSubject, 
        title: title || "",
        description: description || "",
        type: activeForm || "notice", 
        status: status, 
        link: link || null, 
        total: activeForm === 'assignment' ? totalMarks : null,
        deadline: activeForm === 'assignment' ? deadline : null,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, "notices", editingId), data);
        Alert.alert("Success", "Updated successfully!");
      } else {
        await addDoc(collection(db, "notices"), {
          ...data,
          createdAt: serverTimestamp(),
        });
        Alert.alert("Success", status === 'draft' ? "Saved as Draft" : "Posted successfully!");
      }
      setActiveForm(null); 
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => await deleteDoc(doc(db, "notices", id)) }
    ]);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDeadline(selectedDate);
  };

  const getTypeIcon = (type: string) => {
    if (type === 'assignment') return 'clipboard-outline';
    if (type === 'resource') return 'folder-open-outline';
    return 'notifications-outline';
  };

  return (
    <View style={styles.mainContainer}>
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.className}>{currentClassName}</Text>
          <Text style={styles.classDetails}>{currentSubject} • {dbClassCode}</Text>
        </View>

        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => setShowDropdown(!showDropdown)}
        >
          <View style={styles.createButtonInner}>
            <Ionicons name="add-circle" size={20} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.createButtonText}>Create New</Text>
          </View>
          <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#FFF" />
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => openForm('assignment')}>
              <Ionicons name="clipboard-outline" size={18} color="#4B5563" /><Text style={styles.dropdownText}>Assignment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => openForm('notice')}>
              <Ionicons name="megaphone-outline" size={18} color="#4B5563" /><Text style={styles.dropdownText}>Notice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={() => openForm('resource')}>
              <Ionicons name="folder-outline" size={18} color="#4B5563" /><Text style={styles.dropdownText}>Share Resource</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- NEW BUTTON: View & Grade Assignments --- */}
        <TouchableOpacity 
          style={[styles.createButton, { backgroundColor: '#10B981', marginTop: -10, marginBottom: 24 }]} 
          onPress={() => router.push({ 
            pathname: '/teacher/(classes)/assignments', 
            params: { 
              className: currentClassName, 
              id: currentClassId 
            } 
          })}
        >
          <View style={styles.createButtonInner}>
            <Ionicons name="book" size={20} color="#FFF" style={{marginRight: 8}} />
            <Text style={styles.createButtonText}>View & Grade Assignments</Text>
          </View>
        </TouchableOpacity>
        {/* ------------------------------------------- */}

        <View style={styles.joiningCard}>
          <View style={styles.joiningHeader}>
            <Ionicons name="link" size={16} color="#3B3CFF" />
            <Text style={styles.joiningTitle}>JOINING DETAILS</Text>
          </View>
          <View style={styles.joiningCodesRow}>
            <View style={styles.codeColumn}>
              <Text style={styles.codeLabel}>CLASS CODE</Text>
              <Text style={styles.codeValue}>{dbClassCode}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionHeader}>UPDATES & RESOURCES</Text>

        <View style={styles.noticesList}>
          {notices.map((notice) => (
            <TouchableOpacity 
              key={notice.id} 
              style={[styles.noticeCard, notice.status === 'draft' && { opacity: 0.7, borderColor: '#F59E0B' }]}
              onPress={() => setViewNotice(notice)}
            >
              <View style={styles.noticeHeader}>
                <View style={{flexDirection:'row', alignItems:'center', flex:1}}>
                  <View style={[styles.typeIcon, { backgroundColor: notice.type === 'resource' ? '#E0E7FF' : '#F3F4F6' }]}>
                    <Ionicons name={getTypeIcon(notice.type)} size={16} color="#374151" />
                  </View>
                  <Text style={styles.noticeTitle} numberOfLines={1}>{notice.title}</Text>
                </View>
                <View style={{flexDirection: 'row', gap: 15}}>
                  <TouchableOpacity onPress={() => openForm(notice.type, notice)}><Ionicons name="pencil" size={18} color="#6B7280" /></TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(notice.id)}><Ionicons name="trash-outline" size={18} color="#EF4444" /></TouchableOpacity>
                </View>
              </View>
              <Text style={styles.noticeDesc} numberOfLines={2}>{notice.description}</Text>
              <Text style={styles.noticeTime}>Tap to view details</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Forms Modal (Notice/Assignment/Resource) */}
      <Modal visible={activeForm !== null} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.formTitle}>{editingId ? 'Edit' : 'Create'} {activeForm}</Text>
                <TouchableOpacity onPress={() => setActiveForm(null)} style={styles.closeBtn}><Ionicons name="close" size={24} color="#111827" /></TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>TITLE</Text>
              <TextInput style={styles.inputField} value={title} onChangeText={setTitle} placeholder="Enter title..." />

              {activeForm === 'assignment' && (
                <>
                  <Text style={styles.inputLabel}>TOTAL POINTS</Text>
                  <TextInput style={styles.inputField} value={totalMarks} onChangeText={setTotalMarks} keyboardType="numeric" />
                  
                  <Text style={styles.inputLabel}>DEADLINE</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}>
                    <Text>{deadline.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showDatePicker && <DateTimePicker value={deadline} mode="date" display="default" onChange={onDateChange} />}
                </>
              )}

              <Text style={styles.inputLabel}>DESCRIPTION</Text>
              <TextInput style={[styles.inputField, styles.textArea]} value={description} onChangeText={setDescription} multiline />

              {activeForm !== 'notice' && (
                <>
                  <Text style={styles.inputLabel}>ATTACHMENT LINK</Text>
                  <TextInput style={styles.inputField} value={link} onChangeText={setLink} placeholder="https://..." autoCapitalize="none" />
                </>
              )}

              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.primaryActionBtn, styles.draftBtn]} onPress={() => handleSave('draft')}>
                  <Text style={{color: '#4B5563'}}>Save Draft</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryActionBtn, {flex: 2}]} onPress={() => handleSave('published')}>
                   {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryActionText}>{editingId ? "Update" : "Publish"}</Text>}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Details View Modal */}
      <Modal visible={viewNotice !== null} animationType="fade" transparent>
        <View style={styles.fullScreenOverlay}>
          <View style={styles.fullScreenContainer}>
            {viewNotice && (
              <ScrollView contentContainerStyle={{padding: 20}}>
                <TouchableOpacity onPress={() => setViewNotice(null)}><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
                <Text style={styles.fsTitle}>{viewNotice.title}</Text>
                <Text style={styles.fsDesc}>{viewNotice.description}</Text>
                {viewNotice.link && (
                  <TouchableOpacity style={styles.downloadBtn} onPress={() => Linking.openURL(viewNotice.link)}>
                    <Text style={styles.downloadText}>Open Attachment</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFF9F0' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  headerSection: { marginBottom: 20 },
  className: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 4 },
  classDetails: { fontSize: 12, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' },
  createButton: { backgroundColor: '#3B3CFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, marginBottom: 24 },
  createButtonInner: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center' },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  dropdownMenu: { backgroundColor: '#FFF', borderRadius: 16, padding: 8, marginBottom: 15, elevation: 5 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  dropdownText: { marginLeft: 12, fontWeight: '600' },
  joiningCard: { backgroundColor: '#F4F7FF', borderRadius: 20, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#E0E7FF' },
  joiningHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  joiningTitle: { fontSize: 12, fontWeight: '700', color: '#3B3CFF', marginLeft: 6 },
  joiningCodesRow: { flexDirection: 'row' },
  codeColumn: { flex: 1 },
  codeLabel: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginBottom: 6 },
  codeValue: { fontSize: 13, fontWeight: '700', color: '#111827' },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', marginBottom: 16 },
  noticesList: { gap: 16 },
  noticeCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  noticeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  typeIcon: { width: 28, height: 28, borderRadius: 8, alignItems:'center', justifyContent:'center', marginRight: 10},
  noticeTitle: { flex: 1, fontSize: 16, fontWeight: '700' },
  noticeDesc: { fontSize: 14, color: '#6B7280', marginBottom: 12 },
  noticeTime: { fontSize: 12, color: '#9CA3AF', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: '80%' },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  formTitle: { fontSize: 22, fontWeight: '800' },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', marginTop: 15, marginBottom: 8 },
  inputField: { backgroundColor: '#F3F4F6', borderRadius: 12, padding: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  datePickerBtn: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 12 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 25 },
  primaryActionBtn: { flex: 1, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3B3CFF' },
  draftBtn: { backgroundColor: '#E5E7EB' },
  primaryActionText: { color: '#FFF', fontWeight: '700' },
  fullScreenOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  fullScreenContainer: { backgroundColor: '#FFF', borderRadius: 25, maxHeight: '80%' },
  fsTitle: { fontSize: 22, fontWeight: '800', marginTop: 15 },
  fsDesc: { fontSize: 16, color: '#4B5563', marginVertical: 20 },
  downloadBtn: { backgroundColor: '#3B3CFF', padding: 15, borderRadius: 12, alignItems: 'center' },
  downloadText: { color: '#FFF', fontWeight: '700' },
  closeBtn: { padding: 5 }
});