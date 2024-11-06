import React, { useContext } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Button } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigation } from '@react-navigation/native';

const AdminDashboard: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.dashboardContainer}>
        <Text style={styles.title}>Admin Dashboard</Text>
        {/* Add admin-specific components and functionality here */}

        {/* Logout Button */}
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
});

export default AdminDashboard;
