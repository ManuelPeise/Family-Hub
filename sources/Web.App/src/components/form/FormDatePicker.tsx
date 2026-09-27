import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { deDE, enUS } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import "dayjs/locale/de";
import React from "react";
import { useTranslation } from "react-i18next";

/** Dates are exchanged with the app as ISO dates without time ("YYYY-MM-DD"). */
const isoDateFormat = "YYYY-MM-DD";

const pickerLocaleTexts = {
  de: deDE.components.MuiLocalizationProvider.defaultProps.localeText,
  en: enUS.components.MuiLocalizationProvider.defaultProps.localeText,
};

const toDayjs = (value: string | null): Dayjs | null =>
  value === null ? null : dayjs(value);

const toIsoDate = (value: Dayjs | null): string | null =>
  value?.isValid() ? value.format(isoDateFormat) : null;

interface Props {
  label: string;
  /** ISO date ("YYYY-MM-DD") or null when no date is set. */
  value: string | null;
  /** Receives the ISO date, or null when the field is empty or the input is not a valid date. */
  onChange: (value: string | null) => void;
  /** Shown below the field and marks it as invalid. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const FormDatePicker: React.FC<Props> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "de" ? "de" : "en";

  const [pickerValue, setPickerValue] = React.useState(() => toDayjs(value));
  const [syncedValue, setSyncedValue] = React.useState(value);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setPickerValue(toDayjs(value));
  }

  const handleChange = (next: Dayjs | null): void => {
    const isoDate = toIsoDate(next);
    setPickerValue(next);
    setSyncedValue(isoDate);
    onChange(isoDate);
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={language}
      localeText={pickerLocaleTexts[language]}
    >
      <DatePicker
        label={label}
        value={pickerValue}
        onChange={handleChange}
        disabled={disabled}
        slotProps={{
          textField: {
            variant: "standard",
            fullWidth: true,
            required,
            helperText: error,
            ...(error !== undefined && { error: true }),
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default FormDatePicker;
