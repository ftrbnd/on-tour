import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
  AndroidNativeProps,
} from "@react-native-community/datetimepicker";
import { useField } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { HelperText, Surface, Text, useTheme } from "react-native-paper";

interface Props {
  name: string;
}

export default function FormikDateInput({ name }: Props) {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const theme = useTheme();

  const [field, meta, helpers] = useField<string>(name);

  const fieldValueDate = moment(field.value).toDate();
  const formattedDate = moment(fieldValueDate.getTime()).format("MMMM Do, YYYY");

  const showError = meta.touched && meta.error !== undefined;

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDateTimePicker(false);
    if (event.type !== "set") return;

    if (selectedDate) {
      const dateString = moment(selectedDate.getTime()).format("YYYY-MM-DD");
      helpers.setValue(dateString);
    }
  };

  const datePickerOptions: AndroidNativeProps = {
    value: fieldValueDate,
    onChange: onDateChange,
    mode: "date",
    minimumDate: new Date(),
  };

  const handleDatePickerPress = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open(datePickerOptions);
    } else {
      setShowDateTimePicker(true);
    }
  };

  return (
    <>
      <Surface
        mode="flat"
        style={{
          backgroundColor: theme.colors.surfaceVariant,
          padding: 16,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          borderBottomWidth: showError ? 2.5 : 1,
          borderColor: showError ? theme.colors.error : theme.colors.outline,
          marginBottom: showError ? -10 : undefined,
        }}>
        <TouchableOpacity
          onPress={handleDatePickerPress}
          style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            variant="titleMedium"
            style={{ color: showError ? theme.colors.error : theme.colors.onSurface }}>
            {formattedDate}
          </Text>
          <Ionicons
            size={24}
            name="calendar"
            color={showError ? theme.colors.error : theme.colors.onSurfaceVariant}
          />
        </TouchableOpacity>

        {Platform.OS === "ios" && showDateTimePicker && <DateTimePicker {...datePickerOptions} />}
      </Surface>
      {showError && <HelperText type="error">{meta.error}</HelperText>}
    </>
  );
}
