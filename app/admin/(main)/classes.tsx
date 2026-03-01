import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from "react-native-svg";

// --- Firebase Imports ---
import { collection, deleteDoc, doc, getCountFromServer, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';

// --- Types ---
interface Classroom {
  id: string;
  classCode: string;
  grade: string;
  subject: string;
  students: number;
  teacher?: string;
  icon?: string;
  iconColor?: string;
  iconBg?: string;
}

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

export default function AdminClassesScreen() {
  const router = useRouter();
  const [classes, setClasses] = useState<Classroom[]>([]);
  const [totalGlobalStudents, setTotalGlobalStudents] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // Fetch Classes and Student Counts
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch GLOBAL Total Students
      const globalStudentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));
      const globalSnapshot = await getCountFromServer(globalStudentsQuery);
      setTotalGlobalStudents(globalSnapshot.data().count);

      // 2. Fetch Classes
      const querySnapshot = await getDocs(collection(db, 'classes'));
      const classesList: Classroom[] = [];
      
      for (const document of querySnapshot.docs) {
        const data = document.data();
       const classStudentsQuery = query(
  collection(db, 'users'), 
  where('role', '==', 'student'), 
  where('classId', '==', document.id) 
);
        const countSnapshot = await getCountFromServer(classStudentsQuery);
        const actualStudentCount = countSnapshot.data().count;

        classesList.push({ 
          id: document.id, 
          ...data, 
          students: actualStudentCount // Override the database 'students' field with the real count
        } as Classroom);
      }
      
      setClasses(classesList);
    } catch (error) {
      console.error("Error fetching data: ", error);
      Alert.alert("Error", "Could not load data from database.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Class from Firestore
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Class",
      "Are you sure you want to delete this class? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              setLoading(true);
              await deleteDoc(doc(db, 'classes', id));
              setClasses((prev) => prev.filter((c) => c.id !== id));
              Alert.alert("Success", "Class has been deleted.");
            } catch (error) {
              console.error("Error deleting class:", error);
              Alert.alert("Error", "Failed to delete the class.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3B3CFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Manage Classes</Text>
          
          {/* New Global Students Stat Badge */}
          <View style={styles.globalStatBadge}>
             <Ionicons name="school" size={16} color="#3B3CFF" />
             <Text style={styles.globalStatText}>Total Registered Students: {totalGlobalStudents}</Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All Classrooms</Text>
          <TouchableOpacity style={styles.refreshBtn} onPress={loadData}>
            <Ionicons name="refresh" size={16} color="#4461F2" />
            <Text style={styles.refreshText}>Reload</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {classes.length > 0 ? (
            classes.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: item.iconBg || '#EEF2FF' }]}>
                    {item.icon ? (
                      <Ionicons name={item.icon as any} size={24} color={item.iconColor || '#3B3CFF'} />
                    ) : (
                      <Text style={[styles.avatarText, { color: item.iconColor || '#3B3CFF' }]}>
                        {item.grade ? item.grade.charAt(0) : 'C'}
                      </Text>
                    )}
                  </View>
                  <View style={styles.cardHeaderTexts}>
                    <Text style={styles.gradeText}>{item.grade || 'Unknown Grade'}</Text>
                    <Text style={styles.subjectText}>{item.subject || 'No Subject Assigned'}</Text>
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Ionicons name="qr-code-outline" size={14} color="#9CA3AF" />
                    <View style={styles.statTexts}>
                      <Text style={styles.statLabel}>Class Code</Text>
                      <Text style={styles.statValue}>{item.classCode || 'N/A'}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity 
                    style={styles.deleteBtn} 
                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons name="trash" size={16} color="#EF4444" />
                    <Text style={styles.deleteBtnText}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.viewBtn}
                    onPress={() => router.push({
                      pathname: '../notices',
                      params: { classId: item.id }
                    })}
                  >
                    <Ionicons name="eye" size={18} color="#FFF" />
                    <Text style={styles.viewBtnText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="file-tray-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No classes found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  dot: { 
    position: 'absolute', 
    borderRadius: 100 
  },
  container: { flex: 1, backgroundColor: '#ffffff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40 },
  headerSection: { marginBottom: 30 },
  pageTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 12 },
  globalStatBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  globalStatText: { marginLeft: 8, fontSize: 14, fontWeight: '700', color: '#3B3CFF' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  listTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  refreshText: { color: '#4461F2', fontSize: 14, marginLeft: 6, fontWeight: '600' },
  listContainer: { gap: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  iconContainer: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 18, fontWeight: 'bold' },
  cardHeaderTexts: { flex: 1 },
  gradeText: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 2 },
  subjectText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 4 },
  statBox: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  statTexts: { marginLeft: 10 },
  statLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' },
  statValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  deleteBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
  deleteBtnText: { marginLeft: 6, fontSize: 15, fontWeight: '700', color: '#EF4444' },
  viewBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: '#3B3CFF' },
  viewBtnText: { marginLeft: 6, fontSize: 15, fontWeight: '700', color: '#FFF' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 12, color: '#9CA3AF', fontSize: 16, fontWeight: '600' },
});