import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../../firebase/firebaseConfig'; 

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>
    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>
    <View style={{ position: "absolute", top: 300, left: -40, opacity: 0.5 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Circle cx="40" cy="50" r="40" fill="#6EE7B7" opacity={0.4} />
        <Circle cx="60" cy="30" r="15" fill="#93C5FD" opacity={0.6} />
      </Svg>
    </View>
    <View style={{ position: "absolute", bottom: -50, right: -20, opacity: 0.6 }}>
      <Svg height="200" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="80" r="60" fill="#FDBA74" opacity={0.5} />
        <Circle cx="80" cy="40" r="30" fill="#FCA5A5" opacity={0.4} />
      </Svg>
    </View>
    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
    <View style={[styles.dot, { bottom: 120, left: 80, backgroundColor: "#F9A8D4", width: 10, height: 10, opacity: 0.8 }]} />
  </View>
);

export default function AttendanceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Date state for Month Picker
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  // Database States
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchAttendance(user.uid);
      } else {
        setAttendanceData([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAttendance = async (userId: string) => {
    try {
      setLoading(true);
      
      const attendanceRef = collection(db, 'attendances');
      const querySnapshot = await getDocs(attendanceRef);
      
      const fetchedData: any[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // 1. Check if the students array exists
        if (data.students && Array.isArray(data.students)) {
          // 2. Find if the current user is in the students array
          const studentRecord = data.students.find((s: any) => s.id === userId);
          
          if (studentRecord) {
            // 3. Map the required fields for the UI
            fetchedData.push({
              id: doc.id,
              subject: data.subjectName || 'Unknown Subject',
              date: data.date, // Format: "YYYY-MM-DD"
              datetime: `${data.date} (${data.startTime} - ${data.endTime})`,
              status: studentRecord.status?.toLowerCase() === 'present' ? 'Present' : 'Absent',
              icon: 'book-outline', 
              iconBg: '#EEF2FF',
              iconColor: '#1D4ED8'
            });
          }
        }
      });

      setAttendanceData(fetchedData);
    } catch (error) {
      console.error("=== DEBUG: Error fetching attendance data ===", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Month Picker Logic ---
  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const currentYear = currentMonthDate.getFullYear();
  const currentMonthNum = String(currentMonthDate.getMonth() + 1).padStart(2, '0');
  const monthKey = `${currentYear}-${currentMonthNum}`; // e.g., "2026-02"
  const monthDisplay = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' }); // e.g., "February 2026"

  // --- Calculate Monthly Stats dynamically based on selected month ---
  const monthlyData = attendanceData.filter(item => item.date.startsWith(monthKey));
  const totalMonthlyClasses = monthlyData.length;
  const attendedMonthlyClasses = monthlyData.filter(item => item.status === 'Present').length;
  const missedMonthlyClasses = totalMonthlyClasses - attendedMonthlyClasses;
  const attendancePercent = totalMonthlyClasses === 0 ? 0 : Math.round((attendedMonthlyClasses / totalMonthlyClasses) * 100);

  // --- Filter History List based on Search & Date ---
  const filteredHistory = attendanceData.filter((item) => {
    const matchesSubject = item.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDate || item.date === selectedDate;
    return matchesSubject && matchesDate;
  });

  // --- Date Picker Logic ---
  const handleDateSelect = () => {
    if (selectedDate) {
      // Clear the date if one is already selected
      setSelectedDate(null);
    } else {
      // Show picker if no date is selected
      setShowDatePicker(true);
    }
  };

  const onDateChange = (event: any, selectedVal?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (event.type === 'set' && selectedVal) {
      // Format the date to "YYYY-MM-DD"
      const year = selectedVal.getFullYear();
      const month = String(selectedVal.getMonth() + 1).padStart(2, '0');
      const day = String(selectedVal.getDate()).padStart(2, '0');
      
      setSelectedDate(`${year}-${month}-${day}`);
      
      // Also hide picker on iOS after selection
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    } else if (event.type === 'dismissed') {
      setShowDatePicker(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1D4ED8" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading your attendance...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>My Attendance</Text>

        {/* Dynamic Monthly Stats Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionSubtitle}>MONTHLY STATS</Text>
            
            {/* Month Picker Controls */}
            <View style={styles.monthPickerContainer}>
              <TouchableOpacity onPress={handlePrevMonth} style={styles.monthBtn}>
                <Ionicons name="chevron-back" size={16} color="#1D4ED8" />
              </TouchableOpacity>
              
              <Text style={styles.monthText}>{monthDisplay}</Text>
              
              <TouchableOpacity onPress={handleNextMonth} style={styles.monthBtn}>
                <Ionicons name="chevron-forward" size={16} color="#1D4ED8" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.monthlyStatsHeader}>
            <Text style={styles.monthlyStatsTitle}>Attendance</Text>
            <Text style={styles.monthlyStatsPercent}>{attendancePercent}%</Text>
          </View>
          
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${attendancePercent}%` }]} />
          </View>
          
          <View style={styles.progressFooter}>
            <Text style={styles.subText}>{attendedMonthlyClasses} Classes Attended</Text>
            <Text style={styles.subText}>{missedMonthlyClasses} Classes Missed</Text>
          </View>
        </View>

        {/* Subject Search Input */}
        <Text style={[styles.sectionSubtitle, { marginBottom: 12 }]}>SEARCH SUBJECT</Text>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Type a subject name..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Attendance History */}
        <View style={styles.historyHeaderRow}>
          <Text style={styles.sectionSubtitle}>ATTENDANCE HISTORY</Text>
          <TouchableOpacity 
            style={[styles.dateBtn, selectedDate && styles.dateBtnActive]} 
            onPress={handleDateSelect}
          >
            <Ionicons name="calendar-outline" size={16} color={selectedDate ? "#FFF" : "#1D4ED8"} />
            <Text style={[styles.dateBtnText, selectedDate && { color: "#FFF" }]}>
              {selectedDate ? `${selectedDate} ✕` : 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Render Date Picker when triggered */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {filteredHistory.length === 0 ? (
           <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>
             No attendance records found.
           </Text>
        ) : (
          filteredHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.historyRow}>
                <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
                </View>
                <View style={styles.historyTextContainer}>
                  <Text style={styles.historySubject}>{item.subject}</Text>
                  <Text style={styles.historyDate}>{item.datetime}</Text>
                </View>
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
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  dot: { position: 'absolute', borderRadius: 100 },
  pageTitle: { fontSize: 32, fontWeight: '900', color: '#111827', marginBottom: 24 },
  sectionSubtitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', letterSpacing: 1.2 },
  subText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  
  monthPickerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 },
  monthBtn: { padding: 6 },
  monthText: { color: '#1D4ED8', fontSize: 13, fontWeight: '700', marginHorizontal: 8 },
  
  monthlyStatsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  monthlyStatsTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  monthlyStatsPercent: { fontSize: 16, fontWeight: '900', color: '#1D4ED8' },
  progressBarBg: { height: 10, backgroundColor: '#F3F4F6', borderRadius: 5, marginBottom: 12, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#1D4ED8', borderRadius: 5 },
  progressFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  searchInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 30, gap: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  historyHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  dateBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', gap: 6 },
  dateBtnActive: { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  dateBtnText: { color: '#1D4ED8', fontSize: 12, fontWeight: '700' },
  historyCard: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 20, padding: 16, marginBottom: 12, elevation: 1 },
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  historyTextContainer: { flex: 1 },
  historySubject: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  historyDate: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '800' },
  statusPresentBg: { backgroundColor: '#D1FAE5' },
  statusPresentText: { color: '#059669' },
  statusAbsentBg: { backgroundColor: '#FEE2E2' },
  statusAbsentText: { color: '#DC2626' },
});