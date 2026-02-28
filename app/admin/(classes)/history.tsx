import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';

// --- Firebase Imports ---
import { db } from "../../../firebase/firebaseConfig"; 
// Swapped getDocs for onSnapshot
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

const { width } = Dimensions.get('window');

// --- Background Graphics ---
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
        <Path d="M 100 200 Q 120 120 200 100" stroke="#fbccf9" strokeWidth="30" strokeLinecap="round" fill="none" />
        <Path d="M 40 130 Q 70 80 100 130 T 160 130" stroke="#c7bdf1" strokeWidth="3" strokeLinecap="round" fill="none" />
        <Circle cx="80" cy="180" r="4" fill="#93C5FD" />
        <Circle cx="180" cy="150" r="3" fill="#93C5FD" />
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
  const [historyData, setHistoryData] = useState<any[]>([]);

  // --- Optimized Data Fetching ---
  useEffect(() => {
    if (!classId) return;
    setLoading(true);

    // 1. Build Query dynamically based on the selected tab
    let q;
    const baseCol = collection(db, 'notices');

    if (activeFilter === 'All') {
      q = query(baseCol, where("classId", "==", classId), orderBy("createdAt", "desc"));
    } else {
      // Convert UI tab string ('Assignments') to DB value ('assignment')
      const typeFilter = activeFilter.slice(0, -1).toLowerCase(); 
      q = query(baseCol, where("classId", "==", classId), where("type", "==", typeFilter), orderBy("createdAt", "desc"));
    }

    // 2. Real-time caching listener
    const unsubscribe = onSnapshot(q, (snap) => {
      const results: any[] = [];
      
      snap.forEach(doc => {
        const data = doc.data();
        
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
      setLoading(false);
    }, (error) => {
      console.error("Error fetching history:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [classId, activeFilter]); // Re-runs instantly when tab changes!

  // Only apply Text Search locally now
  const filteredData = useMemo(() => {
    if (!searchQuery) return historyData;
    return historyData.filter(item => {
      return item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [historyData, searchQuery]);

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
        {loading ? (
           <ActivityIndicator size="large" color="#4461F2" style={{marginTop: 40}} />
        ) : (
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
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' }, // Updated base color to match theme
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 120 },
  dot: { position: "absolute", borderRadius: 999 },
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