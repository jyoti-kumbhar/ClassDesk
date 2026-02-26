import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import Svg, { Circle, Path } from "react-native-svg";

// --- Firebase & Services ---
import { db } from "../../../firebase/firebaseConfig"; // Adjust path as needed
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { ExamDatabase } from '../../services/examDatabase'; // Adjust path to your service file

// --- Types ---
type IconName = keyof typeof Ionicons.glyphMap;

interface SummaryCardProps {
  icon: IconName;
  label: string;
  value: string | number;
  color?: string;
}

interface PerformanceCardProps {
  grade: string;
  students: string;
  attendance: string;
  trend: 'up' | 'stable' | 'down';
}

// --- Background Graphics Component ---
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

    <View style={{ position: "absolute", bottom: -50, right: -20, opacity: 0.6 }}>
      <Svg height="200" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="80" r="60" fill="#FDBA74" opacity={0.5} />
        <Circle cx="80" cy="40" r="30" fill="#FCA5A5" opacity={0.4} />
      </Svg>
    </View>

    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
  </View>
);

// --- UI Components ---
const SummaryCard = ({ icon, label, value, color = "#4461F2" }: SummaryCardProps) => (
  <View style={styles.summaryCard}>
    <View style={styles.summaryIconBox}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, { color }]}>{value}</Text>
  </View>
);

const ClassPerformanceCard = ({ grade, students, attendance, trend }: PerformanceCardProps) => {
  const trendIcon = trend === "down" ? "arrow-down" : trend === "stable" ? "arrow-forward" : "arrow-up";
  const trendColor = trend === "down" ? "#F59E0B" : trend === "stable" ? "#4461F2" : "#10B981";

  return (
    <View style={styles.performanceCard}>
      <Ionicons name={trendIcon} size={20} color={trendColor} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.perfTitle}>{grade}</Text>
        <Text style={styles.perfSubtitle}>{students}</Text>
      </View>
      <Text style={[styles.perfPercent, { color: trendColor }]}>{attendance}</Text>
    </View>
  );
};

// --- Main Screen ---
export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classrooms: 0,
    exams: 0
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch exams via your ExamDatabase service
        const examsList = await ExamDatabase.getExams();

        // 2. Fetch counts for Users and Classes via optimized Server Count
        const studentQuery = query(collection(db, "users"), where("role", "==", "Student"));
        const teacherQuery = query(collection(db, "users"), where("role", "==", "Teacher"));
        const classQuery = collection(db, "classes");

        const [studentSnap, teacherSnap, classSnap] = await Promise.all([
          getCountFromServer(studentQuery),
          getCountFromServer(teacherQuery),
          getCountFromServer(classQuery)
        ]);

        setStats({
          students: studentSnap.data().count,
          teachers: teacherSnap.data().count,
          classrooms: classSnap.data().count,
          exams: examsList.length
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4461F2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.greetingText}>Good morning, Admin</Text>
          <Text style={styles.dateSubtext}>Heres whats happening today</Text>
        </View>

        {/* Dynamic Summary Cards */}
        <View style={styles.gridContainer}>
          <SummaryCard icon="people" label="Total Students" value={stats.students} color="#4461F2" />
          <SummaryCard icon="id-card" label="Total Teachers" value={stats.teachers} color="#8B5CF6" />
          <SummaryCard icon="library" label="Classrooms" value={stats.classrooms} color="#10B981" />
          <SummaryCard icon="checkmark-circle" label="Exams Created" value={stats.exams} color="#F59E0B" />
        </View>

        {/* Placeholder Performance Data */}
        <View style={[styles.section, { marginTop: 10 }]}>
          <Text style={styles.sectionTitle}>Class Performance</Text>
          <ClassPerformanceCard grade="Grade 10-A" students="Active" attendance="94%" trend="up" />
          <ClassPerformanceCard grade="Grade 11-B" students="Stable" attendance="91%" trend="stable" />
          <ClassPerformanceCard grade="Grade 9-C" students="Check needed" attendance="88%" trend="down" />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  dot: { position: "absolute", borderRadius: 999 },
  container: { flex: 1, backgroundColor: '#FFF9F0' }, 
  scrollContent: { padding: 20, paddingTop: 40, paddingBottom: 100 }, 
  section: { marginBottom: 25 },
  greetingText: { fontSize: 26, fontWeight: '800', color: '#111827' },
  dateSubtext: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginTop: 2 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryCard: { 
    width: '48%', 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: 16, 
    borderRadius: 24, 
    marginBottom: 15, 
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  summaryIconBox: { 
    width: 42, 
    height: 42, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 12, 
    backgroundColor: '#F3F4F6' 
  },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase' },
  summaryValue: { fontSize: 24, fontWeight: '800' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 15 },
  performanceCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12, 
    elevation: 1 
  },
  perfTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  perfSubtitle: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  perfPercent: { fontSize: 15, fontWeight: '800' },
});