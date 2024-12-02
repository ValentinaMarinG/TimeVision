import { View, Text, ScrollView, Modal, BackHandler, ActivityIndicator, TouchableOpacity, Pressable } from "react-native";
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

import { useShiftsStore, useProfileStore } from "../../store/Store";

export default function Home() {
  const { account, fetchUserInfo } = useProfileStore()
  const { shifts, loading, fetchShifts } = useShiftsStore()
  const [modalVisible, setModalVisible] = React.useState(false);
  const [notificationToken, setNotificationToken] = React.useState<string | null>(null);

  useEffect(() => {
    fetchUserInfo()
    fetchShifts()

  }, [])

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
        <Pressable 
          onPress={handleModalClose}
          className="flex-1 justify-center items-center bg-black/70"
        >
          <Pressable 
            onPress={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-3xl w-[75%] items-center shadow-lg"
          >
            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Text className="text-3xl">⚠️</Text>
            </View>
            <Text className="text-center text-base text-gray-600 mb-6">
              ¿Estás seguro que deseas cerrar la aplicación?
            </Text>
            
            <View className="w-full space-y-3">
              <Pressable 
                onPress={handleModalClose}
                className="active:opacity-80"
              >
                <View className="w-full bg-[#4894FE] border-2 border-gray-200 py-3 rounded-xl">
                  <Text className="text-center text-white font-medium">
                    Cancelar
                  </Text>
                </View>
              </Pressable>
              
              <Pressable 
                onPress={handleExit}
                className="active:opacity-80"
              >
                <View className="w-full bg-gray-500 py-3 rounded-xl">
                  <Text className="text-center text-white font-medium">
                    Cerrar App
                  </Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}