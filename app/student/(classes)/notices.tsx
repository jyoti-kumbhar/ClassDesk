import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';

// --- Background Graphics (As Provided) ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#f1db90" />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" /> 
      </Svg>
    </View>
    <View style={{ position: "absolute", top: 220, right: 0, opacity: 0.4 }}>
        <Svg height="100" width="60" viewBox="0 0 60 100"><Path d="M10 10 Q 50 30 10 50 T 10 90" stroke="#FF8A65" strokeWidth="3" fill="none" /></Svg>
    </View>
    <View style={{ position: "absolute", top: 180, left: -10, opacity: 0.3, transform: [{ rotate: '20deg' }] }}>
        <Svg height="60" width="100" viewBox="0 0 100 60"><Path d="M10 30 Q 30 10 50 30 T 90 30" stroke="#4461F2" strokeWidth="3" fill="none" /></Svg>
    </View>
    <View style={{ position: "absolute", top: 380, right: 30, opacity: 0.25, transform: [{ rotate: '-15deg' }] }}>
         <Svg height="80" width="80" viewBox="0 0 80 80"><Path d="M10 40 Q 40 10 70 40 T 10 70" stroke="#FFB74D" strokeWidth="2" strokeDasharray="5, 5" fill="none" /></Svg>
    </View>
    <View style={{ position: "absolute", top: 450, left: -20, opacity: 0.2 }}>
         <Svg height="120" width="60" viewBox="0 0 60 120"><Path d="M30 10 Q 60 40 30 70 T 30 130" stroke="#4FC3F7" strokeWidth="4" fill="none" /></Svg>
    </View>
    <View style={[styles.circle, { top: 40, left: -20, backgroundColor: "#f5d29d", width: 100, height: 100 }]} />
    <View style={[styles.dot, { top: 120, right: 80, backgroundColor: "#657cff" }]} />
    <View style={[styles.dot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
    <View style={[styles.dot, { bottom: 150, right: 20, backgroundColor: "#FF8A65" }]} />
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="150" width="300" viewBox="0 0 100 100">
         <Circle cx="20" cy="150" r="150" fill="#f39dbec9" />
         <Path d="M60 80 L30 60 L50 90 Z" fill="#4481f2" opacity={1}/>
       </Svg>
    </View>
    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 150, height: 150, backgroundColor: "#63caf3", borderRadius: 60, opacity: 0.5 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 80, backgroundColor: "#e9967c", borderRadius: 40 }} />
    </View>
  </View>
);

export default function NoticesScreen() {
  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Grade 10-A</Text>
          <Text style={styles.pageSubtitle}>Mathematics & Science Stream</Text>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>FEED</Text>
          <View style={styles.badgeNew}>
            <Text style={styles.badgeText}>3 New</Text>
          </View>
        </View>

        {/* Card 1: Announcement */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="megaphone" size={24} color="#D97706" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Mid-Term Schedule</Text>
            </View>
            <Text style={styles.timeText}>2h ago</Text>
          </View>
          
          <Text style={styles.cardDescription}>
            The mid-term examination schedule for Grade 10 has been finalized. Please ensure all students have their admit cards ready by Monday.
          </Text>
          
          <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.commentBtn}>
              <Ionicons name="chatbubble-ellipses" size={16} color="#1D4ED8" />
              <Text style={styles.commentText}>12 Comments</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2: File Attachment */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={[styles.iconBox, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="document-text" size={24} color="#2563EB" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Physics Lab Manual v2</Text>
            </View>
            <Text style={styles.timeText}>5h ago</Text>
          </View>

          {/* Attachment Box */}
          <View style={styles.attachmentBox}>
            <View style={styles.pdfIconWrapper}>
              <Text style={styles.pdfText}>PDF</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fileName}>Physics_10A_Lab.pdf</Text>
              <Text style={styles.fileMeta}>2.4 MB • PDF</Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="download-outline" size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>

          <View style={[styles.cardFooter, { justifyContent: 'flex-end', marginTop: 10 }]}>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 3: Calendar Event */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={[styles.iconBox, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="calendar" size={24} color="#059669" />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Science Fair 2024</Text>
            </View>
            <Text style={styles.timeText}>Yesterday</Text>
          </View>
          
          <Text style={styles.cardDescription}>
            Registration for the annual science fair is now open. Interested groups must submit their project titles by Friday afternoon.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 120 },
  
  // Bg helpers
  circle: { position: "absolute", borderRadius: 999 },
  dot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },

  // Header
  pageHeader: { marginBottom: 24 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#111827', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, fontWeight: '500', color: '#6B7280' },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.5 },
  badgeNew: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#1D4ED8', fontSize: 12, fontWeight: '700' },

  // Cards
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardTitleContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  timeText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  
  cardDescription: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 16 },
  
  // Interactions
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  commentText: { fontSize: 13, fontWeight: '800', color: '#1D4ED8' },

  // Attachment Box
  attachmentBox: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  pdfIconWrapper: { width: 40, height: 40, backgroundColor: '#FEE2E2', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pdfText: { color: '#DC2626', fontSize: 10, fontWeight: '900' },
  fileName: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 2 },
  fileMeta: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  downloadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
});