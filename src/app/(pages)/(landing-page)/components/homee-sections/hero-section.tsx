"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useRouter } from "nextjs-toploader/app";
import { useTheme } from "@mui/material";

const sections = [
  {
    number: "1",
    question: "Can I trust you?",
    description: "Your website speaks before you do.",
    color: "#0F6E56",
    bgColor: "#E1F5EE",
    dotColor: "#1D9E75",
    features: [
      "Custom, modern & elegantly designed pages built for your brand",
      "A professional presence that builds credibility instantly",
      "SEO-optimised blog to showcase your expertise",
    ],
  },
  {
    number: "2",
    question: "Do you care about what matters to me?",
    description: "Serve every visitor's unique need.",
    color: "#185FA5",
    bgColor: "#E6F1FB",
    dotColor: "#378ADD",
    features: [
      "Downloadable buyer guides — for first-timers, investors & relocators",
      "Mortgage calculator to help them plan with confidence",
      "Home valuation requests so sellers feel valued",
      "Real-time call & tour booking — on their schedule, 24/7",
    ],
  },
  {
    number: "3",
    question: "Can you actually help me?",
    description: "Prove it with tools working behind the scenes.",
    color: "#534AB7",
    bgColor: "#EEEDFE",
    dotColor: "#7F77DD",
    features: [
      "Smart lead dashboard — every lead organised, tagged & ready to follow up",
      "Automated lead journeys that keep prospects warm",
      "Google Calendar sync for seamless appointment management",
      "Featured property listings with advanced filters & search",
    ],
  },
];

export default function RealEstateLanding() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        minHeight: "100vh",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Chip
            label="Real estate websites that work"
            sx={{
              mb: 3,
              bgcolor: theme.palette.primary.alpha12,
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: "20px",
              height: "32px",
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#1a1a1a",
              fontSize: { xs: "2rem", md: "2.8rem" },
              lineHeight: 1.25,
              mb: 2,
            }}
          >
            Before a Seller Or Buyer hires an agent,
            <br />
            they ask three silent questions.
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#666", fontSize: "1.1rem", lineHeight: 1.7 }}
          >
            Your website should answer all three — before you even pick up the
            phone.
          </Typography>
        </Box>

        <Divider sx={{ mb: 5 }} />

        {/* Trust Sections */}
        <Stack spacing={5}>
          {sections.map((section, index) => (
            <Box key={index}>
              {/* Question Header */}
              <Stack
                direction="row"
                alignItems="flex-start"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: section.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: section.color,
                    }}
                  >
                    {section.number}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}
                  >
                    {section.question}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#888" }}>
                    {section.description}
                  </Typography>
                </Box>
              </Stack>

              {/* Features */}
              <Stack spacing={1.5} sx={{ pl: 7 }}>
                {section.features.map((feat, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: section.dotColor,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: "#333", fontSize: "0.95rem" }}
                    >
                      {feat}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {index < sections.length - 1 && <Divider sx={{ mt: 5 }} />}
            </Box>
          ))}
        </Stack>

        {/* CTA Box */}
        <Box
          sx={{
            mt: 8,
            bgcolor: theme.palette.primary.lightest,
            borderRadius: 3,
            px: { xs: 3, md: 5 },
            py: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}
            >
              See it all live — book a free demo
            </Typography>
            <Typography variant="body2" sx={{ color: "#888" }}>
              We'll walk you through every feature, live on screen.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "#fff",
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { bgcolor: theme.palette.primary.dark },
            }}
            onClick={() =>
              router.push(`https://calendly.com/impactillustration1/30min`)
            }
          >
            Book a demo →
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
