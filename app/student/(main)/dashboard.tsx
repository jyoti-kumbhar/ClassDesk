import React from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Dimensions, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from "react-native-svg";

const { width: W, height: H } = Dimensions.get('window');

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

    {/* Top Right: Orbs */}
    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>

    {/* Middle Left: Bubble */}
    <View style={{ position: "absolute", top: 300, left: -40, opacity: 0.5 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Circle cx="40" cy="50" r="40" fill="#6EE7B7" opacity={0.4} />
        <Circle cx="60" cy="30" r="15" fill="#93C5FD" opacity={0.6} />
      </Svg>
    </View>

    {/* Bottom Right: Orbs */}
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

export default function StudentDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackgroundDecorations />
      
      <View style={styles.contentWrapper}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Section - Reduced Top Spacing */}
          <View style={styles.welcomeSection}>
            <Text style={styles.greetingText}>Good morning, Alex</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  contentWrapper: { flex: 1, paddingHorizontal: 20 },
  
  // Reduced paddingTop from 60 to 15 for tighter top spacing
  scrollContent: { paddingTop: 15, paddingBottom: 100 },
  
  dot: { position: 'absolute', borderRadius: 100 },

  // Welcome Section
  welcomeSection: { marginBottom: 20 },
  greetingText: { fontSize: 26, fontWeight: '800', color: '#1E293B' },

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
  feedCard: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 20, padding: 16, marginBottom: 15, elevation: 1 },
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