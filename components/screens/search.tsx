import React, { useState } from "react";
import { View, ScrollView, TextInput, TouchableOpacity, Text } from "react-native";
import * as Tokens from "../tokens";
import { ArrowLeftIcon, Search } from "../atoms/Icon";
import { Link } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleConfirm = (date: Date) => {
    // Formateamos la fecha seleccionada en el formato deseado: "DIA-MES"
    const formattedDate = moment(date).format("DD-MM");
    setSearchText(formattedDate);
    setDatePickerVisibility(false);
  };

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
                {/* Hacemos que el campo TextInput sea clickable y abra el DateTimePicker */}
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={{ flex: 1 }}>
                  <TextInput
                    className={`${Tokens.searchInputHome} w-full`}
                    placeholder="Selecciona Fecha"
                    value={searchText}
                    editable={false}  
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisibility(false)}
          locale="es_ES"
          confirmTextIOS="Confirmar"
          cancelTextIOS="Cancelar"
        />
      </View>
    </View>
  );
}
