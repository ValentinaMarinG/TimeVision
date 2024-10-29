import {
  View,
  Text,
  ScrollView,
  Modal,
  BackHandler,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import BottomBar from "../organisms/BottomBar";
import { ShiftTextHome, SubTitleTextHome } from "../atoms/SubtitleText";
import HomeCard from "../organisms/HomeInfo";
import { SearchInput } from "../organisms/SearchInput";
import ShiftsList from "../organisms/ShiftsList";
import { getAssigments, getUserInfo } from "../../config/routers";
import { TitleTextHome } from "../atoms/TitleText";
import * as Tokens from "../tokens";
import { CustomButton } from "../atoms/CustomButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { Shift } from "../../types/types";
import * as SQLite from "expo-sqlite";
import { User } from "../../types/types";
import NetInfo from "@react-native-community/netinfo";

export default function Home() {
  const [userInfo, setUserInfo] = useState<{ name: string; lastname: string; photo: string | undefined; email: string;}>({ name: "", lastname: "", photo: "", email:"" });
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);

  const initializeDatabase = async () => {
    try {
      /* await SQLite.deleteDatabaseAsync("dataBase.db"); */
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

  const createDataBase = async () => {
    try {
      const db = await initializeDatabase();

      if (!db) {
        console.log("Error", "No se pudo acceder a la base de datos local.");
        return;
      }

      /* await db.execAsync(`DROP TABLE IF EXISTS requests;`) */
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS requests (
        _id INTEGER PRIMARY KEY AUTOINCREMENT,
        idMongo TEXT,
        type TEXT,
        title TEXT,
        description TEXT,
        start_date TEXT,
        end_date TEXT,
        state TEXT,
        user_email TEXT
      );
      `);

      /* await db.execAsync(`DROP TABLE IF EXISTS users;`) */
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          lastname TEXT,
          type_doc TEXT,
          num_doc TEXT,
          email TEXT,
          position TEXT,
          id_department TEXT,
          photo TEXT
        );
        `);

      /* await db.execAsync(`DROP TABLE IF EXISTS shifts;`); */
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS shifts (
          _id INTEGER PRIMARY KEY AUTOINCREMENT,
          idMongo TEXT,
          end_date TEXT,
          start_date TEXT,
          name_shift TEXT,
          time_end TEXT,
          time_start TEXT,
          user_email TEXT
        );
        `);

      /* VERIFICAR CREACIÓN DE TABLAS REQUEST Y USERS */
      const result = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );
      console.log("Tablas en la base de datos local:", result);
    } catch (error) {
      console.error("Error al crear la base de datos local:", error);
    }
  };

  const getUserSQLite = async () => {
    try {
      const db = await initializeDatabase();
      if (!db) {
        Alert.alert("Error", "No se pudo acceder a la base de datos local.");
        return null;
      }
      const email = await AsyncStorage.getItem("user_email");
      const results = await db.getAllAsync<User>(`SELECT * FROM users WHERE email = ?;`,[email]);

      if (results.length > 0) {
        const { name, lastname, photo, email } = results[0];
        setUserInfo({ name, lastname, photo, email });
        return { name, lastname, photo, email };
      } else {
        console.warn(
          "No se encontró ningún usuario en la base de datos local."
        );
        return { name: "", lastname: "", photo:"", email:"" };
      }
    } catch (error) {
      console.error(
        "Error al llamar la base de datos local encontrar usuario:",
        error
      );
      return { name: "", lastname: "", photo:"", email:"" };
    }
  };

  const getShiftLocal = async () => {
    try {
      const db = await initializeDatabase();
      if (!db) return;
      const email = await AsyncStorage.getItem("user_email")
      const results = await db.getAllAsync<Shift>(`SELECT * FROM shifts WHERE user_email = ?;`,[userInfo.email]);
      setShifts(results || []);
    } catch (error) {
      console.error("Error al obtener shifts locales:", error);
    }
  };

  const insertUserSQLite = async (data: User) => {
    try {
      const db = await initializeDatabase();

      if (!db) {
        Alert.alert("Error", "No se pudo acceder a la base de datos local.");
        return;
      }

      const existingUser = await db.getAllAsync(
        "SELECT * FROM users WHERE email = ?",
        [data.email]
      );

      if (existingUser.length > 0) {
        console.log("El usuario ya se registró en la base de datos local");
      } else {
        await db.runAsync(
          `INSERT INTO users (name, lastname, type_doc, num_doc, email, position, id_department, photo)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            data.name,
            data.lastname,
            data.type_doc,
            data.num_doc.toString(),
            data.email,
            data.position,
            data.id_department.toString(),
            data.photo || ""
          ]
        );
      }
    } catch (error) {
      console.log(
        "Error al llamar la base de datos local para insertar usuario:",
        error
      );
    }
  };

  const insertShiftsSQLite = async (data: Shift[]) => {
    try {
      const db = await initializeDatabase();

      if (!db) {
        Alert.alert("Error", "No se pudo acceder a la base de datos local.");
        return;
      }

      if (data.length > 0) {
        const insertPromises = data.map(async (item) => {
          const startDate = new Date(item.start_date);
          const endDate = new Date(item.end_date);
          const startTime = new Date(item.time_start);
          const endTime = new Date(item.time_end);
          const user_email = await AsyncStorage.getItem("user_email");  

          const existingShift = await db.getAllAsync(
            "SELECT * FROM shifts WHERE idMongo = ?",
            [item._id]
          );

          if (existingShift.length > 0) {
            console.log(
              `Shift con idMongo ${item._id} ya existe. No se insertará.`
            );
          } else {
            await db.runAsync(
              `INSERT INTO shifts (idMongo, end_date, start_date, name_shift, time_end, time_start, user_email)
              VALUES (?, ?, ?, ?, ?, ?, ?);`,
              [
                item._id,
                endDate.toISOString(),
                startDate.toISOString(),
                item.name_shift,
                endTime.toISOString(),
                startTime.toISOString(),
                user_email
              ]
            );
            console.log(`shifts con idMongo ${item._id} insertado.`);
          }
        });

        await Promise.all(insertPromises);
      } else {
        console.log("No hay turnos para guardar en la base de datos");
      }
    } catch (error) {
      console.log(
        "Error al llamar la base de datos local para insertar un shift:",
        error
      );
    }
  };

  useEffect(() => {
    createDataBase();
    const loadingCheck = async () => {
      const loadingStatus = await AsyncStorage.getItem("loadingStatus");
      if (loadingStatus === 'false') {
        setLoading(true);
        await AsyncStorage.setItem('loadingStatus', 'true');
      }
    };

    const fetchUserData = async () => {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const userResponse = await getUserInfo();
          if (userResponse?.success) {
            const { name, lastname, photo, email } = userResponse.data;
            await AsyncStorage.setItem('user_email', email);
            setUserInfo({ name, lastname, photo, email });
            insertUserSQLite(userResponse.data);
          } else {
            throw new Error("No data from server");
          }
        } catch (error) {
          console.warn("Error al obtener datos del usuario del backend. Cargando desde SQLite.");
          const localUser = await getUserSQLite();
          if (localUser) {
            setUserInfo(localUser);
          }
          console.error("Error al obtener datos del usuario", error);
        }
      } else {
        console.warn("Sin conexión a Internet. Cargando datos desde SQLite.");
        const localUser = await getUserSQLite();
        if (localUser) {
          setUserInfo(localUser);
        }
      }
    };

    const fetchTickets = async () => {
      const state = await NetInfo.fetch();
      if (state.isConnected) {
        try {
          const response = await getAssigments();
          if (response?.success) {
            const data = response.data;
            setShifts(data ?? []);
            insertShiftsSQLite(data ?? []);
            setLoading(false);
          } else {
            throw new Error("No data from server");
          }
        } catch (error) {
          console.warn("Error al obtener datos del backend. Cargando desde SQLite.");
          getShiftLocal();
        } finally {
          setLoading(false);
        }
      } else {
        console.warn("Sin conexión a Internet. Cargando datos desde SQLite.");
        getShiftLocal();
      }
    };

    loadingCheck();
    fetchUserData();
    fetchTickets();
  }, []);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  async function close() {
    await AsyncStorage.clear();
  }

  const handleExit = () => {
    close();
    BackHandler.exitApp();
  };

  useFocusEffect(
    React.useCallback(() => {
      const handleBackButton = () => {
        setModalVisible(true);
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", handleBackButton);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackButton);
    }, [])
  );

  return (
    <View className="flex-1 w-full justify-between">
      <View className="flex-1 justify-between px-5 mt-12">
        {loading ? (
          <View className="flex-1 justify-center items-center bg-transparent">
          <View className="p-4 rounded-full bg-transparent border border-[#00d4ff]/50 shadow-md shadow-[#00d4ff]/30">
            <ActivityIndicator size="large" color="#00d4ff" className="scale-110" />
          </View>
        </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="mb-3">
              <SubTitleTextHome />
              <Text className={`${Tokens.standardTextTitleBold}`}>
                <TitleTextHome /> {userInfo.name}
              </Text>
            </View>
            <View className="mb-3">
              <HomeCard name={userInfo.name} lastname={userInfo.lastname} photo={userInfo.photo || ""}/>
            </View>
            <View className="mb-5">
              <SearchInput />
            </View>
            <View>
              <ShiftTextHome />
              <View className="flex-col">
                <ShiftsList shifts={shifts} />
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      <BottomBar activeRoute="/home" />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View className="flex-1 justify-center items-center bg-[#858585] opacity-90">
          <View className="bg-white p-6 rounded-lg w-3/4 items-center">
            <Text className="text-center text-lg text-[#858585] my-5">
              ¿Desea cerrar la aplicación?
            </Text>
            <View className="my-2 w-full justify-center items-center">
              <CustomButton text="Cancelar" customFun={handleModalClose} />
            </View>
            <CustomButton text="Cerrar App" customFun={handleExit} />
          </View>
        </View>
      </Modal>
    </View>
  );
}
