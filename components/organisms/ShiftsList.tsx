import { View, Text } from "react-native";
import { ShiftInText, ShiftOutText } from "../atoms/DescriptionText";
import { CalendarIcon, Time } from "../atoms/Icon";
import { useEffect, useState } from "react";
import * as Tokens from "../tokens";
import { getAssigments } from "../../config/routers";
import { Shift } from "../../types/games";

export default function ShiftsList() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await getAssigments();
      if (response?.success) {
        setShifts(response.data ?? []);
        setLoading(false);
      } else {
        console.error(response?.message);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <Text className="text-base text-grayText mt-2">Cargando turnos...</Text>;
  }

  return (
    <View>
      {shifts.length === 0 ? (
        <View className="justify-center items-center p-5 border-t border-slate-200 mt-2 text-base text-grayText">
          <Text>No cuenta con turnos asignados</Text>
        </View>
      ) : (
        shifts.map((shift) => {
          return (
            <View
              key={shift._id}
              className="bg-backGroundShiftList w-full rounded-2xl p-5 mb-3 shadow-lg mt-2"
            >
              <View className="flex-row items-center">
                <CalendarIcon
                  size={Tokens.iconSizeSearchHome}
                  color={Tokens.iconColorSearchHome}
                />
                <View className="flex-1 justify-between ml-5">
                  <Text className="text-lg font-bold">
                    {(() => {
                      const dayOfWeek = new Date(
                        shift.start_date
                      ).toLocaleDateString("es-ES", {
                        weekday: "long",
                      });
                      return (
                        dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)
                      );
                    })()}
                  </Text>
                  <Text className="text-gray-500">
                    {new Date(shift.start_date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>

              <View className="mt-5 border-t-[0.5px] border-gray-300 flex-row">
                <View className="mt-2 flex-grow flex-row justify-center">
                  <ShiftInText />
                  <View className="justify-center">
                    <Time size={Tokens.iconSizeTimeHome} color={"#FEB052"} />
                  </View>
                  <Text className={`${Tokens.standardShiftInHome}`}>
                    {new Date(shift.start_date).toLocaleTimeString("es-ES", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "UTC",
                    })}
                  </Text>
                </View>
                <View className="mt-2 flex-grow flex-row justify-center content-center">
                  <ShiftOutText />
                  <View className="justify-center">
                    <Time size={Tokens.iconSizeTimeHome} color={"#4894FE"} />
                  </View>
                  <Text className={`${Tokens.standardShiftOutHome}`}>
                    {new Date(shift.time_end).toLocaleTimeString("es-ES", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "UTC",
                    })}
                  </Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
