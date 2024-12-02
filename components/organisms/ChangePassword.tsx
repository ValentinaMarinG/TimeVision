import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    Pressable,
} from "react-native";
import { CustomButtonPass } from "../atoms/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { updatePasswordRequest } from "../../config/routers";
import SuccessModal from "./SuccessModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createChangePasswordSchema } from "../../schemas/changePasswordSchema"; 
import { AlertIcon } from "../atoms/Icon";

export default function ChangePasswordModal({ visible, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentError, setCurrentError] = useState("");
  const [newError, setNewError] = useState("");
  const [error, setError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [ErrorModalVisible, setErrorModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setCurrentError("La contraseña actual es requerida.");
      return;
    } else {
      setCurrentError("");
    }

    const schema = createChangePasswordSchema(currentPassword);

    try {
      schema.parse({ password: newPassword });
      setNewError("");
    } catch (e) {
      if (e.errors?.length) {
        setNewError(e.errors[0].message);
        return;
      }
    }

    if (newPassword !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      } else {
        setError("");
      }
  
      const response = await updatePasswordRequest(currentPassword, newPassword);
      if (response.success) {
        setModalMessage(response.message);
        setSuccessModalVisible(true);
      } else {
        setModalMessage(response.message);
        setErrorModalVisible(true);
      }
    };
  
    const handleCancelButton = () => {
      onClose();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setCurrentError("");
      setNewError("");
      setError("");
    };
  
    const CloseModalSuccess = async () => {
      onClose();
      await AsyncStorage.clear();
      if (!(await AsyncStorage.getItem("token"))) {
        router.push("/login");
      }
    };
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable 
                onPress={onClose}
                className="flex-1 justify-center items-center bg-black/50"
            >
                <Pressable 
                    onPress={(e) => e.stopPropagation()}
                    className="bg-white p-8 rounded-3xl w-[85%] shadow-lg"
                >
                    <View className="items-center mb-6">
                        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                            <Ionicons name="lock-closed" size={28} color="#3b82f6" />
                        </View>
                        <Text className="text-xl font-semibold text-gray-800">
                            Cambiar contraseña
                        </Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
                                <TextInput
                                    className="flex-1 px-4 py-3 rounded-xl"
                                    placeholder="Contraseña actual"
                                    secureTextEntry={!showCurrentPassword}
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    onFocus={() => setCurrentError("")}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="px-4"
                                >
                                    <Ionicons
                                        name={showCurrentPassword ? "eye" : "eye-off"}
                                        size={24}
                                        color="#9ca3af"
                                    />
                                </TouchableOpacity>
                            </View>
                            {currentError ? <Text className="text-red-500 text-sm mt-1 ml-1">{currentError}</Text> : null}
                        </View>

                        <View>
                            <View className="flex-row items-center bg-gray-50 rounded-xl border border-gray-200">
                                <TextInput
                                    className="flex-1 px-4 py-3 rounded-xl"
                                    placeholder="Nueva contraseña"
                                    secureTextEntry={!showNewPassword}
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    onFocus={() => setNewError("")}
                                />
                                <TouchableOpacity 
                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                    className="px-4"
                                >
                                    <Ionicons
                                        name={showNewPassword ? "eye" : "eye-off"}
                                        size={24}
                                        color="#9ca3af"
                                    />
                                </TouchableOpacity>
                            </View>
                            {newError ? <Text className="text-red-500 text-sm mt-1 ml-1">{newError}</Text> : null}
                        </View>

                        <View>
                            <TextInput
                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
                                placeholder="Confirmar contraseña"
                                secureTextEntry={true}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                onFocus={() => setError("")}
                            />
                            {error ? <Text className="text-red-500 text-sm mt-1 ml-1">{error}</Text> : null}
                        </View>
                    </View>

                    <View className="mt-6 space-y-3">
                        <TouchableOpacity 
                            onPress={handleChangePassword}
                            className="bg-[#4894FE] py-3 rounded-xl active:opacity-80"
                        >
                            <Text className="text-center text-white font-medium">
                                Guardar
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            onPress={handleCancelButton}
                            className="bg-gray-500 border-2 border-gray-200 py-3 rounded-xl active:opacity-80"
                        >
                            <Text className="text-center text-white font-medium">
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>

            <Modal
                animationType="fade"
                transparent={true}
                visible={successModalVisible || ErrorModalVisible}
                onRequestClose={() => {
                    if (successModalVisible) {
                        setSuccessModalVisible(false);
                        setModalMessage("");
                        CloseModalSuccess();
                    } else {
                        setErrorModalVisible(false);
                        setModalMessage("");
                    }
                }}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white p-8 rounded-3xl w-[85%] items-center shadow-lg">
                        <View className="w-16 h-16 rounded-full items-center justify-center mb-4"
                            style={{ 
                                backgroundColor: successModalVisible ? '#dcfce7' : '#fee2e2'
                            }}
                        >
                            <Ionicons 
                                name={successModalVisible ? "checkmark-circle" : "alert-circle"} 
                                size={32} 
                                color={successModalVisible ? '#22c55e' : '#ef4444'}
                            />
                        </View>
                        
                        <Text className="text-center text-xl font-semibold text-gray-800 mb-2">
                            {successModalVisible ? 'Éxito' : 'Error'}
                        </Text>
                        <Text className="text-center text-base text-gray-600 mb-6">
                            {modalMessage}
                        </Text>
                        
                        <TouchableOpacity 
                            onPress={() => {
                                if (successModalVisible) {
                                    setSuccessModalVisible(false);
                                    setModalMessage("");
                                    CloseModalSuccess();
                                } else {
                                    setErrorModalVisible(false);
                                    setModalMessage("");
                                }
                            }}
                            className="w-full bg-blue-500 py-3 rounded-xl active:opacity-80"
                        >
                            <Text className="text-center text-white font-medium">
                                Aceptar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
}
