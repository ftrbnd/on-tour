import { useMMKVString } from "react-native-mmkv";
import { Text } from "react-native-paper";

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

  return (
    <AnimatedModal
      visible={visible}
      setVisible={setVisible}
      header={
        <>
          <Text variant="headlineLarge">Show Details</Text>
          <PlaylistImage
            showImage={selectedImage !== null || previousShowImage !== undefined}
            onPress={pickImageAsync}
            uri={selectedImage ? selectedImage.uri : previousShowImage}
          />
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
