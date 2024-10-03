import { View, ScrollView, TextInput } from "react-native";
import * as Tokens from "../tokens";
import { useState } from "react";
import { ArrowLeftIcon, Search } from "../atoms/Icon";
import { Link } from "expo-router";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");

  return (
    <View className="flex-1 w-full justify-between">
      <View className="flex-1 justify-between px-5 mt-12">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row justify-center">
          <View className="mt-6">
            <Link href={"/home"} className="mr-4">
              <ArrowLeftIcon size={Tokens.standardSizeIcon} color={"#595A69"} />
            </Link>
          </View>
          <View className={`${Tokens.homeInput} flex-auto`}>
            <View className={`${Tokens.homeInputSearch} flex-row items-center`}>
              <Search
                size={Tokens.iconSizeSearchHome}
                color={Tokens.iconColorSearchHome}
              />
              <TextInput
                className={`${Tokens.searchInputHome} w-full`}
                placeholder="INGRESA DIA-MES"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
