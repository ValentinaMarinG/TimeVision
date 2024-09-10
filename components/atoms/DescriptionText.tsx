import { View, StyleSheet, Text } from "react-native"
import { useFonts } from 'expo-font';

export const LoginUserText = () => {
    
  return (
    <Text style={styles.login}>Correo empresarial:</Text>
  )
}

export const LoginPasswordText = () => {


return (
  <Text style={styles.login}>Contraseña:</Text>
)
}

const styles = StyleSheet.create({
  login: {
      color:'#858585',
      fontSize: 18,
      fontFamily:'poppins-regular',
      paddingLeft:15,
      marginBottom:5
    }
  })