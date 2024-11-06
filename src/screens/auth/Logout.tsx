import React, { useContext } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import colors from '../../styles/colors';
import Button from '../../components/Button';


const LogoutScreen = () => {
  const { logout } = useContext(AuthContext);

  return (
      <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.dashboardContainer}>
            <Text style={styles.content}>Are you sure you want to logout?</Text>
            <Button
              title='Logout'
              onPress={logout}
            />
          </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue_lightest,
  },
  dashboardContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: colors.black,
  },
  logoutButton: {
    width: '100%',
    backgroundColor: colors.primary,
    color: colors.white,
    padding: 10,
    fontSize: 25,
    borderRadius: 25,
  },
});

export default LogoutScreen;
