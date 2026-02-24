import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Added SVG imports
import Svg, { Path, Circle } from 'react-native-svg';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[styles.inputWrapper, { backgroundColor: 'rgba(249, 250, 251, 0.8)' }]}>
              <Ionicons name="at" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                style={[styles.inputField, { color: '#6B7280' }]} 
                value="robert.fox@classdesk.edu" 
                editable={false}
              />
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="phone-portrait-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                style={styles.inputField} 
                placeholder="+1 (555) 000-0000" 
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
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
                value="••••••••" 
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            
            {/* Password Strength Indicator */}
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarsRow}>
                <View style={[styles.strengthBar, styles.strengthBarActive]} />
                <View style={[styles.strengthBar, styles.strengthBarActive]} />
                <View style={styles.strengthBar} />
                <View style={styles.strengthBar} />
              </View>
              <Text style={styles.strengthText}>Fairly strong password</Text>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput 
                style={styles.inputField} 
                value="••••••••" 
                secureTextEntry={true}
              />
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={styles.registerBtn} 
            activeOpacity={0.8}
            onPress={() => setShowSuccessModal(true)}
          >
            <Text style={styles.registerBtnText}>Register</Text>
          </TouchableOpacity>

        </View>

        {/* Login Redirect */}
        <View style={styles.loginRedirectRow}>
          <Text style={styles.redirectText}>Already registered? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.redirectLink}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Terms */}
        <Text style={styles.footerText}>
          By registering, you agree to ClassDesks{'\n'}Terms of Service and Privacy Policy.
        </Text>

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

            <Text style={styles.successTitle}>Success</Text>
            <Text style={styles.successSubtitle}>
              Invitation link has been sent to{'\n'}the email address.
            </Text>

            <TouchableOpacity 
              style={styles.doneBtn} 
              activeOpacity={0.8}
              onPress={() => {
                setShowSuccessModal(false);
                router.back(); 
              }}
            >
              <Text style={styles.doneBtnText}>Done</Text>
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
    backgroundColor: '#F9FAFB',
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
    marginBottom: 30,
    textAlign: 'center',
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