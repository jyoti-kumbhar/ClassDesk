import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
  SafeAreaView
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// --- Background Graphics (Geometric Shapes) ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Top Right Triangle/Shape */}
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#E8F0FE" />
        <Path d="M60 10 L90 10 L75 35 Z" fill="#4461F2" /> 
      </Svg>
    </View>

    {/* Top Left Yellow Circle */}
    <View style={[styles.circle, { top: 40, left: -20, backgroundColor: "#FFF4E3", width: 100, height: 100 }]} />
    
    {/* Scattered Dots */}
    <View style={[styles.dot, { top: 120, right: 80, backgroundColor: "#FF8A65" }]} />
    <View style={[styles.dot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
    <View style={[styles.dot, { bottom: 150, right: 20, backgroundColor: "#4FC3F7" }]} />
    
    {/* Bottom Left Shapes */}
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="150" width="150" viewBox="0 0 100 100">
         <Circle cx="0" cy="100" r="60" fill="#E3F2FD" />
         <Path d="M10 80 L30 60 L50 90 Z" fill="#4461F2" opacity={0.8}/>
       </Svg>
    </View>

    {/* Bottom Right Corner */}
    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 120, height: 120, backgroundColor: "#FFCC80", borderRadius: 60, opacity: 0.5 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 80, backgroundColor: "#FFAB91", borderRadius: 40 }} />
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

  const handleLogin = () => {
    // 1. Validation
    if (!email || !password) {
      alert("Please fill in your credentials.");
      return;
    }

    // 2. Mock Logic / Redirection based on Role
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

          {/* --- Role Toggle (New Feature) --- */}
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
            <Text style={styles.inputLabel}>Username or Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={20} color="#BDBDBD" style={styles.inputIcon} />
              <TextInput
                placeholder="e.g. alex_smith"
                placeholderTextColor="#BDBDBD"
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="#BDBDBD" style={styles.inputIcon} />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#BDBDBD"
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
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity style={styles.googleButton}>
               {/* Using an icon for Google for simplicity, ideally use an Image asset */}
              <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
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
  
  // --- Divider ---
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4E4E7",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#71717A",
    fontSize: 12,
    fontWeight: "600",
  },

  // --- Google Button ---
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 15,
    height: 55,
    marginBottom: 30,
  },
  googleButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
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

// backgroundColor: "#FFFCF9"

// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// export default function AppLogo() {
//   return (
//     <View style={styles.logoBox}>
//       <Ionicons name="school" size={40} color="white" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   logoBox: {
//     width: 80,
//     height: 80,
//     backgroundColor: "#4461F2",
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",

//     // Shadow (iOS)
//     shadowColor: "#4461F2",
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,

//     // Shadow (Android)
//     elevation: 8,
//   },
// });
