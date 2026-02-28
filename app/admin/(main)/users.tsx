import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router'; 
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// --- Firebase Imports ---
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';

// --- Types ---
type IconName = keyof typeof Ionicons.glyphMap;

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  subjectColor: string;
  icon: IconName;
  status: string;
  avatar: string;
}

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Soft Flowing Background Lines */}
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>

    {/* Top Right: Cool Glassy Orbs (Blue & Lavender) */}
    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>

    {/* Middle Left: Floating Mint Bubble */}
    <View style={{ position: "absolute", top: 300, left: -40, opacity: 0.5 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Circle cx="40" cy="50" r="40" fill="#6EE7B7" opacity={0.4} />
        <Circle cx="60" cy="30" r="15" fill="#93C5FD" opacity={0.6} />
      </Svg>
    </View>

    {/* Bottom Right: Warm Sunrise Orbs (Peach & Soft Pink) */}
    <View style={{ position: "absolute", bottom: -50, right: -20, opacity: 0.6 }}>
      <Svg height="200" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="80" r="60" fill="#FDBA74" opacity={0.5} />
        <Circle cx="80" cy="40" r="30" fill="#FCA5A5" opacity={0.4} />
      </Svg>
    </View>

    {/* Floating Mini Bubbles */}
    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
    <View style={[styles.dot, { bottom: 120, left: 80, backgroundColor: "#F9A8D4", width: 10, height: 10, opacity: 0.8 }]} />
  </View>
);

// --- Main Component ---
export default function AdminUsersScreen() {
  const router = useRouter(); 
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teachers from Firebase
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "teacher"));
        const querySnapshot = await getDocs(q);
        
        const teachersList: Teacher[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          teachersList.push({
            id: doc.id,
            name: data.name || 'Unknown Teacher',
            email: data.email || 'No email provided',
            subject: data.subject || 'GENERAL',
            subjectColor: data.subjectColor || '#3B3CFF',
            icon: (data.icon as IconName) || 'book',
            status: data.status || 'offline',
            avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/png?seed=${data.name || doc.id}`,
          });
        });

        setTeachers(teachersList);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Handle Deleting a Teacher
  const handleDeleteTeacher = (id: string) => {
    Alert.alert(
      "Delete Teacher",
      "Are you sure you want to completely remove this teacher?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete from Firestore
              await deleteDoc(doc(db, "users", id));
              // Update local state to remove the deleted teacher from UI
              setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.id !== id));
            } catch (error) {
              console.error("Error deleting teacher:", error);
              Alert.alert("Error", "Could not delete the teacher. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView 
        contentContainerStyle={styles.contentContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Teachers</Text>
          <Text style={styles.subtitleText}>Manage all educator profiles</Text>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
          style={styles.addButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/admin/(user)/resigter')} 
        >
          <Ionicons name="person-add" size={20} color="#FFF" style={styles.addIcon} />
          <Text style={styles.addButtonText}>Add Teacher</Text>
        </TouchableOpacity>

        {/* Search and Filter Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search teachers..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="filter" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Teachers List / Loading State */}
        {loading ? (
          <ActivityIndicator size="large" color="#3B3CFF" style={{ marginTop: 40 }} />
        ) : teachers.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#6B7280' }}>
            No teachers found in the database.
          </Text>
        ) : (
          <View style={styles.listContainer}>
            {teachers.map((teacher) => (
              <TouchableOpacity 
                key={teacher.id} 
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => router.push({
                  pathname: '/admin/(user)/teacherdetails',
                  params: { id: teacher.id }
                })}
              >
                
                <View style={styles.detailsContainer}>
                  <Text style={styles.nameText}>{teacher.name}</Text>
                  <Text style={styles.emailText}>{teacher.email}</Text>
                </View>

                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={() => handleDeleteTeacher(teacher.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>

              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', 
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  dot: {
    position: 'absolute',
    borderRadius: 100,
  },
  headerSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
  },
  addButton: {
    backgroundColor: '#3B3CFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#3B3CFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  listContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  emailText: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
});