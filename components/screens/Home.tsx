import { View, Text, ScrollView, Modal, BackHandler, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import BottomBar from "../organisms/BottomBar";
import { ShiftTextHome, SubTitleTextHome } from "../atoms/SubtitleText";
import HomeCard from "../organisms/HomeInfo";
import { SearchInput } from "../organisms/SearchInput";
import ShiftsList from "../organisms/ShiftsList";
import { TitleTextHome } from "../atoms/TitleText";
import * as Tokens from "../tokens";
import { CustomButton } from "../atoms/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { getExpoPushToken } from "../../notifications";
import * as Clipboard from "expo-clipboard";

import { useShiftsStore, useProfileStore } from "../../store/Store";
import { setNotificationCategoryAsync } from "expo-notifications";

export default function Home() {
  const { account, fetchUserInfo } = useProfileStore()
  const { shifts, loading, fetchShifts } = useShiftsStore()
  const [modalVisible, setModalVisible] = React.useState(false);
  const [notificationToken, setNotificationToken] = React.useState<string | null>(null);

  useEffect(() => {
    fetchUserInfo()
    fetchShifts()

    getExpoPushToken().then((token) => { setNotificationToken(token) })

  }, [])
  const copyTokenToClipboard = async () => {
    if (notificationToken) {
      await Clipboard.setStringAsync(notificationToken);
      console.log('Éxito', 'Token copiado al portapapeles');
    }
  };

  const handleModalClose = () => setModalVisible(false);

  async function close() {
    await AsyncStorage.clear();
  }

  const handleExit = () => {
    close();
    BackHandler.exitApp();
  };

  useFocusEffect(
    React.useCallback(() => {
      const handleBackButton = () => {
        setModalVisible(true);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackButton);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    }, [])
  );

  return (
    <View className="flex-1 w-full justify-between">
      <View className="flex-1 justify-between px-5 mt-12">
        {loading ? (
          <View className="flex-1 justify-center items-center bg-transparent">
            <View className="p-4 rounded-full bg-transparent border border-[#00d4ff]/50 shadow-md shadow-[#00d4ff]/30">
              <ActivityIndicator size="large" color="#00d4ff" />
            </View>
          </View>
        ) : (
          <>
            <View className="mb-3">
              <SubTitleTextHome />
              <Text className={`${Tokens.standardTextTitleBold}`}>
                <TitleTextHome /> {account.name}
              </Text>
            </View>
            <View className="mb-3">
              <HomeCard
                name={account.name}
                lastname={account.lastname}
                photo={account.photo || ""}
              />
            </View>
            <TouchableOpacity
              onPress={copyTokenToClipboard}
              className="mb-3 p-4 bg-white rounded-lg shadow-sm border border-[#00d4ff]/20"
            >
              <Text className="text-base font-bold mb-2 text-[#00d4ff]">
                Token de Notificaciones
              </Text>
              <Text className="text-sm text-gray-600" numberOfLines={1} ellipsizeMode="middle">
                {notificationToken || 'Cargando token...'}
              </Text>
              <Text className="text-xs text-gray-400 mt-2">
                Toca para copiar el token
              </Text>
            </TouchableOpacity>
            <View className="mb-5">
              <SearchInput />
            </View>
            <View className="flex-1">
              <ShiftTextHome />
              <ScrollView
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              >
                <ShiftsList shifts={shifts} />
              </ScrollView>
            </View>
          </>
        )}
      </View>
      <BottomBar activeRoute="/home" />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 justify-center items-center bg-[#858585] opacity-90">
          <View className="bg-white p-6 rounded-lg w-3/4 items-center">
            <Text className="text-center text-lg text-[#858585] my-5">
              ¿Desea cerrar la aplicación?
            </Text>
            <View className="my-2 w-full justify-center items-center">
              <CustomButton text="Cancelar" customFun={handleModalClose} />
            </View>
            <CustomButton text="Cerrar App" customFun={handleExit} />
          </View>
        </View>
      </Modal>
    </View>
  );
}