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
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// Dummy data based on the design
const ATTENDANCE_DATA = [
  { id: '1', name: 'Aria Johnson', rollNo: '101', initials: 'AJ', percentage: 92 },
  { id: '2', name: 'Benjamin Miller', rollNo: '102', initials: 'BM', percentage: 68 },
  { id: '3', name: 'Chloe Hudson', rollNo: '103', initials: 'CH', percentage: 85 },
  { id: '4', name: 'David Wilson', rollNo: '104', initials: 'DW', percentage: 96 },
  { id: '5', name: 'Emily Fisher', rollNo: '105', initials: 'EF', percentage: 79 },
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
export default function MonthlyAttendanceScreen() {
  const router = useRouter();

  // Helper to determine color based on percentage
  const getProgressColor = (percentage: number) => {
    return percentage < 75 ? '#EF4444' : '#4461F2'; // Red for low, Blue for high
  };

  return (
    <View style={styles.mainContainer}>
      
      {/* Background Graphics */}
      <BackgroundDecorations />

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
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Theme Background
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
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