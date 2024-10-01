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
  TouchableOpacity, // Importa TouchableOpacity para el icono
} from "react-native";
import { MainIcon } from "../atoms/Icon";
import { TitleTextLogin } from "../atoms/TitleText";
import { SubTitleTextLogin } from "../atoms/SubtitleText";
import {
  LoginUserText,
  LoginPasswordText,
  AccessModal,
} from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { SubTitleTextRequest } from "../atoms/SubtitleText";
import * as Tokens from "../tokens";
import { useRouter } from "expo-router";
import { loginRequest } from "../../config/routers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener esta librería instalada

export default function Login() {
  const [user, setUser] = useState<string>("");
const [pass, setPass] = useState<string>("");
  const [userError, setUserError] = useState<string>("");
  const [passError, setPassError] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const router = useRouter();

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handlePress = async () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    /* const invalidCharRegex = /ñ/; */

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
    } /* else if (invalidCharRegex.test(pass)) {
      setPassError("La contraseña no puede contener la letra 'ñ'");
      valid = false;
    } */

    if (valid) {
      const result = await loginRequest(user, pass);
      if (result?.success) {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          router.push("/home");
        }
      } else {
        setModalVisible(true);
        setLoginError(result?.message || "Error desconocido");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white mt-8"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 flex-grow mt-[90] bg-white">
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
                  className={`${Tokens.standardInput} mb-4`}
                  onChangeText={setUser}
                  value={user ?? ""}
                />
                {userError ? (
                  <Text className="text-red-500">{userError}</Text>
                ) : null}
                <LoginPasswordText />
                <View className="flex-row items-center rounded-xl bg-gray-200 pr-2">
                  <TextInput
                    className={`${Tokens.standardInput} flex-1`}
                    onChangeText={setPass}
                    value={pass ?? ""}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
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
              <View className="flex-1 justify-center items-center bg-[#858585]">
                <View className="bg-white p-6 rounded-lg w-3/4 items-center">
                  <Text className="text-center text-lg text-[#858585] my-5">
                    {loginError}
                  </Text>
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
