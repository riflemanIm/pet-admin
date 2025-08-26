import React from "react";
import { UserNotificationSettingDto } from "../../../helpers/dto";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  getEnumName,
  listEnums,
  NotificationRecordType,
  notificationRecordTypeNames,
  NotificationType,
} from "../../../helpers/enums";
import { getGridLocaleText } from "../../../helpers/grid";
import { useLanguageValue } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import DateFnsAdapter from "@date-io/date-fns";

interface UserNotificationSettingsGridProps {
  userId: number;
  onRequestNotificationSettings: (
    userId: number
  ) => Promise<UserNotificationSettingDto[]>;
}

const UserNotificationSettingsGrid = ({
  userId,
  onRequestNotificationSettings,
}: UserNotificationSettingsGridProps) => {
  const { languageState } = useLanguageValue();
  const { t } = useTranslation();
  const dateFns = new DateFnsAdapter();

  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<UserNotificationSettingDto[]>([]);

  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    onRequestNotificationSettings(userId as number)
      .then((result) => {
        setRows(result);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const columns: GridColDef[] = React.useMemo(
    () => [
      {
        field: "userNotificationId",
        align: "right",
        headerName:
          t("USER_NOTIFICATION_SETTINGS.FIELDS.userNotificationId") ?? "",
        type: "number",
        width: 80,
      },
      {
        field: "recordType",
        align: "left",
        headerName: t("USER_NOTIFICATION_SETTINGS.FIELDS.recordType") ?? "",
        width: 240,
        type: "singleSelect",
        valueOptions: notificationRecordTypeNames(
          t,
          "ENUMS.NotificationRecordType"
        ),
        valueFormatter: (value: string) =>
          getEnumName(
            NotificationRecordType,
            value,
            t,
            "ENUMS.NotificationRecordType"
          ),
      },
      {
        field: "notificationType",
        align: "left",
        headerName:
          t("USER_NOTIFICATION_SETTINGS.FIELDS.notificationType") ?? "",
        width: 240,
        type: "singleSelect",
        valueOptions:
          listEnums(NotificationType, t, "ENUMS.NotificationType") ?? "",
        valueFormatter: (value: string) =>
          getEnumName(NotificationType, value, t, "ENUMS.NotificationType"),
      },
      {
        field: "isEnabled",
        align: "center",
        headerName: t("USER_NOTIFICATION_SETTINGS.FIELDS.isEnabled") ?? "",
        width: 120,
        type: "boolean",
      },
      {
        field: "modifyDate",
        align: "right",
        headerName: t("USER_NOTIFICATION_SETTINGS.FIELDS.modifyDate") ?? "",
        width: 150,
        type: "dateTime",
        valueFormatter: (value: string) =>
          value
            ? dateFns.formatByString(new Date(value), "dd.MM.yyyy HH:mm")
            : "",
      },
    ],
    [languageState.language]
  );
  return (
    <DataGrid
      loading={loading}
      rows={rows}
      columns={columns}
      getRowId={(row: UserNotificationSettingDto) =>
        row.userNotificationId as number
      }
      getRowHeight={() => "auto"}
      localeText={getGridLocaleText(languageState.language)}
      hideFooter
    />
  );
};

export default UserNotificationSettingsGrid;
