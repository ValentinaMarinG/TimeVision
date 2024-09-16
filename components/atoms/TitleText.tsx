import { useFonts } from 'expo-font';
import { View, StyleSheet, Text } from "react-native"

import * as Tokens from '../tokens';

export const TitleTextLogin = () => {
    return (
    <Text className={`${Tokens.textSizeTitle} my-2`}>¡Bienvenido a TimeVision!</Text>
  )
}

export const TitleTextAccess = () => {
    return (
    <Text className={`${Tokens.textSizeTitle}`}>Solicita acceso a TimeVision</Text>
  )
}