import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

export default function SuccessModal({ visible, message, onClose }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-[#858585] opacity-90">
                <View className="bg-white p-6 rounded-lg w-3/4 items-center">
                    <Text className="text-center text-lg text-[#858585]">{message}</Text>
                    <TouchableOpacity onPress={onClose} className="mt-4 bg-[#007BFF] p-2 rounded">
                        <Text className="text-white">Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
