import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import moment from "moment";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useMMKVString } from "react-native-mmkv";
import { Button, Card, Modal, Portal, Text, TextInput } from "react-native-paper";

import useImagePicker from "../../hooks/useImagePicker";
import useUpcomingShows from "../../hooks/useUpcomingShows";
import { useAuth } from "../../providers/AuthProvider";
import { UpcomingShow } from "../../services/upcomingShows";

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    display: "flex",
    gap: 12,
    borderRadius: 20,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 75,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
    backgroundColor: "lightgray",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    display: "flex",
    gap: 8,
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});

interface ModalProps {
  visible: boolean;
  setVisible: (vis: boolean) => void;
  editingShow?: UpcomingShow;
}

export default function UpcomingShowModal({ visible, setVisible, editingShow }: ModalProps) {
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
  const disabled = !artist || !tour || !venue || !city || !date;

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
      if (editingShow) {
        if (
          artist === editingShow?.artist &&
          tour === editingShow?.tour &&
          venue === editingShow?.venue &&
          city === editingShow?.city &&
          dateWithoutTimezone === editingShow?.date
        ) {
          return setVisible(false);
        }

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
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={styles.modal}>
        <View style={styles.header}>
          <Text variant="headlineLarge">Show Details</Text>
          {selectedImage || previousShowImage ? (
            <Image
              onTouchStart={pickImageAsync}
              source={{
                uri: selectedImage ? selectedImage.uri : previousShowImage,
                width: styles.image.width,
                height: styles.image.height,
              }}
              contentFit="cover"
              style={styles.image}
              transition={1000}
            />
          ) : (
            <View style={styles.image}>
              <Ionicons
                onPress={pickImageAsync}
                name="musical-notes"
                size={styles.image.height * 0.66}
                color="black"
              />
            </View>
          )}
        </View>

        <View style={styles.form}>
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
                right={() => <Ionicons size={24} name="calendar" />}
                rightStyle={{ marginRight: 16 }}
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
        </View>

        <View style={styles.bottom}>
          {warning && <Text variant="labelMedium">{warning}</Text>}
          <Button mode="contained" onPress={handleSave} disabled={disabled}>
            Save
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}
