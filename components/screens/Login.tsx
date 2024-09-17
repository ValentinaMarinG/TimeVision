import React, { useState } from 'react';
import { View, TextInput, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { MainIcon } from '../atoms/Icon';
import { TitleTextLogin } from '../atoms/TitleText';
import { SubTitleTextLogin } from '../atoms/SubtitleText';
import { LoginUserText, LoginPasswordText } from '../atoms/DescriptionText';
import { CustomButton } from '../atoms/CustomButton';
import { SubTitleTextRequest } from '../atoms/SubtitleText';
import * as Tokens from '../tokens';
import { useRouter } from 'expo-router';

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const router = useRouter();  

  const handleLogin = () => {
    router.push('/home');
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
          <View className="flex-grow mt-[70]">
            <View className="justify-center items-center mx-5">
              <TitleTextLogin />
              <MainIcon size={Tokens.logoSizeIcon} source={require("../../assets/LogoGrey.png")} />
              <SubTitleTextLogin />
            </View>
            <View className="items-center mt-5">
              <View className="w-72">
                <LoginUserText />
                <TextInput
                  className={`${Tokens.standardInput}`}
                  onChangeText={setUser}
                />
                <LoginPasswordText />
                <TextInput
                  className={`${Tokens.standardInput}`}
                  onChangeText={setPass}
                  secureTextEntry={true}
                />
              </View>
            </View>
            <View className="justify-center items-center mx-10">
              <View className="w-full items-center justify-between">
                <CustomButton text="Ingresar" customFun={handleLogin} />
              </View>
              <SubTitleTextRequest />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
