import { Image, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});

interface ImageViewerProps {
  selectedImage: string;
}

export default function ImageViewer({ selectedImage }: ImageViewerProps) {
  const imageSource = { uri: selectedImage };

  return <Image source={imageSource} style={styles.image} />;
}
