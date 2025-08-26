import React from 'react';
import { Grid2, Card, CardActionArea, CardActions, CardMedia, IconButton, Button, Box } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import Widget from '../../components/Widget';

import ImageUploading, { ImageListType } from 'react-images-uploading';
import { ClinicImageDto } from '../../helpers/dto';
import { useTranslation } from 'react-i18next';

interface GalleryProps {
  imgs: ClinicImageDto[];
  addImages: (data: ClinicImageDto[]) => void;
  removeImage: (clinicImageId: number) => void;
  clinicId: number;
}

const imageDataPrefix = 'data:image/jpeg;base64,';

const removeImageDataPrefix = (image: string): string => {
  return image.startsWith(imageDataPrefix) ? image.slice(imageDataPrefix.length) : image;
};

const Gallery = ({ imgs, addImages, removeImage, clinicId }: GalleryProps): JSX.Element => {
  const { t } = useTranslation();
  const [images, setImages] = React.useState(imgs);
  const maxNumber = 69;

  const onChange = (imageList: ImageListType, addUpdateIndex?: number[]) => {
    // data for submit
    if (addUpdateIndex != null) {
      let clinicImageId = imageList[addUpdateIndex[0] - 1]?.clinicImageId ?? 0;

      const newImages = imageList.slice(addUpdateIndex[0]).map((it) => {
        clinicImageId++;
        return {
          clinicId,
          clinicImageId,
          image: removeImageDataPrefix(it.image),
          sortOrder: 1
        };
      });
      console.log('newImages', [...images, ...newImages]);

      addImages(newImages);
      setImages([...images, ...newImages]);
    }
  };

  return (
    <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber} acceptType={['jpg', 'jpeg']} dataURLKey="image">
      {({ imageList, onImageUpload, onImageRemove, isDragging, dragProps }) => (
        <Grid2 container spacing={3}>
          <Grid2 size={12}>
            <Widget>
              <Box display="flex" justifyContent={'center'} style={isDragging ? { color: 'red' } : undefined}>
                <Button onClick={onImageUpload} {...dragProps} style={{ width: '100%', height: '100%' }}>
                  {t('COMMON.UPLOADZONE')}
                </Button>
              </Box>
            </Widget>
          </Grid2>

          {imageList.map((c, inx) => (
            <Grid2 size={{ md: 3, xs: 12 }} key={inx}>
              <Card>
                <CardActionArea>
                  <CardMedia image={`${imageDataPrefix}${c.image}`} title="Gallery" style={{ height: 200 }} />
                </CardActionArea>
                <CardActions>
                  <IconButton
                    aria-label="remove-img"
                    onClick={() => {
                      onImageRemove(inx);
                      removeImage(c.clinicImageId);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
    </ImageUploading>
  );
};

export default Gallery;
