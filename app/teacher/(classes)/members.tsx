import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line } from "react-native-svg";
import { useLocalSearchParams } from 'expo-router';

// Firebase Imports
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc
} from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

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
        <Path d="M 100 200 Q 120 120 200 100" stroke="#fbccf9" strokeWidth="30" strokeLinecap="round" fill="none" />
        <Path d="M 40 130 Q 70 80 100 130 T 160 130" stroke="#c7bdf1" strokeWidth="3" strokeLinecap="round" fill="none" />
        <Circle cx="80" cy="180" r="4" fill="#93C5FD" />
        <Circle cx="180" cy="150" r="3" fill="#93C5FD" />
      </Svg>
    </View>
  </View>
);

export default function ClassMembersScreen() {
  const params = useLocalSearchParams();
  const currentClassId = (params.id as string) || 'default-id';
  const className = (params.grade as string) || 'Grade 10-A';

  // State
  const [activeTab, setActiveTab] = useState<'Teachers' | 'Students'>('Teachers');
  
  // We only need one array now, because we only fetch the active tab!
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search State for Students tab
  const [searchQuery, setSearchQuery] = useState("");

  // --- 1. Connect & Fetch Members (OPTIMIZED) ---
  useEffect(() => {
    setLoading(true);
    
    // Map UI Tab to Database Role
    const queryRole = activeTab === 'Teachers' ? 'teacher' : 'student';

    const q = query(
      collection(db, "classMembers"), 
      where("classId", "==", currentClassId),
      where("role", "==", queryRole) // <-- Only fetch the role we need!
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMembers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMembers(fetchedMembers);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching members:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentClassId, activeTab]); // <-- Reruns whenever tab changes

  // --- 2. Delete Member Logic ---
  const handleDelete = (memberId: string, memberName: string) => {
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${memberName} from this class?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "classMembers", memberId));
            } catch {
              Alert.alert("Error", "Could not remove member.");
            }
          }
        }
      ]
    );
  };

  // --- FILTER LOGIC ---
  // Only applies to the list currently stored in state
  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true;
    const name = (member.name || "").toLowerCase();
    return name.includes(searchQuery.toLowerCase().trim());
  });

  return (
    <View style={styles.mainContainer}>
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Class Members</Text>
          <Text style={styles.subTitle}>
            {activeTab === 'Teachers' 
              ? `${className} • FACULTY` 
              : `${className} • STUDENTS`}
          </Text>
        </View>

        {/* Toggle Switch */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'Teachers' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('Teachers')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, activeTab === 'Teachers' && styles.toggleTextActive]}>
              Teachers
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.toggleBtn, activeTab === 'Students' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('Students')}
            activeOpacity={0.8}
          >
            <Text style={[styles.toggleText, activeTab === 'Students' && styles.toggleTextActive]}>
              Students
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
            <ActivityIndicator size="large" color="#3B3CFF" style={{ marginTop: 40 }} />
        ) : (
            <>
                {/* --- TEACHERS VIEW --- */}
                {activeTab === 'Teachers' && (
                  <View style={styles.tabContent}>
                    <Text style={styles.sectionTitle}>FACULTY MEMBERS</Text>

                    <View style={styles.listContainer}>
                      {filteredMembers.map((teacher) => (
                        <View key={teacher.id} style={styles.memberCard}>
                          <View style={[styles.avatarBox, { backgroundColor: '#E0E7FF' }]}>
                            {teacher.avatar ? (
                                <Image source={{ uri: teacher.avatar }} style={styles.avatarImg} />
                            ) : (
                                <Text style={styles.avatarInitials}>
                                  {teacher.name ? teacher.name.substring(0, 2).toUpperCase() : 'T'}
                                </Text>
                            )}
                          </View>
                          
                          <View style={styles.memberDetails}>
                            <Text style={styles.memberName}>{teacher.name}</Text>
                            <Text style={styles.memberRole}>{teacher.email}</Text>
                          </View>

                          <TouchableOpacity 
                            style={styles.deleteBtn}
                            onPress={() => handleDelete(teacher.id, teacher.name)}
                          >
                            <Ionicons name="trash" size={18} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      {filteredMembers.length === 0 && <Text style={styles.emptyText}>No teachers added yet.</Text>}
                    </View>
                  </View>
                )}

                {/* --- STUDENTS VIEW --- */}
                {activeTab === 'Students' && (
                  <View style={styles.tabContent}>
                    
                    <View style={styles.searchRow}>
                      <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                        <TextInput 
                          style={styles.searchInput}
                          placeholder="Search student..."
                          placeholderTextColor="#9CA3AF"
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                          <TouchableOpacity onPress={() => setSearchQuery("")}>
                              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    <View style={styles.listContainer}>
                      {filteredMembers.map((student) => (
                        <View key={student.id} style={styles.memberCard}>
                          
                          {student.avatar ? (
                            <View style={[styles.avatarBox, { backgroundColor: '#F3F4F6' }]}>
                              <Image source={{ uri: student.avatar }} style={styles.avatarImg} />
                            </View>
                          ) : (
                            <View style={[styles.avatarBox, { backgroundColor: '#F3F4F6' }]}>
                              <Text style={styles.avatarInitials}>
                                  {student.name ? student.name.substring(0, 2).toUpperCase() : 'ST'}
                              </Text>
                            </View>
                          )}
                          
                          <View style={styles.memberDetails}>
                            <Text style={styles.memberName}>{student.name}</Text>
                            <Text style={styles.memberRole}>{student.email}</Text>
                          </View>

                          <TouchableOpacity 
                            style={styles.deleteBtn}
                            onPress={() => handleDelete(student.id, student.name)}
                          >
                            <Ionicons name="trash" size={18} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      {filteredMembers.length === 0 && (
                        <Text style={styles.emptyText}>
                            {searchQuery ? "No matching students found." : "No students joined yet."}
                        </Text>
                      )}
                    </View>

                  </View>
                )}
            </>
        )}

      </ScrollView>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
    fontStyle: 'italic'
  },
  
  // Header
  headerSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Toggle Switch
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#3B3CFF',
  },

  tabContent: {
    flex: 1,
  },

  // Teachers View specific
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 16,
  },

  // Students View Specific
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },

  // Common List/Card Styles
  listContainer: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  memberDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});