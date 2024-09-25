import { View } from "react-native";
import { ArrowIcon } from "../atoms/Icon";
import * as Tokens from "../tokens";
import  { ProfilePhotoHome } from "../atoms/ProfilePhoto";
import {CompanyHomeCard, NameHomeCard, ProfileHomeCard} from "../atoms/DescriptionText";
import { Link} from "expo-router";
export default function HomeCard() {
  return (
    <View className="bg-cardColor w-full rounded-2xl p-5 ">
        <View className="flex-row items-center">
        <ProfilePhotoHome/>
            <View className="flex-1 justify-between ml-5">
            <NameHomeCard/>
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
