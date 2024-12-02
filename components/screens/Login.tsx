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
  Pressable,
} from "react-native";
import { AlertIcon, MainIcon } from "../atoms/Icon";
import { TitleTextLogin } from "../atoms/TitleText";
import { SubTitleTextLogin } from "../atoms/SubtitleText";
import { LoginUserText, LoginPasswordText } from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { SubTitleTextRequest } from "../atoms/SubtitleText";
import * as Tokens from "../tokens";
import { useRouter } from "expo-router";
import { loginRequest, recoverPasswordRequest } from "../../config/routers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../schemas/loginSchema";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { clearAllStores } from "../../store/Store";

type FormData = {
  user: string;
  pass: string;
};

export default function Login() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoverPassword, setShowRecoverPassword] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const insets = useSafeAreaInsets();
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
    await AsyncStorage.setItem('lodingStatus','false');
    if (result?.success) {
      await clearAllStores();
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.push("/home");
      }
    } else {
      setModalVisible(true);
      setLoginError(result?.message || "Error desconocido");
    }
  };

  const handleRecoverPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!recoveryEmail || !emailRegex.test(recoveryEmail)) {
      setRecoveryError("Por favor, ingresa un correo electrónico válido");
      return;
    }

    try {
      const response = await recoverPasswordRequest(recoveryEmail);
      if (response.success) {
        setRecoverySuccess(true);
        setRecoveryError("");
      } else {
        setRecoveryError(response.message || "Error al procesar la solicitud");
      }
    } catch (error) {
      setRecoveryError("Error al procesar la solicitud");
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
          style={{ paddingBottom: insets.top}}
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
                    name={showPassword ? "eye" : "eye-off"}
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

            <View className="items-center justify-between mt-9 w-[300] ">
              <CustomButton
                text="Ingresar"
                customFun={handleSubmit(onSubmit)}
              />
              <View className="justify-center items-center mx-10">
                <SubTitleTextRequest />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => setShowRecoverPassword(true)}
            className="mt-2"
          >
            <Text className="text-blue-500 text-center">
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <Modal
            animationType="fade"
            transparent={true}
            visible={showRecoverPassword}
            onRequestClose={() => setShowRecoverPassword(false)}
          >
            <Pressable 
              onPress={() => setShowRecoverPassword(false)}
              className="flex-1 justify-center items-center bg-black/50"
            >
              <Pressable 
                onPress={(e) => e.stopPropagation()}
                className="bg-white p-8 rounded-3xl w-[85%] shadow-lg"
              >
                {!recoverySuccess ? (
                  <>
                    <View className="items-center mb-6">
                      <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                        <Ionicons name="mail" size={28} color="#3b82f6" />
                      </View>
                      <Text className="text-xl font-semibold text-gray-800">
                        Recuperar Contraseña
                      </Text>
                      <Text className="text-center text-gray-600 mt-2">
                        Ingresa tu correo electrónico
                      </Text>
                    </View>

                    <View className="space-y-4">
                      <View>
                        <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
                          <TextInput
                            className="flex-1 px-4 py-3 rounded-xl"
                            placeholder="Correo electrónico"
                            value={recoveryEmail}
                            onChangeText={(text) => {
                              setRecoveryEmail(text);
                              setRecoveryError("");
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                          <View className="px-4">
                            <Ionicons name="mail-outline" size={24} color="#9ca3af" />
                          </View>
                        </View>
                        {recoveryError ? (
                          <Text className="text-red-500 text-sm mt-1 ml-1">{recoveryError}</Text>
                        ) : null}
                      </View>
                    </View>

                    <View className="mt-6 space-y-3">
                      <TouchableOpacity 
                        onPress={handleRecoverPassword}
                        className="bg-[#4894FE] py-3 rounded-xl active:opacity-80"
                      >
                        <Text className="text-center text-white font-medium">
                          Enviar
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={() => {
                          setShowRecoverPassword(false);
                          setRecoveryEmail("");
                          setRecoveryError("");
                        }}
                        className="bg-gray-300 border-2 border-gray-200 py-3 rounded-xl active:opacity-80"
                      >
                        <Text className="text-center text-w font-medium">
                          Cancelar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <View className="items-center">
                    <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                      <Ionicons name="checkmark-circle" size={32} color="#22c55e" />
                    </View>
                    <Text className="text-xl font-semibold text-gray-800 mb-2">
                      ¡Correo Enviado!
                    </Text>
                    <Text className="text-center text-gray-600 mb-6">
                      Hemos enviado las instrucciones para recuperar tu contraseña al correo proporcionado
                    </Text>
                    <TouchableOpacity 
                      onPress={() => {
                        setShowRecoverPassword(false);
                        setRecoveryEmail("");
                        setRecoverySuccess(false);
                      }}
                      className="w-full bg-blue-500 py-3 rounded-xl active:opacity-80"
                    >
                      <Text className="text-center text-white font-medium">
                        Entendido
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Pressable>
            </Pressable>
          </Modal>

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
