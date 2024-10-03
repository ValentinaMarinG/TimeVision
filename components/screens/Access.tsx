import {
  View,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text
} from "react-native";
import { useState } from "react";
import { TitleTextAccess } from "../atoms/TitleText";
import { SubTitleTextAccess } from "../atoms/SubtitleText";
import { AccessModal, LoginUserText } from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainIcon } from "../atoms/Icon";

import { accessRequest } from "../../config/routers";

import * as Tokens from "../tokens";

export default function Login() {
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");

  const  [emailError, setEmailError] = useState("")

  const router = useRouter();

  const handlePress = async () => {
    if (validate()) {
      const response = await accessRequest(email);
      
      if (response.success) {
        setModalVisible(true);
      } else {
        Alert.alert("Error", response.message); 
      }
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    router.push("/login");
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!email) {
      setEmailError("El correo es obligatorio.");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("El correo ingresado no es válido.");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 w-full"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center items-center">
            <View className="flex justify-center items-center my-2">
              <TitleTextAccess />
              <MainIcon
                size={Tokens.logoSizeIcon}
                source={require("../../assets/LogoGrey.png")}
              />
              <View className="w-3/4">
                <SubTitleTextAccess />
              </View>
            </View>
            <View className="w-3/4 m-5">
              <LoginUserText />
              <TextInput
                className={`${Tokens.standardInput}`}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) {
                    setEmailError(""); 
                  }
                }}
                value={email}
              />
              {emailError ? <Text className="text-red-500 mt-2">{emailError}</Text> : null}
              <View className="my-4 items-center justify-center">
                <CustomButton text="Realizar solicitud" customFun={handlePress} />
              </View>
            </View>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View className="flex-1 justify-center items-center bg-[#858585] opacity-90">
            <View className="flex-1 justify-center items-center bg-black">
              <View className="absolute bg-white p-6 rounded-lg w-3/4 items-center">
                <AccessModal />
                <CustomButton text="Salir" customFun={handleModalClose} />
              </View>
            </View>
            </View>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}


