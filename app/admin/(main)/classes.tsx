import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
const CLASSES_DATA = [
  { id: '1', grade: 'Grade 10 - A', subject: 'Advanced Mathematics', teacher: 'Robert Fox', students: '35', tags: ['MATHEMATICS', 'SCIENCE'], icon: 'flask', iconColor: '#3B3CFF', iconBg: '#F0F0FF' },
  { id: '2', grade: 'Grade 11 - B', subject: 'Literature & Grammar', teacher: 'Jenny Wilson', students: '28', tags: ['ENGLISH', 'ARTS'], icon: 'globe-outline', iconColor: '#D97706', iconBg: '#FEF3C7' },
  { id: '3', grade: 'Grade 9 - C', subject: 'Modern World History', teacher: 'Guy Hawkins', students: '42', tags: ['HISTORY', 'GEOGRAPHY'], icon: 'time-outline', iconColor: '#059669', iconBg: '#D1FAE5' },
];

export default function AdminClassesScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.dateText}>Thursday, October 24th</Text>
          <Text style={styles.pageTitle}>Manage Classes</Text>
        </View>

        <TouchableOpacity 
          style={styles.createButton} 
          activeOpacity={0.8}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add-circle" size={20} color="#FFF" style={styles.createIcon} />
          <Text style={styles.createButtonText}>Create New Class</Text>
        </TouchableOpacity>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All Classes</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter" size={16} color="#6B7280" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {CLASSES_DATA.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
                </View>
                <View style={styles.cardHeaderTexts}>
                  <Text style={styles.gradeText}>{item.grade}</Text>
                  <Text style={styles.subjectText}>{item.subject}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Ionicons name="person" size={14} color="#9CA3AF" />
                  <View style={styles.statTexts}>
                    <Text style={styles.statLabel}>Teacher</Text>
                    <Text style={styles.statValue}>{item.teacher}</Text>
                  </View>
                </View>
                <View style={styles.statBox}>
                  <Ionicons name="people" size={16} color="#9CA3AF" />
                  <View style={styles.statTexts}>
                    <Text style={styles.statLabel}>Students</Text>
                    <Text style={styles.statValue}>{item.students} Total</Text>
                  </View>
                </View>
              </View>

              <View style={styles.tagsRow}>
                {item.tags.map((tag, index) => (
                  <View key={index} style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.editBtn} onPress={() => setShowEditModal(true)}>
                  <Ionicons name="pencil" size={16} color="#111827" />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewBtn}>
                  <Ionicons name="eye" size={18} color="#FFF" />
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* CREATE MODAL */}
      <Modal visible={showCreateModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Class</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput style={[styles.inputField, styles.inputFieldError]} placeholder="Class Name *" placeholderTextColor="#9CA3AF" />
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>Class name is required</Text>
              </View>
              <Text style={styles.helperText}>e.g. TY BSc IT</Text>
            </View>
            <View style={styles.inputWrapper}>
              <TextInput style={styles.inputField} placeholder="Section Name" placeholderTextColor="#9CA3AF" />
              <Text style={styles.helperText}>e.g. A / B</Text>
            </View>
            <TouchableOpacity style={styles.modalPrimaryBtn}>
              <Text style={styles.modalPrimaryBtnText}>Create Class</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowCreateModal(false)}>
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* EDIT MODAL */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Class</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CLASS NAME</Text>
              <View style={styles.inputIconWrapper}>
                <Ionicons name="book" size={16} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.inputFieldWithIcon} value="Grade 10 - A" />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>SECTION NAME</Text>
              <View style={styles.inputIconWrapper}>
                <Ionicons name="menu" size={16} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput style={styles.inputFieldWithIcon} value="Advanced Mathematics" />
              </View>
            </View>
            <View style={styles.editActionsRow}>
              <TouchableOpacity style={styles.editCancelBtn} onPress={() => setShowEditModal(false)}>
                <Text style={styles.editCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editSaveBtn}>
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
  contentContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  dot: { position: 'absolute', borderRadius: 100 },
  headerSection: { marginBottom: 20 },
  dateText: { fontSize: 14, color: '#6B7280', marginBottom: 4, fontWeight: '500' },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#111827' },
  createButton: { backgroundColor: '#3B3CFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, marginBottom: 30, shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  createIcon: { marginRight: 8 },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  listTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  filterBtn: { flexDirection: 'row', alignItems: 'center' },
  filterText: { color: '#6B7280', fontSize: 14, marginLeft: 6, fontWeight: '500' },
  listContainer: { gap: 16 },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 20, padding: 20, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconContainer: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardHeaderTexts: { flex: 1 },
  gradeText: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 2 },
  subjectText: { fontSize: 14, color: '#6B7280' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  statTexts: { marginLeft: 10 },
  statLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
  statValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  tagPill: { backgroundColor: 'rgba(243, 244, 246, 0.8)', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  tagText: { fontSize: 11, fontWeight: '600', color: '#4B5563', textTransform: 'uppercase' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: 'rgba(255, 255, 255, 0.8)' },
  editBtnText: { marginLeft: 6, fontSize: 15, fontWeight: '600', color: '#111827' },
  viewBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#3B3CFF' },
  viewBtnText: { marginLeft: 6, fontSize: 15, fontWeight: '600', color: '#FFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', paddingHorizontal: 20 },
  modalContent: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 24, padding: 24, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  closeBtn: { backgroundColor: '#F3F4F6', padding: 6, borderRadius: 16 },
  inputWrapper: { marginBottom: 20 },
  inputField: { height: 54, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 16, paddingHorizontal: 16, fontSize: 15, color: '#111827' },
  inputFieldError: { borderColor: '#EF4444' },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 2 },
  errorText: { color: '#EF4444', fontSize: 12, marginLeft: 4 },
  helperText: { color: '#9CA3AF', fontSize: 12, marginTop: 6 },
  modalPrimaryBtn: { backgroundColor: '#3B3CFF', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  modalPrimaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  modalCancelBtn: { paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  modalCancelBtnText: { color: '#6B7280', fontSize: 15, fontWeight: '600' },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 8, letterSpacing: 0.5 },
  inputIconWrapper: { flexDirection: 'row', alignItems: 'center', height: 54, backgroundColor: 'rgba(249, 250, 251, 0.8)', borderRadius: 16, paddingHorizontal: 16 },
  inputIcon: { marginRight: 10 },
  inputFieldWithIcon: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  editActionsRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
  editCancelBtn: { flex: 1, backgroundColor: '#F3F4F6', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  editCancelBtnText: { color: '#4B5563', fontSize: 15, fontWeight: '600' },
  editSaveBtn: { flex: 1, backgroundColor: '#3B3CFF', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  editSaveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});