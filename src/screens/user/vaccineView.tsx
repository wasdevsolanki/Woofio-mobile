import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../utils/AuthContext';
import axios from 'axios';


const VaccineView = () => {
    const { authUser } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [vaccines, setVaccines] = useState([]);

  // Fetch pets when the screen loads
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const ownerId = authUser.id;
        const response = await axios.get(`https://dev.virtual-assistant.xyz/api/pet/by_user?id=${ownerId}`);
        setPets(response.data.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    fetchPets();
  }, []);

  // Fetch vaccines when a pet is selected
  useEffect(() => {
    if (selectedPet) {
      const fetchVaccines = async () => {
        try {
          const response = await axios.get(`https://your-api.com/api/pets/${selectedPet}/vaccines`);
          setVaccines(response.data);
        } catch (error) {
          console.error('Error fetching vaccines:', error);
        }
      };
      fetchVaccines();
    }
  }, [selectedPet]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Pet</Text>

      {/* Dropdown for selecting pets */}
      <Picker
        selectedValue={selectedPet}
        onValueChange={(itemValue) => setSelectedPet(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a pet" value={null} />
        {pets.map((pet) => (
          <Picker.Item key={pet.id} label={pet.pet_name} value={pet.id} />
        ))}
      </Picker>

      {/* Display vaccines */}
      {selectedPet && vaccines.length > 0 && (
        <FlatList
          data={vaccines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.vaccineItem}>
              <Text style={styles.vaccineText}>{item.name}</Text>
              <Text style={styles.vaccineDate}>Date: {item.date}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  vaccineItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  vaccineText: {
    fontSize: 16,
  },
  vaccineDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default VaccineView;
