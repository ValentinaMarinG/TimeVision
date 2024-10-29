import { View, Text, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomButton, EditProfileButton } from "../atoms/CustomButton";
import { TitleProfile } from "../atoms/TitleText";
import {
  SubTitleProfileCargo,
  SubTitleProfileDocument,
  SubTitleProfileDepartament,
  SubTitleProfileDocumentType,
} from "../atoms/SubtitleText";
import { useRouter } from "expo-router";
import * as Tokens from "../tokens";
import { useEffect, useState } from "react";
import BottomBar from "../organisms/BottomBar";
import { ProfilePhotoOffline, ProfilePhotoScreen } from "../atoms/ProfilePhoto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfo } from "../../config/routers";
import ChangePasswordModal from "../organisms/ChangePassword";
import * as SQLite from "expo-sqlite";
import { User } from "../../types/types";
import NetInfo from "@react-native-community/netinfo";
import images from '../../assets/index';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [account, SetAccount] = useState({
    name: "",
    lastname: "",
    documentType: "",
    document: "",
    position: "",
    departament: "",
    email: "",
    photo: ""
  });

  const [isOnline, setIsOnline] = useState<Boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const initializeDatabase = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("dataBase.db");
      if (db) {
        console.log("Base de datos inicializada correctamente");
      }
      return db;
    } catch (error) {
      console.error("Error al inicializar la base de datos:", error);
      return null;
    }
  };

  useEffect(() => {
    const getUserSQLite = async () => {
      try {
        const db = await initializeDatabase();
        if (!db) {
          Alert.alert("Error", "No se pudo acceder a la base de datos local.");
          return null;
        }

        const results = await db.getAllAsync<User>("SELECT * FROM users;");
        console.log("Usuario en bd local", results);

        if (results.length > 0) {
          SetAccount({
            name: results[0].name,
            lastname: results[0].lastname,
            documentType: results[0].type_doc,
            document: results[0].num_doc,
            position: results[0].position,
            departament: results[0].id_department,
            email: results[0].email,
            photo: results[0].photo || ""
          });
          return results[0];
        } else {
          console.warn(
            "No se encontró ningún usuario en la base de datos local."
          );
          return null;
        }
      } catch (error) {
        console.error(
          "Error al llamar la base de datos local en la inserción de usuario:",
          error
        );
        return null;
      }
    };
    getUserSQLite();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("lodingStatus");
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
          {isOnline ? (
            <ProfilePhotoScreen uri={account.photo || images.userProfileOffline} />
          ) : (
            <ProfilePhotoOffline />
          )}
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
              {account.documentType}
            </Text>
          </View>
          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileDocument />
            <Text className={Tokens.standardTextProfileRight}>
              {account.document}
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
              {account.departament}
            </Text>
          </View>
        </View>
        <View className="w-full flex items-center justify-center">
          <View className="w-3/4 justify-center items-center mt-3">
            <CustomButton
              text="Actualizar contraseña"
              customFun={handleOpenModal}
            />
          </View>
          <ChangePasswordModal
            visible={modalVisible}
            onClose={handleCloseModal}
          />
          <View className="w-3/4 justify-center items-center mt-5">
            <CustomButton text="Cerrar sesión" customFun={handleLogout} />
          </View>
        </View>
      </View>

      {/* <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View className={Tokens.modalContainer}>
          <View className={Tokens.modalContent}>
            <Text>Cargar Foto</Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <ButtonProfile text="Cerrar" customFun={handleCloseModal} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
      <BottomBar activeRoute="/profile" />
    </ScrollView>
  );
}
