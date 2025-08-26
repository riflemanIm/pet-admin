import React from "react";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import {
  Close as CloseIcon,
  DeleteOutline as DeleteIcon,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import JSONEditor from "../../components/JSONEditor";
import { Mode } from "vanilla-jsoneditor";
import ExtendedTablePagination from "./ExtendedTablePagination";
import { CacheValueDto } from "../../helpers/dto";

interface UserDetailsDialogProps {
  isOpen: boolean;
  code: string;
  onRequestKeys: (code: string, search?: string) => Promise<string[]>;
  onRequestValue: (code: string, value: string) => Promise<CacheValueDto>;
  onDeleteKey: (code: string, key: string) => Promise<void>;
  onClose: () => void;
}

const CacheDetailsDialog = ({
  isOpen,
  code,
  onRequestKeys,
  onRequestValue,
  onDeleteKey,
  onClose,
}: UserDetailsDialogProps): JSX.Element => {
  const { t } = useTranslation();

  const [deleteCount, setDeleteCount] = React.useState(0);
  const [selectedKey, setSelectedKey] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [keys, setKeys] = React.useState<string[]>([]);
  const [keyValue, setKeyValue] = React.useState<CacheValueDto>({
    value: "",
    type: "none",
    ttl: 0,
  });
  const [keysLoading, setKeysLoading] = React.useState(false);
  const [valueLoading, setValueLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const loadKeys = React.useCallback(async (code: string, search?: string) => {
    if (!code) return;
    setKeysLoading(true);
    try {
      const keys = await onRequestKeys(code, search);
      setKeys(keys);
    } finally {
      setKeysLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setSearch("");
  }, [code]);

  React.useEffect(() => {
    loadKeys(code, search);
  }, [code, search, deleteCount]);

  React.useEffect(() => {
    if (!code || !selectedKey) return;
    setValueLoading(true);
    onRequestValue(code, selectedKey)
      .then((result) => {
        setKeyValue(result);
      })
      .finally(() => setValueLoading(false));
  }, [code, selectedKey]);

  const handleDeleteKeyClick = React.useCallback(
    (key: string) => {
      onDeleteKey(code, key).then(() => {
        setDeleteCount(deleteCount + 1);
      });
    },
    [code, deleteCount]
  );

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      scroll={"body"}
      maxWidth="lg"
      fullWidth
      aria-labelledby="scroll-dialog-title"
    >
      <DialogTitle id="alert-dialog-title">
        <span style={{ paddingRight: 32 }}>
          {`${t("CACHESETTINGS.DETAILSDIALOG.TITLE")}: ${code}`}
        </span>
        <IconButton
          aria-label="close"
          onClick={() => onClose()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Grid2 container>
          <Grid2
            size={{ md: 4 }}
            sx={{
              height: 600,
              overflow: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#6b6b6b #fff",

              "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                backgroundColor: "#fff",
              },
              "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                borderRadius: 8,
                backgroundColor: "#d5d9ef",
                border: "5px solid #fff",
              },
              "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
                {
                  backgroundColor: "#fff",
                },
              "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
                {
                  backgroundColor: "#73d7f5",
                  border: "3px solid #fff",
                },
              "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
                {
                  backgroundColor: "#73d7f5",
                  border: "3px solid #fff",
                },
              "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                backgroundColor: "#fff",
              },
            }}
          >
            {keysLoading ? (
              <CircularProgress />
            ) : (
              <List>
                {keys
                  .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                  .map((it) => (
                    <ListItem
                      key={it}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteKeyClick(it)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton
                        selected={selectedKey === it}
                        onClick={() => setSelectedKey(it)}
                      >
                        <ListItemText primary={it} />
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            )}
          </Grid2>
          <Grid2
            size={{ md: 8 }}
            sx={{
              height: 600,
              overflow: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#6b6b6b #fff",

              "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                backgroundColor: "#fff",
              },
              "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                borderRadius: 8,
                backgroundColor: "#d5d9ef",
                border: "5px solid #fff",
              },
              "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
                {
                  backgroundColor: "#fff",
                },
              "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
                {
                  backgroundColor: "#73d7f5",
                  border: "3px solid #fff",
                },
              "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
                {
                  backgroundColor: "#73d7f5",
                  border: "3px solid #fff",
                },
              "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
                backgroundColor: "#fff",
              },
            }}
          >
            {valueLoading ? (
              <CircularProgress />
            ) : (
              <JSONEditor
                content={{
                  text: keyValue.value
                    ? JSON.stringify(JSON.parse(keyValue.value), undefined, 2)
                    : "",
                }}
                mainMenuBar={true}
                navigationBar={false}
                mode={Mode.text}
                readOnly={true}
                style={{ height: "570px" }}
                boxStyle={{ height: "570px" }}
                label={`type: ${keyValue.type}, ttl: ${keyValue.ttl}`}
              />
            )}
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <ExtendedTablePagination
          count={keys.length}
          page={page}
          onPageChange={(event, page) => setPage(page)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          onRefresh={() => loadKeys(code, search)}
          search={search}
          onSearchChange={(value) => setSearch(value)}
          sx={{
            "margin-right": "auto",
            padding: "0px",
            borderBottom: 0,
            paddingLeft: "8px",
          }}
        />
        <Button onClick={() => onClose()}>{t("COMMON.CLOSE")}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CacheDetailsDialog;
