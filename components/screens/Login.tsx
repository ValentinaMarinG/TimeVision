import { View, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { MainIcon } from "../atoms/Icon";
import { useState } from "react";
import { TitleTextLogin } from "../atoms/TitleText";
import { SubTitleTextLogin } from "../atoms/SubtitleText";
import { LoginUserText } from "../atoms/DescriptionText";
import { LoginPasswordText } from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { SubTitleTextRequest } from "../atoms/SubtitleText";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Tokens from '../tokens'

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const router = useRouter();

  const handlePress = () => {
    router.push("/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white w-full">
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center">
          <View className="flex justify-center items-center my-2">
            <TitleTextLogin />
            <MainIcon size={Tokens.logoSizeIcon} source={require("../../assets/LogoGrey.png")} />
            <SubTitleTextLogin />
          </View>
          <View className="w-3/4 m-5">
            <LoginUserText />
            <TextInput
              className={`${Tokens.standardInput}`}
              onChangeText={setUser}
            />
            <LoginPasswordText />
            <TextInput
              className={`${Tokens.standardInput}`}
              onChangeText={setPass}
            />
            <View className="my-4 items-center justify-center">
              <CustomButton text="Ingresar" customFun={handlePress} />
              <SubTitleTextRequest />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
