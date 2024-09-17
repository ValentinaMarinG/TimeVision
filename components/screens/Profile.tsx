import { View, Text, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ButtonProfile } from "../atoms/CustomButton";
import { TitleProfile } from '../atoms/TitleText';
import { SubTitleProfileCargo, SubTitleProfileName, SubTitleProfileDocument, SubTitleProfileDepartament, SubTitleProfileEmail } from "../atoms/SubtitleText";
import { useRouter } from "expo-router";
import * as Tokens from "../tokens";
import { useState } from 'react';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const [account, SetAccount] = useState({
    name: 'Manuel Castro Duque',
    document: 'C.C. 1.234.567.890',
    position: 'Vigilante',
    departament: 'Seguridad',
    email: 'manuel.Castro@autonoma'
  });
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  const handlePassword = () => {
    console.log("Cambiar contraseña")
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (

    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className={Tokens.mainContainer}>
      <View className={Tokens.mainContainer} style={{ paddingBottom: insets.bottom }}>
        <TitleProfile />
        <View className={Tokens.avatarButtonContainer}>
          <TouchableOpacity onPress={handleOpenModal} className="mr-4">
            <ButtonProfile text="Actualizar foto" customFun={handleOpenModal} />
          </TouchableOpacity>
          <View className={Tokens.avatarContainer}>
            <Image source={require('../../assets/avatar.jpg')} className={Tokens.avatarImage} />
          </View>
        </View>

        <View>
          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileName />
            <Text className={Tokens.standardTextProfileRight}>{account.name}</Text>
          </View>

          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileDocument />
            <Text className={Tokens.standardTextProfileRight}>{account.document}</Text>
          </View>

          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileCargo />
            <Text className={Tokens.standardTextProfileRight}>{account.position}</Text>
          </View>

          <View className={Tokens.textSubtitleContainer}>
            <SubTitleProfileDepartament />
            <Text className={Tokens.standardTextProfileRight}>{account.departament}</Text>
          </View>

          <View className={Tokens.standardTextTitle}>
            <SubTitleProfileEmail />
            <Text className={Tokens.textSubtitleEmail}>{account.email}</Text>
          </View>
        </View>

        <View className={Tokens.buttonContainer}>
          <TouchableOpacity>
            <ButtonProfile text="Actualizar Contraseña" customFun={handlePassword} />
          </TouchableOpacity>
        </View>
        <View className={Tokens.buttonContainer}>
          <TouchableOpacity>
            <ButtonProfile text="Cerrar sesión" customFun={handleLogout} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View className={Tokens.modalContainer}>
          <View className={Tokens.modalContent}>
            <Text>Cargar Foto</Text>
            <TouchableOpacity onPress={handleCloseModal}>
              <ButtonProfile text='Cerrar' customFun={handleCloseModal} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
