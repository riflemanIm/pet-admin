import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

export default makeStyles((theme: Theme) => ({
  icon: {
    flexDirection: "row",
    alignItems: "flex-start",
    "& .MuiSvgIcon-root": {
      marginRight: 5,
    },
  },
  stepCompleted: {
    root: {
      color: "green",
    },
  },
  layoutContainer: {
    height: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(2),
    border: "1px dashed",
    borderColor: theme.palette.primary.main,
    position: "relative",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: theme.spacing(2),
  },
  notificationCallButton: {
    color: "white",
    marginBottom: theme.spacing(1),
    textTransform: "none",
  },
  codeContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(2),
  },
  codeComponent: {
    flexGrow: 1,
  },
  notificationItem: {
    marginTop: theme.spacing(2),
  },
  notificationCloseButton: {
    position: "absolute",
    right: theme.spacing(2),
  },
  progress: {
    visibility: "hidden",
  },
  notification: {
    display: "flex",
    alignItems: "center",
    background: "transparent",
    boxShadow: "none",
    overflow: "visible",
  },
  searchIcon: {
    color: "rgba(0, 0, 0, 0.23)",
  },
  imgWrap: {
    height: 100,
    overflow: "hidden",
    borderRadius: 8,
    boxShadow: "0 0 10px 0px #ccc",
    marginRight: 20,
    marginBottom: 20,
    maxWidth: 125,
    position: "relative",
  },
  galleryWrap: {
    display: "flex",
  },
  uploadLabel: {
    backgroundColor: theme.palette.primary.main,
    color: "#f4f4f4",
    maxWidth: 220,
    display: "inline-block",
    borderRadius: 8,
    textAlign: "center",
    padding: "8px 12px",
    margin: "20px 0",
  },
  deleteImageX: {
    fontSize: 20,
    position: "absolute",
    top: 5,
    left: 5,
    cursor: "pointer",
    lineHeight: 0.5,
  },
  notificationComponent: {},
}));
