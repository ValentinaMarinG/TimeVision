import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "../organisms/BottomBar";
import { AddButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import { TitleTextTickets } from "../atoms/TitleText";

export default function Tickets() {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const handlePress = () => {
    router.push("/ticketrequest");
  };

  return (
    <View className="flex-1 w-full justify-between" style={{ paddingBottom: insets.bottom }}>
      <View className="justify-center items-center border-b border-slate-200">
        <TitleTextTickets/>
      </View>
      <View className="absolute bottom-20 right-6">
        <AddButton text="+" customFun={handlePress} />
      </View>
      <BottomBar activeRoute="/tickets" />
    </View>
  );
}


