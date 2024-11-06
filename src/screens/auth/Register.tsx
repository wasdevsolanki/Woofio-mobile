import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import axios from 'axios';
import colors from '../../styles/colors';

const RegisterScreen: React.FC = ({ navigation }) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const isEmailValid = () => email.includes('@') && email.includes('.');
  const isPasswordMatch = () => password === confirmPassword;
  const isFieldEmpty = (field: string) => field.trim() === '';

  const handleRegister = async () => {
    if (!isEmailValid() || !isPasswordMatch() || isFieldEmpty(name)) {
      return;
    }

    try {
      const response = await axios.post('https://dev.virtual-assistant.xyz/api/auth/register', { name, email, password });
      if (response.status === 200) {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.formContainer}>
        <Image style={styles.brandLogo} source={require('../../../assets/images/logo2.png')} />
        
        <TextInput
          label="Name"
          mode="flat"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (!nameTouched) setNameTouched(true);
          }}
          style={styles.input}
          theme={{ colors: { text: colors.white, primary: colors.white, background: colors.primary } }}
          underlineColor={colors.white}
          textColor={colors.white}
        />
        {nameTouched && (
          <HelperText type="error" visible={isFieldEmpty(name)}>
            Name cannot be empty
          </HelperText>
        )}

        {/* Email Input */}
        <TextInput
          label="Email"
          mode="flat"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (!emailTouched) setEmailTouched(true);
          }}
          style={styles.input}
          theme={{ colors: { text: colors.white, primary: colors.white, background: colors.primary } }}
          underlineColor={colors.white}
          textColor={colors.white}
        />
        {emailTouched && (
          <HelperText type="error" visible={!isEmailValid()}>
            Email address is invalid!
          </HelperText>
        )}

        {/* Password Input */}
        <TextInput
          label="Password"
          mode="flat"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (!passwordTouched) setPasswordTouched(true);
          }}
          secureTextEntry
          style={styles.input}
          theme={{ colors: { text: colors.white, primary: colors.white, background: colors.primary } }}
          underlineColor={colors.white}
          textColor={colors.white}
        />
        {passwordTouched && (
          <HelperText type="error" visible={isFieldEmpty(password)}>
            Password cannot be empty
          </HelperText>
        )}

        {/* Confirm Password Input */}
        <TextInput
          label="Confirm Password"
          mode="flat"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (!confirmPasswordTouched) setConfirmPasswordTouched(true);
          }}
          secureTextEntry
          style={styles.input}
          theme={{ colors: { text: colors.white, primary: colors.white, background: colors.primary } }}
          underlineColor={colors.white}
          textColor={colors.white}
        />
        {confirmPasswordTouched && (
          <HelperText type="error" visible={!isPasswordMatch()}>
            Passwords do not match
          </HelperText>
        )}

        {/* Register Button */}
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.registerButton}
          labelStyle={styles.registerButtonText}
          disabled={
            !isEmailValid() ||
            !isPasswordMatch() ||
            isFieldEmpty(name) ||
            isFieldEmpty(password) ||
            isFieldEmpty(confirmPassword)
          }
        >
          Register
        </Button>

        {/* Login Link */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.LoginLink}>I already have an account</Text>
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
    marginBottom: 10,
    backgroundColor: colors.primary,
  },
  registerButton: {
    backgroundColor: colors.white,
    paddingVertical: 5,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: 14,
  },
  LoginLink: {
    color: colors.white,
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
