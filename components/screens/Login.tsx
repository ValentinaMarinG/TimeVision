import { View, Alert, TextInput, StyleSheet, ScrollView} from "react-native"
import { MainIcon } from "../atoms/Icon"
import { useState } from "react"
import { TitleTextLogin } from "../atoms/TitleText"
import { SubTitleTextLogin } from "../atoms/SubtitleText"
import { LoginUserText } from "../atoms/DescriptionText"
import { LoginPasswordText } from "../atoms/DescriptionText"
import { CustomButton } from "../atoms/CustomButton"
import { SubTitleTextRequest } from "../atoms/SubtitleText"
import { useRouter } from 'expo-router';

export default function Login() {

  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const router = useRouter();

  const handlePress = () => {
    router.push('/home');
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >  
      <TitleTextLogin/>
      <MainIcon size={115} source={require('../../assets/LogoGrey.png')}/>
      <SubTitleTextLogin/>
      <View style={styles.form}>
        <LoginUserText/>
        <TextInput 
          style={styles.input}
          onChangeText={setUser}
        />
        <LoginPasswordText/>
        <TextInput 
          style={styles.input}
          onChangeText={setPass}
        />
        <View style={styles.buttonContainer}>
        <CustomButton text="Ingresa" customFun={handlePress} />
        </View>
        <SubTitleTextRequest />
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    flexGrow:1,
    justifyContent:'center',
    alignItems:'center',
    width:'70%'
  },
  form: {
    width:'100%',
    margin:20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 46,
    width: 300,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom:35,
    padding:10,
    fontFamily:'poppins-regular'
  },
  buttonContainer:{
    margin:15,
    alignItems:'center',
    justifyContent:'space-between',

  }
});