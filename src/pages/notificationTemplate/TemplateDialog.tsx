import React from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import JSONEditor from "../../components/JSONEditor";
import { Content, Mode } from "vanilla-jsoneditor";
import { NotificationUtils } from "../../helpers/notificationUtils";
import { NotificationRecordType } from "../../helpers/enums";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const examples: Partial<{ [key in NotificationRecordType]: any }> = {
  [NotificationRecordType.Confirmation]: {
    workspaceId: 1,
    websiteURL: "http://...",
    confirmationCode: 12345,
    lifeTimeSecconds: 300,
    lifeTimeMinutes: 5,
    confirmationToken: "token...",
    confirmationTokenDisplayStyle: "",
    confirmYourAction: "подтвердите Вашу регистрацию",
    madeAction: "зарегистрировались",
    confirmAction: "Подтвердить регистрацию",
  },
  [NotificationRecordType.PasswordChange]: {
    workspaceId: 1,
    websiteURL: "http://...",
  },
  [NotificationRecordType.Visit]: {
    workspaceId: 1,
    websiteURL: "http://...",
    clinicId: 179,
    clinicTitle: "Филиал Петровка",
    clinicEmail: "clinic@postmodern.ru",
    filialAddress: "г. Москва, Товарищеский переулок, 6",
    cabinet: "-",
    medecinsId: 14523,
    planningId: 1670,
    date: "03.09.2024",
    dateTime: "03.09.2024 11:30",
    dateTimeAsDateTime: new Date("2024-09-03T11:30:00+03:00"),
    medecinsSpec: "Кардиолог",
    medecinsName: "Иванов П.С.",
    medecinsFull: "Кардиолог, Иванов П.С.",
    isNew: true,
    isCancelled: false,
    duration: 30,
    patientFio: "Саянов Владимир Николаевич",
    doctorPhotoUrl: "http://...",
  },
  [NotificationRecordType.GrantMmkAccess]: {
    workspaceId: 1,
    websiteURL: "http://...",
    clinicId: 179,
    clinicTitle: "Филиал Петровка",
    fio: "Иванов Петр Сидорович",
    login: "ivanov.petr@mail.ru",
    password: "SomePas$word!",
    passwordType: "Одноразовый пароль",
    passwordChangeReminder: "Не забудьте сменить пароль после первого входа.",
    passwordDisplayStyle: "",
  },
  [NotificationRecordType.Mmk]: {
    workspaceId: 1,
    websiteURL: "http://...",
    clinicId: 179,
    clinicTitle: "Филиал Петровка",
    clinicEmail: "clinic@postmodern.ru",
    filialAddress: "г. Москва, Товарищеский переулок, 6",
    date: "03.09.2024",
    dateTime: "03.09.2024 11:30",
    dateTimeAsDateTime: new Date("2024-09-03T11:30:00+03:00"),
    description:
      "Телемедицинская консультация (Телемедицинская консультация) - Иванов П.С.",
    doctorPhotoUrl: "clinic/doctorsPhoto?doctorId=222523&clinicId=179",
    groupCode: "CONS",
    groupName: "Консультации",
    isApproved: true,
    medecinsFull: "Кардиолог, Иванов П.С.",
    medecinsId: 14523,
    medecinsName: "Иванов П.С.",
    medecinsSpec: "Кардиолог",
    modelName: "Телемедицинская консультаци",
    planningId: 1670,
    recordId: 26313471,
    specialization: "Кардиолог",
  },
  [NotificationRecordType.External]: {
    workspaceId: 1,
    websiteURL: "http://...",
    clinicId: 179,
    clinicTitle: "Филиал Петровка",
    fio: "Иванов Петр Сидорович",
    header: 'Уникальное предложение для вас!',
    body: 'Специальная акция. Скидка 10% на первую покупку в медицинской сети. Скидка действует до конца года. [Подробности тут](#/promo/123)!'
  },
};

interface TemplateDialogProps {
  isOpen: boolean;
  recordType?: NotificationRecordType;
  template?: string;
  onClose: () => void;
}

const TemplateDialog = ({
  isOpen,
  recordType,
  template,
  onClose,
}: TemplateDialogProps): JSX.Element => {
  const { t } = useTranslation();

  const [text, setText] = React.useState("{}");
  const [html, setHtml] = React.useState(template || "");

  React.useEffect(() => {
    if (recordType) {
      setText(JSON.stringify(examples[recordType] ?? {}, undefined, 2));
    }
  }, [recordType]);

  React.useEffect(() => {
    try {
      const variables = JSON.parse(text);
      NotificationUtils.getNotifyText(template || "", variables).then(
        (result: string) => setHtml(result)
      );
    } catch {
      setHtml(template || "");
    }
  }, [template, text]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      scroll={"body"}
      maxWidth="lg"
      fullWidth
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        <span>{t("NOTIFICATIONTEMPLATE.TITLE")}</span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <Item sx={{ width: "50%" }}>
            <JSONEditor
              label={t("NOTIFICATIONTEMPLATE.VARIABLES")}
              content={{
                text,
              }}
              statusBar={false}
              mainMenuBar={false}
              navigationBar={false}
              mode={Mode.text}
              style={{ height: "768px" }}
              boxStyle={{ height: "768px" }}
              onChange={(content: Content) => {
                if ("text" in content) {
                  setText(content.text);
                } else if ("json" in content) {
                  setText(JSON.stringify(content.json));
                }
              }}
            />
          </Item>
          <Item sx={{ width: "50%" }}>
            <iframe
              title="template"
              srcDoc={html}
              width={"100%"}
              height={"100%"}
              style={{ border: 0 }}
            />
          </Item>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDialog;
