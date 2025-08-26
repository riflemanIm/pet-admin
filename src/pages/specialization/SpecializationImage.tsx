import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { resizeImageBase64 } from "../../helpers/base64";
import { SpecializationDto } from "../../helpers/dto";
import { useTranslation } from "react-i18next";

interface SpecializationImageProps {
  id: string;
  value: string | null;
  onChange: (value: string | null) => void;
  title: string;
}

const SpecializationImage = ({
  id,
  value,
  onChange,
  title,
}: SpecializationImageProps): JSX.Element => {
  const { t } = useTranslation();
  const deleteFile = () => {
    onChange(null);
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files) return;
    const filedata = event.target.files[0];
    const base64result = await resizeImageBase64(filedata, 278, 148);
    const image = base64result.split(",")[1].trim();

    onChange(image);
  };

  return (
    <Card>
      <CardHeader title={title} />
      <CardMedia>
        <img
          src={`data:image/jpeg;base64,${value ?? ""}`}
          alt=""
          height={"100%"}
        />
      </CardMedia>
      <CardContent>
        <Typography variant="subtitle2">
          Разрешение и вес картинки может быть любым.
          <br />
          Формат: <strong>.jpg, .png</strong>
          <br /> Картинка сожмется до
          <br /> maxWidth: <strong>278px</strong>, <br />
          maxHeight: <strong>148px</strong> пропорционально
        </Typography>
      </CardContent>
      <CardActions>
        <input
          style={{ display: "none" }}
          accept="image/jpeg"
          type="file"
          id={`button-${id}`}
          onChange={handleFile}
        />
        <label htmlFor={`button-${id}`}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            component="span"
          >
            {t("COMMON.CHOOSEFILE")}
          </Button>
        </label>
        <Box sx={{ mx: "auto" }} />
        <Button variant="contained" size="small" onClick={() => deleteFile()}>
          Удалить
        </Button>
      </CardActions>
    </Card>
  );
};

export default SpecializationImage;
