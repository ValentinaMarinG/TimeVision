import { useState } from "react";
import { Button, Image, View, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CancelButton, UploadButton } from "../atoms/CustomButton";
import { RequestImageText } from "../atoms/DescriptionText";

export default function ImagesPicker() {
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
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <View className="flex items-center justify-center w-full">
      <View className="flex justify-around w-full mb-8">
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
