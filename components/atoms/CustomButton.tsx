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

export const ButtonProfile = ({ text, customFun }: CustomButtonProps) => {
  return (
    <Pressable 
      className={`w-44 h-8 bg-gray-100 rounded-lg border border-gray-400 shadow-2xl mb-4`} 
      onPress={customFun}
    >
      <Text className={`text-gray-600 text-sm text-center`}>{text}</Text>
    </Pressable>
  );
};




