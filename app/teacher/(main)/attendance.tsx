import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle, Line, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// --- 1. Database Simulation Service ---
// In a real app, this would be in 'services/classDatabase.ts'
const ClassDatabase = {
  getClasses: async () => {
    // Simulating API Latency
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'c1',
            title: '10-A Mathematics',
            students: 32,
            iconText: 'Σ',
            iconColor: '#4461F2',
            iconBg: '#EFF6FF',
          },
          {
            id: 'c2',
            title: '12-B Physics',
            students: 28,
            iconName: 'flask',
            iconColor: '#9333EA',
            iconBg: '#F3E8FF',
          },
          {
            id: 'c3',
            title: '9-C History',
            students: 30,
            iconName: 'earth',
            iconColor: '#D97706',
            iconBg: '#FFFBEB',
          }
        ]);
      }, 800);
    });
  }
};

// --- 2. Background Decorations ---
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
        <Path d="M 100 200 Q 120 120 200 100" stroke="#fbccf9" strokeWidth="30" strokeLinecap="round" fill="none" />
        <Path d="M 40 130 Q 70 80 100 130 T 160 130" stroke="#c7bdf1" strokeWidth="3" strokeLinecap="round" fill="none" />
        <Circle cx="80" cy="180" r="4" fill="#93C5FD" />
        <Circle cx="180" cy="150" r="3" fill="#93C5FD" />
      </Svg>
    </View>
  </View>
);

export default function AttendanceScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 3. Fetch Data from DB ---
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data: any = await ClassDatabase.getClasses();
        setClasses(data);
      } catch {
        Alert.alert("Error", "Failed to fetch classrooms");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // --- Navigation Handlers ---
  const handleHistory = (classroom: any) => {
    router.push({
      pathname: '/teacher/(attendance)/history-attendance',
      params: { classId: classroom.id, className: classroom.title }
    });
  };

  const handleMarkAttendance = (classroom: any) => {
    router.push({
      pathname: '/teacher/(attendance)/mark-daily-attendance',
      params: { classId: classroom.id, className: classroom.title }
    });
  };

  return (
    <View style={styles.mainWrapper}>
      
      <BackgroundDecorations />

      <ScrollView 
        contentContainerStyle={styles.scrollContentContainer} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Attendance</Text>

        {/* --- Summary Card --- */}
        <View style={styles.summaryCard}>
          <View style={styles.cardTopRow}>
            <TouchableOpacity style={styles.monthSelector}>
              <Ionicons name="calendar-outline" size={16} color="#FFF" />
              <Text style={styles.monthText}>October 2023</Text>
              <Ionicons name="chevron-down" size={16} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="download-outline" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.monthlyAverageLabel}>MONTHLY AVERAGE</Text>
              <Text style={styles.monthlyAverageValue}>88%</Text>
            </View>

            <TouchableOpacity 
              style={styles.viewReportContainer}
              // Optional: Keep generic report or remove
              onPress={() => Alert.alert("Coming Soon", "Detailed aggregate report coming soon.")}
            >
              <Text style={styles.viewReportText}>View Report</Text>
              <View style={styles.arrowCircle}>
                <Ionicons name="chevron-forward" size={18} color="#4461F2" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Classrooms</Text>

        {/* --- Loading State --- */}
        {loading ? (
           <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 20 }} />
        ) : (
          /* --- Classroom List --- */
          classes.map((classroom) => (
            <View key={classroom.id} style={styles.classroomCard}>
              {/* Card Header */}
              <View style={styles.classHeader}>
                <View style={[styles.classIconContainer, { backgroundColor: classroom.iconBg }]}>
                  {classroom.iconText ? (
                    <Text style={{ color: classroom.iconColor, fontSize: 24, fontWeight: 'bold' }}>
                      {classroom.iconText}
                    </Text>
                  ) : (
                    /* @ts-ignore */
                    <Ionicons name={classroom.iconName} size={24} color={classroom.iconColor} />
                  )}
                </View>
                <View>
                  <Text style={styles.classTitle}>{classroom.title}</Text>
                  <Text style={styles.classSubtitle}>{classroom.students} Students</Text>
                </View>
              </View>

              {/* Card Actions */}
              <View style={styles.actionRow}>
                {/* 2. History Navigation */}
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.historyBtn]}
                  onPress={() => handleHistory(classroom)}
                >
                  <Ionicons name="time-outline" size={18} color="#374151" />
                  <Text style={styles.historyText}>HISTORY</Text>
                </TouchableOpacity>

                {/* 3. Mark Attendance Navigation */}
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.markBtn]}
                  onPress={() => handleMarkAttendance(classroom)}
                >
                  <Ionicons name="person-add-outline" size={18} color="#4461F2" />
                  <Text style={styles.markText}>MARK ATTENDANCE</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
        
        <View style={{ height: 100 }} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: '#FFF9F0' },
  scrollContentContainer: { paddingHorizontal: 20, paddingTop: 10 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 20 },
  
  // Summary Card
  summaryCard: { borderRadius: 20, padding: 20, marginBottom: 30, backgroundColor: '#4461F2' },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  monthSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  monthText: { color: '#FFF', fontWeight: '600', marginHorizontal: 8, fontSize: 14 },
  downloadBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  monthlyAverageLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 5 },
  monthlyAverageValue: { color: '#FFF', fontSize: 42, fontWeight: '800', lineHeight: 45 },
  viewReportContainer: { alignItems: 'center' },
  viewReportText: { color: '#FFF', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  arrowCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },

  // Classrooms List
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 15 },
  classroomCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  classHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  classIconContainer: { width: 55, height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  classTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  classSubtitle: { fontSize: 13, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  historyBtn: { backgroundColor: '#F9FAFB', marginRight: 10 },
  markBtn: { backgroundColor: '#F0F4FF' },
  historyText: { color: '#374151', fontWeight: '700', fontSize: 11, marginLeft: 6, letterSpacing: 0.5 },
  markText: { color: '#4461F2', fontWeight: '700', fontSize: 11, marginLeft: 6, letterSpacing: 0.5 },
});