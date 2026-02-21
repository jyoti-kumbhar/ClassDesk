import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Dummy data for classrooms to keep the code clean
const CLASSROOMS = [
  {
    id: '1',
    title: '10-A Mathematics',
    students: 32,
    iconText: 'Σ',
    iconColor: '#4461F2',
    iconBg: '#EFF6FF',
  },
  {
    id: '2',
    title: '12-B Physics',
    students: 28,
    iconName: 'flask',
    iconColor: '#9333EA',
    iconBg: '#F3E8FF',
  },
];

export default function AttendanceScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Attendance</Text>

      {/* --- Summary Card --- */}
      <View style={styles.summaryCard}>
        <View style={styles.cardTopRow}>
          {/* Month Selector */}
          <TouchableOpacity style={styles.monthSelector}>
            <Ionicons name="calendar-outline" size={16} color="#FFF" />
            <Text style={styles.monthText}>October 2023</Text>
            <Ionicons name="chevron-down" size={16} color="#FFF" />
          </TouchableOpacity>

          {/* Download Button */}
          <TouchableOpacity style={styles.downloadBtn}>
            <Ionicons name="download-outline" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBottomRow}>
          <View>
            <Text style={styles.monthlyAverageLabel}>MONTHLY AVERAGE</Text>
            <Text style={styles.monthlyAverageValue}>88%</Text>
          </View>

          {/* View Report Navigation */}
          <TouchableOpacity 
            style={styles.viewReportContainer}
            onPress={() => router.push('/attendance/monthly-attendance')}
          >
            <Text style={styles.viewReportText}>View Report</Text>
            <View style={styles.arrowCircle}>
              <Ionicons name="chevron-forward" size={18} color="#4461F2" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Classrooms</Text>

      {/* --- Classroom List --- */}
      {CLASSROOMS.map((classroom) => (
        <View key={classroom.id} style={styles.classroomCard}>
          {/* Card Header */}
          <View style={styles.classHeader}>
            <View style={[styles.classIconContainer, { backgroundColor: classroom.iconBg }]}>
              {classroom.iconText ? (
                <Text style={{ color: classroom.iconColor, fontSize: 24, fontWeight: 'bold' }}>
                  {classroom.iconText}
                </Text>
              ) : (
                <Ionicons name={classroom.iconName as any} size={24} color={classroom.iconColor} />
              )}
            </View>
            <View>
              <Text style={styles.classTitle}>{classroom.title}</Text>
              <Text style={styles.classSubtitle}>{classroom.students} Students</Text>
            </View>
          </View>

          {/* Card Actions */}
          <View style={styles.actionRow}>
            {/* History Navigation */}
            <TouchableOpacity 
              style={[styles.actionBtn, styles.historyBtn]}
              onPress={() => router.push('/attendance/history-attendance')}
            >
              <Ionicons name="time-outline" size={18} color="#374151" />
              <Text style={styles.historyText}>HISTORY</Text>
            </TouchableOpacity>

            {/* Mark Attendance Navigation */}
            <TouchableOpacity 
              style={[styles.actionBtn, styles.markBtn]}
              onPress={() => router.push('/attendance/mark-daily-attendance')}
            >
              <Ionicons name="person-add-outline" size={18} color="#4461F2" />
              <Text style={styles.markText}>MARK ATTENDANCE</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      
      {/* Bottom padding to account for the custom bottom navigation bar */}
      <View style={{ height: 100 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#F8F9FA', // Or transparent if your layout handles the background
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },

  // Summary Card Styles
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    backgroundColor: '#0014F5', // Bright blue matching the design
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  monthText: {
    color: '#FFF',
    fontWeight: '600',
    marginHorizontal: 8,
    fontSize: 14,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  monthlyAverageLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 5,
  },
  monthlyAverageValue: {
    color: '#FFF',
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 45,
  },
  viewReportContainer: {
    alignItems: 'center',
  },
  viewReportText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Classrooms List Styles
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 15,
  },
  classroomCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  classIconContainer: {
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  classSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  historyBtn: {
    backgroundColor: '#F9FAFB',
    marginRight: 10,
  },
  markBtn: {
    backgroundColor: '#F0F4FF',
  },
  historyText: {
    color: '#374151',
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  markText: {
    color: '#4461F2',
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 6,
    letterSpacing: 0.5,
  },
});