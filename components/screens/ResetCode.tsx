import {
  View,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Text,
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { TitleTextAccess } from "../atoms/TitleText";
import { SubTitleTextAccess } from "../atoms/SubtitleText";
import { CustomButton } from "../atoms/CustomButton";
import { AlertIcon, MainIcon } from "../atoms/Icon";
import { verifyResetCode } from "../../config/routers";
import * as Tokens from "../tokens";

const ResetCodeSchema = z.object({
  code: z.string().length(6, "El código debe tener 6 dígitos"),
});

type FormData = {
  code: string;
};

export default function ResetCode() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(ResetCodeSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    const response = await verifyResetCode(email as string, data.code);
    
    if (response.success) {
      router.push({
        pathname: "/reset-password",
        params: { email, code: data.code }
      });
    } else {
      Alert.alert("Error", response.message);
    }
  });

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
                Ingresa el código de 6 dígitos que enviamos a tu correo
              </Text>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`${Tokens.standardInput}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                )}
                name="code"
              />
              {errors.code && (
                <View className="flex-row items-center mt-1 ml-1">
                  <AlertIcon size={20} color={"#F44336"} />
                  <Text className="text-red-500"> {errors.code.message}</Text>
                </View>
              )}
              <View className="my-5 items-center justify-center">
                <CustomButton
                  text="Verificar código"
                  customFun={onSubmit}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
} 