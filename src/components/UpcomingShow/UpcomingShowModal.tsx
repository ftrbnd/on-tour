import { View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { Text, useTheme } from "react-native-paper";

import UpcomingShowForm from "./UpcomingShowForm";
import useImagePicker from "../../hooks/useImagePicker";
import { UpcomingShow } from "../../services/upcomingShows";
import PlaylistImage from "../Playlist/PlaylistImage";
import AnimatedModal from "../ui/AnimatedModal";

interface Props {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  existingShow?: UpcomingShow;
}

export default function UpcomingShowModal({ visible, setVisible, existingShow }: Props) {
  const { selectedImage, pickImageAsync, warning } = useImagePicker();
  const [previousShowImage] = useMMKVString(`upcoming-show-${existingShow?.id}-image`);
  const theme = useTheme();

  return (
    <AnimatedModal
      visible={visible}
      setVisible={setVisible}
      header={
        <>
          <Text variant="headlineLarge">Show Details</Text>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <PlaylistImage
              showImage={selectedImage !== null || previousShowImage !== undefined}
              onPress={pickImageAsync}
              uri={selectedImage ? selectedImage.uri : previousShowImage}
            />
            {warning && (
              <Text variant="labelSmall" style={{ color: theme.colors.error }}>
                {warning}
              </Text>
            )}
          </View>
        </>
      }
      body={
        <UpcomingShowForm
          initialValues={existingShow}
          selectedImage={selectedImage}
          dismissModal={() => setVisible(false)}
        />
      }
    />
  );
}
