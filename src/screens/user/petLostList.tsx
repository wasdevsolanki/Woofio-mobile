import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../../styles/colors';
import axios from 'axios';

type RootStackParamList = {
    'PetLostList': { petLost: any[] };
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'Pet Detail'>;

const PetLostList: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute();
    const { petLost } = route.params;

  const petProfile = async (petId: any) => {
    try {
      const response = await axios.get(`https://dev.virtual-assistant.xyz/api/pet/profile?id=${petId}`);
  
      if (response.data.pet) {
        const pet = response.data;
        navigation.navigate('Pet Detail', { pet });
      } else {
        console.error('Pet data not found');
      }
    } catch (error) {
      console.error('Failed to fetch pet:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {petLost && petLost.length > 0 ? (
        petLost.map((pet: any) => (
            <TouchableOpacity onPress={() => petProfile(pet.pet.id)}>
                <View key={pet.id} style={styles.petItem}>
                    <Image 
                    source={{ uri: pet.profile }} 
                    style={styles.petImage} 
                    resizeMode="cover" 
                    />
                    <Text style={styles.petName}>{pet.pet.pet_name}</Text>
                    <Text style={styles.petLostNote}>{pet.pet_lost_note}</Text>
                    <Text style={styles.petLostDate}>Lost on: {pet.lost_date}</Text>
                </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No lost pets in your area.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.blue_light,
  },
  petItem: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000', 
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2, 
  },
  petImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  petName: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  petLostNote: {
    fontSize: 16,
    color: 'gray',
  },
  petLostDate: {
      padding: 10,
      fontSize: 14,
      marginTop: 10,
      borderRadius: 8,
      color: colors.black,
      backgroundColor: colors.blue_light,
  },
});

export default PetLostList;
