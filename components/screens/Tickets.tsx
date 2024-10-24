import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TitleTextTickets } from "../atoms/TitleText";
import BottomBar from "../organisms/BottomBar";
import * as Tokens from "../tokens";
import * as SQLite from 'expo-sqlite/next';


interface Ticket {
  id: number;
  type: string;
  title: string;
  start_date: string;
  state: string;
}

export default function Tickets() {
  const insets = useSafeAreaInsets();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePress = () => {
    router.push("/ticketrequest");
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const db = await SQLite.openDatabaseAsync('dataBase.db');

        const results = await db.getAllAsync<Ticket>('SELECT * FROM tikets');
        setTickets(results || []);

      } catch (error) {
        console.error('Error al obtener tickets:', error);
        setError('No se pudieron cargar los tickets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);


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
          {isLoading ? (
            <Text className={`${Tokens.standardSubtitleLogin} mt-5`}>
              Cargando...
            </Text>
          ) : error ? (
            <Text className={`${Tokens.standardSubtitleLogin} mt-5 text-red-500`}>
              {error}
            </Text>
          ) : tickets.length > 0 ? (
            tickets.map((ticketMap) => (
              <View
                key={ticketMap.id}
                className="mt-5 w-[350] h-auto p-2 flex-row items-center rounded-lg bg-gray-200"
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
                  <Text className=" font-bold text-lg">
                    Fecha:{" "}
                    <Text className="font-normal text-md">
                      {ticketMap.start_date ? (
                        new Date(ticketMap.start_date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      ) : (
                        "Fecha no disponible"
                      )}
                    </Text>
                  </Text>
                </View>
                <View className="left-14 bottom-10">
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