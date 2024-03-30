import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Modal, Portal, Text, TextInput } from "react-native-paper";

import useImagePicker from "../hooks/useImagePicker";
import useUpcomingShows from "../hooks/useUpcomingShows";
import { useAuth } from "../providers/AuthProvider";

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
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
}

export default function CreateUpcomingShowModal({ visible, setVisible }: ModalProps) {
  const [artist, setArtist] = useState<string>("");
  const [tour, setTour] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const disabled = !artist || !tour || !venue || !city || !date;
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const { selectedImage, pickImageAsync, warning } = useImagePicker();
  const { addNew } = useUpcomingShows();
  const { user } = useAuth();

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    setShowDateTimePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleSave = async () => {
    // TODO: use react-hook-form or Formik?
    if (!artist || !tour || !venue || !city || !date || !user?.id) return;

    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    try {
      await addNew(
        {
          artist,
          tour,
          venue,
          city,
          date: `${date.getFullYear()}-${month}-${day}`,
          userId: user.id,
        },
        selectedImage,
      );

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
          {selectedImage ? (
            <Image
              source={{
                uri: selectedImage.uri,
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
            <Card.Title
              title={date.toDateString()}
              right={() => (
                <Ionicons size={24} name="calendar" onPress={() => setShowDateTimePicker(true)} />
              )}
              rightStyle={{ marginRight: 16 }}
            />
          </Card>

          {showDateTimePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              onChange={onDateChange}
            />
          )}
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
