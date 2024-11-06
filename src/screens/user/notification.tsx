import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import colors from '../../styles/colors';
import axios from 'axios';
import { AuthContext } from '../../utils/AuthContext';
import ButtonComponent from '../../components/Button';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { authUser } = useContext(AuthContext);
  const [petFoundData, setPetFoundData] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (authUser.id) {
          const response = await axios.get(
            `http://dev.virtual-assistant.xyz/api/notification?user_id=${authUser.id}`
          );
          setNotifications(response.data.notifications || []);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, [authUser]);

  const handleAcceptPet = async (notificationId: number) => {
    try {
      const response = await axios.post(
        `https://dev.virtual-assistant.xyz/api/notification/read`,
        { notification_id: notificationId },
      );

      if (response.status === 200) {
        setNotifications([]);
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handlePetFounder = async (notificationId: number) => {
    try {
      const response = await axios.post(
        `https://dev.virtual-assistant.xyz/api/notification/read`,
        { notification_id: notificationId },
      );

      if (response.status === 200) {
        setPetFoundData(response.data.petlost);
        setModalVisible(true);
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async () => {
    console.log(petFoundData.notifyId);
    try {
      const response = await axios.post(
        `https://dev.virtual-assistant.xyz/api/notification/delete`,
        { notification_id: petFoundData.notifyId },
      );

      if (response.status === 200) {
        setNotifications([]);
        setModalVisible(false);
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotification = ({ item }: { item: any }) => {
    if (item.type === 'pet_transfer') {
      return (
        <View style={styles.notificationContainer}>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>{item.title || 'No Title'}</Text>
            <Text style={styles.notificationMessage}>{item.message || 'No Message'}</Text>
            <Text style={styles.notificationDate}>
              {item.created_at ? new Date(item.created_at).toLocaleString() : 'No Date'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptPet(item.id)}
          >
            <Text style={styles.acceptButtonText}>Accept Pet</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (item.type === 'pet_found') {
      return (
        <View style={styles.notificationContainer}>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>{item.title || 'No Title'}</Text>
            <Text style={styles.notificationMessage}>{item.message || 'No Message'}</Text>
            <Text style={styles.notificationDate}>
              {item.created_at ? new Date(item.created_at).toLocaleString() : 'No Date'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handlePetFounder(item.id)}
          >
            <Text style={styles.acceptButtonText}>View Info</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      {notifications.length === 0 ? (
        <View style={styles.noNotificationsContainer}>
          <Text style={styles.noNotificationsText}>No notifications available.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {petFoundData && (
              <>
                <Text style={styles.modalTitle}>Pet Founder Information</Text>
                <Text>Founder: {petFoundData.founder.name}</Text>
                <Text>Email: {petFoundData.founder.email}</Text>
                <Text>phone: {petFoundData.founder.mobile}</Text>
                <Text>City: {petFoundData.petlost.city}</Text>
                <Text>State: {petFoundData.petlost.state}</Text>
                <Text>Country: {petFoundData.petlost.country}</Text>
                <Text>Founder's Note: {petFoundData.petlost.founder_note}</Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal> */}

      {/* Modal for Pet Founder Info */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>

          <Text style={styles.modalTitle}>Founder Information</Text>
          {petFoundData && (
            <>
            
              <View style={styles.row}>
                <Text style={styles.rowHeading}>Name</Text>
                <Text style={styles.rowValue}>{petFoundData.founder.name}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowHeading}>Email</Text>
                <Text style={styles.rowValue}>{petFoundData.founder.email}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowHeading}>Contact</Text>
                <Text style={styles.rowValue}>{petFoundData.founder.mobile}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowHeading}>City</Text>
                <Text style={styles.rowValue}>{petFoundData.petlost.city}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowHeading}>State</Text>
                <Text style={styles.rowValue}>{petFoundData.petlost.state}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowHeading}>Country</Text>
                <Text style={styles.rowValue}>{petFoundData.petlost.country}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowHeading}>Note</Text>
                <Text style={styles.rowValue}>{petFoundData.petlost.founder_note}</Text>
              </View>
            </>
          )}
        
          <ButtonComponent
            title='Close' 
            onPress={() => setModalVisible(false)}
            buttonColor={colors.primary}
            textColor={colors.white}
            style={{ marginTop:20 }}
          />
        
          <ButtonComponent
            title='Delete notification' 
            onPress={() => deleteNotification()}
            buttonColor={colors.red}
            textColor={colors.white}
          />
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: colors.blue_lightest,
    flex: 1,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primary,
  },
  notificationMessage: {
    fontSize: 14,
    marginVertical: 4,
  },
  notificationDate: {
    fontSize: 12,
    color: '#777',
  },
  acceptButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  acceptButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue_lightest,
  },
  noNotificationsText: {
    fontSize: 16,
    color: '#777',
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
    marginBottom: 10,
    color: colors.black,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  rowHeading: {
    flex: 2,
    backgroundColor: colors.blue_light,
    color: colors.black,
    borderRadius: 10,
    fontSize: 16,
    padding: 10,
    margin: 2,
  },
  rowValue: {
    flex: 4,
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: 10,
    fontSize: 16,
    padding: 10,
    margin: 2,
  },
});

export default NotificationScreen;
