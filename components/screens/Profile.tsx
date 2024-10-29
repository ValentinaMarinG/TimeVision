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
import ChangePasswordModal from "../organisms/ChangePassword";
import * as SQLite from "expo-sqlite";
import { User } from "../../types/types";
import NetInfo from "@react-native-community/netinfo";
import { getUserInfo, updateProfilePhoto } from "../../config/routers";
import * as ImagePicker from "expo-image-picker";


export default function Profile() {
  const insets = useSafeAreaInsets();
  const [account, setAccount] = useState({
    id: "",
    name: "",
    lastname: "",
    documentType: "",
    document: "",
    position: "",
    departament: "",
    email: "",
    photo: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

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

  const updatePhotoUrlSQLite = async (photourl: string) => {
    try {      
      const db = await initializeDatabase();
      if (!db) {
        Alert.alert("Error", "No se pudo acceder a la base de datos local.");
        return null;
      }

      const result = await db.runAsync(`UPDATE users SET photo = ? WHERE email = ?`, [photourl, account.email]);

    } catch (error) {
      console.error(
        "Error al llamar la base de datos local en la actualizar el usuario:",
        error
      );
      return null;
    }
  }

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
          setAccount({
            id:results[0]._id,
            name: results[0].name,
            lastname: results[0].lastname,
            documentType: results[0].type_doc,
            document: results[0].num_doc,
            position: results[0].position,
            departament: results[0].id_department,
            email: results[0].email,
            photo: results[0].photo || ""
          });
          setProfilePhoto(account.photo);
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
    }
      getUserSQLite();
  },[account.photo]);

  const handlePhotoUpdate = async (uri: string) => {
    const formData = new FormData();
    if (!uri) {
      alert("No se ha seleccionado ninguna imagen.");
      return;
    }

    const file = {
      uri,
      name: "profile_photo.jpg",
      type: "image/jpeg",
    };

    formData.append("photo", file as any);

    try {
      const updatedPhotoUrl = await updateProfilePhoto(formData);
      alert("Foto de perfil actualizada con éxito.");
      updatePhotoUrlSQLite(updatedPhotoUrl)
      setProfilePhoto(updatedPhotoUrl);
    } catch (error) {
      const message = (error as { message: string }).message || 'Error desconocido';
      alert("Error al actualizar la foto: " + message);
    }
  };

  const handlePress = async () => {
    if(!isOnline){
      Alert.alert("Para actualizar la foto debe estar conectado a internet");
    }else{
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("¡Se requiere permiso para acceder a la galería!");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        handlePhotoUpdate(uri);
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("lodingStatus");
    router.push("/login");
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
      <View className="flex-1 w-full mt-9" style={{ paddingBottom: insets.bottom }}>
        <View className="justify-center items-center border-b border-slate-200">
          <TitleProfile />
        </View>
        <View className="w-full flex justify-center items-center mt-9">
          {isOnline ? (
            <ProfilePhotoScreen source={profilePhoto ? { uri: profilePhoto } : undefined} />
          ) : (
            <ProfilePhotoOffline source={require("../../assets/userProfileOffline.png")}/>
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
            <CustomButton text="Actualizar contraseña" customFun={handleOpenModal} />
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
      <BottomBar activeRoute="/profile" />
    </ScrollView>
  );
}
