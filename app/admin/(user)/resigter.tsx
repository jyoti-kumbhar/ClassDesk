import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  SafeAreaView, 
  StatusBar, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';

// --- Firebase Imports ---
import { auth, db } from '../../../firebase/firebaseConfig'; // Adjust path if needed
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// --- Background Component ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Soft Flowing Background Lines */}
    <View style={StyleSheet.absoluteFill}>
      <Svg height="100%" width="100%">
        <Path d="M-50 150 Q 150 50 450 250" stroke="#93C5FD" strokeWidth="2" fill="none" opacity={0.4} />
        <Path d="M-20 350 Q 150 450 400 300" stroke="#6EE7B7" strokeWidth="2" strokeDasharray="6, 6" fill="none" opacity={0.5} />
        <Path d="M-50 600 Q 200 750 450 550" stroke="#F9A8D4" strokeWidth="2" fill="none" opacity={0.4} />
      </Svg>
    </View>

    {/* Top Right Orbs */}
    <View style={{ position: "absolute", top: -60, right: -40, opacity: 0.6 }}>
      <Svg height="300" width="400" viewBox="0 0 100 100">
        <Circle cx="90" cy="70" r="50" fill="#93C5FD" opacity={0.5} />
        <Circle cx="30" cy="80" r="40" fill="#C4B5FD" opacity={0.5} />
        <Circle cx="60" cy="70" r="25" fill="#F9A8D4" opacity={0.6} />
      </Svg>
    </View>

    {/* Middle Left Bubble */}
    <View style={{ position: "absolute", top: 300, left: -40, opacity: 0.5 }}>
      <Svg height="150" width="150" viewBox="0 0 100 100">
        <Circle cx="40" cy="50" r="40" fill="#6EE7B7" opacity={0.4} />
        <Circle cx="60" cy="30" r="15" fill="#93C5FD" opacity={0.6} />
      </Svg>
    </View>

    {/* Bottom Right Orbs */}
    <View style={{ position: "absolute", bottom: -50, right: -20, opacity: 0.6 }}>
      <Svg height="200" width="300" viewBox="0 0 100 100">
        <Circle cx="50" cy="80" r="60" fill="#FDBA74" opacity={0.5} />
        <Circle cx="80" cy="40" r="30" fill="#FCA5A5" opacity={0.4} />
      </Svg>
    </View>

    {/* Floating Mini Bubbles */}
    <View style={[styles.dot, { top: 180, left: 40, backgroundColor: "#93C5FD", width: 14, height: 14, opacity: 0.7 }]} />
    <View style={[styles.dot, { top: 350, right: 60, backgroundColor: "#C4B5FD", width: 20, height: 20, opacity: 0.6 }]} />
    <View style={[styles.dot, { bottom: 120, left: 80, backgroundColor: "#F9A8D4", width: 10, height: 10, opacity: 0.8 }]} />
  </View>
);

export default function RegisterScreen() {
  const router = useRouter();
  
  // State for form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // State for UI handling
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    // Basic validation
    setErrorMessage('');
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Save additional user details in Firestore 'users' collection
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: 'Teacher', // Assigning role automatically
        status: 'online', 
        createdAt: new Date().toISOString(),
        // Setting default fallback values for UI display
        subject: 'GENERAL',
        subjectColor: '#3B3CFF',
        icon: 'book',
        avatar: `https://api.dicebear.com/7.x/avataaars/png?seed=${name.trim()}`,
      });

      // Show success modal
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Registration error: ", error);
      // Handle Firebase specific errors
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('That email address is already in use.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('That email address is invalid.');
      } else {
        setErrorMessage('An error occurred during registration. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Background stays behind the scroll content */}
      <BackgroundDecorations />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Logo Header */}
        <View style={styles.logoHeader}>
          <View style={styles.logoBox}>
            <Ionicons name="school" size={24} color="#FFF" />
          </View>
          <Text style={styles.logoText}>ClassDesk</Text>
        </View>

        {/* Page Titles */}
        <Text style={styles.pageTitle}>Complete Your Registration</Text>
        <Text style={styles.pageSubtitle}>Join our community of expert educators.</Text>

        {/* Error Message Display */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#EF4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Form Card */}
        <View style={styles.formCard}>
          
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                style={styles.inputField} 
                placeholder="Enter your full name" 
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="at" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                style={styles.inputField} 
                placeholder="teacher@classdesk.edu"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                style={styles.inputField} 
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarsRow}>
                  <View style={[styles.strengthBar, password.length > 0 ? styles.strengthBarActive : null]} />
                  <View style={[styles.strengthBar, password.length > 4 ? styles.strengthBarActive : null]} />
                  <View style={[styles.strengthBar, password.length > 7 ? styles.strengthBarActive : null]} />
                  <View style={styles.strengthBar} />
                </View>
                <Text style={styles.strengthText}>
                  {password.length < 6 ? 'Too short' : 'Fairly strong password'}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                style={styles.inputField} 
                placeholder="Confirm your password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={styles.registerBtn} 
            activeOpacity={0.8}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerBtnText}>Register</Text>
            )}
          </TouchableOpacity>

        </View>

        {/* Login Redirect */}
        <View style={styles.loginRedirectRow}>
          <Text style={styles.redirectText}>Already registered? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.redirectLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* --- SUCCESS MODAL --- */}
      <Modal visible={showSuccessModal} transparent={true} animationType="fade">
        <View style={styles.successModalContainer}>
          {/* We repeat the decoration in the modal since transparent={true} overlays it */}
          <BackgroundDecorations />
          
          <View style={styles.successContent}>
            <View style={styles.successIconOuter}>
              <View style={styles.successIconInner}>
                <Ionicons name="checkmark" size={40} color="#FFF" />
              </View>
            </View>

            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successSubtitle}>
              Teacher profile has been created{'\n'}and added to the database.
            </Text>

            <TouchableOpacity 
              style={styles.doneBtn} 
              activeOpacity={0.8}
              onPress={() => {
                setShowSuccessModal(false);
                router.back(); 
              }}
            >
              <Text style={styles.doneBtnText}>Return to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  dot: {
    position: 'absolute',
    borderRadius: 100,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#3B3CFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  formCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  strengthContainer: {
    marginTop: 10,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E0E7FF',
    borderRadius: 2,
  },
  strengthBarActive: {
    backgroundColor: '#3B3CFF',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B3CFF',
  },
  registerBtn: {
    backgroundColor: '#3B3CFF',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#3B3CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginRedirectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  redirectText: {
    fontSize: 15,
    color: '#6B7280',
  },
  redirectLink: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3B3CFF',
  },
  footerText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  successModalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successContent: {
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  successIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(236, 253, 245, 0.8)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#D1FAE5',
  },
  successIconInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#10B981', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  doneBtn: {
    backgroundColor: '#3B3CFF',
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B3CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  doneBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});