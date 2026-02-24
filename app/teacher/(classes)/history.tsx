import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- Mock Data ---
const RESOURCES_DATA = [
  {
    id: '1',
    type: 'pdf',
    title: 'Calculus Cheat Sheet v2',
    description: 'A comprehensive guide covering derivatives, integrals, and limit...',
    date: 'Oct 20, 2023',
    iconColor: '#EF4444', // Red
    iconBg: '#FEF2F2',
  },
  {
    id: '2',
    type: 'doc',
    title: 'Week 8 Lecture Notes',
    description: 'Detailed notes from the session on Trigonometric Functions and...',
    date: 'Oct 18, 2023',
    iconColor: '#3B3CFF', // Blue
    iconBg: '#EEF2FF',
  },
  {
    id: '3',
    type: 'pdf',
    title: 'Sample Question Paper',
    description: 'Previous year finals question paper with marking scheme and...',
    date: 'Oct 15, 2023',
    iconColor: '#EF4444', // Red
    iconBg: '#FEF2F2',
  },
];

const ASSIGNMENTS_HISTORY = [
  { id: 'a1', title: 'Chapter 4 Practice', date: 'Oct 24, 2023', status: 'Graded' },
  { id: 'a2', title: 'Essay on Climate Change', date: 'Oct 21, 2023', status: 'Submitted' },
];

const NOTICES_HISTORY = [
  { id: 'n1', title: 'Quarterly Examination Schedule', date: 'Oct 20, 2023' },
  { id: 'n2', title: 'Class Representative Meeting', date: 'Oct 18, 2023' },
];

// --- Background Component ---
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

    {/* Bottom Right - Abstract Playground */}
    <View style={{ position: "absolute", bottom: 40, right: -20, opacity: 0.9 }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        <Circle cx="200" cy="200" r="150" fill="#fdf0fd" />
        <Path 
          d="M 100 200 Q 120 120 200 100" 
          stroke="#fbccf9" 
          strokeWidth="30" 
          strokeLinecap="round" 
          fill="none" 
        />
        <Path 
          d="M 40 130 Q 70 80 100 130 T 160 130" 
          stroke="#c7bdf1" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none" 
        />
        <Circle cx="80" cy="180" r="4" fill="#93C5FD" />
        <Circle cx="180" cy="150" r="3" fill="#93C5FD" />
      </Svg>
    </View>
  </View>
);

export default function ClassHistoryScreen() {
  const [activeTab, setActiveTab] = useState('Resources');

  return (
    <View style={styles.mainContainer}>
      
      {/* Background Graphics */}
      <BackgroundDecorations />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>10A – Mathematics</Text>
          <Text style={styles.subTitle}>Classroom Activity History</Text>
        </View>

        {/* Toggle Switch */}
        <View style={styles.toggleContainer}>
          {['Notices', 'Assignments', 'Resources'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.toggleBtn, activeTab === tab && styles.toggleBtnActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, activeTab === tab && styles.toggleTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- CONTENT AREA --- */}

        {/* Resources Tab */}
        {activeTab === 'Resources' && (
          <View style={styles.listContainer}>
            {RESOURCES_DATA.map((item) => (
              <View key={item.id} style={styles.card}>
                
                {/* Card Top: Icon and Text */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                    <Ionicons 
                      name={item.type === 'pdf' ? 'document' : 'document-text'} 
                      size={24} 
                      color={item.iconColor} 
                    />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                  </View>
                </View>

                {/* Card Bottom: Date and Action */}
                <View style={styles.cardBottomRow}>
                  <View>
                    <Text style={styles.dateLabel}>POSTED DATE</Text>
                    <Text style={styles.dateValue}>{item.date}</Text>
                  </View>

                  <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
                    <Ionicons name="download-outline" size={16} color="#FFF" style={styles.downloadIcon} />
                    <Text style={styles.downloadBtnText}>Download</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ))}
          </View>
        )}

        {/* Assignments Tab (Mock Layout) */}
        {activeTab === 'Assignments' && (
          <View style={styles.listContainer}>
            {ASSIGNMENTS_HISTORY.map((item) => (
              <View key={item.id} style={[styles.card, { paddingVertical: 20 }]}>
                 <Text style={styles.cardTitle}>{item.title}</Text>
                 <View style={[styles.cardBottomRow, { marginTop: 12 }]}>
                   <Text style={styles.dateValue}>{item.date}</Text>
                   <Text style={[styles.dateLabel, { color: '#3B3CFF' }]}>{item.status}</Text>
                 </View>
              </View>
            ))}
          </View>
        )}

        {/* Notices Tab (Mock Layout) */}
        {activeTab === 'Notices' && (
          <View style={styles.listContainer}>
            {NOTICES_HISTORY.map((item) => (
              <View key={item.id} style={[styles.card, { paddingVertical: 20 }]}>
                 <Text style={styles.cardTitle}>{item.title}</Text>
                 <Text style={[styles.dateValue, { marginTop: 8 }]}>{item.date}</Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF9F0', // Updated theme background
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  
  // Header
  headerSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Toggle Switch
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#111827',
  },

  // List Container
  listContainer: {
    gap: 16,
  },
  
  // Card Styles
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  // Download Button
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B3CFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  downloadIcon: {
    marginRight: 6,
  },
  downloadBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});