import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
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
import Svg, { Circle, Path } from "react-native-svg";

// --- Types ---

type IconName = keyof typeof Ionicons.glyphMap;

interface SummaryCardProps {
  icon: IconName;
  label: string;
  value: string;
  color?: string;
}

interface PerformanceCardProps {
  grade: string;
  students: string;
  attendance: string;
  trend: 'up' | 'stable' | 'down';
}

interface NavItemProps {
  icon: IconName;
  label: string;
  isActive?: boolean;
}

interface AppLogoProps {
  scale?: number;
}

// --- Background Graphics ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Top Right Triangle/Shape */}
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#f1db90" />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" /> 
      </Svg>
    </View>

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

    {/* Top Left Yellow Circle */}
    <View style={[styles.circle, { top: 40, left: -20, backgroundColor: "#f5d29d", width: 100, height: 100 }]} />
    
    {/* Scattered Dots */}
    <View style={[styles.dot, { top: 120, right: 80, backgroundColor: "#657cff" }]} />
    <View style={[styles.dot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
    <View style={[styles.dot, { bottom: 150, right: 20, backgroundColor: "#FF8A65" }]} />
    
    {/* Bottom Left Shapes */}
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="150" width="300" viewBox="0 0 100 100">
         <Circle cx="20" cy="150" r="150" fill="#f39dbec9" />
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

const AppLogo = ({ scale = 1 }: AppLogoProps) => (
  <View style={[logoStyles.logoBox, { transform: [{ scale }] }]}>
    <Ionicons name="school" size={40} color="white" />
  </View>
);

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

const SummaryCard = ({ icon, label, value, color = "#4461F2" }: SummaryCardProps) => (
  <View style={styles.summaryCard}>
    <View style={styles.summaryIconBox}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, { color }]}>{value}</Text>
  </View>
);

const ClassPerformanceCard = ({ grade, students, attendance, trend }: PerformanceCardProps) => {
  const trendIcon = trend === "down" ? "arrow-down" : trend === "stable" ? "arrow-forward" : "arrow-up";
  const trendColor = trend === "down" ? "#F59E0B" : trend === "stable" ? "#4461F2" : "#10B981";

  return (
    <View style={styles.performanceCard}>
      <Ionicons name={trendIcon} size={20} color={trendColor} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.perfTitle}>{grade}</Text>
        <Text style={styles.perfSubtitle}>{students}</Text>
      </View>
      <Text style={[styles.perfPercent, { color: trendColor }]}>{attendance}</Text>
    </View>
  );
};

// --- UPDATED NAV ITEM ---
const NavItem = ({ icon, label, isActive = false }: NavItemProps) => (
  <TouchableOpacity style={[styles.navItem, isActive && styles.navItemActive]}>
    <Ionicons name={icon} size={22} color={isActive ? "#FFF" : "#9CA3AF"} />
    <Text style={[styles.navText, isActive && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

// --- MAIN SCREEN ---

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
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

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/admin/profile",
                })
              }
            >
              <Image
                source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Admin" }}
                style={styles.avatar}
              />
            </TouchableOpacity>

          </View>
        </View>

        {/* Greeting */}
        <View style={styles.section}>
          <Text style={styles.greetingText}>Good morning, Admin</Text>
        </View>

        {/* Summary */}
        <View style={styles.gridContainer}>
          <SummaryCard icon="people" label="Total Students" value="1,250" />
          <SummaryCard icon="id-card" label="Total Teachers" value="84" />
          <SummaryCard icon="library" label="Classrooms" value="42" />
          <SummaryCard icon="checkmark-circle" label="Exams Done" value="12" />
        </View>

        {/* Performance */}
        <View style={[styles.section, { marginBottom: 80 }]}>
          <Text style={styles.sectionTitle}>Class Performance</Text>
          <ClassPerformanceCard grade="Grade 10-A" students="35 Students" attendance="94%" trend="up" />
          <ClassPerformanceCard grade="Grade 11-B" students="28 Students" attendance="91%" trend="stable" />
          <ClassPerformanceCard grade="Grade 9-C" students="42 Students" attendance="88%" trend="down" />
        </View>

      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <NavItem icon="home" label="Home" isActive />
        <NavItem icon="people" label="Users" />
        <NavItem icon="book" label="Classes" />
        <NavItem icon="document-text" label="Exams" />
        <NavItem icon="bar-chart" label="Reports" />
      </View>

    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  
  // bg style 
  circle: {position: "absolute",borderRadius: 999},
  dot: {position: "absolute",width: 12,height: 12,borderRadius: 6},
  container: { flex: 1, backgroundColor: '#FFFCF9' },
  scrollContent: { padding: 20, paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 20 },
  logoText: { fontSize: 20, fontWeight: '700', color: '#000' },
  notifBtn: { marginRight: 15, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', zIndex: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  section: { marginBottom: 25 },
  dateText: { color: '#6B7280', fontSize: 13, fontWeight: '500' },
  greetingText: { fontSize: 26, fontWeight: '800', color: '#111827', marginTop: 4 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summaryCard: { width: '48%', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 15, elevation: 2 },
  summaryIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: '#EEF2FF' },
  summaryLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  summaryValue: { fontSize: 22, fontWeight: '800' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 12 },
  performanceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, elevation: 1 },
  perfTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  perfSubtitle: { fontSize: 12, color: '#6B7280' },
  perfPercent: { fontSize: 15, fontWeight: '800' },
  
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 15,
  },  navItem: { alignItems: 'center', justifyContent: 'center', width: 65, paddingVertical: 8, borderRadius: 16 },
  navItemActive: { backgroundColor: '#4461F2' },
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
  navTextActive: { color: '#fff', fontWeight: '700' },
});