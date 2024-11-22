import { TextInput, View } from "react-native";
import { Text } from "react-native";
import * as Tokens from "../tokens";
import { InputTextHome } from "../atoms/DescriptionText";
import { Search } from "../atoms/Icon";
import { Link } from "expo-router";

export const SearchField = () => {
  return (
    <View className={`${Tokens.homeInput}`}>
      <View className={`${Tokens.homeInput}`}>
        <Link href={"/search"}>
          <Search
            size={Tokens.iconSizeSearchHome}
            color={Tokens.iconColorSearchHome}
          />
          <View className="ml-10 w-full">
            <InputTextHome />
          </View>
        </Link>
      </View>
    </View>
  );
};
