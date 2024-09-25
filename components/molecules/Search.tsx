import { TextInput, View } from "react-native"
import { Text } from "react-native"
import * as Tokens from "../tokens"
import { InputTextHome } from "../atoms/DescriptionText"
import { Search } from "../atoms/Icon"
import { Link } from "expo-router"

export default function SearchField() {
  return (

    <View className={`${Tokens.homeInput}`}>
      <Link href={"/search"} className="w-full">
        <View className={`${Tokens.homeInput}`}>
          <Search size={Tokens.iconSizeSearchHome} color={Tokens.iconColorSearchHome} />
          <InputTextHome />
        </View>
      </Link>
    </View>


  )
}
