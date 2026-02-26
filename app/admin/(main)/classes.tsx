import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import { ClassDatabase, Classroom } from '../../services/classDatabase';

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>
    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>
    <View style={{ position: "absolute", top: 300, left: -40, opacity: 0.5 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Circle cx="40" cy="50" r="40" fill="#6EE7B7" opacity={0.4} />
        <Circle cx="60" cy="30" r="15" fill="#93C5FD" opacity={0.6} />
      </Svg>
    </View>
    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
  </View>
);

export default function AdminClassesScreen() {
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // States for Editing
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setLoading(true);
    const data = await ClassDatabase.getClasses();
    setClasses(data);
    setLoading(false);
  };

  const openEditModal = (item: Classroom) => {
    setSelectedClass(item);
    setEditTitle(item.title);
    setEditSubject(item.subject);
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedClass) return;

    const updatedClass: Classroom = {
      ...selectedClass,
      title: editTitle,
      subject: editSubject,
    };

    try {
      // 1. Remove the old version
      await ClassDatabase.deleteClass(selectedClass.id);
      // 2. Add the updated version
      await ClassDatabase.addClass(updatedClass);
      
      Alert.alert("Success", "Class updated successfully");
      setShowEditModal(false);
      loadClasses(); // Reload list
    } catch {
      Alert.alert("Error", "Failed to update class");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3B3CFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.dateText}>System Overview</Text>
          <Text style={styles.pageTitle}>Manage Classes</Text>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All Classrooms</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadClasses}>
            <Ionicons name="refresh" size={16} color="#4461F2" />
            <Text style={styles.refreshText}>Reload</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {classes.length > 0 ? (
            classes.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                    {item.iconName ? (
                      <Ionicons name={item.iconName as any} size={24} color={item.iconColor} />
                    ) : (
                      <Text style={[styles.avatarText, { color: item.iconColor }]}>{item.iconText || 'CL'}</Text>
                    )}
                  </View>
                  <View style={styles.cardHeaderTexts}>
                    <Text style={styles.gradeText}>{item.title}</Text>
                    <Text style={styles.subjectText}>{item.subject}</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Ionicons name="layers" size={14} color="#9CA3AF" />
                    <View style={styles.statTexts}>
                      <Text style={styles.statLabel}>Section</Text>
                      <Text style={styles.statValue}>{item.section}</Text>
                    </View>
                  </View>
                  <View style={styles.statBox}>
                    <Ionicons name="people" size={16} color="#9CA3AF" />
                    <View style={styles.statTexts}>
                      <Text style={styles.statLabel}>Students</Text>
                      <Text style={styles.statValue}>{item.students} Enrolled</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity 
                    style={styles.editBtn} 
                    onPress={() => openEditModal(item)}
                  >
                    <Ionicons name="pencil" size={16} color="#111827" />
                    <Text style={styles.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.viewBtn}>
                    <Ionicons name="eye" size={18} color="#FFF" />
                    <Text style={styles.viewBtnText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="file-tray-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No classes found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* EDIT MODAL */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Class</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CLASS TITLE</Text>
              <View style={styles.inputIconWrapper}>
                <Ionicons name="book" size={16} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={styles.inputFieldWithIcon} 
                  value={editTitle} 
                  onChangeText={setEditTitle}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SUBJECT</Text>
              <View style={styles.inputIconWrapper}>
                <Ionicons name="document-text" size={16} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={styles.inputFieldWithIcon} 
                  value={editSubject} 
                  onChangeText={setEditSubject}
                />
              </View>
            </View>

            <View style={styles.editActionsRow}>
              <TouchableOpacity style={styles.editCancelBtn} onPress={() => setShowEditModal(false)}>
                <Text style={styles.editCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editSaveBtn} onPress={handleSaveChanges}>
                <Text style={styles.editSaveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  center: { justifyContent: 'center', alignItems: 'center' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40 },
  dot: { position: 'absolute', borderRadius: 100 },
  headerSection: { marginBottom: 30 },
  dateText: { fontSize: 14, color: '#6B7280', marginBottom: 4, fontWeight: '600' },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  listTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  refreshText: { color: '#4461F2', fontSize: 14, marginLeft: 6, fontWeight: '600' },
  listContainer: { gap: 16 },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 24, padding: 20, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconContainer: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 18, fontWeight: 'bold' },
  cardHeaderTexts: { flex: 1 },
  gradeText: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 2 },
  subjectText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 4 },
  statBox: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statTexts: { marginLeft: 10 },
  statLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  editBtnText: { marginLeft: 6, fontSize: 15, fontWeight: '700', color: '#111827' },
  viewBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: '#3B3CFF' },
  viewBtnText: { marginLeft: 6, fontSize: 15, fontWeight: '700', color: '#FFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#111827' },
  closeBtn: { backgroundColor: '#F3F4F6', padding: 8, borderRadius: 20 },
  inputGroup: { marginBottom: 24 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', marginBottom: 10, letterSpacing: 0.5 },
  inputIconWrapper: { flexDirection: 'row', alignItems: 'center', height: 56, backgroundColor: '#F9FAFB', borderRadius: 16, paddingHorizontal: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  inputIcon: { marginRight: 12 },
  inputFieldWithIcon: { flex: 1, fontSize: 16, color: '#111827', fontWeight: '600' },
  editActionsRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  editCancelBtn: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 16, borderRadius: 18, alignItems: 'center' },
  editCancelBtnText: { color: '#4B5563', fontSize: 16, fontWeight: '700' },
  editSaveBtn: { flex: 1, backgroundColor: '#3B3CFF', paddingVertical: 16, borderRadius: 18, alignItems: 'center' },
  editSaveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 12, color: '#9CA3AF', fontSize: 16, fontWeight: '600' },
});