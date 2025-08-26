import React from 'react';
import { withStyles } from '@mui/styles';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Link, MenuProps } from '@mui/material';

import {
  GetApp as DownloadIcon,
  Menu as MenuIcon,
  Restore as RestoreIcon,
  LabelImportant as LabelImportantIcon
} from '@mui/icons-material';

import config from '../../config';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5'
  }
})((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center'
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '& .MuiListItemIcon-root': {
      minWidth: theme.spacing(4)
    },

    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

export default function TranslationAdminActionsMenu({ pname }: { pname: string }): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <IconButton aria-label="delete" style={{ marginTop: 8 }} onClick={handleClick} color="primary">
        <MenuIcon />
      </IconButton>
      <StyledMenu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <Link href="#translation/import" underline="none" color="primary">
          <StyledMenuItem>
            <ListItemIcon>
              <LabelImportantIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Import" />
          </StyledMenuItem>
        </Link>
        <Link href="#translation/backups" underline="none" color="primary">
          <StyledMenuItem>
            <ListItemIcon>
              <RestoreIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Restore" />
          </StyledMenuItem>
        </Link>

        <Link href={`${config.baseURLApi}/translations/csv/${pname}`} underline="none" color="primary">
          <StyledMenuItem>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary=".CSV" />
          </StyledMenuItem>
        </Link>
      </StyledMenu>
    </React.Fragment>
  );
}
