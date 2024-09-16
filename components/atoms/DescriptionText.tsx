import { View, StyleSheet, Text } from "react-native"
import { useFonts } from 'expo-font';
import * as Tokens from '../tokens';

export const LoginUserText = () => {
    
  return (
    <Text className={`${Tokens.textSizeDescription} text-left color-ColorDescriptionText mt-5`}>Correo empresarial:</Text>
  )
}

export const LoginPasswordText = () => {


return (
  <Text className={`${Tokens.textSizeDescription} text-left color-ColorDescriptionText`}>Contraseña:</Text>
)
}