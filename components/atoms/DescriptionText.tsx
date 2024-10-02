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

export const RequestDatesText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>Duración de la solicitud</Text>
  );
};

export const StartDateText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>Desde</Text>
  );
};

export const EndDateText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>Hasta</Text>
  );
};


export const RequestImageText = () => {
  return (
    <Text className={`${Tokens.standardFormDescriptionText}`}>Por favor adjuntar justificante médico</Text>
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

interface ShiftInHourProps {
  time: string | null;
}

interface ShiftOutHourProps {
  time: string | null; 
}

export const ShiftInText = () => {
  return <Text className={`${Tokens.standardShiftInHome}`}>Ingreso</Text>;
};

export const ShiftOutText = () => {
  return <Text className={`${Tokens.standardShiftOutHome}`}>Salida</Text>;
};

export const ShiftInHour: React.FC<ShiftInHourProps> = ({ time }) => {
  return <Text className={`${Tokens.standardShiftInHome}`}>{time || "No se encontró turno"}</Text>;
};

export const ShiftOutHour: React.FC<ShiftOutHourProps> = ({ time }) => {
  return <Text className={`${Tokens.standardShiftOutHome}`}>{time || "No se encontró turno"}</Text>;
};

interface ShiftDateProps {
  date: string;
}

export const ShiftDate: React.FC<ShiftDateProps> = ({ date }) => {
  return (
    <Text className={`${Tokens.standardSubtitleHome}`}>
      {date}
    </Text>
  );
};