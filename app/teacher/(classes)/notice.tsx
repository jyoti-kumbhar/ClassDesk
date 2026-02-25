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
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker'; 

// Firebase Imports
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; 

// --- Background Component ---
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
  const currentClassId = (params.id as string) || 'default-id'; 
  const currentClassName = (params.grade as string) || 'Classroom'; 
  const currentSubject = (params.subject as string) || 'General';

  // UI State
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeForm, setActiveForm] = useState<'notice' | 'assignment' | 'resource' | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Data State
  const [notices, setNotices] = useState<any[]>([]);
  const [joinCode] = useState("XJ2–9KL");

  // Form Input State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState(""); 
  const [resourceType, setResourceType] = useState<'link'>('link');
  const [formSubject, setFormSubject] = useState("");
  // --- NEW: Total Marks State ---
  const [totalMarks, setTotalMarks] = useState("100");
  
  // New Feature State: Date Picker & Drafts
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewNotice, setViewNotice] = useState<any | null>(null);

  useEffect(() => {
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
      Alert.alert("Error", "Failed to load notices.");
    });
    return () => unsubscribe();
  }, [currentClassId]);

  // --- Reset & Open Form ---
  const openForm = (formType: 'notice' | 'assignment' | 'resource', item?: any) => {
    setShowDropdown(false);
    setActiveForm(formType);
    
    if (item) {
      setEditingId(item.id);
      setTitle(item.title);
      setFormSubject(item.subject || currentSubject);
      setDescription(item.description);
      setLink(item.link || "");
      setResourceType('link'); 
      // Load existing marks if editing
      setTotalMarks(item.total ? String(item.total) : "100");
      setDeadline(item.deadline ? new Date(item.deadline.seconds * 1000) : new Date());
    } else {
      setEditingId(null);
      setTitle("");
      setFormSubject(currentSubject);
      setDescription("");
      setLink("");
      setResourceType('link');
      // Reset marks for new item
      setTotalMarks("100");
      setDeadline(new Date());
    }
  };

  // --- Save Logic ---
  const handleSave = async (status: 'published' | 'draft') => {
    if (!title) {
      Alert.alert("Missing Fields", "Please add a title.");
      return;
    }

    setLoading(true);
    try {
      // 1. Prepare Data
      const data = {
        classId: currentClassId,
        className: currentClassName, 
        subject: formSubject || currentSubject, 
        title,
        description,
        type: activeForm, 
        status: status, 
        link: link || null, 
        resourceType: (activeForm === 'resource' || activeForm === 'assignment') ? 'link' : null,
        // Save the total marks (only for assignments)
        total: activeForm === 'assignment' ? totalMarks : null,
        deadline: activeForm === 'assignment' ? deadline : null,
        updatedAt: serverTimestamp(),
      };

      // 2. Firestore Write
      if (editingId) {
        const noticeRef = doc(db, "notices", editingId);
        await updateDoc(noticeRef, data);
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

  // --- Delete Logic ---
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "notices", id));
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Failed to delete item.");
            }
          }
        }
      ]
    );
  };

  const handleDownload = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open link."));
    } else {
      Alert.alert("No Link", "There is no link attached.");
    }
  };

  // Date Picker Handler
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || deadline;
    setShowDatePicker(Platform.OS === 'ios');
    setDeadline(currentDate);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'assignment': return 'clipboard-outline';
      case 'resource': return 'folder-open-outline';
      default: return 'notifications-outline';
    }
  };
  const getResourceIcon = (type: string) => {
      switch(type) {
          case 'pdf': return 'document-text';
          case 'docx': return 'document';
          default: return 'link';
      }
  };
  const getResourceLabel = (type: string) => {
    switch(type) {
        case 'pdf': return 'PDF Document';
        case 'docx': return 'Word File';
        default: return 'Link';
    }
  };


  return (
    <View style={styles.mainContainer}>
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.className}>{currentClassName}</Text>
          <Text style={styles.classDetails}>{currentSubject} • CLASSROOM</Text>
        </View>

        <View style={{ zIndex: 10 }}>
          <TouchableOpacity 
            style={styles.createButton} 
            activeOpacity={0.8}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <View style={styles.createButtonInner}>
              <Ionicons name="add-circle" size={20} color="#FFF" style={styles.createIcon} />
              <Text style={styles.createButtonText}>Create New</Text>
            </View>
            <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#FFF" />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownMenu}>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => openForm('assignment')}>
                <Ionicons name="clipboard-outline" size={18} color="#4B5563" />
                <Text style={styles.dropdownText}>Assignment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => openForm('notice')}>
                <Ionicons name="megaphone-outline" size={18} color="#4B5563" />
                <Text style={styles.dropdownText}>Notice</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dropdownItem} onPress={() => openForm('resource')}>
                <Ionicons name="folder-outline" size={18} color="#4B5563" />
                <Text style={styles.dropdownText}>Share Resource</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Joining Card */}
        <View style={styles.joiningCard}>
              <View style={styles.joiningHeader}>
                 <Ionicons name="link" size={16} color="#3B3CFF" />
                 <Text style={styles.joiningTitle}>JOINING DETAILS</Text>
              </View>
              <View style={styles.joiningCodesRow}>
                 <View style={styles.codeColumn}>
                    <Text style={styles.codeLabel}>JOINING CODE</Text>
                    <Text style={styles.codeValue}>{joinCode}</Text>
                 </View>
                 <View style={styles.codeColumn}>
                    <Text style={styles.codeLabel}>SHORTLINK</Text>
                    <Text style={styles.codeValue}>cls.dk/10a</Text>
                 </View>
              </View>
        </View>

        <Text style={styles.sectionHeader}>UPDATES & RESOURCES</Text>

        <View style={styles.noticesList}>
          {notices.map((notice) => (
            <TouchableOpacity 
              key={notice.id} 
              style={[styles.noticeCard, notice.status === 'draft' && { opacity: 0.7, borderColor: '#F59E0B' }]}
              activeOpacity={0.9}
              onPress={() => setViewNotice(notice)}
            >
              <View style={styles.noticeHeader}>
                <View style={{flexDirection:'row', alignItems:'center', flex:1}}>
                    <View style={[styles.typeIcon, { 
                        backgroundColor: notice.type === 'resource' ? '#E0E7FF' : notice.type === 'assignment' ? '#FEF3C7' : '#F3F4F6' 
                    }]}>
                        <Ionicons name={getTypeIcon(notice.type)} size={16} color="#374151" />
                    </View>
                    <View>
                        <Text style={styles.noticeTitle} numberOfLines={1}>{notice.title}</Text>
                        {notice.status === 'draft' && <Text style={{fontSize:10, color:'#D97706', fontWeight:'700'}}>DRAFT</Text>}
                    </View>
                </View>
                {/* Actions */}
                <View style={{flexDirection: 'row', gap: 15}}>
                    <TouchableOpacity onPress={() => openForm(notice.type, notice)}>
                        <Ionicons name="pencil" size={18} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(notice.id)}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.noticeDesc} numberOfLines={2}>{notice.description}</Text>
              
              {/* Assignment Deadline Display in List */}
              {notice.type === 'assignment' && notice.deadline && (
                 <View style={{flexDirection:'row', alignItems:'center', marginBottom: 8}}>
                    <Ionicons name="calendar-outline" size={12} color="#EF4444" />
                    <Text style={{fontSize:12, color:'#EF4444', marginLeft:4}}>
                        Due: {new Date(notice.deadline.seconds * 1000).toLocaleDateString()}
                    </Text>
                 </View>
              )}

              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                {notice.link ? (
                    <View style={styles.attachmentPill}>
                        <Ionicons 
                            name={getResourceIcon(notice.resourceType)} 
                            size={14} 
                            color="#3B3CFF" 
                        />
                        <Text style={styles.attachmentText}>
                             {getResourceLabel(notice.resourceType)}
                        </Text>
                    </View>
                ) : <View />}
                 <Text style={styles.noticeTime}>Tap to view</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* --- FORMS MODAL --- */}
      <Modal visible={activeForm !== null} animationType="slide" transparent>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeaderRow}>
                <View>
                  <Text style={styles.formTitle}>
                    {editingId ? 'Edit' : 'Create'} {activeForm ? activeForm.charAt(0).toUpperCase() + activeForm.slice(1) : ''}
                  </Text>
                  <Text style={styles.formSubtitle}>{currentClassName}</Text>
                </View>
                <TouchableOpacity onPress={() => setActiveForm(null)} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color="#111827" />
                </TouchableOpacity>
              </View>

              <View style={styles.formBody}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>TITLE</Text>
                  <TextInput 
                    style={styles.inputField} 
                    placeholder="Enter title..." 
                    placeholderTextColor="#9CA3AF" 
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                {/* --- SUBJECT FIELD --- */}
                {(activeForm === 'assignment' || activeForm === 'resource') && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>SUBJECT / TOPIC</Text>
                      <TextInput 
                        style={styles.inputField} 
                        placeholder={`e.g. ${currentSubject} - Chapter 1`} 
                        placeholderTextColor="#9CA3AF" 
                        value={formSubject}
                        onChangeText={setFormSubject}
                      />
                    </View>
                )}

                {/* --- NEW: TOTAL MARKS FIELD (Assignments Only) --- */}
                {activeForm === 'assignment' && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>TOTAL POINTS</Text>
                        <TextInput 
                            style={styles.inputField} 
                            placeholder="e.g. 100" 
                            placeholderTextColor="#9CA3AF" 
                            value={totalMarks}
                            onChangeText={setTotalMarks}
                            keyboardType="numeric"
                        />
                    </View>
                )}

                {/* Date Picker - Only for Assignments */}
                {activeForm === 'assignment' && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>SUBMISSION DEADLINE</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <TouchableOpacity 
                                onPress={() => setShowDatePicker(true)}
                                style={styles.datePickerBtn}
                            >
                                <Ionicons name="calendar" size={18} color="#4B5563" />
                                <Text style={styles.dateText}>
                                    {deadline.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                </Text>
                            </TouchableOpacity>
                            
                            {showDatePicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={deadline}
                                    mode="date" 
                                    is24Hour={true}
                                    display="default"
                                    onChange={onDateChange}
                                />
                            )}
                        </View>
                    </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>DESCRIPTION</Text>
                  <TextInput 
                    style={[styles.inputField, styles.textArea]} 
                    placeholder="Enter details..." 
                    placeholderTextColor="#9CA3AF"
                    multiline
                    value={description}
                    onChangeText={setDescription}
                  />
                </View>

                {(activeForm === 'resource' || activeForm === 'assignment') && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>ATTACHMENT (LINK ONLY)</Text>
                        
                        <View style={styles.typeSelector}>
                            <TouchableOpacity 
                                disabled={true} 
                                style={[styles.typeChip, styles.typeChipActive]}
                            >
                                <Ionicons name="link" size={16} color="#FFF" />
                                <Text style={[styles.typeChipText, styles.typeChipTextActive]}>Link</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.inputLabel, {marginTop: 15}]}>
                            WEBSITE / DRIVE / DROPBOX URL
                        </Text>
                        
                        <TextInput 
                            style={styles.inputField} 
                            placeholder="https://drive.google.com/..."
                            placeholderTextColor="#9CA3AF" 
                            value={link}
                            onChangeText={setLink}
                            autoCapitalize="none"
                        />
                    </View>
                )}

                <View style={styles.actionRow}>
                    <TouchableOpacity 
                        style={[styles.primaryActionBtn, styles.draftBtn]} 
                        onPress={() => handleSave('draft')} 
                        disabled={loading}
                    >
                        <Text style={[styles.primaryActionText, {color: '#4B5563'}]}>Save Draft</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.primaryActionBtn, {flex: 2}]} 
                        onPress={() => handleSave('published')} 
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <>
                                <Ionicons name="send" size={16} color="#FFF" style={{ marginRight: 8 }} />
                                <Text style={styles.primaryActionText}>{editingId ? "Update" : "Publish"}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- VIEW FULL SCREEN MODAL --- */}
      <Modal visible={viewNotice !== null} animationType="fade" transparent>
        <View style={styles.fullScreenOverlay}>
              <View style={styles.fullScreenContainer}>
                {viewNotice && (
                    <>
                        <View style={styles.fsHeader}>
                            <TouchableOpacity onPress={() => setViewNotice(null)} style={styles.closeBtn}>
                                <Ionicons name="arrow-back" size={24} color="#111827" />
                            </TouchableOpacity>
                            <Text style={styles.fsTitleHeader}>Details</Text>
                            <View style={{width: 30}} /> 
                        </View>

                        <ScrollView contentContainerStyle={{padding: 20}}>
                             <View style={styles.fsTypeBadge}>
                                 <Text style={styles.fsTypeText}>{viewNotice.type.toUpperCase()}</Text>
                             </View>
                             
                             <Text style={styles.fsTitle}>{viewNotice.title}</Text>
                             <Text style={{color:'#6B7280', fontWeight:'600', marginBottom:4}}>
                                {viewNotice.subject || currentSubject}
                             </Text>
                             
                             {viewNotice.status === 'draft' && (
                                 <View style={{backgroundColor: '#FEF3C7', padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10}}>
                                      <Text style={{color: '#D97706', fontWeight: 'bold'}}>DRAFT MODE</Text>
                                 </View>
                             )}

                             {viewNotice.type === 'assignment' && viewNotice.total && (
                                 <Text style={{color: '#111827', fontWeight:'600', marginBottom: 5}}>
                                      Total Points: {viewNotice.total}
                                 </Text>
                             )}

                             {viewNotice.deadline && (
                                 <Text style={{color: '#EF4444', fontWeight:'600', marginBottom: 5}}>
                                      Due: {new Date(viewNotice.deadline.seconds * 1000).toLocaleDateString()}
                                 </Text>
                             )}
                             
                             <Text style={styles.fsDate}>Posted Recently</Text>

                             <View style={styles.divider} />

                             <Text style={styles.fsDesc}>{viewNotice.description}</Text>

                             {viewNotice.link && (
                                 <TouchableOpacity 
                                    style={[styles.downloadBtn, {
                                        backgroundColor: viewNotice.resourceType === 'pdf' ? '#EF4444' : viewNotice.resourceType === 'docx' ? '#2563EB' : '#10B981'
                                    }]}
                                    onPress={() => handleDownload(viewNotice.link)}
                                 >
                                     <Ionicons 
                                        name={viewNotice.resourceType === 'link' ? "globe-outline" : "cloud-download-outline"} 
                                        size={20} 
                                        color="#FFF" 
                                     />
                                     <Text style={styles.downloadText}>
                                          {viewNotice.resourceType === 'pdf' ? 'Open PDF File' : viewNotice.resourceType === 'docx' ? 'Open Document' : 'Visit Link'}
                                     </Text>
                                 </TouchableOpacity>
                             )}
                        </ScrollView>
                    </>
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
  classDetails: { fontSize: 12, fontWeight: '600', color: '#6B7280', letterSpacing: 0.5, textTransform: 'uppercase' },
  createButton: { backgroundColor: '#3B3CFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, marginBottom: 24, shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  createButtonInner: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', marginLeft: 18 },
  createIcon: { marginRight: 8 },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  dropdownMenu: { position: 'absolute', top: 60, left: 0, right: 0, backgroundColor: '#FFF', borderRadius: 16, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10 },
  dropdownText: { marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#111827' },
  joiningCard: { backgroundColor: '#F4F7FF', borderRadius: 20, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#E0E7FF' },
  joiningHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  joiningTitle: { fontSize: 12, fontWeight: '700', color: '#3B3CFF', marginLeft: 6, letterSpacing: 0.5 },
  joiningCodesRow: { flexDirection: 'row', gap: 16 },
  codeColumn: { flex: 1 },
  codeLabel: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginBottom: 6 },
  codeValue: { fontSize: 13, fontWeight: '700', color: '#111827' },
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 16 },
  noticesList: { gap: 16 },
  noticeCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  noticeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  typeIcon: { width: 28, height: 28, borderRadius: 8, alignItems:'center', justifyContent:'center', marginRight: 10},
  noticeTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111827', marginRight: 10 },
  noticeTime: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  noticeDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  attachmentPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#F3F4F6', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  attachmentText: { marginLeft: 6, fontSize: 12, fontWeight: '600', color: '#3B3CFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FAFAFA', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '85%', paddingHorizontal: 24, paddingTop: 24 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  formTitle: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: '#6B7280' },
  closeBtn: { padding: 8, backgroundColor: '#E5E7EB', borderRadius: 20 },
  formBody: { flex: 1 },
  inputGroup: { marginBottom: 24 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 10 },
  inputField: { backgroundColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 16, height: 56, fontSize: 15, color: '#111827' },
  textArea: { height: 120, paddingTop: 16, textAlignVertical: 'top' },
  actionRow: { flexDirection: 'row', gap: 12 },
  draftBtn: { backgroundColor: '#E5E7EB', flex: 1 },
  primaryActionBtn: { backgroundColor: '#3B3CFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 56, borderRadius: 16, marginBottom: 12 },
  primaryActionText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  fullScreenOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  fullScreenContainer: { backgroundColor: 'white', borderRadius: 24, height: '80%', overflow: 'hidden' },
  fsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  fsTitleHeader: { fontWeight: '700', fontSize: 16 },
  fsTypeBadge: { alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 15 },
  fsTypeText: { color: '#3B3CFF', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  fsTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  fsDate: { color: '#9CA3AF', fontSize: 14, marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 20 },
  fsDesc: { fontSize: 16, lineHeight: 26, color: '#374151', marginBottom: 30 },
  downloadBtn: { flexDirection: 'row', backgroundColor: '#10B981', padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  downloadText: { color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 5 },
  typeChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  typeChipActive: { backgroundColor: '#3B3CFF', borderColor: '#3B3CFF' },
  typeChipText: { fontSize: 12, fontWeight: '700', color: '#4B5563', marginLeft: 6 },
  typeChipTextActive: { color: '#FFF' },
  filePickerBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 16,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between'
  },
  filePickerText: { fontSize: 14, color: '#374151', fontWeight: '600' },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  dateText: { marginLeft: 10, fontWeight: '600', color: '#374151' }
});