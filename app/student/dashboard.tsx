import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // <--- Added import
import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Svg, { Circle, Path, Rect } from "react-native-svg";

const { width } = Dimensions.get('window');

// --- Types ---

type IconName = keyof typeof Ionicons.glyphMap;

interface FeedItemProps {
  title: string;
  subtitle: string;
  type: 'pdf' | 'doc';
  hasPreview?: boolean;
}

interface NavItemProps {
  icon: IconName;
  label: string;
  isActive?: boolean;
}

interface AppLogoProps {
  scale?: number;
}

// --- Background Graphics (Strictly Reused) ---

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    
    {/* 1. Top Right Abstract Shapes */}
    <View style={{ position: "absolute", top: -50, right: -50, opacity: 0.9 }}>
      <Svg height="250" width="250" viewBox="0 0 100 100">
        <Circle cx="80" cy="20" r="40" fill="#E8F0FE" />
        <Path d="M60 10 L90 10 L75 35 Z" fill="#4461F2" /> 
        <Circle cx="30" cy="50" r="10" stroke="#FFB74D" strokeWidth="2" fill="none" opacity={0.6} />
      </Svg>
    </View>

    {/* 3. Squiggles */}
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

    {/* 4. Dots */}
    <View style={[styles.bgDot, { top: 120, right: 70, backgroundColor: "#FF8A65" }]} />
    <View style={[styles.bgDot, { top: 280, left: 40, backgroundColor: "#FFB74D", width: 8, height: 8 }]} />
    <View style={[styles.bgDot, { bottom: 300, right: 110, backgroundColor: "#4FC3F7" }]} />
    <View style={[styles.bgDot, { top: 400, left: -10, backgroundColor: "#4461F2", opacity: 0.3, width: 20, height: 20 }]} />
    
    {/* 5. Bottom Shapes */}
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="180" width="180" viewBox="0 0 100 100">
         <Circle cx="0" cy="100" r="60" fill="#E3F2FD" />
         <Path d="M20 80 L30 60 L50 90 Z" fill="#4461F2" opacity={0.8}/>
         <Rect x="60" y="40" width="10" height="10" transform="rotate(20 65 45)" fill="#FFCC80" opacity={0.6} />
       </Svg>
    </View>

    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 140, height: 140, backgroundColor: "#FFCC80", borderRadius: 70, opacity: 0.3 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 90, height: 90, backgroundColor: "#FFAB91", borderRadius: 45, opacity: 0.8 }} />
       <View style={{ position: 'absolute', bottom: 60, right: 50, opacity: 0.5 }}>
        <Svg height="15" width="15" viewBox="0 0 20 20">
            <Rect x="0" y="8" width="20" height="4" fill="#FFF" rx="1" />
            <Rect x="8" y="0" width="4" height="20" fill="#FFF" rx="1" />
        </Svg>
       </View>
    </View>
  </View>
);

// --- Components ---

const AppLogo = ({ scale = 1 }: AppLogoProps) => {
  return (
    <View style={[logoStyles.logoBox, { transform: [{ scale: scale }] }]}>
      <Ionicons name="school" size={40} color="white" />
    </View>
  );
};

const logoStyles = StyleSheet.create({
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: "#4461F2",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4461F2",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});

const CircularProgress = ({ percent }: { percent: number }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }}>
      <Svg height="80" width="80" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
        />
        <Circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#2563EB"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </Svg>
      <Text style={{ position: 'absolute', fontSize: 16, fontWeight: '700', color: '#1F2937' }}>
        {percent}%
      </Text>
    </View>
  );
};

const FeedCard = ({ title, subtitle, type, hasPreview }: FeedItemProps) => (
  <View style={styles.feedCard}>
    <View style={styles.feedTop}>
      <View style={[styles.fileIcon, type === 'pdf' ? { backgroundColor: '#FFEDD5' } : { backgroundColor: '#DBEAFE' }]}>
        <Ionicons 
            name={type === 'pdf' ? "document-text" : "document"} 
            size={24} 
            color={type === 'pdf' ? "#F97316" : "#2563EB"} 
        />
      </View>
      <View style={styles.feedContent}>
        <Text style={styles.feedTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.feedSubtitle}>{subtitle}</Text>
      </View>
    </View>
    
    <View style={styles.feedActions}>
        <TouchableOpacity style={styles.btnPrimary}>
            <Ionicons name="download-outline" size={16} color="#FFF" />
            <Text style={styles.btnTextPrimary}>Download</Text>
        </TouchableOpacity>
        
        {hasPreview && (
            <TouchableOpacity style={styles.btnSecondary}>
                <Ionicons name="eye-outline" size={16} color="#374151" />
                <Text style={styles.btnTextSecondary}>Preview</Text>
            </TouchableOpacity>
        )}
    </View>
  </View>
);

const NavItem = ({ icon, label, isActive = false }: NavItemProps) => (
  <TouchableOpacity style={styles.navItem}>
    <Ionicons name={icon} size={24} color={isActive ? "#4461F2" : "#9CA3AF"} />
    <Text style={[styles.navText, isActive && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// --- Main Student Dashboard ---

export default function StudentDashboard() {
  const router = useRouter(); // <--- Initialize router

  const handleLogout = () => {
    // Navigate to login screen
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background Graphics */}
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AppLogo scale={0.5} />
            <Text style={styles.appName}>ClassDesk</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.notifBtn}>
                <Ionicons name="notifications" size={24} color="#374151" />
                <View style={styles.notifBadge} />
            </TouchableOpacity>
            
            <Image 
                source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" }} 
                style={styles.avatar} 
            />

            {/* --- LOGOUT BUTTON --- */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
            
          </View>
        </View>

        {/* Greeting */}
        <View style={styles.section}>
          <Text style={styles.dateText}>Thursday, October 24th</Text>
          <Text style={styles.greetingText}>Good morning, Alex </Text>
        </View>

        {/* Stats Row (Attendance & Exam) */}
        <View style={styles.statsRow}>
            {/* Attendance Card */}
            <View style={styles.statCard}>
                <CircularProgress percent={85} />
                <Text style={styles.statLabel}>Overall</Text>
                <Text style={styles.statLabelMain}>Attendance</Text>
            </View>

            {/* Next Exam Card */}
            <View style={styles.statCard}>
                <View style={styles.examIconBox}>
                    <Ionicons name="alarm" size={20} color="#4461F2" />
                </View>
                <Text style={styles.examLabel}>NEXT EXAM:</Text>
                <Text style={styles.examSubject}>CALCULUS II</Text>
                <Text style={styles.timerText}>02d:04h:30s</Text>
                <View style={styles.timerBarBg}>
                    <View style={styles.timerBarFill} />
                </View>
            </View>
        </View>

        {/* Quick Actions (Large Cards) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionRow}>
            
            {/* Blue Card */}
            <TouchableOpacity style={[styles.actionCardBig, styles.actionBlue]}>
                <View style={styles.actionIconBoxBlue}>
                    <Ionicons name="help" size={24} color="#FFF" />
                </View>
                <View style={styles.actionMeta}>
                    <Text style={styles.actionLabelBlue}>Assessment</Text>
                    <Text style={styles.actionTitleBlue}>Attempt Exam</Text>
                </View>
            </TouchableOpacity>

            {/* White Card */}
            <TouchableOpacity style={[styles.actionCardBig, styles.actionWhite]}>
                <View style={styles.actionIconBoxWhite}>
                    <Ionicons name="cloud-upload" size={24} color="#4461F2" />
                </View>
                <View style={styles.actionMeta}>
                    <Text style={styles.actionLabelWhite}>Assignment</Text>
                    <Text style={styles.actionTitleWhite}>Submit File</Text>
                </View>
            </TouchableOpacity>

          </View>
        </View>

        {/* Classroom Feed */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Classroom Feed</Text>
            <TouchableOpacity><Text style={styles.linkText}>See All</Text></TouchableOpacity>
          </View>

          <View style={{ gap: 15 }}>
            <FeedCard 
                type="doc"
                title="Lecture 12: Organic Chemistry" 
                subtitle="Shared by Dr. Sarah Smith • 2h ago"
                hasPreview={true}
            />
            <FeedCard 
                type="pdf"
                title="Final Project Guidelines.pdf" 
                subtitle="Shared by Prof. Doe • 5h ago"
                hasPreview={false}
            />
          </View>
        </View>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Home" isActive />
        <NavItem icon="book-outline" label="Classes" />
        <NavItem icon="clipboard-outline" label="Exams" />
        <NavItem icon="checkbox-outline" label="Attendance" />
      </View>

    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF9', 
  },
  // Background Element Styles
  bgDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  // Dashboard Styles
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginLeft: 10,
  },
  notifBtn: {
      marginRight: 15,
      position: 'relative',
  },
  notifBadge: {
      position: 'absolute',
      top: 0,
      right: 2,
      width: 8,
      height: 8,
      backgroundColor: '#EF4444',
      borderRadius: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  // --- New Logout Button Style ---
  logoutBtn: {
    marginLeft: 12, 
    padding: 6,     
    backgroundColor: '#FEF2F2', 
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 25,
  },
  dateText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },

  // Top Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#FFF',
    width: '48%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center', // Centered content for card 1
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    minHeight: 160,
  },
  statLabel: {
    marginTop: 10,
    color: '#6B7280',
    fontSize: 12,
  },
  statLabelMain: {
      color: '#374151',
      fontSize: 14,
      fontWeight: '600',
  },
  
  // Exam Card Specifics
  examIconBox: {
      width: 36,
      height: 36,
      backgroundColor: '#EEF2FF',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      alignSelf: 'flex-start',
  },
  examLabel: {
      fontSize: 10,
      color: '#6B7280',
      fontWeight: '700',
      alignSelf: 'flex-start',
      letterSpacing: 0.5,
  },
  examSubject: {
      fontSize: 14,
      fontWeight: '800',
      color: '#4B5563',
      alignSelf: 'flex-start',
      marginBottom: 5,
  },
  timerText: {
      fontSize: 20,
      fontWeight: '800',
      color: '#2563EB', // Blue
      alignSelf: 'flex-start',
      marginBottom: 10,
  },
  timerBarBg: {
      width: '100%',
      height: 4,
      backgroundColor: '#F3F4F6',
      borderRadius: 2,
  },
  timerBarFill: {
      width: '60%',
      height: '100%',
      backgroundColor: '#2563EB',
      borderRadius: 2,
  },

  // Quick Actions
  actionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  actionCardBig: {
      width: '48%',
      padding: 16,
      borderRadius: 20,
      height: 160,
      justifyContent: 'space-between',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
  },
  actionBlue: {
      backgroundColor: '#1D4ED8', // Deep blue
  },
  actionWhite: {
      backgroundColor: '#FFF',
  },
  actionIconBoxBlue: {
      width: 45,
      height: 45,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
  },
  actionIconBoxWhite: {
      width: 45,
      height: 45,
      backgroundColor: '#EEF2FF',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
  },
  actionMeta: {
      marginTop: 10,
  },
  actionLabelBlue: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 12,
      fontWeight: '500',
  },
  actionTitleBlue: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '700',
  },
  actionLabelWhite: {
      color: '#6B7280',
      fontSize: 12,
      fontWeight: '500',
  },
  actionTitleWhite: {
      color: '#111827',
      fontSize: 16,
      fontWeight: '700',
  },

  // Feed
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  linkText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  feedCard: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 5,
  },
  feedTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  fileIcon: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  feedContent: {
    flex: 1,
    justifyContent: 'center',
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  feedSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  feedActions: {
      flexDirection: 'row',
      gap: 10,
  },
  btnPrimary: {
      backgroundColor: '#2563EB',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  btnSecondary: {
      backgroundColor: '#F3F4F6',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
  },
  btnTextPrimary: {
      color: '#FFF',
      fontSize: 12,
      fontWeight: '600',
  },
  btnTextSecondary: {
      color: '#374151',
      fontSize: 12,
      fontWeight: '600',
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#C4C4C4',
    marginTop: 4,
  },
  navTextActive: {
    color: '#4461F2',
  },
});