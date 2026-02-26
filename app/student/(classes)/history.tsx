import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';

// --- Firebase Imports ---
import { db } from "../../../firebase/firebaseConfig"; 
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

// --- Background Graphics ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#f1db90" opacity={0.5} />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" opacity={0.5} /> 
      </Svg>
    </View>
    <View style={{ position: "absolute", top: 220, right: 0, opacity: 0.2 }}>
        <Svg height="100" width="60" viewBox="0 0 60 100">
          <Path d="M10 10 Q 50 30 10 50 T 10 90" stroke="#FF8A65" strokeWidth="3" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.3 }}>
       <Svg height="150" width="300" viewBox="0 0 100 100">
         <Circle cx="20" cy="150" r="150" fill="#f39dbec9" />
       </Svg>
    </View>
    <View style={[styles.bgDot, { top: 120, right: 80, backgroundColor: "#657cff" }]} />
    <View style={[styles.bgDot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
  </View>
);

const FILTERS = ['All', 'Notices', 'Assignments', 'Resources'];

export default function HistoryScreen() {
  const { classId, className } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!classId) return;
      setLoading(true);
      try {
        const results: any[] = [];
        
        // Define collections to fetch from
        const collectionsToFetch = [
          { name: 'assignments', type: 'Assignment', icon: 'clipboard', color: '#2563EB', bg: '#DBEAFE' },
          { name: 'notices', type: 'Notice', icon: 'megaphone', color: '#D97706', bg: '#FEF3C7' },
          { name: 'resources', type: 'Resource', icon: 'library', color: '#059669', bg: '#D1FAE5' }
        ];

        for (const coll of collectionsToFetch) {
          const q = query(
            collection(db, coll.name),
            where("classId", "==", classId),
            orderBy("createdAt", "desc")
          );
          const snap = await getDocs(q);
          snap.forEach(doc => {
            const data = doc.data();
            results.push({
              id: doc.id,
              title: data.title || data.subject,
              subject: data.subject || '',
              time: data.createdAt?.toDate().toLocaleDateString() || 'Recently',
              type: coll.type,
              icon: coll.icon,
              iconColor: coll.color,
              iconBg: coll.bg,
              timestamp: data.createdAt?.toMillis() || 0
            });
          });
        }

        // Sort everything by newest first
        results.sort((a, b) => b.timestamp - a.timestamp);
        setHistoryData(results);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [classId]);

  const filteredData = historyData.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter.slice(0, -1);
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <View style={[styles.container, {justifyContent: 'center'}]}><ActivityIndicator size="large" color="#4461F2" /></View>;

  return (
    <View style={styles.container}>
      <BackgroundDecorations />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Classroom History</Text>
          <Text style={styles.pageSubtitle}>{className || 'Class Activity'}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginLeft: 12 }} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by name or subject..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterWrapper} contentContainerStyle={{ gap: 10, paddingRight: 20 }}>
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

        {/* Activity List */}
        <View style={styles.listContainer}>
          {filteredData.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No matching activities found</Text>
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

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 120 },
  bgDot: { position: "absolute", width: 12, height: 12, borderRadius: 6, opacity: 0.3 },
  pageHeader: { marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, fontWeight: '600', color: '#4461F2' },
  
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20
  },
  searchInput: { flex: 1, padding: 12, fontSize: 14, color: '#111827' },

  // Filter Styles
  filterWrapper: { marginBottom: 24 },
  filterPill: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  filterPillActive: { backgroundColor: '#4461F2', borderColor: '#4461F2' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  filterTextActive: { color: '#FFF' },

  // List Styles
  listContainer: { gap: 12 },
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 1 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  itemType: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  itemTime: { fontSize: 12, color: '#9CA3AF' },
  dotSeparator: { marginHorizontal: 6, color: '#9CA3AF' },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#9CA3AF', marginTop: 10 }
});