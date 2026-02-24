import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

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

// --- Background Component (Integrated from Step 1) ---

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
          {/* Note: Added stroke back to first path if it was missing in copy, assuming standard stroke based on context */}
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

    {/* Bottom Right - Abstract Playground (Lifted Up) */}
    <View style={{ position: "absolute", bottom: 40, right: -20, opacity: 0.9 }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        
        {/* 1. Large Background Blob (Very Pale Teal) */}
        <Circle cx="200" cy="200" r="150" fill="#fdf0fd" />

        {/* 2. The "Macaroni" Curve (Thick Mint Line) */}
        <Path 
          d="M 100 200 Q 120 120 200 100" 
          stroke="#fbccf9" 
          strokeWidth="30" 
          strokeLinecap="round" 
          fill="none" 
        />

        {/* 3. The Purple Squiggle (Hand-drawn vibe) */}
        <Path 
          d="M 40 130 Q 70 80 100 130 T 160 130" 
          stroke="#c7bdf1" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none" 
        />

        {/* 4. Tiny Blue Dot Accents */}
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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
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
            <ActionCard icon="checkmark-circle" label="Mark Attendance" />
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
const shadowBase = { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 };

// --- Compressed Stylesheet ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  scrollContent: { padding: 20, paddingTop: 10 },
  section: { marginBottom: 25 },
  
  dateText: { color: '#6B7280', fontSize: 13, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  greetingText: { fontSize: 26, fontWeight: '800', color: '#1F2937', marginTop: 6, letterSpacing: -0.5 },
  
  statsRow: { ...rowCenter, justifyContent: 'space-between', marginBottom: 25 },
  statCard: { ...flexCenter, ...shadowBase, backgroundColor: '#FFF', width: '31%', paddingVertical: 20, paddingHorizontal: 10, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase', textAlign: 'center', marginBottom: 8, letterSpacing: 0.5 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#4461F2' },
  
  sectionHeader: { ...rowCenter, justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  linkText: { color: '#4461F2', fontWeight: '600', fontSize: 13 },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  actionCard: { ...shadowBase, width: '48%', height: 110, backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 15, justifyContent: 'center', alignItems: 'flex-start', borderWidth: 1, borderColor: '#F3F4F6' },
  actionCardPrimary: { backgroundColor: '#4461F2', borderColor: '#4461F2' },
  
  iconBox: { ...flexCenter, width: 42, height: 42, borderRadius: 14, marginBottom: 12 },
  iconBoxDefault: { backgroundColor: '#F0F5FF' },
  iconBoxPrimary: { backgroundColor: 'rgba(255,255,255,0.2)' },
  
  actionLabel: { fontSize: 14, fontWeight: '700', color: '#374151', lineHeight: 20 },
  textWhite: { color: '#FFF' },
  
  feedCard: { ...shadowBase, backgroundColor: '#FFF', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F3F4F6' },
  feedTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
  fileIcon: { ...flexCenter, width: 48, height: 48, backgroundColor: '#FFF7ED', borderRadius: 16, marginRight: 15 },
  feedContent: { flex: 1, justifyContent: 'center' },
  feedTitle: { fontSize: 15, fontWeight: '700', color: '#1F2937', marginBottom: 4 },
  feedSubtitle: { fontSize: 12, color: '#9CA3AF' },
  
  feedFooter: { ...rowCenter, justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F9FAFB' },
  feedTime: rowCenter,
  timeText: { fontSize: 12, color: '#9CA3AF', marginLeft: 6, fontWeight: '500' },
  badge: { backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#059669', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }
});