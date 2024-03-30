import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function useImagePicker() {
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const pickImageAsync = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });
      if (!result.assets || result.canceled) return;

      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri, {
        size: true,
      });
      // TODO: https://docs.expo.dev/versions/latest/sdk/filesystem/#fileinfo
      const fileSize = fileInfo.size;
      if (fileSize >= 256 * 1000) {
        setSelectedImage(null);
        setWarning("Image size is too big!");
      } else {
        setSelectedImage(result.assets[0]);
        setWarning(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    selectedImage,
    pickImageAsync,
    warning,
  };
}
