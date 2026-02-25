import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Modal,
  Linking,
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
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; 

const { width, height } = Dimensions.get('window');

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
  </View>
);

export default function ClassHistoryScreen() {
  // 1. Get Class Details
  const params = useLocalSearchParams();
  const currentClassId = (params.id as string) || 'default-id';
  const className = (params.grade as string) || 'Class History';
  
  // State
  const [activeTab, setActiveTab] = useState('Resources');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // 2. Fetch Data from Database
  useEffect(() => {
    const q = query(
      collection(db, "notices"), 
      where("classId", "==", currentClassId),
      orderBy("createdAt", "desc")
    );

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
  }, [currentClassId]);

  // Filter lists based on the 'notices' collection 'type' field
  const resourcesList = items.filter(i => i.type === 'resource');
  const assignmentsList = items.filter(i => i.type === 'assignment');
  const noticesList = items.filter(i => i.type === 'notice');

  // 5. Allow Resource Download
  const handleDownload = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => Alert.alert("Error", "Could not open link."));
    } else {
      Alert.alert("No Attachment", "There is no file or link attached.");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <View style={styles.mainContainer}>
      <BackgroundDecorations />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>{className}</Text>
          <Text style={styles.subTitle}>Classroom Activity History</Text>
        </View>

        {/* 3. Toggle Switch */}
        <View style={styles.toggleContainer}>
          {['Notices', 'Assignments', 'Resources'].map((tab) => (
            <TouchableOpacity 
              key={tab}
              style={[styles.toggleBtn, activeTab === tab && styles.toggleBtnActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.toggleText, activeTab === tab && styles.toggleTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- CONTENT AREA --- */}
        {loading ? (
            <ActivityIndicator size="large" color="#3B3CFF" style={{marginTop: 40}} />
        ) : (
            <>
                {/* Resources Tab */}
                {activeTab === 'Resources' && (
                  <View style={styles.listContainer}>
                    {resourcesList.length === 0 && <Text style={styles.emptyText}>No resources shared yet.</Text>}
                    {resourcesList.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={styles.card} 
                        onPress={() => setSelectedItem(item)}
                        activeOpacity={0.9}
                      >
                        <View style={styles.cardTopRow}>
                          <View style={[styles.iconBox, { backgroundColor: '#EEF2FF' }]}>
                            <Ionicons name="document-text" size={24} color="#3B3CFF" />
                          </View>
                          <View style={styles.cardTextContainer}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                            {item.subject && <Text style={styles.cardSubject}>{item.subject}</Text>}
                            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                          </View>
                        </View>

                        <View style={styles.cardBottomRow}>
                          <View>
                            <Text style={styles.dateLabel}>POSTED DATE</Text>
                            <Text style={styles.dateValue}>{formatDate(item.createdAt)}</Text>
                          </View>

                          {item.link && (
                              <View style={styles.miniLinkBadge}>
                                  <Ionicons name="link" size={12} color="#3B3CFF" />
                                  <Text style={styles.miniLinkText}>Has Link</Text>
                              </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Assignments Tab */}
                {activeTab === 'Assignments' && (
                  <View style={styles.listContainer}>
                    {assignmentsList.length === 0 && <Text style={styles.emptyText}>No assignments posted.</Text>}
                    {assignmentsList.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={[styles.card, { paddingVertical: 20 }]}
                        onPress={() => setSelectedItem(item)}
                      >
                          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
                             <View style={{flex: 1}}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                {item.subject && <Text style={styles.cardSubject}>{item.subject}</Text>}
                                <Text style={styles.cardDesc} numberOfLines={1}>{item.description}</Text>
                             </View>
                             <View style={[styles.iconBox, { width: 36, height: 36, backgroundColor: '#FEF3C7', marginRight: 0 }]}>
                                <Ionicons name="clipboard" size={18} color="#D97706" />
                             </View>
                          </View>
                          
                          <View style={[styles.cardBottomRow, { marginTop: 12 }]}>
                            <Text style={styles.dateValue}>{formatDate(item.createdAt)}</Text>
                            {item.deadline && (
                                <Text style={{fontSize:12, color:'#EF4444', fontWeight:'600'}}>
                                    Due: {formatDate(item.deadline)}
                                </Text>
                            )}
                          </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Notices Tab */}
                {activeTab === 'Notices' && (
                  <View style={styles.listContainer}>
                    {noticesList.length === 0 && <Text style={styles.emptyText}>No notices posted.</Text>}
                    {noticesList.map((item) => (
                      <TouchableOpacity 
                        key={item.id} 
                        style={[styles.card, { paddingVertical: 20 }]}
                        onPress={() => setSelectedItem(item)}
                      >
                          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
                             <View style={{flex: 1}}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                             </View>
                             <Ionicons name="megaphone-outline" size={20} color="#9CA3AF" />
                          </View>
                          <Text style={[styles.dateValue, { marginTop: 10, fontSize: 12, color: '#9CA3AF' }]}>
                             {formatDate(item.createdAt)}
                          </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
            </>
        )}

      </ScrollView>

      {/* 4. Full Screen Modal - UPDATED TO SHOW ALL DETAILS */}
      <Modal visible={selectedItem !== null} animationType="slide" transparent>
        <View style={styles.fullScreenOverlay}>
            <View style={styles.fullScreenContainer}>
                {selectedItem && (
                    <>
                        <View style={styles.fsHeader}>
                            <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color="#111827" />
                            </TouchableOpacity>
                            <Text style={styles.fsTypeHeader}>{selectedItem.type.toUpperCase()}</Text>
                            <View style={{width: 30}} />
                        </View>

                        <ScrollView contentContainerStyle={{padding: 24}}>
                            <Text style={styles.fsTitle}>{selectedItem.title}</Text>
                            
                            {/* Subject Badge */}
                            {selectedItem.subject && (
                                <Text style={styles.fsSubject}>{selectedItem.subject}</Text>
                            )}

                            <Text style={styles.fsDate}>Posted on {formatDate(selectedItem.createdAt)}</Text>
                            
                            {/* Assignment Specific Details */}
                            {selectedItem.type === 'assignment' && (
                                <View style={styles.metaRow}>
                                    {selectedItem.total && (
                                        <View style={styles.metaItem}>
                                            <Ionicons name="star" size={14} color="#D97706" />
                                            <Text style={[styles.metaText, {color: '#D97706'}]}>{selectedItem.total} Points</Text>
                                        </View>
                                    )}
                                    {selectedItem.deadline && (
                                        <View style={styles.metaItem}>
                                            <Ionicons name="time" size={14} color="#EF4444" />
                                            <Text style={[styles.metaText, {color: '#EF4444'}]}>Due: {formatDate(selectedItem.deadline)}</Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            <View style={styles.divider} />
                            
                            <Text style={styles.sectionLabel}>DESCRIPTION</Text>
                            <Text style={styles.fsDesc}>{selectedItem.description}</Text>

                            {/* Download Button inside Modal if Resource or has link */}
                            {selectedItem.link && (
                                <TouchableOpacity 
                                    style={styles.fsDownloadBtn}
                                    onPress={() => handleDownload(selectedItem.link)}
                                >
                                    <View style={styles.linkIconBox}>
                                        <Ionicons name="link" size={24} color="#3B3CFF" />
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text style={styles.linkTitle}>Attached Link</Text>
                                        <Text style={styles.linkUrl} numberOfLines={1}>{selectedItem.link}</Text>
                                    </View>
                                    <Ionicons name="open-outline" size={20} color="#9CA3AF" />
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

// --- Styles ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
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
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Toggle Switch
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
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
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#111827',
  },

  // List Container
  listContainer: {
    gap: 16,
  },
  
  // Card Styles
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubject: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B3CFF',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  cardDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  
  miniLinkBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EEF2FF',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6
  },
  miniLinkText: {
      fontSize: 10,
      color: '#3B3CFF',
      fontWeight: '700',
      marginLeft: 4
  },

  // Download Button
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B3CFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  downloadIcon: {
    marginRight: 6,
  },
  downloadBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // --- Full Screen Modal Styles ---
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  fullScreenContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    overflow: 'hidden'
  },
  fsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6'
  },
  closeBtn: {
    padding: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 20
  },
  fsTypeHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1
  },
  fsTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4
  },
  fsSubject: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3B3CFF',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  fsDate: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16
  },
  
  // Meta Row (Marks/Deadline)
  metaRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20
  },
  metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#F3F4F6'
  },
  metaText: {
      fontSize: 13,
      fontWeight: '700',
      marginLeft: 6
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20
  },
  sectionLabel: {
      fontSize: 11,
      fontWeight: '800',
      color: '#9CA3AF',
      letterSpacing: 1,
      marginBottom: 8
  },
  fsDesc: {
    fontSize: 16,
    lineHeight: 26,
    color: '#374151',
    marginBottom: 40
  },
  
  // Link Card in Modal
  fsDownloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  linkIconBox: {
      width: 40, 
      height: 40,
      borderRadius: 10,
      backgroundColor: '#EEF2FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12
  },
  linkTitle: {
      fontSize: 12,
      color: '#6B7280',
      fontWeight: '600',
      marginBottom: 2
  },
  linkUrl: {
      fontSize: 14,
      color: '#3B3CFF',
      fontWeight: '700'
  }
});
