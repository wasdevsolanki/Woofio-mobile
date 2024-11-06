import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import colors from '../../styles/colors';
import axios from 'axios';
import { AuthContext } from '../../utils/AuthContext';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';

type RootStackParamList = {
  QRLost: { qrData: string };
};

const QRLostScreen = () => {
  const navigation = useNavigation();
  const { authUser } = useContext(AuthContext);
  const route = useRoute<RouteProp<RootStackParamList, 'QRLost'>>();
  const [QR, setQR] = useState(route.params.QR);
  const [pets, setPets] = useState<any[]>([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const ownerId = authUser.id;
        const response = await axios.get(`https://dev.virtual-assistant.xyz/api/pet/by_user?id=${ownerId}`);
        if (response.data.data) {
          setPets(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      }
    };

    fetchPets();
  }, [authUser]);

  const applyQR = async (petId: number) => {
    try {
      const response = await axios.post(
        `https://dev.virtual-assistant.xyz/api/pet/lost_qr`, 
        {       
          pet_id: petId,
          qr_code: QR.qrData,
        }
      );

      if (response.data.pet) {
        // console.log('QR applied successfully:', response.data.pet);
        Alert.alert('Success', 'New QR is updated!');
        navigation.navigate('User Dashboard');
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.Container}>
        <Text style={styles.Title}>Apply QR</Text>
        {pets.map((pet, index) => (
              <Card.Title
                key={index}
                style={styles.cardTitle}
                titleStyle={styles.titleStyle}
                subtitleStyle={styles.subtitleStyle}
                title={pet.pet_name}
                subtitle={`Gender: ${pet.gender}`}
                left={(props) => (
                  <Avatar.Image
                      {...props}
                      size={50}
                      source={{ uri: `https://dev.virtual-assistant.xyz/system/public/uploaded_files/pet/${pet.profile}` }}
                      style={styles.avatar}
                  />
                )}
                right={(props) => (
                    <Button
                        title='Apply'
                        onPress={()=> applyQR(pet.id)}
                        style={{ padding:0, marginTop: 10 }} 
                        buttonColor={colors.primary}
                    />
                )}
            />
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.white,
  },
  Title: {
    textAlign: 'center',
    fontSize: 20,
    padding: 15,
    color: colors.primary,
    backgroundColor: colors.blue_lightest,
    marginBottom: 20,
    borderRadius: 40,
  },
  cardTitle: {
    backgroundColor: colors.blue_light,
    padding: 10,
    borderRadius: 40,
    marginBottom: 15,
    width: '100%',
    fontSize: 12,
  },
  titleStyle: {
    fontSize: 18,
    color: colors.black,
    fontFamily: 'Freude',
    textTransform: 'capitalize',
  },
  subtitleStyle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  avatar: {
    backgroundColor: colors.blue_light,
  },
});

export default QRLostScreen;
