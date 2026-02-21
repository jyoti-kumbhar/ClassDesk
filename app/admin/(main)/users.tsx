import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data ---
const TEACHERS_DATA = [
  {
    id: '1',
    name: 'Robert Fox',
    email: 'robert.fox@classdesk.edu',
    subject: 'MATHEMATICS',
    subjectColor: '#3B3CFF',
    icon: 'book',
    status: 'online', // green dot
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Robert',
  },
  {
    id: '2',
    name: 'Jenny Wilson',
    email: 'jenny.w@classdesk.edu',
    subject: 'ENGLISH & ARTS',
    subjectColor: '#D97706',
    icon: 'language',
    status: 'online',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Jenny',
  },
  {
    id: '3',
    name: 'Guy Hawkins',
    email: 'guy.h88@classdesk.edu',
    subject: 'MODERN HISTORY',
    subjectColor: '#059669',
    icon: 'earth',
    status: 'offline', // grey dot
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Guy',
  },
  {
    id: '4',
    name: 'Bessie Cooper',
    email: 'bessie.c@classdesk.edu',
    subject: 'PHYSICS',
    subjectColor: '#7C3AED',
    icon: 'flask',
    status: 'online',
    avatar: 'https://api.dicebear.com/7.x/avataaars/png?seed=Bessie',
  },
];

// --- Main Component ---
export default function AdminUsersScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>Teachers</Text>
        <Text style={styles.subtitleText}>Manage all educator profiles</Text>
      </View>

      {/* Primary Action Button */}
      <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
        <Ionicons name="person-add" size={20} color="#FFF" style={styles.addIcon} />
        <Text style={styles.addButtonText}>Add Teacher</Text>
      </TouchableOpacity>

      {/* Search and Filter Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search teachers..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Teachers List */}
      <View style={styles.listContainer}>
        {TEACHERS_DATA.map((teacher) => (
          <View key={teacher.id} style={styles.card}>
            
            {/* Avatar Section */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: teacher.avatar }} style={styles.avatarImage} />
              </View>
              {/* Status Indicator */}
              <View style={[
                styles.statusDot, 
                { backgroundColor: teacher.status === 'online' ? '#10B981' : '#D1D5DB' }
              ]} />
            </View>

            {/* Teacher Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.nameText}>{teacher.name}</Text>
              <Text style={styles.emailText}>{teacher.email}</Text>
              
              <View style={styles.subjectRow}>
                {/* @ts-ignore - Dynamic icon name */}
                <Ionicons name={teacher.icon} size={14} color={teacher.subjectColor} />
                <Text style={[styles.subjectText, { color: teacher.subjectColor }]}>
                  {teacher.subject}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

          </View>
        ))}
      </View>
      
    </ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Matches layout background
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  subtitleText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
  },

  // Add Button
  addButton: {
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
    shadowRadius: 10,
    elevation: 8,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Search & Filter
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },

  // List Cards
  listContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  
  // Avatar
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6', // Fallback color
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  // Details
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  emailText: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
});