import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SendButton = ({ onPress, title, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#128C7E',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9', // Disabled color
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SendButton;
