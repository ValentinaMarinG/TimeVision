import { View, Text, ScrollView } from 'react-native';
import { useEffect, useState } from "react";
import BottomBar from "../organisms/BottomBar";
import { ShiftTextHome, SubTitleTextHome } from '../atoms/SubtitleText';
import HomeCard from '../organisms/HomeInfo';
import { SearchInput } from '../organisms/SearchInput';
import ShiftsList from '../organisms/ShiftsList';
import { getUserInfo } from "../../config/routers";
import { TitleTextHome } from "../atoms/TitleText";
import * as Tokens from "../tokens";
import * as SQLite from 'expo-sqlite';
import NetInfo from '@react-native-community/netinfo';

interface UserInfo {
  name: string;
  lastname: string;
  type_doc: string;
  num_doc: string;
  telephone: string;
  email: string;
  password: string;
  photo: string;
  position: string;
  id_department: number;
  id_boss: number;
  active: boolean;
}

// Crear tabla de usuario y agregar configuración inicial
const setupDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('dataBase.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      lastname TEXT,
      type_doc TEXT,
      num_doc TEXT,
      telephone TEXT,
      email TEXT,
      password TEXT,
      photo TEXT,
      position TEXT,
      id_department INTEGER,
      id_boss INTEGER,
      active INTEGER,
      last_sync DATETIME
    );
  `);
};

// Guardar información del usuario en SQLite
const saveUserInfo = async (userInfo: UserInfo) => {
  const db = await SQLite.openDatabaseAsync('dataBase.db');
  await db.runAsync(`
    INSERT INTO user (name, lastname, type_doc, num_doc, telephone, email, password, photo, position, id_department, id_boss, active, last_sync) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    userInfo.name,
    userInfo.lastname,
    userInfo.type_doc,
    userInfo.num_doc,
    userInfo.telephone,
    userInfo.email,
    userInfo.password,
    userInfo.photo,
    userInfo.position,
    userInfo.id_department,
    userInfo.id_boss,
    userInfo.active ? 1 : 0,
    new Date().toISOString()
  );
};

// Obtener información del usuario de SQLite
const getUserInfoFromSQLite = async (): Promise<UserInfo | undefined> => {
  const db = await SQLite.openDatabaseAsync('dataBase.db');
  const user = await db.getFirstAsync('SELECT * FROM user ORDER BY id DESC LIMIT 1');
  return user ? user as UserInfo : undefined;
};

export default function Home() {
  const [userInfo, setUserInfo] = useState<{ name: string; lastname: string }>({ name: "", lastname: "" });

  useEffect(() => {
    const fetchUserData = async () => {
      await setupDatabase();

      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        try {
          const userResponse = await getUserInfo();
          if (userResponse?.success) {
            const user: UserInfo = {
              name: userResponse.data.name,
              lastname: userResponse.data.lastname,
              type_doc: userResponse.data.type_doc,
              num_doc: userResponse.data.num_doc,
              telephone: userResponse.data.telephone,
              email: userResponse.data.email,
              password: userResponse.data.password,
              photo: userResponse.data.photo,
              position: userResponse.data.position,
              id_department: userResponse.data.id_department,
              id_boss: userResponse.data.id_boss,
              active: userResponse.data.active,
            };
            setUserInfo({ name: user.name, lastname: user.lastname });
            await saveUserInfo(user); // Guardar en SQLite
          } else {
            console.error(userResponse?.message);
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario", error);
        }
      } else {
        console.log("Usando datos locales debido a falta de conexión");
        const localData = await getUserInfoFromSQLite();
        if (localData) {
          setUserInfo({ name: localData.name, lastname: localData.lastname });
        } else {
          console.warn("No se encontraron datos locales en SQLite.");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <View className="flex-1 w-full justify-between">
      <View className="flex-1 justify-between px-5 mt-12">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="mb-3">
            <SubTitleTextHome />
            <Text className={`${Tokens.standardTextTitleBold}`}><TitleTextHome /> {userInfo.name}</Text>
          </View>
          <View className="mb-3">
            <HomeCard />
          </View>
          <View className="mb-5">
            <SearchInput />
          </View>
          <View>
            <ShiftTextHome />
            <View className="flex-col">
              <ShiftsList />
            </View>
          </View>
        </ScrollView>
      </View>
      <BottomBar activeRoute="/home" />
    </View>
  );
}
