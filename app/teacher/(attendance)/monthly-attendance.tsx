import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dummy data based on the design
const ATTENDANCE_DATA = [
  { id: '1', name: 'Aria Johnson', rollNo: '101', initials: 'AJ', percentage: 92 },
  { id: '2', name: 'Benjamin Miller', rollNo: '102', initials: 'BM', percentage: 68 },
  { id: '3', name: 'Chloe Hudson', rollNo: '103', initials: 'CH', percentage: 85 },
  { id: '4', name: 'David Wilson', rollNo: '104', initials: 'DW', percentage: 96 },
  { id: '5', name: 'Emily Fisher', rollNo: '105', initials: 'EF', percentage: 79 },
];

export default function MonthlyAttendanceScreen() {
  const router = useRouter();

  // Helper to determine color based on percentage
  const getProgressColor = (percentage: number) => {
    return percentage < 75 ? '#EF4444' : '#4461F2'; // Red for low, Blue for high
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageTitle}>Monthly Attendance</Text>
            <Text style={styles.pageSubtitle}>Section 10-A • Mathematics</Text>
          </View>
        </View>

        {/* Month Selector Card */}
        <View style={styles.monthSelectorCard}>
          <TouchableOpacity style={styles.arrowBtn}>
            <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
          </TouchableOpacity>
          
          <View style={styles.monthInfo}>
            <Ionicons name="calendar" size={18} color="#4461F2" />
            <Text style={styles.monthText}>October 2024</Text>
          </View>

          <TouchableOpacity style={styles.arrowBtn}>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionLabel}>STUDENT LIST & PROGRESS</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>36 Students</Text>
          </View>
        </View>

        {/* Students List */}
        <View style={styles.studentList}>
          {ATTENDANCE_DATA.map((student) => {
            const barColor = getProgressColor(student.percentage);

            return (
              <View key={student.id} style={styles.studentCard}>
                
                {/* Top Row: Avatar, Info, and Percentage */}
                <View style={styles.cardTopRow}>
                  <View style={styles.studentInfo}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{student.initials}</Text>
                    </View>
                    <View>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text style={styles.rollNo}>ROLL NO: {student.rollNo}</Text>
                    </View>
                  </View>
                  <Text style={[styles.percentageText, { color: barColor }]}>
                    {student.percentage}%
                  </Text>
                </View>

                {/* Bottom Row: Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${student.percentage}%`, backgroundColor: barColor }
                    ]} 
                  />
                </View>

              </View>
            );
          })}
        </View>
        
        {/* Bottom padding to ensure scroll clears any custom bottom navigation */}
        <View style={{ height: 100 }} />
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  backButton: {
    marginRight: 15,
    marginTop: 4,
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
  
  // Month Selector
  monthSelectorCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  monthInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 10,
  },
  arrowBtn: {
    padding: 5,
  },

  // List Header
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#4461F2',
    fontSize: 11,
    fontWeight: '700',
  },

  // Student Cards
  studentList: {
    paddingBottom: 20,
  },
  studentCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '800',
  },

  // Progress Bar
  progressBarContainer: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});