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
  Text,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";

import { TitleTextAccess } from "../atoms/TitleText";
import { SubTitleTextAccess } from "../atoms/SubtitleText";
import { AccessModal, LoginUserText } from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { AlertIcon, MainIcon } from "../atoms/Icon";
import { accessRequest } from "../../config/routers";
import * as Tokens from "../tokens";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccessSchema } from "../../schemas/accessSchema";

type FormData = {
  email: string;
};

export default function Access() {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({resolver: zodResolver(AccessSchema)});

  const [modalVisible, setModalVisible] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    const response = await accessRequest(data.email);
  
    if (response.success) {
      setModalVisible(true);
    } else {
      Alert.alert("Error", response.message);
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
              <LoginUserText />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`${Tokens.standardInput}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                  />
                )}
                name="email"
              />
              {errors.email && (
                <View className="flex-row items-center mt-1 ml-1">
                <AlertIcon size={20} color={"#F44336"} />
                <Text className="text-red-500"> {errors.email.message}</Text>
              </View>
              )}
              <View className="my-5 items-center justify-center">
                <CustomButton
                  text="Realizar solicitud"
                  customFun={onSubmit}
                />
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
