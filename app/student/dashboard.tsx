import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from "react-native-svg";

// --- Types & Interfaces ---
type IconName = keyof typeof Ionicons.glyphMap;

interface AppLogoProps {
  scale?: number;
}

interface NavItemProps {
  icon: IconName;
  label: string;
  isActive?: boolean;
}

// --- 1. Background Graphics  ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">

        {/* Squiggles */}
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
    
        <View style={{ position: "absolute", top: 220, right: 0, opacity: 0.4 }}>
            <Svg height="100" width="60" viewBox="0 0 60 100">
                <Path d="M10 10 Q 50 30 10 50 T 10 90" stroke="#FF8A65" strokeWidth="3" fill="none" />
            </Svg>
        </View>
    
        <View style={{ position: "absolute", top: 180, right: -10, opacity: 0.3, transform: [{ rotate: '20deg' }] }}>
            <Svg height="60" width="100" viewBox="0 0 100 60">
                <Path d="M10 30 Q 30 10 50 30 T 90 30" stroke="#4461F2" strokeWidth="3" fill="none" />
            </Svg>
        </View>
    
        <View style={{ position: "absolute", top: 380, right: 30, opacity: 0.25, transform: [{ rotate: '-15deg' }] }}>
             <Svg height="80" width="80" viewBox="0 0 80 80">
                <Path d="M10 40 Q 40 10 70 40 T 10 70" stroke="#FFB74D" strokeWidth="2" strokeDasharray="5, 5" fill="none" />
            </Svg>
        </View>
    
        <View style={{ position: "absolute", top: 450, right: -20, opacity: 0.2 }}>
             <Svg height="120" width="60" viewBox="0 0 60 120">
                <Path d="M30 10 Q 60 40 30 70 T 30 130" stroke="#4FC3F7" strokeWidth="4" fill="none" />
            </Svg>
        </View>

    {/* Top Right Triangle/Shape */}
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#e9b9b9" />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" /> 
      </Svg>
    </View>

    {/* Top Left Yellow Circle */}
    <View style={[styles.circle, { top: 40, left: -20, backgroundColor: "#f5d29d", width: 100, height: 100 }]} />
    
    {/* Scattered Dots */}
    <View style={[styles.dot, { top: 120, right: 80, backgroundColor: "#657cff" }]} />
    <View style={[styles.dot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
    <View style={[styles.dot, { bottom: 150, right: 20, backgroundColor: "#FF8A65" }]} />
    
    {/* Bottom Left Shapes */}
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="150" width="200" viewBox="0 0 100 100">
         <Circle cx="20" cy="120" r="120" fill="#fca1c4c9" />
         <Path d="M60 80 L30 60 L50 90 Z" fill="#4481f2" opacity={1}/>
       </Svg>
    </View>

    {/* Bottom Right Corner */}
    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 150, height: 150, backgroundColor: "#63caf3", borderRadius: 60, opacity: 0.5 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 80, backgroundColor: "#e9967c", borderRadius: 40 }} />
    </View>
  </View>
);

// --- 2. Top Bar (Header)  ---
const AppLogo = ({ scale = 1 }: AppLogoProps) => (
  <View style={[styles.logoBox, { transform: [{ scale }] }]}>
    <Ionicons name="school" size={40} color="white" />
  </View>
);

export const TopBar = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AppLogo scale={0.5} />
        <Text style={styles.logoText}>ClassDesk</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.notifBtn}>
          <View style={styles.badge} />
          <Ionicons name="notifications" size={24} color="#374151" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push({ pathname: "/admin/profile" })}>
          <Image
            source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Admin" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- 3. Bottom Bar (Navigation) ---
const NavItem = ({ icon, label, isActive = false }: NavItemProps) => (
  <TouchableOpacity style={[styles.navItem, isActive && styles.navItemActive]}>
    <Ionicons name={icon} size={22} color={isActive ? "#FFF" : "#9CA3AF"} />
    <Text 
      style={[styles.navText, isActive && styles.navTextActive]}
      numberOfLines={1} 
      adjustsFontSizeToFit 
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export const BottomNav = () => {
  return (
    <View style={styles.bottomNav}>
      <NavItem icon="home" label="Home" isActive />
      <NavItem icon="book" label="Classes" />
      <NavItem icon="document-text" label="Exams" />
      <NavItem icon="people-outline" label="Attendance" />
    </View>
  );
};

// --- 4. Main Student Dashboard ---
export default function StudentDashboard() {
  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecorations />
      
      <View style={styles.contentWrapper}>
        <TopBar />
        
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.greetingText}>Good morning, Alex</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.progressContainer}>
                <Svg width="80" height="80" viewBox="0 0 100 100">
                  <Circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="8" fill="none" />
                  <Circle 
                    cx="50" cy="50" r="40" stroke="#1E2CF6" strokeWidth="8" 
                    fill="none" strokeDasharray="251" strokeDashoffset={251 * 0.15} 
                    strokeLinecap="round" transform="rotate(-90 50 50)" 
                  />
                </Svg>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>85%</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>Overall{'\n'}Attendance</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.iconWrapperLight}>
                <Ionicons name="timer" size={20} color="#4461F2" />
              </View>
              <Text style={styles.examSub}>NEXT EXAM:</Text>
              <Text style={styles.examTitle}>CALCULUS II</Text>
              <Text style={styles.countdownText}>02d:04h:30s</Text>
              <View style={styles.miniProgressBar}>
                <View style={[styles.miniProgressFill, { width: '70%' }]} />
              </View>
            </View>
          </View>

          {/* Quick Actions Section */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={[styles.actionCard, styles.actionCardBlue]}>
              <View style={styles.actionIconWrapperBlue}>
                <Ionicons name="help-circle-outline" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.actionSubLight}>Assessment</Text>
                <Text style={styles.actionTitleLight}>Attempt Exam</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, styles.actionCardBlue]}>
              <View style={styles.actionIconWrapperBlue}>
                <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.actionSubLight}>Assignment</Text>
                <Text style={styles.actionTitleLight}>Submit File</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Classroom Feed Section */}
          <View style={styles.feedHeader}>
            <Text style={styles.sectionTitle}>Classroom Feed</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.feedCard}>
            <View style={styles.feedTopRow}>
              <View style={styles.feedIconLight}>
                <Ionicons name="document-text" size={24} color="#4461F2" />
              </View>
              <View style={styles.feedTextContent}>
                <Text style={styles.feedTitle} numberOfLines={1}>Lecture 12: Organic Chemistry ...</Text>
                <Text style={styles.feedSubtitle}>Shared by Dr. Sarah Smith • 2h ago</Text>
              </View>
            </View>
            <View style={styles.feedActionRow}>
              <TouchableOpacity style={styles.btnPrimary}>
                <Ionicons name="download-outline" size={16} color="#FFF" />
                <Text style={styles.btnPrimaryText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSecondary}>
                <Ionicons name="eye-outline" size={16} color="#374151" />
                <Text style={styles.btnSecondaryText}>Preview</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.feedCard}>
            <View style={styles.feedTopRow}>
              <View style={styles.feedIconYellow}>
                <Text style={styles.pdfIconText}>PDF</Text>
              </View>
              <View style={styles.feedTextContent}>
                <Text style={styles.feedTitle} numberOfLines={1}>Final Project Guidelines.pdf</Text>
                <Text style={styles.feedSubtitle}>Shared by Prof. Doe • 5h ago</Text>
              </View>
            </View>
            <View style={styles.feedActionRow}>
              <TouchableOpacity style={styles.btnPrimary}>
                <Ionicons name="download-outline" size={16} color="#FFF" />
                <Text style={styles.btnPrimaryText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </ScrollView>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

// --- Combined Styles ---
const styles = StyleSheet.create({
  // Global Container
  container: { flex: 1, backgroundColor: '#FFFCF9' },
  contentWrapper: { flex: 1, paddingHorizontal: 20 },
  scrollContent: { paddingBottom: 120 },

  // bg style 
  circle: {
    position: "absolute",
    borderRadius: 999,
  },
  dot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Base Top Bar Styles 
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: Platform.OS === 'android' ? 40 : 20, 
    marginBottom: 20 
  },
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
    elevation: 8 
  },
  logoText: { fontSize: 20, fontWeight: '700', color: '#000', marginLeft: -5 },
  notifBtn: { marginRight: 15, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', zIndex: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  
  // Base Bottom Nav Styles 
  // Base Bottom Nav Styles 
  bottomNav: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#4461F2', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    
    // --- Add these lines for the curved corners ---
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    
    // Add a shadow so the curve stands out from the background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 15,
  },
  navItem: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 16, paddingHorizontal: 4},
  navItemActive: { backgroundColor: '#4461F2' },
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
  navTextActive: { color: '#fff', fontWeight: '700' },

  // Welcome Section
  welcomeSection: { marginBottom: 20 },
  dateText: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 4 },
  greetingText: { fontSize: 24, fontWeight: 'bold', color: '#111827' },

  // Stats Section
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    justifyContent: 'center'
  },
  progressContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  progressTextContainer: { position: 'absolute' },
  progressText: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 14, color: '#4B5563', fontWeight: '500', lineHeight: 20 },
  
  iconWrapperLight: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  examSub: { fontSize: 10, color: '#6B7280', fontWeight: '700', letterSpacing: 1, marginBottom: 2 },
  examTitle: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginBottom: 8 },
  countdownText: { fontSize: 20, fontWeight: 'bold', color: '#4461F2', marginBottom: 10 },
  miniProgressBar: { height: 4, backgroundColor: '#F3F4F6', borderRadius: 2, overflow: 'hidden' },
  miniProgressFill: { height: '100%', backgroundColor: '#4461F2', borderRadius: 2 },

  // Quick Actions Section
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 15 },
  quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  actionCard: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    borderRadius: 16, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    minHeight: 140,
    justifyContent: 'space-between'
  },
  actionCardBlue: { backgroundColor: '#4461F2', borderColor: '#4461F2' },
  actionIconWrapperBlue: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' },
  actionIconWrapperLight: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center' },
  actionSubLight: { fontSize: 12, color: '#E0E7FF', fontWeight: '500', marginBottom: 4 },
  actionTitleLight: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  actionSubDark: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginBottom: 4 },
  actionTitleDark: { fontSize: 16, fontWeight: 'bold', color: '#111827' },

  // Classroom Feed Section
  feedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  seeAllText: { fontSize: 14, color: '#4461F2', fontWeight: '600' },
  feedCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 15 },
  feedTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  feedIconLight: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#E0E7FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  feedIconYellow: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pdfIconText: { color: '#D97706', fontWeight: 'bold', fontSize: 14 },
  feedTextContent: { flex: 1 },
  feedTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  feedSubtitle: { fontSize: 12, color: '#6B7280' },
  feedActionRow: { flexDirection: 'row', gap: 10 },
  
  // Buttons
  btnPrimary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4461F2', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, gap: 6 },
  btnPrimaryText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, gap: 6 },
  btnSecondaryText: { color: '#374151', fontSize: 14, fontWeight: '600' },
});