import React, { useState, useEffect, useMemo } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- 1. Mock Database Service ---
const AttendanceDatabase = {
  fetchAttendanceSheet: async (classId: string, date: string) => {
    // Simulating API Call
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Aria Johnson', initials: 'AJ', status: 'present' },
          { id: '2', name: 'Benjamin Miller', initials: 'BM', status: 'absent' },
          { id: '3', name: 'Chloe Hudson', initials: 'CH', status: 'absent' },
          { id: '4', name: 'David Wilson', initials: 'DW', status: 'present' },
          { id: '5', name: 'Ethan Hunt', initials: 'EH', status: 'present' },
          { id: '6', name: 'Fiona Gallagher', initials: 'FG', status: 'present' },
        ]);
      }, 500);
    });
  },
  
  updateAttendance: async (classId: string, date: string, students: any[]) => {
    // Simulating DB Update
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Updated DB for ${classId} on ${date}:`, students);
        resolve(true);
      }, 500);
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
export default function AttendanceHistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const classId = params.classId as string || 'default';
  const className = params.className as string || 'Class';

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Note: setSelectedDate removed to silence linter since it wasn't used yet. 
  // Add it back when you implement the Date Picker.
  const [selectedDate] = useState(new Date().toDateString());

  // --- 1. Fetch Data ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await AttendanceDatabase.fetchAttendanceSheet(classId, selectedDate);
        setStudents(data);
      } catch (error) {
        console.error(error); // Log error to satisfy linter
        Alert.alert("Error", "Failed to load attendance records.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [classId, selectedDate]); // Added dependencies

  // --- 2. Calculate Percentage (Dynamic) ---
  const stats = useMemo(() => {
    const total = students.length;
    const present = students.filter(s => s.status === 'present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';
    return { total, present, percentage };
  }, [students]);

  // --- 3. Edit Handler ---
  const toggleAttendance = (studentId: string) => {
    if (!isEditing) return;

    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return { 
          ...student, 
          status: student.status === 'present' ? 'absent' : 'present' 
        };
      }
      return student;
    }));
  };

  const handleEditSave = async () => {
    if (isEditing) {
      // Saving...
      setLoading(true);
      await AttendanceDatabase.updateAttendance(classId, selectedDate, students);
      setLoading(false);
      setIsEditing(false);
      Alert.alert("Success", "Attendance updated successfully!");
    } else {
      // Start Editing
      setIsEditing(true);
    }
  };

  return (
    <View style={styles.mainContainer}>
      
      <BackgroundDecorations />

      <SafeAreaView style={styles.safeArea}>
        
        {/* Header Section */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Attendance History</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

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
                <Text style={styles.filterText} numberOfLines={1}>{className}</Text>
                <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Monthly Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <Text style={styles.summaryTitle}>ATTENDANCE SCORE</Text>
              <Text style={styles.summaryPercentage}>{stats.percentage}%</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              {/* Fix: Added 'as any' to solve Type error */}
              <View style={[styles.progressBarFill, { width: `${stats.percentage}%` as any }]} />
            </View>

            <View style={styles.summaryBottomRow}>
              <Text style={styles.summaryStat}>{stats.present} / {stats.total} Present</Text>
              <Text style={styles.summaryStat}>Daily Average</Text>
            </View>
          </View>

          {/* List Header */}
          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionLabel}>STUDENTS LIST</Text>
            
            {/* Edit / Save Button */}
            <TouchableOpacity 
                style={[styles.editBtn, isEditing && styles.saveBtnState]} 
                onPress={handleEditSave}
                disabled={loading}
            >
              <Ionicons 
                name={isEditing ? "checkmark" : "pencil"} 
                size={12} 
                color={isEditing ? "#FFF" : "#4461F2"} 
                style={{ marginRight: 4 }} 
              />
              <Text style={[styles.editBtnText, isEditing && { color: '#FFF' }]}>
                {isEditing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Students List */}
          {loading ? (
             <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 20 }} />
          ) : (
             <View style={styles.studentList}>
               {students.map((student) => {
                 const isPresent = student.status === 'present';
 
                 return (
                   <TouchableOpacity 
                     key={student.id} 
                     style={[
                        styles.studentCard,
                        isEditing && styles.studentCardEditing // Visual cue for editing
                     ]}
                     activeOpacity={isEditing ? 0.7 : 1}
                     onPress={() => toggleAttendance(student.id)}
                   >
                     
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
 
                   </TouchableOpacity>
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

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FFF9F0' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { paddingHorizontal: 20, paddingTop: 10 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25, 
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 40 : 10
  },
  backBtn: { marginRight: 15 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#111827' },
  
  // Filters
  filtersRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  filterBlock: { width: '48%' },
  filterLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 },
  filterCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#111827', flex: 1 },

  // Summary Card
  summaryCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 },
  summaryTitle: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1 },
  summaryPercentage: { fontSize: 18, fontWeight: '800', color: '#4461F2' },
  progressBarContainer: { height: 8, backgroundColor: '#EEF2FF', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progressBarFill: { height: '100%', backgroundColor: '#4461F2', borderRadius: 4 },
  summaryBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryStat: { fontSize: 11, color: '#6B7280', fontWeight: '500' },

  // List Header
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#6B7280', letterSpacing: 1 },
  
  // Edit Button
  editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  saveBtnState: { backgroundColor: '#4461F2' },
  editBtnText: { color: '#4461F2', fontSize: 12, fontWeight: '700' },

  // Student Cards
  studentList: { paddingBottom: 20 },
  studentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  studentCardEditing: { borderColor: '#4461F2', backgroundColor: '#F0F4FF' }, // Highlight when editing
  
  studentInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#4461F2', fontWeight: '700', fontSize: 14 },
  studentName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  
  // Badges
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgePresent: { backgroundColor: '#ECFDF5' },
  badgeAbsent: { backgroundColor: '#FEF2F2' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  textPresent: { color: '#059669' },
  textAbsent: { color: '#DC2626' },
});