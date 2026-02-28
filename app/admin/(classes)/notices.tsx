import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Linking, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';
import { useLocalSearchParams } from 'expo-router';

// --- Firebase Imports ---
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig'; 

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
export default function NoticesScreen() {
  const params = useLocalSearchParams();
  
  // 1. Fetch current class details from route params
  const currentClassId = (params.id as string) || (params.classId as string) || '';
  const currentClassName = (params.grade as string) || (params.className as string) || 'Classroom';
  const currentSubject = (params.subject as string) || 'General Feed';

  // State
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null); // NEW: Track selected notice

  // Connect to DB and fetch notices
  useEffect(() => {
    if (!currentClassId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'notices'),
      where('classId', '==', currentClassId) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotices = snapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data };
      });
      
      // Filter out drafts
      const filtered = fetchedNotices.filter((item: any) => item.status !== 'draft');

      // Sort manually
      filtered.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
      });

      setNotices(filtered);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Fetch Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentClassId, params]);

  // Helper function to format timestamps
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Helper to determine styling based on notice type
  const getCardStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'assignment':
        return { icon: 'document-text', bg: '#DBEAFE', color: '#2563EB' }; // Blue
      case 'resource':
        return { icon: 'folder-open', bg: '#D1FAE5', color: '#059669' }; // Green
      default:
        return { icon: 'megaphone', bg: '#FEF3C7', color: '#D97706' }; // Yellow (Notice)
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundDecorations />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>{currentClassName}</Text>
          <Text style={styles.pageSubtitle}>{currentSubject}</Text>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>FEED</Text>
          <View style={styles.badgeNew}>
            <Text style={styles.badgeText}>{notices.length} Updates</Text>
          </View>
        </View>

        {/* Dynamic List Loading & Empty State */}
        {loading ? (
          <ActivityIndicator size="large" color="#4461F2" style={{ marginTop: 40 }} />
        ) : notices.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="notifications-off-outline" size={60} color="#D1D5DB" />
            <Text style={{ color: '#9CA3AF', marginTop: 10, fontSize: 16, fontWeight: '500' }}>No updates posted yet.</Text>
          </View>
        ) : (
          notices.map((notice) => {
            const styleProps = getCardStyle(notice.type);

            return (
              // NEW: Changed from <View> to <TouchableOpacity>
              <TouchableOpacity 
                key={notice.id} 
                style={styles.card} 
                activeOpacity={0.8}
                onPress={() => setSelectedNotice(notice)}
              >
                <View style={styles.cardTopRow}>
                  <View style={[styles.iconBox, { backgroundColor: styleProps.bg }]}>
                    <Ionicons name={styleProps.icon as any} size={24} color={styleProps.color} />
                  </View>
                  <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{notice.title}</Text>
                  </View>
                  <Text style={styles.timeText}>{formatDate(notice.createdAt)}</Text>
                </View>
                
                {notice.description ? (
                   // Truncated to 2 lines so they click to read more
                   <Text style={styles.cardDescription} numberOfLines={2}>{notice.description}</Text>
                ) : null}

                {/* Show Attachment Box if there's a link */}
                {notice.link ? (
                  <View style={styles.attachmentBox}>
                    <View style={styles.pdfIconWrapper}>
                      <Ionicons name="link" size={18} color="#DC2626" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileName} numberOfLines={1}>External Resource</Text>
                    </View>
                  </View>
                ) : null}

                {/* Optional footer info */}
                {notice.type === 'assignment' && notice.deadline && (
                  <View style={[styles.cardFooter, { marginTop: 10 }]}>
                    <View style={styles.commentBtn}>
                       <Ionicons name="time-outline" size={16} color="#DC2626" />
                       <Text style={[styles.commentText, { color: '#DC2626' }]}>
                         Due: {formatDate(notice.deadline)}
                       </Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* NEW: Full Details Modal */}
      <Modal visible={selectedNotice !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedNotice && (
              <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 40 }} // Prevents text from being cut off at the bottom
              >
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>{selectedNotice.title}</Text>
                  <TouchableOpacity onPress={() => setSelectedNotice(null)} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color="#111827" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalMetaRow}>
                  <View style={[styles.iconBox, { backgroundColor: getCardStyle(selectedNotice.type).bg, width: 32, height: 32, borderRadius: 8, marginRight: 8 }]}>
                    <Ionicons name={getCardStyle(selectedNotice.type).icon as any} size={16} color={getCardStyle(selectedNotice.type).color} />
                  </View>
                  <Text style={styles.modalTimeText}>Posted: {formatDate(selectedNotice.createdAt)}</Text>
                </View>

                <View style={styles.divider} />

                {/* Added a fallback text in case the database field is empty */}
                <Text style={styles.modalFullDesc}>
                  {selectedNotice.description ? selectedNotice.description : "No description provided for this update."}
                </Text>

                {/* Added a strict check to ensure link only tries to render if it actually exists and is a string */}
                {typeof selectedNotice.link === 'string' && selectedNotice.link.trim() !== '' ? (
                  <TouchableOpacity 
                    style={[styles.attachmentBox, { backgroundColor: '#F9FAFB', marginTop: 20 }]} 
                    activeOpacity={0.7} 
                    onPress={() => Linking.openURL(selectedNotice.link)}
                  >
                    <View style={styles.pdfIconWrapper}>
                      <Ionicons name="link" size={18} color="#DC2626" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.fileName} numberOfLines={1}>Open Attachment Link</Text>
                      <Text style={styles.fileMeta} numberOfLines={1}>{selectedNotice.link}</Text>
                    </View>
                    <View style={styles.downloadBtn}>
                      <Ionicons name="open-outline" size={18} color="#2563EB" />
                    </View>
                  </TouchableOpacity>
                ) : null}

              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 120 },
  dot: { position: "absolute", borderRadius: 999 },
  // Background style helpers
  bgCircle: { position: "absolute", borderRadius: 999 },
  bgDot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },

  // Header
  pageHeader: { marginBottom: 24 },
  pageTitle: { fontSize: 28, fontWeight: '900', color: '#111827', marginBottom: 4 },
  pageSubtitle: { fontSize: 14, fontWeight: '500', color: '#6B7280' },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#9CA3AF', letterSpacing: 1.5 },
  badgeNew: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#1D4ED8', fontSize: 12, fontWeight: '700' },

  // Cards
  card: { 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardTitleContainer: { flex: 1, paddingRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  timeText: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  
  cardDescription: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginBottom: 16 },
  
  // Interactions
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  commentText: { fontSize: 13, fontWeight: '800', color: '#1D4ED8' },

  // Attachment Box
  attachmentBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#F3F4F6',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginTop: 10
  },
  pdfIconWrapper: { width: 40, height: 40, backgroundColor: '#FEE2E2', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fileName: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 2 },
  fileMeta: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  downloadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },

  // --- NEW: Modal Styles ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  modalTitle: { flex: 1, fontSize: 24, fontWeight: '900', color: '#111827', marginRight: 15 },
  closeBtn: { padding: 4, backgroundColor: '#F3F4F6', borderRadius: 20 },
  modalMetaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  modalTimeText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginBottom: 20 },
  modalFullDesc: { fontSize: 16, color: '#4B5563', lineHeight: 26 },
});