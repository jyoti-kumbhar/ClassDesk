import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Merged Svg imports with your existing ones
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Soft Flowing Background Lines */}
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>

    {/* Top Right: Cool Glassy Orbs */}
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

    {/* Bottom Right: Warm Sunrise Orbs */}
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

// --- Mock Data ---
const STATS_DATA = [
  { id: '1', label: 'TOTAL STUDENTS', value: '1,284', subtext: '+4.2%', subtextColor: '#10B981', trendIcon: 'trending-up', icon: 'people', iconColor: '#3B3CFF', iconBg: '#EEF2FF' },
  { id: '2', label: 'AVG. ATTENDANCE', value: '92.8%', subtext: '+1.5%', subtextColor: '#10B981', trendIcon: 'trending-up', icon: 'person-checkmark', iconColor: '#8B5CF6', iconBg: '#F5F3FF' },
  { id: '3', label: 'EXAMS DONE', value: '42', subtext: 'This Semester', subtextColor: '#9CA3AF', trendIcon: null, icon: 'clipboard', iconColor: '#F59E0B', iconBg: '#FFFBEB' },
  { id: '4', label: 'ACTIVE CLASSES', value: '18', subtext: '6 Subjects', subtextColor: '#9CA3AF', trendIcon: null, icon: 'book', iconColor: '#10B981', iconBg: '#ECFDF5' },
];

const DETAILED_REPORTS = [
  { id: '1', title: 'Class-wise Attendance', subtitle: 'Updated 2h ago', icon: 'calendar', iconColor: '#3B3CFF', iconBg: '#EEF2FF', action1: 'document-text', action2: 'eye' },
  { id: '2', title: 'Exam Performance', subtitle: 'Semester 1 Results', icon: 'star', iconColor: '#EF4444', iconBg: '#FEF2F2', action1: 'bar-chart', action2: 'eye' },
  { id: '3', title: 'Student Growth', subtitle: 'Monthly Progression', icon: 'trending-up', iconColor: '#10B981', iconBg: '#ECFDF5', action1: 'document-text', action2: 'eye' },
];

export default function AdminReportsScreen() {
  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Reports</Text>
          <Text style={styles.subtitleText}>Analytics overview for Academic Year 2024</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS_DATA.map((stat) => (
            <View key={stat.id} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: stat.iconBg }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.iconColor} />
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <View style={styles.statSubRow}>
                {stat.trendIcon && (
                  <Ionicons name={stat.trendIcon as any} size={14} color={stat.subtextColor} style={styles.trendIcon} />
                )}
                <Text style={[styles.statSubtext, { color: stat.subtextColor }]}>{stat.subtext}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Chart Section */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Attendance Trends</Text>
              <Text style={styles.chartSubtitle}>Last 7 Months</Text>
            </View>
            <View style={styles.legendBox}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>2024</Text>
            </View>
          </View>

          <View style={styles.svgContainer}>
            <Svg width="100%" height="100" viewBox="0 0 300 100">
              <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#3B3CFF" stopOpacity="0.2" />
                  <Stop offset="1" stopColor="#3B3CFF" stopOpacity="0" />
                </LinearGradient>
              </Defs>
              <Path 
                d="M0,80 Q40,80 80,40 T150,50 T240,20 T300,15" 
                fill="none" 
                stroke="#3B3CFF" 
                strokeWidth="4" 
                strokeLinecap="round" 
              />
            </Svg>
          </View>

          <View style={styles.chartXAxis}>
            <Text style={styles.axisLabel}>JAN</Text>
            <Text style={styles.axisLabel}>MAR</Text>
            <Text style={styles.axisLabel}>MAY</Text>
            <Text style={styles.axisLabel}>JUL</Text>
          </View>
        </View>

        {/* Detailed Reports Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Detailed Reports</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {DETAILED_REPORTS.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={[styles.reportIconBox, { backgroundColor: report.iconBg }]}>
                <Ionicons name={report.icon as any} size={22} color={report.iconColor} />
              </View>
              <View style={styles.reportDetails}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportSubtitle}>{report.subtitle}</Text>
              </View>
              <View style={styles.reportActions}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name={report.action1 as any} size={20} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <Ionicons name={report.action2 as any} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  dot: { position: 'absolute', borderRadius: 100 },
  headerSection: { marginBottom: 24 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 4 },
  subtitleText: { fontSize: 15, color: '#6B7280', fontWeight: '400' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { 
    width: (width - 56) / 2, 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Translucent
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 16, 
    elevation: 2 
  },
  statIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4 },
  statSubRow: { flexDirection: 'row', alignItems: 'center' },
  trendIcon: { marginRight: 4 },
  statSubtext: { fontSize: 12, fontWeight: '600' },
  chartCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Translucent
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 30, 
    elevation: 2 
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  chartTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 2 },
  chartSubtitle: { fontSize: 13, color: '#6B7280' },
  legendBox: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B3CFF', marginRight: 6 },
  legendText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  svgContainer: { height: 100, marginBottom: 10 },
  chartXAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  axisLabel: { fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#3B3CFF' },
  listContainer: { gap: 12 },
  reportCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Translucent
    borderRadius: 20, 
    padding: 16, 
    elevation: 1 
  },
  reportIconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  reportDetails: { flex: 1 },
  reportTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  reportSubtitle: { fontSize: 13, color: '#6B7280' },
  reportActions: { flexDirection: 'row', gap: 12 },
  iconBtn: { padding: 4 },
});