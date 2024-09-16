import { View, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { MainIcon } from "../atoms/Icon";
import { useState } from "react";
import { TitleTextLogin } from "../atoms/TitleText";
import { SubTitleTextLogin } from "../atoms/SubtitleText";
import { LoginUserText } from "../atoms/DescriptionText";
import { LoginPasswordText } from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { SubTitleTextRequest } from "../atoms/SubtitleText";
import { useRouter } from "expo-router";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const router = useRouter();

  const handlePress = () => {
    router.push("/home");
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-grow mt-[55]">
            <View className="justify-center items-center mx-5">
              <TitleTextLogin />
              <MainIcon size={115} source={require("../../assets/LogoGrey.png")} />
              <SubTitleTextLogin />
            </View>

            <View className="items-center">
              <View className="w-72">
                <LoginUserText />
                <TextInput
                  className="h-12 w-full rounded-xl bg-ColorInput mb-5 pl-2"
                  onChangeText={setUser}
                />
                <LoginPasswordText />
                <TextInput
                  className="h-12 w-full rounded-xl bg-ColorInput mb-5 pl-2"
                  onChangeText={setPass}
                  secureTextEntry={true}
                />
              </View>
            </View>
            <View className="justify-center items-center mx-5">
              <View className="m-4 items-center justify-between">
                <CustomButton text="Ingresa" customFun={handlePress} />
              </View>
              <SubTitleTextRequest />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
