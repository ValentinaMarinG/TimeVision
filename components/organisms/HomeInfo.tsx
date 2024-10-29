import { View, Text } from "react-native";
import { ArrowIcon } from "../atoms/Icon";
import * as Tokens from "../tokens";
import { useEffect, useState } from "react";
import { ProfilePhotoHome } from "../atoms/ProfilePhoto";
import { CompanyHomeCard, NameHomeCard, ProfileHomeCard } from "../atoms/DescriptionText";
import { Link } from "expo-router";
import * as SQLite from 'expo-sqlite';

interface UserInfo {
  name: string;
  lastname: string;
}

const getUserInfoFromSQLite = async (): Promise<{ name: string; lastname: string } | undefined> => {
  const db = await SQLite.openDatabaseAsync('dataBase.db');
  const user = await db.getFirstAsync('SELECT * FROM user ORDER BY id DESC LIMIT 1');
  return user ? user as UserInfo : undefined;
};

export default function HomeCard() {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", lastname: "" }); // Define el tipo aquí

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const localData = await getUserInfoFromSQLite();
        if (localData) {
          setUserInfo(localData);
        } else {
          console.warn("No se encontraron datos locales en SQLite.");
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario", error);
      }
    };
    fetchUserData();
  }, []);
  
  return (
    <View className="bg-cardColor w-full rounded-2xl p-5 ">
      <View className="flex-row items-center">
        <ProfilePhotoHome />
        <View className="flex-1 justify-between ml-5">
          <Text className="text-xl font-bold text-CText">{userInfo.name} {userInfo.lastname}</Text>
          <ProfileHomeCard />
        </View>
        <Link href={"/profile"}>
          <ArrowIcon size={Tokens.logoSizeIconCard} color={Tokens.logoColorCard} />
        </Link>
      </View>
      <View className="mt-5 border-t-[0.5px] border-white">
        <CompanyHomeCard />
      </View>
    </View>
  );
}

