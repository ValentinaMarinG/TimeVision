import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "../organisms/BottomBar";
import { AddButton, CustomButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import { SubTitleTextTickets } from "../atoms/SubtitleText";
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "space-between",
  },
  text: {
    color: "black",
    textAlign: "center",
    marginTop: 20,
    fontSize: 24,
  },
});
