import { Image, View } from "react-native";
import images from "../../assets/index";

type ProfilePhotoProps = {
  uri: string;
};

export const ProfilePhotoHome = ({ uri }: ProfilePhotoProps) => {
  return <Image source={{ uri }} className="w-[55px] h-[55px] rounded-full" />;
};

export const ProfilePhotoScreen = ({ uri }: ProfilePhotoProps) => {
  return <Image source={{ uri }} className="w-[150] h-[150] rounded-full" />;
};

export const ProfilePhotoOffline = () => {
  return (
    <Image
      source={require('../../assets/userProfileOffline.png')}
      className="w-[150] h-[150] rounded-full"
    />
  );
};

export const ProfilePhotoOfflineHome = () => {
  return (
    <Image
      source={require('../../assets/userProfileOffline.png')}
      className="w-[55] h-[55] rounded-full"
    />
  );
};
