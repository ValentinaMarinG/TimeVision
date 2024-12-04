import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";
import * as Tokens from "../tokens";
import { ArrowLeftIcon, Search } from "../atoms/Icon";
import { Link, router } from "expo-router";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";  
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";  
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Shift } from "../../types/types";
import ShiftsList from "../organisms/ShiftsList";
import { getAssigments } from "../../config/routers";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [isCalendarVisible, setCalendarVisibility] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState({});
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = useState<Shift[]>([]);
  const [isSelectingDates, setIsSelectingDates] = useState(true);

  useEffect(() => {
    const loadShifts = async () => {
      try {
        const response = await getAssigments();
      
        if (response && response.data && Array.isArray(response.data)) {
          await AsyncStorage.setItem("shifts", JSON.stringify(response.data));
          setShifts(response.data);
        } else {
          setShifts([]);
        }
      } catch (error) {
        console.error("Error al cargar turnos:", error);
        setShifts([]);
      }
    };

    loadShifts();
  }, []);

  const onDayPress = (day: { dateString: string }) => {
    if (!startDate || (startDate && endDate)) {
      setIsSelectingDates(true);
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates({
        [day.dateString]: { startingDay: true, color: "#00d4ff", textColor: "#fff" },
      });
      setFilteredShifts([]);
    } else {
      let start = startDate;
      let end = day.dateString;
      
      if (dayjs(start).isAfter(dayjs(end))) {
        [start, end] = [end, start];
      }
      
      const range = getDateRange(start, end);
      setEndDate(end);
      setMarkedDates(range);
      
      const formattedRange = `${dayjs(start).format("DD-MM")} a ${dayjs(end).format("DD-MM")}`;
      setSearchText(formattedRange);
      
      // filterShiftsByDateRange(start, end);
    }
  };

  const getDateRange = (start: string, end: string) => {
    let range: Record<string, { color: string; textColor: string; startingDay?: boolean; endingDay?: boolean }> = {};
    let current = dayjs(start);
    let endDate = dayjs(end);

    if (current.isAfter(endDate)) {
      [current, endDate] = [endDate, current];
    }

    while (current.isBefore(endDate) || current.isSame(endDate)) {
      const dateString = current.format("YYYY-MM-DD");
      range[dateString] = {
        color: "#00d4ff",
        textColor: "#fff",
        startingDay: dateString === start,
        endingDay: dateString === end,
      };
      current = current.add(1, "day");
    }
    return range;
  };

  const filterShiftsByDateRange = (start: string, end: string) => {
    if (!Array.isArray(shifts)) {
      setFilteredShifts([]);
      return;
    }

    const startDate = dayjs(start).startOf('day');
    const endDate = dayjs(end).endOf('day');

    const filtered = shifts.filter((shift) => {
      const shiftDate = dayjs(shift.start_date);
      return shiftDate.isSameOrAfter(startDate) && shiftDate.isSameOrBefore(endDate);
    });
    setFilteredShifts(filtered);
  };

  function backTouch() {
    setSearchText("");
    setStartDate(null);
    setEndDate(null);
    setMarkedDates({});
    setFilteredShifts([]);
    router.push("/home");
  }

  useEffect(() => {
  }, [filteredShifts]);

  const handleCloseCalendar = () => {
    if (startDate && endDate) {
      filterShiftsByDateRange(startDate, endDate);
    }
    setIsSelectingDates(false);
    setCalendarVisibility(false);
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
              <TouchableOpacity onPress={backTouch} className="mr-4">
                <ArrowLeftIcon
                  size={Tokens.standardSizeIcon}
                  color={"#595A69"}
                />
              </TouchableOpacity>
            </View>
            <View className={`${Tokens.homeInput} flex-auto`}>
              <View className={`${Tokens.homeInputSearch} flex-row items-center`}>
                <Search
                  size={Tokens.iconSizeSearchHome}
                  color={Tokens.iconColorSearchHome}
                />
                <TouchableOpacity
                  onPress={() => setCalendarVisibility(true)}
                  style={{ flex: 1 }}
                >
                  <TextInput
                    className={`${Tokens.searchInputHome} w-full`}
                    placeholder="Buscar"
                    value={searchText}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="mt-5">
            {filteredShifts.length > 0 ? (
              <>
                <ShiftsList shifts={filteredShifts} />
              </>
            ) : (
              <Text className={`${Tokens.standardSubtitleLogin} mt-5 border-t-2 pt-2 border-gray-200`}>
                {startDate && endDate 
                  ? "No tienes turnos asignados en las fechas seleccionadas"
                  : "Selecciona un rango de fechas para ver tus turnos"}
              </Text>
            )}
          </View>

        </ScrollView>

        <Modal
          visible={isCalendarVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {}}
          statusBarTranslucent={true}
          hardwareAccelerated={true}
          onDismiss={() => {}}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            className="flex-1 justify-center items-center bg-[#858585] opacity-90"
          >
            <View className="bg-white p-5 rounded-lg w-11/12">
              <Text className="text-lg font-bold text-center text-gray-800 mb-5">
                Selecciona un rango de fechas
              </Text>
              <Calendar
                onDayPress={onDayPress}
                markedDates={markedDates}
                markingType="period"
                className="rounded-2xl"
                theme={{
                  selectedDayBackgroundColor: "#00d4ff",
                  todayTextColor: "#00d4ff",
                  arrowColor: "#00d4ff",
                  monthTextColor: "#00d4ff",
                  textDayFontWeight: "300",
                  textMonthFontWeight: "bold",
                  textDayHeaderFontWeight: "500",
                }}
              />
              <TouchableOpacity
                onPress={handleCloseCalendar}
                className="mt-5 bg-blue-500 py-2 rounded-md items-center"
              >
                <Text className="text-white font-bold text-lg">
                  {startDate && endDate ? "Buscar turnos" : "Cerrar"}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
}
