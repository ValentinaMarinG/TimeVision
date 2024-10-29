import { Image, ImageSourcePropType } from "react-native";

type ProfilePhotoProps = {
  source?: ImageSourcePropType;
};

export const ProfilePhotoHome = ({ source }: ProfilePhotoProps) => {
  return (
    <Image
      source={
        source || { uri: 'https://images.pexels.com/photos/2876486/pexels-photo-2876486.png?auto=compress&cs=tinysrgb&dpr=1&w=500' }
      }
      className="w-[55] h-[55] rounded-full"
    />
  );
};

export const ProfilePhotoScreen = ({ source }: ProfilePhotoProps) => {
  return (
    <Image
      source={
        source || { uri: 'https://images.pexels.com/photos/2876486/pexels-photo-2876486.png?auto=compress&cs=tinysrgb&dpr=1&w=500' }
      }
      className="w-[150] h-[150] rounded-full"
    />
    
  );
};
