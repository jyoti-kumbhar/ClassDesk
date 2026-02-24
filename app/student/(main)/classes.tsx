import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>

    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>

    <View style={{ position: "absolute", top: 300, left: -40, opacity: 0.5 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Circle cx="40" cy="50" r="40" fill="#6EE7B7" opacity={0.4} />
        <Circle cx="60" cy="30" r="15" fill="#93C5FD" opacity={0.6} />
      </Svg>
    </View>

    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
  </View>
);

const CLASS_DATA = [
  { id: 1, grade: 'Grade 10 - A', students: 35, tags: ['MATHEMATICS', 'SCIENCE'], icon: 'flask', iconColor: '#4461F2', iconBg: '#EEF2FF' },
  { id: 2, grade: 'Grade 11 - B', students: 28, tags: ['ENGLISH', 'ARTS'], icon: 'globe-outline', iconColor: '#D97706', iconBg: '#FEF3C7' },
  { id: 3, grade: 'Grade 9 - C', students: 42, tags: ['HISTORY', 'GEOGRAPHY'], icon: 'time-outline', iconColor: '#059669', iconBg: '#D1FAE5' }
];

export default function ClassesScreen() {
  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>All Classes </Text>

        <View style={styles.sectionHeader}>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter" size={16} color="#6B7280" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {CLASS_DATA.map((item) => (
          <View key={item.id} style={styles.card}>
            
            <View style={styles.cardHeader}>
              <View style={[styles.iconWrapper, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon as any} size={24} color={item.iconColor} />
              </View>
              <View>
                <Text style={styles.gradeText}>{item.grade}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Students</Text>
                <View style={styles.infoValueRow}>
                  <Ionicons name="people" size={14} color="#6B7280" />
                  <Text style={styles.infoValue}>{item.students} Enrolled</Text>
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
              <TouchableOpacity style={styles.viewBtn}>
                <Ionicons name="eye" size={18} color="#FFF" />
                <Text style={styles.viewBtnText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 100 }, 
  dot: { position: 'absolute', borderRadius: 100 },
  dateText: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 4 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  filterBtn: { flexDirection: 'row', alignItems: 'center' },
  filterText: { color: '#6B7280', fontSize: 14, marginLeft: 4, fontWeight: '500' },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconWrapper: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  gradeText: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  infoRow: { flexDirection: 'row', marginBottom: 15 },
  infoBlock: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#9CA3AF', marginBottom: 4 },
  infoValueRow: { flexDirection: 'row', alignItems: 'center' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#111827', marginLeft: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { backgroundColor: 'rgba(243, 244, 246, 0.8)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagText: { fontSize: 10, fontWeight: '700', color: '#4B5563' },
  actionRow: { flexDirection: 'row' },
  viewBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, backgroundColor: '#4461F2' },
  viewBtnText: { fontSize: 16, fontWeight: '600', color: '#FFF', marginLeft: 6 },
});