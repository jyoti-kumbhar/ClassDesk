import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Svg, { Circle, Path} from "react-native-svg"; // Removed Path, as this theme only uses soft circles

// --- Types ---

type IconName = keyof typeof Ionicons.glyphMap;

interface SummaryCardProps {
  icon: IconName;
  label: string;
  value: string;
  color?: string;
}

interface PerformanceCardProps {
  grade: string;
  students: string;
  attendance: string;
  trend: 'up' | 'stable' | 'down';
}

// --- Background Graphics (Glassmorphic Bubble Theme) ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    
    {/* Soft Flowing Background Lines */}
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        {/* Top sweeping blue curve */}
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        {/* Middle dashed mint accent line */}
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        {/* Bottom sweeping pink curve */}
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>

    {/* Top Right: Cool Glassy Orbs (Blue & Lavender) */}
    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>

    {/* Middle Left: Floating Mint Bubble */}
    <View style={{ position: "absolute", top: 300, left: -40, opacity: 0.5 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Circle cx="40" cy="50" r="40" fill="#6EE7B7" opacity={0.4} />
        <Circle cx="60" cy="30" r="15" fill="#93C5FD" opacity={0.6} />
      </Svg>
    </View>

    {/* Bottom Right: Warm Sunrise Orbs (Peach & Soft Pink) */}
    <View style={{ position: "absolute", bottom: -50, right: -20, opacity: 0.6 }}>
      <Svg height="200" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="80" r="60" fill="#FDBA74" opacity={0.5} />
        <Circle cx="80" cy="40" r="30" fill="#FCA5A5" opacity={0.4} />
      </Svg>
    </View>

    {/* Floating Mini Bubbles */}
    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
    <View style={[styles.dot, { bottom: 120, left: 80, backgroundColor: "#F9A8D4", width: 10, height: 10, opacity: 0.8 }]} />
  </View>
);

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


// --- MAIN SCREEN ---

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={styles.section}>
          <Text style={styles.greetingText}>Good morning, Admin</Text>
        </View>

        {/* Summary */}
        <View style={styles.gridContainer}>
          <SummaryCard icon="people" label="Total Students" value="1,250" />
          <SummaryCard icon="id-card" label="Total Teachers" value="84" />
          <SummaryCard icon="library" label="Classrooms" value="42" />
          <SummaryCard icon="checkmark-circle" label="Exams Done" value="12" />
        </View>

        {/* Performance */}
        <View style={[styles.section, { marginBottom: 20 }]}>
          <Text style={styles.sectionTitle}>Class Performance</Text>
          <ClassPerformanceCard grade="Grade 10-A" students="35 Students" attendance="94%" trend="up" />
          <ClassPerformanceCard grade="Grade 11-B" students="28 Students" attendance="91%" trend="stable" />
          <ClassPerformanceCard grade="Grade 9-C" students="42 Students" attendance="88%" trend="down" />
        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  dot: { position: "absolute", borderRadius: 999 },
  container: { flex: 1, backgroundColor: '#FFF9F0' }, 
  scrollContent: { padding: 20, paddingTop: 40 }, 
  section: { marginBottom: 25 },
  greetingText: { fontSize: 26, fontWeight: '800', color: '#111827', marginTop: 4 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryCard: { width: '48%', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 15, elevation: 2 },
  summaryIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: '#EEF2FF' },
  summaryLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  summaryValue: { fontSize: 22, fontWeight: '800' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 12 },
  performanceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 1 },
  perfTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  perfSubtitle: { fontSize: 12, color: '#6B7280' },
  perfPercent: { fontSize: 15, fontWeight: '800' },
});