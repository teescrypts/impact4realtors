import dynamic from "next/dynamic";
import { styled } from "@mui/material/styles";
import { Theme } from "@mui/material";

// Dynamically import the React Quill editor with SSR disabled
const Editor = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => null,
});

// Define the type for the component's theme props
interface QuillEditorProps {
  theme?: Theme;
}

// Styled component using MUI's `styled` function with Theme support
export const QuillEditor = styled(Editor)<QuillEditorProps>(({ theme }) => ({
  border: 1,
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  borderStyle: "solid",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  "& .quill": {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
  "& .ql-snow.ql-toolbar": {
    borderColor: theme.palette.divider,
    borderLeft: "none",
    borderRight: "none",
    borderTop: "none",
    "& .ql-picker-label:hover": {
      color: theme.palette.primary.main,
    },
    "& .ql-picker-label.ql-active": {
      color: theme.palette.primary.main,
    },
    "& .ql-picker-item:hover": {
      color: theme.palette.primary.main,
    },
    "& .ql-picker-item.ql-selected": {
      color: theme.palette.primary.main,
    },
    "& button:hover": {
      color: theme.palette.primary.main,
      "& .ql-stroke": {
        stroke: theme.palette.primary.main,
      },
    },
    "& button:focus": {
      color: theme.palette.primary.main,
      "& .ql-stroke": {
        stroke: theme.palette.primary.main,
      },
    },
    "& button.ql-active": {
      "& .ql-stroke": {
        stroke: theme.palette.primary.main,
      },
    },
    "& .ql-stroke": {
      stroke: theme.palette.text.primary,
    },
    "& .ql-picker": {
      color: theme.palette.text.primary,
    },
    "& .ql-picker-options": {
      backgroundColor: theme.palette.background.paper,
      border: "none",
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[10],
      padding: theme.spacing(2),
    },
  },
  "& .ql-snow.ql-container": {
    borderBottom: "none",
    borderColor: theme.palette.divider,
    borderLeft: "none",
    borderRight: "none",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: "auto",
    overflow: "hidden",
    "& .ql-editor": {
      color: theme.palette.text.primary,
      flex: 1,
      fontFamily: theme.typography.body1.fontFamily,
      fontSize: theme.typography.body1.fontSize,
      height: "auto",
      overflowY: "auto",
      padding: theme.spacing(2),
      "&.ql-blank::before": {
        color: theme.palette.text.secondary,
        fontStyle: "normal",
        left: theme.spacing(2),
      },
    },
  },
}));
