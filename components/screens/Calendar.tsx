import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomBar from "../organisms/BottomBar";
import { TitleTextCalendar } from "../atoms/TitleText";
import { Calendar, LocaleConfig } from "react-native-calendars";
import ShiftsList from "../organisms/ShiftsList";
import { useEffect, useState, useMemo } from "react";
import { Shift } from "../../types/types";
import dayjs from "dayjs";
import { useShiftsStore } from "../../store/Store";

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();

  const todayDate = new Date().toISOString().split("T")[0];
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
  const { shifts, fetchShifts, loading } = useShiftsStore();

  useEffect(() => {
    fetchShifts();
  }, []);

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

  useEffect(() => {
    const shiftsForSelectedDate = shifts.filter((shift) => {
      const shiftDate = dayjs(shift.start_date).format("YYYY-MM-DD");
      return shiftDate === selectedDate;
    });
    setFilteredShifts(shiftsForSelectedDate);
  }, [selectedDate, shifts]);

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);

    const shiftsForSelectedDate = shifts.filter(shift => {
      const shiftDate = new Date(shift.start_date).toISOString().split("T")[0];
      return shiftDate === day.dateString;
    });

    setFilteredShifts(shiftsForSelectedDate);
  };

  const getShiftColor = (shift: Shift) => {
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

  const markedDates = useMemo(() => {
    const dates: { [key: string]: any } = {};

    if (selectedDate) {
      dates[selectedDate] = {
        selected: true,
        selectedColor: "#00adf5",
        dots: [
          {
            key: "selected",
            color: "#fff",
          },
        ],
      };
    }

    shifts.forEach((shift) => {
      const startDate = new Date(shift.start_date).toISOString().split("T")[0];

      
      if (!dates[startDate]) {
        dates[startDate] = { dots: [] };
      }

      dates[startDate].dots.push({
        key: shift._id,
        color: getShiftColor(shift),
      });

      if (startDate === selectedDate) {
        dates[startDate].selected = true;
        dates[startDate].selectedColor = "#00adf5";
      }
    });

    return dates;
  }, [shifts, selectedDate]);

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
