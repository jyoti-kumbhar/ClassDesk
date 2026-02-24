import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
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

// Firebase Imports
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification 
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const { width, height } = Dimensions.get("window");

// --- Background Graphics (Geometric Shapes) ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Top Right Triangle/Shape */}
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#b9cbe9" />
        <Path d="M60 10 L90 10 L75 35 Z" fill="#4461F2" /> 
      </Svg>
    </View>

    {/* Top Left Yellow Circle */}
    <View style={[styles.circle, { top: 40, left: -20, backgroundColor: "#f5dfbff6", width: 100, height: 100 }]} />
    
    {/* Scattered Dots */}
    <View style={[styles.dot, { top: 120, right: 80, backgroundColor: "#FF8A65" }]} />
    <View style={[styles.dot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
    <View style={[styles.dot, { bottom: 150, right: 20, backgroundColor: "#3aafe6" }]} />
    
    {/* Bottom Left Shapes */}
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="150" width="150" viewBox="0 0 100 100">
         <Circle cx="0" cy="100" r="60" fill="#9dcff3c9" />
         <Path d="M10 80 L30 60 L50 90 Z" fill="#4461F2" opacity={1}/>
       </Svg>
    </View>

    {/* Bottom Right Corner */}
    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 120, height: 120, backgroundColor: "#f3b963", borderRadius: 60, opacity: 0.5 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 80, backgroundColor: "#e9967c", borderRadius: 40 }} />
    </View>
  </View>
);

export default function Login() {
  const router = useRouter();

  // State
  const [role, setRole] = useState<"admin" | "teacher" | "student">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validation
    if (!email || !password) {
      Alert.alert("Missing Inputs", "Please fill in your credentials.");
      return;
    }

    setLoading(true);

    try {
      // 2. Attempt Login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Check Email Verification
      if (!user.emailVerified) {
        // Force logout so they can't access protected routes
        await signOut(auth);

        Alert.alert(
          "Email Not Verified",
          "You must verify your email address before logging in.",
          [
            {
              text: "Resend Email",
              onPress: async () => {
                try {
                  await sendEmailVerification(user);
                  Alert.alert("Sent", "Verification email resent successfully.");
                } catch (err: any) {
                  Alert.alert("Error", "Too many requests. Please wait a moment.");
                }
              },
            },
            { text: "OK", style: "cancel" }
          ]
        );
        return;
      }

      console.log(`Logging in as ${role} with ${email}`);
      
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
      let msg = "Invalid email or password";
      if (error.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      if (error.code === 'auth/too-many-requests') msg = "Too many attempts. Try again later.";
      
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* --- Header Section --- */}
          <View style={styles.headerContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="school" size={40} color="white" />
            </View>
            <Text style={styles.appName}>ClassDesk</Text>
            <Text style={styles.welcomeText}>Welcome back to your classroom</Text>
          </View>

          {/* --- Role Toggle (Note: Normally role comes from DB, not user selection) --- */}
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
            {/* Username/Email Input */}
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={20} color="#BDBDBD" style={styles.inputIcon} />
              <TextInput
                placeholder="e.g. alex@example.com"
                placeholderTextColor="#A0AEC0"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
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

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
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

            {/* Sign Up Footer */}
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
  container: {
    flex: 1,
    backgroundColor: "#FFFCF9", // Very light warm white
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 40,
    justifyContent: "center",
  },
  
  // --- Decoration Styles ---
  circle: {
    position: "absolute",
    borderRadius: 999,
  },
  dot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // --- Header Styles ---
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: "#4461F2", // The bright blue from the image
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#4461F2",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: "#52525B", // Zinc-600
    marginBottom: 10,
  },

  // --- Role Switcher Styles ---
  roleContainer: {
    flexDirection: "row",
    backgroundColor: "#F4F4F5",
    borderRadius: 12,
    padding: 4,
    marginBottom: 25,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  roleButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A1A1AA",
  },
  roleTextActive: {
    color: "#4461F2",
  },

  // --- Form Styles ---
  formContainer: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF", 
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 25,
  },
  forgotText: {
    color: "#4461F2",
    fontWeight: "600",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#4461F2",
    borderRadius: 15,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4461F2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 25,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  // --- Footer ---
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "#71717A",
    fontSize: 14,
  },
  signupText: {
    color: "#4461F2",
    fontWeight: "bold",
    fontSize: 14,
  },
});