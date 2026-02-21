import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

// Simplified mock data for the other tabs to demonstrate the toggle functionality
const ASSIGNMENTS_HISTORY = [
  { id: 'a1', title: 'Chapter 4 Practice', date: 'Oct 24, 2023', status: 'Graded' },
  { id: 'a2', title: 'Essay on Climate Change', date: 'Oct 21, 2023', status: 'Submitted' },
];

const NOTICES_HISTORY = [
  { id: 'n1', title: 'Quarterly Examination Schedule', date: 'Oct 20, 2023' },
  { id: 'n2', title: 'Class Representative Meeting', date: 'Oct 18, 2023' },
];

export default function ClassHistoryScreen() {
  const [activeTab, setActiveTab] = useState<'Notices' | 'Assignments' | 'Resources'>('Resources');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
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
            onPress={() => setActiveTab(tab as any)}
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
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light grey app background
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