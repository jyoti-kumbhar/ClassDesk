import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data matching the Exams UI ---
const EXAM_DATA = [
  { 
    id: 1, 
    title: 'Final Term: Biology', 
    date: 'May 24, 2024',
    duration: '90 mins',
    icon: 'flask', 
    iconColor: '#1D4ED8', // Darker Blue
    iconBg: '#EEF2FF', 
    isActive: true, // This flag will render the "Start Exam" button and active styling
  },
  { 
    id: 2, 
    title: 'Midterm: Mathematics', 
    date: 'May 26, 2024',
    duration: '120 mins',
    // Using calculator as substitute for Sigma
    icon: 'calculator', 
    iconColor: '#2563EB', // Blue
    iconBg: '#EEF2FF',
    isActive: false,
  },
  { 
    id: 3, 
    title: 'Practical: Physics', 
    date: 'June 02, 2024',
    duration: '60 mins',
    icon: 'flask', 
    iconColor: '#9333EA', // Purple
    iconBg: '#FAF5FF',
    isActive: false,
  },
  { 
    id: 4, 
    title: 'Quiz 3: World History', 
    date: 'May 15, 2024',
    duration: '30 mins',
    // Using library as substitute for the scroll
    icon: 'library', 
    iconColor: '#4B5563', // Gray/Dark
    iconBg: '#F3F4F6',
    isActive: false,
  }
];

export default function ExamsScreen() {
  return (
    <View style={styles.container}>
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

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Ionicons name="moon" size={20} color="#111827" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F4F6F9' 
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 120 // Extra padding for the custom bottom nav
  }, 
  
  // Header
  pageTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#111827', 
    marginBottom: 24 
  },

  // Card Styles
  card: { 
    backgroundColor: '#FFF', 
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
  
  // Meta Info (Date & Duration)
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

  // Start Exam Button
  startBtn: { 
    backgroundColor: '#1D4ED8', // Strong Blue
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

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 100, // Positions it right above the layout's bottom nav
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  }
});