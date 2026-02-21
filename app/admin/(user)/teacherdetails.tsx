import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data ---
const JOINED_CLASSES = [
  {
    id: '1',
    title: '10-A | Mathematics',
    schedule: 'Mon, Wed, Fri • 09:00 AM',
    icon: 'calculator',
    iconColor: '#3B3CFF',
    iconBg: '#EEF2FF',
  },
  {
    id: '2',
    title: '11-B | Advanced Algebra',
    schedule: 'Tue, Thu • 11:30 AM',
    icon: 'pulse', 
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
  },
  {
    id: '3',
    title: '9-C | Geometry',
    schedule: 'Wed, Fri • 02:00 PM',
    icon: 'shapes',
    iconColor: '#D97706',
    iconBg: '#FEF3C7',
  },
  {
    id: '4',
    title: '12-A | Physics Lab',
    schedule: 'Monday • 10:00 AM',
    icon: 'flask',
    iconColor: '#EF4444',
    iconBg: '#FEE2E2',
  },
];

// --- Custom Top Bar Component ---
const DetailsTopBar = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={26} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Teacher Details</Text>
      <View style={{ width: 26 }} />
    </View>
  );
};

// --- Main Screen Component ---
export default function TeacherDetailsScreen() {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleAssignClick = () => {
    setShowAssignModal(false);
    // Slight delay to allow the first modal to close smoothly before opening the next
    setTimeout(() => {
      setShowInviteModal(true);
    }, 150);
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      <DetailsTopBar />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Teacher Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.teacherName}>Robert Fox</Text>
          <Text style={styles.teacherEmail}>robert.fox@classdesk.edu</Text>
          
          <View style={styles.badgePill}>
            <Ionicons name="checkmark-circle" size={14} color="#3B3CFF" />
            <Text style={styles.badgeText}>SENIOR EDUCATOR</Text>
          </View>
        </View>

        {/* Classes List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle}>Joined Classes</Text>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>4 Active</Text>
          </View>
        </View>

        {/* Joined Classes List */}
        <View style={styles.listContainer}>
          {JOINED_CLASSES.map((cls) => (
            <View key={cls.id} style={styles.classCard}>
              <View style={[styles.iconBox, { backgroundColor: cls.iconBg }]}>
                {/* @ts-ignore */}
                <Ionicons name={cls.icon} size={20} color={cls.iconColor} />
              </View>
              <View style={styles.classDetails}>
                <Text style={styles.classTitle}>{cls.title}</Text>
                <Text style={styles.classSchedule}>{cls.schedule}</Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn}>
                <Ionicons name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Sticky Bottom Action Button */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity 
          style={styles.assignBtn} 
          activeOpacity={0.8}
          onPress={() => setShowAssignModal(true)}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFF" />
          <Text style={styles.assignBtnText}>Assign Class</Text>
        </TouchableOpacity>
      </View>

      {/* --- MODAL 1: ASSIGN CLASS (Bottom Sheet style) --- */}
      <Modal visible={showAssignModal} transparent animationType="slide">
        <View style={styles.modalOverlayBottom}>
          <View style={styles.bottomSheetContent}>
            
            <View style={styles.dragIndicator} />

            <View style={styles.modalHeaderRow}>
              <View>
                <Text style={styles.modalTitleBig}>Assign Class</Text>
                <Text style={styles.modalSubtitle}>Select class and subject for Robert Fox</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setShowAssignModal(false)}>
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Dropdown 1 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Class</Text>
              <TouchableOpacity style={styles.dropdownSelector}>
                <View style={styles.dropdownLeft}>
                  <Ionicons name="book" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <Text style={styles.dropdownText}>Choose a class...</Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Dropdown 2 */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Subject</Text>
              <TouchableOpacity style={styles.dropdownSelector}>
                <View style={styles.dropdownLeft}>
                  <Ionicons name="library" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <Text style={styles.dropdownText}>Choose a subject...</Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryModalBtn} onPress={handleAssignClick}>
              <Text style={styles.primaryModalBtnText}>Assign Class</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelTextBtn} onPress={() => setShowAssignModal(false)}>
              <Text style={styles.cancelTextBtnLabel}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: SEND INVITATION (Center Popup style) --- */}
      <Modal visible={showInviteModal} transparent animationType="fade">
        <View style={styles.modalOverlayCenter}>
          <View style={styles.centerModalContent}>
            
            <Text style={styles.modalTitleBig}>Send Invitation</Text>
            <Text style={styles.modalSubtitle}>Invite a new teacher to join ClassDesk.</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabelUppercase}>EMAIL ADDRESS</Text>
              <TextInput 
                style={styles.textInput}
                placeholder="e.g. teacher@school.edu"
                placeholderTextColor="#9CA3AF"
                defaultValue="robert.fox@classdesk.edu"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabelUppercase}>INVITATION MESSAGE</Text>
              <TextInput 
                style={styles.textArea}
                multiline
                defaultValue="Hello! You've been invited to join the ClassDesk faculty. Please click the link below to set up your account and access your assigned classes."
              />
            </View>

            <TouchableOpacity style={styles.primaryModalBtn} onPress={() => setShowInviteModal(false)}>
              <Text style={styles.primaryModalBtnText}>Send Invitation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelTextBtn} onPress={() => setShowInviteModal(false)}>
              <Text style={styles.cancelTextBtnLabel}>Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 50 : 60, paddingBottom: 20, backgroundColor: '#F9FAFB' },
  backButton: { padding: 4, marginLeft: -4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  
  infoSection: { marginBottom: 32, marginTop: 10 },
  teacherName: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 4 },
  teacherEmail: { fontSize: 15, color: '#6B7280', marginBottom: 16 },
  badgePill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#EEF2FF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  badgeText: { marginLeft: 6, fontSize: 12, fontWeight: '700', color: '#3B3CFF', letterSpacing: 0.5 },

  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  activePill: { backgroundColor: '#EEF2FF', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  activePillText: { fontSize: 12, fontWeight: '700', color: '#3B3CFF' },

  listContainer: { gap: 16 },
  classCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  classDetails: { flex: 1 },
  classTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
  classSchedule: { fontSize: 13, color: '#9CA3AF' },
  deleteBtn: { padding: 8, marginLeft: 10 },

  stickyBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#F9FAFB', borderTopWidth: 1, borderTopColor: 'rgba(229, 231, 235, 0.5)' },
  assignBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3B3CFF', paddingVertical: 18, borderRadius: 16, shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  assignBtnText: { marginLeft: 8, fontSize: 16, fontWeight: '700', color: '#FFF' },

  // --- Modal Styles ---
  modalOverlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', paddingHorizontal: 20 },
  
  bottomSheetContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingBottom: 30, paddingTop: 12 },
  centerModalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },

  dragIndicator: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  modalTitleBig: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  closeBtn: { backgroundColor: '#F3F4F6', padding: 6, borderRadius: 16 },

  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 8 },
  inputLabelUppercase: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 8 },

  dropdownSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 16 },
  dropdownLeft: { flexDirection: 'row', alignItems: 'center' },
  dropdownText: { fontSize: 15, color: '#111827', fontWeight: '500' },

  textInput: { height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 16, fontSize: 15, color: '#111827' },
  textArea: { height: 120, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 16, paddingTop: 16, fontSize: 15, color: '#111827', textAlignVertical: 'top', lineHeight: 22 },

  primaryModalBtn: { backgroundColor: '#3B3CFF', paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 10, shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  primaryModalBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  
  cancelTextBtn: { paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  cancelTextBtnLabel: { color: '#6B7280', fontSize: 16, fontWeight: '600' },
});