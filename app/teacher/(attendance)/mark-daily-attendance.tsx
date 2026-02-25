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
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- 1. Mock Database Service ---
const AttendanceDatabase = {
  // Fetch students for a specific class to mark attendance
  fetchClassList: async (classId: string) => {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Aria Johnson', rollNo: '101', initials: 'AJ', status: 'present' },
          { id: '2', name: 'Benjamin Miller', rollNo: '102', initials: 'BM', status: 'absent' },
          { id: '3', name: 'Chloe Hudson', rollNo: '103', initials: 'CH', status: 'present' },
          { id: '4', name: 'David Wilson', rollNo: '104', initials: 'DW', status: 'present' },
          { id: '5', name: 'Emily Fisher', rollNo: '105', initials: 'EF', status: 'present' },
        ]);
      }, 600);
    });
  },

  // Save the daily attendance record
  saveDailyAttendance: async (classId: string, date: string, records: any[]) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Saved Attendance for ${classId} on ${date}:`, records);
        resolve(true);
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
export default function MarkDailyAttendanceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const classId = params.classId as string || 'default';
  const className = params.className as string || 'Class';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const currentDate = new Date().toDateString();

  // --- 1. Fetch Data ---
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await AttendanceDatabase.fetchClassList(classId);
        setStudents(data);
      } catch (error) {
        Alert.alert("Error", "Failed to load student list.");
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [classId]);

  // --- 2. Calculate Totals Dynamically ---
  const totalPresent = students.filter(s => s.status === 'present').length;
  const totalAbsent = students.filter(s => s.status === 'absent').length;

  // --- 3. Toggle Logic ---
  const toggleStatus = (id: string, newStatus: string) => {
    setStudents(prev => 
      prev.map(student => student.id === id ? { ...student, status: newStatus } : student)
    );
  };

  // --- 4. Save Logic ---
  const handleSave = async () => {
    setSaving(true);
    try {
      await AttendanceDatabase.saveDailyAttendance(classId, currentDate, students);
      Alert.alert("Success", "Attendance marked successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
        <View style={[styles.mainContainer, { justifyContent:'center', alignItems:'center' }]}>
           <ActivityIndicator size="large" color="#4461F2" />
        </View>
     );
  }

  return (
    <View style={styles.mainContainer}>
      
      <BackgroundDecorations />

      <SafeAreaView style={styles.safeArea}>
        
        {/* Header Section */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View>
                <Text style={styles.pageTitle}>Mark Attendance</Text>
                <Text style={styles.pageSubtitle}>{className} • {currentDate}</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          {/* Subject Info Cards */}
          <Text style={styles.sectionLabel}>SUBJECT DETAILS</Text>
          <View style={styles.infoCard}>
            <View style={styles.iconBox}>
              <Ionicons name="book" size={16} color="#9CA3AF" />
            </View>
            <Text style={styles.infoText}>{className}</Text>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.sectionLabel}>TIME</Text>
              <View style={styles.infoCard}>
                <View style={[styles.iconBox, { borderRadius: 12 }]}>
                   <Ionicons name="time" size={16} color="#9CA3AF" />
                </View>
                <Text style={styles.infoText}>10:30 AM</Text>
              </View>
            </View>
            
            <View style={styles.halfWidth}>
              <Text style={styles.sectionLabel}>TOPIC</Text>
              <View style={styles.infoCard}>
                <Text style={[styles.infoText, { marginLeft: 5 }]}>General</Text>
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
            {students.map((student) => {
               const isPresent = student.status === 'present';
               
               return (
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
                        style={[styles.toggleBtn, isPresent && styles.toggleBtnPresent]}
                        onPress={() => toggleStatus(student.id, 'present')}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.toggleText, isPresent && styles.toggleTextActive]}>P</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.toggleBtn, !isPresent && styles.toggleBtnAbsent]}
                        onPress={() => toggleStatus(student.id, 'absent')}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.toggleText, !isPresent && styles.toggleTextActive]}>A</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
               );
            })}
          </View>
          
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Floating Save Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={styles.saveBtn} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
               <ActivityIndicator color="#FFF" />
            ) : (
               <>
                 <Ionicons name="checkmark-done" size={24} color="#FFF" style={{ marginRight: 8 }} />
                 <Text style={styles.saveBtnText}>Submit Attendance</Text>
               </>
            )}
          </TouchableOpacity>
        </View>

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
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  pageSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2, fontWeight: '500' },
  
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 8, marginTop: 5 },
  infoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  iconBox: { backgroundColor: '#F3F4F6', width: 30, height: 30, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },

  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10, marginBottom: 15 },
  statsRow: { flexDirection: 'row' },
  presentStat: { color: '#059669', backgroundColor: '#D1FAE5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 10, fontWeight: '700', marginRight: 8 },
  absentStat: { color: '#DC2626', backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 10, fontWeight: '700' },

  studentList: { paddingBottom: 20 },
  studentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 5, elevation: 1 },
  studentInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#4461F2', fontWeight: '700', fontSize: 15 },
  studentName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  rollNo: { fontSize: 12, color: '#9CA3AF', marginTop: 2, fontWeight: '500' },

  // Toggle Switch
  toggleContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 },
  toggleBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, minWidth: 44, alignItems: 'center' },
  toggleBtnPresent: { backgroundColor: '#10B981' },
  toggleBtnAbsent: { backgroundColor: '#EF4444' },
  toggleText: { fontSize: 12, fontWeight: '800', color: '#9CA3AF' },
  toggleTextActive: { color: '#FFF' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF9F0', paddingHorizontal: 20, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 30 : 20 },
  saveBtn: { backgroundColor: '#4461F2', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18, borderRadius: 16, shadowColor: '#4461F2', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});