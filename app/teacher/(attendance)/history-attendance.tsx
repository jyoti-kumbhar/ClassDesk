import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, Line, Path } from "react-native-svg";

// --- New Imports for PDF ---
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// --- Firebase Imports ---
import { collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

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

export default function AttendanceHistoryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceDocId, setAttendanceDocId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [subjectFilter, setSubjectFilter] = useState((params.className as string) || '');
  
  // Date States
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const startFormatted = startDate.toISOString().split('T')[0];
  const endFormatted = endDate.toISOString().split('T')[0];

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    try {
      const attendanceRef = collection(db, 'attendances');
      let constraints = [
        where('date', '>=', startFormatted),
        where('date', '<=', endFormatted),
        orderBy('date', 'desc')
      ];

      if (subjectFilter.trim() !== '') {
        constraints.push(where('subjectName', '==', subjectFilter.trim()));
      }

      const q = query(attendanceRef, ...constraints);
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let allStudents: any[] = [];
        
        // Only allow editing if one specific document/class is targeted
        if (querySnapshot.docs.length === 1 && subjectFilter.trim() !== '') {
            setAttendanceDocId(querySnapshot.docs[0].id);
        } else {
            setAttendanceDocId(null); 
            setIsEditing(false); // Cancel edit mode if we fetch a broad range
        }

        querySnapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          if (data.students) {
            const studentsWithMeta = data.students.map((s: any) => ({
              ...s,
              subjectName: data.subjectName,
              date: data.date
            }));
            allStudents = [...allStudents, ...studentsWithMeta];
          }
        });
        setStudents(allStudents);
      } else {
        setAttendanceDocId(null);
        setStudents([]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load records. Check Firestore indexes.");
    } finally {
      setLoading(false);
    }
  }, [subjectFilter, startFormatted, endFormatted]);

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchAttendance(), 500);
    return () => clearTimeout(timeoutId);
  }, [fetchAttendance]);

  const stats = useMemo(() => {
    const total = students.length;
    const present = students.filter(s => s.status === 'present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';
    return { total, present, percentage };
  }, [students]);

  const downloadPDFReport = async () => {
    if (students.length === 0) {
      Alert.alert("No Data", "There is no attendance data to export.");
      return;
    }

    const studentMap: { [key: string]: { present: number; total: number } } = {};
    students.forEach((s) => {
      if (!studentMap[s.name]) studentMap[s.name] = { present: 0, total: 0 };
      studentMap[s.name].total += 1;
      if (s.status === 'present') studentMap[s.name].present += 1;
    });

    const reportData = Object.keys(studentMap).map((name) => {
      const { present, total } = studentMap[name];
      const percentage = ((present / total) * 100).toFixed(1);
      return { name, percentage };
    }).sort((a, b) => a.name.localeCompare(b.name));

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #4461F2; padding-bottom: 20px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #4461F2; color: white; padding: 15px; text-align: left; }
            td { border-bottom: 1px solid #eee; padding: 15px; }
            .percentage { font-weight: bold; color: #4461F2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Student Attendance Performance</h2>
            <p>Range: ${startFormatted} to ${endFormatted}</p>
            <p>Subject: ${subjectFilter ? subjectFilter.toUpperCase() : 'ALL SUBJECTS'}</p>
          </div>
          <table>
            <thead>
              <tr><th>Student Name</th><th style="text-align: right;">Percentage</th></tr>
            </thead>
            <tbody>
              ${reportData.map(item => `
                <tr><td>${item.name}</td><td style="text-align: right;" class="percentage">${item.percentage}%</td></tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch {
      Alert.alert("Error", "Failed to generate PDF.");
    }
  };

  const toggleAttendance = (studentId: string) => {
    if (!isEditing) return;
    setStudents(prev => prev.map(student => 
        student.id === studentId ? { ...student, status: student.status === 'present' ? 'absent' : 'present' } : student
    ));
  };

  const handleEditSave = async () => {
    if (isEditing) {
      if (!attendanceDocId) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'attendances', attendanceDocId);
        
        // Filter out temporary meta fields added for UI before saving
        const cleanedStudents = students.map(({ subjectName, date, ...rest }) => rest);
        
        const totalPresent = cleanedStudents.filter(s => s.status === 'present').length;
        const totalAbsent = cleanedStudents.length - totalPresent;

        await updateDoc(docRef, { 
          students: cleanedStudents,
          totalPresent, 
          totalAbsent 
        });

        Alert.alert("Success", "Attendance updated successfully!");
        setIsEditing(false);
        fetchAttendance(); // Refresh data
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to save updates.");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <BackgroundDecorations />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>History</Text>
            <TouchableOpacity onPress={downloadPDFReport} style={styles.downloadIconBtn}>
                <Ionicons name="download-outline" size={24} color="#4461F2" />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          <View style={styles.filtersRow}>
            <View style={styles.filterBlock}>
              <Text style={styles.filterLabel}>START DATE</Text>
              <TouchableOpacity style={styles.filterCard} onPress={() => setShowStartPicker(true)}>
                <Text style={styles.dateText}>{startFormatted}</Text>
                <Ionicons name="calendar-outline" size={16} color="#4461F2" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterBlock}>
              <Text style={styles.filterLabel}>END DATE</Text>
              <TouchableOpacity style={styles.filterCard} onPress={() => setShowEndPicker(true)}>
                <Text style={styles.dateText}>{endFormatted}</Text>
                <Ionicons name="calendar-outline" size={16} color="#4461F2" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 25 }}>
            <Text style={styles.filterLabel}>SUBJECT (OPTIONAL)</Text>
            <View style={[styles.filterCard, { width: '100%' }]}>
              <TextInput 
                style={styles.filterTextInput} 
                value={subjectFilter} 
                onChangeText={setSubjectFilter} 
                placeholder="All Subjects"
                placeholderTextColor="#9CA3AF"
              />
              {subjectFilter.length > 0 ? (
                <TouchableOpacity onPress={() => setSubjectFilter('')}>
                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ) : (
                <Ionicons name="search" size={18} color="#9CA3AF" />
              )}
            </View>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => { setShowStartPicker(Platform.OS === 'ios'); if(d) setStartDate(d); }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => { setShowEndPicker(Platform.OS === 'ios'); if(d) setEndDate(d); }}
            />
          )}

          <View style={styles.summaryCard}>
            <View style={styles.summaryTopRow}>
              <Text style={styles.summaryTitle}>OVERALL SCORE</Text>
              <Text style={styles.summaryPercentage}>{stats.percentage}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${stats.percentage}%` as any }]} />
            </View>
            <View style={styles.summaryBottomRow}>
              <Text style={styles.summaryStat}>{stats.present} / {stats.total} Total Present</Text>
              <Text style={styles.summaryStat}>Selected Range</Text>
            </View>
          </View>

          <View style={styles.listHeaderRow}>
            <Text style={styles.sectionLabel}>ATTENDANCE LOG</Text>
            {attendanceDocId && (
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
            )}
          </View>

          {loading ? (
             <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 20 }} />
          ) : students.length === 0 ? (
             <Text style={styles.emptyText}>No records found.</Text>
          ) : (
             <View style={styles.studentList}>
               {students.map((student, idx) => {
                 const isPresent = student.status === 'present';
                 return (
                   <TouchableOpacity 
                     key={`${student.id}-${idx}`} 
                     style={[
                        styles.studentCard, 
                        isEditing && styles.studentCardEditing
                     ]}
                     activeOpacity={isEditing ? 0.7 : 1}
                     onPress={() => toggleAttendance(student.id)}
                   >
                     <View style={styles.studentInfo}>
                       <View style={styles.avatar}><Text style={styles.avatarText}>{student.name?.charAt(0).toUpperCase() || '?'}</Text></View>
                       <View>
                        <Text style={styles.studentName}>{student.name}</Text>
                        <Text style={styles.subText}>{student.date} • {student.subjectName}</Text>
                       </View>
                     </View>
                     <View style={[styles.badge, isPresent ? styles.badgePresent : styles.badgeAbsent]}>
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

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { paddingHorizontal: 20, paddingTop: 10 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25, 
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 40 : 10,
    justifyContent: 'space-between'
  },
  backBtn: { marginRight: 15 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#111827', flex: 1 },
  downloadIconBtn: { padding: 8, backgroundColor: '#EEF2FF', borderRadius: 10 },
  filtersRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  filterBlock: { width: '48%' },
  filterLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 8 },
  filterCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6', height: 50 },
  filterTextInput: { fontSize: 14, fontWeight: '600', color: '#111827', flex: 1, padding: 0 },
  dateText: { fontSize: 13, fontWeight: '600', color: '#111827' },
  summaryCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#F3F4F6', elevation: 1 },
  summaryTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 15 },
  summaryTitle: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1 },
  summaryPercentage: { fontSize: 18, fontWeight: '800', color: '#4461F2' },
  progressBarContainer: { height: 8, backgroundColor: '#EEF2FF', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  progressBarFill: { height: '100%', backgroundColor: '#4461F2', borderRadius: 4 },
  summaryBottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryStat: { fontSize: 11, color: '#6B7280', fontWeight: '500' },
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionLabel: { fontSize: 13, fontWeight: '800', color: '#6B7280', letterSpacing: 1 },
  emptyText: { textAlign: 'center', color: '#6B7280', marginTop: 20, fontSize: 14 },
  editBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  saveBtnState: { backgroundColor: '#4461F2' },
  editBtnText: { color: '#4461F2', fontSize: 12, fontWeight: '700' },
  studentList: { paddingBottom: 20 },
  studentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6', elevation: 1 },
  studentCardEditing: { borderColor: '#4461F2', backgroundColor: '#F0F4FF', borderStyle: 'dashed' }, 
  studentInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#4461F2', fontWeight: '700', fontSize: 14 },
  studentName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  subText: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgePresent: { backgroundColor: '#ECFDF5' },
  badgeAbsent: { backgroundColor: '#FEF2F2' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  textPresent: { color: '#059669' },
  textAbsent: { color: '#DC2626' },
});