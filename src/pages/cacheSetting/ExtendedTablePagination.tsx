import * as React from "react";
import { SxProps, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import {
  Cached as CachedIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Theme } from "@mui/material/styles/createTheme";
import { FormControl, InputAdornment, TextField } from "@mui/material";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

interface ExtendedTablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  search: string;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  onRowsPerPageChange?: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  onRefresh: () => void;
  onSearchChange: (value: string) => void;
  sx?: SxProps<Theme>;
}

const ExtendedTablePagination = (props: ExtendedTablePaginationProps) => {
  const TablePaginationActions = ({
    count,
    page,
    rowsPerPage,
    onPageChange,
  }: TablePaginationActionsProps) => {
    const theme = useTheme();

    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, 0);
    };

    const handleBackButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    const [search, setSearch] = React.useState("");
    React.useEffect(() => {
      setSearch(props.search);
    }, [props.search]);

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
        <IconButton onClick={() => props.onRefresh()} aria-label="refresh">
          <CachedIcon />
        </IconButton>
        <FormControl variant="standard">
          <TextField
            size="small"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => props.onSearchChange(search)}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") props.onSearchChange(search);
            }}
          />
        </FormControl>
      </Box>
    );
  };

  return (
    <TablePagination
      count={props.count}
      rowsPerPage={props.rowsPerPage}
      page={props.page}
      onPageChange={props.onPageChange}
      onRowsPerPageChange={props.onRowsPerPageChange}
      showFirstButton={true}
      showLastButton={true}
      ActionsComponent={TablePaginationActions}
      sx={props.sx}
    />
  );
};

export default ExtendedTablePagination;
