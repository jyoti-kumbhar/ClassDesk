import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';

// --- Background Graphics (Consistent with the module) ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#f1db90" opacity={0.5} />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" opacity={0.5} /> 
      </Svg>
    </View>
    <View style={{ position: "absolute", top: 220, right: 0, opacity: 0.2 }}>
        <Svg height="100" width="60" viewBox="0 0 60 100"><Path d="M10 10 Q 50 30 10 50 T 10 90" stroke="#FF8A65" strokeWidth="3" fill="none" /></Svg>
    </View>
    <View style={{ position: "absolute", top: 180, left: -10, opacity: 0.15 }}>
        <Svg height="60" width="100" viewBox="0 0 100 60"><Path d="M10 30 Q 30 10 50 30 T 90 30" stroke="#4461F2" strokeWidth="3" fill="none" /></Svg>
    </View>
    <View style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.3 }}>
       <Svg height="150" width="300" viewBox="0 0 100 100">
         <Circle cx="20" cy="150" r="150" fill="#f39dbec9" />
       </Svg>
    </View>
  </View>
);

// --- Mock Data ---
const FILTERS = ['All', 'Notices', 'Assignments'];

const HISTORY_DATA = [
  { id: 1, type: 'assignment', title: 'Math Quiz: Calculus II', time: '1 hour ago', icon: 'clipboard', iconColor: '#2563EB', iconBg: '#DBEAFE' },
  { id: 2, type: 'notice', title: 'Mid-Term Schedule', time: '2 hours ago', icon: 'megaphone', iconColor: '#D97706', iconBg: '#FEF3C7' },
  { id: 3, type: 'assignment', title: 'Physics Lab Report Submission', time: '5 hours ago', icon: 'document-text', iconColor: '#2563EB', iconBg: '#DBEAFE' },
  { id: 4, type: 'notice', title: 'New Uniform Policy Update', time: 'Yesterday', icon: 'megaphone', iconColor: '#D97706', iconBg: '#FEF3C7' },
  { id: 5, type: 'assignment', title: 'English Essay Draft', time: 'Oct 25, 2023', icon: 'create', iconColor: '#2563EB', iconBg: '#DBEAFE' },
  { id: 6, type: 'notice', title: 'PTM Rescheduled', time: 'Oct 24, 2023', icon: 'megaphone', iconColor: '#D97706', iconBg: '#FEF3C7' },
  { id: 7, type: 'notice', title: 'Annual Sports Day Notice', time: 'Oct 22, 2023', icon: 'megaphone', iconColor: '#D97706', iconBg: '#FEF3C7' },
];

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter the data based on active tab
  const filteredData = HISTORY_DATA.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Notices' && item.type === 'notice') return true;
    if (activeFilter === 'Assignments' && item.type === 'assignment') return true;
    return false;
  });

  return (
    <View style={styles.container}>
      <BackgroundDecorations />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Information */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Classroom History</Text>
          <Text style={styles.pageSubtitle}>Grade 10-A • Activity Log</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity 
                key={filter} 
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Activity List */}
        <View style={styles.listContainer}>
          {filteredData.map((item) => (
            <TouchableOpacity key={item.id} style={styles.historyCard} activeOpacity={0.7}>
              
              {/* Left Icon */}
              <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
              </View>
              
              {/* Text Content */}
              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
              </View>

              {/* Right Chevron */}
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' // Standard light background matching the image
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 24, 
    paddingBottom: 120 // Space for the bottom nav bar
  },

  // Header Styles
  pageHeader: { 
    marginBottom: 20 
  },
  pageTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#111827', 
    marginBottom: 4 
  },
  pageSubtitle: { 
    fontSize: 14, 
    fontWeight: '500', 
    color: '#6B7280' 
  },

  // Filter Styles
  filterContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 24 
  },
  filterPill: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  filterPillActive: { 
    backgroundColor: '#1D4ED8', // Deep blue for active state
    borderColor: '#1D4ED8' 
  },
  filterText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#6B7280' 
  },
  filterTextActive: { 
    color: '#FFF' 
  },

  // List Styles
  listContainer: {
    gap: 12
  },
  historyCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 16, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    elevation: 1 
  },
  iconBox: { 
    width: 48, 
    height: 48, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 16 
  },
  textContainer: { 
    flex: 1,
    justifyContent: 'center'
  },
  itemTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#111827', 
    marginBottom: 4 
  },
  itemTime: { 
    fontSize: 12, 
    color: '#9CA3AF', 
    fontWeight: '500' 
  },
});