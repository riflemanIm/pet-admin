import React, { useState, useEffect } from "react";

import {
  CircularProgress,
  Fade,
  TextField as Input,
  Button,
  Typography,
  Avatar,
} from "@mui/material";

import { LockOutlined as LockIcon } from "@mui/icons-material";

// styles
import useStyles from "./styles";

// context
import { useUserDispatch, loginUser } from "../../context/UserContext";

//form func
import useForm from "../../hooks/useForm";
import validate from "./validationLogin";
import config from "../../config";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

function Login(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorServer, setErrorServer] = useState<string>("");
  // global
  const userDispatch = useUserDispatch();

  useEffect(() => {
    setValues({
      login: config.auth.email,
      password: config.auth.password,
    });
  }, []);

  const login = () => {
    loginUser(
      userDispatch,
      values.login,
      values.password,
      setIsLoading,
      setErrorServer,
      navigate
    );
  };

  const { values, errors, handleChange, handleSubmit, setValues } = useForm(
    login,
    validate
  );

  return (
    <React.Fragment>
      <Header navigate={navigate} hasSideBar={false} />
      <div className={classes.container}>
        <div className={classes.customFormContainer}>
          <div className={classes.form}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <LockIcon />
            </Avatar>
            <Typography variant="h5" className={classes.greeting}>
              {t("SIGN.SIGN")}
            </Typography>
            <Fade
              in={!!errorServer}
              style={
                !errorServer ? { display: "none" } : { display: "inline-block" }
              }
            >
              <Typography color="error" className={classes.errorMessage}>
                {errorServer}
              </Typography>
            </Fade>

            <Input
              name="login"
              value={values.login || ""}
              onChange={handleChange}
              margin="normal"
              placeholder={t("SIGN.UP_EMPTY_EMAIL_OR_PHONE") ?? ""}
              fullWidth
              required
              error={errors?.email != null}
              helperText={errors?.email != null && errors?.email}
            />
            <Input
              name="password"
              value={values.password || ""}
              onChange={handleChange}
              margin="normal"
              placeholder={t("SIGN.UP_EMPTY_PASS") ?? ""}
              type="password"
              fullWidth
              required
              error={errors?.password != null}
              helperText={errors?.password != null && errors?.password}
            />
            <div className={classes.formButtons}>
              {isLoading ? (
                <CircularProgress size={26} className={classes.loginLoader} />
              ) : (
                <Button
                  disabled={!values.login || !values.password}
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                >
                  {t("SIGN.IN_BUTTON")}
                </Button>
              )}
            </div>
          </div>
          <Typography color="primary" className={classes.copyright}>
            {t("BOTTOM.COPY")}
          </Typography>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Login;
