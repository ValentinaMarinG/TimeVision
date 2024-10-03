import { Text } from "react-native";
import * as Tokens from '../tokens'

export const TitleTextLogin = () => {
  return <Text className={`${Tokens.standardTextTitle}`}>¡Bienvenido a TimeVision!</Text>;
};

export const TitleTextAccess = () => {
  return <Text className={`${Tokens.standardTextTitle}`}>Solicita acceso a TimeVision</Text>;
};

export const TitleTextTickets = () => {
  return <Text className={`${Tokens.standardTextTitleBold}`}>SOLICITUDES</Text>;
};

export const TitleTextTicketsRequest = () => {
  return <Text className={`${Tokens.standardTextTitleBold} text-center`}>CREAR TICKET</Text>;
};

export const TitleTextHome = () => {
  return <Text className={`${Tokens.standardTextTitleBold}`}>Hola</Text>;
};

export const TitleProfile = () => {
  return <Text className={`${Tokens.standardTextTitleBold}`}>PERFIL</Text>;
}

