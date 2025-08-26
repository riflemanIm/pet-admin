import React, { useEffect } from "react";
import { useParams } from "react-router";

import { TextField } from "@mui/material";

import {
  useClinicDispatch,
  useClinicState,
  actions,
} from "../../context/ClinicContext";
import { useTranslation } from "react-i18next";
import useInterval from "../../hooks/useInterval";
import { ServiceTaskItem } from "../../helpers/dto";

const CheckClinic = (): JSX.Element => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useClinicDispatch();
  const { tasks, errorMessage } = useClinicState();
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [task, setTask] = React.useState<ServiceTaskItem>();

  useEffect(() => {
    if (id) {
      actions
        .doCheck(Number(id))(dispatch)
        .then(() => {
          setTask(tasks.find((task) => task.name === id));
        });
    }
  }, [id]);

  useInterval(
    () => {
      if (!task) {
        setTask(tasks.find((task) => task.name === id));
      }
      if (task?.state?.status === "running") {
        actions.doCheckState(Number(id))(dispatch);
      }
      if (inputRef.current) {
        inputRef.current.scrollTop = inputRef.current.scrollHeight;
      }
    },
    true,
    1000
  );

  return (
    <TextField
      variant="outlined"
      value={task?.state?.messages?.join("\r\n") || errorMessage || ""}
      name="checkResult"
      label={t("CLINIC.CHECK")}
      multiline
      minRows={24}
      maxRows={24}
      type="text"
      fullWidth
      disabled
      inputRef={inputRef}
    />
  );
};
export default CheckClinic;
