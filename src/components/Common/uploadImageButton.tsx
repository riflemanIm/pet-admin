import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { resizeImageBase64 } from "../../helpers/base64";

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    flexDirection: "row",
    alignItems: "flex-start",
    "& .MuiSvgIcon-root": {
      marginRight: 5,
    },
  },
  imgWrap: {
    height: 100,
    overflow: "hidden",
    borderRadius: 8,
    boxShadow: "0 0 10px 0px #ccc",
    marginRight: 20,
    marginBottom: 20,    
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
}));

interface UploadImageButtonProps {
  accept: "image/png" | "image/jpeg" | "image/png,image/jpeg";
  icon?: string;

  maxWidth: number;
  maxHeight: number;

  onChange: (newValue: string) => void;
  onDelete: () => void;
}

const UploadImageButton = (props: UploadImageButtonProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const fileInput = React.useRef<HTMLInputElement | null>(null);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    const filedata = event.target.files[0];
    const base64result = await resizeImageBase64(
      filedata,
      props.maxWidth,
      props.maxHeight
    );
    const result = base64result.split(",")[1];
    props.onChange(result);
  };

  const exensions = props.accept.split(",").map((it) => {
    if (it === "image/png") return ".PNG";
    if (it === "image/jpeg") return ".JPG .JPEG";
  });

  React.useEffect(() => {
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  }, [props.icon]);

  return (
    <Box sx={{ width: "100%" }}>
      {props.icon && (
        <div className={classes.galleryWrap}>
          <div className={classes.imgWrap}>
            <span
              className={classes.deleteImageX}
              onClick={() => props.onDelete()}
              role="button"
            >
              ×
            </span>
            <img
              src={`data:image/png;base64,${props.icon}`}
              alt=""
              height={"100%"}
            />
          </div>
        </div>
      )}
      <label className={classes.uploadLabel} style={{ cursor: "pointer" }}>
        {t("COMMON.CHOOSEFILE")}
        <input
          style={{ display: "none" }}
          accept={props.accept}
          type="file"
          ref={fileInput}
          onChange={handleFile}
        />
      </label>
      <Typography variant="subtitle2" style={{ marginBottom: 35 }}>
        {exensions.join(" ")}
      </Typography>
    </Box>
  );
};

export default UploadImageButton;
