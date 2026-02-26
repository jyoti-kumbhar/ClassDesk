import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import Svg, { Path, Circle } from 'react-native-svg';

// --- Firebase Imports ---
import { auth, db } from "../../../firebase/firebaseConfig"; 
import { doc, getDoc, collection, query, where, getDocs, documentId } from "firebase/firestore";

// --- Background Decoration Component ---
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

export default function ClassesScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedClasses = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // 1. Fetch user document to get IDs of classes they joined
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const joinedClassIds = userDoc.data()?.joinedClasses || [];

        if (joinedClassIds.length === 0) {
          setClasses([]);
          setLoading(false);
          return;
        }

        // 2. Query classes collection for documents matching those IDs
        const classesRef = collection(db, "classes");
        const q = query(classesRef, where(documentId(), "in", joinedClassIds));
        const querySnapshot = await getDocs(q);
        
        const fetchedClasses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setClasses(fetchedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedClasses();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.flexCenter]}>
        <ActivityIndicator size="large" color="#4461F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>My Classes</Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{classes.length} Enrolled</Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter" size={16} color="#6B7280" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {classes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyText}>You have not joined any classes yet.</Text>
          </View>
        ) : (
          classes.map((item) => (
            <View key={item.id} style={styles.card}>
              
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={[styles.iconWrapper, { backgroundColor: item.iconBg || '#EEF2FF' }]}>
                  <Ionicons name={(item.icon || 'book') as any} size={24} color={item.iconColor || '#4461F2'} />
                </View>
                <View>
                  <Text style={styles.gradeText}>{item.grade || item.subject}</Text>
                </View>
              </View>

              {/* Info Row with Clickable Students Section */}
              <View style={styles.infoRow}>
                <TouchableOpacity 
                  style={styles.infoBlock} 
                  activeOpacity={0.6}
                  onPress={() => router.push({
                    pathname: "/student/members",
                    params: { classId: item.id, className: item.grade || item.subject }
                  })}
                >
                  <Text style={styles.infoLabel}>Students</Text>
                  <View style={styles.infoValueRow}>
                    <Ionicons name="people" size={14} color="#4461F2" />
                    <Text style={[styles.infoValue, { color: '#4461F2' }]}>View Members</Text>
                    <Ionicons name="chevron-forward" size={12} color="#4461F2" style={{ marginLeft: 2 }} />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Tags Section */}
              <View style={styles.tagRow}>
                {(item.tags || [item.subject || 'Class']).map((tag: string, idx: number) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
                  </View>
                ))}
              </View>

              {/* View Course Button - UPDATED SECTION */}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.viewBtn}
                  onPress={() => router.push({
                    pathname: "/student/(classes)/notices",
                    params: {
                      id: item.id,
                      grade: item.grade || item.subject,
                      subject: item.subject || 'General'
                    }
                  })}
                >
                  <Ionicons name="open-outline" size={18} color="#FFF" />
                  <Text style={styles.viewBtnText}>Enter Classroom</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF9F0' },
  flexCenter: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 100 }, 
  dot: { position: 'absolute', borderRadius: 100 },
  pageTitle: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
  filterBtn: { flexDirection: 'row', alignItems: 'center' },
  filterText: { color: '#6B7280', fontSize: 14, marginLeft: 4, fontWeight: '500' },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconWrapper: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  gradeText: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  classCodeText: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', letterSpacing: 1 },
  infoRow: { flexDirection: 'row', marginBottom: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F3F4F6', paddingVertical: 15 },
  infoBlock: { flex: 1 },
  infoLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValueRow: { flexDirection: 'row', alignItems: 'center' },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#111827', marginLeft: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: { backgroundColor: '#F3F4F6', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: '800', color: '#6B7280' },
  actionRow: { flexDirection: 'row' },
  viewBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: '#4461F2', shadowColor: "#4461F2", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  viewBtnText: { fontSize: 15, fontWeight: '700', color: '#FFF', marginLeft: 8 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 15, color: '#9CA3AF', fontSize: 16, fontWeight: '500' },
});