import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  widgetWrapper: {
    display: "flex",
    minHeight: "100%",
  },
  inheritHeight: {
    minHeight: "auto",
  },
  widgetHeader: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20
  },
  widgetRoot: {
    boxShadow: theme.customShadows.widget,
  },
  widgetBody: {
    paddingBottom: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
  },
  noPadding: {
    padding: 0,
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden",
  },
  moreButton: {
    margin: -theme.spacing(1),
    padding: 0,
    width: 40,
    height: 40,
    color: theme.palette.text.hint,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: "rgba(255, 255, 255, 0.35)",
    },
  },
  paddingTop: {
    paddingTop: theme.spacing(3),
  },
  searchIcon: {
    color: "rgba(0, 0, 0, 0.23)",
  },
  textField: {},
}));
