import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- Mock Data ---
const CLASS_DATA = [
  { id: 1, grade: 'Grade 10 - A', subject: 'Advanced Mathematics', teacher: 'Robert Fox', students: 35, tags: ['MATHEMATICS', 'SCIENCE'], icon: 'flask', iconColor: '#4461F2', iconBg: '#EEF2FF' },
  { id: 2, grade: 'Grade 11 - B', subject: 'Literature & Grammar', teacher: 'Jenny Wilson', students: 28, tags: ['ENGLISH', 'ARTS'], icon: 'globe-outline', iconColor: '#D97706', iconBg: '#FEF3C7' },
  { id: 3, grade: 'Grade 9 - C', subject: 'Modern World History', teacher: 'Guy Hawkins', students: 42, tags: ['HISTORY', 'GEOGRAPHY'], icon: 'time-outline', iconColor: '#059669', iconBg: '#D1FAE5' }
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

export default function ClassesScreen() {
  return (
    <View style={styles.container}>
      
      {/* Integrated Background */}
      <BackgroundDecorations />

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
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 }, 
  
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