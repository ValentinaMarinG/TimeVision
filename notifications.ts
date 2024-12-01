import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

// Configuración del handler de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.HIGH
  }) as any
});

// Función para obtener el token del dispositivo
export const getExpoPushToken = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert('Error', '¡No se pudo obtener el permiso para las notificaciones!');
      return null;
    }
    
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: '1b029766-2664-4c77-8a51-7ba2423a5563' 
    });
    
    return token.data;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
};