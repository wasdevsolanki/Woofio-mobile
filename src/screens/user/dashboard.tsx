import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, Modal, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Avatar, Card, IconButton, Icon } from 'react-native-paper';
import { AuthContext } from '../../utils/AuthContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../../styles/colors';
import Button from '../../components/Button';

type RootStackParamList = {
  'Vaccine List': { petId: number };
  'PetLostList': { petLost: any[] };
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'Pet Detail'>;

const UserDashboard: React.FC = () => {
  const { authUser } = useContext(AuthContext);
  const navigation = useNavigation<NavigationProps>();

  const [name, setName] = useState<string>('User Name');
  const [profile, setProfile] = useState<string>('');
  const [pets, setPets] = useState<any[]>([]);
  const [petLost, setPetLost] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    
    const fetchPets = async () => {
      try {
        const ownerId = authUser.id;
        const response = await axios.get(`https://dev.virtual-assistant.xyz/api/pet/by_user?id=${ownerId}`);
        if( response.data.data ) {
          setPets(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      }
    };
    fetchPets();
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);

  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      const userName = `${authUser.first_name} ${authUser.last_name}`;
      setName( userName || 'Name');
      setProfile(authUser.profile || '');
    }
  }, [authUser]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const ownerId = authUser.id;
        const response = await axios.get(`https://dev.virtual-assistant.xyz/api/pet/by_user?id=${ownerId}`);
        if( response.data.data ) {
          setPets(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      }
    };

    fetchPets();
  }, [authUser]);

  useEffect(() => {
    const fetchPetLost = async () => {
      try {
        const ownerId = authUser.id;
        const response = await axios.get(`https://dev.virtual-assistant.xyz/api/pet/lost_exist?id=${ownerId}`);
        if( response.data.petlost ) {
          setPetLost(response.data.petlost);
        }
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      }
    };
 
    fetchPetLost();
  }, [authUser]);

  const handleViewVaccines = (petId: number) => {
    navigation.navigate('Vaccine List', { petId });
    setModalVisible(false);
  };

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {petLost.length > 0 && (
        <View style={styles.alertContainer}>
          <Icon
            source="alert"
            size={14}
            color={colors.white}
          />
          <Text style={styles.alertHeading}>
            Pet Lost in Your Area. For more info{' '}
            <Text style={styles.clickHereText} onPress={() => navigation.navigate('PetLostList', { petLost })}>
              Click Here
            </Text>
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.dashboardContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Card.Title
          style={styles.cardTitle}
          titleStyle={styles.titleStyle}
          subtitleStyle={styles.subtitleStyle}
          subtitle="WELCOME"
          title={name}
          left={(props) =>
            profile ? (
              <Avatar.Image
                style={styles.avatarImage}
                {...props}
                source={{
                  uri: 'https://dev.virtual-assistant.xyz/system/public/uploaded_files/user/' + profile,
                }}
              />
            ) : (
              <Avatar.Icon style={styles.avatarImage} {...props} icon="folder" />
            )
          }
          right={(props) => (
            <Button
              title='Profile'
              onPress={()=> navigation.navigate('Profile')}
              // onPress={()=> navigation.navigate('QRLost')}
              // onPress={()=> navigation.navigate('Pet Register', 'https://dev.virtual-assistant.xyz/scan?scan_id=S2tf5tAEvLNiXnJ6WVUXYsU1xE6BaO')}
              style={{padding:0}} 
              buttonColor={colors.red}
            />
          )}
        />

        <Card style={[styles.card, {width: '100%'}]}>
          <Card.Content style={styles.cardContent}>
            <Text style={styles.cardText} variant="titleLarge">
              My Pets
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petListRow}>
              {pets.length > 0 ? (
                pets.map((pet: any) => (
                  
                  <View key={pet.id} style={styles.petItem}>
                    <TouchableOpacity onPress={() => petProfile(pet.id)}>
                      <Avatar.Image
                        size={100}
                        source={{
                          uri: 'https://dev.virtual-assistant.xyz/system/public/uploaded_files/pet/' + pet.profile,
                        }}
                      />
                    </TouchableOpacity>
                    <Text style={styles.petNameText} variant="titleLarge">
                      {pet.pet_name}
                    </Text>
                  </View>

                ))
              ) : (
                <Text>NO PET FOUND</Text>
              )}

               {/* Add Pet button */}
              <View style={styles.petItem}>
                <TouchableOpacity onPress={() => navigation.navigate('Scan me')}>
                  <Avatar.Icon 
                    size={100} 
                    icon="plus" 
                    style={styles.addButton} 
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <Text style={styles.petNameText}>Add Pet</Text>
              </View>
            </ScrollView>
          </Card.Content>
        </Card>

        <View style={styles.grid}>
          <Card style={[styles.card, styles.gridCard]}>
            <Card.Content style={[styles.cardContent, styles.gridCardContent]}>
              <Text style={styles.gridCardText} variant="titleLarge">
                Upcomming Appointments
              </Text>
              <IconButton
                icon="calendar-month"
                iconColor={colors.primary}
                size={70}
              />
            </Card.Content>
          </Card>

          <Card style={[styles.card, styles.gridCard]}>
            <Card.Content style={[styles.cardContent, styles.gridCardContent]}>
              <Text style={styles.gridCardText} variant="titleLarge">
                View Pet Vaccines
              </Text>
              <IconButton
                icon="needle"
                iconColor={colors.primary}
                size={70}
                onPress={() => setModalVisible(true)}
              />
            </Card.Content>
          </Card>
        </View>

      </ScrollView>

      {/* Modal for selecting a pet */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>View Pet Vaccine</Text>
          <ScrollView>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petItemModel}
                onPress={() => handleViewVaccines(pet.id)}
              >
                <Avatar.Image
                  size={50}
                  source={{
                    uri: 'https://dev.virtual-assistant.xyz/system/public/uploaded_files/pet/' + pet.profile,
                  }}
                />
                <Text style={styles.petNameTextModel}>{pet.pet_name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button
              title='Close'
              onPress={()=> setModalVisible(false)}
              buttonColor={colors.black}
            />
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue_lightest,
  },
  alertContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.red,
  },
  alertHeading: {
    fontSize: 10,
    color: colors.white,
    marginLeft: 5,
    fontFamily: 'Freude', 
  },
  clickHereText: {
    fontSize: 10,
    color: colors.white,
    textDecorationLine: 'underline',
  },
  dashboardContainer: {
    padding: 20,
    alignItems: 'center',
  },
  avatarImage: {},
  cardTitle: {
    backgroundColor: colors.white,
    padding: 25,
    borderRadius: 10,
    marginBottom: 20,
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
  card: {
    marginBottom: 20,
    backgroundColor: colors.blue_light,
  },
  cardContent: {},
  cardText: {
    marginBottom: 20,
    fontSize: 16,
    color: colors.black,
  },
  petListRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  petItem: {
    alignItems: 'center',
    marginRight: 20, 
  },
  petNameText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.black,
    textTransform: 'capitalize',
  },
  addButton: {
    backgroundColor: colors.blue_light,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  gridCard: {
    flex: 0.47,
    marginBottom: 10,
  },
  gridCardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridCardText: {
    fontSize: 17,
    color: colors.black,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.blue_lightest,
  },
  modalTitle: {
    padding: 20,
    fontSize: 20,
    marginBottom: 25,
    borderRadius: 30,
    textAlign: 'center',
    color: colors.primary,
    backgroundColor: colors.white,
  },
  petItemModel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: colors.primary,
    marginBottom: 10,
    borderRadius: 30,
    padding: 10,
  },
  petNameTextModel: {
    marginLeft: 10,
    color: colors.white,
    fontSize: 18,
  },
});

export default UserDashboard;
