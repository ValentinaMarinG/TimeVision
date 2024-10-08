import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

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

  const toggleExpandTicket = (ticketId: string) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

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
                      className={`w-[17] h-[17] rounded-full  ${ticketMap.state === "aprobado"
                        ? "bg-green-500"
                        : ticketMap.state === "pendiente"
                          ? "bg-orange-500"
                          : ticketMap.state === "rechazado"
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
                          Descripción: {" "}
                          <Text className="font-normal text-md">
                            {
                              ticketMap.description
                            }
                          </Text>
                        </Text>
                        <Text className="font-bold text-lg">
                          Estado: {" "}
                          <Text className="font-normal text-md">
                            {
                              ticketMap.state
                            }
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
