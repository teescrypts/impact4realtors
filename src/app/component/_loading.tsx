import { CircularProgress, Stack, SvgIcon } from "@mui/material";
import Box from "@mui/material/Box";
import CustomTheme from "./custom-theme";
import ImpactLogo from "../icons/untitled-ui/duocolor/impact-logo";

export const SplashScreen = () => (
  <CustomTheme colorPreset="purple">
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "background.paper",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        left: 0,
        p: 3,
        position: "fixed",
        top: 0,
        width: "100vw",
        zIndex: 1400,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          height: 48,
          width: 48,
        }}
      >
        <Stack direction={"column"} spacing={2}>
          <SvgIcon fontSize="large">
            <ImpactLogo />
          </SvgIcon>
          <CircularProgress color="primary" />
        </Stack>
      </Box>
    </Box>
  </CustomTheme>
);
