import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const getRoleAndUser = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        const userData = await AsyncStorage.getItem('authUser'); 

        if (role) {
          setUserRole(role);
        }
        if (userData) {
          setAuthUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    getRoleAndUser();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('authUser');
      setUserRole(null);
      setAuthUser(null);
    } catch (e) {
      console.error('Error logging out: ', e);
    }
  };

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, authUser, setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
