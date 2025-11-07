import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function FooterButtons({ onAddTask, onScreen, navigation }) {
  // compute dynamic style at render time because StyleSheet cannot access props
  const addBtnStyle = [
    styles.footerBtn,
    onScreen === 'Dashboard' ? { backgroundColor: '#9bb3cdff' } : {backgroundColor: '#007bff',},
  ];

  const onClickTaskDetails = () => {
    debugger;
    // Navigate to the TaskDetail screen when button is pressed.
    // Use the provided navigation prop (if available).
    // if (navigation && typeof navigation.navigate === 'function') {
      // Try direct route first — most apps register TaskDetail on the same navigator
      navigation.navigate('TaskDetail');
    // }
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={addBtnStyle} onPress={onAddTask} disabled={onScreen === 'Dashboard'}>
        <Text style={styles.footerBtnText}>Dashboard</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerBtn} onPress={onClickTaskDetails}>
        <Text style={styles.footerBtnText}>Task Details</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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