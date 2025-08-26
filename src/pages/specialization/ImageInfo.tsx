import React from "react";
import { Card, CardActions, CardMedia, Typography } from "@mui/material";

interface ImageInfoProps {
  content: string;
}

interface ImageData {
  height: number;
  width: number;
}

const ImageInfo = ({ content }: ImageInfoProps): JSX.Element => {
  const [imageData, setImageData] = React.useState<ImageData>({
    height: 0,
    width: 0,
  });

  const imageOnLoadHandler = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setImageData({
      width: event.currentTarget.naturalWidth,
      height: event.currentTarget.naturalHeight,
    });
  };

  return (
    <Card style={{ borderRadius: 0 }}>
      <CardMedia
        component="img"
        image={`data:image/jpeg;base64, ${content}`}
        loading="lazy"
        onLoad={imageOnLoadHandler}
        style={{ maxWidth: "260px" }}
      />
      <CardActions disableSpacing>
        <Typography
          variant="body2"
          color="text.secondary"
        >{`Размер: ${imageData.width} x ${imageData.height}`}</Typography>
      </CardActions>
    </Card>
  );
};

export default ImageInfo;
