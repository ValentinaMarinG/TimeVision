import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { TitleTextTicketsRequest } from "../atoms/TitleText";
import {
  RequestDescriptionText,
  RequestDatesText,
  RequestTitleText,
  RequestTypeText,
  StartDateText,
  EndDateText,
  DateText,
} from "../atoms/DescriptionText";
import { TextInput } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useEffect, useState } from "react";
import { CustomButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import * as Tokens from "../tokens";
import ImagesPicker from "../molecules/ImagesPicker";
import { AlertIcon, ArrowLeftIcon } from "../atoms/Icon";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { createRequest, getTickets } from "../../config/routers";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestSchema } from "../../schemas/requestSchema";

type FormData = {
  title: string;
  type: string;
  description: string;
  start_date: Date;
  end_date: Date;
  imageUri: string;
};

export default function TicketRequest() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(RequestSchema) });

  const [type, setType] = useState<string>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [isStartDateSelected, setIsStartDateSelected] = useState(true);
  const [isConnectedToInternet, setIsConnectedToInternet] = useState<Boolean | null>(true);

  const handleNavigation = (routeName: string) => {
    router.push(routeName);
  };

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (isConnectedToInternet) {
      try {
        const response = await createRequest(
          data.start_date,
          data.end_date,
          data.type,
          data.title,
          data.description,
          imageUri
        );
        if (response.success) {
          Alert.alert("Solicitud creada exitosamente en el servidor");
          router.push("/tickets");
        }
      } catch (error) {
        console.log("Error al enviar la solicitud:", error);
      }
    }
  });

  const data = [
    { key: "1", value: "Incapacidad médica" },
    { key: "2", value: "Enfermedad" },
    /* { key: "3", value: "Cambio de turno" }, */
    { key: "4", value: "Vacaciones" },
    { key: "5", value: "Licencia" },
    { key: "6", value: "Otro" },
  ];

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="w-full flex flex-row border-b border-slate-200 mt-12 items-center mb-3">
        <View className="flex-1">
          <TouchableOpacity
            onPress={() => handleNavigation("tickets")}
            className="mb-3.5 ml-2"
          >
            <ArrowLeftIcon size={Tokens.standardSizeIcon} color={"#595A69"} />
          </TouchableOpacity>
        </View>
        <View className="absolute left-0 right-0 items-center">
          <TitleTextTicketsRequest />
        </View>
      </View>
      <ScrollView
        className="w-full"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full h-full items-center">
          <View className="w-5/6 h-full flex flex-col">
            <View className="flex-1 m-1">
              <RequestTypeText />
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectList
                    search={false}
                    setSelected={(item: string) => {
                      onChange(item);
                      setType(item);
                    }}
                    data={data}
                    save="value"
                    placeholder="Seleccionar opción"
                    maxHeight={100}
                    boxStyles={{
                      backgroundColor: "#E5E7EB",
                      borderColor: "transparent",
                    }}
                    inputStyles={{
                      fontSize: 12,
                      color: type ? "#000000" : "#8696BB",
                    }}
                    dropdownStyles={{
                      backgroundColor: "#E5E7EB",
                      borderColor: "transparent",
                    }}
                    dropdownTextStyles={{
                      fontSize: 12,
                      color: "#8696BB",
                    }}
                    dropdownShown={type !== ""}
                  />
                )}
                name="type"
              />
              {errors.type && (
                <View className="flex-row w-[85%] items-center mt-1 ml-1">
                  <AlertIcon size={20} color={"#F44336"} />
                  <Text className="text-red-500"> {errors.type.message}</Text>
                </View>
              )}
            </View>

            <View className="flex-1 m-1">
              <RequestTitleText />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`${Tokens.standardInput}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="title"
              />
              {errors.title && (
                <View className="flex-row w-[85%] items-center mt-1 ml-1">
                  <AlertIcon size={20} color={"#F44336"} />
                  <Text className="text-red-500"> {errors.title.message}</Text>
                </View>
              )}
            </View>

            <View className="flex-1 m-1">
              {type !== "Cambio de turno" ? (
                <>
                <RequestDatesText /> 
                <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    {showPicker && isStartDateSelected && (
                      <DateTimePicker
                        mode="date"
                        display={Platform.OS === "ios" ? "inline" : "calendar"}
                        value={value || new Date()}
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || value;
                          setShowPicker(false);
                          onChange(currentDate);
                        }}
                      />
                    )}
                    <Text className="m-1">
                      <StartDateText />
                    </Text>
                    <Pressable
                      onPress={() => {
                        setIsStartDateSelected(true);
                        toggleDatepicker();
                      }}
                    >
                      <TextInput
                        className={`${Tokens.standardInput}`}
                        value={value ? format(value, "dd/MM/yyyy") : ""}
                        editable={false}
                        placeholder="DD-MM-AAAA"
                        placeholderTextColor={"#8696BB"}
                      />
                    </Pressable>
                  </>
                )}
                name="start_date"
              />
              {errors.start_date && (
                <View className="flex-row w-[85%] items-center mt-1 ml-1">
                  <AlertIcon size={20} color={"#F44336"} />
                  <Text className="text-red-500">
                    {" "}
                    {errors.start_date.message}
                  </Text>
                </View>
              )}
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <>
                        {showPicker && !isStartDateSelected && (
                          <DateTimePicker
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "calendar"}
                            value={value || new Date()}
                            onChange={(event, selectedDate) => {
                              const currentDate = selectedDate || value;
                              setShowPicker(false);
                              onChange(currentDate);
                            }}
                          />
                        )}
                        <Text className="m-1 mt-3">
                          <EndDateText />
                        </Text>
                        <Pressable
                          onPress={() => {
                            setIsStartDateSelected(false);
                            toggleDatepicker();
                          }}
                        >
                          <TextInput
                            className={`${Tokens.standardInput}`}
                            value={value ? format(value, "dd/MM/yyyy") : ""}
                            editable={false}
                            placeholder="DD-MM-AAAA"
                            placeholderTextColor={"#8696BB"}
                          />
                        </Pressable>
                      </>
                    )}
                    name="end_date"
                  />
                  {errors.end_date && (
                    <View className="flex-row w-[85%] items-center mt-1 ml-1">
                      <AlertIcon size={20} color={"#F44336"} />
                      <Text className="text-red-500">
                        {" "}
                        {errors.end_date.message}
                      </Text>
                    </View>
                  )}
                </>
              ):(
                <>
                <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    {showPicker && isStartDateSelected && (
                      <DateTimePicker
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "calendar"}
                        value={value || new Date()}
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || value;
                          setShowPicker(false);
                          onChange(currentDate);
                        }}
                      />
                    )}
                    <Text className="m-1">
                      <DateText />
                    </Text>
                    <Pressable
                      onPress={() => {
                        setIsStartDateSelected(true);
                        toggleDatepicker();
                      }}
                    >
                      <TextInput
                        className={`${Tokens.standardInput}`}
                        value={value ? format(value, "dd/MM/yyyy") : ""}
                        editable={false}
                        placeholder="DD-MM-AAAA"
                        placeholderTextColor={"#8696BB"}
                      />
                    </Pressable>
                  </>
                )}
                name="start_date"
              />
              {errors.start_date && (
                <View className="flex-row w-[85%] items-center mt-1 ml-1">
                  <AlertIcon size={20} color={"#F44336"} />
                  <Text className="text-red-500">
                    {" "}
                    {errors.start_date.message}
                  </Text>
                </View>
              )}
                </>
              )}
            </View>

            <View className="flex-1 m-1">
              <RequestDescriptionText />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`${Tokens.standardInput} h-24`}
                    multiline={true}
                    maxLength={500}
                    numberOfLines={13}
                    textAlignVertical="top"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="description"
              />
              {errors.description && (
                <View className="flex-row w-[85%] items-center mt-1 ml-1">
                  <AlertIcon size={20} color={"#F44336"} />
                  <Text className="text-red-500">
                    {" "}
                    {errors.description.message}
                  </Text>
                </View>
              )}
            </View>

            {type === "Incapacidad médica" && (
              <View className="flex-1 m-1">
                <ImagesPicker onImageSelected={setImageUri} />
              </View>
            )}

            <View className="w-full my-5 items-center">
              <CustomButton text="Crear solicitud" customFun={onSubmit} />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
