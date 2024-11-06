import React from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import colors from '../styles/colors';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const Input = ({ label, value, onChangeText, secureTextEntry = false, mode='flat', disabled = false }) => {
  return (
    <TextInput
      mode={mode}
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      disabled={disabled}
      style={styles.input}
      theme={{ colors: { primary: colors.black } }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
});

export default Input;
