import React, { useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/utils/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingSlider from './src/components/OnboardingSlider'; // Import your onboarding slider
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import colors from './src/styles/colors'; // Assuming you have a colors file
import { Linking } from 'react-native';

function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null); // To track first launch


  // Check if the onboarding slider has been shown before
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasSeenSlider = await AsyncStorage.getItem('hasSeenSlider');
        if (hasSeenSlider === null) {
          // First time
          setIsFirstLaunch(true); 
        } else {
          // Already seen
          setIsFirstLaunch(false); 
        }
      } catch (error) {
        console.error('Error checking first launch', error);
      }
    };

    checkFirstLaunch();
  }, []);

  // useEffect(() => {
  //   const handleDeepLink = (event: { url: string}) => {
  //     const url = event;

  //     console.log('Deep link received:', url);
  //     // Handle navigation here if needed
  //   };
  
  //   Linking.addEventListener('url', handleDeepLink);
  
  //   return () => {
  //     Linking.removeEventListener('url', handleDeepLink);
  //   };
  // }, []);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      console.log('Deep link received:', url);
      
      const route = url.replace(/.*?:\/\//g, ''); // Extracts the route from URL
      if(route == 'open/dashboard/user') {
        console.log(route);
      } else if( route == 'open/notification/user') {
        console.log(route);
      }
      
    };
  
    // Listen for deep links
    const linkingListener = Linking.addEventListener('url', handleDeepLink);
    return () => {
      // Use removeAllListeners to remove 'url' listener in newer React Native versions
      linkingListener.remove();
    };
  }, []);
  
  

  const handleOnboardingDone = async () => {
    try {
      await AsyncStorage.setItem('hasSeenSlider', 'true'); // Save flag
      setIsFirstLaunch(false); // Move to main app
    } catch (error) {
      console.error('Error saving first launch status', error);
    }
  };

  // Show a loading spinner while checking the launch status
  if (isFirstLaunch === null) {
    return (
      <View style={styles.loadingContainer}>
        <Image style={styles.brandLogo} source={require('./assets/images/logo2.png')} />
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PaperProvider>
          {/* Show OnboardingSlider if first launch, otherwise show AppNavigator */}
          {isFirstLaunch ? (
            <OnboardingSlider onDone={handleOnboardingDone} />
          ) : (
            <AppNavigator />
          )}
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  brandLogo: {
    width: 300,
    resizeMode: 'contain',
    height: 200,
  },
});

export default App;
