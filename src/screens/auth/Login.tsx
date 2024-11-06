import React, { useContext, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Alert, Text, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { TextInput, Button } from 'react-native-paper'; // Import from react-native-paper
import { RootStackParamList } from '../../types';
import { AuthContext } from '../../utils/AuthContext';
import colors from '../../styles/colors';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
  route: RouteProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUserRole, setAuthUser } = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await axios.post('https://dev.virtual-assistant.xyz/api/auth/login', { email, password });

      if (response.data.token) { 
  
        await AsyncStorage.setItem('authToken', response.data.token);
        await AsyncStorage.setItem('userRole', response.data.user.role);
        await AsyncStorage.setItem('authUser', JSON.stringify(response.data.user));
  
        setUserRole(response.data.user.role);
        setAuthUser(response.data.user);
        setLoading(false);
  
        if (response.data.user.role === 'admin') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Admin' }], 
          });
        } else if (response.data.user.role === 'vendor') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Doctor' }],
          });
        } else if (response.data.user.role === 'user') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Owner' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }

      }

    } catch (error: any) {
      console.error('Login failed:', error.response?.data?.error);
      Alert.alert('Login Error', error.response?.data?.error || 'An error occurred during login.');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.formContainer}>
        <Image style={styles.brandLogo} source={require('../../../assets/images/logo2.png')} />
        <TextInput
          label="Email"
          mode="flat"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          theme={{ colors: { text: colors.white, primary: colors.white, background: colors.primary } }}
          underlineColor={colors.white} 
          textColor={colors.white} 
        />
        <TextInput
          label="Password"
          mode="flat"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          theme={{ colors: { text: colors.white, primary: colors.white, background: colors.primary } }}
          underlineColor={colors.white}
          textColor={colors.white} 
        />
        <Text style={styles.forgetPassword}>Forgot Password</Text>
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.loginButton}
          labelStyle={styles.loginButtonText} 
          loading={loading}
        >
          Login
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  formContainer: {
    width: '80%',
  },
  brandLogo: {
    width: 300,
    resizeMode: 'contain',
    height: 200,
  },
  input: {
    marginBottom: 20,
    backgroundColor: colors.primary, 
    color: colors.white,
  },
  loginButton: {
    backgroundColor: colors.white,
    paddingVertical: 5,
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  forgetPassword: {
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
  },
  registerLink: {
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
