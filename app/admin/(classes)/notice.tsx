import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data ---
const NOTICES_DATA = [
  {
    id: '1',
    title: 'Quarterly Examination Schedule',
    time: '2h ago',
    description: 'The schedule for the upcoming quarterly examinations has been...',
    attachment: { type: 'pdf', name: 'exam_schedule.pdf' },
  },
  {
    id: '2',
    title: 'New Assignment: Calculus Basics',
    time: 'Yesterday',
    description: 'Complete the exercises on page 42–45 and submit by Friday. Refer to the diagram attached.',
    attachment: { type: 'image', name: 'math_diagram.png' },
  },
  {
    id: '3',
    title: 'Class Representative Meeting',
    time: 'Oct 20',
    description: 'All class representatives are requested to gather in the auditorium during lunch break.',
    attachment: null,
  },
];

export default function ClassNoticesScreen() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeForm, setActiveForm] = useState<'notice' | 'assignment' | 'resource' | null>(null);
  
  // Toggles for forms
  const [isScheduled, setIsScheduled] = useState(false);

  const openForm = (formType: 'notice' | 'assignment' | 'resource') => {
    setShowDropdown(false);
    setActiveForm(formType);
    setIsScheduled(false); // reset toggles
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Top Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.className}>Grade 10 – A</Text>
          <Text style={styles.classDetails}>MATHEMATICS • ROBERT FOX</Text>
        </View>

        {/* Create Button Container with relative positioning for Dropdown */}
        <View style={{ zIndex: 10 }}>
          <TouchableOpacity 
            style={styles.createButton} 
            activeOpacity={0.8}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <View style={styles.createButtonInner}>
              <Ionicons name="add-circle" size={20} color="#FFF" style={styles.createIcon} />
              <Text style={styles.createButtonText}>Create</Text>
            </View>
            <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={18} color="#FFF" />
          </TouchableOpacity>

          {/* Dropdown Menu */}
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

        {/* Joining Details Card */}
        <View style={styles.joiningCard}>
          <View style={styles.joiningHeader}>
            <Ionicons name="link" size={16} color="#3B3CFF" />
            <Text style={styles.joiningTitle}>JOINING DETAILS</Text>
          </View>
          
          <View style={styles.joiningCodesRow}>
            <View style={styles.codeColumn}>
              <Text style={styles.codeLabel}>JOINING CODE</Text>
              <TouchableOpacity style={styles.codePill}>
                <Text style={styles.codeValue}>XJ2–9KL</Text>
                <Ionicons name="copy-outline" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.codeColumn}>
              <Text style={styles.codeLabel}>SHORTLINK</Text>
              <TouchableOpacity style={styles.codePill}>
                <Text style={styles.codeValue}>cls.dk/10a</Text>
                <Ionicons name="copy-outline" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Recent Notices Section */}
        <Text style={styles.sectionHeader}>RECENT NOTICES</Text>

        <View style={styles.noticesList}>
          {NOTICES_DATA.map((notice) => (
            <View key={notice.id} style={styles.noticeCard}>
              
              <View style={styles.noticeHeader}>
                <Text style={styles.noticeTitle}>{notice.title}</Text>
                <Text style={styles.noticeTime}>{notice.time}</Text>
              </View>

              <Text style={styles.noticeDesc}>{notice.description}</Text>

              {notice.attachment && (
                <TouchableOpacity style={styles.attachmentPill}>
                  <Ionicons 
                    name={notice.attachment.type === 'pdf' ? 'document-text' : 'image'} 
                    size={16} 
                    color={notice.attachment.type === 'pdf' ? '#EF4444' : '#3B3CFF'} 
                  />
                  <Text style={styles.attachmentText}>{notice.attachment.name}</Text>
                </TouchableOpacity>
              )}

            </View>
          ))}
        </View>

      </ScrollView>

      {/* --- FORMS MODAL --- */}
      <Modal visible={activeForm !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Common Modal Header */}
              <View style={styles.modalHeaderRow}>
                <View>
                  <Text style={styles.formTitle}>
                    {activeForm === 'notice' && 'Create Notice'}
                    {activeForm === 'assignment' && 'Create Assignment'}
                    {activeForm === 'resource' && 'Share Resource'}
                  </Text>
                  <Text style={styles.formSubtitle}>
                    {activeForm === 'notice' && 'Post a new update for Grade 10-A'}
                    {activeForm === 'assignment' && 'New task for Grade 10-A'}
                    {activeForm === 'resource' && 'Upload materials for Grade 10-A'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setActiveForm(null)} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color="#111827" />
                </TouchableOpacity>
              </View>

              {/* --- 1. CREATE NOTICE FORM --- */}
              {activeForm === 'notice' && (
                <View style={styles.formBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>NOTICE TITLE</Text>
                    <TextInput style={styles.inputField} placeholder="Enter title (e.g., Weekly Quiz)" placeholderTextColor="#9CA3AF" />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>DESCRIPTION</Text>
                    <TextInput 
                      style={[styles.inputField, styles.textArea]} 
                      placeholder="Write the notice details here..." 
                      placeholderTextColor="#9CA3AF"
                      multiline
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ATTACH FILES</Text>
                    <TouchableOpacity style={styles.dashedUploadBox}>
                      <View style={styles.uploadIconWrapper}>
                        <Ionicons name="cloud-upload" size={20} color="#FFF" />
                      </View>
                      <Text style={styles.uploadMainText}>Add documents or images</Text>
                      <Text style={styles.uploadSubText}>PDF, DOC, JPG up to 10MB</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.primaryActionBtn}>
                    <Ionicons name="send" size={16} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryActionText}>Publish Notice</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => setActiveForm(null)}>
                    <Text style={styles.secondaryActionText}>Save as Draft</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* --- 2. CREATE ASSIGNMENT FORM --- */}
              {activeForm === 'assignment' && (
                <View style={styles.formBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ASSIGNMENT TITLE</Text>
                    <TextInput style={styles.inputField} placeholder="e.g. Quadratic Equations Quiz" placeholderTextColor="#9CA3AF" />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>DESCRIPTION</Text>
                    <TextInput 
                      style={[styles.inputField, styles.textArea]} 
                      placeholder="Add detailed instructions for the students..." 
                      placeholderTextColor="#9CA3AF"
                      multiline
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>UPLOAD RESOURCE</Text>
                    <View style={styles.pillsRow}>
                      <TouchableOpacity style={styles.uploadPill}><Ionicons name="document-text" size={18} color="#EF4444" /><Text style={styles.pillText}>PDF</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.uploadPill}><Ionicons name="document" size={18} color="#10B981" /><Text style={styles.pillText}>Doc</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.uploadPill}><Ionicons name="link" size={18} color="#D97706" /><Text style={styles.pillText}>Link</Text></TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.rowInputs}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>DUE DATE</Text>
                      <View style={styles.iconInputWrapper}>
                        <TextInput style={styles.iconInputField} placeholder="mm/dd/yyyy" placeholderTextColor="#9CA3AF" />
                        <Ionicons name="calendar-outline" size={18} color="#111827" />
                      </View>
                    </View>
                    <View style={{ width: 16 }} />
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>DUE TIME</Text>
                      <View style={styles.iconInputWrapper}>
                        <TextInput style={styles.iconInputField} placeholder="-- : --" placeholderTextColor="#9CA3AF" />
                        <Ionicons name="time-outline" size={18} color="#111827" />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>ASSIGN MARKS</Text>
                    <View style={styles.iconInputWrapper}>
                      <TextInput style={styles.iconInputField} placeholder="Total Marks" placeholderTextColor="#9CA3AF" keyboardType="numeric" />
                      <Text style={styles.ptsText}>PTS</Text>
                    </View>
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchLabelRow}>
                      <Ionicons name="calendar" size={20} color="#9CA3AF" />
                      <Text style={styles.switchLabel}>Schedule Assignment</Text>
                    </View>
                    <Switch value={isScheduled} onValueChange={setIsScheduled} trackColor={{ false: "#E5E7EB", true: "#3B3CFF" }} />
                  </View>

                  <TouchableOpacity style={styles.primaryActionBtn}>
                    <Text style={styles.primaryActionText}>Publish Assignment</Text>
                  </TouchableOpacity>
                  <View style={styles.dualActionRow}>
                    <TouchableOpacity style={styles.secondaryActionBtnHalf}>
                      <Text style={styles.secondaryActionText}>Save as Draft</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryActionBtnHalf} onPress={() => setActiveForm(null)}>
                      <Text style={styles.secondaryActionText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* --- 3. SHARE RESOURCE FORM --- */}
              {activeForm === 'resource' && (
                <View style={styles.formBody}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>RESOURCE TITLE</Text>
                    <TextInput style={styles.inputField} placeholder="e.g. Chapter 4 Practice Prob" placeholderTextColor="#9CA3AF" />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>DESCRIPTION</Text>
                    <TextInput 
                      style={[styles.inputField, styles.textArea]} 
                      placeholder="Add detailed instructions or context for the students..." 
                      placeholderTextColor="#9CA3AF"
                      multiline
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>UPLOAD SECTION</Text>
                    <View style={styles.gridPills}>
                      <TouchableOpacity style={styles.uploadGridPill}><Ionicons name="document-text" size={18} color="#EF4444" /><Text style={styles.pillText}>PDF</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.uploadGridPill}><Ionicons name="image" size={18} color="#3B3CFF" /><Text style={styles.pillText}>Image</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.uploadGridPill}><Ionicons name="document" size={18} color="#10B981" /><Text style={styles.pillText}>Doc</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.uploadGridPill}><Ionicons name="link" size={18} color="#D97706" /><Text style={styles.pillText}>Link</Text></TouchableOpacity>
                    </View>
                    <TextInput style={[styles.inputField, { marginTop: 12 }]} placeholder="Paste video or external URL here" placeholderTextColor="#9CA3AF" />
                  </View>

                  <View style={styles.switchRow}>
                    <View style={styles.switchLabelRow}>
                      <Ionicons name="enter-outline" size={20} color="#9CA3AF" style={{ transform: [{ scaleX: -1 }] }} />
                      <Text style={styles.switchLabel}>Schedule Resource</Text>
                    </View>
                    <Switch value={isScheduled} onValueChange={setIsScheduled} trackColor={{ false: "#E5E7EB", true: "#3B3CFF" }} />
                  </View>

                  <TouchableOpacity style={styles.primaryActionBtn}>
                    <Text style={styles.primaryActionText}>Share Now</Text>
                  </TouchableOpacity>
                  <View style={styles.dualActionRow}>
                    <TouchableOpacity style={styles.secondaryActionBtnHalf}>
                      <Text style={styles.secondaryActionText}>Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryActionBtnHalf} onPress={() => setActiveForm(null)}>
                      <Text style={styles.secondaryActionText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Bottom padding for scroll */}
              <View style={{ height: 40 }} />
            </ScrollView>

          </View>
        </View>
      </Modal>

    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  
  // Header
  headerSection: { marginBottom: 20 },
  className: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 4 },
  classDetails: { fontSize: 12, fontWeight: '600', color: '#6B7280', letterSpacing: 0.5, textTransform: 'uppercase' },

  // Create Button & Dropdown
  createButton: {
    backgroundColor: '#3B3CFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 20, borderRadius: 16, marginBottom: 24,
    shadowColor: '#3B3CFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  createButtonInner: { flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', marginLeft: 18 },
  createIcon: { marginRight: 8 },
  createButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  
  dropdownMenu: {
    position: 'absolute', top: 60, left: 0, right: 0, backgroundColor: '#FFF',
    borderRadius: 16, padding: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 10, borderWidth: 1, borderColor: '#F3F4F6',
  },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10 },
  dropdownText: { marginLeft: 12, fontSize: 15, fontWeight: '600', color: '#111827' },

  // Joining Details
  joiningCard: { backgroundColor: '#F4F7FF', borderRadius: 20, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#E0E7FF' },
  joiningHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  joiningTitle: { fontSize: 12, fontWeight: '700', color: '#3B3CFF', marginLeft: 6, letterSpacing: 0.5 },
  joiningCodesRow: { flexDirection: 'row', gap: 16 },
  codeColumn: { flex: 1 },
  codeLabel: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', marginBottom: 6 },
  codePill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  codeValue: { fontSize: 13, fontWeight: '700', color: '#111827' },

  // Notices List
  sectionHeader: { fontSize: 13, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 16 },
  noticesList: { gap: 16 },
  noticeCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 6, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  noticeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  noticeTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111827', marginRight: 10, lineHeight: 24 },
  noticeTime: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', marginTop: 2 },
  noticeDesc: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 16 },
  attachmentPill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#FFF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  attachmentText: { marginLeft: 8, fontSize: 13, fontWeight: '600', color: '#111827' },

  // --- MODAL STYLES ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FAFAFA', borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '90%', paddingHorizontal: 24, paddingTop: 24 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  formTitle: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: '#6B7280' },
  closeBtn: { padding: 4, backgroundColor: '#E5E7EB', borderRadius: 20 },
  formBody: { flex: 1 },

  // Form Inputs
  inputGroup: { marginBottom: 24 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.8, marginBottom: 10 },
  inputField: { backgroundColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 16, height: 56, fontSize: 15, color: '#111827' },
  textArea: { height: 120, paddingTop: 16, textAlignVertical: 'top' },
  rowInputs: { flexDirection: 'row', marginBottom: 24 },
  iconInputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 16, height: 56 },
  iconInputField: { flex: 1, fontSize: 15, color: '#111827' },
  ptsText: { fontSize: 14, fontWeight: '700', color: '#9CA3AF' },

  // Attachments & Pills
  dashedUploadBox: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 20, padding: 24, alignItems: 'center', backgroundColor: '#FFF' },
  uploadIconWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#3B3CFF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  uploadMainText: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  uploadSubText: { fontSize: 12, color: '#9CA3AF' },
  pillsRow: { flexDirection: 'row', gap: 10 },
  gridPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  uploadPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderWidth: 1, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 12, height: 48 },
  uploadGridPill: { width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderWidth: 1, borderStyle: 'dashed', borderColor: '#D1D5DB', borderRadius: 12, height: 48 },
  pillText: { marginLeft: 8, fontSize: 14, fontWeight: '600', color: '#111827' },

  // Switch & Actions
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  switchLabelRow: { flexDirection: 'row', alignItems: 'center' },
  switchLabel: { fontSize: 15, fontWeight: '600', color: '#111827', marginLeft: 10 },
  primaryActionBtn: { backgroundColor: '#3B3CFF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 56, borderRadius: 16, marginBottom: 12 },
  primaryActionText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  secondaryActionBtn: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', height: 56, borderRadius: 16 },
  secondaryActionText: { color: '#4B5563', fontSize: 16, fontWeight: '600' },
  dualActionRow: { flexDirection: 'row', gap: 12 },
  secondaryActionBtnHalf: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', height: 56, borderRadius: 16 },
});