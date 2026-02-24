import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// Dummy data based on the design
const HISTORY_DATA = [
  { id: '1', name: 'Aria Johnson', initials: 'AJ', status: 'present' },
  { id: '2', name: 'Benjamin Miller', initials: 'BM', status: 'absent' },
  { id: '3', name: 'Chloe Hudson', initials: 'CH', status: 'absent' },
  { id: '4', name: 'David Wilson', initials: 'DW', status: 'present' },
];

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    
    {/* Top Right Large Soft Glow (Purple) */}
    <View style={{ position: "absolute", top: 30, right: -40 }}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill="#F3E8FF" opacity={0.6} />
        <Circle cx="100" cy="100" r="50" fill="#E9D5FF" opacity={0.4} />
      </Svg>
    </View>

    {/* Top Left - Dashed Connection Line */}
    <View style={{ position: "absolute", top: 60, left: 20 }}>
       <Svg height="100" width="120" viewBox="0 0 120 100">
          <Line x1="10" y1="0" x2="10" y2="60" stroke="#BAE6FD" strokeWidth="2" strokeDasharray="5, 5" />
          <Path d="M 10 60 Q 10 90 40 90 L 80 90" stroke="#BAE6FD" strokeWidth="2" fill="none" />
          <Circle cx="80" cy="90" r="4" fill="#60A5FA" opacity={0.6} />
       </Svg>
    </View>

    {/* Middle - The "Data Wave" */}
    <View style={{ position: "absolute", top: 220, width: width, alignItems: 'center', opacity: 0.4 }}>
       <Svg height="150" width={width} viewBox={`0 0 ${width} 150`}>
          <Path 
            d={`M -20 75 C ${width * 0.3} 120, ${width * 0.7} 30, ${width + 20} 75`} 
            stroke="#99F6E4" 
            strokeWidth="3" 
            fill="none" 
          />
          <Path 
            d={`M -20 90 C ${width * 0.3} 135, ${width * 0.7} 45, ${width + 20} 90`} 
            stroke="#CCFBF1" 
            strokeWidth="2" 
            fill="none" 
            strokeDasharray="10, 10"
          />
          <Circle cx={width * 0.2} cy="85" r="3" fill="#34D399" />
          <Circle cx={width * 0.8} cy="65" r="5" stroke="#34D399" strokeWidth="2" fill="#FFF" />
       </Svg>
    </View>

    {/* Middle Right - Dot Grid Matrix */}
    <View style={{ position: "absolute", top: 380, right: 10, opacity: 0.3 }}>
       <Svg height="80" width="60">
             {[0, 15, 30].map((x) => 
               [0, 15, 30, 45].map((y) => (
                 <Circle key={`${x}-${y}`} cx={x + 5} cy={y + 5} r="1.5" fill="#FDBA74" />
               ))
             )}
       </Svg>
    </View>

    {/* Bottom Left - Geometric Stack */}
    <View style={{ position: "absolute", bottom: 100, left: -20 }}>
       <Svg height="120" width="120" viewBox="0 0 100 100">
             <Line x1="0" y1="50" x2="100" y2="50" stroke="#FDE68A" strokeWidth="40" opacity={0.3} transform="rotate(-45 50 50)" />
             <Line x1="20" y1="50" x2="80" y2="50" stroke="#F59E0B" strokeWidth="2" transform="rotate(-45 50 50)" />
       </Svg>
    </View>

    {/* Bottom Right - Abstract Playground */}
    <View style={{ position: "absolute", bottom: 40, right: -20, opacity: 0.9 }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        <Circle cx="200" cy="200" r="150" fill="#fdf0fd" />
        <Path 
          d="M 100 200 Q 120 120 200 100" 
          stroke="#fbccf9" 
          strokeWidth="30" 
          strokeLinecap="round" 
          fill="none" 
        />
        <Path 
          d="M 40 130 Q 70 80 100 130 T 160 130" 
          stroke="#c7bdf1" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none" 
        />
        <Circle cx="80" cy="180" r="4" fill="#93C5FD" />
        <Circle cx="180" cy="150" r="3" fill="#93C5FD" />
      </Svg>
    </View>
  </View>
);

// --- Main Component ---
export default function AttendanceHistoryScreen() {
  return (
    <View style={styles.mainContainer}>
      
      {/* Background Graphics */}
      <BackgroundDecorations />

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
          
          {/* Bottom padding */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Updated theme background
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent', // Transparent to show background
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
    backgroundColor: '#ECFDF5', 
  },
  badgeAbsent: {
    backgroundColor: '#FEF2F2', 
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  textPresent: {
    color: '#059669', 
  },
  textAbsent: {
    color: '#DC2626', 
  },
});