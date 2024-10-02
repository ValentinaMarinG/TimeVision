import { View, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "../organisms/BottomBar";
import { ShiftTextHome, SubTitleTextHome } from '../atoms/SubtitleText';
import { TitleTextHome } from '../atoms/TitleText';
import HomeCard from '../organisms/HomeInfo';
import { SearchInput} from '../organisms/SearchInput';
import ShiftsList from '../organisms/ShiftsList';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../config/routers';
import * as Tokens from "../tokens";

export default function Home() {
  const [account, SetAccount] = useState({
    name: "",
    lastname:""
  });


  useEffect(() => {
    SetAccount({
      name: "",
      lastname:""
    });
    const fetchUser = async () => {
      const response = await getUserInfo();
      if (response?.success) {
        SetAccount({
          name: response?.data.name,
          lastname: response?.data.lastname
        });
      } else {
        console.error(response?.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <View className="flex-1 w-full justify-between">
      <View className="flex-1 justify-between px-5 mt-12">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="mb-5">
            <SubTitleTextHome />
            <Text className={`${Tokens.standardTextTitleBold}`}>Hola {account.name}</Text>
          </View>
          <View className="mb-5">
            <HomeCard />
          </View>
          <View className="mb-5">
            <SearchInput />
          </View>
          <View>
            <ShiftTextHome />
            <View className="flex-col">
              <ShiftsList />
              <ShiftsList />
              <ShiftsList />
              <ShiftsList />
              <ShiftsList />
              <ShiftsList />
              <ShiftsList />
            </View>
          </View>
        </ScrollView>

      </View>
      <BottomBar activeRoute="/home" />
    </View>
  );
}
