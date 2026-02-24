import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

// Firebase imports
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

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

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState("Student");
  const [showRolePicker, setShowRolePicker] = useState(false);

  const roles = ["Student", "Teacher"];

  // ---------------- EMAIL SIGNUP ----------------
  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Missing Fields", "Please fill all fields to continue.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: username,
        email: user.email,
        role: role,
        createdAt: new Date(),
      });

      await sendEmailVerification(user);

      Alert.alert(
        "Account Created Successfully!",
        "A verification email has been sent. Please verify your email before logging in.",
        [
          { 
            text: "Go to Login", 
            onPress: () => router.push("/login") 
          }
        ]
      );

    } catch (error: any) {
      let errorMessage = "An error occurred during sign up.";

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Please use a different email or log in.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.headerIconContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="school" size={40} color="white" />
            </View>
          </View>

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Empowering education for students and teachers.
          </Text>

          <View style={styles.formContainer}>
            
            <Text style={styles.label}>I am a</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowRolePicker(true)}
            >
              <Ionicons name="people" size={20} color="#9E9E9E" style={styles.inputIcon} />
              <Text style={styles.inputText}>{role}</Text>
              <Ionicons name="chevron-down" size={20} color="#9E9E9E" />
            </TouchableOpacity>

            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={20} color="#9E9E9E" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Choose a username"
                placeholderTextColor="#A0AEC0" 
                value={username}
                onChangeText={setUsername}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={20} color="#9E9E9E" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#A0AEC0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="#9E9E9E" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Create a password"
                placeholderTextColor="#A0AEC0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={20} color="#9E9E9E" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.signupButton, loading && { opacity: 0.7 }]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.signupButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.linkText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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

  title: { fontSize: 28, fontWeight: "bold", color: "#1A202C", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 14, color: "#718096", textAlign: "center", marginBottom: 30 },
  formContainer: { width: "100%" },
  label: { fontSize: 16, fontWeight: "600", color: "#2D3748", marginBottom: 8, marginTop: 10 },
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
  
  // Footer styles
  footer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 10 },
  footerText: { color: "#718096", fontSize: 14 },
  linkText: { color: "#2563EB", fontWeight: "bold", fontSize: 14 },
  
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: width * 0.8, backgroundColor: "white", borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  modalItem: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#F7FAFC" },
  modalItemText: { fontSize: 16, color: "#4A5568" },
  selectedModalItemText: { color: "#2563EB", fontWeight: "bold" },
});