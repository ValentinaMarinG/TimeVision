import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Modal,
    TouchableOpacity,
    Alert,
} from "react-native";
import { CustomButtonPass } from "../atoms/CustomButton";
import { Ionicons } from '@expo/vector-icons';
import { updatePasswordRequest } from '../../config/routers';
import SuccessModal from './SuccessModal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

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

    const validatePassword = (password) => {
        const minLength = 8;
        const invalidCharRegex = /ñ/;
        const numberRegex = /\d/;
        const uppercaseRegex = /[A-Z]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (password.length < minLength) {
            return `La contraseña debe tener al menos ${minLength} caracteres.`;
        }
        if (password==currentPassword) {
            return "Contraseña usada recientemente.";
        }
        if (invalidCharRegex.test(password)) {
            return "La contraseña no puede contener la letra 'ñ'.";
        }
        if (!numberRegex.test(password)) {
            return "La contraseña debe contener al menos un número.";
        }
        if (!uppercaseRegex.test(password)) {
            return "La contraseña debe contener al menos una letra mayúscula.";
        }
        if (!specialCharRegex.test(password)) {
            return "La contraseña debe contener al menos un carácter especial.";
        }
        return "";
    };

    const handleChangePassword = async () => {

        if (!currentPassword) {
            setCurrentError("La contraseña actual es requerida.");
            return;
        } else {
            setCurrentError("");
        }

        const newPasswordError = validatePassword(newPassword);
        if (newPasswordError) {
            setNewError(newPasswordError);
            return;
        } else {
            setNewError("");
        }

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
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
    }

    const CloseModalSuccess = async () => {
        onClose();
        await AsyncStorage.clear();
        if (!await AsyncStorage.getItem("token")) {
            router.push("/login");
        }
    }
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-[#858585] opacity-90">
                <View className="bg-white p-6 rounded-lg w-3/4 items-center">
                    <Text className="text-center text-lg text-[#858585]">Cambiar contraseña</Text>

                    <View className="flex-row items-center rounded-xl bg-gray-200 pr-2 border mt-4 border-gray-300">
                        <TextInput
                            className="flex-1 rounded-lg p-2"
                            placeholder="Contraseña actual"
                            secureTextEntry={!showCurrentPassword}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            onFocus={() => setCurrentError("")}
                        />
                        <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                            <Ionicons
                                name={showCurrentPassword ? "eye" : "eye-off"}
                                size={24}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>
                    {currentError ? <Text className="text-red-500">{currentError}</Text> : null}
                    <View className="flex-row items-center rounded-xl bg-gray-200 pr-2 border mt-4 border-gray-300">
                        <TextInput
                            className="flex-1 rounded-lg p-2"
                            placeholder="Nueva contraseña"
                            secureTextEntry={!showNewPassword}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            onFocus={() => setNewError("")}
                        />
                        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                            <Ionicons
                                name={showNewPassword ? "eye" : "eye-off"}
                                size={24}
                                color="gray"
                            />
                        </TouchableOpacity>
                    </View>
                    {newError ? <Text className="text-red-500">{newError}</Text> : null}
                    <TextInput
                        className="border border-gray-300 rounded-lg p-2 w-full mb-4 bg-gray-200 mt-4"
                        placeholder="Confirmar contraseña"
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => setError("")}
                    />
                    {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

                    <View className="w-full items-center">
                        <CustomButtonPass text="Cancelar" customFun={handleCancelButton} />
                        <CustomButtonPass text="Guardar" customFun={handleChangePassword} />
                    </View>

                </View>

            </View>
            <SuccessModal
                visible={successModalVisible}
                message={modalMessage}
                onClose={() => {
                    setSuccessModalVisible(false);
                    setModalMessage("");
                    CloseModalSuccess();
                }}
            />
            <SuccessModal
                visible={ErrorModalVisible}
                message={modalMessage}
                onClose={() => {
                    setErrorModalVisible(false);
                    setModalMessage("");
                }}
            />
        </Modal>
    );
}
