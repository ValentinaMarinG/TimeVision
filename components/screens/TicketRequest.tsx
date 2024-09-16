import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TitleTextTicketsRequest } from "../atoms/TitleText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  RequestDescriptionText,
  RequestTitleText,
  RequestTypeText,
} from "../atoms/DescriptionText";
import { TextInput } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useState } from "react";

import * as Tokens from "../tokens";

export default function TicketRequest() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("");

  const data = [
    { key: "1", value: "Incapacidad médica" },
    { key: "2", value: "Enfermedad" },
    { key: "3", value: "Calamidad doméstica" },
  ];

  return (
    <ScrollView className="w-full" keyboardShouldPersistTaps="handled">
      <View className=" w-full justify-center items-center border-b border-slate-200">
        <TitleTextTicketsRequest />
      </View>
      <View className="w-3/4 m-5">
        <RequestTypeText />
        <SelectList
          search={false}
          setSelected={(item) => setSelected(item)}
          data={data}
          save="value"
        />
        <RequestTitleText />
        <TextInput className={`${Tokens.standardInput}`} />
        <RequestDescriptionText />
        <TextInput className={`${Tokens.standardInput}`} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    width: "100%",
  },
  form: {
    width: "100%",
    margin: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 46,
    width: 300,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    marginBottom: 35,
    padding: 10,
    /* fontFamily:'poppins-regular' */
  },
  buttonContainer: {
    margin: 15,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
