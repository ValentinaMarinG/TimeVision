import { View, Text, ScrollView, Pressable, Platform, Alert } from "react-native";
import { TitleTextTicketsRequest } from "../atoms/TitleText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  RequestDescriptionText,
  RequestImageText,
  RequestDatesText,
  RequestTitleText,
  RequestTypeText,
} from "../atoms/DescriptionText";
import { TextInput } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useEffect, useState } from "react";
import { CustomButton } from "../atoms/CustomButton";
import { Link, useRouter } from "expo-router";

import * as Tokens from "../tokens";
import ImagesPicker from "../molecules/ImagesPicker";
import { ArrowLeftIcon } from "../atoms/Icon";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { createTicket } from "../../config/routers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

export default function TicketRequest() {
  const insets = useSafeAreaInsets();

  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [userId, setUserId] = useState<number>(0);

  const [typeError, setTypeError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [startDateError, setStartDateError] = useState<string>("");
  const [endDateError, setEndDateError] = useState<string>("");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isStartDateSelected, setIsStartDateSelected] = useState(true);

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (isStartDateSelected) {
        if (startDate) {
          setTypeError("");
        }
        setStartDate(format(currentDate, "dd/MM/yyyy"));
      } else {
        if (endDateError) {
          setTypeError("");
        }
        setEndDate(format(currentDate, "dd/MM/yyyy"));
      }
      if (Platform.OS === "android") {
        toggleDatepicker();
      }
    } else {
      toggleDatepicker();
    }
  };

  const router = useRouter();

  const handlePress = async () => {
    if (validate()) {
      const response = await createTicket(
        startDate,
        endDate,
        type,
        title,
        description,
        userId
      );
      if (response.success) {
        router.push("/tickets");
      } else {
        Alert.alert("Error", response.message); 
      }
      
    }
  };

  const data = [
    { key: "1", value: "Incapacidad médica" },
    { key: "2", value: "Enfermedad" },
    { key: "3", value: "Calamidad doméstica" },
    { key: "4", value: "Permiso laboral" },
    { key: "5", value: "Cambio de turno" },
    { key: "6", value: "Vacaciones" },
    { key: "7", value: "Licencia" },
    { key: "8", value: "Otro" },
  ];

  const validate = () => {
    let isValid = true;

    if (!type) {
      setTypeError("El tipo de solicitud es obligatorio.");
      isValid = false;
    } else {
      setTypeError("");
    }

    if (!title) {
      setTitleError("El título es obligatorio.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!description) {
      setDescriptionError("La descripción es obligatoria.");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!startDate) {
      setStartDateError("La fecha de inicio es obligatoria.");
      isValid = false;
    } else {
      setStartDateError("");
    }

    if (!endDate) {
      setEndDateError("La fecha final es obligatoria.");
      isValid = false;
    } else {
      setEndDateError("");
    }

    if (isValid) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        setStartDateError(
          "La fecha de inicio no puede ser posterior a la fecha final."
        );
        isValid = false;
      }
    }

    return isValid;
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.user_id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  return (
    <ScrollView
      className="w-full mt-4"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
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
              setSelected={(item: string) => {
                setType(item);
                if (typeError) {
                  setTypeError("");
                }
              }}
              data={data}
              save="value"
              placeholder="Seleccionar opción"
              boxStyles={{
                backgroundColor: "#E5E7EB",
                borderColor: "#edf2f7",
                borderRadius: 12,
              }}
              inputStyles={{
                fontSize: 14,
                color: "#8696BB",
              }}
              dropdownStyles={{
                backgroundColor: "#E5E7EB",
                borderColor: "#edf2f7",
              }}
              dropdownTextStyles={{
                fontSize: 14,
                color: "#8696BB",
              }}
            />
            {typeError ? (
              <Text className="text-red-500 mt-2">{typeError}</Text>
            ) : null}
          </View>
          <View className="mt-2 mb-6">
            <RequestTitleText />
            <TextInput
              className={`${Tokens.standardInput}`}
              onChangeText={(text) => {
                setTitle(text);
                if (titleError) {
                  setTitleError("");
                }
              }}
              value={title}
            />
            {titleError ? (
              <Text className="text-red-500 mt-2">{titleError}</Text>
            ) : null}
          </View>
          <View>
            <RequestDatesText />
            {showPicker && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChange}
              />
            )}
            <Pressable
              onPress={() => {
                setIsStartDateSelected(true);
                toggleDatepicker();
              }}
            >
              <TextInput
                className={`${Tokens.standardInput} mt-3`}
                value={startDate.toString()}
                editable={false}
                placeholder="dd/mm/aa"
                placeholderTextColor={"#c8cbce"}
              />
              {startDateError ? (
                <Text className="text-red-500 mt-2">{startDateError}</Text>
              ) : null}
            </Pressable>
            <Pressable
              onPress={() => {
                setIsStartDateSelected(false);
                toggleDatepicker();
              }}
            >
              <TextInput
                className={`${Tokens.standardInput} mt-6`}
                value={endDate.toString()}
                editable={false}
                placeholder="dd/mm/aa"
                placeholderTextColor={"#c8cbce"}
              />
              {endDateError ? (
                <Text className="text-red-500 mt-2 mb-5">{endDateError}</Text>
              ) : null}
            </Pressable>
          </View>
          <View className="mt-7 mb-5">
            <RequestDescriptionText />
            <TextInput
              className={`${Tokens.standardInput} h-24`}
              onChangeText={(text) => {
                setDescription(text);
                if (descriptionError) {
                  setDescriptionError("");
                }
              }}
              value={description}
            />
            {descriptionError ? (
              <Text className="text-red-500 mt-2">{descriptionError}</Text>
            ) : null}
          </View>

          {type === "Incapacidad médica" && (
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
