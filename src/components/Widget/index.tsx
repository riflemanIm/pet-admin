import React from 'react';
import { Paper, TextField as Input, InputAdornment, Box, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import classnames from 'classnames';

// styles
import useStyles from './styles';

interface WidgetProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  noBodyPadding?: boolean;
  bodyClass?: string;
  header?: string;
  inheritHeight?: boolean;
  searchField?: string;
  className?: string;
  style?: React.CSSProperties;
  paperClass?: string;
}

export default function Widget({
  children,
  title,
  subtitle,
  noBodyPadding,
  bodyClass,
  header,
  inheritHeight,
  searchField,
  className,
  style,
  ...props
}: WidgetProps): JSX.Element {
  const classes = useStyles(props);

  return (
    <div
      className={classnames(
        {
          [classes.inheritHeight]: inheritHeight,
          [classes.widgetWrapper]: !inheritHeight
        },
        className
      )}
      style={style}
    >
      <Paper
        className={classnames(classes.paper, {
          [props.paperClass || 'paper']: props.paperClass
        })}
        classes={{ root: classes.widgetRoot }}
      >
        {!title ? (
          <>{header ? <div className={classes.widgetHeader}>{header}</div> : null}</>
        ) : (
          <div className={classes.widgetHeader}>
            <Box display="flex" alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
              <Box display="flex" style={{ width: 'calc(100% - 20px)' }}>
                <Typography variant="h6" color="textSecondary" noWrap>
                  {title}
                </Typography>
                <Box alignSelf="flex-end" ml={1}>
                  <Typography color="textPrimary" variant={'caption'}>
                    {subtitle}
                  </Typography>
                </Box>
              </Box>
              {searchField && (
                <Input
                  id="search-field"
                  className={classes.textField}
                  label="Search"
                  margin="dense"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className={classes.searchIcon} />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            </Box>
          </div>
        )}
        <div
          className={classnames(classes.widgetBody, {
            [classes.noPadding]: noBodyPadding,
            [classes.paddingTop]: !title && !noBodyPadding,
            [bodyClass || 'body']: bodyClass
          })}
        >
          {children}
        </div>
      </Paper>
    </div>
  );
}
