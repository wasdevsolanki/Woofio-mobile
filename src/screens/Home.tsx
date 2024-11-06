import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Home(): React.JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.homeContainer}>
        <Image
          source={require('../../assets/images/logo2.png')}
          style={styles.logo}
        />
        <Text style={styles.headingText}>Woofio Pet Gadgets</Text>
        <Text style={styles.description}>
          Your ultimate companion for pet care. Track, manage, and enjoy everything about your furry friend.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 250,
    height: 80,
    marginBottom: 10,
  },
  headingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    marginTop: 5,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Home;
