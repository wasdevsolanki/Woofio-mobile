import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { Avatar, Card, Icon, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Button from '../../components/Button';
import colors from '../../styles/colors';

const VendorDashboard: React.FC = () => {
  const { authUser } = useContext(AuthContext); 
  const navigation = useNavigation(); 
  const [name, setName] = useState<string>('Doctor Name');
  const [profile, setProfile] = useState<string>('');
  const [count, setCount] = useState<any[]>([]);

  useEffect(() => {
    if (authUser) {

      const userName = `${authUser.first_name} ${authUser.last_name}`;
      setName( userName || 'Name');
      setProfile(authUser.profile);

      // SET COUNTS ----------------------------------------------------------
      const fetchRecords = async () => {
        try {
          const ownerId = authUser.id;
          const response = await axios.get(`https://dev.virtual-assistant.xyz/api/doctor?id=${ownerId}`);
          if( response.data ) {
            setCount(response.data.record);
          }
        } catch (error) {
          console.error('Failed to fetch pets:', error);
        }
      };
  
      fetchRecords();

    }
  }, [authUser]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.dashboardContainer}>

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
                  uri: `https://dev.virtual-assistant.xyz/system/public/uploaded_files/user/${profile}`,
                }}
              />
            ) : (
              <Avatar.Icon style={styles.avatarImage} {...props} icon="account-circle" />
            )
          }
          right={(props) => (
            <Button
              title='Profile'
              onPress={()=> navigation.navigate('Profile')}
              style={{padding:0, marginTop: 10}} 
              buttonColor={colors.red}
            />
          )}
        />

        <View style={styles.countGrid}>
          {Object.entries(count).map(([key, value]) => (
            <Card.Title
              key={key}
              style={styles.countCardTitle}
              titleStyle={styles.CountTitleStyle}
              subtitleStyle={styles.countSubtitleStyle}
              title={`${value}`}
              subtitle={key}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue_lightest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardContainer: {
    flex: 1,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  avatarImage: {
    padding: 0,
  },
  cardTitle: {
    backgroundColor: colors.white,
    padding: 20,
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
  countGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  countCardTitle: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '48%',
    fontSize: 12,
  },
  CountTitleStyle: {
    fontSize: 25,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 10,
  },
  countSubtitleStyle: {
    fontSize: 14,
    color: colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
    backgroundColor: colors.primary,
    padding: 5,
    borderRadius: 10,
  },
});

export default VendorDashboard;
