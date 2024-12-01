import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TitleTextTickets } from "../atoms/TitleText";
import BottomBar from "../organisms/BottomBar";

import * as Tokens from "../tokens";
import { useTicketsStore } from '../../store/Store' 

export default function Tickets() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { tickets, loading, error, fetchTickets } = useTicketsStore()
  
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets()
  }, [])

  const handlePress = () => {
    router.push("/ticketrequest");
  };

  const toggleExpandTicket = (ticketId: string) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-transparent">
        <View className="p-4 rounded-full bg-transparent border border-[#00d4ff]/50 shadow-md shadow-[#00d4ff]/30">
          <ActivityIndicator size="large" color="#00d4ff" />
        </View>
        <Text className="mt-4 text-lg font-semibold text-[#00d4ff]">
          Cargando Solicitudes...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">{error}</Text>
      </View>
    )
  }

  return (
    <View
      className="flex-1 w-full mt-9 justify-between"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="justify-center items-center border-b border-slate-200 mt-3">
        <TitleTextTickets />
      </View>
      <View className="w-full flex-1 justify-start items-center">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {tickets.length > 0 ? (
            tickets.map((ticketMap) => (
              <View key={ticketMap._id}>
                <View className="left-80 top-8 z-10">
                  <View
                    className={`w-[17] h-[17] rounded-full  ${
                      ticketMap.state === "Aceptada"
                        ? "bg-green-500"
                        : ticketMap.state === "pendiente"
                        ? "bg-orange-500"
                        : ticketMap.state === "Rechazada"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  ></View>
                </View>
                <TouchableOpacity
                  onPress={() => toggleExpandTicket(ticketMap._id)}
                  className="mb-2 w-[350] h-auto p-2 flex-row items-center rounded-lg bg-gray-200"
                >
                  <View className="w-3/4 ml-2">
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
                    <Text className="font-bold text-lg">
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
                    {expandedTicketId === ticketMap._id && (
                      <View>
                        <Text className="font-bold text-lg">
                          Descripción:{" "}
                          <Text className="font-normal text-md">
                            {ticketMap.description}
                          </Text>
                        </Text>
                        <Text className="font-bold text-lg">
                          Estado:{" "}
                          <Text className="font-normal text-md">
                            {ticketMap.state}
                          </Text>
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
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