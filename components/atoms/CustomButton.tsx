import { Pressable, Text} from "react-native";

type CustomButtonProps = {
  text: string,
  customFun: () => void;
}

export const CustomButton = ({ text, customFun }: CustomButtonProps) => {
  return (
    <Pressable className="w-9/12 h-12 bg-[#4894FE] rounded-lg justify-center items-center shadow-2xl" onPress={customFun}>
      <Text className="text-white text-base text-center">{text}</Text>
    </Pressable>
  );
}


export const AddButton = ({ text, customFun }: CustomButtonProps) => {
  return (
    <Pressable className="w-16 h-16 bg-[#4894FE] rounded-full justify-center items-center shadow-2xl absolute bottom-3 right-1"  onPress={customFun}>
      <Text className="text-white text-3xl text-center">{text}</Text>
    </Pressable>
  );
}


