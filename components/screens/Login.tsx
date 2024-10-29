import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { AlertIcon, MainIcon } from "../atoms/Icon";
import { TitleTextLogin } from "../atoms/TitleText";
import { SubTitleTextLogin } from "../atoms/SubtitleText";
import { LoginUserText, LoginPasswordText } from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { SubTitleTextRequest } from "../atoms/SubtitleText";
import * as Tokens from "../tokens";
import { useRouter } from "expo-router";
import { loginRequest } from "../../config/routers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../schemas/loginSchema";

type FormData = {
  user: string;
  pass: string;
};

export default function Login() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(LoginSchema) });

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const onSubmit = async (data: FormData) => {
    const result = await loginRequest(data.user, data.pass);
    if (result?.success) {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.push("/home");
      }
    } else {
      setModalVisible(true);
      setLoginError(result?.message || "Error desconocido");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 mt-36 items-center">
            <TitleTextLogin />
            <MainIcon
              size={Tokens.logoSizeIcon}
              source={require("../../assets/LogoGrey.png")}
            />
            <SubTitleTextLogin />
            <View className="w-72 mt-10">
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`${Tokens.standardInput} border border-gray-300`}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="Correo empresarial"
                  />
                )}
                name="user"
              />
              {errors.user && (
                <View className="flex-row w-[85%] items-center mt-1 ml-1">
                  <AlertIcon size={20} color={"#F44336"} />
                  <Text className="text-red-500"> {errors.user.message}</Text>
                </View>
              )}

              <View className="flex-row items-center rounded-xl bg-gray-200 pr-2 border border-gray-300 mt-5">
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className={`${Tokens.standardInput} flex-1`}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!showPassword}
                      placeholder="Contraseña"
                    />
                  )}
                  name="pass"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {errors.pass && (
                <View className="flex-row w-[85%] items-center mt-1 ml-1">
                <AlertIcon size={20} color={"#F44336"} />
                <Text className="text-red-500"> {errors.pass.message}</Text>
              </View>
              )}
            </View>

            <View className="items-center justify-between mt-9 w-[300]">
              <CustomButton
                text="Ingresar"
                customFun={handleSubmit(onSubmit)}
              />
              <View className="justify-center items-center mx-10">
                <SubTitleTextRequest />
              </View>
            </View>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleModalClose}
          >
            <View className="flex-1 justify-center items-center bg-[#858585] opacity-90">
              <View className="bg-white p-6 rounded-lg w-3/4 items-center">
                <Text className="text-center text-lg text-[#858585] my-5">
                  {loginError}
                </Text>
                <CustomButton text="Salir" customFun={handleModalClose} />
              </View>
            </View>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
