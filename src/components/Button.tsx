// ButtonComponent.tsx
import React from 'react';
import { Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import colors from '../styles/colors';

const ButtonComponent = ({
  title = '',
  onPress = null,
  mode = 'contained',
  icon = '',
  loading = false,
  disabled = false,
  buttonColor = colors.primary,
  textColor = colors.white,
  style = {},
}) => {
  return (
    <Button
      icon={icon}
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={loading || disabled}
      buttonColor={buttonColor}
      textColor={textColor}
      style={[styles.button, style]}
    >
      {loading ? 'Loading...' : title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 25,
    marginBottom: 10,
    width: '100%',
  },
});

export default ButtonComponent;