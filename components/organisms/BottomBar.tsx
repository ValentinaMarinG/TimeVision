// BottomBar.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeIcon, CalendarIcon, MessageIcon, UserIcon } from '../atoms/Icon';
import * as Tokens from '../tokens';

type BottomBarProps = {
  activeRoute: string;
};

const BottomBar = ({ activeRoute }: BottomBarProps) => {
  const router = useRouter();

  const handleNavigation = (routeName: string) => {
    router.push(routeName);
  };
  const iconColor = (route: string) => activeRoute === route ? "#63B4FF" : "#B0B0B0";
  return (
    <View className="w-full h-16 border-t border-t-gray-300 flex-row justify-around items-center bg-white">
      <TouchableOpacity onPress={() => handleNavigation("home")}>
        <View className={Tokens.iconContainerClasses(activeRoute === "/home")}>
          <HomeIcon
            size={Tokens.standardSizeIcon}
            color={iconColor("/home")}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation("calendar")}>
        <View
          className={Tokens.iconContainerClasses(activeRoute === "/calendar")}
        >
          <CalendarIcon
            size={Tokens.standardSizeIcon}
            color={iconColor("/calendar")}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation("tickets")}>
        <View className={Tokens.iconContainerClasses(activeRoute === "/tickets")}>
          <MessageIcon
            size={Tokens.standardSizeIcon}
            color={iconColor("/tickets")}
          />
        </View>

      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation("profile")}>
        <View className={Tokens.iconContainerClasses(activeRoute === "/profile")}>
          <UserIcon
            size={Tokens.standardSizeIcon}
            color={iconColor("/profile")}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;
