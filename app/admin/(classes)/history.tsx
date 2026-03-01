import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';

// --- Firebase Imports ---
import { db } from "../../../firebase/firebaseConfig"; 
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from "firebase/firestore";

// --- Background Graphics ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: 30, right: -40 }}>
      <Svg height="200" width="200" viewBox="0 0 200 200">
        <Circle cx="100" cy="100" r="80" fill="#F3E8FF" opacity={0.6} />
        <Circle cx="100" cy="100" r="50" fill="#E9D5FF" opacity={0.4} />
      </Svg>
    </View>
    <View style={{ position: "absolute", bottom: 40, right: -20, opacity: 0.9 }}>
      <Svg height="220" width="220" viewBox="0 0 200 200">
        <Circle cx="200" cy="200" r="150" fill="#fdf0fd" />
        <Path d="M 100 200 Q 120 120 200 100" stroke="#fbccf9" strokeWidth="30" strokeLinecap="round" fill="none" />
      </Svg>
    </View>
  </View>
);

const FILTERS = ['All', 'Notices', 'Assignments', 'Resources'];

export default function HistoryScreen() {
  const { classId, className } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sections, setSections] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [historyData, setHistoryData] = useState<any[]>([]);

  // 1. Fetch available sections for this class from the 'classes' collection
  useEffect(() => {
    const fetchClassSections = async () => {
      if (!classId) return;
      try {
        const classRef = doc(db, 'classes', classId as string);
        const classSnap = await getDoc(classRef);
        if (classSnap.exists()) {
          const data = classSnap.data();
          const availableSections = data.sections || (data.section ? [data.section] : []);
          setSections(availableSections);
          if (availableSections.length > 0) setSelectedSection(availableSections[0]);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchClassSections();
  }, [classId]);

  // 2. Fetch History filtered by Class, Tab, and Section
  useEffect(() => {
    if (!classId || !selectedSection) return;
    setLoading(true);

    const baseCol = collection(db, 'notices');
    let q;

    if (activeFilter === 'All') {
      q = query(
        baseCol, 
        where("classId", "==", classId), 
        where("section", "==", selectedSection),
        orderBy("createdAt", "desc")
      );
    } else {
      const typeFilter = activeFilter.slice(0, -1).toLowerCase(); 
      q = query(
        baseCol, 
        where("classId", "==", classId), 
        where("type", "==", typeFilter), 
        where("section", "==", selectedSection),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snap) => {
      const results: any[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        let config = { icon: 'megaphone', color: '#D97706', bg: '#FEF3C7', label: 'Notice' };

        if (data.type === 'assignment') {
          config = { icon: 'clipboard', color: '#2563EB', bg: '#DBEAFE', label: 'Assignment' };
        } else if (data.type === 'resource') {
          config = { icon: 'library', color: '#059669', bg: '#D1FAE5', label: 'Resource' };
        }

        results.push({
          id: doc.id,
          title: data.title || data.subject || 'Untitled',
          subject: data.subject || '-',
          section: data.section,
          time: data.createdAt?.toDate().toLocaleDateString() || 'Recently',
          type: config.label,
          icon: config.icon,
          iconColor: config.color,
          iconBg: config.bg,
          timestamp: data.createdAt?.toMillis() || 0
        });
      });
      setHistoryData(results);
      setLoading(false);
    }, (error) => {
      console.error("Fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [classId, activeFilter, selectedSection]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return historyData;
    return historyData.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [historyData, searchQuery]);

  return (
    <View style={styles.container}>
      <BackgroundDecorations />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Classroom History</Text>
          <Text style={styles.pageSubtitle}>{className || 'Class Activity'}</Text>
        </View>

        {/* Section Selector */}
        <Text style={styles.filterLabel}>Select Section</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterWrapper} contentContainerStyle={{ gap: 10 }}>
          {sections.map((sec) => (
            <TouchableOpacity 
              key={sec} 
              onPress={() => setSelectedSection(sec)}
              style={[styles.sectionChip, selectedSection === sec && styles.sectionChipActive]}
            >
              <Text style={[styles.sectionChipText, selectedSection === sec && styles.sectionChipTextActive]}>
                Section {sec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginLeft: 12 }} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search activity..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {FILTERS.map((filter) => (
              <TouchableOpacity 
                key={filter} 
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
              >
                <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.listContainer}>
            {filteredData.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>No activities found for Section {selectedSection}</Text>
              </View>
            ) : (
              filteredData.map((item) => (
                <TouchableOpacity key={item.id} style={styles.historyCard} activeOpacity={0.7}>
                  <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon as any} size={22} color={item.iconColor} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.itemType}>{item.type}</Text>
                      <Text style={styles.dotSeparator}>•</Text>
                      <Text style={styles.itemTime}>{item.time}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 120 },
  pageHeader: { marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, fontWeight: '600', color: '#4461F2' },
  filterLabel: { fontSize: 12, fontWeight: '700', color: '#9CA3AF', marginBottom: 8, textTransform: 'uppercase' },
  sectionChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  sectionChipActive: { backgroundColor: '#EEF2FF', borderColor: '#4461F2' },
  sectionChipText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  sectionChipTextActive: { color: '#4461F2' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginVertical: 20 },
  searchInput: { flex: 1, padding: 12, fontSize: 14, color: '#111827' },
  filterWrapper: { marginBottom: 15 },
  filterPill: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  filterPillActive: { backgroundColor: '#4461F2', borderColor: '#4461F2' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  filterTextActive: { color: '#FFF' },
  listContainer: { gap: 12 },
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 1, borderWidth: 1, borderColor: '#F9FAFB' },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  itemType: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  itemTime: { fontSize: 12, color: '#9CA3AF' },
  dotSeparator: { marginHorizontal: 6, color: '#9CA3AF' },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#9CA3AF', marginTop: 10 }
});