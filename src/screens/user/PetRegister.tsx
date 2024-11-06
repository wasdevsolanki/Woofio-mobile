import React, { useState, useContext } from 'react';
import { View, Text, Alert, Modal, TouchableOpacity, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../utils/AuthContext';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Input from '../../components/Input';
import ButtonComponent from '../../components/Button';
import colors from '../../styles/colors';

const createFormData = (photo, body = {}) => {
  const data = new FormData();

  if (photo) {
    data.append('photo', {
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

type PetRegisterProps = {
  route: RouteProp<RootStackParamList, 'Pet Register'>;
};

const PetRegister: React.FC<PetRegisterProps> = ({ route }) => {
  const { qrData } = route.params || {};
  const { authUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState<Date | null>(new Date());
  const [category, setCategory] = useState('');
  const [gender, setGender] = useState('');
  const [breedType, setBreedType] = useState('');
  const [color, setColor] = useState('');
  const [breed, setBreed] = useState('');
  const [specialInstruction, setSpecialInstruction] = useState('');
  const [openAgeDatePicker, setOpenAgeDatePicker] = useState(false);
  const [QR, setQR] = useState(route.params);
  const [rfid, setRFID] = useState('');
  const [breeds, setBreeds] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [photo, setPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState<boolean>(true);
  const [errors, setErrors] = useState<any>({});

  // const handleChoosePhoto = () => {
  //   launchImageLibrary({ noData: true }, (response) => {
  //     if (response && response.assets) {
  //       setPhoto(response);
  //       setErrors((prev) => ({ ...prev, photo: '' }));
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
  

  const petColors = {
    dog: [
      "Negro", "Blanco", "Café", "Gris", "G", "Rojo", "Azul/Gris", "Atigrado", "Merle",
      "Amarillo", "Crema", "Blanco/Amarillo", "Sable", "Tricolor", "Bicolor"
    ],
    cat: [
      "Negro", "Blanco", "Café", "Gris", "Orange", "Calico", "Tabby", "Tortoiseshell", 
      "Azul/Gris", "Crema", "Lilac", "Chocolate", "Seal", "Rojo", "Bicolor", "Pointed"
    ]
  };

  const registerPet = async () => {
    let validationErrors = {};
    
    if (!petName) validationErrors['petName'] = 'Pet name is required';
    if (!category) validationErrors['category'] = 'Category is required';
    if (!gender) validationErrors['gender'] = 'Gender is required';
    if (!breedType) validationErrors['breedType'] = 'Breed type is required';
    if (!breed) validationErrors['breed'] = 'Breed is required';
    if (!color) validationErrors['color'] = 'Color is required';
    if (!photo) validationErrors['photo'] = 'Photo is required';

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }

    if (!authUser) {
      Alert.alert('Error', 'No authenticated user found.');
      return;
    }

    try {
      const formData = createFormData(photo, {
        user_id: authUser.id.toString(),
        qr_id: qrData || '',
        pet_name: petName,
        pet_age: petAge ? petAge.toISOString().split('.')[0] : '',
        category,
        gender,
        breed_type: breedType,
        breed,
        special_instruction: specialInstruction,
        rfid,
        color,
      });

      const response = await axios.post('https://dev.virtual-assistant.xyz/api/pet/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Pet registered successfully!');
        // console.log(response.data);
        navigation.navigate('User Dashboard');
      } else {
        Alert.alert('Error', 'Failed to register pet');
      }
    } catch (error) {
      Alert.alert('Error:', '');
    }
  };

  const fetchBreeds = async (category: string) => {
    try {
      const response = await axios.get(`https://www.localizadorwoofio.com/api/pet/breed?category=${category}`);
      if (response.status === 200) {
        const breedData = response.data.breed;
        if (Array.isArray(breedData)) {
          setBreeds(breedData.map(breed => breed.name));
        } else {
          setBreeds([]);
        }
      }
    } catch (error) {
      setBreeds([]);
    }
  };

  const handleCategoryChange = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setErrors((prev) => ({ ...prev, category: '' }));

    if (selectedCategory) {
      fetchBreeds(selectedCategory);
      setAvailableColors(petColors[selectedCategory]);
    } else {
      setBreeds([]);
      setAvailableColors([]);
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.Title}>Pet Register</Text>
          
          {photo && (
            <View style={styles.uploadImageContainer}>
              <Image
                source={{ uri: photo.assets[0].uri }}
                style={styles.uploadImage}
              />
            </View>
          )}

          {/* <Button 
            style={{ marginBottom: 20 }} 
            buttonColor='black'
            textColor='white' 
            icon="camera" 
            mode="outlined" 
            onPress={handleChoosePhoto}
          >
            Upload Profile
          </Button> */}

          <ButtonComponent
            icon="camera" 
            buttonColor={colors.black}
            title='Upload Profile'
            onPress={handleChoosePhoto}
            style={{marginBotton:20}}
          />
          {errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}

          {/* <Text style={styles.label}>Pet Name</Text>
          <TextInput
            label="Pet Name"
            value={petName}
            onChangeText={setPetName}
            mode="outlined"
            style={styles.input}
            placeholder="Enter Pet Name"
          /> */}
          <Input
            mode='outlined' 
            label='Pet Name'
            value={petName}
            onChangeText={setPetName}
          />
          {errors.petName && <Text style={styles.errorText}>{errors.petName}</Text>}

          <Text style={styles.label}>Pet Age</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setOpenAgeDatePicker(true)}
          >
            <View style={[styles.input, styles.inputDate]}>
              <Text style={styles.inputDateText}>{petAge ? petAge.toDateString() : 'Select Pet Age'}</Text>
            </View>
          </TouchableOpacity>
          <DatePicker
            modal
            open={openAgeDatePicker}
            date={petAge || new Date()}
            mode="date"
            onConfirm={(date) => {
              setPetAge(date);
              setOpenAgeDatePicker(false);
            }}
            onCancel={() => setOpenAgeDatePicker(false)}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={handleCategoryChange}
              style={styles.picker}
            >
              <Picker.Item label="Select Pet Category" value="" />
              <Picker.Item label="Cat" value="cat" />
              <Picker.Item label="Dog" value="dog" />
            </Picker>
          </View>
          {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Pet Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

          {/* <Text style={styles.label}>Breed Type</Text>
          <TextInput
            label="Breed Type"
            value={breedType}
            onChangeText={setBreedType}
            mode="outlined"
            style={styles.input}
            placeholder="Enter Breed Type"
          /> */}

          <Text style={styles.label}>Breed Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={breedType}
              onValueChange={(itemValue) => setBreedType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Breed Type" value="" />
              <Picker.Item label="Purebreed" value="Purebreed" />
              <Picker.Item label="Mixed" value="Mixed" />
            </Picker>
          </View>
          {errors.breedType && <Text style={styles.errorText}>{errors.breedType}</Text>}

          <Text style={styles.label}>Breed</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={breed}
              onValueChange={(itemValue) => setBreed(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Pet Breed" value="" />
              {breeds.map((breedOption) => (
                <Picker.Item key={breedOption} label={breedOption} value={breedOption} />
              ))}
            </Picker>
          </View>
          {errors.breed && <Text style={styles.errorText}>{errors.breed}</Text>}

          <Text style={styles.label}>Color</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={color}
              onValueChange={(itemValue) => setColor(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Pet Color" value="" />
              {availableColors.map((colorOption) => (
                <Picker.Item key={colorOption} label={colorOption} value={colorOption} />
              ))}
            </Picker>
          </View>
          {errors.color && <Text style={styles.errorText}>{errors.color}</Text>}

          {/* <Text style={styles.label}>Special Instruction</Text> */}
          {/* <TextInput
            label="Special Instruction"
            value={specialInstruction}
            onChangeText={setSpecialInstruction}
            mode="outlined"
            style={styles.input}
            multiline={true}
            placeholder="Enter Special Instructions"
          /> */}

          <Input
            mode='outlined' 
            label='Special Instruction'
            value={specialInstruction}
            onChangeText={setSpecialInstruction}
          />

          {/* <Text style={styles.label}>RFID</Text> */}
          {/* <TextInput
            label="RFID"
            value={rfid}
            onChangeText={setRFID}
            mode="outlined"
            style={styles.input}
          /> */}

          <Input
            mode='outlined' 
            label='Enter RFID'
            value={rfid}
            onChangeText={setRFID}
          />
          {/* <Button
            buttonColor='black'
            textColor='white'
            mode="contained"
            onPress={registerPet}
            style={{ marginTop: 30 }}
          >
            Register Pet
          </Button> */}
          <ButtonComponent
            title='Register Pet'
            onPress={registerPet}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalView}>

            <Text style={styles.modalTitle}>Pet Register</Text>
            <Text style={styles.modalSubTitle}>If your pet's QR Badge is lost then continue.</Text>
            <ButtonComponent
              title='Continue' 
              onPress={() =>  navigation.navigate('QRLost', {QR})} 
            />
            <ButtonComponent
              title='Close' 
              onPress={() => setModalVisible(false)}
              buttonColor={colors.blue_light}
              textColor={colors.primary}
            />

          </View>
        </Modal>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 0,
  },
  Title: {
    fontFamily: 'Freude', 
    fontSize: 25,
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 15,
    borderColor: '#ccc',
  },

  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  uploadImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  inputDate: {
    backgroundColor: 'white',
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  inputDateText: {
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  labelSelect: {
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.white,
  },
  modalTitle: {
    fontSize: 25,
    marginBottom: 30,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalSubTitle: {
    fontSize: 18,
    color: colors.black,
    marginBottom: 30,
    textAlign: 'center',
    padding: 30,
    borderRadius: 20,
    backgroundColor: colors.blue_lightest,
  },
  modelButton: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 5,
    marginBottom: 10,
  },
  modelButtonClose: {
    width: '100%',
    backgroundColor: colors.blue_light,
    padding: 5,
  },
});

export default PetRegister;
