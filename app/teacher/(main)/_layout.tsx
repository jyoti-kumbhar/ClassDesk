import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, StatusBar, Dimensions } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G, Path } from "react-native-svg";

const { width: W } = Dimensions.get('window');

const DynamicTopBarGraphics = ({ pathname }: { pathname: string }) => {

  // 1. DASHBOARD GRAPHICS (Yellow & Blue)
  if (pathname.includes('dashboard') || pathname === '/') {
    return (
      <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
        <Svg height="100%" width="100%">
          <G transform={`translate(${-W * 0.1}, -10) rotate(-15)`}>
            <Path d="M 40 140 A 70 70 0 1 1 160 40 L 100 90 Z" fill="#F4B76D" opacity={0.7} />
          </G>
          <Path d={`M ${W - 40} 60 L ${W + 10} 20 L ${W + 10} 100 Z`} fill="#5C73D1" opacity={0.8} />
          <Circle cx={W * 0.6} cy={30} r="8" stroke="#B89C94" strokeWidth="2" fill="none" opacity={0.4} />
        </Svg>
      </View>
    );
  }

  // 2. CLASSES GRAPHICS (Green & Purple)
  if (pathname.includes('classes')) {
    return (
      <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
        <Svg height="100%" width="100%">
          <Circle cx={0} cy={0} r={80} fill="#A7F3D0" opacity={0.6} />
          <Path d={`M ${W - 60} -20 Q ${W} 80 ${W + 20} 20 Z`} fill="#C4B5FD" opacity={0.7} />
          <Circle cx={W * 0.8} cy={60} r="12" stroke="#6EE7B7" strokeWidth="3" fill="none" opacity={0.5} />
        </Svg>
      </View>
    );
  }

  // 3. EXAM GRAPHICS (Red & Coral)
  if (pathname.includes('exam')) {
    return (
      <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
        <Svg height="100%" width="100%">
          <G transform={`translate(${W - 80}, -40)`}>
            <Path d="M 0 100 A 80 80 0 1 1 140 0 L 70 50 Z" fill="#E25865" opacity={0.7} />
          </G>
          <Circle cx={40} cy={80} r={20} fill="#FDA4AF" opacity={0.5} />
          <Circle cx={W * 0.3} cy={20} r="5" fill="#E25865" opacity={0.6} />
        </Svg>
      </View>
    );
  }

  // 4. ATTENDANCE GRAPHICS (Mint & Pink)
  if (pathname.includes('attendance')) {
    return (
      <View style={[StyleSheet.absoluteFill, { zIndex: 1 }]}>
        <Svg height="100%" width="100%">
          <Path d={`M -20 100 Q ${W * 0.5} -50 ${W + 20} 80 L ${W} 0 L 0 0 Z`} fill="#FFD1DC" opacity={0.5} />
          <Circle cx={W - 30} cy={90} r={40} fill="#BDE0FE" opacity={0.6} />
          <Circle cx={W * 0.5} cy={40} r="6" fill="#A2D2FF" opacity={0.8} />
        </Svg>
      </View>
    );
  }

  return null;
};

// --- Top Bar Component ---
const AppLogo = ({ scale = 1 }: { scale?: number }) => (
  <View style={[styles.logoBox, { transform: [{ scale }] }]}>
    <Ionicons name="school" size={50} color="#4461F2" />
  </View>
);

const TopBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.header}>
      <DynamicTopBarGraphics pathname={pathname} />

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
        const label = options.title !== undefined ? options.title : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Match icons from Snippet 1
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
              {label}
            </Text>
          </TouchableOpacity>
        );

        // Inject Floating Action Button after the second item (index 1)
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
  safeArea: { flex: 1, backgroundColor: '#FFF9F0' },
  
  // Top Bar 
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

  // --- Replaced Bottom Nav Styles from Snippet 1 ---
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

  // --- Floating Action Button (FAB) Styles from Snippet 1 ---
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