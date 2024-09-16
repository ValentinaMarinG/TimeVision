import {
  View,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { TitleTextAccess } from "../atoms/TitleText";
import { SubTitleTextAccess } from "../atoms/SubtitleText";
import { AccessModal, LoginUserText } from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainIcon } from "../atoms/Icon";

import * as Tokens from "../tokens";

export default function Login() {
  const [user, setUser] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    router.push("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white w-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center">
          <View className="flex justify-center items-center my-2">
            <TitleTextAccess />
            <MainIcon
              size={115}
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
              onChangeText={setUser}
            />
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
          <View className="flex-1 justify-center items-center bg-[#858585] bg-opacity-25">
            <View className="bg-white p-6 rounded-lg w-3/4 items-center">
              <AccessModal />
              <CustomButton text="Salir" customFun={handleModalClose} />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


