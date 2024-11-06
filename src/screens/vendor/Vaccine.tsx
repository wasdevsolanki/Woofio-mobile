import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import axios from 'axios';
import { useNavigation, RouteProp } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import colors from '../../styles/colors';
import ButtonComponent from '../../components/Button';
import Input from '../../components/Input';

type Vaccine = {
  id: number;
  vaccine_name: string;
  vaccine_date: string;
  vaccine_expiry_date: string;
  veterinary_name: string;
  detail?: string;
};

type VaccineListProps = {
  route: RouteProp<{ params: { petId: number } }, 'params'>;
};

type NewVaccine = {
  vaccine_name: string;
  vaccine_date: string;
  vaccine_expiry_date: string;
  veterinary_name: string;
  detail: string;
  pet_id: number | null;
};

const Vaccine: React.FC<VaccineListProps> = ({ route }) => {
  const petId = route?.params?.petId || null;
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newVaccine, setNewVaccine] = useState<NewVaccine>({
    vaccine_name: '',
    vaccine_date: '',
    vaccine_expiry_date: '',
    veterinary_name: '',
    detail: '',
    pet_id: null,
  });
  const [vaccineDate, setVaccineDate] = useState<Date | null>(new Date());
  const [expiryDate, setExpiryDate] = useState<Date | null>(new Date());
  const [openVaccineDatePicker, setOpenVaccineDatePicker] = useState(false);
  const [openExpiryDatePicker, setOpenExpiryDatePicker] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const numberOfItemsPerPageList = [5, 10, 50, 100];

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, vaccines.length);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { fontSize: 14 },
      headerRight: () => (
        <Button 
          textColor = {colors.primary} 
          onPress={() => setModalVisible(true)}>
          Add Vaccine
        </Button>
      ),
    });

    const fetchVaccines = async () => {
      try {
        const response = await axios.get(
          `https://dev.virtual-assistant.xyz/api/pet/vaccine?pid=${petId}`,
        );
        setVaccines(response.data.data);
      } catch (error) {
        console.error('Not found:', error);
      }
    };

    fetchVaccines();
  }, [petId, navigation]);

  useEffect(() => {
    setPage(0); // Reset to first page when items per page changes
  }, [itemsPerPage]);

  const handleAddVaccine = async () => {
    const updatedVaccine = {
      ...newVaccine,
      vaccine_date: vaccineDate ? vaccineDate.toISOString().split('T')[0] : '',
      vaccine_expiry_date: expiryDate
        ? expiryDate.toISOString().split('T')[0]
        : '',
      pet_id: petId,
    };
    // console.log('Vaccine: ', updatedVaccine.detail);
    if(! updatedVaccine.vaccine_name) {
      Alert.alert('Field Required', 'Vaccine Name field is required!',);
    }
    if(! updatedVaccine.vaccine_date) {
      Alert.alert('Field Required', 'Vaccine Date field is required!',);
    }
    if(! updatedVaccine.vaccine_expiry_date) {
      Alert.alert('Field Required', 'Vaccine Expiry Date field is required!',);
    }
    if(! updatedVaccine.veterinary_name) {
      Alert.alert('Field Required', 'Veterinary Name field is required!',);
    }
    if(! updatedVaccine.detail) {
      Alert.alert('Field Required', 'Vaccine Detail field is required!',);
    }

    if( updatedVaccine.vaccine_name && 
        updatedVaccine.vaccine_date && 
        updatedVaccine.veterinary_name && 
        updatedVaccine.detail) {
          
        try {
          const response = await axios.post(
            `https://dev.virtual-assistant.xyz/api/pet/vaccine/store`, updatedVaccine,
          );
    
          if (response.status === 200) {
            setVaccines([...vaccines, response.data.data]);
            setModalVisible(false);
          } else {
            Alert.alert('Error', 'Failed to add vaccine');
          }
    
        } catch (error) {
          console.error('Failed to add vaccine:', error);
        }

      }
  };

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <View style={styles.container}>

        <ButtonComponent
            icon='plus-thick' 
            title='Add Vaccine' 
            onPress={() => setModalVisible(true)} 
            buttonColor={colors.green}
            style={{padding: 0, borderRadius: 10}}
        />
        <ScrollView style={styles.scrollView}> 

          {vaccines.length === 0 ? (
              <DataTable.Row>
                  <DataTable.Cell style={styles.noPetsRow}>
                      <Text style={styles.noPetsText}>Client Not Found</Text>
                  </DataTable.Cell>
              </DataTable.Row>
          ) : (
              <DataTable>
              <DataTable.Header style={styles.thead}>
                  <DataTable.Title><Text style={styles.headerText}>Vaccine</Text></DataTable.Title>
                  <DataTable.Title style={styles.th}><Text style={styles.headerText}>Dated</Text></DataTable.Title>
                  <DataTable.Title style={styles.th}><Text style={styles.headerText}>Expiry</Text></DataTable.Title>
                  <DataTable.Title style={styles.th}><Text style={styles.headerText}>Doctor</Text></DataTable.Title>
              </DataTable.Header>

              {vaccines.slice(from, to).map((vaccine) => (
                  <DataTable.Row key={vaccine.id} style={styles.trow}>
                  <DataTable.Cell>
                      <Text style={styles.cellText}>{vaccine.vaccine_name}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.td}>
                      <Text style={styles.cellText}>{formatDateTime(vaccine.vaccine_date)}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.td}>
                      <Text style={styles.cellText}>{formatDateTime(vaccine.vaccine_expiry_date)}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.td}>
                      <Text style={styles.cellText}>{vaccine.veterinary_name}</Text>
                  </DataTable.Cell>
                  </DataTable.Row>
              ))}

              <DataTable.Pagination
                  page={page}
                  numberOfPages={Math.ceil(vaccines.length / itemsPerPage)}
                  onPageChange={(page) => setPage(page)}
                  label={`${from + 1}-${to} of ${vaccines.length}`}
                  numberOfItemsPerPageList={numberOfItemsPerPageList}
                  numberOfItemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  showFastPaginationControls
                  selectPageDropdownLabel={'Rows per page'}
              />
              </DataTable>
          )}
        </ScrollView>

        {/* Modal for Adding a New Vaccine */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Add New Vaccine</Text>

                <Input
                    mode='outlined' 
                    label='Vaccine Name'
                    value={newVaccine.vaccine_name}
                    onChangeText={(text) => setNewVaccine({...newVaccine, vaccine_name: text})}
                />
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setOpenVaccineDatePicker(true)}>
                    <View style={styles.input}>
                        <Text>{vaccineDate ? vaccineDate.toDateString() : 'Select Vaccine Date'}</Text>
                    </View>
                </TouchableOpacity>
                <DatePicker
                    modal
                    open={openVaccineDatePicker}
                    date={vaccineDate || new Date()}
                    mode="date"
                    onConfirm={(date) => {
                        setVaccineDate(date);
                        setOpenVaccineDatePicker(false);
                    }}
                    onCancel={() => setOpenVaccineDatePicker(false)}
                />

                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setOpenExpiryDatePicker(true)}>
                    <View style={styles.input}>
                        <Text>{expiryDate ? expiryDate.toDateString() : 'Select Expiry Date'}</Text>
                    </View>
                </TouchableOpacity>
                <DatePicker
                    modal
                    open={openExpiryDatePicker}
                    date={expiryDate || new Date()}
                    mode="date"
                    onConfirm={(date) => {
                        setExpiryDate(date);
                        setOpenExpiryDatePicker(false);
                    }}
                    onCancel={() => setOpenExpiryDatePicker(false)}
                />

                <Input
                    mode='outlined' 
                    label='Veterinary Name'
                    value={newVaccine.veterinary_name}
                    onChangeText={(text) => setNewVaccine({...newVaccine, veterinary_name: text})}
                />

                <Input
                    mode='outlined' 
                    label='Vaccine Details'
                    value={newVaccine.detail}
                    onChangeText={(text) => setNewVaccine({...newVaccine, detail: text})}
                />

                <ButtonComponent
                    title='Add Vaccine' 
                    onPress={() => handleAddVaccine()} 
                    buttonColor={colors.primary}
                />

                <ButtonComponent
                    title='Close' 
                    onPress={() => setModalVisible(false)} 
                    buttonColor={colors.black}
                />
            </View>
        </Modal>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    marginHorizontal: 5,
  },
  headerText: {
    fontWeight: 'bold',
    color: colors.white,
    fontSize: 14,
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
  trow : {
    width: '100%',
    backgroundColor: colors.blue_lightest,
    marginBottom: 10,
    borderRadius: 10,
  },
  td: {
    flex: 1,
    justifyContent: 'center',
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
  modalView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  modalTitle: {
    fontSize: 25,
    marginBottom: 25,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 15,
    borderColor: colors.textSecondary,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 100,
  },
  datePicker: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addVaccineButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: '100%',
    padding: 15,
  },
  closeButton: {
    backgroundColor: colors.black,
    borderRadius: 20,
    width: '100%',
    padding: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Vaccine;