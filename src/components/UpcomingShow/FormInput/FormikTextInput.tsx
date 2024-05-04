import { Input, InputProps, Text } from "@ui-kitten/components";
import { useField } from "formik";

interface FormikTextInputProps extends InputProps {
  name: string;
  placeholder: string;
}

export default function FormikTextInput({ name, placeholder, ...props }: FormikTextInputProps) {
  const [field, meta, helpers] = useField<string>(name);
  const showError = meta.touched && meta.error !== undefined;

  return (
    <>
      <Input
        value={field.value}
        label={name.replace(name[0], name[0].toUpperCase())}
        placeholder={placeholder}
        onChangeText={(value) => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        status={showError ? "danger" : "basic"}
        multiline
        style={{ marginBottom: showError ? -10 : undefined }}
        {...props}
      />
      {showError && (
        <Text category="label" status="danger">
          {meta.error}
        </Text>
      )}
    </>
  );
}
