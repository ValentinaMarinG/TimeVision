import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "../organisms/BottomBar";
import { ShiftTextHome, SubTitleTextHome } from '../atoms/SubtitleText';
import { TitleTextHome } from '../atoms/TitleText';
import HomeCard from '../organisms/HomeInfo';
import SearchInput from '../organisms/SearchInput';
import ShiftsList from '../organisms/ShiftsList';

export default function Home() {
  return (
    <View className="flex-1 w-full justify-between">
      <View className="flex-1 justify-between px-5 mt-12">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="mb-5">
            <SubTitleTextHome />
            <TitleTextHome />
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
