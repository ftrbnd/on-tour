import { ImagePickerAsset } from "expo-image-picker";
import { Formik, useFormikContext } from "formik";
import { View } from "react-native";
import { Button } from "react-native-paper";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import FormikTextInput from "./FormInput/FormikTextInput";

import useUpcomingShows from "@/src/hooks/useUpcomingShows";
import { useAuth } from "@/src/providers/AuthProvider";
import { UpcomingShow } from "@/src/services/upcomingShows";

interface FormProps {
  onSubmit: () => void;
  dismissModal: () => void;
}

interface ContainerProps {
  initialValues?: UpcomingShow;
  selectedImage: ImagePickerAsset | null;
  dismissModal: () => void;
}

type NewUpcomingShow = Omit<UpcomingShow, "id" | "userId">;

const initialEmptyValues: NewUpcomingShow = {
  artist: "",
  city: "",
  date: "",
  tour: "",
  venue: "",
};

const validationSchema = z.object({
  artist: z.string().trim().min(1, { message: "Required" }),
  city: z.string().trim().min(1, { message: "Required" }),
  date: z.string().trim().min(1, { message: "Required" }),
  tour: z
    .string()
    .trim()
    .min(1, { message: "If there is no official name, you can enter the venue instead" }),
  venue: z.string().trim().min(1, { message: "Required" }),
});

function Form({ onSubmit, dismissModal }: FormProps) {
  const { dirty, errors, isSubmitting, isValidating } = useFormikContext<NewUpcomingShow>();
  const noErrors = JSON.stringify(errors) === "{}";

  console.log(errors);

  return (
    <>
      <FormikTextInput name="artist" placeholder="Artist" autoCorrect={false} />
      <FormikTextInput name="tour" placeholder="Tour" autoCorrect={false} />
      <FormikTextInput name="venue" placeholder="Venue" autoCorrect={false} />
      <FormikTextInput name="city" placeholder="City" autoCorrect={false} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}>
        <Button mode="outlined" onPress={dismissModal}>
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={onSubmit}
          disabled={!dirty || !noErrors || isSubmitting || isValidating}>
          Save
        </Button>
      </View>
    </>
  );
}

export default function UpcomingShowForm({
  initialValues,
  selectedImage,
  dismissModal,
}: ContainerProps) {
  const { addShow, updateShow } = useUpcomingShows();
  const { user } = useAuth();

  const handleSubmit = async (values: NewUpcomingShow) => {
    if (!user?.id) return;

    try {
      const submission = {
        show: {
          userId: user.id,
          artist: values.artist,
          tour: values.tour,
          venue: values.venue,
          city: values.city,
          date: values.date,
        },
        selectedImage,
      };

      if (initialValues) {
        await updateShow(
          {
            ...submission.show,
            id: initialValues.id,
          },
          submission.selectedImage,
        );
      } else {
        await addShow(submission.show, submission.selectedImage);
      }

      dismissModal();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Formik<NewUpcomingShow>
      initialValues={initialValues ?? initialEmptyValues}
      onSubmit={handleSubmit}
      validationSchema={toFormikValidationSchema(validationSchema)}>
      {({ handleSubmit }) => <Form onSubmit={handleSubmit} dismissModal={dismissModal} />}
    </Formik>
  );
}
