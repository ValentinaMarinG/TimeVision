import { useState } from "react";
import { Button, Image, View, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CancelButton, UploadButton } from "../atoms/CustomButton";
import { RequestImageText } from "../atoms/DescriptionText";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ImagesPickerProps {
  onImageSelected: (uri: string | null) => void; 
}

export default function ImagesPicker({ onImageSelected }: ImagesPickerProps) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setImage(selectedImageUri);
      onImageSelected(selectedImageUri);
    }
  };

  const removeImage = () => {
    setImage(null);
    onImageSelected(null);
  };

  
  return (
    <View className="flex items-center justify-center w-full">
      <View className="flex justify-around w-full">
        <RequestImageText />
        <UploadButton
          text="Seleccionar archivo"
          customFun={pickImage}
        ></UploadButton>
      </View>
      {image && (
        <View className="flex">
          {/* <Text>{image}</Text> */}
          <Image source={{ uri: image }} style={styles.image} />
          <CancelButton text="Eliminar imagen" customFun={removeImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200
  },
});

