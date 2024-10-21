import { View, Text, ScrollView, Modal, Alert, BackHandler } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import BottomBar from "../organisms/BottomBar";
import { ShiftTextHome, SubTitleTextHome } from '../atoms/SubtitleText';
import HomeCard from '../organisms/HomeInfo';
import { SearchInput } from '../organisms/SearchInput';
import ShiftsList from '../organisms/ShiftsList';
import { getUserInfo } from "../../config/routers";
import { TitleTextHome } from "../atoms/TitleText";
import * as Tokens from "../tokens";
import {CustomButton} from '../atoms/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

export default function Home() {
  const [userInfo, setUserInfo] = useState({ name: "", lastname: "" });
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getUserInfo();
        if (userResponse?.success) {
          const { name, lastname } = userResponse.data;
          setUserInfo({ name, lastname });
        } else {
          console.error(userResponse?.message);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario", error);
      }
    };

    fetchUserData();
  }, []);

  const handleModalClose = () => {
    setModalVisible(false);
  };

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
        return true; // Esto evita que la aplicación retroceda
      };

      BackHandler.addEventListener('hardwareBackPress', handleBackButton);

      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    }, [])
  );

  return (
    <View className="flex-1 w-full justify-between">
      <View className="flex-1 justify-between px-5 mt-12">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="mb-3">
            <SubTitleTextHome />
            <Text className={`${Tokens.standardTextTitleBold}`}>
              <TitleTextHome /> {userInfo.name}
            </Text>
          </View>
          <View className="mb-3">
            <HomeCard />
          </View>
          <View className="mb-5">
            <SearchInput />
          </View>
          <View>
            <ShiftTextHome />
            <View className="flex-col">
              <ShiftsList />
            </View>
          </View>
        </ScrollView>
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
            <View className='my-2 w-full justify-center items-center'>
            <CustomButton text="Cancelar" customFun={handleModalClose}/>
            </View>
            <CustomButton text="Cerrar App" customFun={handleExit} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
