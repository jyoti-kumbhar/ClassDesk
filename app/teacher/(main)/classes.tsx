import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data ---
const CLASS_DATA = [
  { id: 1, grade: 'Grade 10 - A', subject: 'Advanced Mathematics', teacher: 'Robert Fox', students: 35, tags: ['MATHEMATICS', 'SCIENCE'], icon: 'flask', iconColor: '#4461F2', iconBg: '#EEF2FF' },
  { id: 2, grade: 'Grade 11 - B', subject: 'Literature & Grammar', teacher: 'Jenny Wilson', students: 28, tags: ['ENGLISH', 'ARTS'], icon: 'globe-outline', iconColor: '#D97706', iconBg: '#FEF3C7' },
  { id: 3, grade: 'Grade 9 - C', subject: 'Modern World History', teacher: 'Guy Hawkins', students: 42, tags: ['HISTORY', 'GEOGRAPHY'], icon: 'time-outline', iconColor: '#059669', iconBg: '#D1FAE5' }
];

export default function ClassesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Information */}
        <Text style={styles.dateText}>Thursday, October 24th</Text>
        <Text style={styles.pageTitle}>Manage Classes</Text>

        {/* Create Button */}
        <TouchableOpacity style={styles.createBtn} activeOpacity={0.8}>
          <Ionicons name="add-circle" size={24} color="#FFF" />
          <Text style={styles.createBtnText}>Create New Class</Text>
        </TouchableOpacity>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Classes</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter" size={16} color="#6B7280" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Class Cards */}
        {CLASS_DATA.map((item) => (
          <View key={item.id} style={styles.card}>
            
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
              </View>
              <View>
                <Text style={styles.gradeText}>{item.grade}</Text>
                <Text style={styles.subjectText}>{item.subject}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Teacher</Text>
                <View style={styles.infoValueRow}>
                  <Ionicons name="person" size={14} color="#6B7280" />
                  <Text style={styles.infoValue}>{item.teacher}</Text>
                </View>
              </View>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Students</Text>
                <View style={styles.infoValueRow}>
                  <Ionicons name="people" size={14} color="#6B7280" />
                  <Text style={styles.infoValue}>{item.students} Total</Text>
                </View>
              </View>
            </View>

            <View style={styles.tagRow}>
              {item.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editBtn}>
                <Ionicons name="pencil" size={16} color="#374151" />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewBtn}>
                <Ionicons name="eye" size={18} color="#FFF" />
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 }, // Padding bottom for custom TabBar
  
  // Headers
  dateText: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 4 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  
  // Create Button
  createBtn: {
    backgroundColor: '#4461F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#4461F2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  createBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginLeft: 8 },

  // Section Header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  filterBtn: { flexDirection: 'row', alignItems: 'center' },
  filterText: { color: '#6B7280', fontSize: 14, marginLeft: 4, fontWeight: '500' },

  // Card Styles
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconWrapper: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  gradeText: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  subjectText: { fontSize: 14, color: '#6B7280' },
  
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  infoBlock: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  infoValueRow: { flexDirection: 'row', alignItems: 'center' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#111827', marginLeft: 6 },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { fontSize: 10, fontWeight: '700', color: '#4B5563' },

  actionRow: { flexDirection: 'row', gap: 12 },
  editBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  editBtnText: { fontSize: 16, fontWeight: '600', color: '#374151', marginLeft: 6 },
  viewBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#4461F2' },
  viewBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF', marginLeft: 6 },
});