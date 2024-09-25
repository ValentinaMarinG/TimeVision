import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Text,
  Modal,
} from "react-native";
import { MainIcon } from "../atoms/Icon";
import { TitleTextLogin } from "../atoms/TitleText";
import { SubTitleTextLogin } from "../atoms/SubtitleText";
import { LoginUserText, LoginPasswordText, AccessModal } from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { SubTitleTextRequest } from "../atoms/SubtitleText";
import * as Tokens from "../tokens";
import { useRouter } from "expo-router";
import { loginRequest } from "../../config/routers";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [userError, setUserError] = useState("");
  const [passError, setPassError] = useState("");

  const [loginError, setLoginError] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleModalClose = () => {
    setModalVisible(false);
    router.push("/login");
  };

  const handlePress = async () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setUserError("");
    setPassError("");
    setLoginError("");

    if (!user) {
      setUserError("El correo es requerido");
      valid = false;
    } else if (!emailRegex.test(user)) {
      setUserError("Ingresa un correo valido");
      valid = false;
    }

    if (!pass) {
      setPassError("La contraseña es requerida");
      valid = false;
    }

    if (valid) {
      const result = await loginRequest(user, pass);

      if (result.success) {
        router.push("/home");
      } else {
        setLoginError(result.data);
      }
    }

  };
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-grow mt-[90] bg-white">
            <View className="justify-center items-center mx-5">
              <TitleTextLogin />
              <MainIcon
                size={Tokens.logoSizeIcon}
                source={require("../../assets/LogoGrey.png")}
              />
              <SubTitleTextLogin />
            </View>
            <View className="items-center mt-5">
              <View className="w-72 flex-1">
                <LoginUserText />
                <TextInput
                  className={`${Tokens.standardInput}`}
                  onChangeText={setUser}
                />
                {userError ? (
                  <Text className="text-red-500">{userError}</Text>
                ) : null}
                <LoginPasswordText />
                <TextInput
                  className={`${Tokens.standardInput}`}
                  onChangeText={setPass}
                  secureTextEntry={true}
                />
                {passError ? (
                  <Text className="text-red-500">{passError}</Text>
                ) : null}
              </View>
            </View>
            <View className="justify-center items-center mx-10">
              <View className="w-full items-center justify-between mt-9">
                <CustomButton text="Ingresar" customFun={handlePress} />
              </View>
              <SubTitleTextRequest />
            </View>
          </View>
          {loginError ? (
                  <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View className="flex-1 justify-center items-center bg-[#858585] bg-opacity-25">
                    <View className="bg-white p-6 rounded-lg w-3/4 items-center">
                      <Text> {loginError} </Text>
                      <CustomButton text="Salir" customFun={handleModalClose} />
                    </View>
                  </View>
                </Modal>
                ) : null}
          </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
