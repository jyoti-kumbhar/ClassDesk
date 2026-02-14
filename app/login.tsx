import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Role = "student" | "teacher" | "admin";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [role, setRole] = useState<Role>("student");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    // // 🔥 Role-based redirect
    // if (role === "student") {
    //   router.replace("/student/dashboard");
    // } else if (role === "teacher") {
    //   router.replace("/teacher/dashboard");
    // } else {
    //   router.replace("/admin/dashboard");
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ClassDesk</Text>
      <Text style={styles.subtitle}>
        Welcome back to your classroom
      </Text>

      {/* ROLE SELECTION */}
      <Text style={styles.label}>Login As</Text>
      <View style={styles.roleContainer}>
        {["student", "teacher", "admin"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.roleButton,
              role === item && styles.activeRole,
            ]}
            onPress={() => setRole(item as Role)}
          >
            <Text
              style={[
                styles.roleText,
                role === item && styles.activeRoleText,
              ]}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Email */}
      <Text style={styles.label}>Username or Email</Text>
      <View style={styles.inputBox}>
        <Ionicons name="person-outline" size={20} color="#6E6E73" />
        <TextInput
          placeholder="e.g. alex_smith"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputBox}>
        <Ionicons name="lock-closed-outline" size={20} color="#6E6E73" />
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={secure}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Ionicons
            name={secure ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#6E6E73"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleText}>
          Continue with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.signupText}>
          Dont have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F5EFE8",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#6E6E73",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2F6BFF",
    alignItems: "center",
    marginRight: 5,
  },
  activeRole: {
    backgroundColor: "#2F6BFF",
  },
  roleText: {
    color: "#2F6BFF",
    fontWeight: "600",
  },
  activeRoleText: {
    color: "#fff",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2EAE2",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  forgot: {
    textAlign: "right",
    color: "#2F6BFF",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2F6BFF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  orText: {
    textAlign: "center",
    marginVertical: 15,
    color: "#6E6E73",
  },
  googleButton: {
    backgroundColor: "#F2EAE2",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  googleText: {
    fontWeight: "600",
  },
  signupText: {
    marginTop: 20,
    textAlign: "center",
    color: "#2F6BFF",
  },
});
