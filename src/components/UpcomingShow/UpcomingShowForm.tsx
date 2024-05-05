import { Button } from "@ui-kitten/components";
import { ImagePickerAsset } from "expo-image-picker";
import { Formik, useFormikContext } from "formik";
import moment from "moment";
import { useMemo } from "react";
import { View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import FormikDateInput from "./FormInput/FormikDateInput";
import FormikTextInput from "./FormInput/FormikTextInput";

import useUpcomingShows from "@/src/hooks/useUpcomingShows";
import { useAuth } from "@/src/providers/AuthProvider";
import { UpcomingShow } from "@/src/services/upcomingShows";

interface FormProps {
  onSubmit: () => void;
}

interface ContainerProps {
  initialValues?: UpcomingShow;
  selectedImage: ImagePickerAsset | null;
}

type NewUpcomingShow = Omit<UpcomingShow, "id" | "userId">;

const validationSchema = z.object({
  artist: z.string().trim().min(1, { message: "Required" }),
  city: z.string().trim().min(1, { message: "Required" }),
  date: z.string().trim().date(),
  tour: z
    .string()
    .trim()
    .min(1, { message: "If there is no official name, you can enter the venue instead" }),
  venue: z.string().trim().min(1, { message: "Required" }),
});

function Form({ onSubmit }: FormProps) {
  const { dirty, errors, isSubmitting, isValidating } = useFormikContext<NewUpcomingShow>();
  const noErrors = JSON.stringify(errors) === "{}";

  return (
    <>
      <FormikTextInput name="artist" placeholder="Artist" autoCorrect={false} />
      <FormikTextInput name="tour" placeholder="Tour" autoCorrect={false} />
      <FormikTextInput name="venue" placeholder="Venue" autoCorrect={false} />
      <FormikTextInput name="city" placeholder="City" autoCorrect={false} />
      <FormikDateInput name="date" />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}>
        <Button
          appearance="filled"
          onPress={onSubmit}
          disabled={!dirty || !noErrors || isSubmitting || isValidating}>
          Save
        </Button>
      </View>
    </>
  );
}

export default function UpcomingShowForm({ initialValues, selectedImage }: ContainerProps) {
  const { addShow, updateShow } = useUpcomingShows();
  const { user } = useAuth();

  const today = new Date();
  const initialEmptyValues: NewUpcomingShow = useMemo(() => {
    return {
      artist: "",
      city: "",
      date: moment(today).format("YYYY-MM-DD"),
      tour: "",
      venue: "",
    };
  }, [today]);

  const handleSubmit = async (values: NewUpcomingShow) => {
    if (!user?.id) return;

    try {
      const submission = {
        show: {
          ...values,
          userId: user.id,
        },
        selectedImage,
      };

      await SheetManager.hide("upcoming-show-sheet");

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
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Formik<NewUpcomingShow>
      initialValues={initialValues ?? initialEmptyValues}
      onSubmit={handleSubmit}
      validationSchema={toFormikValidationSchema(validationSchema)}>
      {({ handleSubmit }) => <Form onSubmit={handleSubmit} />}
    </Formik>
  );
}
