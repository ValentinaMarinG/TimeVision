import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { MainIcon } from './components/atoms/Icon'; 
import * as Tokens from './components/tokens'; 
import Login from './components/screens/Login';
import Home from './components/screens/Home';

// Configuración de cómo se comportarán las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Respuesta de notificación:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Función para registrar el dispositivo para notificaciones
  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('¡Necesitamos tu permiso para enviar notificaciones!');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Token:', token); // Guarda este token para usarlo después
    } else {
      alert('Debes usar un dispositivo físico para las notificaciones push');
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen
          name="Login" 
          component={Login}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="home" 
          component={Home} 
          options={{
            title: 'Home Screen',
            headerStyle: { backgroundColor: 'black' },
          }}
        />
      </Stack>
    </View>
  );
}
