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
import { getUserInfo } from "../../config/routers";
import ChangePasswordModal from "../organisms/ChangePassword";


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
  });


  useEffect(() => {
    SetAccount({
      name: "",
      lastname: "",
      documentType: "",
      document: "",
      position: "",
      departament: "",
      email: "",
    });
    const fetchUser = async () => {
      const response = await getUserInfo();
      if (response?.success) {
        SetAccount({
          name: response?.data.name,
          lastname: response?.data.lastname,
          documentType: response?.data.type_doc,
          document: response?.data.num_doc,
          position: response?.data.position,
          departament: response?.data.id_department,
          email: response?.data.email,
        });
      } else {
        console.error(response?.message);
      }
    };
    fetchUser();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('lodingStatus');
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
          <Text className="text-xl font-bold text-CText">{account.name} {account.lastname}</Text>
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
          <ChangePasswordModal visible={modalVisible} onClose={handleCloseModal} />
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
