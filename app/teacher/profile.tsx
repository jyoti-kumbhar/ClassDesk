import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

// --- Firebase Imports ---
import { arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

// Static Descent/Professional Avatar URL
const STATIC_PROFILE_IMAGE = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Top Right Pastel Blobs */}
    <View style={{ position: "absolute", top: -40, right: -40, opacity: 0.8 }}>
      <Svg height="250" width="250" viewBox="0 0 200 200">
        <Circle cx="120" cy="80" r="90" fill="#E0E7FF" /> {/* Pastel Indigo */}
        <Circle cx="160" cy="120" r="60" fill="#DBEAFE" /> {/* Pastel Blue */}
      </Svg>
    </View>

    {/* Center Left Floating Wave */}
    <View style={{ position: "absolute", top: "30%", left: -20, opacity: 0.6 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Path d="M -20 50 Q 30 10 80 50 T 180 50" stroke="#D1FAE5" strokeWidth="8" fill="none" strokeLinecap="round" />
        <Path d="M -20 70 Q 30 30 80 70 T 180 70" stroke="#FEF3C7" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="10, 10" />
      </Svg>
    </View>

    {/* Bottom Left Pastel Blobs */}
    <View style={{ position: "absolute", bottom: -60, left: -60, opacity: 0.8 }}>
      <Svg height="300" width="300" viewBox="0 0 200 200">
        <Circle cx="80" cy="120" r="100" fill="#FCE7F3" /> {/* Pastel Pink */}
        <Circle cx="120" cy="160" r="60" fill="#EDE9FE" /> {/* Pastel Purple */}
      </Svg>
    </View>

    {/* Floating Pastel Dots */}
    <View style={[styles.bgDot, { top: "15%", left: "10%", backgroundColor: "#FCA5A5", width: 14, height: 14 }]} />
    <View style={[styles.bgDot, { top: "45%", right: "15%", backgroundColor: "#A7F3D0", width: 18, height: 18 }]} />
    <View style={[styles.bgDot, { bottom: "25%", right: "10%", backgroundColor: "#FDE047", width: 12, height: 12 }]} />
  </View>
);

interface AppLogoProps { scale?: number; }
const AppLogo = ({ scale = 1 }: AppLogoProps) => (
  <View style={[logoStyles.logoBox, { transform: [{ scale }] }]}>
    <Ionicons name="school" size={40} color="white" />
  </View>
);

const logoStyles = StyleSheet.create({
  logoBox: { width: 80, height: 80, backgroundColor: "#4461F2", borderRadius: 20, justifyContent: "center", alignItems: "center", shadowColor: "#8DA0E2", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
});

const flexCenter = { justifyContent: 'center' as const, alignItems: 'center' as const };
const rowBetween = { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const };

export default function AdminProfile() {
  const router = useRouter();
  
  // Profile State
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  
  // Join Class State
  const [classCodeInput, setClassCodeInput] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setName(data.name || "Admin User");
            setEmail(user.email || "");
            setUsername(data.username || "admin_user");
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleJoinClass = async () => {
    if (!classCodeInput) return Alert.alert("Error", "Please enter a class code");
    
    setIsJoining(true);
    try {
      const q = query(collection(db, "classes"), where("classCode", "==", classCodeInput.toUpperCase().trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert("Invalid Code", "No class found with this code.");
      } else {
        const classDoc = querySnapshot.docs[0];
        const user = auth.currentUser;
        
        if (user) {
          await updateDoc(doc(db, "users", user.uid), {
            joinedClasses: arrayUnion(classDoc.id)
          });
          Alert.alert("Success!", `You have joined ${classDoc.data().subject}`);
          setClassCodeInput("");
        }
      }
    } catch  {
      Alert.alert("Error", "Something went wrong while joining the class.");
    } finally {
      setIsJoining(false);
    }
  };

  if (loading) return <View style={[styles.container, flexCenter]}><ActivityIndicator size="large" color="#8DA0E2" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BackgroundDecorations />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", marginLeft: -10 }}>
            <AppLogo scale={0.5} />
            <Text style={styles.logoText}>ClassDesk</Text>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#475569" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>My Profile</Text>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: STATIC_PROFILE_IMAGE }} 
              style={styles.profileImage} 
            />
          </View>
        </View>

        {/* User Info Card (Soft Periwinkle) */}
        <View style={styles.accountCard}>
          <Text style={styles.accountCardLabel}>Account Details</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Full Name" placeholderTextColor="#94A3B8" />
          <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholder="Username" placeholderTextColor="#94A3B8" />
          <TextInput style={[styles.input, { opacity: 0.7 }]} value={email} editable={false} placeholder="Email" placeholderTextColor="#94A3B8" />
        </View>

        {/* Join Class Field (Soft Peach) */}
        <View style={styles.joinCard}>
          <Text style={styles.joinCardLabel}>Join a New Class</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput 
              style={[styles.input, { flex: 1, marginBottom: 0 }]} 
              placeholder="Enter Class Code" 
              placeholderTextColor="#94A3B8"
              value={classCodeInput}
              onChangeText={setClassCodeInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              onPress={handleJoinClass}
              style={styles.joinIconBtn}
              disabled={isJoining}
            >
              {isJoining ? <ActivityIndicator color="#C2410C" /> : <Ionicons name="add" size={28} color="#C2410C" />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Profile Changes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.dangerBtn} onPress={() => auth.signOut().then(() => router.replace("/login"))}>
          <Text style={styles.dangerBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  bgDot: { position: "absolute", borderRadius: 999, opacity: 0.7 },
  header: { ...rowBetween, marginTop: 30, marginBottom: 20 },
  logoText: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginLeft: -10 },
  title: { fontSize: 28, fontWeight: "800", color: "#1E293B", marginBottom: 20 },
  profileSection: { alignItems: "center", marginBottom: 25 },
  avatarContainer: { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 15 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: "#FFF" },
  
  // Soft Pastel Cards
  accountCard: { backgroundColor: "#E0E7FF", padding: 20, borderRadius: 24, marginBottom: 20, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 },
  accountCardLabel: { color: '#3730A3', fontWeight: '800', marginBottom: 15, fontSize: 16 },
  
  joinCard: { backgroundColor: "#FFEDD5", padding: 20, borderRadius: 24, marginBottom: 24, elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 },
  joinCardLabel: { color: '#9A3412', fontWeight: '800', marginBottom: 15, fontSize: 16 },
  
  input: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 16, marginBottom: 12, fontSize: 15, fontWeight: "600", color: "#334155", borderWidth: 1, borderColor: "rgba(0,0,0,0.03)" },
  joinIconBtn: { backgroundColor: '#FDBA74', width: 55, borderRadius: 16, ...flexCenter },
  
  // Buttons
  saveBtn: { ...flexCenter, backgroundColor: "#C7D2FE", padding: 18, borderRadius: 18, marginBottom: 14 },
  saveBtnText: { fontWeight: "800", color: "#312E81", fontSize: 15 },
  
  dangerBtn: { ...flexCenter, backgroundColor: "#FECDD3", padding: 18, borderRadius: 18, marginBottom: 12 },
  dangerBtnText: { fontWeight: "800", color: "#9F1239", fontSize: 15 },
});