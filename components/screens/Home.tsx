import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "../organisms/BottomBar";
import { ShiftTextHome, SubTitleTextHome } from '../atoms/SubtitleText';
import { TitleTextHome } from '../atoms/TitleText';
import HomeCard from '../organisms/HomeInfo';
import SearchInput from '../organisms/SearchInput';
import ShiftsList from '../organisms/ShiftsList';

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View className={`flex-1 pt-${insets.top} pb-${insets.bottom} px-5`}>
      <View className="flex-1 justify-between">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
        <BottomBar activeRoute="/home" />
      </View>
    </View>
  );
}
