import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import colors from '../../styles/colors';

const Pet = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [pets, setPets] = useState([]);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([8, 10, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const clientId = route.params?.clientId;

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(`https://dev.virtual-assistant.xyz/api/pet/by_user?id=${clientId}`);
        setPets(response.data.data);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      }
    };

    if (clientId) fetchPets();
  }, [clientId]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, pets.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const handleVaccineTableNavigation = (petId) => {
    navigation.navigate('Vaccine', { petId });
  };

  return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
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
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollView: {
    marginHorizontal: 5,
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
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
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

export default Pet;
