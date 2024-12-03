import {
  View,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createChangePasswordSchema } from "../../schemas/changePasswordSchema";
import { TitleTextAccess } from "../atoms/TitleText";
import { SubTitleTextAccess } from "../atoms/SubtitleText";
import { AlertIcon, MainIcon } from "../atoms/Icon";
import { resetPassword } from "../../config/routers";
import * as Tokens from "../tokens";
import { CustomButton } from "../atoms/CustomButton";
import { Ionicons } from "@expo/vector-icons";

const ResetPasswordSchema = z.object({
  password: z.string({required_error: "Debes ingresar una contraseña"})
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .refine((val) => !val.includes("ñ"), {
      message: "La contraseña no puede contener la letra 'ñ'.",
    })
    .refine((val) => /\d/.test(val), {
      message: "La contraseña debe contener al menos un número.",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "La contraseña debe contener al menos una letra mayúscula.",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "La contraseña debe contener al menos un carácter especial.",
    }),
  confirmPassword: z.string({
    required_error: "Debes confirmar la contraseña"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

export default function ResetPassword() {
  const router = useRouter();
  const { email, code } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit"
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await resetPassword(email as string, code as string, data.password);
      
      if (response.success) {
        setModalVisible(true);
      } else {
        setError("password", { 
          type: "manual",
          message: response.message || "Error al actualizar la contraseña"
        });
      }
    } catch (error) {
      setError("password", {
        type: "manual",
        message: "Error al procesar la solicitud"
      });
    }
  });

  const handleModalClose = () => {
    setModalVisible(false);
    router.push("/login");
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
            <View className="w-3/4 mt-5">
              <Text className="text-gray-600 mb-2">
                Ingresa tu nueva contraseña
              </Text>
              <View className="flex-row items-center rounded-xl bg-gray-200 pr-2 border border-gray-300">
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className={`${Tokens.standardInput} flex-1`}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={!showPassword}
                      placeholder="Nueva contraseña"
                    />
                  )}
                  name="password"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye" : "eye-off"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <View className="flex-row items-center mt-1 ml-1">
                  <AlertIcon size={20} color={"#F44336"} />
                  <Text className="text-red-500"> {errors.password?.message}</Text>
                </View>
              )}
              
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`${Tokens.standardInput} mt-5`}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                    placeholder="Confirmar contraseña"
                  />
                )}
                name="confirmPassword"
              />
              {errors.confirmPassword && (
                <View className="flex-row items-center mt-1 ml-1">
                  <AlertIcon size={20} color={"#F44336"} />
                  <Text className="text-red-500"> {errors.confirmPassword?.message}</Text>
                </View>
              )}
              
              <View className="my-5 items-center justify-center">
                <CustomButton
                  text="Cambiar contraseña"
                  customFun={onSubmit}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <Pressable 
          onPress={handleModalClose}
          className="flex-1 justify-center items-center bg-black/70"
        >
          <Pressable 
            onPress={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-3xl w-[75%] items-center shadow-lg"
          >
            <Text className="text-center text-base text-gray-600 mb-6">
              Cambio de contraseña exitoso
            </Text>
            
            <View className="w-full">
              <Pressable 
                onPress={handleModalClose}
                className="active:opacity-80"
              >
                <View className="w-full bg-[#4894FE] py-3 rounded-xl">
                  <Text className="text-center text-white font-medium">
                    Ir al login
                  </Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
} 