import { Text } from "react-native";
import * as Tokens from '../tokens'

export const TitleTextLogin = () => {
  return <Text className={`${Tokens.standardTextTitle}`}>¡Bienvenido a TimeVision!</Text>;
};

export const TitleTextAccess = () => {
  return <Text className={`${Tokens.standardTextTitle}`}>Solicita acceso a TimeVision</Text>;
};

export const TitleTextTickets = () => {
  return <Text className={`${Tokens.standardTextTitleBold}`}>Solicitudes</Text>;
};

export const TitleTextTicketsRequest = () => {
  return <Text className={`${Tokens.standardTextTitleBold} text-center`}>Crear Ticket</Text>;
};
