import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- 1. Mock Database Service ---
const MonthlyAttendanceDatabase = {
  fetchMonthlyReport: async (month: string, year: number) => {
    // Simulate API delay
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Aria Johnson', rollNo: '101', initials: 'AJ', percentage: 92 },
          { id: '2', name: 'Benjamin Miller', rollNo: '102', initials: 'BM', percentage: 68 }, // Low attendance example
          { id: '3', name: 'Chloe Hudson', rollNo: '103', initials: 'CH', percentage: 85 },
          { id: '4', name: 'David Wilson', rollNo: '104', initials: 'DW', percentage: 96 },
          { id: '5', name: 'Emily Fisher', rollNo: '105', initials: 'EF', percentage: 79 },
          { id: '6', name: 'Frank Castle', rollNo: '106', initials: 'FC', percentage: 88 },
        ]);
      }, 800);
    });
  }
};

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: 30, right: -40 }}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill="#F3E8FF" opacity={0.6} />
        <Circle cx="100" cy="100" r="50" fill="#E9D5FF" opacity={0.4} />
      </Svg>
    </View>
    <View style={{ position: "absolute", top: 60, left: 20 }}>
       <Svg height="100" width="120" viewBox="0 0 120 100">
          <Line x1="10" y1="0" x2="10" y2="60" stroke="#BAE6FD" strokeWidth="2" strokeDasharray="5, 5" />
          <Path d="M 10 60 Q 10 90 40 90 L 80 90" stroke="#BAE6FD" strokeWidth="2" fill="none" />
          <Circle cx="80" cy="90" r="4" fill="#60A5FA" opacity={0.6} />
       </Svg>
    </View>
    <View style={{ position: "absolute", top: 220, width: width, alignItems: 'center', opacity: 0.4 }}>
       <Svg height="150" width={width} viewBox={`0 0 ${width} 150`}>
          <Path d={`M -20 75 C ${width * 0.3} 120, ${width * 0.7} 30, ${width + 20} 75`} stroke="#99F6E4" strokeWidth="3" fill="none" />
          <Path d={`M -20 90 C ${width * 0.3} 135, ${width * 0.7} 45, ${width + 20} 90`} stroke="#CCFBF1" strokeWidth="2" fill="none" strokeDasharray="10, 10" />
          <Circle cx={width * 0.2} cy="85" r="3" fill="#34D399" />
          <Circle cx={width * 0.8} cy="65" r="5" stroke="#34D399" strokeWidth="2" fill="#FFF" />
       </Svg>
    </View>
  </View>
);

// --- Main Component ---
export default function MonthlyAttendanceScreen() {
  const router = useRouter();
  
  // --- State ---
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState('October 2024');

  // --- 2. Fetch Data from DB ---
  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await MonthlyAttendanceDatabase.fetchMonthlyReport('October', 2024);
        setStudents(data);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch monthly report");
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, []);

  // Helper to determine color based on percentage
  const getProgressColor = (percentage: number) => {
    return percentage < 75 ? '#EF4444' : '#4461F2'; // Red for low attendance
  };

  return (
    <View style={styles.mainContainer}>
      
      <BackgroundDecorations />

      <SafeAreaView style={styles.safeArea}>
        
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

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          {/* Month Selector Card */}
          <View style={styles.monthSelectorCard}>
            <TouchableOpacity style={styles.arrowBtn}>
              <Ionicons name="chevron-back" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            
            <View style={styles.monthInfo}>
              <Ionicons name="calendar" size={18} color="#4461F2" />
              <Text style={styles.monthText}>{currentMonth}</Text>
            </View>

            <TouchableOpacity style={styles.arrowBtn}>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* List Header */}
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionLabel}>STUDENT LIST & PROGRESS</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{students.length} Students</Text>
            </View>
          </View>

          {/* Students List */}
          {loading ? (
             <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 20 }} />
          ) : (
             <View style={styles.studentList}>
               {students.map((student) => {
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
                           { width: `${student.percentage}%` as any, backgroundColor: barColor }
                         ]} 
                       />
                     </View>
 
                   </View>
                 );
               })}
             </View>
          )}
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFF9F0' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 20 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 25, 
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 40 : 10
  },
  backButton: { marginRight: 15, marginTop: 4 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#111827' },
  pageSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 6, fontWeight: '500' },
  
  // Month Selector
  monthSelectorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 16, paddingHorizontal: 20, marginBottom: 25, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  monthInfo: { flexDirection: 'row', alignItems: 'center' },
  monthText: { fontSize: 16, fontWeight: '700', color: '#111827', marginLeft: 10 },
  arrowBtn: { padding: 5 },

  // List Header
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1 },
  badge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  badgeText: { color: '#4461F2', fontSize: 11, fontWeight: '700' },

  // Student Cards
  studentList: { paddingBottom: 20 },
  studentCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1, borderWidth: 1, borderColor: '#F3F4F6' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  studentInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#4461F2', fontWeight: '700', fontSize: 15 },
  studentName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  rollNo: { fontSize: 11, color: '#9CA3AF', marginTop: 4, fontWeight: '600', letterSpacing: 0.5 },
  percentageText: { fontSize: 16, fontWeight: '800' },

  // Progress Bar
  progressBarContainer: { height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
});