import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data ---
const TEACHERS_DATA = [
  { id: 't1', name: 'Robert Fox', role: 'Mathematics\n(Lead)', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Robert' },
  { id: 't2', name: 'Sarah Wilson', role: 'Physics', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Sarah' },
  { id: 't3', name: 'James Miller', role: 'Chemistry', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=James' },
  { id: 't4', name: 'Elena Rodriguez', role: 'English Literature', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Elena' },
];

const STUDENTS_DATA = [
  { id: 's1', name: 'Alex Johnson', rollNo: 'Roll No: #1024', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Alex' },
  { id: 's2', name: 'Sarah Wilson', rollNo: 'Roll No: #1025', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Sarah2' },
  { id: 's3', name: 'Michael King', rollNo: 'Roll No: #1026', initials: 'MK' }, // Example of initial-based avatar
  { id: 's4', name: 'David Chen', rollNo: 'Roll No: #1027', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=David' },
  { id: 's5', name: 'James Miller', rollNo: 'Roll No: #1028', avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=James2' },
];

export default function ClassMembersScreen() {
  const [activeTab, setActiveTab] = useState<'Teachers' | 'Students'>('Teachers');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Class Members</Text>
        <Text style={styles.subTitle}>
          {activeTab === 'Teachers' 
            ? `GRADE 10-A • ${TEACHERS_DATA.length} ACTIVE MEMBERS` 
            : `GRADE 10-A • ${STUDENTS_DATA.length} STUDENTS`}
        </Text>
      </View>

      {/* Toggle Switch */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleBtn, activeTab === 'Teachers' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('Teachers')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, activeTab === 'Teachers' && styles.toggleTextActive]}>
            Teachers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.toggleBtn, activeTab === 'Students' && styles.toggleBtnActive]}
          onPress={() => setActiveTab('Students')}
          activeOpacity={0.8}
        >
          <Text style={[styles.toggleText, activeTab === 'Students' && styles.toggleTextActive]}>
            Students
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- TEACHERS VIEW --- */}
      {activeTab === 'Teachers' && (
        <View style={styles.tabContent}>
          {/* Add Member Button */}
          <TouchableOpacity style={styles.addMemberBtn} activeOpacity={0.8}>
            <Ionicons name="person-add" size={20} color="#FFF" style={styles.addIcon} />
            <Text style={styles.addMemberBtnText}>Add Member</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>FACULTY MEMBERS</Text>

          <View style={styles.listContainer}>
            {TEACHERS_DATA.map((teacher) => (
              <View key={teacher.id} style={styles.memberCard}>
                <View style={[styles.avatarBox, { backgroundColor: '#E0E7FF' }]}>
                  <Image source={{ uri: teacher.avatar }} style={styles.avatarImg} />
                </View>
                
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{teacher.name}</Text>
                  <Text style={styles.memberRole}>{teacher.role}</Text>
                </View>

                <TouchableOpacity style={styles.deleteBtn}>
                  <Ionicons name="trash" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* --- STUDENTS VIEW --- */}
      {activeTab === 'Students' && (
        <View style={styles.tabContent}>
          
          {/* Search Row */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search student..."
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <TouchableOpacity style={styles.addStudentBtn}>
              <Ionicons name="person-add" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            {STUDENTS_DATA.map((student) => (
              <View key={student.id} style={styles.memberCard}>
                
                {/* Conditionally Render Avatar or Initials */}
                {student.avatar ? (
                  <View style={[styles.avatarBox, { backgroundColor: '#F3F4F6' }]}>
                    <Image source={{ uri: student.avatar }} style={styles.avatarImg} />
                  </View>
                ) : (
                  <View style={[styles.avatarBox, { backgroundColor: '#F3F4F6' }]}>
                    <Text style={styles.avatarInitials}>{student.initials}</Text>
                  </View>
                )}
                
                <View style={styles.memberDetails}>
                  <Text style={styles.memberName}>{student.name}</Text>
                  <Text style={styles.memberRole}>{student.rollNo}</Text>
                </View>

                <TouchableOpacity style={styles.deleteBtn}>
                  <Ionicons name="trash" size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </View>
      )}

    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light grey app background
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  
  // Header
  headerSection: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // Toggle Switch
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#3B3CFF',
  },

  tabContent: {
    flex: 1,
  },

  // Teachers View specific
  addMemberBtn: {
    backgroundColor: '#3B3CFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#3B3CFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addIcon: {
    marginRight: 8,
  },
  addMemberBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 16,
  },

  // Students View Specific
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  addStudentBtn: {
    width: 54,
    height: 54,
    backgroundColor: '#3B3CFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B3CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  // Common List/Card Styles
  listContainer: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  memberDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2', // Light red background
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});