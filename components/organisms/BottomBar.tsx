import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { HomeIcon, CalendarIcon, MessageIcon, UserIcon } from "../atoms/Icon";
import * as Tokens from "../tokens";

type BottomBarProps = {
  activeRoute: string;
};

const BottomBar = ({ activeRoute }: BottomBarProps) => (
  <View className="w-full h-16 border-t-2 border-slate-100 flex flex-row justify-around items-center bg-white">
    <TouchableOpacity className="p-2.5">
      <Link href={'/home'}>
        <View
            className={Tokens.iconContainerClasses(activeRoute === '/home')}
        >
          <HomeIcon
            size={Tokens.standardSizeIcon}
            color={activeRoute === '/home' ? '#63B4FF' : '#B0B0B0'}
          />
        </View>
      </Link>
    </TouchableOpacity>
    <TouchableOpacity className="p-2.5">
      <Link href={'/calendar'}>
        <View
          className={Tokens.iconContainerClasses(activeRoute === '/calendar')}
        >
          <CalendarIcon
            size={Tokens.standardSizeIcon}
            color={activeRoute === "/calendar" ? "#63B4FF" : "#B0B0B0"}
          />
        </View>
      </Link>
    </TouchableOpacity>
    <TouchableOpacity className="p-2.5">
      <Link href={'/tickets'}>
        <View
          className={Tokens.iconContainerClasses(activeRoute === '/tickets')}
        >
          <MessageIcon
            size={Tokens.standardSizeIcon}
            color={activeRoute === "/tickets" ? "#63B4FF" : "#B0B0B0"}
          />
        </View>
      </Link>
    </TouchableOpacity>
    <TouchableOpacity className="p-2.5">
      <Link href={'/profile'}>
        <View
          className={Tokens.iconContainerClasses(activeRoute === '/profile')}
        >
          <UserIcon
            size={Tokens.standardSizeIcon}
            color={activeRoute === "/profile" ? "#63B4FF" : "#B0B0B0"}
          />
        </View>
      </Link>
    </TouchableOpacity>
  </View>
);

export default BottomBar;
