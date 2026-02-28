import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification 
} from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

// --- Background Graphics ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#b9cbe9" />
        <Path d="M60 10 L90 10 L75 35 Z" fill="#4461F2" /> 
      </Svg>
    </View>
    <View style={[styles.circle, { top: 40, left: -20, backgroundColor: "#f5dfbff6", width: 100, height: 100 }]} />
    <View style={[styles.dot, { top: 120, right: 80, backgroundColor: "#FF8A65" }]} />
    <View style={[styles.dot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
    <View style={[styles.dot, { bottom: 150, right: 20, backgroundColor: "#3aafe6" }]} />
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="150" width="150" viewBox="0 0 100 100">
         <Circle cx="0" cy="100" r="60" fill="#9dcff3c9" />
         <Path d="M10 80 L30 60 L50 90 Z" fill="#4461F2" opacity={1}/>
       </Svg>
    </View>
    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 120, height: 120, backgroundColor: "#f3b963", borderRadius: 60, opacity: 0.5 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 80, backgroundColor: "#e9967c", borderRadius: 40 }} />
    </View>
  </View>
);

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState<"admin" | "teacher" | "student">("student");
  
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Missing Inputs", "Please fill in your credentials.");
      return;
    }

    setLoading(true);

    try {
      let emailToSignIn = identifier;

      // ---------------------------------------------------------
      // A. USERNAME LOOKUP (Now always looks in "users")
      // ---------------------------------------------------------
      if (!identifier.includes("@")) {
        // Query the "users" collection directly
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("name", "==", identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          Alert.alert("User Not Found", `No user found with the username "${identifier}".`);
          setLoading(false);
          return;
        }

        const userDocData = querySnapshot.docs[0].data();
        emailToSignIn = userDocData.email;
      }

      // ---------------------------------------------------------
      // B. FIREBASE AUTHENTICATION
      // ---------------------------------------------------------
      const userCredential = await signInWithEmailAndPassword(auth, emailToSignIn, password);
      const user = userCredential.user;

      // ---------------------------------------------------------
      // C. VERIFY EMAIL
      // ---------------------------------------------------------
      if (!user.emailVerified) {
        await signOut(auth); 
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
          [
            {
              text: "Resend Email",
              onPress: async () => {
                try {
                  await sendEmailVerification(user); 
                  Alert.alert("Sent", "Verification email sent.");
                } catch (e) {
                  Alert.alert("Error", "Too many requests. Please wait.");
                }
              }
            },
            { text: "OK", style: "cancel" }
          ]
        );
        setLoading(false);
        return;
      }

      // ---------------------------------------------------------
      // D. ROLE & DATABASE CHECK (Using "users" collection)
      // ---------------------------------------------------------
      
      // 1. Fetch from "users" collection
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await signOut(auth);
        Alert.alert("Error", "User profile not found in database.");
        setLoading(false);
        return;
      }

      const userData = userSnap.data();

      // 2. COMPARE ROLE: DB Role vs Selected Button Role
      // The role in DB is stored as "student", "teacher", or "admin"
      if (userData.role !== role) {
         await signOut(auth);
         Alert.alert(
           "Access Denied", 
           `You are registered as a '${userData.role.toUpperCase()}', but you are trying to login as a '${role.toUpperCase()}'.\n\nPlease select the correct role.`
         );
         setLoading(false);
         return;
      }

      // ---------------------------------------------------------
      // E. SUCCESS
      // ---------------------------------------------------------
      console.log(`Logged in successfully as: ${emailToSignIn} (${role})`);
      
      switch (role) {
        case "admin":
          router.replace("/admin/dashboard");
          break;
        case "teacher":
          router.replace("/teacher/dashboard");
          break;
        case "student":
        default:
          router.replace("/student/dashboard");
          break;
      }

    } catch (error: any) {
      console.log("LOGIN ERROR:", error.code, error.message);
      
      let msg = "An unexpected error occurred.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = "Invalid email or password.";
      } else if (error.code === 'auth/too-many-requests') {
        msg = "Too many failed attempts. Please try again later.";
      } else if (error.code === 'auth/invalid-email') {
         msg = "The email address is badly formatted.";
      }
      
      Alert.alert("Login Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecorations />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* --- Header Section --- */}
          <View style={styles.headerContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="school" size={40} color="white" />
            </View>
            <Text style={styles.appName}>ClassDesk</Text>
            <Text style={styles.welcomeText}>Welcome back to your classroom</Text>
          </View>

          {/* --- Role Toggle --- */}
          <View style={styles.roleContainer}>
            {(["admin", "teacher", "student"] as const).map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => setRole(r)}
                style={[
                  styles.roleButton,
                  role === r && styles.roleButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === r && styles.roleTextActive,
                  ]}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* --- Form Section --- */}
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Username or Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={20} color="#BDBDBD" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter username or email"
                placeholderTextColor="#A0AEC0"
                style={styles.textInput}
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                keyboardType="default" 
              />
            </View>

            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="#BDBDBD" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#A0AEC0"
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons 
                  name={isPasswordVisible ? "eye" : "eye-off"} 
                  size={22} 
                  color="#4461F2" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogin} 
              style={[styles.loginButton, loading && { opacity: 0.7 }]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Dont have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={styles.signupText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 40, justifyContent: "center" },
  circle: { position: "absolute", borderRadius: 999 },
  dot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },
  headerContainer: { alignItems: "center", marginBottom: 20, marginTop: 40 },
  logoBox: { width: 80, height: 80, backgroundColor: "#4461F2", borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 20, shadowColor: "#4461F2", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8 },
  appName: { fontSize: 32, fontWeight: "bold", color: "#1A1A1A", marginBottom: 8 },
  welcomeText: { fontSize: 16, color: "#52525B", marginBottom: 10 },
  roleContainer: { flexDirection: "row", backgroundColor: "#F4F4F5", borderRadius: 12, padding: 4, marginBottom: 25 },
  roleButton: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  roleButtonActive: { backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  roleText: { fontSize: 14, fontWeight: "600", color: "#A1A1AA" },
  roleTextActive: { color: "#4461F2" },
  formContainer: { width: "100%" },
  inputLabel: { fontSize: 15, fontWeight: "600", color: "#1A1A1A", marginBottom: 8, marginTop: 10 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 15, paddingHorizontal: 15, height: 55, marginBottom: 5 },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 16, color: "#333" },
  forgotContainer: { alignItems: "flex-end", marginTop: 10, marginBottom: 25 },
  forgotText: { color: "#4461F2", fontWeight: "600", fontSize: 14 },
  loginButton: { backgroundColor: "#4461F2", borderRadius: 15, height: 55, justifyContent: "center", alignItems: "center", shadowColor: "#4461F2", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5, marginBottom: 25 },
  loginButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  footerContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  footerText: { color: "#71717A", fontSize: 14 },
  signupText: { color: "#4461F2", fontWeight: "bold", fontSize: 14 },
});