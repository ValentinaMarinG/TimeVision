import {
  View,
  Text,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CustomButton,
  EditProfileButton,
} from "../atoms/CustomButton";
import { TitleProfile } from "../atoms/TitleText";
import {
  SubTitleProfileCargo,
  SubTitleProfileDocument,
  SubTitleProfileDepartament,
  SubTitleProfileDocumentType,
  SubTitleProfileNumeroEmpleado,
} from "../atoms/SubtitleText";
import { useRouter } from "expo-router";
import * as Tokens from "../tokens";
import { useEffect, useState } from "react";
import BottomBar from "../organisms/BottomBar";
import { ProfilePhotoScreen } from "../atoms/ProfilePhoto";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

// Define la interfaz de usuario
interface UserInfo {
  name: string;
  lastname: string;
  type_doc: string;
  num_doc: string;
  employeeNumber: string;
  position: string;
  id_department: string;
  email: string;
}

// Función para obtener la información del usuario desde SQLite
const getUserInfoFromSQLite = async (): Promise<UserInfo | undefined> => {
  try {
    const db = await SQLite.openDatabaseAsync('dataBase.db');
    const user = await db.getFirstAsync('SELECT * FROM user ORDER BY id DESC LIMIT 1');
    return user ? user as UserInfo : undefined;
  } catch (error) {
    console.error("Error al obtener datos del usuario desde SQLite:", error);
    return undefined;
  }
};

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const [account, setAccount] = useState<UserInfo>({
    name: "",
    lastname: "",
    type_doc: "",
    num_doc: "",
    employeeNumber: "",
    position: "",
    id_department: "",
    email: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const localData = await getUserInfoFromSQLite();
      if (localData) {
        setAccount(localData);
      } else {
        console.warn("No se encontraron datos locales en SQLite.");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    router.push("/login");
  };

  const handlePress = () => {
    console.log("Cambio de foto de perfil");
  };

  const handlePassword = () => {
    console.log("Cambiar contraseña");
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      <View
        className="flex-1 w-full mt-9"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="justify-center items-center border-b border-slate-200">
          <TitleProfile />
        </View>
        <View className="w-full flex justify-center items-center mt-9">
          <ProfilePhotoScreen />
          <View className="flex relative -top-8 left-10">
            <EditProfileButton text="" customFun={handlePress} />
          </View>
          <Text className="text-xl font-bold text-CText">
            {account.name} {account.lastname}
          </Text>
          <Text className="text-sm text-blueText">{account.email}</Text>
        </View>
        <View className="w-full justify-center items-center my-5">
          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileDocumentType />
            <Text className={Tokens.standardTextProfileRight}>
              {account.type_doc}
            </Text>
          </View>
          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileDocument />
            <Text className={Tokens.standardTextProfileRight}>
              {account.num_doc}
            </Text>
          </View>
          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileNumeroEmpleado />
            <Text className={Tokens.standardTextProfileRight}>
              {account.employeeNumber}
            </Text>
          </View>
          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileCargo />
            <Text className={Tokens.standardTextProfileRight}>
              {account.position}
            </Text>
          </View>
          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileDepartament />
            <Text className={Tokens.standardTextProfileRight}>
              {account.id_department}
            </Text>
          </View>
        </View>
        <View className="w-full flex items-center justify-center">
          <View className="w-3/4 justify-center items-center mt-3">
            <CustomButton
              text="Actualizar Contraseña"
              customFun={handlePassword}
            />
          </View>
          <View className="w-3/4 justify-center items-center mt-5">
            <CustomButton text="Cerrar sesión" customFun={handleLogout} />
          </View>
        </View>
      </View>

      <BottomBar activeRoute="/profile" />
    </ScrollView>
  );
}
