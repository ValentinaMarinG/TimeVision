import { View, Text } from "react-native";
import { ShiftDate, ShiftInHour, ShiftInText, ShiftOutHour, ShiftOutText } from "../atoms/DescriptionText";
import { CalendarIcon, Time } from "../atoms/Icon";
import { useEffect, useState } from "react";
import * as Tokens from "../tokens";
import { ShiftDay } from "../atoms/SubtitleText";
import { getShifts } from "../../config/routers";
import moment from "moment";

// Definir la interfaz para los turnos
interface Shift {
    date: string;
    startTime: string;
    endTime: string;
}

export default function ShiftsList() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [loading, setLoading] = useState(true);

    // Función para obtener los días de la semana
    const getWeekDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = moment().startOf('week').add(i, 'days');
            days.push(day);
        }
        return days;
    };

    useEffect(() => {
        const fetchShifts = async () => {
            const response = await getShifts();
            if (response.success) {
                setShifts(response.data);
            }
            setLoading(false);
        };
        fetchShifts();
    }, []);

    if (loading) {
        return <Text>Cargando turnos...</Text>;
    }

    const weekDays = getWeekDays();

    return (
        <View>
            {shifts.length === 0 ? (
                <View className="justify-center items-center p-5">
                    <Text>No se encontraron turnos asignados.</Text>
                </View>
            ) : (
                weekDays.map((day, index) => {
                    const dayShifts = shifts.filter(shift => moment(shift.date).isSame(day, 'day'));

                    return (
                        <View key={index} className="bg-backGroundShiftList w-full rounded-2xl p-5 mb-3 shadow-lg">
                            <View className="flex-row items-center">
                                <CalendarIcon size={Tokens.iconSizeSearchHome} color={Tokens.iconColorSearchHome} />
                                <View className="flex-1 justify-between ml-5">
                                    <ShiftDay date={day.format("dddd")} />  
                                    <ShiftDate date={day.format("D [de] MMMM [del] YYYY")} /> 
                                </View>
                            </View>

                            {dayShifts.length > 0 && (
                                dayShifts.map((shift, shiftIndex) => (
                                    <View key={shiftIndex} className="mt-5 border-t-[0.5px] border-gray-300 flex-row">
                                        <View className="mt-2 flex-grow flex-row justify-center">
                                            <ShiftInText />
                                            <View className="justify-center">
                                                <Time size={Tokens.iconSizeTimeHome} color={"#FEB052"} />
                                            </View>
                                            <ShiftInHour time={shift.startTime} />
                                        </View>
                                        <View className="mt-2 flex-grow flex-row justify-center content-center">
                                            <ShiftOutText />
                                            <View className="justify-center">
                                                <Time size={Tokens.iconSizeTimeHome} color={"#4894FE"} />
                                            </View>
                                            <ShiftOutHour time={shift.endTime} />
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    );
                })
            )}
        </View>
    );
}
