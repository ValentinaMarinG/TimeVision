import { Image, ImageSourcePropType, View } from "react-native";

type ProfilePhotoProps = {
  source?: ImageSourcePropType | any;
};

type ProfilePhotoOffProps = {
  source: any;
};

export const ProfilePhotoHome = ({ source }: ProfilePhotoProps) => {
  return (
    <Image
      source={
        source || {
          uri: "https://images.pexels.com/photos/2876486/pexels-photo-2876486.png?auto=compress&cs=tinysrgb&dpr=1&w=500",
        }
      }
      className="w-[55] h-[55] rounded-full"
    />
  );
};

export const ProfilePhotoScreen = ({ source }: ProfilePhotoProps) => {
  return (
    <Image
      source={
        source || {
          uri: "https://images.pexels.com/photos/2876486/pexels-photo-2876486.png?auto=compress&cs=tinysrgb&dpr=1&w=500",
        }
      }
      className="w-[150] h-[150] rounded-full"
    />
  );
};

export const ProfilePhotoOffline = ({ source }: ProfilePhotoOffProps) => {
  return (
    <View className="w-[150] h-[150] rounded-full bg-slate-300">
      <Image source={source} className="w-[150] h-[150] rounded-full" />
    </View>
  );
};

export const ProfilePhotoOfflineHome = ({ source }: ProfilePhotoOffProps) => {
  return (
    <View className="w-[55] h-[55] rounded-full bg-white">
      <Image source={source} className="w-[55] h-[55] rounded-full" />
    </View>
  );
};
