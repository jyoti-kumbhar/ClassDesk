import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, StatusBar, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Svg, { Circle, Path, G } from "react-native-svg";

// --- Firebase Imports ---
import { auth, db } from "../../firebase/firebaseConfig"; 
import { doc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from "firebase/firestore";

// Static Descent/Professional Avatar URL
const STATIC_PROFILE_IMAGE = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

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

interface AppLogoProps { scale?: number; }
const AppLogo = ({ scale = 1 }: AppLogoProps) => (
  <View style={[logoStyles.logoBox, { transform: [{ scale }] }]}>
    <Ionicons name="school" size={40} color="white" />
  </View>
);

const logoStyles = StyleSheet.create({
  logoBox: { width: 80, height: 80, backgroundColor: "#4461F2", borderRadius: 20, justifyContent: "center", alignItems: "center", shadowColor: "#4461F2", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
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
  const [password, setPassword] = useState(""); // 1. Added password state
  
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
            setName(data.name || ""); // 2. Placeholder fix: setting to empty if null so placeholder shows
            setEmail(user.email || "");
            setUsername(data.username || ""); // 2. Placeholder fix
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

  if (loading) return <View style={[styles.container, flexCenter]}><ActivityIndicator size="large" color="#4461F2" /></View>;

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
            <Ionicons name="arrow-back" size={24} color="#374151" />
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

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Account Details</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            placeholder="Full Name" 
            placeholderTextColor="#9CA3AF" 
          />
          <TextInput 
            style={styles.input} 
            value={username} 
            onChangeText={setUsername} 
            placeholder="Username" 
            placeholderTextColor="#9CA3AF" 
          />
          <TextInput 
            style={styles.input} 
            value={email} 
            editable={false} 
            placeholder="Email" 
            placeholderTextColor="#9CA3AF" 
          />
          <TextInput 
            style={styles.input} 
            value={password} 
            onChangeText={setPassword} 
            placeholder="New Password" 
            secureTextEntry={true} 
            placeholderTextColor="#9CA3AF" 
          />
        </View>

        {/* Join Class Field */}
        <View style={[styles.card, { backgroundColor: '#F4AE63' }]}>
          <Text style={[styles.cardLabel, { color: '#2D3142' }]}>Join a New Class</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput 
              style={[styles.input, { flex: 1, marginBottom: 0 }]} 
              placeholder="Enter Class Code" 
              placeholderTextColor="#2D3142"
              value={classCodeInput}
              onChangeText={setClassCodeInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              onPress={handleJoinClass}
              style={styles.joinIconBtn}
              disabled={isJoining}
            >
              {isJoining ? <ActivityIndicator color="#FFF" /> : <Ionicons name="add" size={28} color="#FFF" />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn}><Text style={styles.btnText}>Save Profile Changes</Text></TouchableOpacity>
        
        <TouchableOpacity style={styles.dangerBtn} onPress={() => auth.signOut().then(() => router.replace("/login"))}>
          <Text style={styles.btnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { ...rowBetween, marginTop: 30, marginBottom: 20 },
  logoText: { fontSize: 20, fontWeight: '700', color: '#000', marginLeft: -10 },
  title: { fontSize: 28, fontWeight: "800", color: "#2D3142", marginBottom: 20 },
  profileSection: { alignItems: "center", marginBottom: 25 },
  avatarContainer: { shadowColor: "#000", shadowOffset: { width: 4, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: "#FFF" },
  card: { backgroundColor: "#5C73D1", padding: 20, borderRadius: 20, marginBottom: 20, elevation: 4, shadowColor: "#2D3142", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 15 },
  cardLabel: { color: 'white', fontWeight: '800', marginBottom: 15, fontSize: 16 },
  input: { backgroundColor: "#F4F0EA", padding: 16, borderRadius: 14, marginBottom: 12, fontSize: 15, fontWeight: "500", color: "#2D3142" },
  joinIconBtn: { backgroundColor: '#2D3142', width: 55, borderRadius: 14, ...flexCenter },
  saveBtn: { ...flexCenter, backgroundColor: "#5C73D1", padding: 18, borderRadius: 14, marginBottom: 12 },
  dangerBtn: { ...flexCenter, backgroundColor: "#E25865", padding: 18, borderRadius: 14, marginBottom: 12 },
  btnText: { fontWeight: "800", color: "#FFF", fontSize: 15 },
});