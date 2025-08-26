import React from "react";
import { Paper, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";

export default function Error(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.logotype}>
        <img className={classes.logotypeIcon} src={logo} alt="logo" />
        <Typography variant="h3" className={classes.logotypeText}>
          Mobiapp Admin
        </Typography>
      </div>
      <Paper classes={{ root: classes.paperRoot }}>
        <Typography
          variant="h1"
          color="primary"
          className={classnames(classes.textRow, classes.errorCode)}
        >
          404
        </Typography>
        <Typography variant="h5" color="primary" className={classes.textRow}>
          Ой. Кажется страница больше не существует
        </Typography>
        <Typography
          variant="h6"
          color="textPrimary"
          className={classnames(classes.textRow, classes.safetyText)}
        >
          Не расстраивайтесь, выход есть!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          size="large"
          className={classes.backButton}
        >
          Назад домой
        </Button>
      </Paper>
    </div>
  );
}
