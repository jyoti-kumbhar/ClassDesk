import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path } from 'react-native-svg';

// --- Background Graphics (Provided) ---
const BackgroundDecorations = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {/* Top Right Triangle/Shape */}
    <View style={{ position: "absolute", top: -50, right: -50 }}>
      <Svg height="200" width="200" viewBox="0 0 100 100">
        <Path d="M0 0 L100 0 L100 100 Z" fill="#f1db90" />
        <Path d="M60 5 L90 10 L75 35 Z" fill="#f2444d" /> 
      </Svg>
    </View>

    {/* Squiggles */}
    <View style={{ position: "absolute", top: 220, right: 0, opacity: 0.4 }}>
        <Svg height="100" width="60" viewBox="0 0 60 100">
            <Path d="M10 10 Q 50 30 10 50 T 10 90" stroke="#FF8A65" strokeWidth="3" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", top: 180, left: -10, opacity: 0.3, transform: [{ rotate: '20deg' }] }}>
        <Svg height="60" width="100" viewBox="0 0 100 60">
            <Path d="M10 30 Q 30 10 50 30 T 90 30" stroke="#4461F2" strokeWidth="3" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", top: 380, right: 30, opacity: 0.25, transform: [{ rotate: '-15deg' }] }}>
        <Svg height="80" width="80" viewBox="0 0 80 80">
            <Path d="M10 40 Q 40 10 70 40 T 10 70" stroke="#FFB74D" strokeWidth="2" strokeDasharray="5, 5" fill="none" />
        </Svg>
    </View>
    <View style={{ position: "absolute", top: 450, left: -20, opacity: 0.2 }}>
        <Svg height="120" width="60" viewBox="0 0 60 120">
            <Path d="M30 10 Q 60 40 30 70 T 30 130" stroke="#4FC3F7" strokeWidth="4" fill="none" />
        </Svg>
    </View>

    {/* Top Left Yellow Circle */}
    <View style={[styles.circle, { top: 40, left: -20, backgroundColor: "#f5d29d", width: 100, height: 100 }]} />
    
    {/* Scattered Dots */}
    <View style={[styles.dot, { top: 120, right: 80, backgroundColor: "#657cff" }]} />
    <View style={[styles.dot, { top: 250, left: 30, backgroundColor: "#FFB74D" }]} />
    <View style={[styles.dot, { bottom: 150, right: 20, backgroundColor: "#FF8A65" }]} />
    
    {/* Bottom Left Shapes */}
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
       <Svg height="150" width="300" viewBox="0 0 100 100">
         <Circle cx="20" cy="150" r="150" fill="#f39dbec9" />
         <Path d="M60 80 L30 60 L50 90 Z" fill="#4481f2" opacity={1}/>
       </Svg>
    </View>

    {/* Bottom Right Corner */}
    <View style={{ position: "absolute", bottom: -20, right: -20 }}>
      <View style={{ width: 150, height: 150, backgroundColor: "#63caf3", borderRadius: 60, opacity: 0.5 }} />
       <View style={{ position: 'absolute', bottom: 10, right: 10, width: 80, height: 80, backgroundColor: "#e9967c", borderRadius: 40 }} />
    </View>
  </View>
);

// --- Mock Exam Data ---
const EXAM_DATA = {
  examName: 'Final Term: Biology',
  remainingTime: '44 : 02',
  questions: [
    {
      id: 1,
      number: 1,
      marks: 1.0,
      text: "Which part of the plant cell is responsible for converting light energy into chemical energy during photosynthesis?",
      options: [
        { id: 'A', text: "Chloroplast" },
        { id: 'B', text: "Mitochondria" },
        { id: 'C', text: "Cell Wall" },
        { id: 'D', text: "Vacuole" },
      ]
    },
    {
      id: 2,
      number: 2,
      marks: 1.0,
      text: "What is the primary function of DNA within a cell?",
      options: [
        { id: 'A', text: "Energy Storage" },
        { id: 'B', text: "Protein Synthesis" },
        { id: 'C', text: "Genetic Information Storage" },
        { id: 'D', text: "Structural Support" },
      ]
    }
  ]
};

export default function ActiveExamScreen() {
  // State to track selected answers. Key is question ID, Value is selected Option ID.
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSelectOption = (questionId: number, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundDecorations />

      {/* Top Header Row */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerSubtitle}>CLASSDESK EXAM</Text>
          <Text style={styles.headerTitle}>{EXAM_DATA.examName}</Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>REMAINING</Text>
          <Text style={styles.timerText}>{EXAM_DATA.remainingTime}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Security Warning Banner */}
        <View style={styles.warningBanner}>
          <Ionicons name="shield-checkmark" size={16} color="#B45309" />
          <Text style={styles.warningText}>
            Secure Exam Mode Active. Tab switching is being monitored.
          </Text>
        </View>

        {/* Exam Questions List */}
        {EXAM_DATA.questions.map((q) => (
          <View key={q.id} style={styles.questionCard}>
            
            {/* Question Header (Number & Marks) */}
            <View style={styles.questionHeader}>
              <View style={styles.questionNumberBadge}>
                <Text style={styles.questionNumberText}>QUESTION {q.number}</Text>
              </View>
              <Text style={styles.marksText}>{q.marks.toFixed(1)} Mark</Text>
            </View>

            {/* Question Text */}
            <Text style={styles.questionText}>{q.text}</Text>

            {/* Options List */}
            <View style={styles.optionsContainer}>
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                    onPress={() => handleSelectOption(q.id, opt.id)}
                    activeOpacity={0.7}
                  >
                    {/* Custom Radio Button */}
                    <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    
                    {/* Option Identifier (A, B, C...) */}
                    <Text style={[styles.optionIdText, isSelected && styles.optionIdTextSelected]}>
                      {opt.id}.
                    </Text>
                    
                    {/* Option Text */}
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {opt.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Sticky Bottom Section (Submit Button & FAB) */}
      <View style={styles.bottomSection}>
         {/* Floating Action Button (Theme Toggle) */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Ionicons name="moon" size={20} color="#111827" />
        </TouchableOpacity>

        {/* Submit Exam Button */}
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.9}>
          <Text style={styles.submitBtnText}>Submit Exam</Text>
          <Ionicons name="send" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' // Using a very light gray instead of white to match standard app bg
  },
  
  // Background Graphic Helpers
  circle: { position: "absolute", borderRadius: 999 },
  dot: { position: "absolute", width: 12, height: 12, borderRadius: 6 },

  // Header Styles
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'rgba(255,255,255,0.8)', // Slight transparency to let bg show through
    zIndex: 10,
  },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: '#4F46E5', letterSpacing: 1, marginBottom: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timerLabel: { fontSize: 10, fontWeight: '700', color: '#DC2626', letterSpacing: 0.5 },
  timerText: { fontSize: 18, fontWeight: 'bold', color: '#DC2626' },

  // Scroll Content area
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140, // Space for the sticky submit button
  },

  // Warning Banner
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7', // Light Amber
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 24,
    gap: 10,
  },
  warningText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#92400E', lineHeight: 18 },

  // Question Card
  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  questionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  questionNumberBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  questionNumberText: { fontSize: 10, fontWeight: '800', color: '#4F46E5', letterSpacing: 0.5 },
  marksText: { fontSize: 12, fontWeight: '600', color: '#9CA3AF' },
  questionText: { fontSize: 16, fontWeight: 'bold', color: '#111827', lineHeight: 24, marginBottom: 24 },

  // Options
  optionsContainer: { gap: 12 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent', // Transparent by default so layout doesn't jump on select
  },
  optionRowSelected: {
    backgroundColor: '#EEF2FF', // Light indigo bg
    borderColor: '#C7D2FE', // Indigo border
  },
  
  // Custom Radio Button
  radioCircle: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#D1D5DB',
    alignItems: 'center', justifyContent: 'center', marginRight: 12, backgroundColor: '#FFF'
  },
  radioCircleSelected: { borderColor: '#4F46E5' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4F46E5' },
  
  optionIdText: { fontSize: 14, fontWeight: '800', color: '#6B7280', marginRight: 8 },
  optionIdTextSelected: { color: '#4F46E5' },
  optionText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#4B5563' },
  optionTextSelected: { color: '#111827' }, // Darker text when selected

  // Bottom Section (Submit Button & FAB container)
  bottomSection: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: 'rgba(249, 250, 251, 0.95)', // Slight transparency
  },
  submitBtn: {
    backgroundColor: '#1D4ED8', // Dark Blue
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 10,
  },
  submitBtnText: { fontSize: 16, fontWeight: '800', color: '#FFF' },

  // Floating Action Button
  fab: {
    position: 'absolute',
    top: -65, // Position it right above the submit button container
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  }
});