import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import FooterButtons from '../components/FooterButtons';
import { useAuth } from '../context/AuthContext';

 const tasks = [
    { id: "1", title: "Design UI screens", status: "Pending", due: "2025-11-06" },
    { id: "2", title: "Fix login bug", status: "Completed", due: "2025-11-04" },
    { id: "3", title: "Write documentation", status: "In Progress", due: "2025-11-07" },
    { id: "4", title: "screens", status: "Pending", due: "2025-11-06" },
    { id: "5", title: "BUG FIX", status: "Completed", due: "2025-11-04" },
    { id: "6", title: "Coding", status: "In Progress", due: "2025-11-07" },
    { id: "7", title: "Javascript", status: "Pending", due: "2025-11-06" },
    { id: "8", title: "Native Components", status: "Completed", due: "2025-11-04" },
    { id: "9", title: "Mobile Applications", status: "In Progress", due: "2025-11-07" },
    { id: "10", title: "React", status: "Pending", due: "2025-11-06" },
    { id: "11", title: "Web Applications", status: "Completed", due: "2025-11-04" },
    { id: "12", title: "Software Developer", status: "In Progress", due: "2025-11-07" },
  ];

import { Alert } from 'react-native';

export default function DashboardScreen({ navigation }) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log('signOut pressed');
      await signOut();
      console.log('signOut finished');
      // navigate back to the Auth stack (root) so the user sees the Login screen
      navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
    } catch (e) {
      console.warn('signOut error', e);
      Alert.alert('Sign out failed', e?.message || String(e));
    }
  };
  const [filter, setFilter] = useState("All");
  const filteredTasks =
    filter === "All" ? tasks : tasks.filter((task) => task.status === filter);

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <View>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDate}>Due: {item.due}</Text>
      </View>
      <View
        style={[
          item.status === "Completed"
            ? styles.completed
            : item.status === "Pending"
            ? styles.pending
            : styles.inProgress,
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tasks List</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.signout}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setFilter(status)}
              style={[
                styles.filterButton,
                filter === status && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === status && styles.activeFilterText,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          ListEmptyComponent={<Text style={styles.noTask}>No tasks found.</Text>}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
  <FooterButtons onScreen={'Dashboard'} navigation={navigation} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', marginTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '700' },
  signout: { color: '#ffffffff', backgroundColor: "#e76a6aff",paddingVertical: 8,
    paddingHorizontal: 15, borderRadius: 20,  },
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { color: '#6b7280', marginTop: 4 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#e0e0e0",
  },
  activeFilter: {
    backgroundColor: "#007bff",
  },
  filterText: {
    color: "#333",
  },
  activeFilterText: {
    color: "#fff",
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  taskDate: {
    fontSize: 13,
    color: "#777",
  },
  statusBadge: {
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  completed: {
    backgroundColor: "#61b564ff",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  pending: {
    backgroundColor: "#dd3737ff",
    borderRadius: 15,
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  inProgress: {
    backgroundColor: "#73b5eaff",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusText: {
    fontWeight: "600",
    color: "#333",
  },
  noTask: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    elevation: 10,
  },
  footerBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    marginHorizontal: 8,
  },
  footerBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
