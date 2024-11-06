import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../utils/AuthContext';
import colors from '../../styles/colors';

const PetList = () => {
  const { authUser } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([10, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const ownerId = authUser.id;
        const response = await axios.get(`https://dev.virtual-assistant.xyz/api/pet/by_user?id=${ownerId}`);
        setPets(response.data.data);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      }
    };

    fetchPets();
  }, []);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, pets.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const handleVaccineTableNavigation = (petId) => {
    navigation.navigate('Vaccine List', { petId });
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/woofio-bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <DataTable>
          <DataTable.Header style={styles.thead}>
            <DataTable.Title><Text style={styles.headerText}>Name</Text></DataTable.Title>
            <DataTable.Title style={styles.th}><Text style={styles.headerText}>Breed</Text></DataTable.Title>
            <DataTable.Title style={styles.th}><Text style={styles.headerText}>Age</Text></DataTable.Title>
            <DataTable.Title style={styles.th}><Text style={styles.headerText}>Action</Text></DataTable.Title>
          </DataTable.Header>

          {pets.length === 0 ? (
            <DataTable.Row>
              <DataTable.Cell style={styles.noPetsRow}>
                <Text style={styles.noPetsText}>No pets found</Text>
              </DataTable.Cell>
            </DataTable.Row>
          ) : (
            pets.slice(from, to).map((pet) => (
              <DataTable.Row key={pet.id} style={styles.trow}>
                <DataTable.Cell><Text style={styles.cellText}>{pet.pet_name}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.td}><Text style={styles.cellText}>{pet.breed}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.td}><Text style={styles.cellText}>{pet.pet_age}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.tdAction}>
                  <IconButton
                    icon="needle"
                    size={20}
                    onPress={() => handleVaccineTableNavigation(pet.id)}
                    style={styles.iconButton}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))
          )}

          <DataTable.Pagination 
            style={styles.pagination}
            page={page}
            numberOfPages={Math.ceil(pets.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${pets.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
          />
        </DataTable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
  },
  thead: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 10,
  },
  th: {
    flex: 1,
    justifyContent: 'center',
  },
  td: {
    flex: 1,
    justifyContent: 'center',
  },
  tdAction: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerText: {
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
  },
  trow : {
    width: '100%',
    backgroundColor: colors.blue_lightest,
    marginBottom: 5,
    borderRadius: 10,
  },
  cellText: {
    color: '#000000',
    fontSize: 12,
  },
  noPetsRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 10,
    backgroundColor: colors.secondary,

  },
  noPetsText: {
    color: '#000000',
    fontSize: 14,
  },
  pagination: {
    color: '#000000',
  },
  iconButton: {
    backgroundColor: 'white',
    color: 'white',
    borderRadius: 10,
  },
});

export default PetList;
