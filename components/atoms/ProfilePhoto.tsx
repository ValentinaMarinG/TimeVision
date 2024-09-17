import { Image, View } from "react-native";
import { Text } from "react-native-svg";

export default function ProfilePhoto() {
  return (
    <Image
      source={{ uri: 'https://images.pexels.com/photos/2876486/pexels-photo-2876486.png?auto=compress&cs=tinysrgb&dpr=1&w=500' }} 
      className="w-[55] h-[55] rounded-full"
    />
  )
}
