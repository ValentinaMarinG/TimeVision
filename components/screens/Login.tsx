import React, { useState, useEffect } from "react";
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
import NetInfo from '@react-native-community/netinfo'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainIcon } from "../atoms/Icon";
import { TitleTextLogin } from "../atoms/TitleText";
import { SubTitleTextLogin } from "../atoms/SubtitleText";
import {
  LoginUserText,
  LoginPasswordText,
  AccessModal,
} from "../atoms/DescriptionText";
import { CustomButton } from "../atoms/CustomButton";
import { SubTitleTextRequest } from "../atoms/SubtitleText";
import * as Tokens from "../tokens";
import { useRouter } from "expo-router";
import { loginRequest } from "../../config/routers";
import { Ionicons } from '@expo/vector-icons';

// Interface para las credenciales
interface StoredCredentials {
  user: string;
  pass: string;
  lastLoginTime: number;
}

const CREDENTIALS_KEY = '@app_credentials';
const OFFLINE_TOKEN_KEY = '@offline_token';
const OFFLINE_EXPIRY_DAYS = 7;

export default function Login() {
  const [user, setUser] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [userError, setUserError] = useState<string>("");
  const [passError, setPassError] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const router = useRouter();

  // Monitorear el estado de la conexión
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    checkStoredCredentials();

    return () => {
      unsubscribe();
    };
  }, []);

  const checkStoredCredentials = async () => {
    try {
      const storedCredentialsJson = await AsyncStorage.getItem(CREDENTIALS_KEY);
      if (storedCredentialsJson) {
        const storedCredentials: StoredCredentials = JSON.parse(storedCredentialsJson);
        const expiryTime = storedCredentials.lastLoginTime + (OFFLINE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        
        if (new Date().getTime() < expiryTime) {
          setUser(storedCredentials.user);
          setPass(storedCredentials.pass);
        } else {
          await AsyncStorage.multiRemove([CREDENTIALS_KEY, OFFLINE_TOKEN_KEY]);
        }
      }
    } catch (error) {
      console.error('Error al recuperar credenciales:', error);
    }
  };

  const storeCredentials = async (user: string, pass: string) => {
    try {
      const credentials: StoredCredentials = {
        user,
        pass,
        lastLoginTime: new Date().getTime()
      };
      await AsyncStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
    } catch (error) {
      console.error('Error al guardar credenciales:', error);
    }
  };

  const validateOfflineCredentials = async () => {
    try {
      const storedCredentialsJson = await AsyncStorage.getItem(CREDENTIALS_KEY);
      const offlineToken = await AsyncStorage.getItem(OFFLINE_TOKEN_KEY);
      
      if (storedCredentialsJson && offlineToken) {
        const storedCredentials: StoredCredentials = JSON.parse(storedCredentialsJson);
        const expiryTime = storedCredentials.lastLoginTime + (OFFLINE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        
        if (new Date().getTime() < expiryTime &&
            user === storedCredentials.user &&
            pass === storedCredentials.pass) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error al validar credenciales offline:', error);
      return false;
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handlePress = async () => {
    let valid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sqlInjectionRegex = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|;|--)\b)/i;

    setUserError("");
    setPassError("");
    setLoginError("");

    // Validaciones
    if (!user) {
      setUserError("El correo es requerido");
      valid = false;
    } else if (!emailRegex.test(user)) {
      setUserError("Ingresa un correo válido");
      valid = false;
    } else if (sqlInjectionRegex.test(user)) {
      setUserError("El correo contiene caracteres no permitidos.");
      valid = false;
    }

    if (!pass) {
      setPassError("La contraseña es requerida");
      valid = false;
    } else if (sqlInjectionRegex.test(pass)) {
      setPassError("La contraseña contiene caracteres no permitidos.");
      valid = false;
    }

    if (valid) {
      if (isOffline) {
        // Modo offline
        const isValidOffline = await validateOfflineCredentials();
        if (isValidOffline) {
          router.push("/home");
        } else {
          setModalVisible(true);
          setLoginError("No se pueden validar las credenciales sin conexión");
        }
      } else {
        
        const result = await loginRequest(user, pass);
        if (result?.success) {
          // Guardar credenciales y token para uso offline
          await storeCredentials(user, pass);
          const token = await AsyncStorage.getItem("token");
          if (token) {
            await AsyncStorage.setItem(OFFLINE_TOKEN_KEY, token);
            router.push("/home");
          }
        } else {
          setModalVisible(true);
          setLoginError(result?.message || "Error desconocido");
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white mt-8"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 flex-grow mt-[90] bg-white">
            {isOffline && (
              <View className="bg-yellow-100 p-2">
                <Text className="text-center text-yellow-800">
                  Modo sin conexión
                </Text>
              </View>
            )}
            <View className="justify-center items-center mx-5">
              <TitleTextLogin />
              <MainIcon
                size={Tokens.logoSizeIcon}
                source={require("../../assets/LogoGrey.png")}
              />
              <SubTitleTextLogin />
            </View>
            <View className="items-center mt-5">
              <View className="w-72 flex-1">
                <LoginUserText />
                <TextInput
                  className={`${Tokens.standardInput} mb-4`}
                  onChangeText={setUser}
                  value={user ?? ""}
                />
                {userError ? (
                  <Text className="text-red-500">{userError}</Text>
                ) : null}
                <LoginPasswordText />
                <View className="flex-row items-center rounded-xl bg-gray-200 pr-2">
                  <TextInput
                    className={`${Tokens.standardInput} flex-1`}
                    onChangeText={setPass}
                    value={pass ?? ""}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye" : "eye-off"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                {passError ? (
                  <Text className="text-red-500">{passError}</Text>
                ) : null}
              </View>
            </View>
            <View className="justify-center items-center mx-10">
              <View className="w-full items-center justify-between mt-9">
                <CustomButton 
                  text={isOffline ? "Ingresar (Modo offline)" : "Ingresar"} 
                  customFun={handlePress} 
                />
              </View>
              <SubTitleTextRequest />
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