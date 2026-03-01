import { Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, Line, Path } from "react-native-svg";

// Firebase Imports
import {
  arrayUnion,
  collection,
  doc,
  getDoc, // ADDED: to fetch available sections
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';

const { width } = Dimensions.get('window');

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


export default function ClassHistoryScreen() {
  const params = useGlobalSearchParams();  
  const currentClassId = (params.id as string) || (params.classId as string) || (params.class_id as string) || ""; 
  const className = (params.grade as string) || (params.className as string) || 'Class History';  

  const [activeTab, setActiveTab] = useState('Notices');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  // ADDED: State for filtering by sections
  const [sections, setSections] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('All');

  // ADDED: Fetch available sections for this class
  useEffect(() => {
    const fetchSections = async () => {
      if (!currentClassId) return;
      try {
        const classRef = doc(db, "classes", currentClassId);
        const classSnap = await getDoc(classRef);
        if (classSnap.exists() && classSnap.data().sections) {
          setSections(classSnap.data().sections);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    fetchSections();
  }, [currentClassId]);

  // 1. Listen for data updates based on the current class ID & Section filter
  useEffect(() => {
    if (!currentClassId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    let queryType = "notice"; 
    if (activeTab === 'Assignments') queryType = "assignment";
    if (activeTab === 'Resources') queryType = "resource";

    // Build query constraints dynamically to handle the optional section
    const queryConstraints: any[] = [
      where("classId", "==", currentClassId),
      where("type", "==", queryType)
    ];

    if (selectedSection !== 'All') {
      queryConstraints.push(where("section", "==", selectedSection));
    }

    queryConstraints.push(orderBy("createdAt", "desc"));

    const q = query(collection(db, "notices"), ...queryConstraints);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(data);
      setLoading(false);
    }, (error) => {
      console.error("Fetch error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentClassId, activeTab, selectedSection]); // Trigger refresh when section changes

  // 2. Add section to the specific class document
  const handleCreateSection = async () => {
    if (!currentClassId) {
      Alert.alert("Error", "Class identification lost. Cannot add section.");
      return;
    }

    if (!newSectionName.trim()) {
      Alert.alert("Error", "Please enter a section name.");
      return;
    }

    try {
      const classRef = doc(db, "classes", currentClassId);
      await updateDoc(classRef, {
        sections: arrayUnion(newSectionName.trim())
      });

      // Optimistically add to UI list without reloading
      setSections(prev => prev.includes(newSectionName.trim()) ? prev : [...prev, newSectionName.trim()]);
      Alert.alert("Success", `Section "${newSectionName}" added to this class.`);
      setNewSectionName('');
      setCreateModalVisible(false);
    } catch (error) {
      console.error("Error adding section:", error);
      Alert.alert("Error", "Could not save section. Ensure the class document exists.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.mainContainer}>
      <BackgroundDecorations />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>{className}</Text>
          <Text style={styles.subTitle}>Classroom Activity History</Text>
        </View>

        <View style={styles.toggleContainer}>
          {['Notices', 'Assignments', 'Resources'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.toggleBtn, activeTab === tab && styles.toggleBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.toggleText, activeTab === tab && styles.toggleTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ADDED: Section Filter List */}
        {sections.length > 0 && (
          <View style={styles.sectionFilterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              <TouchableOpacity
                style={[styles.sectionPill, selectedSection === 'All' && styles.sectionPillActive]}
                onPress={() => setSelectedSection('All')}
              >
                <Text style={[styles.sectionPillText, selectedSection === 'All' && styles.sectionPillTextActive]}>All Sections</Text>
              </TouchableOpacity>
              
              {sections.map(sec => (
                <TouchableOpacity
                  key={sec}
                  style={[styles.sectionPill, selectedSection === sec && styles.sectionPillActive]}
                  onPress={() => setSelectedSection(sec)}
                >
                  <Text style={[styles.sectionPillText, selectedSection === sec && styles.sectionPillTextActive]}>Section {sec}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {loading ? (
            <ActivityIndicator size="large" color="#3B3CFF" style={{marginTop: 40}} />
        ) : (
            <View style={styles.listContainer}>
              {!currentClassId && <Text style={styles.errorText}>Class ID not found. Return to classes and try again.</Text>}
              {currentClassId && items.length === 0 && <Text style={styles.emptyText}>No {activeTab.toLowerCase()} found for this selection.</Text>}
              {items.map((item) => (
                <TouchableOpacity key={item.id} style={styles.card} onPress={() => setSelectedItem(item)}>
                  <View style={styles.cardTopRow}>
                    <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                      <Ionicons name={item.type === 'assignment' ? 'clipboard-outline' : 'document-text-outline'} size={24} color="#3B3CFF" />
                    </View>
                    <View style={styles.cardTextContainer}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        {item.section && <Text style={styles.sectionBadge}>Sec {item.section}</Text>}
                      </View>
                      <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                      <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setCreateModalVisible(true)}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Modal for adding sections */}
      <Modal visible={isCreateModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.smallModalContainer}>
            <Text style={styles.modalTitle}>Add New Section</Text>
            <TextInput 
              style={styles.input}
              placeholder="e.g. A"
              value={newSectionName}
              onChangeText={setNewSectionName}
              autoCapitalize="characters"
            />
            <View style={styles.modalActionRow}>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateSection} style={styles.createBtn}>
                <Text style={styles.createBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Detail View Modal */}
      <Modal visible={selectedItem !== null} animationType="slide" transparent>
        <View style={styles.fullScreenOverlay}>
            <View style={styles.fullScreenContainer}>
                {selectedItem && (
                    <>
                        <View style={styles.fsHeader}>
                            <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color="#111827" />
                            </TouchableOpacity>
                            <Text style={styles.fsTypeHeader}>{selectedItem.type?.toUpperCase()}</Text>
                            <View style={{width: 30}} />
                        </View>
                        <ScrollView contentContainerStyle={{padding: 24}}>
                            <Text style={styles.fsTitle}>{selectedItem.title}</Text>
                            <Text style={styles.dateText}>Posted on {formatDate(selectedItem.createdAt)}</Text>
                            <View style={styles.divider} />
                            <Text style={styles.fsDesc}>{selectedItem.description}</Text>
                            {selectedItem.link && (
                              <TouchableOpacity style={styles.linkBtn} onPress={() => Linking.openURL(selectedItem.link)}>
                                <Ionicons name="open-outline" size={20} color="#FFF" style={{marginRight: 8}} />
                                <Text style={styles.linkBtnText}>Open Attachment</Text>
                              </TouchableOpacity>
                            )}
                        </ScrollView>
                    </>
                )}
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#ffffff' },
  scrollView: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },
  headerSection: { marginBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subTitle: { fontSize: 14, color: '#6B7280' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 16 }, // Tweaked margin
  toggleBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  toggleBtnActive: { backgroundColor: '#FFF', elevation: 2 },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  toggleTextActive: { color: '#111827' },
  
  // ADDED: Styles for Section Filter
  sectionFilterContainer: { marginBottom: 24, flexDirection: 'row' },
  sectionPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  sectionPillActive: { backgroundColor: '#EEF2FF', borderColor: '#3B3CFF' },
  sectionPillText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  sectionPillTextActive: { color: '#3B3CFF' },

  listContainer: { gap: 16 },
  emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 20 },
  errorText: { textAlign: 'center', color: '#EF4444', marginTop: 20, fontWeight: '600' },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, elevation: 2, borderWidth: 1, borderColor: '#F3F4F6' },
  cardTopRow: { flexDirection: 'row' },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  sectionBadge: { fontSize: 10, color: '#3B3CFF', fontWeight: '700', backgroundColor: '#EEF2FF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  cardDesc: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  dateText: { fontSize: 11, color: '#9CA3AF', marginTop: 8 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#3B3CFF', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  smallModalContainer: { width: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: '#111827' },
  input: { backgroundColor: '#F3F4F6', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 20 },
  modalActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelBtnText: { color: '#6B7280', fontWeight: '600' },
  createBtn: { backgroundColor: '#3B3CFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
  createBtnText: { color: '#FFF', fontWeight: '600' },
  fullScreenOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  fullScreenContainer: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '90%' },
  fsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  closeBtn: { padding: 4, backgroundColor: '#F3F4F6', borderRadius: 20 },
  fsTypeHeader: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  fsTitle: { fontSize: 24, fontWeight: '800', color: '#111827' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 },
  fsDesc: { fontSize: 16, color: '#374151', lineHeight: 24 },
  linkBtn: { backgroundColor: '#3B3CFF', flexDirection: 'row', padding: 15, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  linkBtnText: { color: '#FFF', fontWeight: '700', marginLeft: 8 }
});