import React from 'react';
import {
  Grid2,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  IconButton,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';
import Widget from '../../components/Widget';

import ImageUploading, { ImageListType } from 'react-images-uploading';
import { MedicalNetImageDto } from '../../helpers/dto';
import { actions, useMedicalNetFaqDispatch, useMedicalNetFaqState } from '../../context/MedicalNetFaqContext';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';

interface ImageGalleryProps {
  medicalNetId: number | undefined;
  isOpen: boolean;
  onClose: (name?: string, id?: number) => void;
}

const imageDataPrefix = 'data:image/jpeg;base64,';

const removeImageDataPrefix = (image: string): string => {
  return image.startsWith(imageDataPrefix) ? image.slice(imageDataPrefix.length) : image;
};

const ImageGallery = ({ medicalNetId, isOpen, onClose }: ImageGalleryProps): JSX.Element => {
  const { t } = useTranslation();
  const [images, setImages] = React.useState<MedicalNetImageDto[]>([]);

  const { enqueueSnackbar } = useSnackbar();
  function sendNotification(errorMessage?: string) {
    enqueueSnackbar(errorMessage || t('COMMON.RECORDSAVED'), {
      variant: errorMessage ? 'warning' : 'success'
    });
  }

  const dispatch = useMedicalNetFaqDispatch();
  const value = useMedicalNetFaqState();
  React.useEffect(() => {
    if (medicalNetId) actions.doFetchImages(medicalNetId)(dispatch);
  }, [medicalNetId]);

  React.useEffect(() => {
    setImages(value.images);
  }, [value.images]);

  const onChange = (imageList: ImageListType, addUpdateIndex?: number[]) => {
    // data for submit
    if (addUpdateIndex != null) {
      const newImages = imageList.slice(addUpdateIndex[0]).map((it) => {
        return {
          medicalNetId,
          name: it.file?.name || 'image',
          image: removeImageDataPrefix(it.image)
        };
      });

      actions.doAddImages(medicalNetId, newImages, sendNotification)(dispatch);
    }
  };

  const removeImage = (medicalNetImageId: number) => {
    actions.doDeleteImage(medicalNetId, medicalNetImageId, sendNotification)(dispatch);
  };

  return (
    <Dialog open={isOpen} onClose={() => onClose()} scroll={'body'} maxWidth="md" fullWidth aria-labelledby="scroll-dialog-title">
      <DialogTitle id="alert-dialog-title">
        <span>{t('MEDICALNETFAQ.IMAGEGALLERY')}</span>
        <IconButton
          aria-label="close"
          onClick={() => onClose(undefined)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ImageUploading multiple value={images} onChange={onChange} acceptType={['jpg', 'jpeg']} dataURLKey="image">
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
                <Grid2 size={{ xs: 12, md: 3 }} key={inx}>
                  <Card>
                    <CardActionArea onClick={() => onClose(c.name, c.medicalNetImageId)}>
                      <CardMedia image={`${imageDataPrefix}${c.image}`} title="Gallery" style={{ height: 200 }} />
                    </CardActionArea>
                    <CardActions>
                      <Typography sx={{ flex: 1 }}>{c.name}</Typography>
                      <IconButton
                        aria-label="remove-img"
                        onClick={() => {
                          onImageRemove(inx);
                          removeImage(c.medicalNetImageId);
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
      </DialogContent>
    </Dialog>
  );
};

export default ImageGallery;
