import { Ionicons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Svg, { Circle, Path, Line } from "react-native-svg";
import { ExamDatabase } from '../services/examDatabase';
import { ClassDatabase } from '../services/classDatabase'; 

const { width } = Dimensions.get('window');
type IconName = keyof typeof Ionicons.glyphMap;
interface StatCardProps {
  label: string;
  value: string | number;
}

interface ActionCardProps {
  icon: IconName;
  label: string;
  isPrimary?: boolean;
  onPress: () => void;
}

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
        <Path d="M 100 200 Q 120 120 200 100" stroke="#fbccf9" strokeWidth="30" strokeLinecap="round" fill="none" />
        <Path d="M 40 130 Q 70 80 100 130 T 160 130" stroke="#c7bdf1" strokeWidth="3" strokeLinecap="round" fill="none" />
        <Circle cx="80" cy="180" r="4" fill="#93C5FD" />
        <Circle cx="180" cy="150" r="3" fill="#93C5FD" />
      </Svg>
    </View>
  </View>
);


// --- Components ---
const StatCard = ({ label, value }: StatCardProps) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const ActionCard = ({ icon, label, isPrimary = false, onPress }: ActionCardProps) => (
  <TouchableOpacity 
    style={[styles.actionCard, isPrimary && styles.actionCardPrimary]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={[styles.iconBox, isPrimary ? styles.iconBoxPrimary : styles.iconBoxDefault]}>
      <Ionicons name={icon} size={22} color={isPrimary ? "#FFF" : "#4461F2"} />
    </View>
    <Text style={[styles.actionLabel, isPrimary && styles.textWhite]}>{label}</Text>
  </TouchableOpacity>
);

// --- Main Dashboard Screen ---
export default function TeacherDashboard() {
  const router = useRouter();
  
  // Stats State
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    exams: 0
  });
  const [loading, setLoading] = useState(true);

  // 1. Fetch Real Data from DB
  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        try {
          // Fetch Exams Count
          const exams = await ExamDatabase.getExams();
          const pendingExams = exams.filter((e:any) => e.status !== 'COMPLETED').length;

          // Fetch Classes Count (If ClassDatabase exists, otherwise mock)
          let classCount = 0;
          let studentCount = 0;
          
          if (typeof ClassDatabase !== 'undefined' && ClassDatabase.getClasses) {
             const classes: any = await ClassDatabase.getClasses();
             classCount = classes.length;
             // Calculate total students if available in class object
             studentCount = classes.reduce((acc: number, curr: any) => acc + (curr.students || 0), 0);
          } else {
             // Fallback Mock if ClassDatabase isn't fully implemented yet
             classCount = 5; 
             studentCount = 120;
          }

          setStats({
            classes: classCount,
            students: studentCount,
            exams: pendingExams
          });
        } catch (e) {
          console.error("Failed to load dashboard stats", e);
        } finally {
          setLoading(false);
        }
      };
      
      loadStats();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome Section */}
        <View style={styles.section}>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
          <Text style={styles.greetingText}>Hello, Teacher!</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          {loading ? (
             <ActivityIndicator color="#4461F2" />
          ) : (
             <>
               <StatCard label="Total Classes" value={stats.classes} />
               <StatCard label="Total Students" value={stats.students} />
               <StatCard label="Active Exams" value={stats.exams} />
             </>
          )}
        </View>

        {/* Quick Actions (5. Functional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            
            <ActionCard 
              icon="calendar" 
              label="Create Exam" 
              onPress={() => router.push('/teacher/(exam)/createexam')}
            />
            
            <ActionCard 
              icon="people" 
              label="Create Class" 
              onPress={() => router.push('/teacher/(main)/classes')} // Adjust path if needed
            />
            
            <ActionCard 
              icon="checkmark-circle" 
              label="Mark Attendance" 
              onPress={() => router.push('/teacher/(attendance)/mark-daily-attendance')}
            />
            
            {/* Placeholder for future feature */}
            <ActionCard 
              icon="cloud-upload" 
              label="Upload Assignment" 
              onPress={() =>router.push('/teacher/(classes)/notice')}
            />
            
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  scrollContent: { padding: 20, paddingTop: 10 },
  section: { marginBottom: 25 },
  
  dateText: { color: '#6B7280', fontSize: 13, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  greetingText: { fontSize: 26, fontWeight: '800', color: '#1F2937', marginTop: 6, letterSpacing: -0.5 },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25, alignItems: 'center' },
  statCard: { justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, backgroundColor: '#FFF', width: '31%', paddingVertical: 20, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8, letterSpacing: 0.5 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#4461F2' },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 15 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, width: '48%', height: 110, backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 15, justifyContent: 'center', alignItems: 'flex-start', borderWidth: 1, borderColor: '#F3F4F6' },
  actionCardPrimary: { backgroundColor: '#4461F2', borderColor: '#4461F2' },
  
  iconBox: { justifyContent: 'center', alignItems: 'center', width: 42, height: 42, borderRadius: 14, marginBottom: 12 },
  iconBoxDefault: { backgroundColor: '#F0F5FF' },
  iconBoxPrimary: { backgroundColor: 'rgba(255,255,255,0.2)' },
  
  actionLabel: { fontSize: 14, fontWeight: '700', color: '#374151', lineHeight: 20 },
  textWhite: { color: '#FFF' },
});
