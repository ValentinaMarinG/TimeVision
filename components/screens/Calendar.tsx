import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "../organisms/BottomBar";
import { TitleTextCalendar } from "../atoms/TitleText";
import { Calendar, LocaleConfig } from "react-native-calendars";
import ShiftsList from "../organisms/ShiftsList";
import { useEffect, useState } from "react";
import { Shift } from "../../types/types";
import * as SQLite from "expo-sqlite";
import dayjs from "dayjs";

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();

  const todayDate = new Date().toISOString().split("T")[0];

  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);


  LocaleConfig.locales["LAA"] = {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    dayNames: [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ],
    dayNamesShort: ["Dom.", "Lun.", "Mar.", "Miérc.", "Juev.", "Vier.", "Sáb."],
    today: "Hoy",
  };

  LocaleConfig.defaultLocale = "LAA";

  const initializeDatabase = async () => {
    try {
      const db = await SQLite.openDatabaseAsync("dataBase.db");
      if (db) {
        console.log("Base de datos inicializada correctamente");
      }
      return db;
    } catch (error) {
      console.error("Error al inicializar la base de datos:", error);
      return null;
    }
  };

  useEffect(() => {
    const getShiftLocal = async () => {
      try {
        const db = await initializeDatabase();
        if (!db) return;
        const results = await db.getAllAsync<Shift>("SELECT * FROM shifts;");
        setShifts(results || []);
      } catch (error) {
        console.error("Error al obtener shifts locales:", error);
      }
    };

    getShiftLocal(); 
  }, []);

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    
    const shiftsForSelectedDate = shifts.filter(shift => {
      const shiftDate = new Date(shift.start_date).toISOString().split("T")[0];
      return shiftDate === day.dateString; 
    });
  
    setFilteredShifts(shiftsForSelectedDate);
  };

  const getShiftColor = (shift:Shift) => {
    const shiftDate = new Date(shift.start_date);
    const shiftHour = shiftDate.getHours();
    const isPast = shiftDate < new Date();

    if (isPast) {
      return "#c8cbce"; 
    } else if (shiftHour < 12) {
      return "#f4b07a"; 
    } else {
      return "#89bbf7"; 
    }
  };

  const markedDates = {
    ...(selectedDate !== todayDate
      ? {
          [selectedDate]: {
            selected: true,
            selectedColor: "#00adf5",
            dots: [
              {
                key: "selected",
                color: "#fff",
              },
            ],
          },
        }
      : {
          [todayDate]: {
            selected: true,
            selectedColor: "#00adf5",
            dots: [
              {
                key: "today",
                color: selectedDate === todayDate ? "#fff" : "#00adf5",
              },
            ],
          },
        }),
  };

  shifts.forEach((shift) => {
    const startDate = new Date(shift.start_date).toISOString().split("T")[0];

    markedDates[startDate] = {
      selected: true,
      selectedColor: selectedDate === startDate ? "#00adf5" : getShiftColor(shift),
      dots: [
        {
          key: shift._id,
          color: selectedDate === startDate ? "#fff" : getShiftColor(shift),
        },
      ],
    };
  });

  return (
    <View
      className="flex-1 w-full mt-9 justify-between"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="justify-center items-center border-b border-slate-200 mt-3">
        <TitleTextCalendar />
      </View>
      <View className="w-full flex-1 justify-start items-center">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Calendar
            className="w-[380] my-3"
            current={todayDate}
            markedDates={markedDates}
            markingType={"multi-dot"}
            onDayPress={onDayPress}
            theme={{
              selectedDayBackgroundColor: "#00adf5",
              todayTextColor: "#00adf5",
            }}
          />
          <View className="flex-col mt-5">
            <ShiftsList shifts={filteredShifts} />
          </View>
        </ScrollView>
      </View>
      <BottomBar activeRoute="/calendar" />
    </View>
  );
}
