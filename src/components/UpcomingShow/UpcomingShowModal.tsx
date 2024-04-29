import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { useState } from "react";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";

import useImagePicker from "../../hooks/useImagePicker";
import useUpcomingShows from "../../hooks/useUpcomingShows";
import { useAuth } from "../../providers/AuthProvider";
import { UpcomingShow } from "../../services/upcomingShows";
import PlaylistImage from "../Playlist/PlaylistImage";
import AnimatedModal from "../ui/AnimatedModal";

interface Props {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  editingShow?: UpcomingShow;
}

export default function UpcomingShowModal({ visible, setVisible, editingShow }: Props) {
  const [artist, setArtist] = useState<string>(editingShow?.artist ?? "");
  const [tour, setTour] = useState<string>(editingShow?.tour ?? "");
  const [venue, setVenue] = useState<string>(editingShow?.venue ?? "");
  const [city, setCity] = useState<string>(editingShow?.city ?? "");
  const [date, setDate] = useState<Date>(
    editingShow?.date ? new Date(editingShow.date) : new Date(),
  );
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const dateWithoutTimezone = date.toISOString().substring(0, 10);
  const formattedDate = moment(dateWithoutTimezone).format("MMMM Do, YYYY");
  const noChanges =
    artist === editingShow?.artist &&
    tour === editingShow?.tour &&
    venue === editingShow?.venue &&
    city === editingShow?.city &&
    dateWithoutTimezone === editingShow?.date;
  const disabled = !artist || !tour || !venue || !city || !date || noChanges;

  const theme = useTheme();
  const { selectedImage, pickImageAsync, warning } = useImagePicker();
  const { addShow, updateShow } = useUpcomingShows();
  const [previousShowImage] = useMMKVString(`upcoming-show-${editingShow?.id}-image`);
  const { user } = useAuth();

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    setShowDateTimePicker(false);
    if (event.type !== "set") return;

    if (selectedDate) setDate(selectedDate);
  };

  const handleDatePickerPress = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date ? new Date(date) : new Date(),
        onChange: onDateChange,
        mode: "date",
        display: "spinner",
        timeZoneName: "UTC",
        minimumDate: new Date(),
      });
    } else {
      setShowDateTimePicker(true);
    }
  };

  const handleSave = async () => {
    // TODO: use react-hook-form or Formik?
    if (!artist || !tour || !venue || !city || !date || !user?.id) return;

    try {
      if (editingShow && !noChanges) {
        await updateShow(
          {
            id: editingShow.id,
            userId: user.id,
            artist,
            tour,
            venue,
            city,
            date: dateWithoutTimezone,
          },
          selectedImage,
        );
      } else {
        await addShow(
          {
            artist,
            tour,
            venue,
            city,
            date: dateWithoutTimezone,
            userId: user.id,
          },
          selectedImage,
        );
      }

      setVisible(false);
    } catch (e) {
      console.error(e);
    }
  };

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
        <>
          <TextInput
            label="Artist"
            value={artist}
            onChangeText={(text) => setArtist(text)}
            multiline
          />
          <TextInput label="Tour" value={tour} onChangeText={(text) => setTour(text)} multiline />
          <TextInput
            label="Venue"
            value={venue}
            onChangeText={(text) => setVenue(text)}
            multiline
          />
          <TextInput label="City" value={city} onChangeText={(text) => setCity(text)} multiline />

          <Card>
            <TouchableOpacity onPress={handleDatePickerPress}>
              <Card.Title
                title={formattedDate}
                right={() => (
                  <Ionicons size={24} name="calendar" color={theme.colors.onSurfaceVariant} />
                )}
                rightStyle={{ marginRight: 16 }}
                style={{ backgroundColor: theme.colors.surfaceVariant }}
              />
            </TouchableOpacity>

            {Platform.OS === "ios" && showDateTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date(date)}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
          </Card>
        </>
      }
      footer={
        <>
          {warning && <Text variant="labelMedium">{warning}</Text>}
          <Button mode="outlined" onPress={() => setVisible(false)}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSave} disabled={disabled}>
            Save
          </Button>
        </>
      }
    />
  );
}
