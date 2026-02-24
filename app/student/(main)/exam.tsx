import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';

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

// --- Mock Data matching the Exams UI ---
const EXAM_DATA = [
  { 
    id: 1, 
    title: 'Final Term: Biology', 
    date: 'May 24, 2024',
    duration: '90 mins',
    icon: 'flask', 
    iconColor: '#1D4ED8', 
    iconBg: '#EEF2FF', 
    isActive: true, 
  },
  { 
    id: 2, 
    title: 'Midterm: Mathematics', 
    date: 'May 26, 2024',
    duration: '120 mins',
    icon: 'calculator', 
    iconColor: '#2563EB', 
    iconBg: '#EEF2FF',
    isActive: false,
  },
  { 
    id: 3, 
    title: 'Practical: Physics', 
    date: 'June 02, 2024',
    duration: '60 mins',
    icon: 'flask', 
    iconColor: '#9333EA', 
    iconBg: '#FAF5FF',
    isActive: false,
  },
  { 
    id: 4, 
    title: 'Quiz 3: World History', 
    date: 'May 15, 2024',
    duration: '30 mins',
    icon: 'library', 
    iconColor: '#4B5563', 
    iconBg: '#F3F4F6',
    isActive: false,
  }
];

export default function ExamsScreen() {
  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Information */}
        <Text style={styles.pageTitle}>Exams</Text>

        {/* Exam Cards */}
        {EXAM_DATA.map((item) => (
          <View key={item.id} style={[styles.card, item.isActive && styles.activeCard]}>
            
            {/* Top Row: Icon and Details */}
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={28} color={item.iconColor} />
              </View>
              
              <View style={styles.headerTextContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                
                {/* Meta Information (Date & Time) */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{item.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{item.duration}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Render 'Start Exam' button only if the exam is active */}
            {item.isActive && (
              <TouchableOpacity style={styles.startBtn} activeOpacity={0.8}>
                <Text style={styles.startBtnText}>Start Exam</Text>
              </TouchableOpacity>
            )}
            
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF9F0' 
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 120 
  }, 
  dot: {
    position: 'absolute',
    borderRadius: 100,
  },
  pageTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#111827', 
    marginBottom: 24 
  },
  card: { 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 24, 
    padding: 20, 
    marginBottom: 16, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 12, 
    elevation: 2 
  },
  activeCard: {
    borderColor: '#EEF2FF',
    borderWidth: 2,
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  iconBox: { 
    width: 64, 
    height: 64, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  headerTextContainer: { 
    flex: 1,
    justifyContent: 'center'
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#111827', 
    marginBottom: 8 
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#6B7280', 
  },
  startBtn: { 
    backgroundColor: '#1D4ED8', 
    paddingVertical: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 20,
  },
  startBtnText: { 
    fontSize: 16, 
    fontWeight: '800', 
    color: '#FFF', 
    letterSpacing: 0.5 
  },
});