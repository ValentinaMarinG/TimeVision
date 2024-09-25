import { View } from "react-native";
import { ShiftDate, ShiftInHour, ShiftInText, ShiftOutHour, ShiftOutText } from "../atoms/DescriptionText";
import { CalendarIcon, Time } from "../atoms/Icon";
import * as Tokens from "../tokens"
import { ShiftDay } from "../atoms/SubtitleText";

export default function ShiftsList() {
    return (
        <View className="bg-backGroundShiftList w-full rounded-2xl p-5 mb-1">
            <View className="flex-row items-center">
                <CalendarIcon size={Tokens.iconSizeSearchHome} color={Tokens.iconColorSearchHome} />
                <View className="flex-1 justify-between ml-5">
                    <ShiftDay />
                    <ShiftDate />
                </View>
            </View>
            <View className=" mt-5 border-t-[0.5px] border-gray-300 flex-row">
                <View className="mt-2 flex-grow flex-row justify-center">
                    <ShiftInText />
                    <View className="justify-center">
                        <Time size={Tokens.iconSizeTimeHome} color={"#FEB052"}></Time>
                    </View>
                    <ShiftInHour />
                </View>
                <View className="mt-2 flex-grow flex-row justify-center content-center">
                    <ShiftOutText />
                    <View className="justify-center">
                    <Time size={Tokens.iconSizeTimeHome} color={"#4894FE"}></Time>
                    </View>
                    <ShiftOutHour />
                </View>
            </View>
        </View>
    )
}
