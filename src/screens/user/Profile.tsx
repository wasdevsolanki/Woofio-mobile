import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Alert, Image, Platform } from 'react-native';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../utils/AuthContext';
import colors from '../../styles/colors';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Input from '../../components/Input';
import Button from '../../components/Button';

const createFormData = (photo, body = {}) => {
  const data = new FormData();
  
  if (photo) {
    data.append('profile_picture', {
      name: photo.assets[0].fileName,
      type: photo.assets[0].type,
      uri: Platform.OS === 'ios' ? photo.assets[0].uri.replace('file://', '') : photo.assets[0].uri,
    });
  }

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};

const EditProfileScreen = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);

  const [name, setName] = useState<string>('');
  const [id, setId] = useState<number>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [profile, setProfile] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [photo, setPhoto] = useState(null); 
  const [errors, setErrors] = useState<any>({});
  
  useEffect(() => { 
    if (authUser) {
      setId(authUser.id);
      setName(authUser.name);
      setEmail(authUser.email);
      setProfile(authUser.profile);
    }
  }, [authUser]);

  // const handleChoosePhoto = () => {
  //   launchImageLibrary({ noData: true }, (response) => {
  //     if (response && response.assets) {
  //       setPhoto(response);
  //     }
  //   });
  // };

  const handleChoosePhoto = () => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: () => launchCamera({ mediaType: 'photo' }, (response) => {
            if (response && response.assets) {
              setPhoto(response);
              setErrors((prev) => ({ ...prev, photo: '' }));
            }
          }),
        },
        {
          text: "Gallery",
          onPress: () => launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response && response.assets) {
              setPhoto(response);
              setErrors((prev) => ({ ...prev, photo: '' }));
            }
          }),
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleUpdateProfile = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      const formData = createFormData(photo, {
        id,
        name,
        email,
        password
      });

      const response = await axios.post(
        'https://dev.virtual-assistant.xyz/api/auth/profile',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.user) {
        const updatedUser = response.data.user;
        await AsyncStorage.setItem('authUser', JSON.stringify(updatedUser));
        setAuthUser(updatedUser);
      }

    } catch (error: any) {
      console.error('Profile update failed:', error.response?.data?.error);
      Alert.alert('Update Error', error.response?.data?.error || 'An error occurred during the profile update.');
    } finally {
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.formContainer}>

        <View style={styles.avatarContainer}>
          {photo ? (
            <Image
              source={{ uri: photo.assets[0].uri }}
              style={styles.uploadImage}
            />
          ) : (
            <Avatar.Image
              style={styles.avatarImage}
              size={120}
              source={{
                uri: 'https://dev.virtual-assistant.xyz/system/public/uploaded_files/user/' + profile,
              }}
            />
          )}
        </View>

        <Button
          icon='camera' 
          title={photo ? 'Change Profile Picture' : 'Upload Profile Picture'}
          onPress={handleChoosePhoto}
          buttonColor={colors.black}
        />

        <Input
          label='Name'
          value={name}
          onChangeText={setName}
          disabled={true}
        />

        <Input
          label='Email'
          value={email}
          onChangeText={setEmail}
          disabled={true}
        />

        <Input
          label='New Password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        
        <Button
          title='Update Profiles'
          onPress={handleUpdateProfile}
          loading={loading}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue_lightest,
  },
  formContainer: {
    width: '80%',
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  avatarImage: {
    alignContent: 'center',
    marginBottom: 60,
  },
  uploadImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
});

export default EditProfileScreen;
