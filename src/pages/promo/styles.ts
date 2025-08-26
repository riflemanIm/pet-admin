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
  notificationComponent: {},
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
    overflow: "hidden",
    borderRadius: 4,
    boxShadow: "0 0 5px 0px #ccc",
    maxWidth: "100%",
    position: "relative",
    width: 610,
    height: 222,
  },
  imgWrapMob: {
    overflow: "hidden",
    borderRadius: 4,
    boxShadow: "0 0 5px 0px #ccc",
    maxWidth: "100%",
    position: "relative",
    width: 343,
    height: 192,
  },
  images: {
    backgroundColor: "#f4f4f4",
    padding: 20,
    borderRadius: 4,
  },

  galleryWrap: {
    display: "block",
    margin: "20px 0",
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
    cursor: "pointer",
    lineHeight: 0.5,
  },
  img: {
    display: "block",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    width: "100%",
    objectFit: "cover",
  },
}));
