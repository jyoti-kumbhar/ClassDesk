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
    {/* Top Right Triangle/Shape */}
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#f1db90" />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" /> 
      </Svg>
    </View>

    {/* Squiggles */}
    <View style={{ position: "absolute", top: 220, right: 0, opacity: 0.4 }}>
        <Svg height="100" width="60" viewBox="0 0 60 100">
            <Path d="M10 10 Q 50 30 10 50 T 10 90" stroke="#FF8A65" strokeWidth="3" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", top: 180, left: -10, opacity: 0.3, transform: [{ rotate: '20deg' }] }}>
        <Svg height="60" width="100" viewBox="0 0 100 60">
            <Path d="M10 30 Q 30 10 50 30 T 90 30" stroke="#4461F2" strokeWidth="3" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", top: 380, right: 30, opacity: 0.25, transform: [{ rotate: '-15deg' }] }}>
         <Svg height="80" width="80" viewBox="0 0 80 80">
            <Path d="M10 40 Q 40 10 70 40 T 10 70" stroke="#FFB74D" strokeWidth="2" strokeDasharray="5, 5" fill="none" />
         </Svg>
    </View>
    <View style={{ position: "absolute", top: 450, left: -20, opacity: 0.2 }}>
         <Svg height="120" width="60" viewBox="0 0 60 120">
            <Path d="M30 10 Q 60 40 30 70 T 30 130" stroke="#4FC3F7" strokeWidth="4" fill="none" />
         </Svg>
    </View>

    {/* Top Left Yellow Circle */}
    <View style={[styles.bgCircle, { top: 40, left: -20, backgroundColor: "#f5d29d", width: 100, height: 100 }]} />
    
    {/* Scattered Dots */}
    <View style={[styles.bgDot, { top: 120, right: 80, backgroundColor: "#657cff" }]} />
    <View style={[styles.bgDot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
    <View style={[styles.bgDot, { bottom: 150, right: 20, backgroundColor: "#FF8A65" }]} />
    
    {/* Bottom Left Shapes */}
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="150" width="300" viewBox="0 0 100 100">
         <Circle cx="20" cy="150" r="150" fill="#f39dbec9" />
         <Path d="M60 80 L30 60 L50 90 Z" fill="#4481f2" opacity={1}/>
       </Svg>
    </View>

    {/* Bottom Right Corner */}
    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 150, height: 150, backgroundColor: "#63caf3", borderRadius: 60, opacity: 0.5 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 80, backgroundColor: "#e9967c", borderRadius: 40 }} />
    </View>
  </View>
);

const FILTERS = ['All', 'Notices', 'Assignments', 'Resources'];
const SECTIONS = ['All', 'A', 'B', 'C', 'D']; // Adjust based on your school's naming

export default function HistoryScreen() {
  const { classId, className } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSection, setActiveSection] = useState('All'); // New state for section
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!classId) return;
      setLoading(true);
      try {
        const results: any[] = [];
        
        const collectionsToFetch = [
          { name: 'assignments', type: 'Assignment', icon: 'clipboard', color: '#2563EB', bg: '#DBEAFE' },
          { name: 'notices', type: 'Notice', icon: 'megaphone', color: '#D97706', bg: '#FEF3C7' },
          { name: 'resources', type: 'Resource', icon: 'library', color: '#059669', bg: '#D1FAE5' }
        ];

        for (const coll of collectionsToFetch) {
          // Base query by classId
          let q = query(
            collection(db, coll.name),
            where("classId", "==", classId),
            orderBy("createdAt", "desc")
          );

          // Add Section filter to the query if a specific section is chosen
          if (activeSection !== 'All') {
            q = query(q, where("section", "==", activeSection));
          }

          const snap = await getDocs(q);
          snap.forEach(doc => {
            const data = doc.data();
            results.push({
              id: doc.id,
              title: data.title || data.subject || 'Untitled',
              subject: data.subject || '',
              section: data.section || 'N/A',
              time: data.createdAt?.toDate().toLocaleDateString() || 'Recently',
              type: coll.type,
              icon: coll.icon,
              iconColor: coll.color,
              iconBg: coll.bg,
              timestamp: data.createdAt?.toMillis() || 0
            });
          });
        }

        results.sort((a, b) => b.timestamp - a.timestamp);
        setHistoryData(results);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [classId, activeSection]); // Refetch when activeSection changes

  const filteredData = historyData.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.type === activeFilter.slice(0, -1);
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

        {/* Section Filter (New) */}
        <Text style={styles.filterLabel}>Filter by Section:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterWrapper} contentContainerStyle={{ gap: 10, paddingRight: 20 }}>
          {SECTIONS.map((sec) => (
            <TouchableOpacity 
              key={sec} 
              onPress={() => setActiveSection(sec)}
              style={[styles.sectionPill, activeSection === sec && styles.sectionPillActive]}
            >
              <Text style={[styles.sectionText, activeSection === sec && styles.filterTextActive]}>
                {sec === 'All' ? 'All Sections' : `Section ${sec}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Category Filter */}
        <Text style={styles.filterLabel}>Activity Type:</Text>
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
          {loading ? (
            <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 20 }} />
          ) : filteredData.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No activities found for this section</Text>
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
                    <Text style={[styles.itemType, { color: item.iconColor }]}>{item.type}</Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.itemTime}>Sec {item.section}</Text>
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
  bgDot: { position: "absolute", width: 12, height: 12, borderRadius: 6, opacity: 0.3 },
  bgCircle: { position: "absolute", borderRadius: 999 },
  pageHeader: { marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, fontWeight: '600', color: '#4461F2' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 20 },
  searchInput: { flex: 1, padding: 12, fontSize: 14, color: '#111827' },
  filterLabel: { fontSize: 12, fontWeight: '800', color: '#9CA3AF', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  filterWrapper: { marginBottom: 16 },
  filterPill: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB' },
  filterPillActive: { backgroundColor: '#4461F2', borderColor: '#4461F2' },
  sectionPill: { paddingHorizontal: 18, paddingVertical: 10, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionPillActive: { backgroundColor: '#10B981', borderColor: '#10B981' }, // Emerald for sections
  filterText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  sectionText: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
  filterTextActive: { color: '#FFF' },
  listContainer: { gap: 12 },
  historyCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, elevation: 1, borderWidth: 1, borderColor: '#F9FAFB' },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 2 },
  itemType: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  itemTime: { fontSize: 12, color: '#9CA3AF' },
  dotSeparator: { marginHorizontal: 6, color: '#D1D5DB' },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#9CA3AF', marginTop: 10, fontWeight: '600' }
});