import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../utils/AuthContext';
import colors from '../../styles/colors';

const Client = () => {
  const { authUser } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([9, 10, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchClients = async () => {
        try {
            const ownerId = authUser.id;
            const response = await axios.get(`https://dev.virtual-assistant.xyz/api/doctor/clients?id=${ownerId}`);
            // console.log('Response: ', response.data.client);
            setClients(response.data.client);
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        }
    };

    fetchClients();
  }, []);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, clients.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const handlePetList = async (clientId: any) =>  {
      navigation.navigate('Pet', { clientId });
  };

  return (

      <View style={styles.container}>
        <ScrollView style={styles.scrollView}> 
          <DataTable>
            <DataTable.Header style={styles.thead}>
              <DataTable.Title><Text style={styles.headerText}>Name</Text></DataTable.Title>
              {/* <DataTable.Title style={styles.th}><Text style={styles.headerText}>Email</Text></DataTable.Title> */}
              <DataTable.Title style={styles.th}><Text style={styles.headerText}>Gender</Text></DataTable.Title>
              <DataTable.Title style={styles.th}><Text style={styles.headerText}>Action</Text></DataTable.Title>
            </DataTable.Header>

            {clients.length === 0 ? (
              <DataTable.Row>
                <DataTable.Cell style={styles.noPetsRow}>
                  <Text style={styles.noPetsText}>Client Not Found</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ) : (
              clients.slice(from, to).map((client) => (
                <DataTable.Row key={client.id} style={styles.trow}>
                  <DataTable.Cell>
                      <Text style={styles.cellText}>{client.name}</Text>
                  </DataTable.Cell>
                  {/* <DataTable.Cell style={styles.td}><Text style={styles.cellText}>{client.email}</Text></DataTable.Cell> */}
                  <DataTable.Cell style={styles.td}><Text style={[styles.cellText, styles.genderCell]}>{client.gender}</Text></DataTable.Cell>
                  <DataTable.Cell style={styles.tdAction}>
                    <IconButton
                      icon="paw"
                      size={20}
                      onPress={() => handlePetList(client.id)}
                      style={styles.iconButton}
                    />
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            )}

            <DataTable.Pagination 
              style={styles.pagination}
              page={page}
              numberOfPages={Math.ceil(clients.length / itemsPerPage)}
              onPageChange={(page) => setPage(page)}
              label={`${from + 1}-${to} of ${clients.length}`}
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
    marginBottom: 10,
    borderRadius: 10,
  },
  cellText: {
    color: '#000000',
    fontSize: 12,
    textTransform: 'capitalize'
  },
  genderCell: {
    // textTransform: 'capitalize'
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

export default Client;
