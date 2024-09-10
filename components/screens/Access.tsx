import { View, Alert, TextInput, StyleSheet, ScrollView} from "react-native"
import { useState } from "react"
import { TitleTextAccess } from "../atoms/TitleText"
import { SubTitleTextAccess } from "../atoms/SubtitleText"
import { LoginUserText } from "../atoms/DescriptionText"
import { CustomButton } from "../atoms/CustomButton"
import { SubTitleTextRequest } from "../atoms/SubtitleText"
import { useRouter } from 'expo-router';

export default function Login() {

  const [user, setUser] = useState('')

  const router = useRouter();

  const handlePress = () => {
    Alert.alert("Acceso solicitado");
    router.push('/login');
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >  
      <TitleTextAccess/>
      <SubTitleTextAccess/>
      <View style={styles.form}>
        <LoginUserText/>
        <TextInput 
          style={styles.input}
          onChangeText={setUser}
        />
        <View style={styles.buttonContainer}>
        <CustomButton text="Solicitar" customFun={handlePress} />
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    flexGrow:1,
    justifyContent:'center',
    alignItems:'center',
    width:'80%'
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