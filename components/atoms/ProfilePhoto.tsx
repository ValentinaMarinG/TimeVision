import { Image, ImageSourcePropType, Text, View } from "react-native";

type ProfilePhotoProps = {
  source?: ImageSourcePropType | any;
  name: string;
};

type ProfilePhotoOffProps = {
  source: any;
};

export const ProfilePhotoHome = ({ source, name }: ProfilePhotoProps) => {
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return source ? (
    <Image
      source={source}
      className="w-[55px] h-[55px] rounded-full"
    />
  ) : (
    <View className="w-[55px] h-[55px] rounded-full bg-gray-300 flex items-center justify-center">
      <Text className="text-2xl font-bold text-white">
        {getInitial(name)}
      </Text>
    </View>
  );
};

export const ProfilePhotoScreen = ({ source, name }: ProfilePhotoProps) => {
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return source ? (
    <Image
      source={source}
      className="w-[150px] h-[150px] rounded-full"
    />
  ) : (
    <View className="w-[150px] h-[150px] rounded-full bg-gray-300 flex items-center justify-center">
      <Text className="text-5xl font-bold text-white text-center">
        {getInitial(name)}
      </Text>
    </View>
  );
};

export const ProfilePhotoOffline = ({ source }: ProfilePhotoOffProps) => {
  return (
    <View className="w-[150px] h-[150px] rounded-full bg-slate-300">
      <Image source={source} className="w-[150px] h-[150px] rounded-full" />
    </View>
  );
};

export const ProfilePhotoOfflineHome = ({ source }: ProfilePhotoOffProps) => {
  return (
    <View className="w-[55px] h-[55px] rounded-full bg-white">
      <Image source={source} className="w-[55px] h-[55px] rounded-full" />
    </View>
  );
};
