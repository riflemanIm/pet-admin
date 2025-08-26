import React from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tab,
} from "@mui/material";

import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
} from "@mui/icons-material";
import {
  ConfirmationCodeDto,
  EmrRecordDto,
  ListDto,
  NotificationDto,
  OrderDirection,
  SpamDto,
  UserNotificationSettingDto,
  VisitRecordDto,
} from "../../../helpers/dto";
import { useTranslation } from "react-i18next";

import ConfirmationCodesGrid from "./ConfirmationCodesGrid";
import SpamGrid from "./SpamGrid";
import EmrRecordGrid from "./EmrRecordGrid";
import UserNotificationSettingsGrid from "./UserNotificationSettingsGrid";
import VisitGrid from "./VisitGrid";
import NotificationsGrid from "./NotificationsGrid";

interface UserDetailsDialogProps {
  isOpen: boolean;
  userId: number;
  onRequestEmrRecords: (userId: number) => Promise<EmrRecordDto[]>;
  onDeleteEmrRecord: (userId: number, id: number) => Promise<boolean>;
  onRequestVisitRecords: (userId: number) => Promise<VisitRecordDto[]>;
  onSetVisitOutsidePlanning: (
    visitId: number,
    isOutsidePlanning: boolean
  ) => Promise<boolean>;
  onRequestSpam: (userId: number) => Promise<SpamDto[]>;
  onDeleteSpam: (userId: number) => Promise<boolean>;
  onRequestConfirmationCodes: (
    userId: number
  ) => Promise<ConfirmationCodeDto[]>;
  onRequestNotificationSettings: (
    userId: number
  ) => Promise<UserNotificationSettingDto[]>;
  onRequestNotificationList: (
    userId: number,
    useLog?: boolean,
    startIndex?: number,
    count?: number,
    filter?: string,
    orderBy?: string,
    order?: OrderDirection
  ) => Promise<ListDto<NotificationDto>>;
  onClose: () => void;
}

const UserDetailsDialog = ({
  isOpen,
  userId,
  onRequestConfirmationCodes,
  onRequestSpam,
  onRequestEmrRecords,
  onDeleteEmrRecord,
  onRequestVisitRecords,
  onSetVisitOutsidePlanning,
  onRequestNotificationSettings,
  onClose,
  onDeleteSpam,
  onRequestNotificationList,
}: UserDetailsDialogProps): JSX.Element => {
  const { t } = useTranslation();

  const [fullScreen, setFullScreen] = React.useState(false);
  const [tabIndex, setTabIndex] = React.useState("1");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

  const tabHeight = fullScreen ? "calc(100vh - 200px)" : "350px";

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      scroll={"body"}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="alert-dialog-title" sx={{ pr: 0 }}>
        <Box
          justifyContent={"space-between"}
          display="flex"
          alignItems={"flex-start"}
        >
          <Box>{t("USER.DETAILSDIALOG.TITLE")}</Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems={"flex-end"}
            sx={{ pr: 1 }}
          >
            <IconButton
              aria-label="maximize"
              onClick={() => setFullScreen(!fullScreen)}
            >
              <FullscreenIcon />
            </IconButton>
            <IconButton aria-label="close" onClick={() => onClose()}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          pr: 1,
          pl: 1          
        }}
      >
        <TabContext value={tabIndex}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleTabChange}>
              <Tab
                label={t("USER.DETAILSDIALOG.CONFIRMATION_CODES")}
                value="1"
              />
              <Tab label={t("USER.DETAILSDIALOG.SPAM")} value="2" />
              <Tab label={t("USER.DETAILSDIALOG.EMR")} value="3" />
              <Tab label={t("USER.DETAILSDIALOG.VISIT")} value="4" />
              <Tab
                label={t("USER.DETAILSDIALOG.NOTIFICATION_SETTINGS")}
                value="5"
              />
              <Tab label={t("USER.DETAILSDIALOG.NOTIFICATIONS")} value="6" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ pr: 1, pl: 1, pb: 0, height: tabHeight }}>
            <ConfirmationCodesGrid
              userId={userId}
              onRequestConfirmationCodes={onRequestConfirmationCodes}
            />
          </TabPanel>
          <TabPanel value="2" sx={{ pr: 1, pl: 1, height: tabHeight }}>
            <SpamGrid
              userId={userId}
              onRequestSpam={onRequestSpam}
              onDeleteSpam={onDeleteSpam}
            />
          </TabPanel>
          <TabPanel value="3" sx={{ pr: 1, pl: 1, pb: 0, height: tabHeight }}>
            <EmrRecordGrid
              userId={userId}
              onRequestEmrRecords={onRequestEmrRecords}
              onDeleteEmrRecord={onDeleteEmrRecord}
            />
          </TabPanel>
          <TabPanel value="4" sx={{ pr: 1, pl: 1, pb: 0, height: tabHeight }}>
            <VisitGrid
              userId={userId}
              onRequestVisitRecords={onRequestVisitRecords}
              onSetVisitOutsidePlanning={onSetVisitOutsidePlanning}
            />
          </TabPanel>
          <TabPanel value="5" sx={{ pr: 1, pl: 1, pb: 0, height: tabHeight }}>
            <UserNotificationSettingsGrid
              userId={userId}
              onRequestNotificationSettings={onRequestNotificationSettings}
            />
          </TabPanel>
          <TabPanel value="6" sx={{ pr: 1, pl: 1, pb: 0, height: tabHeight }}>
            <NotificationsGrid
              userId={userId}
              onRequestData={onRequestNotificationList}
            />
          </TabPanel>
        </TabContext>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()}>{t("COMMON.CLOSE")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsDialog;
