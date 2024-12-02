import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import * as Tokens from "../tokens";
import moment from "moment";
import "moment/locale/es"; 

moment.locale("es");

export const SubTitleTextLogin = () => {
  return (
    <Text className={`${Tokens.standardSubtitleLogin}`}>
      Inicia sesión para ver tus horarios
    </Text>
  );
};

export const SubTitleTextAccess = () => {
  return (
    <Text className={`${Tokens.standardSubtitleLogin}`}>
      Ingresa tu correo para comenzar a usar TimeVision
    </Text>
  );
};

export const SubTitleTextRequest = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/access");
  };
  return (
    <Text className={`${Tokens.standardSubtitleLogin}`}>
      ¿No tienes acceso? Solicítalo a tu administrador{" "}
      <Text
        className="text-[#69748D] underline text-center"
        onPress={handlePress}
      >
        aquí.
      </Text>
    </Text>
  );
};

export const SubTitleTextHome = () => {
  return (
    <Text className={`${Tokens.standardSubtitleHome}`}>
      ¡Bienvenido a TimeVision!
    </Text>
  );
};

export const ShiftTextHome = () => {
  return <Text className={`${Tokens.ShiftsSubtitleHome}`}>Turnos</Text>;
};

interface ShiftDayProps {
  date: string; 
}

export const ShiftDay: React.FC<ShiftDayProps> = ({ date }) => {
  
  const dayOfWeek = moment(date).format("dddd"); 

  return (
    <Text className={`${Tokens.ShiftsDay}`}>
      {dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}
    </Text>
  );
};

export const SubTitleProfileName = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Nombre</Text>;
};

export const SubTitleProfileDocument = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Documento</Text>;
};

export const SubTitleProfileDocumentType = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Tipo de documento</Text>;
};

export const SubTitleProfileNumeroEmpleado = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Código de empleado</Text>;
};

export const SubTitleProfileCargo = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Cargo</Text>;
};

export const SubTitleProfileDepartament = () => {
  return (
    <Text className={`${Tokens.standardSubtitleLogin}`}>Departamento</Text>
  );
};
export const SubTitleProfileToken = () => {
  return (
    <Text className={`${Tokens.standardSubtitleLogin}`}>Token</Text>
  );
};

export const SubTitleProfileEmail = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Correo</Text>;
};
