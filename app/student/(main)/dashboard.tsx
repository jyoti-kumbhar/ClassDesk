import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View ,Dimensions} from 'react-native';
import Svg, { Circle, G, Path } from "react-native-svg";

const { width: W, height: H } = Dimensions.get('window');

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Base cream background */}
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#FFF9F0' }]} />

    <Svg height="100%" width="100%" viewBox={`0 0 ${W} ${H}`}>
      {/* 1. TOP LEFT: Large Yellow Wedge */}
      <G transform={`translate(${-W * 0.1}, ${H * 0.05}) rotate(-15)`}>
        <Path 
          d="M 40 140 A 70 70 0 1 1 160 40 L 100 90 Z" 
          fill="#F4B76D" 
          opacity={0.7}
        />
      </G>

      {/* 2. TOP RIGHT: Small Blue Accent */}
      <Path 
        d={`M ${W - 40} 60 L ${W + 10} 20 L ${W + 10} 100 Z`} 
        fill="#5C73D1" 
        opacity={0.8} 
      />

      {/* 3. CENTER-ISH: Balanced Flowing Waves */}
      <G fill="none" strokeWidth="2.5" opacity={0.3}>
        <Path 
          d={`M -20 ${H * 0.4} C ${W * 0.3} ${H * 0.3}, ${W * 0.7} ${H * 0.5}, ${W + 20} ${H * 0.4}`} 
          stroke="#4461F2" 
        />
        <Path 
          d={`M -20 ${H * 0.43} C ${W * 0.3} ${H * 0.33}, ${W * 0.7} ${H * 0.53}, ${W + 20} ${H * 0.43}`} 
          stroke="#E25865" 
        />
      </G>

      {/* 4. MIDDLE LEFT: Reddish/Pink Wedge */}
      <G transform={`translate(${-20}, ${H * 0.55})`}>
        <Path 
          d="M 0 0 A 60 60 0 0 1 80 60 L 0 60 Z" 
          fill="#E25865" 
          opacity={0.6}
        />
      </G>

      {/* 5. BOTTOM RIGHT: Large Coral/Red Wedge */}
      <G transform={`translate(${W * 0.7}, ${H * 0.85}) rotate(180)`}>
        <Path 
          d="M 0 100 A 80 80 0 1 1 140 0 L 70 50 Z" 
          fill="#E25865" 
          opacity={0.7}
        />
      </G>

      {/* 6. BOTTOM LEFT: Small Yellow Pacman */}
      <G transform={`translate(${30}, ${H * 0.9})`}>
        <Path 
          d="M 0 40 A 30 30 0 1 1 40 0 L 20 20 Z" 
          fill="#F4B76D" 
          opacity={0.6}
        />
      </G>

      {/* 7. SCATTERED ACCENTS: Distributed Rings and Dots */}
      <G opacity={0.4}>
        {/* Top Section */}
        <Circle cx={W * 0.6} cy={H * 0.15} r="8" stroke="#B89C94" strokeWidth="2" fill="none" />
        {/* Middle Section */}
        <Circle cx={W * 0.85} cy={H * 0.5} r="12" stroke="#B89C94" strokeWidth="2" fill="none" />
        <Circle cx={W * 0.2} cy={H * 0.3} r="4" fill="#E25865" />
        {/* Bottom Section */}
        <Circle cx={W * 0.4} cy={H * 0.8} r="15" stroke="#B89C94" strokeWidth="1.5" fill="none" />
        <Circle cx={W * 0.15} cy={H * 0.7} r="3" fill="#5C73D1" />
      </G>
    </Svg>
  </View>
);

export default function StudentDashboard() {
  return (
    <View style={styles.container}>
      {/* 1. Background Layer */}
      <BackgroundDecorations />

      {/* 2. Content Layer */}
      <View style={styles.contentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.greetingText}>Good morning, Alex</Text>
            <Text style={styles.subGreeting}>Ready to tackle your goals today?</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.progressContainer}>
                <Svg width="80" height="80" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="8" fill="none" />
                  <Circle 
                    cx="50" cy="50" r="40" stroke="#4461F2" strokeWidth="8" 
                    fill="none" strokeDasharray="251" strokeDashoffset={251 * 0.15} 
                    strokeLinecap="round" transform="rotate(-90 50 50)" 
                  />
                </Svg>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>85%</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Overall{'\n'}Attendance</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.iconWrapperLight}>
                <Ionicons name="timer" size={20} color="#4461F2" />
              </View>
              <Text style={styles.examSub}>NEXT EXAM:</Text>
              <Text style={styles.examTitle}>CALCULUS II</Text>
              <Text style={styles.countdownText}>02d:04h</Text>
              <View style={styles.miniProgressBar}>
                <View style={[styles.miniProgressFill, { width: '70%' }]} />
              </View>
            </View>
          </View>

          {/* Quick Actions Section */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={[styles.actionCard, styles.actionCardBlue]}>
              <View style={styles.actionIconWrapperBlue}>
                <Ionicons name="help-circle-outline" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.actionSubLight}>Assessment</Text>
                <Text style={styles.actionTitleLight}>Attempt Exam</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, styles.actionCardBlue]}>
              <View style={styles.actionIconWrapperBlue}>
                <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.actionSubLight}>Assignment</Text>
                <Text style={styles.actionTitleLight}>Submit File</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Classroom Feed Section */}
          <View style={styles.feedHeader}>
            <Text style={styles.sectionTitle}>Classroom Feed</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.feedCard}>
            <View style={styles.feedTopRow}>
              <View style={styles.feedIconLight}>
                <Ionicons name="document-text" size={24} color="#4461F2" />
              </View>
              <View style={styles.feedTextContent}>
                <Text style={styles.feedTitle} numberOfLines={1}>Lecture 12: Organic Chemistry</Text>
                <Text style={styles.feedSubtitle}>Dr. Sarah Smith • 2h ago</Text>
              </View>
            </View>
            <View style={styles.feedActionRow}>
              <TouchableOpacity style={styles.btnPrimary}>
                <Ionicons name="download-outline" size={16} color="#FFF" />
                <Text style={styles.btnPrimaryText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSecondary}>
                <Text style={styles.btnSecondaryText}>Preview</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  contentWrapper: { flex: 1, paddingHorizontal: 20 },
  scrollContent: { paddingTop: 60, paddingBottom: 120 },
  
  blurNode: { position: 'absolute', zIndex: -1 },

  // Welcome Section
  welcomeSection: { marginBottom: 25 },
  greetingText: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  subGreeting: { fontSize: 14, color: '#64748B', marginTop: 4 },

  // Stats Section
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { 
    width: '48%', 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 20, 
    padding: 16, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  progressContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  progressTextContainer: { position: 'absolute' },
  progressText: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  statLabel: { fontSize: 13, color: '#475569', fontWeight: '600', textAlign: 'center' },
  
  iconWrapperLight: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  examSub: { fontSize: 9, color: '#94A3B8', fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  examTitle: { fontSize: 12, color: '#475569', fontWeight: '700', marginBottom: 6 },
  countdownText: { fontSize: 18, fontWeight: '800', color: '#4461F2', marginBottom: 8 },
  miniProgressBar: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' },
  miniProgressFill: { height: '100%', backgroundColor: '#4461F2' },

  // Quick Actions
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 15 },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  actionCard: { width: '48%', borderRadius: 20, padding: 16, minHeight: 130, justifyContent: 'space-between' },
  actionCardBlue: { backgroundColor: '#4461F2' },
  actionIconWrapperBlue: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' },
  actionSubLight: { fontSize: 11, color: '#C7D2FE', fontWeight: '500' },
  actionTitleLight: { fontSize: 15, fontWeight: 'bold', color: '#FFF' },

  // Feed Section
  feedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  seeAllText: { fontSize: 14, color: '#4461F2', fontWeight: '600' },
  feedCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 15, elevation: 1 },
  feedTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  feedIconLight: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  feedTextContent: { flex: 1 },
  feedTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  feedSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  feedActionRow: { flexDirection: 'row', gap: 10 },
  
  btnPrimary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4461F2', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, gap: 6 },
  btnPrimaryText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  btnSecondary: { backgroundColor: '#F1F5F9', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  btnSecondaryText: { color: '#475569', fontSize: 13, fontWeight: '600' },
});