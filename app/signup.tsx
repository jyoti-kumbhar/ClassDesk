import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Modal,
  FlatList,
  ListRenderItem,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");


// ---------------- Background Art ----------------
const BackgroundArt = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    <View style={{ position: "absolute", top: -30, right: -20 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Path d="M80 20 L100 50 L60 60 Z" fill="#4461F2" opacity={0.8} />
        <Circle cx="80" cy="80" r="35" stroke="#FFCC80" strokeWidth="2" fill="transparent" />
      </Svg>
    </View>

    <View style={{ position: "absolute", top: height * 0.3, left: 20 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#FFB74D" }} />
    </View>

    <View style={{ position: "absolute", bottom: 80, left: -20 }}>
      <Svg height="120" width="120" viewBox="0 0 100 100">
        <Path d="M20 80 L50 20 L80 80 Z" stroke="#4461F2" strokeWidth="2" fill="#E3F2FD" />
      </Svg>
    </View>

    <View style={{ position: "absolute", bottom: -50, right: -50 }}>
      <View style={{ width: 150, height: 150, borderRadius: 75, backgroundColor: "#FFCC80" }} />
      <View
        style={{
          position: "absolute",
          bottom: 40,
          right: 80,
          width: 80,
          height: 40,
          backgroundColor: "#EF5350",
          borderRadius: 20,
          transform: [{ rotate: "-20deg" }],
        }}
      />
    </View>
  </View>
);


// ---------------- Signup Screen ----------------
export default function Signup() {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const [role, setRole] = useState<string>("Student");
  const [showRolePicker, setShowRolePicker] = useState<boolean>(false);

  const roles: string[] = ["Student", "Teacher", "Admin"];

  const handleSignup = () => {
    console.log("Signing up:", { username, email, password, role });
    router.push("/login");
  };

  // ✅ Fully typed render function
  const renderRoleItem: ListRenderItem<string> = ({ item }) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setRole(item);
        setShowRolePicker(false);
      }}
    >
      <Text style={[styles.modalItemText, role === item && styles.selectedModalItemText]}>
        {item}
      </Text>
      {role === item && <Ionicons name="checkmark" size={20} color="#4461F2" />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BackgroundArt />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* ⭐ Exact Splash Logo */}
          <View style={styles.headerIconContainer}>
            <View style={styles.logoContainer}>
              <Ionicons name="school" size={60} color="#3F51B5" />
            </View>
          </View>

          {/* Titles */}
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Empowering education for students and teachers.
          </Text>

          {/* Form */}
          <View style={styles.formContainer}>
            
            {/* Role */}
            <Text style={styles.label}>I am a</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowRolePicker(true)}
            >
              <Ionicons name="people" size={20} color="#9E9E9E" style={styles.inputIcon} />
              <Text style={styles.inputText}>{role}</Text>
              <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
            </TouchableOpacity>

            {/* Username */}
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={20} color="#9E9E9E" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Choose a username"
                placeholderTextColor="#BDBDBD"
                value={username}
                onChangeText={setUsername}
              />
            </View>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={20} color="#9E9E9E" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#BDBDBD"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="#9E9E9E" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Create a password"
                placeholderTextColor="#BDBDBD"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons
                  name={isPasswordVisible ? "eye" : "eye-off"}
                  size={20}
                  color="#9E9E9E"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up */}
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google */}
            <TouchableOpacity style={styles.googleButton}>
              <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.linkText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Role Picker Modal */}
      <Modal
        visible={showRolePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRolePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRolePicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Role</Text>
            <FlatList
              data={roles}
              keyExtractor={(item) => item}
              renderItem={renderRoleItem}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}


// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFCF9" },
  scrollContent: { paddingHorizontal: 30, paddingTop: 60, paddingBottom: 40 },

  headerIconContainer: { alignItems: "center", marginBottom: 20 },

  // ⭐ Splash Logo Style
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#E8EAF6",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3F51B5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 30,
  },

  formContainer: { width: "100%" },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
    marginTop: 10,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
  },

  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 16, color: "#2D3748" },
  inputText: { flex: 1, fontSize: 16, color: "#2D3748" },

  signupButton: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
    elevation: 4,
  },

  signupButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },

  dividerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
  dividerText: { marginHorizontal: 10, color: "#A0AEC0", fontSize: 12, fontWeight: "600" },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 12,
    height: 55,
    marginBottom: 30,
  },

  googleButtonText: { marginLeft: 10, fontSize: 16, fontWeight: "600", color: "#2D3748" },

  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  footerText: { color: "#718096", fontSize: 14 },
  linkText: { color: "#2563EB", fontWeight: "bold", fontSize: 14 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center" },

  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F7FAFC",
  },

  modalItemText: { fontSize: 16, color: "#4A5568" },
  selectedModalItemText: { color: "#2563EB", fontWeight: "bold" },
});
