import { Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from '@expo/vector-icons/Ionicons';

type IconLogo = {
  size: number;
  source: any;
};

type IconsProps = {
  size: number;
  color: "#63B4FF" | "#8696BB" | "#B0B0B0" | "#FFFFFF" | "#858585" | "#FEB052" | "#4894FE" | "#595A69" |"#d9dee0" | "#F44336";
};

export const MainIcon = ({ size, source }: IconLogo) => (
  <Image style={{ width: size, height: size }} source={source} />
);

export const LoginIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="login" size={size} color={color} />
);

export const UserIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="user" size={size} color={color} />
);

export const CalendarIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="calendar" size={size} color={color} />
);

export const HomeIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="home" size={size} color={color} />
);

export const MessageIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="message1" size={size} color={color} />
);

export const ArrowIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="right" size={size} color={color} />
);

export const Search = ({ size, color }: IconsProps) => (
  <AntDesign name="search1" size={size} color={color} />
);

export const Time = ({ size, color }: IconsProps) => (
  <AntDesign name="clockcircleo" size={size} color={color} />
);

export const UploadIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="folder1" size={24} color={color} />
);

export const ArrowLeftIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="left" size={size} color={color}  className="absolute top-0 left-0 ml-14" />
);

export const CloseIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="closecircleo" size={size} color={color}  className="mb-4 right-0"/>
);

export const EditIcon = ({ size, color }: IconsProps) => (
  <AntDesign name="camerao" size={size} color={color} />
);

export const AlertIcon = ({ size, color }: IconsProps) => (
  <Ionicons name="alert-circle-outline" size={size} color={color}/>
);