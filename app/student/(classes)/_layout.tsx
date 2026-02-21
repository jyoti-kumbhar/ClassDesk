import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, SafeAreaView, ScrollView } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Top Bar (Modified with Hamburger and Back Button) ---
const TopBar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Hamburger Menu */}
        <TouchableOpacity onPress={toggleSidebar} style={styles.hamburgerBtn}>
          <Ionicons name="menu" size={28} color="#374151" />
        </TouchableOpacity>
        
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        
        <Text style={styles.logoText}>ClassDesk</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.notifBtn}>
          <View style={styles.badge} />
          <Ionicons name="notifications" size={24} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push({ pathname: "/student/profile" })}>
          <Image
            source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=Admin" }}
            style={styles.avatar}
          />
        </TouchableOpacity>
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

        // Icons for the new module
        let iconName: keyof typeof Ionicons.glyphMap = "notifications";
        if (route.name === "history") iconName = "time";
        if (route.name === "members") iconName = "people";

        return (
          <TouchableOpacity 
            key={index} 
            onPress={onPress} 
            style={[styles.navItem, isFocused && styles.navItemActive]}
          >
            <Ionicons name={iconName} size={22} color={isFocused ? "#1D4ED8" : "#9CA3AF"} />
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

// --- Side Menu Bar Component ---
const SIDEBAR_CLASSES = ['10-A', '11-B', '9-C', '12-D', '8-A'];

const SideMenuBar = () => {
  const [activeClass, setActiveClass] = useState('10-A');

  return (
    <View style={styles.sidebarContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarScroll}>
        {SIDEBAR_CLASSES.map((cls) => {
          const isActive = cls === activeClass;
          return (
            <TouchableOpacity 
              key={cls} 
              onPress={() => setActiveClass(cls)}
              style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
            >
              <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>{cls}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.sidebarAddItem}>
          <Ionicons name="add" size={20} color="#6B7280" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// --- Main Layout Component ---
export default function ClassesLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <View style={styles.mainLayout}>
        {/* Conditional Side Menu */}
        {isSidebarOpen && <SideMenuBar />}
        
        {/* Main Content Area */}
        <View style={styles.contentArea}>
          <Tabs 
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <CustomBottomNav {...props} />}
          >
            <Tabs.Screen name="notices" options={{ title: 'Notice' }} />
            <Tabs.Screen name="history" options={{ title: 'History' }} />
            <Tabs.Screen name="members" options={{ title: 'Members' }} />
          </Tabs>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- Combined Layout Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  mainLayout: { flex: 1, flexDirection: 'row' },
  contentArea: { flex: 1 },
  
  // Top Bar Styles
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 15,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
  },
  hamburgerBtn: { marginRight: 15 },
  backButton: { marginRight: 6 },
  logoText: { fontSize: 20, fontWeight: '700', color: '#111827', marginLeft: 2 },
  notifBtn: { marginRight: 15, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', zIndex: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#F3F4F6' },

  // Sidebar Styles
  sidebarContainer: { width: 80, backgroundColor: '#F9FAFB', borderRightWidth: 1, borderRightColor: '#E5E7EB', paddingVertical: 10 },
  sidebarScroll: { alignItems: 'center', gap: 16 },
  sidebarItem: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  sidebarItemActive: { backgroundColor: '#1D4ED8' },
  sidebarText: { fontSize: 13, fontWeight: 'bold', color: '#4B5563' },
  sidebarTextActive: { color: '#FFF' },
  sidebarAddItem: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },

  // Bottom Nav Styles
  bottomNav: { 
    position: 'absolute', bottom: 0, left: 0, right: 0, 
    backgroundColor: '#FFF', 
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', 
    paddingVertical: 12, paddingBottom: Platform.OS === 'ios' ? 30 : 12,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 15,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 16, paddingHorizontal: 4 },
  navItemActive: { backgroundColor: '#EEF2FF' }, 
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4 },
  navTextActive: { color: '#1D4ED8', fontWeight: '700' },
});