import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where
} from 'firebase/firestore';

import { db } from '../../../firebase/firebaseConfig';

export default function ClassAssignmentsScreen() {

  const params = useLocalSearchParams();
  const currentClassId = typeof params.id === "string" ? params.id : "";

  console.log("Class ID:", currentClassId);

  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editTotal, setEditTotal] = useState("100");

  // ================================
  // 1️⃣ FETCH ASSIGNMENTS (SAFE VERSION)
  // ================================

  useEffect(() => {

    if (!currentClassId) {
      console.log("No classId received.");
      setLoading(false);
      return;
    }

    setLoading(true);

    // Primary query (with orderBy)
    const q = query(
      collection(db, "notices"),
      where("classId", "==", currentClassId),
      where("type", "==", "assignment"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log("Assignments fetched:", fetched.length);

        setAssignments(fetched);
        setLoading(false);
      },
      async (error) => {
        console.error("Primary Query Failed:", error.message);

        // 🔥 Fallback without orderBy (if index missing)
        try {
          const fallbackQuery = query(
            collection(db, "notices"),
            where("classId", "==", currentClassId),
            where("type", "==", "assignment")
          );

          const snap = await getDocs(fallbackQuery);

          const fetched = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          console.log("Fallback fetch success:", fetched.length);

          setAssignments(fetched);
        } catch (err) {
          console.error("Fallback also failed:", err);
        }

        setLoading(false);
      }
    );

    return () => unsubscribe();

  }, [currentClassId]);


  // ================================
  // 2️⃣ FETCH STUDENTS & MARKS
  // ================================

  useEffect(() => {

    if (!selectedAssignment || !currentClassId) return;

    const fetchData = async () => {

      setDetailsLoading(true);

      try {

        const studentsQuery = query(
          collection(db, "classMembers"),
          where("classId", "==", currentClassId),
          where("role", "==", "student")
        );

        const marksRef = collection(
          db,
          `assignments/${selectedAssignment.id}/marks`
        );

        const [studentsSnap, marksSnap] = await Promise.all([
          getDocs(studentsQuery),
          getDocs(marksRef)
        ]);

        const loadedMarks: Record<string, string> = {};
        marksSnap.docs.forEach(doc => {
          loadedMarks[doc.id] = doc.data().score;
        });

        const loadedStudents = studentsSnap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || "Unknown",
          status: loadedMarks[doc.id] ? "GRADED" : "PENDING"
        }));

        setStudents(loadedStudents);
        setMarks(loadedMarks);

      } catch (error) {
        console.error("Student/Marks Fetch Error:", error);
      }

      setDetailsLoading(false);
    };

    fetchData();

  }, [selectedAssignment, currentClassId]);


  // ================================
  // 3️⃣ DELETE ASSIGNMENT
  // ================================

  const handleDelete = (id: string) => {
    Alert.alert("Delete Assignment?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "notices", id));
          setSelectedAssignment(null);
        }
      }
    ]);
  };


  // ================================
  // 4️⃣ SAVE MARKS
  // ================================

  const handleSaveMarks = async () => {

    if (!selectedAssignment) return;

    setDetailsLoading(true);

    try {

      const promises = students.map(student => {

        const score = marks[student.id];

        if (!score) return Promise.resolve();

        const markDoc = doc(
          db,
          `assignments/${selectedAssignment.id}/marks`,
          student.id
        );

        return setDoc(markDoc, { score }, { merge: true });
      });

      await Promise.all(promises);

      Alert.alert("Success", "Marks saved!");

    } catch (error) {
      console.error(error);
      Alert.alert("Error saving marks");
    }

    setDetailsLoading(false);
  };


  // ================================
  // UI
  // ================================

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!currentClassId) {
    return (
      <View style={styles.center}>
        <Text>No Class ID provided.</Text>
      </View>
    );
  }

  if (selectedAssignment) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{selectedAssignment.title}</Text>

        {detailsLoading ? (
          <ActivityIndicator />
        ) : (
          students.map(student => (
            <View key={student.id} style={styles.studentRow}>
              <Text>{student.name}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={marks[student.id] || ""}
                onChangeText={(text) =>
                  setMarks(prev => ({ ...prev, [student.id]: text }))
                }
              />
            </View>
          ))
        )}

        <TouchableOpacity style={styles.button} onPress={handleSaveMarks}>
          <Text style={{ color: "#fff" }}>Save Marks</Text>
        </TouchableOpacity>

      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {assignments.length === 0 ? (
        <Text>No assignments found.</Text>
      ) : (
        assignments.map(assignment => (
          <TouchableOpacity
            key={assignment.id}
            style={styles.card}
            onPress={() => setSelectedAssignment(assignment)}
          >
            <Text style={styles.title}>{assignment.title}</Text>
            <Text>Total: {assignment.total || 100}</Text>

            <TouchableOpacity
              onPress={() => handleDelete(assignment.id)}
            >
              <Ionicons name="trash-outline" size={18} color="red" />
            </TouchableOpacity>

          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  card: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    width: 60,
    textAlign: "center",
    borderRadius: 5
  },
  button: {
    marginTop: 20,
    backgroundColor: "#3B3CFF",
    padding: 15,
    alignItems: "center",
    borderRadius: 8
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});