import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Switch, StatusBar, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Svg, { Circle, Path, G } from "react-native-svg";

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <Svg height="100%" width="100%" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
      <G strokeWidth="2" fill="none" opacity={0.6}>
        <Path d="M -20 80 Q 80 180 20 350 T 60 650 T -20 800" stroke="#7E8FB8" />
        <Path d="M 420 50 Q 320 200 380 400 T 320 650 T 420 780" stroke="#D18F84" />
      </G>
      <Path d="M 60 250v10M 55 255h10M 350 350v10M 345 355h10M 40 520v10M 35 525h10M 320 700v10M 315 705h10" stroke="#B89C94" strokeWidth="2" />
      
      <G fill="none" stroke="#2D3142" strokeWidth="1.5" x="2" y="2">
        <Circle cx="40" cy="140" r="14" /><Circle cx="370" cy="240" r="14" /><Circle cx="70" cy="650" r="8" />
      </G>
      <Circle cx="40" cy="140" r="14" fill="#F4AE63" /><Circle cx="370" cy="240" r="14" fill="#F4AE63" /><Circle cx="70" cy="650" r="8" fill="#E25865" />
      
      <G fill="none" stroke="#2D3142" strokeWidth="2" strokeLinejoin="round" x="4" y="4">
        <Path d="M 310 -10L420 50L420 -10Z" /><Path d="M -10 320A60 60 0 0 1 -10 440Z" /><Path d="M 420 620L350 560A75 75 0 0 0 350 680Z" /><Path d="M 0 760L80 760A80 80 0 0 1 0 840Z" />
      </G>
      <Path d="M 310 -10L420 50L420 -10Z" fill="#5C73D1" /><Path d="M -10 320A60 60 0 0 1 -10 440Z" fill="#E25865" />
      <Path d="M 420 620L350 560A75 75 0 0 0 350 680Z" fill="#F4AE63" /><Path d="M 0 760L80 760A80 80 0 0 1 0 840Z" fill="#5C73D1" />
    </Svg>
  </View>
);

// --- App Logo Component (Matching Dashboard) ---
interface AppLogoProps {
  scale?: number;
}

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

const flexCenter = { justifyContent: 'center' as const, alignItems: 'center' as const };
const rowBetween = { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const };

export default function AdminProfile() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("Admin Name");
  const [email, setEmail] = useState("admin@email.com");
  const [username, setUsername] = useState("admin123");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackgroundDecorations />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header matched to Dashboard */}
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -10 }}>
            <AppLogo scale={0.5} />
            <Text style={styles.logoText}>ClassDesk</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Admin Profile</Text>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Image source={{ uri: image || "https://api.dicebear.com/7.x/avataaars/png?seed=Admin" }} style={styles.profileImage} />
            <View style={styles.cameraIcon}><Ionicons name="camera" size={16} color="#FFF" /></View>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" />
          <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" />
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="New Password" secureTextEntry />
          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: 'white' }} />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn}><Text style={styles.btnText}>Save Changes</Text></TouchableOpacity>
        <TouchableOpacity style={styles.dangerBtn} onPress={() => router.replace("/login")}><Text style={styles.btnText}>Logout</Text></TouchableOpacity>
        <TouchableOpacity style={styles.dangerBtn} onPress={() => Alert.alert("Delete", "Are you sure?", [{ text: "Cancel" }, { text: "Delete", style: "destructive" }])}><Text style={styles.btnText}>Delete Account</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F0EA" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { ...rowBetween, marginTop: 30, marginBottom: 20 },
  
  // Adjusted text style to match the Dashboard perfectly
  logoText: { fontSize: 20, fontWeight: '700', color: '#000', marginLeft: -10 },
  
  title: { fontSize: 28, fontWeight: "800", color: "#2D3142", marginBottom: 20 },
  profileSection: { alignItems: "center", marginBottom: 25 },
  avatarContainer: { shadowColor: "#000", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#FFF" },
  cameraIcon: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#2D3142", padding: 8, borderRadius: 20, borderWidth: 2, borderColor: "#FFF" },
  card: { backgroundColor: "#5C73D1", padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 2, borderColor: "rgba(45, 49, 66, 0.05)", elevation: 4, shadowColor: "#2D3142", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 15 },
  input: { backgroundColor: "#F4F0EA", padding: 16, borderRadius: 14, marginBottom: 12, fontSize: 15, fontWeight: "500", color: "#2D3142" },
  switchRow: { ...rowBetween, marginTop: 10, paddingHorizontal: 5 },
  switchText: { fontWeight: "700", color: "white" },
  saveBtn: { ...flexCenter, backgroundColor: "#5C73D1", padding: 18, borderRadius: 14, marginBottom: 12, shadowColor: "#5C73D1", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  dangerBtn: { ...flexCenter, backgroundColor: "#E25865", padding: 18, borderRadius: 14, marginBottom: 12 },
  btnText: { fontWeight: "800", color: "#FFF", fontSize: 15 },
});