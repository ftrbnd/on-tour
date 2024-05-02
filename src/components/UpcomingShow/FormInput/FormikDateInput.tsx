import { Datepicker, Text } from "@ui-kitten/components";
import { useField } from "formik";
import moment from "moment";

interface Props {
  name: string;
}

export default function FormikDateInput({ name }: Props) {
  const [field, meta, helpers] = useField<string>(name);
  const fieldValueDate = moment(field.value).toDate();
  const formattedDate = moment(fieldValueDate.getTime()).format("MMMM Do, YYYY");

  const showError = meta.touched && meta.error !== undefined;
  const today = new Date();

  const handleSelect = (selectedDate: Date) => {
    const dateString = moment(selectedDate.getTime()).format("YYYY-MM-DD");
    helpers.setValue(dateString);
  };

  return (
    <>
      <Datepicker
        // date={fieldValueDate}
        min={today}
        label="Date"
        placeholder={formattedDate}
        onSelect={handleSelect}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        status={showError ? "danger" : "basic"}
      />
      {showError && (
        <Text category="label" status="danger">
          {meta.error}
        </Text>
      )}
    </>
  );
}
