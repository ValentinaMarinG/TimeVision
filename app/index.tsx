import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native'; // Importa ActivityIndicator para mostrar un loader
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../components/screens/Login'; // Ajusta la ruta según la ubicación del archivo Login.tsx
import Home from '../components/screens/Home';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); 
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isAuthenticated ? <Home /> : <Login />;
}
