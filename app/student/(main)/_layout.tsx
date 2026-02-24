import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, StatusBar, Dimensions } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from "react-native-svg";

const { width: W } = Dimensions.get('window');
const DynamicTopBarGraphics = ({ pathname }: { pathname: string }) => {
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
      <Svg height="100%" width="100%">
        <Path 
            d={`M -20 100 Q ${W * 0.5} -50 ${W + 20} 80 L ${W} 0 L 0 0 Z`} 
            fill="#FFD1DC" 
            opacity={0.5} 
        />
        <Circle cx={W - 30} cy={60} r={40} fill="#bdfee8" opacity={0.6} />
        <Circle cx={W * 0.5} cy={40} r="6" fill="#a2ffc1" opacity={0.8} />
      </Svg>
    </View>
  );
};

// --- Top Bar Component ---
const AppLogo = ({ scale = 1 }) => (
  <View style={[styles.logoBox, { transform: [{ scale }] }]}>
    <Ionicons name="school" size={50} color="#4461F2" />
  </View>
);

const TopBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.header}>
      {/* Background Graphics */}
      <DynamicTopBarGraphics pathname={pathname} />

      {/* Header Content Wrapper */}
      <View style={styles.headerContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppLogo scale={0.65} />
          <Text style={styles.logoText}>ClassDesk</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.notifBtn}>
            <View style={styles.badge} />
            <Ionicons name="notifications" size={24} color="#1F2937" /> 
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/student/profile")}>
            <Image
              source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Admin" }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- Custom Bottom Nav Adapter ---
function CustomBottomNav({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.bottomNav}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined 
            ? options.tabBarLabel 
            : options.title !== undefined 
            ? options.title 
            : route.name;
            
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let iconName: keyof typeof Ionicons.glyphMap = "home";
        if (route.name === "dashboard") iconName = "home";
        if (route.name === "classes") iconName = "book";
        if (route.name === "exam") iconName = "document-text"; 
        if (route.name === "attendance") iconName = "people";

        return (
          <TouchableOpacity 
            key={index} 
            onPress={onPress} 
            style={[styles.navItem, isFocused && styles.navItemActive]}
          >
            <Ionicons name={iconName} size={22} color={isFocused ? "#FFF" : "#9CA3AF"} />
            <Text 
              style={[styles.navText, isFocused && styles.navTextActive]}
              numberOfLines={1} 
              adjustsFontSizeToFit 
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// --- Main Layout Component ---
export default function StudentLayout() {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <TopBar />
      
      <View style={{ flex: 1 }}>
        <Tabs 
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <CustomBottomNav {...props} />}
        >
          <Tabs.Screen name="dashboard" options={{ title: 'Home' }} />
          <Tabs.Screen name="classes" options={{ title: 'Classes' }} />
          <Tabs.Screen name="exam" options={{ title: 'Exams' }} />
          <Tabs.Screen name="attendance" options={{ title: 'Attendance' }} />
        </Tabs>
      </View>
    </View>
  );
}

// --- Layout Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF9F0' },
  header: { 
    backgroundColor: '#FFF9F0',
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    zIndex: 10,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 60, 
    paddingBottom: 20, 
    zIndex: 2,
  },
  logoBox: { 
    width: 60, height: 60, 
    backgroundColor: "rgba(68, 97, 242, 0.1)", 
    borderRadius: 15, 
    justifyContent: "center", alignItems: "center" 
  },
  logoText: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginLeft: 10 },
  notifBtn: { marginRight: 15, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', zIndex: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#4461F2' }, 

  bottomNav: { 
    backgroundColor: '#4461F2', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingTop: 12, 
    paddingBottom: Platform.OS === 'ios' ? 30 : 20, 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 15,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 16, paddingHorizontal: 4 },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.1)' }, 
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },
  navTextActive: { color: '#fff', fontWeight: '700' },
});