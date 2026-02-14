import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Custom SVG Background Component
const SvgBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
      <Defs>
        <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#E91E63" />
          <Stop offset="100%" stopColor="#C2185B" />
        </LinearGradient>
      </Defs>
      {/* Top Wave */}
      <Path
        d={`M0 0 L${width} 0 L${width} ${height * 0.15} C${width * 0.75} ${height * 0.25} ${width * 0.25} ${height * 0.05} 0 ${height * 0.15} Z`}
        fill="url(#grad1)"
      />
      {/* Bottom Wave (Dark) */}
      <Path
        d={`M0 ${height} L${width} ${height} L${width} ${height * 0.8} C${width * 0.75} ${height * 0.7} ${width * 0.25} ${height * 0.9} 0 ${height * 0.8} Z`}
        fill="#212121"
      />
      {/* Bottom Wave (Pink) */}
      <Path
        d={`M0 ${height * 0.8} C${width * 0.25} ${height * 0.9} ${width * 0.75} ${height * 0.7} ${width} ${height * 0.8} L${width} ${height * 0.65} C${width * 0.75} ${height * 0.55} ${width * 0.25} ${height * 0.75} 0 ${height * 0.65} Z`}
        fill="url(#grad1)"
        opacity="0.9"
      />
    </Svg>
  </View>
);

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSignup = () => {
    console.log('Signup:', { email, username, dob, password, rememberMe });
    // Add your signup logic here
  };

  return (
    <View style={styles.container}>
      <SvgBackground />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
              style={styles.input}
              placeholder="Email or Mobile"
              placeholderTextColor="#9E9E9E"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#9E9E9E"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Date of Birth"
              placeholderTextColor="#9E9E9E"
              value={dob}
              onChangeText={setDob}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9E9E9E"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={styles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <Ionicons
                name={rememberMe ? 'checkbox' : 'square-outline'}
                size={24}
                color={rememberMe ? '#E91E63' : '#9E9E9E'}
              />
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignup} style={styles.buttonContainer}>
              <ExpoLinearGradient
                colors={['#E91E63', '#C2185B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Signup</Text>
              </ExpoLinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/login')} style={styles.loginLink}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextHighlight}>Log In</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>or connect with</Text>
              <View style={styles.socialIcons}>
                <TouchableOpacity style={styles.socialIcon}>
                  <FontAwesome name="instagram" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIcon}>
                  <FontAwesome name="twitter" size={24} color="white" />
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
    backgroundColor: 'white',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingTop: height * 0.15, // Push content below the top wave
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#212121',
    marginBottom: 15,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginLeft: 10,
  },
  rememberMeText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#757575',
  },
  buttonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loginText: {
    fontSize: 14,
    color: '#757575',
  },
  loginTextHighlight: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto', // Push to the bottom
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: 'white', // White to contrast with the dark bottom wave
    marginBottom: 15,
  },
  socialIcons: {
    flexDirection: 'row',
  },
  socialIcon: {
    marginHorizontal: 15,
  },
});