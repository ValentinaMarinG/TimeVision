import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TitleTextTickets } from "../atoms/TitleText";
import BottomBar from "../organisms/BottomBar";

import * as Tokens from "../tokens";
import { createRequest, getTickets } from "../../config/routers";
import { Ticket } from "../../types/types";
import * as SQLite from "expo-sqlite/next";
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Tickets() {
  const insets = useSafeAreaInsets();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketslocal, setTicketslocal] = useState<Ticket[]>([]);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const router = useRouter();

  const handlePress = () => {
    router.push("/ticketrequest");
  };

  const initializeDatabase = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("dataBase.db");
      if (db) {
        console.log("Base de datos inicializada correctamente");
      }
      return db;
    } catch (error) {
      console.error("Error al inicializar la base de datos:", error);
      return null;
    }
  };

  const insertRequestSQLite = async (data: Ticket[]) => {
    try {
      const db = await initializeDatabase();

      if (!db) {
        Alert.alert("Error", "No se pudo acceder a la base de datos local.");
        return;
      }

      const insertPromises = data.map(async (item) => {
        const startDate = new Date(item.start_date);
        const endDate = new Date(item.end_date);

        const existingTicket = await db.getAllAsync(
          "SELECT * FROM requests WHERE idMongo = ?",
          [item._id]
        );

        if (existingTicket.length > 0) {
          console.log(
            `Ticket con idMongo ${item._id} ya existe. No se insertará.`
          );
        } else {
          const email = await AsyncStorage.getItem('user_email')
          await db.runAsync(
            `INSERT INTO requests (idMongo, type, title, start_date, end_date, description, state, user_email)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              item._id,
              item.type,
              item.title,
              startDate.toISOString(),
              endDate.toISOString(),
              item.description,
              item.state,
              email
            ]
          );
          console.log(`Ticket con idMongo ${item._id} insertado.`);
        }
      });

      await Promise.all(insertPromises);
    } catch (error) {
      console.log(
        "Error al llamar la base de datos local en la insercion de tickets:",
        error
      );
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      const netInfoState = await NetInfo.fetch();
      if (netInfoState.isConnected) {
        try {
          const response = await getTickets();
          if (response?.success) {
            const data = response.data;
            insertRequestSQLite(data);
            setTickets(data);
            syncTicketsToMongo();
          } else {
            throw new Error("No data from server");
          }
        } catch (error) {
          console.warn(
            "Fallo en la conexión o en la carga de datos. Cargando desde SQLite."
          );
          getTicketLocal();
        }
      } else {
        console.warn("No hay conexión a Internet. Cargando desde SQLite.");
        getTicketLocal();
      }
    };
    fetchTickets();
  }, []);

  const getTicketLocal = async () => {
    try {
      const db = await initializeDatabase();
      if (!db) return;
      const email = await AsyncStorage.getItem("user_email")

      const results = await db.getAllAsync<Ticket>(`SELECT * FROM requests WHERE user_email = ?;`,[email]);
      setTickets(results || []);
    } catch (error) {
      console.error("Error al obtener tickets locales:", error);
    }
  };

  const syncTicketsToMongo = async () => {
    try {
      const db = await initializeDatabase();
      if (!db) return;

      const localTickets = await db.getAllAsync<Ticket>(
        "SELECT * FROM requests WHERE idMongo IS NULL;"
      );
      for (const ticket of localTickets) {
        const response = await createRequest(
          new Date(ticket.start_date),
          new Date(ticket.end_date),
          ticket.type,
          ticket.title,
          ticket.description,
          imageUri
        );

        if (response.success) {
          await db.runAsync(`DELETE FROM requests WHERE _id = ?`, [ticket._id]);
          console.log(
            `Ticket ${ticket._id} sincronizado y eliminado de SQLite.`
          );
        }
      }
    } catch (error) {
      console.error("Error al sincronizar los tickets:", error);
    }
  };

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
                    className={`w-[17] h-[17] rounded-full  ${
                      ticketMap.state === "aprobado"
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
