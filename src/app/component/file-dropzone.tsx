import {
  Box,
  Stack,
  Avatar,
  SvgIcon,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import React from "react";
import Upload from "../icons/untitled-ui/duocolor/upload";
import Close from "../icons/untitled-ui/duocolor/close";

type FileType = File & {
  path?: string;
};

type AcceptType = {
  [key: string]: string[];
};

type PropTypes = {
  accept?: AcceptType;
  caption?: string;
  files?: { url: string; imageId: string; fileName: string }[];
  maxFiles?: number;
  onDrop?: (newFiles: FileType[]) => void;
  onRemove?: (id: string) => void;
  onRemoveAll?: () => void;
  isEdit?: boolean;
};

function FileDropzone({
  accept,
  caption,
  files = [],
  onDrop,
  maxFiles,
  onRemove,
  onRemoveAll,
  isEdit,
}: PropTypes) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop,
  });
  const hasAnyFiles = files.length > 0;

  return (
    <div>
      <Box
        sx={{
          alignItems: "center",
          border: 1,
          borderRadius: 1,
          borderStyle: "dashed",
          borderColor: "divider",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          outline: "none",
          p: 6,
          ...(isDragActive && {
            backgroundColor: "action.active",
            opacity: 0.5,
          }),
          "&:hover": {
            backgroundColor: "action.hover",
            cursor: "pointer",
            opacity: 0.5,
          },
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack alignItems="center" direction="row" spacing={2}>
          <Avatar
            sx={{
              height: 64,
              width: 64,
            }}
          >
            <SvgIcon>
              <Upload />
            </SvgIcon>
          </Avatar>
          <Stack spacing={1}>
            <Typography
              sx={{
                "& span": {
                  textDecoration: "underline",
                },
              }}
              variant="h6"
            >
              <span>Click to upload</span> or drag and drop
            </Typography>
            {caption && (
              <Typography color="text.secondary" variant="body2">
                {caption}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>

      {hasAnyFiles && (
        <Box sx={{ mt: 2 }}>
          <List>
            {files.map((file) => {
              return (
                <ListItem
                  key={file.imageId}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    "& + &": {
                      mt: 1,
                    },
                  }}
                >
                  {/* {isImage && ( */}
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                      border: 1,
                      borderColor: "divider",
                      overflow: "hidden",
                      mr: 2, // Margin between image and file details
                    }}
                  >
                    <img
                      src={file.url}
                      alt={file.fileName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  {/* )} */}
                  <ListItemText
                    primary={file.fileName}
                    slotProps={{ primary: { variant: "subtitle2" } }}
                  />
                  <Tooltip title="Remove">
                    <IconButton
                      onClick={() => onRemove!(file.imageId)}
                      edge="end"
                    >
                      <SvgIcon>
                        <Close />
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ mt: 2 }}
          >
            {!isEdit && (
              <Button
                color="inherit"
                onClick={onRemoveAll}
                size="small"
                type="button"
              >
                Remove All
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </div>
  );
}

export default FileDropzone;
