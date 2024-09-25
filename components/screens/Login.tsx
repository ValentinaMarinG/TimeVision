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

  const handlePress = () => {

    if (!user || !pass) {
      Alert.alert('Error', 'Debes ingresar un usuario y una contraseña');
      return;
    }
    
    /* try {
      const response = await fetch('http://tu-backend-api.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user, password: pass }),
      });

      const data = await response.json();
      if (data.success) {
        // Si las credenciales son correctas, redirige a la pantalla principal
        router.push('/home');
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión');
    } */
  };
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-grow mt-[90] bg-white">
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
