import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { Circle, Line, Path } from "react-native-svg";

// --- Firebase Imports ---
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';

const TABS = ['Questions', 'Responses', 'Marks', 'Alerts'];

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


export default function MarksListScreen() {
    const router = useRouter();
    const { examId } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('Responses');
    const [examData, setExamData] = useState<any>(null);
    const [responses, setResponses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = useCallback(async () => {
        if (!examId) return;
        try {
            setLoading(true);
            
            // 1. Fetch Exam Details directly from Firestore
            const examDocRef = doc(db, 'exams', examId as string);
            const examSnap = await getDoc(examDocRef);
            const data = examSnap.exists() ? { id: examSnap.id, ...examSnap.data() } : null;
            
            // 2. Fetch Responses
            const responsesRef = collection(db, 'responses');
            const qResponses = query(
                responsesRef, 
                where('examId', '==', examId),
                orderBy('submittedAt', 'desc')
            );
            const responseSnap = await getDocs(qResponses);
            
            const fetchedResponses = responseSnap.docs.map(doc => {
                const rData = doc.data();
                const dateObj = rData.submittedAt?.toDate() || new Date();
                return {
                    id: doc.id,
                    name: rData.userName || 'Unknown Student',
                    email: rData.userEmail || 'No email provided',
                    avatar: rData.userAvatar || null,
                    dateTime: dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    score: rData.score !== null && rData.score !== undefined ? rData.score : 'Pending',
                    duration: rData.timeTaken || '--',
                    warningsIssued: rData.warningsIssued || 0,
                };
            });

            // 3. Fetch Alerts
            const alertsRef = collection(db, 'alerts');
            const qAlerts = query(alertsRef, where('examId', '==', examId));
            const alertSnap = await getDocs(qAlerts);
            const fetchedAlerts = alertSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setResponses(fetchedResponses);
            setExamData({ ...data, alerts: fetchedAlerts });
        } catch (error) {
            console.error("Error loading marks list:", error);
            Alert.alert("Error", "Could not load exam data.");
        } finally {
            setLoading(false);
        }
    }, [examId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteResponse = (responseId: string, studentName: string) => {
        Alert.alert(
            "Delete Response",
            `Are you sure you want to delete ${studentName}'s response? This action cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Delete", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'responses', responseId));
                            setResponses(prev => prev.filter(r => r.id !== responseId));
                        } catch {
                            Alert.alert("Error", "Failed to delete response.");
                        }
                    } 
                }
            ]
        );
    };

    const downloadPdfReport = async () => {
        const htmlContent = `
            <html>
                <head>
                    <style>
                        body { font-family: 'Helvetica'; padding: 20px; }
                        h1 { color: #3B3CFF; text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                        th { background-color: #F3F4F6; }
                    </style>
                </head>
                <body>
                    <h1>Marks Report: ${examData?.title || 'Exam'}</h1>
                    <p>Exam ID: ${examId}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${responses.map(r => `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.score}</td></tr>`).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;
        try {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        } catch {
            Alert.alert("Error", "Could not generate PDF");
        }
    };

    const filteredList = responses.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#3B3CFF" />
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <BackgroundDecorations />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{examData?.title || 'Exam Details'}</Text>
                    <Text style={styles.headerSubtitle}>ID: {examId}</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollArea} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.tabContainer}>
                    {TABS.map((tab) => (
                        <TouchableOpacity key={tab} style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]} onPress={() => setActiveTab(tab)}>
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive, activeTab === tab && tab === 'Alerts' && { color: '#DC2626' }]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {(activeTab === 'Responses' || activeTab === 'Marks') && (
                    <View style={styles.searchRow}>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                            <TextInput style={styles.searchInput} placeholder="Search student..." value={searchQuery} onChangeText={setSearchQuery} />
                        </View>
                    </View>
                )}

                <View style={styles.listContainer}>
                    {activeTab === 'Responses' && filteredList.map((item) => (
                        <View key={item.id} style={styles.responseCard}>
                            <View style={styles.responseCardTop}>
                                <Image source={{ uri: item.avatar || 'https://ui-avatars.com/api/?name=' + item.name }} style={styles.avatarImage} />
                                <View style={styles.studentInfo}>
                                    <Text style={styles.studentName}>{item.name}</Text>
                                    <Text style={styles.studentEmail}>{item.email}</Text>
                                    <Text style={styles.studentDate}>{item.dateTime}</Text>
                                </View>
                                <TouchableOpacity onPress={() => handleDeleteResponse(item.id, item.name)}>
                                    <Ionicons name="trash-outline" size={22} color="#DC2626" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.responseCardBottom}>
                                <View style={styles.statsRow}>
                                    <View style={styles.statBlock}>
                                        <Text style={styles.statLabel}>WARNINGS</Text>
                                        <Text style={[styles.statValue, { color: item.warningsIssued > 0 ? '#DC2626' : '#111827' }]}>{item.warningsIssued}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    style={styles.viewDetailsButton}
                                    onPress={() => router.push({ pathname: '/admin/viewdetails' as any, params: { responseId: item.id, examId } })}
                                >
                                    <Text style={styles.viewDetailsText}>View Paper</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {activeTab === 'Marks' && filteredList.map((item) => (
                        <View key={item.id} style={styles.marksCard}>
                            <View style={styles.marksInitialsBox}><Text style={styles.marksInitialsText}>{item.name.substring(0, 2).toUpperCase()}</Text></View>
                            <View style={styles.marksInfo}>
                                <Text style={styles.marksName}>{item.name}</Text>
                                <Text style={styles.studentEmail}>{item.email}</Text>
                            </View>
                            <View style={styles.marksScoreSection}><Text style={styles.marksScoreText}>{item.score}</Text></View>
                        </View>
                    ))}

                    {activeTab === 'Questions' && (
                        examData?.questions?.length > 0 ? (
                            examData.questions.map((q: any, idx: number) => (
                                <View key={q.id || idx} style={styles.questionCard}>
                                    <View style={styles.questionCardHeader}>
                                        <View style={styles.questionTagBox}>
                                            <Text style={styles.questionTagText}>Q{idx + 1}. {q.type?.toUpperCase()}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.questionMainText}>{q.text}</Text>
                                    {q.options && (
                                        <View style={styles.optionsContainer}>
                                            {q.options.map((opt: any) => (
                                                <View key={opt.id} style={styles.optionBox}>
                                                    <Text style={styles.optionText}>
                                                        <Text style={{ fontWeight: 'bold' }}>{opt.id || opt.label}. </Text>
                                                        {opt.text}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View style={{ alignItems: 'center', marginTop: 40 }}>
                                <Text style={{ color: '#9CA3AF' }}>No questions found for this exam.</Text>
                            </View>
                        )
                    )}

                    {activeTab === 'Alerts' && (
                        (!examData?.alerts || examData.alerts.length === 0) ? (
                            <View style={styles.emptyAlertsContainer}>
                                <Ionicons name="checkmark-circle-outline" size={60} color="#10B981" />
                                <Text style={styles.emptyAlertsTitle}>All Clear!</Text>
                            </View>
                        ) : (
                            examData.alerts.map((alert: any, index: number) => (
                                <View key={alert.id || index} style={styles.alertCard}>
                                    <View style={styles.alertIconBox}><Ionicons name="warning" size={20} color="#DC2626" /></View>
                                    <View style={styles.alertInfo}>
                                        <Text style={styles.alertStudentName}>{alert.studentName || 'Student'}</Text>
                                        <Text style={styles.alertStudentEmail}>{alert.studentEmail}</Text>
                                        <Text style={styles.alertMessage}>{alert.message}</Text>
                                    </View>
                                    <Text style={styles.alertTime}>{alert.time}</Text>
                                </View>
                            ))
                        )
                    )}
                </View>
            </ScrollView>

            {activeTab === 'Marks' && (
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity style={styles.downloadButton} onPress={downloadPdfReport}>
                        <Ionicons name="download-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.downloadButtonText}>Download Report</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#ffffff' },
  dot: { position: "absolute", borderRadius: 999 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
    backButton: { marginRight: 16 },
    headerTextContainer: { flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
    headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
    scrollArea: { flex: 1 },
    contentContainer: { padding: 20 },
    tabContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4, marginBottom: 20 },
    tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
    tabButtonActive: { backgroundColor: '#FFF', elevation: 2 },
    tabText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
    tabTextActive: { color: '#3B3CFF' },
    searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
    searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#F3F4F6' },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, fontSize: 15, color: '#111827' },
    listContainer: { gap: 16 },
    responseCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F3F4F6' },
    responseCardTop: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
    avatarImage: { width: 48, height: 48, borderRadius: 24, marginRight: 12, backgroundColor: '#E5E7EB' },
    studentInfo: { flex: 1 },
    studentName: { fontSize: 16, fontWeight: '700', color: '#111827' },
    studentEmail: { fontSize: 12, color: '#6B7280', marginTop: 1 },
    studentDate: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '700' },
    responseCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    statsRow: { flexDirection: 'row', gap: 24 },
    statBlock: { alignItems: 'flex-start' },
    statLabel: { fontSize: 10, fontWeight: '600', color: '#9CA3AF' },
    statValue: { fontSize: 18, fontWeight: '700' },
    viewDetailsButton: { backgroundColor: '#F8FAFC', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
    viewDetailsText: { color: '#3B3CFF', fontSize: 13, fontWeight: '600' },
    marksCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
    marksInitialsBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    marksInitialsText: { color: '#3B3CFF', fontWeight: '700', fontSize: 16 },
    marksInfo: { flex: 1 },
    marksName: { fontSize: 16, fontWeight: '600', color: '#111827' },
    marksScoreSection: { alignItems: 'flex-end' },
    marksScoreText: { fontSize: 18, fontWeight: '700', color: '#3B3CFF' },
    questionCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#F3F4F6' },
    questionCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    questionTagBox: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    questionTagText: { color: '#3B3CFF', fontSize: 10, fontWeight: '700' },
    questionMainText: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 20 },
    optionsContainer: { gap: 12 },
    optionBox: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#F3F4F6' },
    optionText: { fontSize: 14, color: '#4B5563' },
    bottomButtonContainer: { padding: 20, paddingBottom: 30 },
    downloadButton: { backgroundColor: '#3B3CFF', flexDirection: 'row', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    downloadButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    alertCard: { backgroundColor: '#FEF2F2', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#FECACA', marginBottom: 10 },
    alertIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    alertInfo: { flex: 1 },
    alertStudentName: { fontSize: 15, fontWeight: '700', color: '#991B1B' },
    alertStudentEmail: { fontSize: 11, color: '#DC2626', marginBottom: 4 },
    alertMessage: { fontSize: 13, color: '#DC2626' },
    alertTime: { fontSize: 12, color: '#F87171', fontWeight: '600' },
    emptyAlertsContainer: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 20 },
    emptyAlertsTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginTop: 16 },
    emptyAlertsText: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center', lineHeight: 20 },
});