import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TitleTextTicketsRequest } from "../atoms/TitleText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  RequestDescriptionText,
  RequestImageText,
  RequestOtherTypeText,
  RequestTitleText,
  RequestTypeText,
} from "../atoms/DescriptionText";
import { TextInput } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useState } from "react";
import { CustomButton } from "../atoms/CustomButton";
import { Link, useRouter } from "expo-router";

import * as Tokens from "../tokens";
import ImagesPicker from "../molecules/ImagesPicker";
import { ArrowLeftIcon } from "../atoms/Icon";

export default function TicketRequest() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("");

  const router = useRouter();

  const handlePress = () => {
    router.push("/tickets");
  };

  const data = [
    { key: "1", value: "Incapacidad médica" },
    { key: "2", value: "Enfermedad" },
    { key: "3", value: "Calamidad doméstica" },
    { key: "4", value: "Permiso laboral" },
    { key: "5", value: "Cambio de turno" },
    { key: "6", value: "Vacaciones" },
    { key: "3", value: "Licencia" },
    { key: "4", value: "Otro" },
  ];

  return (
    <ScrollView className="w-full mt-4" keyboardShouldPersistTaps="handled">
      <View className="w-full justify-center items-center self-center">
        <View className="w-full flex flex-row border-b border-slate-200 mt-5">
          <View className="flex-[0.3]">
            <Link href={"/tickets"} className="ml-2">
              <ArrowLeftIcon size={Tokens.standardSizeIcon} color={"#595A69"} />
            </Link>
          </View>

          <View className="ml-20 text-center items-center justify-center">
            <TitleTextTicketsRequest />
          </View>
        </View>
        <View className="w-5/6 my-5 justify-center">
          <View className="my-5">
            <RequestTypeText />
            <SelectList
              search={false}
              setSelected={(item: string) => setSelected(item)}
              data={data}
              save="value"
              placeholder="Seleccionar opción"
              boxStyles={{
                backgroundColor: "#E5E7EB",
                borderColor: "#edf2f7",
                borderRadius: 12
              }}
              inputStyles={{
                fontSize: 14,
                color: '#8696BB'
              }}
              dropdownStyles={{
                backgroundColor: "#E5E7EB",
                borderColor: "#edf2f7"
              }}
              dropdownTextStyles={{
                fontSize: 14,
                color: '#8696BB'
              }}
            />
          </View>
          <View className="mt-2">
            <RequestTitleText />
            <TextInput className={`${Tokens.standardInput}`} />
          </View>
          <View className="mb-2">
            <RequestDescriptionText />
            <TextInput className={`${Tokens.standardInput} h-24`} />
          </View>
          {selected === "Incapacidad médica" && (
            <View className="w-full">
              <ImagesPicker />
            </View>
          )}
          <View className="w-full mt-5 items-center">
            <CustomButton text="Crear solicitud" customFun={handlePress} />
          </View>
        </View>
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
