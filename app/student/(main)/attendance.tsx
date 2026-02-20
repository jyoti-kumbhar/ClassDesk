import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

// --- Mock Data ---
const FILTERS = ['All Subjects', 'Mathematics', 'Biology'];

const ATTENDANCE_HISTORY = [
  {
    id: 1,
    subject: 'Biology',
    datetime: 'May 24, 2024 • 09:00 AM',
    status: 'Present',
    icon: 'flask',
    iconColor: '#1D4ED8',
    iconBg: '#EEF2FF',
  },
  {
    id: 2,
    subject: 'Mathematics',
    datetime: 'May 23, 2024 • 10:30 AM',
    status: 'Absent',
    // Using calculator as substitute for Sigma
    icon: 'calculator',
    iconColor: '#2563EB',
    iconBg: '#EEF2FF',
  }
];

export default function AttendanceScreen() {
  const [activeFilter, setActiveFilter] = useState('All Subjects');

  // Math for Circular Progress (86%)
  const radius = 35;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (circumference * 0.86);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Page Title */}
        <Text style={styles.pageTitle}>My Attendance</Text>

        {/* Overall Academic Year Card */}
        <View style={styles.card}>
          <View style={styles.overallRow}>
            <View style={styles.overallTextContent}>
              <Text style={styles.sectionSubtitle}>OVERALL ACADEMIC YEAR</Text>
              <Text style={styles.academicYearText}>2023 - 2024</Text>
              <Text style={styles.subText}>142/165 Total Classes</Text>
            </View>
            
            {/* Circular Progress Ring */}
            <View style={styles.circularProgressContainer}>
              <Svg width="100" height="100" viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r={radius} stroke="#EEF2FF" strokeWidth={strokeWidth} fill="none" />
                <Circle 
                  cx="50" cy="50" r={radius} 
                  stroke="#1D4ED8" strokeWidth={strokeWidth} fill="none" 
                  strokeDasharray={circumference} strokeDashoffset={progressOffset} 
                  strokeLinecap="round" transform="rotate(-90 50 50)" 
                />
              </Svg>
              <View style={styles.progressTextWrapper}>
                <Text style={styles.progressPercentText}>86%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Monthly Stats Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionSubtitle}>MONTHLY STATS</Text>
            <TouchableOpacity style={styles.dropdownBtn}>
              <Text style={styles.dropdownText}>May 2024</Text>
              <Ionicons name="chevron-down" size={14} color="#1D4ED8" />
            </TouchableOpacity>
          </View>

          <View style={styles.monthlyStatsHeader}>
            <Text style={styles.monthlyStatsTitle}>Monthly Attendance</Text>
            <Text style={styles.monthlyStatsPercent}>92%</Text>
          </View>

          {/* Linear Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '92%' }]} />
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.subText}>23 Classes Attended</Text>
            <Text style={styles.subText}>2 Classes Missed</Text>
          </View>
        </View>

        {/* Subject Filters */}
        <Text style={[styles.sectionSubtitle, { marginBottom: 12 }]}>SUBJECT FILTERS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((filter, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
            >
              <Text style={[styles.filterPillText, activeFilter === filter && styles.filterPillTextActive]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Attendance History */}
        <View style={styles.historyHeaderRow}>
          <Text style={styles.sectionSubtitle}>ATTENDANCE HISTORY</Text>
          <TouchableOpacity style={styles.dateBtn}>
            <Ionicons name="calendar-outline" size={16} color="#1D4ED8" />
            <Text style={styles.dateBtnText}>Select Date</Text>
          </TouchableOpacity>
        </View>

        {/* History List */}
        {ATTENDANCE_HISTORY.map((item) => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.historyRow}>
              
              <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
              </View>
              
              <View style={styles.historyTextContainer}>
                <Text style={styles.historySubject}>{item.subject}</Text>
                <Text style={styles.historyDate}>{item.datetime}</Text>
              </View>

              {/* Status Badge */}
              <View style={[
                styles.statusBadge, 
                item.status === 'Present' ? styles.statusPresentBg : styles.statusAbsentBg
              ]}>
                <Text style={[
                  styles.statusText, 
                  item.status === 'Present' ? styles.statusPresentText : styles.statusAbsentText
                ]}>
                  {item.status}
                </Text>
              </View>

            </View>
          </View>
        ))}

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="moon" size={20} color="#111827" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F6F9' 
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 120 // Extra padding for the custom bottom nav
  }, 
  
  // Headers & Global Text
  pageTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#111827', 
    marginBottom: 24 
  },
  sectionSubtitle: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#6B7280', 
    letterSpacing: 1.2, 
  },
  subText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#9CA3AF' 
  },

  // Generic Card Style
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 24, 
    marginBottom: 24, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 12, 
    elevation: 2 
  },

  // Overall Academic Year Section
  overallRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  overallTextContent: { 
    flex: 1 
  },
  academicYearText: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#1D4ED8', 
    marginTop: 8, 
    marginBottom: 8 
  },
  circularProgressContainer: { 
    width: 100, 
    height: 100, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  progressTextWrapper: { 
    position: 'absolute' 
  },
  progressPercentText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#1D4ED8' 
  },

  // Monthly Stats Section
  cardHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  dropdownBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#EEF2FF', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 12, 
    gap: 4 
  },
  dropdownText: { 
    color: '#1D4ED8', 
    fontSize: 12, 
    fontWeight: '700' 
  },
  monthlyStatsHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  monthlyStatsTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#111827' 
  },
  monthlyStatsPercent: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: '#1D4ED8' 
  },
  progressBarBg: { 
    height: 10, 
    backgroundColor: '#F3F4F6', 
    borderRadius: 5, 
    marginBottom: 12, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#1D4ED8', 
    borderRadius: 5 
  },
  progressFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },

  // Subject Filters
  filterScroll: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 30 
  },
  filterPill: { 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  filterPillActive: { 
    backgroundColor: '#1D4ED8', 
    borderColor: '#1D4ED8' 
  },
  filterPillText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#4B5563' 
  },
  filterPillTextActive: { 
    color: '#FFF' 
  },

  // History Section
  historyHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  dateBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    gap: 6 
  },
  dateBtnText: { 
    color: '#1D4ED8', 
    fontSize: 12, 
    fontWeight: '700' 
  },
  historyCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 12,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 8, 
    elevation: 1 
  },
  historyRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  historyTextContainer: { 
    flex: 1 
  },
  historySubject: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#111827', 
    marginBottom: 4 
  },
  historyDate: { 
    fontSize: 12, 
    color: '#6B7280', 
    fontWeight: '500' 
  },
  
  // Status Badges
  statusBadge: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '800' 
  },
  statusPresentBg: { backgroundColor: '#D1FAE5' },
  statusPresentText: { color: '#059669' },
  statusAbsentBg: { backgroundColor: '#FEE2E2' },
  statusAbsentText: { color: '#DC2626' },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 100, 
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  }
});