import { Image, View } from "react-native";
import { Text } from "react-native-svg";

export const ProfilePhotoHome = () => {
  return (
    <Image
      source={{ uri: 'https://images.pexels.com/photos/2876486/pexels-photo-2876486.png?auto=compress&cs=tinysrgb&dpr=1&w=500' }} 
      className="w-[55] h-[55] rounded-full"
    />
  )
}

export const ProfilePhotoScreen = () => {
  return (
    <Image
      source={{ uri: 'https://images.pexels.com/photos/2876486/pexels-photo-2876486.png?auto=compress&cs=tinysrgb&dpr=1&w=500' }} 
      className="w-[150] h-[150] rounded-full"
    />
  )
}

