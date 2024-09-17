import { Text } from "react-native";

import * as Tokens from "../tokens";

export const LoginUserText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>
      Correo empresarial:
    </Text>
  );
};

export const LoginPasswordText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>Contraseña:</Text>
  );
};

export const RequestTypeText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>
      Tipo de solicitud
    </Text>
  );
};

export const RequestTitleText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>Titulo</Text>
  );
};

export const RequestDescriptionText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>Descripción</Text>
  );
};

export const RequestOtherTypeText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>Especifique el tipo de solicitud</Text>
  );
};

export const RequestImageText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>Por favor adjuntar el justificante médico</Text>
  );
};


export const AccessModal = () => {
  return (
    <Text className="text-center text-lg text-[#858585] my-5">
      ¡Genial! Tu solicitud de acceso fue creada con éxito, tu administrador te
      brindará acceso pronto.
    </Text>
  );
};


