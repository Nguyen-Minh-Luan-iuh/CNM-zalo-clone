import {StyleSheet, View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'
import BottomNavigator from '../views/BottomNavigator'

const Home = ({navigation}) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Home screen was focused');
    });

    return unsubscribe;
  }, [navigation]);
  return (
        <BottomNavigator/>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})