import { View, Text } from "react-native";
import { ArrowIcon } from "../atoms/Icon";
import * as Tokens from "../tokens";
import  { ProfilePhotoHome } from "../atoms/ProfilePhoto";
import {CompanyHomeCard, NameHomeCard, ProfileHomeCard} from "../atoms/DescriptionText";
import { Link} from "expo-router";
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../config/routers';

export default function HomeCard() {

  const [account, SetAccount] = useState({
    name: "",
    lastname:""
  });

  useEffect(() => {
    SetAccount({
      name: "",
      lastname:""
    });
    const fetchUser = async () => {
      const response = await getUserInfo();
      if (response?.success) {
        SetAccount({
          name: response?.data.name,
          lastname: response?.data.lastname
        });
      } else {
        console.error(response?.message);
      }
    };
    fetchUser();
  }, []);

  return (
    <View className="bg-cardColor w-full rounded-2xl p-5 ">
        <View className="flex-row items-center">
        <ProfilePhotoHome/>
            <View className="flex-1 justify-between ml-5">
            <Text className="text-lg text-cardColorText text-left">{account.name} {account.lastname}</Text>
            <ProfileHomeCard/>
            </View>
        <Link href={"/profile"}>
        <ArrowIcon size={Tokens.logoSizeIconCard} color={Tokens.logoColorCard}/>
        </Link>
        </View>
        <View className=" mt-5 border-t-[0.5px] border-white">
            <CompanyHomeCard/>
        </View>
    </View>
  )
}
