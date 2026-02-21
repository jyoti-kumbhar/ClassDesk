import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Dummy data based on the design
const HISTORY_DATA = [
  { id: '1', name: 'Aria Johnson', initials: 'AJ', status: 'present' },
  { id: '2', name: 'Benjamin Miller', initials: 'BM', status: 'absent' },
  { id: '3', name: 'Chloe Hudson', initials: 'CH', status: 'absent' },
  { id: '4', name: 'David Wilson', initials: 'DW', status: 'present' },
];

export default function AttendanceHistoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Attendance History</Text>
        </View>

        {/* Filters Row */}
        <View style={styles.filtersRow}>
          {/* Date Filter */}
          <View style={styles.filterBlock}>
            <Text style={styles.filterLabel}>DATE</Text>
            <TouchableOpacity style={styles.filterCard}>
              <Text style={styles.filterText}>Oct 24, 2024</Text>
              <Ionicons name="calendar-outline" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Subject Filter */}
          <View style={styles.filterBlock}>
            <Text style={styles.filterLabel}>SUBJECT</Text>
            <TouchableOpacity style={styles.filterCard}>
              <Text style={styles.filterText}>10-A Math</Text>
              <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Monthly Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryTitle}>MONTHLY SUMMARY (OCT)</Text>
            <Text style={styles.summaryPercentage}>94.2%</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: '94.2%' }]} />
          </View>

          <View style={styles.summaryBottomRow}>
            <Text style={styles.summaryStat}>18 Days Tracked</Text>
            <Text style={styles.summaryStat}>Avg. Attendance</Text>
          </View>
        </View>

        {/* List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionLabel}>STUDENTS LIST</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={12} color="#4461F2" style={{ marginRight: 4 }} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Students List */}
        <View style={styles.studentList}>
          {HISTORY_DATA.map((student) => {
            const isPresent = student.status === 'present';

            return (
              <View key={student.id} style={styles.studentCard}>
                
                <View style={styles.studentInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{student.initials}</Text>
                  </View>
                  <Text style={styles.studentName}>{student.name}</Text>
                </View>

                {/* Status Badge */}
                <View style={[styles.badge, isPresent ? styles.badgePresent : styles.badgeAbsent]}>
                  <Ionicons 
                    name={isPresent ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={isPresent ? "#059669" : "#DC2626"} 
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.badgeText, isPresent ? styles.textPresent : styles.textAbsent]}>
                    {isPresent ? 'PRESENT' : 'ABSENT'}
                  </Text>
                </View>

              </View>
            );
          })}
        </View>
        
        {/* Bottom padding to prevent the list from hiding behind the tab bar */}
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
    marginBottom: 25,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  
  // Filters
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  filterBlock: {
    width: '48%',
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  filterCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  // Summary Card
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
  },
  summaryPercentage: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4461F2',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#EEF2FF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4461F2',
    borderRadius: 4,
  },
  summaryBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryStat: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },

  // List Header
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editBtnText: {
    color: '#4461F2',
    fontSize: 12,
    fontWeight: '700',
  },

  // Student Cards
  studentList: {
    paddingBottom: 20,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#4461F2',
    fontWeight: '700',
    fontSize: 14,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  
  // Badges
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgePresent: {
    backgroundColor: '#ECFDF5', // Light Green
  },
  badgeAbsent: {
    backgroundColor: '#FEF2F2', // Light Red
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  textPresent: {
    color: '#059669', // Dark Green
  },
  textAbsent: {
    color: '#DC2626', // Dark Red
  },
});