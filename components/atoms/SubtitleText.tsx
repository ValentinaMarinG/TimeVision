import { View, StyleSheet, Text, Alert} from "react-native"
import { Link, useRouter } from "expo-router"

export const SubTitleTextLogin = () => {
 
    return (
    <Text style={styles.login}>Inicia sesión para ver tus horarios</Text>
  )
}

export const SubTitleTextAccess = () => {
 
    return (
    <Text style={styles.login}>Ingresa tu correo y comienza a usar TimeVision</Text>
  )
}

export const SubTitleTextRequest = () => {
    const router = useRouter();

    const handlePress = () => {
        router.push('/access');
    };

    return (
    <Text style={styles.login}>
      ¿No tienes acceso? Solicítalo a tu administrador{" "}
      <Text style={styles.link} onPress={handlePress}>aquí.</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
    login: {
      color:'#8696BB',
      fontSize: 16,
      fontFamily:'poppins-regular',
      marginTop:15,
      textAlign:'center',

    },
    link: {
        color: '#69748D',
        textDecorationLine: 'underline',
      },
  })