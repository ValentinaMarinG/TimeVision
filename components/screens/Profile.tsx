import { View, Text, TouchableOpacity } from "react-native";
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

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationToken, setNotificationToken] = useState<string | null>(null);

  const { account, fetchUserInfo, updatePhoto, clearStore } = useProfileStore();

  useEffect(() => {
    fetchUserInfo();
    getExpoPushToken().then((token) => setNotificationToken(token));
  }, []);

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
      updatePhoto(updatedPhotoUrl);
    } catch (error) {
      const message = (error as { message: string }).message || "Error desconocido";
      alert("Error al actualizar la foto: " + message);
    }
  };

  const handlePress = async () => {
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
      <View>
        <View className="justify-center items-center border-b border-slate-200">
          <TitleProfile />
        </View>
        <View className="w-full flex justify-center items-center mt-9">
          <ProfilePhotoScreen source={account.photo ? { uri: account.photo } : undefined} />
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
              <Ionicons name="copy-outline" size={20} color="#007BFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="w-full flex items-center justify-center">
        <View className="w-3/4 justify-center items-center mt-1">
          <CustomButton text="Actualizar contraseña" customFun={handleOpenModal} />
        </View>
        <ChangePasswordModal visible={modalVisible} onClose={handleCloseModal} />
        <View className="w-3/4 justify-center items-center mt-3 p-1">
          <CustomButtonCancel text="Cerrar sesión" customFun={handleLogout} />
        </View>
      </View>
      <BottomBar activeRoute="/profile" />
    </View>
  );
}
