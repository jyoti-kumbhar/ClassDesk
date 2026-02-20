import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
// background graphics
import Svg, { Circle, Polygon } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const GeometricBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <Svg height={height} width={width} viewBox={`0 0 ${width} ${height}`}>
      <Polygon
        points={`${width},0 ${width},100 ${width - 80},0`}
        fill="#C5CAE9"
      />
      <Circle
        cx={width - 20}
        cy={100}
        r={80}
        stroke="#FFCC80"
        strokeWidth="1.5"
        fill="transparent"
      />
      <Circle cx={width - 50} cy={50} r={4} fill="#FF9800" /> 
      
      <Circle
        cx={0}
        cy={height * 0.4}
        r={120}
        stroke="#FFCC80"
        strokeWidth="1.5"
        fill="transparent"
      />
      <Circle cx={40} cy={height * 0.35} r={8} fill="#FFCC80" opacity={0.6} />
      <Circle cx={20} cy={height * 0.5} r={4} fill="#64B5F6" />

      <Circle
        cx={width}
        cy={height}
        r={150}
        stroke="#90CAF9"
        strokeWidth="1.5"
        fill="transparent"
        opacity={0.5}
      />
      <Circle
        cx={width - 40}
        cy={height + 20}
        r={120}
        stroke="#FFAB91"
        strokeWidth="1.5"
        fill="transparent"
        opacity={0.6}
      />
      <Polygon
        points={`${width},${height} ${width},${height-150} ${width-100},${height}`}
        fill="#FFE0B2"
        opacity={0.3}
      />
      
      <Circle cx={width * 0.2} cy={height * 0.8} r={3} fill="#90CAF9" />
      <Circle cx={width * 0.8} cy={height * 0.2} r={3} fill="#FFCC80" />
    </Svg>
  </View>
);

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading Bar Animation
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Navigation Timer
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 3500);

    return () => clearTimeout(timer);
    // Added missing dependencies to fix react-hooks/exhaustive-deps
  }, [fadeAnim, progress, router, slideAnim]);

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <GeometricBackground />

      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.centerContent,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="school" size={60} color="white" />
          </View>

          <Text style={styles.title}>ClassDesk</Text>
          <Text style={styles.subtitle}>Empowering Education</Text>
        </Animated.View>

        <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
          <View style={styles.track}>
            <Animated.View style={[styles.bar, { width: widthInterpolate }]} />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#4461F2",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#4461F2",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#90A4AE",
    fontWeight: "500",
  },
  bottomSection: {
    width: "70%",
    alignItems: "center",
    position: "absolute",
    bottom: height * 0.25,
  },
  track: {
    width: "100%",
    height: 10,
    backgroundColor: "#E3F2FD",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 15,
  },
  bar: {
    height: "100%",
    backgroundColor: "#2962FF",
    borderRadius: 5,
  },
  loadingText: {
    color: "#90A4AE",
    fontSize: 14,
    fontWeight: "500",
  },
});
