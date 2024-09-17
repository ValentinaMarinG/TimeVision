// BottomBar.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Cambiado de @react-navigation/native a expo-router
import { HomeIcon, CalendarIcon, MessageIcon, UserIcon } from '../atoms/Icon';
import * as Tokens from '../tokens';

type BottomBarProps = {
  activeRoute: string;
};

const BottomBar = ({ activeRoute }: BottomBarProps) => {
  const router = useRouter(); // Usa useRouter en lugar de useNavigation

  const handleNavigation = (routeName: string) => {
    router.push(routeName); // Cambiado para usar router.push
  };

  return (
    <View style={{ width: '100%', height: 60, borderTopWidth: 1, borderTopColor: '#ddd', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff' }}>
      <TouchableOpacity onPress={() => handleNavigation('home')}>
        <HomeIcon size={24} color={activeRoute === 'home' ? '#63B4FF' : '#B0B0B0'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('calendar')}>
        <CalendarIcon size={24} color={activeRoute === 'calendar' ? '#63B4FF' : '#B0B0B0'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('tickets')}>
        <MessageIcon size={24} color={activeRoute === 'tickets' ? '#63B4FF' : '#B0B0B0'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigation('profile')}>
        <UserIcon size={24} color={activeRoute === 'profile' ? '#63B4FF' : '#B0B0B0'} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;
