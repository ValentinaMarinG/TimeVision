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
} from "../atoms/DescriptionText";
import { TextInput } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useEffect, useState } from "react";
import { CustomButton } from "../atoms/CustomButton";
import { useRouter } from "expo-router";
import * as Tokens from "../tokens";
import ImagesPicker from "../molecules/ImagesPicker";
import { ArrowLeftIcon } from "../atoms/Icon";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { createRequest } from "../../config/routers";
import * as SQLite from 'expo-sqlite'
import tickets from "../../app/tickets";

interface TicketData {
  data: {
    type: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    imageUri?: string;
    

  };
}


export default function TicketRequest() {
  const [tiketData, setTiketData] = useState<TicketData | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({resolver: zodResolver(RequestSchema)});

  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [typeError, setTypeError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [startDateError, setStartDateError] = useState<string>("");
  const [endDateError, setEndDateError] = useState<string>("");

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isStartDateSelected, setIsStartDateSelected] = useState(true);

  const handleNavigation = (routeName: string) => {
    router.push(routeName);
  };

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = selectedDate;
      setDate(currentDate);
      if (isStartDateSelected) {
        if (startDate) {
          setStartDateError("");
        }
        setStartDate(currentDate);
      } else {
        if (endDateError) {
          setEndDateError("");
        }
        setEndDate(currentDate);
      }
      if (Platform.OS === "android") {
        toggleDatepicker();
      }
    } else {
      toggleDatepicker();
    }
  };
  useEffect(() => {
    
    const executeDatabaseOperations = async () => {

      try {
        const db = await SQLite.openDatabaseAsync('dataBase.db');
        await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tikets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT,
          title TEXT,
          description TEXT,
          startDate TEXT,
          endDate TEXT
        );
        `);
        if (tiketData && tiketData.data && tiketData.data.type && tiketData.data.title && tiketData.data.description && tiketData.data.startDate && tiketData.data.endDate ) {
          await db.execAsync(`
            INSERT INTO tikets (type, title, description, startDate, endDate)
            VALUES 
            ('${tiketData.data.type}', '${tiketData.data.title}', '${tiketData.data.description}', '${tiketData.data.startDate}', '${tiketData.data.endDate}');
          `);
          console.log("Tiket creado con ", tiketData.data);
        } else { 
        }
        await db.withTransactionAsync(async () => {
          const tikets = await db.getFirstAsync('SELECT * FROM tikets');
          console.log('TIKETS', tikets);
        });

        await db.withTransactionAsync(async () => {
          const tikets = await db.getFirstAsync('SELECT * FROM tikets');
          console.log('tikets', tikets);
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error ejecutando operaciones de base de datos: ", error);
      }
    };

    executeDatabaseOperations();

  }, []);

  const handlePress = async () => {
    const db = await SQLite.openDatabaseAsync('dataBase.db');
    const newTicketData = {
      data: {
        type,
        title,
        description,
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : ""
      },
    };
    
    setTiketData(newTicketData);

    try {
      if (validations()) {
        if (
          newTicketData.data.type &&
          newTicketData.data.title &&
          newTicketData.data.description &&
          newTicketData.data.startDate &&
          newTicketData.data.endDate
        ) {
          await db.execAsync(`
            INSERT INTO tikets (type, title, description, startDate, endDate)
            VALUES 
            ('${newTicketData.data.type}', '${newTicketData.data.title}', '${newTicketData.data.description}', '${newTicketData.data.startDate}', '${newTicketData.data.endDate}');
          `);
          console.log("Tiket creado con ", newTicketData.data);
  
          router.push("/tickets");
        } else {
          Alert.alert("Error", "Faltan datos en la solicitud del ticket.");
        }
      }
    } catch (error) {
      console.error("Error al crear el ticket: ", error);
      Alert.alert("Error", "Hubo un problema al guardar la solicitud");
    }
  });


  const data = [
    { key: "1", value: "Incapacidad médica" },
    { key: "2", value: "Enfermedad" },
    { key: "3", value: "Cambio de turno" },
    { key: "4", value: "Vacaciones" },
    { key: "5", value: "Licencia" },
    { key: "6", value: "Otro" },
  ];

  const validations = () => {
    let isValid = true;
    const currentDate = new Date();
    const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|EXEC|UNION|;|--)\b)/i;

    if (!type) {
      setTypeError("El tipo de solicitud es obligatorio.");
      isValid = false;
    } else {
      setTypeError("");
    }

    if (!title) {
      setTitleError("El título es obligatorio.");
      isValid = false;
    } else if (sqlInjectionPattern.test(title)) {
      setTitleError("El título contiene caracteres no permitidos.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!description) {
      setDescriptionError("La descripción es obligatoria.");
      isValid = false;
    } else if (sqlInjectionPattern.test(description)) {
      setDescriptionError("La descripción contiene caracteres no permitidos.");
      isValid = false;
    } else {
      setDescriptionError("");
    }

    if (!startDate) {
      setStartDateError("La fecha de inicio es obligatoria.");
      isValid = false;
    }

    if (!endDate) {
      setEndDateError("La fecha final es obligatoria.");
      isValid = false;
    }

    if (startDate && endDate) {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();

      if (startYear < currentDate.getFullYear()) {
        setStartDateError("La fecha de inicio no puede ser de un año pasado.");
        isValid = false;
      }
      if (endYear < currentDate.getFullYear()) {
        setEndDateError("La fecha final no puede ser de un año pasado.");
        isValid = false;
      }
      if (startDate > endDate) {
        setStartDateError(
          "La fecha de inicio no puede ser posterior a la fecha de fin."
        );
        isValid = false;
      }
    }

    return isValid;
  };
  const [isLoading,setIsLoading] = useState(true)
 

  if (isLoading) {
    return (
      <View>
        <Text>Cargando</Text>
      </View>
    )
  }

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
                    setSelected={(item: string) => onChange(item)}
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
                <Text className="text-red-500 mt-2">{errors.type.message}</Text>
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
                <Text className="text-red-500 mt-2">
                  {errors.title.message}
                </Text>
              )}
            </View>

            <View className="flex-1 m-1">
              <RequestDatesText />
              {showPicker && (
                <DateTimePicker
                  mode="date"
                  display="calendar"
                  positiveButton={{ label: "ACEPTAR" }}
                  negativeButton={{ label: "CANCELAR" }}
                  value={date}
                  onChange={onChange}
                /* minimumDate={new Date("2024-01-01")} */
                />
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
                <Text className="text-red-500 mt-2">
                  {errors.description.message}
                </Text>
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
