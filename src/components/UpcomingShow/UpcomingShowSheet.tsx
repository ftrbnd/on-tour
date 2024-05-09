import { Text } from "@ui-kitten/components";
import { View } from "react-native";
import { useSheetPayload } from "react-native-actions-sheet";
import { useMMKVString } from "react-native-mmkv";

import UpcomingShowForm from "./UpcomingShowForm";
import useImagePicker from "../../hooks/useImagePicker";
import PlaylistImage from "../Playlist/PlaylistImage";
import FormattedSheet from "../ui/FormattedSheet";

export default function UpcomingShowSheet() {
  const existingShow = useSheetPayload("upcoming-show-sheet");
  const [existingShowImage] = useMMKVString(`upcoming-show-${existingShow?.id}-image`);

  const { selectedImage, pickImageAsync, warning } = useImagePicker();

  return (
    <FormattedSheet
      header={
        <>
          <Text category="h2">Show Details</Text>
          <View style={{ alignItems: "flex-end", gap: 4 }}>
            <PlaylistImage
              onPress={pickImageAsync}
              uri={selectedImage ? selectedImage.uri : existingShowImage}
              existingShowId={existingShow?.id}
            />
            {warning && (
              <Text category="label" status="warning">
                {warning}
              </Text>
            )}
          </View>
        </>
      }
      body={<UpcomingShowForm initialValues={existingShow} selectedImage={selectedImage} />}
    />
  );
}
