import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import colors from '../styles/colors';
import Button from '../components/Button';

const slides = [
  {
    key: 'slide1',
    title: 'Welcome to Woofio',
    text: 'This is a brief description of your app.',
    image: require('../../assets/images/slider/welcome.png'),
    backgroundColor: colors.primary,
  },
  {
    key: 'slide2',
    title: 'Easy to Use',
    text: 'Woofio is ease to use. It is pet tracking system on mobile and web application',
    image: require('../../assets/images/slider/manage.png'),
    backgroundColor: colors.primary,
  },
];

const OnboardingSlider = ({ onDone }) => {
  
  const renderItem = ({ item }) => {
    if (item.key === 'slide1') {
      return (
        <View style={styles.slide1}>
          <Text style={styles.sharedTitle}>{item.title}</Text>
          <Button
            title='Get Started'
            onPress={onDone}
            buttonColor={colors.white}
            textColor={colors.black}
            style={styles.buttonStyle}
          />
          <Image source={item.image} style={styles.image} />
        </View>
      );
    }

    if (item.key === 'slide2') {
      return (
        <View style={styles.slide2}>
          <Text style={[styles.sharedTitle, styles.slide2Title]}>{item.title}</Text>
          <Image source={item.image} style={styles.image} />
          <Text style={[styles.sharedText, styles.slide2Text]}>{item.text}</Text>
        </View>
      );
    }
  };

  return <AppIntroSlider renderItem={renderItem} data={slides} onDone={onDone} />;
};

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  slide2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  slide2Title: {
    fontSize: 40,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  slide2Text: {
    width: '80%',
    fontSize: 20,
    color: colors.white,
  },
  sharedTitle: {
    fontSize: 35,
    color: colors.white,
    marginBottom: 30,
    width: '60%',
    textAlign: 'center',
  },
  sharedText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.black,
    marginHorizontal: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginVertical: 30,
  },
  buttonStyle: {
    width: '40%',
    padding: 0,
    marginBottom: 60,
  },
});

export default OnboardingSlider;
