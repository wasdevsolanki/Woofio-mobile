import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../utils/AuthContext';
import AdminHome from '../screens/admin/dashboard';
import VendorHome from '../screens/vendor/dashboard';
import Client from '../screens/vendor/client';
import Pet from '../screens/vendor/pets';
import Vaccine from '../screens/vendor/Vaccine';
import UserHome from '../screens/user/dashboard';
import ScanMe from '../screens/user/ScanMe';
import PetDetail from '../screens/user/PetDetail';
import PetRegister from '../screens/user/PetRegister';
import QRLost from '../screens/user/QRLost';
import VaccineList from '../screens/user/VaccineList';
import vaccineView from '../screens/user/vaccineView';
import PetLostList from '../screens/user/petLostList';
import UserProfile from '../screens/user/Profile';
import Login from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';
import LogoutScreen from '../screens/auth/Logout';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../styles/colors';
import Notification from '../screens/user/notification';

// Types for Stack Navigator
type StackParamList = {
  'User Dashboard': undefined;
  'Notification': undefined;
  'Vaccine List': undefined;
  'Pet Register': undefined;
  'QRLost': undefined;
  'Pet Detail': undefined;
  'vaccineView': undefined;
  'PetLostList': undefined;
  'Profile': undefined;
  'Login': undefined;
  'Register': undefined;

  // DOCTOR 
  'Doctor Dashboard' : undefined;
  'Client' : undefined;
  'Pet' : undefined;
  'Vaccine' : undefined;
};

// Types for Tab Navigator
type TabParamList = {
  Home: undefined;
  Admin: undefined;
  Doctor: undefined;
  Client: undefined;
  Pet: undefined;
  Owner: undefined;
  'My Pets': undefined;
  'Scan me': undefined;
  'Notification': undefined;
  Profile: undefined;
  Logout: undefined;
  Register: undefined;
  Login: undefined;
};

// Create Stack and Tab Navigators
const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// const linking = {
//   prefixes: ['woofio://open', 'https://woofio.com'],
//   config: {
//     screens: {
//       'User Dashboard': 'dashboard/user',
//     },

//   },
// };

const linking = {
  prefixes: ['woofio://open', 'https://woofio.com'],
  config: {
    screens: {
      'User Dashboard': 'dashboard/user',
      'Notification': 'notification/user',
    },
  },
};


const AppNavigator: React.FC = () => {
  
  const { userRole, logout } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState<keyof TabParamList | 'Login'>('Login');

  // Stack for User-specific routes
  function UserStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="User Dashboard"
          component={UserHome}
          options={{
            headerShown: false,
          }}
          />
        <Stack.Screen name="Profile" component={UserProfile} 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Vaccine List" component={VaccineList} />
        <Stack.Screen name="vaccineView" component={vaccineView} />
        <Stack.Screen name="Pet Register" component={PetRegister} 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="QRLost" component={QRLost} 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="PetLostList" component={PetLostList} 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Pet Detail" component={PetDetail} 
         options={{
          headerShown: false,
         }}
        />
      </Stack.Navigator>
    );
  }

  function DoctorStack() {
    return (
      <Stack.Navigator>

        <Stack.Screen
          name="Doctor Dashboard"
          component={VendorHome}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Pet"
          component={Pet}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Vaccine"
          component={Vaccine}
          options={{
            headerShown: false,
          }}
        />

      </Stack.Navigator>
    );
  }

  useEffect(() => {
    const checkLoginStatus = async () => {
      const role = await AsyncStorage.getItem('userRole');
      if (role) {
        if (role === 'admin') setInitialRoute('Admin');
        else if (role === 'vendor') setInitialRoute('Doctor');
        else if (role === 'user') setInitialRoute('Owner');
        else setInitialRoute('Home');
      } else {
        setInitialRoute('Login');
      }
    };
    checkLoginStatus();
  }, [userRole]);

  return (
    <NavigationContainer  linking={linking}>
      {!userRole ? (
        <Stack.Navigator>
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerShown: false,
              title: 'Register',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          initialRouteName={initialRoute}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: string = '';

              // Apply Ionicons based on route name
              if (route.name === 'Admin') {
                iconName = 'shield-checkmark';
              } else if (route.name === 'Doctor') {
                iconName = 'medkit';
              } else if (route.name === 'Client') {
                iconName = 'person';
              } else if (route.name === 'Owner') {
                iconName = 'albums-outline';
              } else if (route.name === 'My Pets') {
                iconName = 'paw';
              } else if (route.name === 'Scan me') {
                iconName = 'qr-code-outline';
              } else if (route.name === 'Notification') {
                iconName = 'notifications';
              } else if (route.name === 'Profile') {
                iconName = 'person';
              } else if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Logout') {
                iconName = 'log-out';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
              backgroundColor: colors.blue_lightest,
              height: 60,
              paddingBottom: 10,
              paddingTop: 5,
   
              borderRadius: 10,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          })}
        >
        {userRole === 'admin' && <Tab.Screen name="Admin" component={AdminHome} />}
        {userRole === 'vendor' && (
          <>
            <Tab.Screen 
              name="Doctor" 
              component={DoctorStack} 
              options={{ headerShown: false }}
            />
            <Tab.Screen 
              name="Client" 
              component={Client} 
              options={{ headerShown: false }}
            />
          </>
        )}

          {userRole === 'user' && (
            <Tab.Screen
              name="Owner"
              component={UserStack}
              options={{ 
                tabBarLabel: 'Dashboard',
                headerShown: false,
              }}
            />
          )}

          {/* {userRole === 'user' && <Tab.Screen name="My Pets" component={PetList} />} */}
          
          {userRole === 'user' && 
            <Tab.Screen 
            name="Scan me" 
            component={ScanMe} 
            options={{
              headerShown: false,
            }}
          />}

          
          {userRole === 'user' && 
            <Tab.Screen 
            name="Notification" 
            component={Notification} 
            options={{
              headerShown: false,
            }}
          />}

          {/* {userRole === 'user' && <Tab.Screen name="Profile" component={UserProfile} 
            options={{
              headerShown: false,
            }}
          />} */}

          {userRole && (
            <Tab.Screen
              name="Logout"
              component={LogoutScreen}
              options={{
                headerShown: false,
              }}
            />
          )}
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;