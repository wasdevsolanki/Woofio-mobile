import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import colors from '../../styles/colors';

type Pet = {
  id: number;
  name: string;
  breed: string;
  age: number;
  owner: string;
};

type RootStackParamList = {
  PetDetail: { pet: Pet };
  PetRegister: undefined;
};

type ScanQRProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const ScanQR: React.FC<ScanQRProps> = ({ navigation }) => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const scannerRef = useRef<QRCodeScanner>(null); // Reference for QRCodeScanner

  // Reset the scanned data when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Reset scanned data each time the screen is focused
      setScannedData(null);
      if (scannerRef.current) {
        scannerRef.current.reactivate(); // Reactivate scanner when returning
      } 
    }, [])
  );

  const onSuccess = async (e: { data: string }) => {
    const qrData = e.data;
    setScannedData(qrData);

    try {
      const response = await axios.post(
        'https://dev.virtual-assistant.xyz/api/pet/scan', 
        { qr_data: qrData }
      );
      if (response.data.pet) {
        const pet = response.data;
        navigation.navigate('Pet Detail', { pet });
      } else {
        navigation.navigate('Pet Register', { qrData });
      }
      // Reactivate scanner after navigating
      if (scannerRef.current) {
        scannerRef.current.reactivate();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch pet details');
    }
  };

  return (
    <View style={styles.container}>
      <QRCodeScanner
        ref={scannerRef}
        onRead={onSuccess}
        showMarker
        fadeIn={true}
        cameraStyle={styles.cameraStyle} // Set full height for camera
        topContent={
          <Text style={styles.centerText}>
            {scannedData 
              ? `Previously Scanned: ${scannedData}` 
              : 'SCAN QR'}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensure the container takes up full screen
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
  },
  cameraStyle: {
    height: '100%',
    width: '100%',
  },
  centerText: {
    fontSize: 18,
    marginBottom: 40,
    backgroundColor: colors.primary,
    color: colors.blue_lightest,
    width: '80%',
    textAlign: 'center',
    borderRadius: 25,
    padding: 10,
  },
});

export default ScanQR;
