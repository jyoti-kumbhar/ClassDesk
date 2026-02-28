import React, { useState, useEffect, useMemo } from 'react';
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

    <View style={{ position: "absolute", bottom: -50, right: -20, opacity: 0.6 }}>
      <Svg height="200" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="80" r="60" fill="#FDBA74" opacity={0.5} />
        <Circle cx="80" cy="40" r="30" fill="#FCA5A5" opacity={0.4} />
      </Svg>
    </View>

    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
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
        // 1. Single query to the "notices" collection
        const q = query(
          collection(db, 'notices'),
          where("classId", "==", classId),
          orderBy("createdAt", "desc")
        );
        
        const snap = await getDocs(q);
        const results: any[] = [];
        
        snap.forEach(doc => {
          const data = doc.data();
          
          // 2. Determine UI styling based on the "type" field
          let icon = 'megaphone';
          let iconColor = '#D97706';
          let iconBg = '#FEF3C7';
          let displayType = 'Notice';

          if (data.type === 'assignment') {
            icon = 'clipboard';
            iconColor = '#2563EB';
            iconBg = '#DBEAFE';
            displayType = 'Assignment';
          } else if (data.type === 'resource') {
            icon = 'library';
            iconColor = '#059669';
            iconBg = '#D1FAE5';
            displayType = 'Resource';
          }

          results.push({
            id: doc.id,
            title: data.title || data.subject || 'Untitled',
            subject: data.subject || '-',
            time: data.createdAt?.toDate().toLocaleDateString() || 'Recently',
            type: displayType,
            icon,
            iconColor,
            iconBg,
            timestamp: data.createdAt?.toMillis() || 0
          });
        });

        setHistoryData(results);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [classId]);

  // Memoize the filtered data
  const filteredData = useMemo(() => {
    return historyData.filter(item => {
      // Check if "All" is selected, OR if the item's displayType matches the filter (e.g., 'Assignment' vs 'Assignments')
      const matchesFilter = activeFilter === 'All' || item.type === activeFilter.slice(0, -1) || item.type === activeFilter;
      
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.subject.toLowerCase().includes(searchQuery.toLowerCase());
                            
      return matchesFilter && matchesSearch;
    });
  }, [historyData, activeFilter, searchQuery]);

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
            placeholder="Search by title or subject..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 20 }}>
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
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 120 },
  dot: { position: "absolute", borderRadius: 999 },
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