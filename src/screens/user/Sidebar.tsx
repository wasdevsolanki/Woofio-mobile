import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Sidebar = ({ isOpen, onClose, navigateToPets }) => {
  return isOpen ? (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { onClose(); navigateToPets(); }}>
        <Text style={styles.menuItem}>My Pets</Text>
      </TouchableOpacity>
      <Text style={styles.menuItem}>Dashboard</Text>
      <Text style={styles.menuItem}>Profile</Text>
      <Text style={styles.menuItem}>Settings</Text>
      <Text style={styles.menuItem}>Logout</Text>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#333',
    padding: 20,
    zIndex: 1000,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  menuItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default Sidebar;
