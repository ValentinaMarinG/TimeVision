import { View, StyleSheet, Text } from "react-native";
import { useFonts } from "expo-font";

export const LoginUserText = () => {
  return <Text style={styles.login}>Correo empresarial:</Text>;
};

export const LoginPasswordText = () => {
  return <Text style={styles.login}>Contraseña:</Text>;
};

export const RequestTypeText = () => {
  return <Text style={styles.login}>Tipo de solicitud</Text>;
};

export const RequestTitleText = () => {
  return <Text style={styles.login}>Titulo</Text>;
};

export const RequestDescriptionText = () => {
  return <Text style={styles.login}>Descripción</Text>;
};

export const AccessModal = () => {
  return (
    <Text className="text-center text-lg text-[#858585] my-5">
      ¡Genial! Tu solicitud de acceso fue creada con éxito, tu administrador te brindará
      acceso pronto.
    </Text>
  );
};

const styles = StyleSheet.create({
  login: {
    color: "#858585",
    fontSize: 18,
    /* fontFamily:'poppins-regular', */
    paddingLeft: 15,
    marginBottom: 5,
  },
});
