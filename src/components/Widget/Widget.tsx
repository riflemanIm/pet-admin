import * as React from 'react';
import { Box, Paper, TextField, InputAdornment, Typography, type SxProps, type Theme } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import clsx from 'clsx';

export interface WidgetProps {
  children?: React.ReactNode;
  /** Title area. When omitted, `header` is rendered instead (if present). */
  title?: React.ReactNode;
  /** Optional small text next to the title. */
  subtitle?: React.ReactNode;
  /** Custom header node shown when `title` is absent. */
  header?: React.ReactNode;
  /** Remove default body padding. */
  noBodyPadding?: boolean;
  /** Extra className on the outermost wrapper. */
  className?: string;
  style?: React.CSSProperties;

  /** Control search field rendering. If true, shows a search input in the header. */
  searchField?: boolean;
  /** Placeholder text for search input. */
  searchPlaceholder?: string;
  /** Controlled value for the search input. */
  searchValue?: string;
  /** Change handler for the search input (fires on each keystroke). */
  onSearchChange?: (value: string) => void;

  /** Stretch the widget to inherit parent height instead of using the default min height layout. */
  inheritHeight?: boolean;

  /** SX overrides */
  wrapperSx?: SxProps<Theme>;
  paperSx?: SxProps<Theme>;
  bodySx?: SxProps<Theme>;
}

/**
 * MUI v6-compatible Widget container.
 * - Uses `sx` instead of deprecated `@mui/styles`.
 * - Optional search field in the header (controlled or uncontrolled).
 * - Flexible slots: title/subtitle or a custom `header` node.
 */
export default function Widget({
  children,
  title,
  subtitle,
  header,
  noBodyPadding,
  className,
  style,
  searchField,
  searchPlaceholder = 'Search',
  searchValue,
  onSearchChange,
  inheritHeight,
  wrapperSx,
  paperSx,
  bodySx
}: WidgetProps) {
  const [internalSearch, setInternalSearch] = React.useState('');

  const showTitleHeader = Boolean(title);
  const value = searchValue ?? internalSearch;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (onSearchChange) onSearchChange(v);
    else setInternalSearch(v);
  };

  return (
    <Box
      className={clsx(className)}
      sx={{
        display: 'flex',
        minHeight: inheritHeight ? 'auto' : '100%',
        ...((wrapperSx as object) || {})
      }}
      style={style}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden',
          // If you had theme.customShadows.widget previously, approximate with a standard shadow
          boxShadow: (theme) => theme.shadows[1],
          ...((paperSx as object) || {})
        }}
      >
        {showTitleHeader ? (
          <Box
            sx={{
              p: 3,
              pt: 3,
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-end', flex: 1, minWidth: 0 }}>
                <Typography variant="h3" color="text.secondary" noWrap mb={3}>
                  {title}
                </Typography>
                {subtitle ? (
                  <Box sx={{ alignSelf: 'flex-end', ml: 1 }}>
                    <Typography color="text.primary" variant="caption">
                      {subtitle}
                    </Typography>
                  </Box>
                ) : null}
              </Box>

              {searchField && (
                <TextField
                  id="search-field"
                  variant="outlined"
                  margin="dense"
                  placeholder={searchPlaceholder}
                  value={value}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(0,0,0,0.23)' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{ minWidth: 220 }}
                />
              )}
            </Box>
          </Box>
        ) : header ? (
          <Box
            sx={{
              p: 3,
              pt: 3,
              pb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}
          >
            {header}
          </Box>
        ) : null}

        <Box
          sx={{
            px: noBodyPadding ? 0 : 3,
            pb: noBodyPadding ? 0 : 3,
            pt: !showTitleHeader && !noBodyPadding ? 3 : 0,
            ...((bodySx as object) || {})
          }}
        >
          {children}
        </Box>
      </Paper>
    </Box>
  );
}
