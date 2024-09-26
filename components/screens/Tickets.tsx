import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import { useState } from "react";
import { TitleTextTickets } from "../atoms/TitleText";
import BottomBar from "../organisms/BottomBar"

export default function Tickets() {
  const insets = useSafeAreaInsets();

  const [tickets, setTickets] = useState([]);

  const router = useRouter();

  const handlePress = () => {
    router.push("/ticketrequest");
  };

  return (
    <View className="flex-1 w-full mt-9 justify-between " style={{ paddingBottom: insets.bottom }}>
      <View className="justify-center items-center border-b border-slate-200">
        <TitleTextTickets/>
      </View>
      <View className="w-full h-full flex justify-start items-center">
      <ScrollView className="w-full flex-1">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <View key={ticket /* .id */} className="w-11/12 h-24 m-5 flex flex-row justify-around items-center rounded-lg bg-gray-200">
              <View>
                <Text className="font-bold text-lg">Tipo de solicitud: {/* ticket.tipo */}</Text>
                <Text className="text-lg">Título: {/* ticket.titulo */}</Text>
                <Text className="text-lg">Fecha: {/* {ticket.fecha */}</Text>
              </View>
              <View className="h-full flex flex-col items-end justify-around">
                <View className="w-[30] h-[30] rounded-full bg-orange-500"></View>
                <View><Text>Ticket #{/* ticket.id */}</Text></View>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-lg mt-5">No tienes solicitudes aún.</Text>
        )}
      </ScrollView>
      </View>
      <View className="absolute bottom-16 right-6">
        <AddButton text="+" customFun={handlePress} />
      </View>
      <BottomBar activeRoute="/tickets"/>
    </View>
  );
}


