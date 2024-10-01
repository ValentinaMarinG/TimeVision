import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TitleTextTickets } from "../atoms/TitleText";
import BottomBar from "../organisms/BottomBar";

import * as Tokens from "../tokens";
import { getTickets } from "../../config/routers";
import { Ticket } from "../../types/games";

export default function Tickets() {
  const insets = useSafeAreaInsets();

  const [tickets, setTickets] = useState<Ticket[]>([]);

  const router = useRouter();

  const handlePress = () => {
    router.push("/ticketrequest");
  };

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await getTickets();
      if (response?.success) {
        setTickets(response?.data);
      } else {
        console.error(response?.message);
      }
    };

    fetchTickets();
  }, []);

  return (
    <View
      className="flex-1 w-full mt-9 justify-between"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="justify-center items-center border-b border-slate-200">
        <TitleTextTickets />
      </View>
      <View className="w-full flex-1 justify-centerb  items-center">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {tickets.length > 0 ? (
            tickets.map((ticketMap) => (
              <View
                key={ticketMap.id}
                className="mt-5 w-full h-24 flex-row justify-center items-center rounded-lg bg-gray-200"
              >
                <View>
                  <Text className="font-bold text-lg">
                    Tipo de solicitud:{" "}
                    <Text className="text-md font-normal">
                      {ticketMap.type}
                    </Text>
                  </Text>
                  <Text className="font-bold text-lg">
                    Título:{" "}
                    <Text className="text-md font-normal">
                      {ticketMap.title}
                    </Text>
                  </Text>
                  <Text className=" font-bold text-lg">
                    Fecha:{" "}
                    <Text className="font-normal text-md">
                      {new Date(ticketMap.start_date).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </Text>
                  </Text>
                </View>
                <View className="h-full flex flex-col items-end left-5 mt-5">
                  <View className="w-[15] h-[15] rounded-full bg-orange-500"></View>
                </View>
              </View>
            ))
          ) : (
            <Text className={`${Tokens.standardSubtitleLogin} mt-5`}>
              No tienes solicitudes aún
            </Text>
          )}
        </ScrollView>
        <View className="absolute bottom-16 right-6">
          <AddButton text="+" customFun={handlePress} />
        </View>
        <BottomBar activeRoute="/tickets" />
      </View>
    </View>
  );
}
