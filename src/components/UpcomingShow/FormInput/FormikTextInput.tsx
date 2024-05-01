import { useField } from "formik";
import { TextInput, TextInputProps, HelperText } from "react-native-paper";

interface FormikTextInputProps extends TextInputProps {
  name: string;
  placeholder: string;
}

export default function FormikTextInput({ name, placeholder, ...props }: FormikTextInputProps) {
  const [field, meta, helpers] = useField<string>(name);
  const showError = meta.touched && meta.error !== undefined;

  return (
    <>
      <TextInput
        label={name.replace(name[0], name[0].toUpperCase())}
        onChangeText={(value) => helpers.setValue(value)}
        onBlur={() => helpers.setTouched(true)}
        value={field.value}
        placeholder={placeholder}
        error={showError}
        multiline
        style={{ marginBottom: showError ? -10 : undefined }}
        {...props}
      />
      {showError && <HelperText type="error">{meta.error}</HelperText>}
    </>
  );
}
