import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// --- Firebase Imports ---
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg height="100%" width="100%">
      <Circle cx="-10%" cy="-5%" r="45%" fill="#E0E7FF" opacity={0.6} />
      <Circle cx="110%" cy="20%" r="40%" fill="#DBEAFE" opacity={0.5} />
      <Circle cx="50%" cy="80%" r="50%" fill="#F3E8FF" opacity={0.5} />
      <Circle cx="10%" cy="100%" r="35%" fill="#EDE9FE" opacity={0.6} />
    </Svg>
  </View>
);

const DetailsTopBar = () => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={26} color="#111827" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Teacher Details</Text>
      <View style={{ width: 26 }} />
    </View>
  );
};

export default function TeacherDetailsScreen() {
  const { id: teacherId } = useLocalSearchParams(); 
  
  // State
  const [teacher, setTeacher] = useState<any>(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);

  // 1. Fetch Teacher Details on load
  useEffect(() => {
    const fetchData = async () => {
      if (!teacherId) return;

      try {
        // Fetch specific teacher
        const teacherDoc = await getDoc(doc(db, "users", teacherId as string));
        if (teacherDoc.exists()) {
          setTeacher(teacherDoc.data());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Could not load teacher details.");
      } finally {
        setLoadingTeacher(false);
      }
    };

    fetchData();
  }, [teacherId]);

  if (loadingTeacher) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3B3CFF" />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <BackgroundDecorations />
      <DetailsTopBar />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Teacher Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.teacherName}>{teacher?.name || 'Unknown'}</Text>
          <Text style={styles.teacherEmail}>{teacher?.email || 'No email'}</Text>
        </View>

        {/* Classes List Header */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle}>Joined Classes</Text>
          <View style={styles.activePill}>
            <Text style={styles.activePillText}>Active</Text>
          </View>
        </View>

        {/* Placeholder for Assigned Classes */}
        <View style={styles.listContainer}>
           <Text style={{color: '#6B7280', fontStyle: 'italic'}}>No classes currently assigned.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 50 : 60, paddingBottom: 20 },
  backButton: { padding: 4, marginLeft: -4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  contentContainer: { paddingHorizontal: 20, paddingBottom: 40 }, // Reduced bottom padding since button is gone
  infoSection: { marginBottom: 32, marginTop: 10 },
  teacherName: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 4 },
  teacherEmail: { fontSize: 15, color: '#6B7280', marginBottom: 16 },
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  activePill: { backgroundColor: 'rgba(59, 60, 255, 0.1)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12 },
  activePillText: { fontSize: 12, fontWeight: '700', color: '#3B3CFF' },
  listContainer: { gap: 16 },
});