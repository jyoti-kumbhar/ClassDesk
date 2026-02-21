import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image, StatusBar } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Top Bar Component ---
const AppLogo = ({ scale = 1 }) => (
  <View style={[styles.logoBox, { transform: [{ scale }] }]}>
    <Ionicons name="school" size={50} color="white" />
  </View>
);

const TopBar = () => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AppLogo scale={0.65} />
        <Text style={styles.logoText}>ClassDesk</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.notifBtn}>
          <View style={styles.badge} />
          <Ionicons name="notifications" size={24} color="#FFF" /> 
        </TouchableOpacity>
        {/* Updated routing for Admin profile */}
        <TouchableOpacity onPress={() => router.push("/admin/profile")}>
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

        // Assigning icons for Admin specific tabs
        let iconName: keyof typeof Ionicons.glyphMap = "home";
        if (route.name === "dashboard") iconName = "home";
        if (route.name === "users") iconName = "people";
        if (route.name === "classes") iconName = "book";
        if (route.name === "exam") iconName = "document-text"; 
        if (route.name === "report") iconName = "bar-chart";

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
export default function AdminLayout() {
  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <TopBar />
      <View style={{ flex: 1 }}>
        <Tabs 
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <CustomBottomNav {...props} />}
        >
          {/* Admin Tab Screens */}
          <Tabs.Screen name="dashboard" options={{ title: 'Home' }} />
          <Tabs.Screen name="users" options={{ title: 'Users' }} />
          <Tabs.Screen name="classes" options={{ title: 'Classes' }} />
          <Tabs.Screen name="exam" options={{ title: 'Exams' }} />
          <Tabs.Screen name="report" options={{ title: 'Reports' }} />
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
  logoBox: { 
    width: 60, height: 60, 
    backgroundColor: "rgba(255, 255, 255, 0.2)", 
    borderRadius: 15, 
    justifyContent: "center", alignItems: "center" 
  },
  logoText: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#FFF', 
    marginLeft: 10 
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