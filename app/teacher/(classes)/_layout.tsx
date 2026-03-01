import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { width: W } = Dimensions.get('window');

// --- Top Bar Graphics Component ---
const TopBarGraphics = () => {
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 1, overflow: 'hidden', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }]}>
      <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFF9F0" stopOpacity="1" />
            <Stop offset="1" stopColor="#EEF2FF" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* 1. Base Background with Soft Curve */}
        <Path 
          d={`M 0 0 L ${W} 0 L ${W} 100 Q ${W * 0.5} 140 0 100 Z`} 
          fill="url(#grad)" 
        />

        {/* 2. Large Hollow Circle (Pastel Purple - Top Right) */}
        <Circle 
          cx={W * 0.85} 
          cy={20} 
          r={60} 
          stroke="#E9D5FF" 
          strokeWidth={6} 
          fill="transparent" 
          opacity={0.6} 
        />

        {/* 3. Solid Circle (Pastel Pink - Left) */}
        <Circle 
          cx={W * 0.2} 
          cy={55} 
          r={20} 
          fill="#FBCFE8" 
          opacity={0.8} 
        />

        {/* 4. Small Hollow Ring (Pastel Blue - Center Left) */}
        <Circle 
          cx={W * 0.25} 
          cy={100} 
          r={8} 
          stroke="#BAE6FD" 
          strokeWidth={3} 
          fill="transparent" 
        />
      </Svg>
    </View>
  );
};

// --- Top Bar Component ---
const TopBar = () => {
  const router = useRouter();
  
  return (
    <View style={styles.headerContainer}>
      {/* Background Graphics */}
      <TopBarGraphics />
      
      {/* Actual Header Content */}
      <View style={styles.headerContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.logoText}>ClassDesk</Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Updated path: Profile is in /teacher/profile.tsx based on your structure */}
          <TouchableOpacity onPress={() => router.push("/teacher/profile")}>
            <Image
              source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Bharat" }}
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
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Mapping icons based on your file names in the (classes) folder
        let iconName: keyof typeof Ionicons.glyphMap = "home";
        if (route.name === "notice") iconName = "megaphone";
        if (route.name === "history") iconName = "time"; 
        if (route.name === "members") iconName = "people";

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

export default function ClassDetailsLayout() {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <TopBar />
      <View style={{ flex: 1 }}>
        <Tabs 
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <CustomBottomNav {...props} />}
        >
          {/* The name must match the filename exactly. 
            Since these are inside (classes), the URLs are /teacher/notice, etc.
          */}
          <Tabs.Screen name="notice" options={{ title: 'Notices' }} />
          <Tabs.Screen name="history" options={{ title: 'History' }} />
          <Tabs.Screen name="members" options={{ title: 'Members' }} />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  
  // Header Styles
  headerContainer: {
    backgroundColor: '#ffffff', // Base fallback color
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 10,
    paddingBottom: 20,
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 60, 
    zIndex: 2, // Keeps content above absolute graphics
  },
  backButton: { padding: 4, marginRight: 8, marginLeft: -4 },
  logoText: { fontSize: 22, fontWeight: '700', color: '#1F2937' },
  notifBtn: { marginRight: 15, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', zIndex: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#4461F2' },
  
  // Bottom Nav Styles
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
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 16 },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.1)' }, 
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },
  navTextActive: { color: '#fff', fontWeight: '700' },
});