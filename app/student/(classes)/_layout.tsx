import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Top Bar 
const TopBar = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color="#111827" />
        </TouchableOpacity>
        
        <Text style={styles.logoText}>ClassDesk</Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={styles.notifBtn}>
          <View style={styles.badge} />
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

        // Icons for the modules
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

// --- Main Layout Component ---
export default function ClassesLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar />
      
      <View style={styles.mainLayout}>
        {/* Main Content Area */}
        <Tabs 
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <CustomBottomNav {...props} />}
        >
          <Tabs.Screen name="notices" options={{ title: 'Notice' }} />
          <Tabs.Screen name="history" options={{ title: 'History' }} />
          <Tabs.Screen name="members" options={{ title: 'Members' }} />
        </Tabs>
      </View>
    </SafeAreaView>
  );
}

// --- Combined Layout Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  mainLayout: { flex: 1 },
  
  // Top Bar Styles
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 15,
    backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
  },
  backButton: { marginRight: 6 },
  logoText: { fontSize: 20, fontWeight: '700', color: '#111827', marginLeft: 2 },
  notifBtn: { marginRight: 15, position: 'relative' },
  badge: { position: 'absolute', top: 0, right: 2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', zIndex: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#F3F4F6' },

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