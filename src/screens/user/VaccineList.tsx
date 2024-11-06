import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Modal, TextInput, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import axios from 'axios';
import { useNavigation, RouteProp } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import colors from '../../styles/colors';

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

const VaccineList: React.FC<VaccineListProps> = ({ route }) => {
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
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
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
      {vaccines.length === 0 ? (
        <Text style={styles.message}>No vaccine found</Text>
      ) : (
        <DataTable>
          <DataTable.Header style={styles.thead}>
            <DataTable.Title><Text style={styles.headerText}>Name</Text></DataTable.Title>
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

      {/* Modal for Adding a New Vaccine */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Vaccine</Text>

          <TextInput
            style={styles.input}
            placeholder="Vaccine Name"
            value={newVaccine.vaccine_name}
            onChangeText={(text) => setNewVaccine({...newVaccine, vaccine_name: text})}
          />

          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setOpenVaccineDatePicker(true)}>
            <View style={styles.input}>
              <Text>
                {vaccineDate ? vaccineDate.toDateString() : 'Select Vaccine Date'}
              </Text>
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

          <TextInput
            style={styles.input}
            placeholder="Veterinary Name"
            value={newVaccine.veterinary_name}
            onChangeText={(text) => setNewVaccine({...newVaccine, veterinary_name: text})}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Vaccine Details"
            value={newVaccine.detail}
            onChangeText={(text) => setNewVaccine({...newVaccine, detail: text})}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={[styles.button, styles.addVaccineButton]}
            onPress={handleAddVaccine}>
            <Text style={styles.buttonText}>Add Vaccine</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.closeButton]}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
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
    marginBottom: 5,
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
  message: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.textSecondary,
    textTransform: 'capitalize',
    padding: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: colors.black,
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: colors.white,
  },
  textArea: {
    height: 100,
  },
  datePicker: {
    width: '100%',
    // marginBottom: 10,
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

export default VaccineList;