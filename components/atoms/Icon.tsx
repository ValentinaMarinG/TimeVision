import { Image } from 'react-native';

type IconLogo ={
    size: number,
    source:any
}

export const MainIcon = ({size, source}:IconLogo)=> (
    <Image
        style={{ width: size, height: size }}
        source={source}
    />
)


import AntDesign from '@expo/vector-icons/AntDesign';

type IconsProps = {
  size: number,
  color: '#63B4FF' | '#8696BB' | '#B0B0B0'
}

export const LoginIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="login" size={size} color={color} />
)

export const UserIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="user" size={size} color={color} />
)


export const CalendarIcon = ({ size, color }: IconsProps) => (
    <AntDesign name="calendar" size={size} color={color} />
)

export const HomeIcon = ({ size, color }: IconsProps) => (
    <AntDesign name="home" size={size} color={color} />
)

export const MessageIcon = ({ size, color }: IconsProps) => (
    <AntDesign name="message1" size={size} color={color} />
)
