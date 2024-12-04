import { View, Text, TouchableOpacity, Pressable, Modal } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomButton, EditProfileButton, CustomButtonCancel } from "../atoms/CustomButton";
import { TitleProfile } from "../atoms/TitleText";
import {
  SubTitleProfileCargo,
  SubTitleProfileDocument,
  SubTitleProfileDepartament,
  SubTitleProfileDocumentType,
  SubTitleProfileToken,
} from "../atoms/SubtitleText";
import { useRouter } from "expo-router";
import * as Tokens from "../tokens";
import { useState, useEffect } from "react";
import BottomBar from "../organisms/BottomBar";
import { ProfilePhotoScreen } from "../atoms/ProfilePhoto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateProfilePhoto } from "../../config/routers";
import ChangePasswordModal from "../organisms/ChangePassword";
import * as ImagePicker from "expo-image-picker";
import { useProfileStore, clearAllStores } from "../../store/Store";
import { getExpoPushToken } from "../../notifications";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { CheckCircleIcon, AlertIcon } from "../atoms/Icon";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationToken, setNotificationToken] = useState<string | null>(null);

  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { account, fetchUserInfo, updatePhoto, clearStore } = useProfileStore();

  useEffect(() => {
    fetchUserInfo();
    getExpoPushToken().then((token) => setNotificationToken(token));
  }, []);

  const handlePhotoUpdate = async (uri: string) => {
    const formData = new FormData();
    if (!uri) {
      setErrorMessage("No se ha seleccionado ninguna imagen.");
      setErrorModalVisible(true);
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
      updatePhoto(updatedPhotoUrl);
      setSuccessModalVisible(true);
    } catch (error) {
      const message = (error as { message: string }).message || "Error desconocido";
      setErrorMessage("Error al actualizar la foto: " + message);
      setErrorModalVisible(true);
    }
  };

  const handlePress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setErrorMessage("¡Se requiere permiso para acceder a la galería!");
      setErrorModalVisible(true);
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
  };

  const copyTokenToClipboard = async () => {
    if (notificationToken) {
      await Clipboard.setStringAsync(notificationToken);
      console.log("Éxito", "Token copiado al portapapeles");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    clearStore();
    router.push("/login");
    clearAllStores();
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingBottom: insets.bottom, justifyContent: "space-between" }}
    >
      <View
        className="flex-1 w-full mt-3"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="justify-center items-center border-b border-slate-200">
          <TitleProfile />
        </View>
        <View className="w-full flex justify-center items-center mt-6">
          <Pressable onPress={handlePress}>
            <ProfilePhotoScreen
              source={account.photo ? { uri: account.photo } : undefined}
              name={account.name}
            />
          </Pressable>
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
          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileToken />
            <TouchableOpacity onPress={copyTokenToClipboard} className="ml-2 flex-row items-center">
              <Ionicons name="copy-outline" size={20} color="#8696BB" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="w-full flex items-center justify-center">
        <View className="w-3/4 justify-center items-center mt-1">
          <CustomButton text="Actualizar contraseña" customFun={handleOpenModal} />
        </View>
        <ChangePasswordModal visible={modalVisible} onClose={handleCloseModal} />
        <View className="w-3/4 justify-center items-center mt-3 p-1 mb-2">
          <CustomButtonCancel text="Cerrar sesión" customFun={handleLogout} />
        </View>
      </View>
      <BottomBar activeRoute="/profile"/>
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <Pressable 
          onPress={() => setSuccessModalVisible(false)}
          className="flex-1 justify-center items-center bg-black/70"
        >
          <Pressable 
            onPress={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-3xl w-[75%] items-center shadow-lg"
          >
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <CheckCircleIcon size={60} color="#4894FE" />
            </View>
            <Text className="text-center text-base text-gray-600 mb-6">
              Foto de perfil actualizada exitosamente
            </Text>
            
            <View className="w-full">
              <Pressable 
                onPress={() => setSuccessModalVisible(false)}
                className="active:opacity-80"
              >
                <View className="w-full bg-[#4894FE] py-3 rounded-xl">
                  <Text className="text-center text-white font-medium">
                    Aceptar
                  </Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

     
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <Pressable 
          onPress={() => setErrorModalVisible(false)}
          className="flex-1 justify-center items-center bg-black/70"
        >
          <Pressable 
            onPress={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-3xl w-[75%] items-center shadow-lg"
          >
            <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
              <AlertIcon size={60} color="#4894FE" />
            </View>
            <Text className="text-center text-base text-gray-600 mb-6">
              {errorMessage}
            </Text>
            
            <View className="w-full">
              <Pressable 
                onPress={() => setErrorModalVisible(false)}
                className="active:opacity-80"
              >
                <View className="w-full bg-[#4894FE] py-3 rounded-xl">
                  <Text className="text-center text-white font-medium">
                    Aceptar
                  </Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
