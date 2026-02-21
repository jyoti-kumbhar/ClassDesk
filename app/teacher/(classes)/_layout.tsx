import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, StatusBar } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Top Bar Component ---
const TopBar = () => {
  const router = useRouter();
  
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Back Button Replaces the Logo */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.logoText}>ClassDesk</Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.notifBtn}>
          <View style={styles.badge} />
          <Ionicons name="notifications" size={24} color="#FFF" /> 
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/admin/profile")}>
          <Image
            source={{ uri: "https://api.dicebear.com/7.x/avataaars/png?seed=User" }}
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

        // Assigning icons for Class specific tabs
        let iconName: keyof typeof Ionicons.glyphMap = "home";
        if (route.name === "notice") iconName = "megaphone";
        if (route.name === "assignments") iconName = "clipboard";
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

// --- Main Layout Component ---
export default function ClassDetailsLayout() {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <TopBar />
      <View style={{ flex: 1 }}>
        <Tabs 
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <CustomBottomNav {...props} />}
        >
          {/* Class Tab Screens */}
          <Tabs.Screen name="notice" options={{ title: 'Notices' }} />
          <Tabs.Screen name="assignments" options={{ title: 'Assignments' }} />
          <Tabs.Screen name="history" options={{ title: 'History' }} />
          <Tabs.Screen name="members" options={{ title: 'Members' }} />
        </Tabs>
      </View>
    </View>
  );
}

// --- Combined Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  
  // Top Bar Styles
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 60, 
    paddingBottom: 20, 
    backgroundColor: '#4461F2', 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
    marginLeft: -4, // Pulls the icon slightly to the left to align better with screen edges
  },
  logoText: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#FFF', 
  },
  notifBtn: { marginRight: 15, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', zIndex: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 15,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 16, paddingHorizontal: 4 },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.1)' }, 
  navText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'center' },
  navTextActive: { color: '#fff', fontWeight: '700' },
});