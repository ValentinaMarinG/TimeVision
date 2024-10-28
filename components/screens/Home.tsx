import { View, Text, ScrollView, Modal, BackHandler, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from "react";
import BottomBar from "../organisms/BottomBar";
import { ShiftTextHome, SubTitleTextHome } from '../atoms/SubtitleText';
import HomeCard from '../organisms/HomeInfo';
import { SearchInput } from '../organisms/SearchInput';
import ShiftsList from '../organisms/ShiftsList';
import { getAssigments, getUserInfo } from "../../config/routers";
import { TitleTextHome } from "../atoms/TitleText";
import * as Tokens from "../tokens";
import { CustomButton } from '../atoms/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Shift } from '../../types/types';

export default function Home() {
  const [userInfo, setUserInfo] = useState({ name: "", lastname: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shifts, setShifts] = useState<Shift[]>([]);

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
    const fetchTickets = async () => {
      try {
        const response = await getAssigments();
      if (response?.success) {
        setShifts(response.data ?? []);
        await AsyncStorage.setItem('shifts', JSON.stringify(response.data));
        setLoading(false);
      } else {
        console.error(response?.message);
      }

      } catch (error) {
        console.error("Error al obtener los turnos del usuario", error);
      } finally {
        setLoading(false);
      }
      
    };

    fetchUserData();
    fetchTickets();
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
        return true; 
      };

      BackHandler.addEventListener('hardwareBackPress', handleBackButton);

      return () => BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    }, [])
  );

  return (
    <View className="flex-1 w-full justify-between">
      <View className="flex-1 justify-between px-5 mt-12">
        {loading ? (
          <View className="flex-1 justify-center items-center bg-transparent">
          <View className="p-4 rounded-full bg-transparent border border-[#00d4ff]/50 shadow-md shadow-[#00d4ff]/30">
            <ActivityIndicator size="large" color="#00d4ff" className="scale-110" />
          </View>
        </View>
        ) : (
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
                <ShiftsList shifts={shifts}/>
              </View>
            </View>
          </ScrollView>
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
