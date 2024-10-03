import { View,Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import BottomBar from "../organisms/BottomBar";
import { ShiftTextHome, SubTitleTextHome } from '../atoms/SubtitleText';
import HomeCard from '../organisms/HomeInfo';
import { SearchInput } from '../organisms/SearchInput';
import ShiftsList from '../organisms/ShiftsList';
import { getUserInfo } from "../../config/routers";
import {TitleTextHome} from "../atoms/TitleText"
import * as Tokens from "../tokens";

export default function Home() {
  const [userInfo, setUserInfo] = useState({ name: "", lastname: "" });

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

  return (
    <View className="flex-1 w-full justify-between">
      <View className="flex-1 justify-between px-5 mt-12">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="mb-3">
            <SubTitleTextHome />
            <Text className={`${Tokens.standardTextTitleBold}`}><TitleTextHome /> {userInfo.name}</Text>
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
    </View>
  );
}
