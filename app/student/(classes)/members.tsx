import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// --- Mock Data ---
const STUDENTS_DATA = [
  { id: '1', name: 'Alexander Thompson', rollNo: '10A01', studentId: '#8291' },
  { id: '2', name: 'Beatrice Miller', rollNo: '10A02', studentId: '#8292' },
  { id: '3', name: 'Charlie Davis', rollNo: '10A03', studentId: '#8293' },
  { id: '4', name: 'Diana Prince', rollNo: '10A04', studentId: '#8294' },
  { id: '5', name: 'Ethan Hunt', rollNo: '10A05', studentId: '#8295' },
  { id: '6', name: 'Fiona Gallagher', rollNo: '10A06', studentId: '#8296' },
];

export default function MembersScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Information */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Class Students</Text>
          <Text style={styles.pageSubtitle}>Class 10-A • 24 Students total</Text>
        </View>

        {/* Students List */}
        <View style={styles.listContainer}>
          {STUDENTS_DATA.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentDetails}>
                Roll No: {student.rollNo} • Student ID: {student.studentId}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' // Standard light background
  },
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 24, 
    paddingBottom: 120 // Space for the bottom nav bar
  },

  // Header Styles
  pageHeader: { 
    marginBottom: 24 
  },
  pageTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#111827', 
    marginBottom: 6 
  },
  pageSubtitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#6B7280' 
  },

  // List Styles
  listContainer: {
    gap: 12
  },
  studentCard: { 
    backgroundColor: '#FFF', 
    paddingVertical: 20, 
    paddingHorizontal: 16,
    borderRadius: 16, 
    alignItems: 'center', // Centers the text horizontally
    justifyContent: 'center',
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 6, 
    elevation: 1 
  },
  studentName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#111827', 
    marginBottom: 6 
  },
  studentDetails: { 
    fontSize: 12, 
    color: '#6B7280', 
    fontWeight: '600' 
  },
});