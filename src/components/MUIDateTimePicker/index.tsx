import React, { FC } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
import "dayjs/locale/ru";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { useLanguageValue } from "../../context/LanguageContext";
import { mask } from "../../helpers/dateFormat";

interface MuiUIPickerProps {
  value?: Date | string | null;
  handleChange: (value: Date | string | null) => void;
  label?: string | null;
  disablePast?: boolean;
  disabled?: boolean;
  required?: boolean;
  errorText?: string | null;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  defaultCalendarMonth?: Dayjs;
  margin?: "normal" | "dense" | "none" | undefined;
  preventKeyDown?: boolean;
  fullWidth?: boolean;
  variant?: "outlined" | "standard" | "filled";
  mx?: boolean;
}

const MuiUIDatetimePicker: FC<MuiUIPickerProps> = ({
  value,
  handleChange,
  label,

  disablePast,
  disabled,
  errorText,
  // minDate,
  // maxDate,
  // defaultCalendarMonth,
  required,
  margin = "normal",
  preventKeyDown = false,
  fullWidth = true,
  variant = "outlined",
  mx = false,
}) => {
  const {
    languageState: { language },
  } = useLanguageValue();

  const format =
    language === "ru" ? "DD.MM.YYYY HH:mm:ss" : "MM/DD/YYYY HH:mm:ss";

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
      <DesktopDateTimePicker
        disablePast={disablePast}
        disabled={disabled}
        label={label}
        format={format}
        value={value ? dayjs(value) : null}
        onChange={(value: Dayjs | null) =>
          handleChange(value ? value.toDate() : null)
        }
        // minDate={minDate}
        // maxDate={maxDate}
        // defaultCalendarMonth={defaultCalendarMonth}
        slotProps={{
          desktopPaper: {
            sx: (theme) => ({
              "& .MuiPickersDay-root": {
                "&.Mui-selected": {
                  backgroundColor: `${theme.palette.primary.main} !important`,
                },
                "&.Mui-selected:hover": {
                  backgroundColor: `${theme.palette.primary.light} !important`,
                },
              },
            }),
          },
          textField: {
            name: "date-picker",
            fullWidth,
            margin,
            onKeyDown: (e) => {
              if (preventKeyDown) e.preventDefault();
            },
            error: errorText != null,
            helperText: errorText != null && errorText,
            required,
            variant,
            sx: { mx: mx ? 3 : 0 },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default MuiUIDatetimePicker;
