import { Text } from "@ui-kitten/components";
import { View } from "react-native";
import { useMMKVString } from "react-native-mmkv";

import UpcomingShowForm from "./UpcomingShowForm";
import useImagePicker from "../../hooks/useImagePicker";
import { UpcomingShow } from "../../services/upcomingShows";
import PlaylistImage from "../Playlist/PlaylistImage";
import FormattedModal from "../ui/FormattedModal";

interface Props {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  existingShow?: UpcomingShow;
}

export default function UpcomingShowModal({ visible, setVisible, existingShow }: Props) {
  const { selectedImage, pickImageAsync, warning } = useImagePicker();
  const [previousShowImage] = useMMKVString(`upcoming-show-${existingShow?.id}-image`);

  return (
    <FormattedModal
      visible={visible}
      setVisible={setVisible}
      header={
        <>
          <Text category="h2">Show Details</Text>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <PlaylistImage
              onPress={pickImageAsync}
              uri={selectedImage ? selectedImage.uri : previousShowImage}
            />
            {warning && (
              <Text category="label" status="warning">
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
