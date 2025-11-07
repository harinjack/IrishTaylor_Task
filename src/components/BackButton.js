import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BackButton({ style }) {
  const navigation = useNavigation();

  const handlePress = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.btn, style]}>
      <Text style={styles.arrow}>‹ Back</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  arrow: {
    fontSize: 16,
    color: '#374151',
  },
});
