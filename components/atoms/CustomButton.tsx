import { Pressable, Text, StyleSheet } from "react-native";
import { useFonts } from 'expo-font';

type CustomButtonProps = {
  text: string,
  customFun: () => void;
}

export const CustomButton = ({ text, customFun }: CustomButtonProps) => {
  return (
    <Pressable style={styles.buttonLogin} onPress={customFun}>
      <Text style={styles.textStyle}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonLogin: {
    width: 187,
    height: 46,
    elevation: 5,
    backgroundColor:'#4894FE',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    },
    textStyle:{
      color:'#FFFFFF',
      fontSize:16
    }
  })