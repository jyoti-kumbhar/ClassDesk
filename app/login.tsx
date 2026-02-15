import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
} from "react-native";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";

const { width, height } = Dimensions.get("window");

// --- Custom Background Component (Draws the Waves) ---
const LoginBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        {/* Gradient for the Pink Shapes */}
        <SvgGradient id="gradPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#D81B60" />
          <Stop offset="100%" stopColor="#880E4F" />
        </SvgGradient>
      </Defs>

      {/* Top Right Wave */}
      <Path
        d={`M${width} 0 L${width} ${height * 0.25} C${width * 0.6} ${height * 0.25} ${width * 0.5} 0 0 0 Z`}
        fill="url(#gradPink)"
      />

      {/* Bottom Dark Wave (Black/Grey layer) */}
      <Path
        d={`M0 ${height} L${width} ${height} L${width} ${height * 0.85} C${width * 0.6} ${height * 0.95} ${width * 0.2} ${height * 0.75} 0 ${height * 0.85} Z`}
        fill="#212121"
      />

      {/* Bottom Pink Wave (Overlapping) */}
      <Path
        d={`M0 ${height * 0.85} C${width * 0.3} ${height * 0.75} ${width * 0.8} ${height * 0.9} ${width} ${height * 0.7} L${width} ${height} L0 ${height} Z`}
        fill="url(#gradPink)"
        opacity="0.9"
      />
    </Svg>
  </View>
);

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }
    console.log("Logging in:", username);
    // Add logic here
  };

  return (
    <View style={styles.container}>
      {/* 1. The Background Art */}
      <LoginBackground />

      {/* 2. The Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSpacer} />

          <Text style={styles.title}>Log In</Text>

          <View style={styles.formContainer}>
            {/* Username Input */}
            <TextInput
              placeholder="Username"
              placeholderTextColor="#9E9E9E"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />

            {/* Password Input */}
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9E9E9E"
              secureTextEntry={secure}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            {/* Remember Me */}
            <TouchableOpacity style={styles.rememberContainer}>
              <Text style={styles.rememberText}>REMEMBER ME</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} style={styles.buttonShadow}>
              <LinearGradient
                colors={["#D81B60", "#C2185B"]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Log In</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>Dont Have An Account? Sign Up</Text>
            </TouchableOpacity>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <Text style={styles.orText}>or Log In with</Text>
              <View style={styles.socialIcons}>
                <TouchableOpacity style={styles.iconButton}>
                  <LinearGradient
                    colors={["#E1306C", "#C13584"]}
                    style={styles.iconGradient}
                  >
                    <FontAwesome name="instagram" size={20} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <LinearGradient
                    colors={["#1DA1F2", "#1DA1F2"]}
                    style={styles.iconGradient}
                  >
                    <FontAwesome name="twitter" size={20} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 50,
  },
  headerSpacer: {
    height: height * 0.15, // Pushes content down from the top wave
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#C2185B",
    textAlign: "center",
    marginBottom: 40,
    letterSpacing: 1,
  },
  formContainer: {
    paddingHorizontal: 40,
  },
  input: {
    backgroundColor: "#E0E0E0", // Light grey background
    borderRadius: 30, // Fully rounded pill shape
    paddingVertical: 15,
    paddingHorizontal: 25,
    fontSize: 16,
    color: "#424242",
    marginBottom: 20,
  },
  rememberContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  rememberText: {
    color: "#757575",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  buttonShadow: {
    marginBottom: 20,
    shadowColor: "#C2185B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  linkText: {
    color: "#757575",
    fontSize: 14,
  },
  socialContainer: {
    alignItems: "center",
  },
  orText: {
    color: "#757575",
    fontSize: 12,
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  iconGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
