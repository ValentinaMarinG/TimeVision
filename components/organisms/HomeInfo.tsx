import { View, Text } from "react-native";
import { ArrowIcon } from "../atoms/Icon";
import * as Tokens from "../tokens";
import {
  ProfilePhotoHome,
  ProfilePhotoOffline,
  ProfilePhotoOfflineHome,
  ProfilePhotoScreen,
} from "../atoms/ProfilePhoto";
import { CompanyHomeCard, ProfileHomeCard } from "../atoms/DescriptionText";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

interface HomeCardProps {
  name: string;
  lastname: string;
  photo: string;
}

export default function HomeCard({ name, lastname, photo }: HomeCardProps) {
  const [isOnline, setIsOnline] = useState<Boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View className="bg-cardColor w-full rounded-2xl p-5">
      <Link href={"/profile"}>
        <View className="flex-row items-center">
          {isOnline ? (
            <ProfilePhotoHome source={photo ? { uri: photo } : undefined} name={name}/>
          ) : (
            <ProfilePhotoOfflineHome
              source={require("../../assets/userProfileOffline.png")}
            />
          )}
          <View className="flex-1 justify-between ml-5">
            <Text className="text-xl text-white">
              {name} {lastname}
            </Text>
            <ProfileHomeCard />
          </View>
          <ArrowIcon
            size={Tokens.logoSizeIconCard}
            color={Tokens.logoColorCard}
          />
        </View>
        
      </Link>
      <View className="mt-5 border-t-[0.5px] border-white">
      <Link href={"/profile"} className="mt-4">
          <CompanyHomeCard />
          </Link>
        </View>
    </View>
  );
}
