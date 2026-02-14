import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  // Dimensions removed since it wasn't used
} from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Navigate after animation
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [progress, router]);

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* --- Background Decorative Elements --- */}
      <View style={styles.decoTopRight} />
      <View style={styles.decoBottomRightOuter} />
      <View style={styles.decoBottomRightInner} />
      <View style={styles.decoBottomLeft} />
      <View style={styles.decoTinyDot} />

      {/* --- Main Content --- */}
      <View style={styles.contentContainer}>
        {/* Logo Container */}
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🎓</Text>
        </View>

        <Text style={styles.title}>ClassDesk</Text>
        <Text style={styles.subtitle}>Empowering Education</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[styles.progressBar, { width: widthInterpolate }]}
          />
        </View>

        <Text style={styles.loading}>Loading...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFCFC",
    position: "relative",
    overflow: "hidden",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: "#EEEDFA",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logo: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2F3E5C",
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: "#9A9AA6",
    marginBottom: 60,
    fontWeight: "500",
  },
  progressContainer: {
    width: "75%",
    height: 8,
    backgroundColor: "#E0E0F5",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3B71F7",
    borderRadius: 10,
  },
  loading: {
    marginTop: 20,
    color: "#9A9AA6",
    fontSize: 14,
    fontWeight: "500",
  },
  // Decorative Elements
  decoTopRight: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "#2F3E5C",
    opacity: 0.1,
  },
  decoBottomRightOuter: {
    position: "absolute",
    bottom: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: "#FFA500",
    opacity: 0.2,
  },
  decoBottomRightInner: {
    position: "absolute",
    bottom: -60,
    right: -60,
    width: 200,
    height: 200,
    backgroundColor: "#FFE5B4",
    borderRadius: 100,
    opacity: 0.3,
  },
  decoBottomLeft: {
    position: "absolute",
    bottom: 50,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#3B71F7",
    opacity: 0.1,
    transform: [{ translateX: -20 }],
  },
  decoTinyDot: {
    position: "absolute",
    top: 150,
    right: 40,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFA500",
    opacity: 0.4,
  },
});