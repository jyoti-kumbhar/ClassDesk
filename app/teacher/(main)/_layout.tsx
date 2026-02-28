import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, StatusBar, Dimensions } from 'react-native';
import { Tabs, useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Line, Defs, LinearGradient, Stop } from "react-native-svg";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width: W } = Dimensions.get('window');

// --- Updated Graphics Component (Pastel Design) ---
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

const AppLogo = () => (
  <View style={[styles.logoBox, { backgroundColor: 'rgba(68, 97, 242, 0.1)' }]}>
    <Ionicons name="school" size={40} color="#4461F2" />
  </View>
);

const TopBar = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TopBarGraphics />

      <View style={styles.headerContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppLogo />
          <Text style={[styles.logoText, { color: '#1F2937' }]}>ClassDesk</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

// --- Custom Bottom Nav Adapter (Fixed Types) ---
function CustomBottomNav({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.bottomNav}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Explicitly type the icon name so TypeScript accepts it
        let iconName: keyof typeof Ionicons.glyphMap = "home";
        
        if (route.name === "dashboard") iconName = "home";
        if (route.name === "classes") iconName = "grid-outline"; 
        if (route.name === "exam") iconName = "clipboard-outline"; 
        if (route.name === "attendance") iconName = "people-outline";

        const NavItemBlock = (
          <TouchableOpacity 
            key={route.key} 
            onPress={onPress} 
            style={styles.navItem}
          >
            <Ionicons name={iconName} size={24} color={isFocused ? "#FFF" : "#9CA3AF"} />
            <Text 
              style={[styles.navText, isFocused && styles.navTextActive]}
              numberOfLines={1} 
              adjustsFontSizeToFit 
            >
              {typeof label === 'string' ? label : route.name}
            </Text>
          </TouchableOpacity>
        );

        if (index === 1) {
          return (
            <React.Fragment key={route.key + "_fragment"}>
              {NavItemBlock}
              <View style={styles.fabContainer} key="fab">
                <TouchableOpacity style={styles.fab}>
                  <Ionicons name="add" size={30} color="#4461F2" />
                </TouchableOpacity>
                <Text style={styles.fabLabel}>Create</Text>
              </View>
            </React.Fragment>
          );
        }

        return NavItemBlock;
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
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  
  // Top Bar 
  header: { 
    backgroundColor: '#ffffff', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30,
    zIndex: 10,
    overflow: 'hidden', 
    paddingBottom: 30, 
  },
  headerContent: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 60, 
    zIndex: 2, 
  },
  logoBox: { 
    width: 50, height: 50, 
    borderRadius: 15, 
    justifyContent: "center", alignItems: "center" 
  },
  logoText: { fontSize: 22, fontWeight: '700', marginLeft: 10 },
  notifBtn: { marginRight: 15, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', zIndex: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#4461F2' }, 

  // --- Bottom Nav Styles ---
  bottomNav: { 
    position: 'absolute', 
    bottom: 0,
    left: 0, 
    right: 0, 
    backgroundColor: '#4461F2', 
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 85,              
    paddingBottom: 10,        
    paddingHorizontal: 8, 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
  }, 

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navText: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#9CA3AF', 
    marginTop: 4 
  },

  navTextActive: { 
    color: '#fff' 
  },

  // --- FAB Styles ---
  fabContainer: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fab: { 
    position: 'absolute', 
    top: -30, 
    width: 60, 
    height: 60, 
    backgroundColor: '#fff', 
    borderRadius: 30, 
    borderWidth: 4, 
    borderColor: '#4461F2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    elevation: 8 
  },

  fabLabel: { 
    fontSize: 11, 
    fontWeight: '700', 
    color: '#fff', 
    marginTop: 34
  }
});