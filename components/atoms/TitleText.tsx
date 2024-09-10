import { useFonts } from 'expo-font';
import { View, StyleSheet, Text } from "react-native"

export const TitleTextLogin = () => {
    return (
    <Text style={styles.welcome}>¡Bienvenido a TimeVision!</Text>
  )
}

export const TitleTextAccess = () => {
    return (
    <Text style={styles.welcome}>Solicita acceso a TimeVision</Text>
  )
}

const styles = StyleSheet.create({
    welcome: {
      color:'#0D1B34',
      fontSize: 24,
      marginBottom:15
    }
  })