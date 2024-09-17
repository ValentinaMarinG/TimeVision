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

export const AccessModal = () => {
  return (
    <Text className="text-center text-lg text-[#858585] my-5">
      ¡Genial! Tu solicitud de acceso fue creada con éxito, tu administrador te
      brindará acceso pronto.
    </Text>
  );
};

export const NameHomeCard = () => {
  return (
    <Text className={`${Tokens.nameTextCard}`}>
      Manuel Castro Duque
    </Text>
  );
};

export const ProfileHomeCard = () => {
  return (
    <Text className={`${Tokens.myProfileTextCard}`}>
      Mi perfil
    </Text>
  );
};

export const CompanyHomeCard = () => {
  return (
    <Text className={`${Tokens.companyTextCard}`}>
      Universidad Autónoma de Manizales
    </Text>
  );
};

export const InputTextHome = () => {
  return (
    <Text className={`${Tokens.searchInputHome}`}>
      Buscar una fecha
    </Text>
  );
};


export const ShiftDate = () => {
  return (
    <Text className={`${Tokens.standardSubtitleHome}`}>
      29 de agosto del 2024
    </Text>
  );
};

export const ShiftInText = () => {
  return (
    <Text className={`${Tokens.standardShiftInHome}`}>
      Ingreso
    </Text>
  );
};

export const ShiftInHour = () => {
  return (
    <Text className={`${Tokens.standardShiftInHome}`}>
      6:00 am
    </Text>
  );
};


export const ShiftOutText = () => {
  return (
    <Text className={`${Tokens.standardShiftOutHome}`}>
      Salida
    </Text>
  );
};

export const ShiftOutHour = () => {
  return (
    <Text className={`${Tokens.standardShiftOutHome}`}>
      2:00 pm
    </Text>
  );
};
