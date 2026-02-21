import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dummy data based on the design
const INITIAL_STUDENTS = [
  { id: '1', name: 'Aria Johnson', rollNo: '101', initials: 'AJ', status: 'present' },
  { id: '2', name: 'Benjamin Miller', rollNo: '102', initials: 'BM', status: 'absent' },
  { id: '3', name: 'Chloe Hudson', rollNo: '103', initials: 'CH', status: 'present' },
  { id: '4', name: 'David Wilson', rollNo: '104', initials: 'DW', status: 'present' },
  { id: '5', name: 'Emily Fisher', rollNo: '105', initials: 'EF', status: 'present' },
];

export default function MarkDailyAttendanceScreen() {
  const router = useRouter();
  const [students, setStudents] = useState(INITIAL_STUDENTS);

  // Calculate totals dynamically
  const totalPresent = students.filter(s => s.status === 'present').length;
  const totalAbsent = students.filter(s => s.status === 'absent').length;

  const toggleStatus = (id: string, newStatus: string) => {
    setStudents(prev => 
      prev.map(student => student.id === id ? { ...student, status: newStatus } : student)
    );
  };

  const handleSave = () => {
    // Logic to save attendance to your backend goes here
    router.back(); 
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Mark Daily Attendance</Text>
          <Text style={styles.pageSubtitle}>Section 10-A • Thursday, Oct 24</Text>
        </View>

        {/* Subject Info Cards */}
        <Text style={styles.sectionLabel}>SUBJECT NAME</Text>
        <View style={styles.infoCard}>
          <View style={styles.iconBox}>
            <Ionicons name="book" size={16} color="#9CA3AF" />
          </View>
          <Text style={styles.infoText}>Mathematics</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.sectionLabel}>TIME OF LECTURE</Text>
            <View style={styles.infoCard}>
              <View style={[styles.iconBox, { borderRadius: 12 }]}>
                 <Ionicons name="time" size={16} color="#9CA3AF" />
              </View>
              <Text style={styles.infoText}>10:30 AM</Text>
            </View>
          </View>
          
          <View style={styles.halfWidth}>
            <Text style={styles.sectionLabel}>TOPIC NAME</Text>
            <View style={styles.infoCard}>
              <Text style={[styles.infoText, { marginLeft: 5 }]}>Calculus II</Text>
            </View>
          </View>
        </View>

        {/* Attendance List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionLabel}>STUDENT ATTENDANCE</Text>
          <View style={styles.statsRow}>
            <Text style={styles.presentStat}>{totalPresent} Present</Text>
            <Text style={styles.absentStat}>{totalAbsent} Absent</Text>
          </View>
        </View>

        {/* Students List */}
        <View style={styles.studentList}>
          {students.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              
              <View style={styles.studentInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{student.initials}</Text>
                </View>
                <View>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.rollNo}>Roll No: {student.rollNo}</Text>
                </View>
              </View>

              {/* Toggle Switch */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, student.status === 'present' && styles.toggleBtnPresent]}
                  onPress={() => toggleStatus(student.id, 'present')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toggleText, student.status === 'present' && styles.toggleTextActive]}>
                    PRESENT
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.toggleBtn, student.status === 'absent' && styles.toggleBtnAbsent]}
                  onPress={() => toggleStatus(student.id, 'absent')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toggleText, student.status === 'absent' && styles.toggleTextActive]}>
                    ABSENT
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </View>
        
        {/* Bottom padding to prevent the list from hiding behind the save button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Save Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="person-add" size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.saveBtnText}>Save Attendance</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    marginBottom: 25,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 5,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconBox: {
    backgroundColor: '#F3F4F6',
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
  },
  presentStat: {
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: '700',
    marginRight: 8,
  },
  absentStat: {
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: '700',
  },
  studentList: {
    paddingBottom: 20,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#4461F2',
    fontWeight: '700',
    fontSize: 15,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  rollNo: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleBtnPresent: {
    backgroundColor: '#10B981', // Green
  },
  toggleBtnAbsent: {
    backgroundColor: '#EF4444', // Red
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  toggleTextActive: {
    color: '#FFF',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  saveBtn: {
    backgroundColor: '#4461F2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#4461F2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});