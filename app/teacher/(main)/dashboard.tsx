import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, Path, Rect } from "react-native-svg";

// --- Types ---

type IconName = keyof typeof Ionicons.glyphMap;

interface StatCardProps {
  label: string;
  value: string | number;
}

interface ActionCardProps {
  icon: IconName;
  label: string;
  isPrimary?: boolean;
}

// --- Background Graphics ---

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    
    {/* 1. Top Right Abstract Shapes */}
    <View style={{ position: "absolute", top: -50, right: -50, opacity: 0.9 }}>
      <Svg height="250" width="250" viewBox="0 0 100 100">
        <Circle cx="80" cy="20" r="40" fill="#E8F0FE" />
        <Path d="M60 10 L90 10 L75 35 Z" fill="#4461F2" /> 
        <Circle cx="30" cy="50" r="10" stroke="#FFB74D" strokeWidth="2" fill="none" opacity={0.6} />
      </Svg>
    </View>

    {/* 3. Squiggles */}
    <View style={{ position: "absolute", top: 220, right: 0, opacity: 0.4 }}>
        <Svg height="100" width="60" viewBox="0 0 60 100">
            <Path d="M10 10 Q 50 30 10 50 T 10 90" stroke="#FF8A65" strokeWidth="3" fill="none" />
        </Svg>
    </View>

    <View style={{ position: "absolute", top: 180, left: -10, opacity: 0.3, transform: [{ rotate: '20deg' }] }}>
        <Svg height="60" width="100" viewBox="0 0 100 60">
            <Path d="M10 30 Q 30 10 50 30 T 90 30" stroke="#4461F2" strokeWidth="3" fill="none" />
        </Svg>
    </View>

    <View style={{ position: "absolute", top: 380, right: 30, opacity: 0.25, transform: [{ rotate: '-15deg' }] }}>
         <Svg height="80" width="80" viewBox="0 0 80 80">
            <Path d="M10 40 Q 40 10 70 40 T 10 70" stroke="#FFB74D" strokeWidth="2" strokeDasharray="5, 5" fill="none" />
        </Svg>
    </View>

    <View style={{ position: "absolute", top: 450, left: -20, opacity: 0.2 }}>
         <Svg height="120" width="60" viewBox="0 0 60 120">
            <Path d="M30 10 Q 60 40 30 70 T 30 130" stroke="#4FC3F7" strokeWidth="4" fill="none" />
        </Svg>
    </View>

    {/* 4. Dots */}
    <View style={[styles.bgDot, { top: 120, right: 70, backgroundColor: "#FF8A65" }]} />
    <View style={[styles.bgDot, { top: 280, left: 40, backgroundColor: "#FFB74D", width: 8, height: 8 }]} />
    <View style={[styles.bgDot, { bottom: 300, right: 110, backgroundColor: "#4FC3F7" }]} />
    <View style={[styles.bgDot, { top: 400, left: -10, backgroundColor: "#4461F2", opacity: 0.3, width: 20, height: 20 }]} />
    
    {/* 5. Bottom Shapes */}
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="180" width="180" viewBox="0 0 100 100">
         <Circle cx="0" cy="100" r="60" fill="#E3F2FD" />
         <Path d="M20 80 L30 60 L50 90 Z" fill="#4461F2" opacity={0.8}/>
         <Rect x="60" y="40" width="10" height="10" transform="rotate(20 65 45)" fill="#FFCC80" opacity={0.6} />
       </Svg>
    </View>

    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 140, height: 140, backgroundColor: "#FFCC80", borderRadius: 70, opacity: 0.3 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 90, height: 90, backgroundColor: "#FFAB91", borderRadius: 45, opacity: 0.8 }} />
       <View style={{ position: 'absolute', bottom: 60, right: 50, opacity: 0.5 }}>
        <Svg height="15" width="15" viewBox="0 0 20 20">
            <Rect x="0" y="8" width="20" height="4" fill="#FFF" rx="1" />
            <Rect x="8" y="0" width="4" height="20" fill="#FFF" rx="1" />
        </Svg>
       </View>
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

const ActionCard = ({ icon, label, isPrimary = false }: ActionCardProps) => (
  <TouchableOpacity style={[styles.actionCard, isPrimary && styles.actionCardPrimary]}>
    <View style={[styles.iconBox, isPrimary ? styles.iconBoxPrimary : styles.iconBoxDefault]}>
      <Ionicons name={icon} size={22} color={isPrimary ? "#FFF" : "#4461F2"} />
    </View>
    <Text style={[styles.actionLabel, isPrimary && styles.textWhite]}>{label}</Text>
  </TouchableOpacity>
);

// --- Main Dashboard Screen ---

export default function TeacherDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background Graphics injected here */}
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Welcome */}
        <View style={styles.section}>
          <Text style={styles.dateText}>Monday, Oct 23rd</Text>
          <Text style={styles.greetingText}>Good Morning, Prof. Smith</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsRow}>
          <StatCard label="Total Classes" value="12" />
          <StatCard label="Total Students" value="450" />
          <StatCard label="Pending Exams" value="03" />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            <ActionCard icon="calendar" label="Create Exam" />
            <ActionCard icon="people" label="Create Classroom" />
            <ActionCard icon="checkbox" label="Mark Attendance" />
            <ActionCard icon="cloud-upload" label="Upload Assignment" />
          </View>
        </View>

        {/* Classroom Feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Classroom Feed</Text>
            <TouchableOpacity><Text style={styles.linkText}>View All</Text></TouchableOpacity>
          </View>

          <View style={styles.feedCard}>
            <View style={styles.feedTop}>
              <View style={styles.fileIcon}>
                <Ionicons name="document-text" size={24} color="#F97316" />
              </View>
              <View style={styles.feedContent}>
                <Text style={styles.feedTitle}>Advanced Calculus Notes</Text>
                <Text style={styles.feedSubtitle}>Class: Section A - Mathematics</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={20} color="#C4C4C4" />
              </TouchableOpacity>
            </View>
            <View style={styles.feedFooter}>
              <View style={styles.feedTime}>
                <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                <Text style={styles.timeText}>Oct 22, 2:00 PM</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>SHARED</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

// --- Shared Reusable Styles ---
const flexCenter = { justifyContent: 'center' as const, alignItems: 'center' as const };
const rowCenter = { flexDirection: 'row' as const, alignItems: 'center' as const };
const shadowBase = { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 };

// --- Compressed Stylesheet ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFCF9' },
  bgDot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },
  scrollContent: { padding: 20, paddingTop: 10 },
  section: { marginBottom: 25 },
  dateText: { color: '#9CA3AF', fontSize: 14, fontWeight: '500' },
  greetingText: { fontSize: 24, fontWeight: '800', color: '#1F2937', marginTop: 4 },
  statsRow: { ...rowCenter, justifyContent: 'space-between', marginBottom: 25 },
  statCard: { ...flexCenter, ...shadowBase, backgroundColor: '#FFF', width: '31%', padding: 15, borderRadius: 16 },
  statLabel: { fontSize: 9, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', textAlign: 'center', marginBottom: 5 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#4461F2' },
  sectionHeader: { ...rowCenter, justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 10 },
  linkText: { color: '#4461F2', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { ...shadowBase, width: '48%', height: 120, backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 15, justifyContent: 'center', alignItems: 'flex-start' },
  actionCardPrimary: { backgroundColor: '#4461F2' },
  iconBox: { ...flexCenter, width: 40, height: 40, borderRadius: 10, marginBottom: 10 },
  iconBoxDefault: { backgroundColor: '#EFF6FF' },
  iconBoxPrimary: { backgroundColor: 'rgba(255,255,255,0.2)' },
  actionLabel: { fontSize: 14, fontWeight: '700', color: '#1F2937', lineHeight: 20 },
  textWhite: { color: '#FFF' },
  feedCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  feedTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  fileIcon: { ...flexCenter, width: 45, height: 45, backgroundColor: '#FFF7ED', borderRadius: 12, marginRight: 12 },
  feedContent: { flex: 1 },
  feedTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  feedSubtitle: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  feedFooter: { ...rowCenter, justifyContent: 'space-between' },
  feedTime: rowCenter,
  timeText: { fontSize: 11, color: '#9CA3AF', marginLeft: 4, fontWeight: '500' },
  badge: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#059669', fontSize: 10, fontWeight: '700' }
});