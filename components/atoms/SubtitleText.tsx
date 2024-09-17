import { StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import * as Tokens from '../tokens'

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
      <Text className="text-[#69748D] underline text-center" onPress={handlePress}>
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
  return (
    <Text className={`${Tokens.ShiftsSubtitleHome}`}>
      Turnos
    </Text>
  );
};

export const ShiftDay = () => {
  return (
    <Text className={`${Tokens.ShiftsDay}`}>
      Jueves
    </Text>
  );
};
export const SubTitleProfileName = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Nombre</Text>;
}

export const SubTitleProfileDocument = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Documento</Text>;
}

export const SubTitleProfileCargo = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Cargo</Text>;
}

export const SubTitleProfileDepartament = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Departamento</Text>;
}

export const SubTitleProfileEmail = () => {
  return <Text className={`${Tokens.standardSubtitleLogin}`}>Correo</Text>;
}
