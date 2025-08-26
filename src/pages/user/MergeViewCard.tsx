import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { MergePatientInfoDto } from "../../helpers/dto";
import dayjs from "dayjs";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Switch,
  Typography,
} from "@mui/material";

import {
  AlternateEmail as AlternateEmailIcon,
  Face as FaceIcon,
  Key as KeyIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

interface PatientViewCardProps {
  prefix: string;
  copyFields?: string[];
  onCopyFieldsChange?: (newCopyFields: string[]) => void;
  user: MergePatientInfoDto;
}

const getFullName = (user: MergePatientInfoDto): string => {
  const parts = [];
  if (user.lastName) {
    parts.push(user.lastName);
  }
  if (user.firstName) {
    parts.push(user.firstName);
  }
  if (user.middleName) {
    parts.push(user.middleName);
  }
  return parts.join(" ");
};

const RowItem = (props: {
  id: string;
  label: string;
  value: string;
  icon?: JSX.Element;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (id: string, newValue: boolean) => void;
}) => {
  return (
    <ListItem>
      {props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}
      <ListItemText
        id={`switch-list-label-${props.id}`}
        primary={props.label}
        secondary={props.value || " "}
      />
      {props.onChange && (
        <Switch
          edge="end"
          checked={props.checked || false}
          onChange={(e, newChecked) =>
            props.onChange && props.onChange(props.id, newChecked)
          }
          disabled={props.disabled || false}
          inputProps={{
            "aria-labelledby": `switch-list-label-${props.id}`,
          }}
        />
      )}
    </ListItem>
  );
};

export default function MergeViewCard(props: PatientViewCardProps) {
  const onChange = (id: string, newVal: boolean) => {
    const newChecks = [...props.copyFields || []];
    if (newVal) {
      newChecks.push(id);
    } else {
      newChecks.splice(newChecks.indexOf(id), 1);
    }
    if (props.onCopyFieldsChange) props.onCopyFieldsChange(newChecks);
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar
            aria-label="user avatar"
            alt={getFullName(props.user)}
            src={
              props.user.photo
                ? `data:image/jpeg;base64,${props.user.photo}`
                : ""
            }
          />
        }
        title={`${props.prefix}: ${getFullName(props.user)}`}
        subheader={`ID: ${props.user.userId}, MMK: ${
          props.user.mmk ?? "-"
        }, Дата рождения: ${
          props.user.birthDate
            ? dayjs(props.user.birthDate).format("DD.MM.YYYY")
            : "-"
        }`}
      />
      <CardContent>
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          subheader={<ListSubheader>Свойства</ListSubheader>}
        >
          <RowItem
            id="email"
            label="Email"
            value={props.user.email || "-"}
            checked={props.copyFields?.includes("email")}
            onChange={props.onCopyFieldsChange && onChange}
            disabled={!props.user.email}
            icon={<AlternateEmailIcon />}
          />
          <RowItem
            id="phone"
            label="Телефон"
            value={props.user.phone || "-"}
            checked={props.copyFields?.includes("phone")}
            onChange={props.onCopyFieldsChange && onChange}
            disabled={!props.user.phone}
            icon={<PhoneIcon />}
          />
          <RowItem
            id="password"
            label={"Пароль"}
            value={""}
            disabled={!props.user.hasPassword}
            checked={props.copyFields?.includes("password")}
            onChange={props.onCopyFieldsChange && onChange}
            icon={<KeyIcon />}
          />
          <RowItem
            id="photo"
            label={"Фото"}
            value={""}
            disabled={!props.user.photo}
            checked={props.copyFields?.includes("photo")}
            onChange={props.onCopyFieldsChange && onChange}
            icon={<FaceIcon />}
          />
        </List>
        <Typography variant="subtitle2" gutterBottom>
          Метрики
        </Typography>
        <Typography variant="body2" gutterBottom>
          Визитов: {props.user.visitCount} Чатов: {props.user.chatCount}{" "}
          Отзывов: {props.user.reviewCount}
        </Typography>
      </CardContent>
    </Card>
  );
}
