"use client";

import Article from "@/app/icons/untitled-ui/duocolor/articule";
import Calculate from "@/app/icons/untitled-ui/duocolor/calculate";
import DesignServices from "@/app/icons/untitled-ui/duocolor/design-services";
import EventAvailable from "@/app/icons/untitled-ui/duocolor/event-available";
import Funnel from "@/app/icons/untitled-ui/duocolor/funnel";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import RealEstateAgent from "@/app/icons/untitled-ui/duocolor/real-estate-agent";
import {
  Box,
  Container,
  Grid2,
  Typography,
  SvgIcon,
  useTheme,
  Theme,
} from "@mui/material";

const features = [
  {
    icon: <Funnel />,
    title: "Lead Capturing & Management",
    description: "Convert visitors into leads and manage them efficiently.",
    number: "01",
  },
  {
    icon: <Calculate />,
    title: "Mortgage Calculator",
    description: "Help clients estimate their mortgage costs effortlessly.",
    number: "02",
  },
  {
    icon: <EventAvailable />,
    title: "Appointment Booking",
    description: "Schedule house tours and calls with potential buyers.",
    number: "03",
  },
  {
    icon: <Article />,
    title: "Blog & Content Management",
    description: "Share insights and manage content effortlessly.",
    number: "04",
  },
  {
    icon: <RealEstateAgent />,
    title: "Property Listing & Management",
    description: "Showcase properties and update listings seamlessly.",
    number: "05",
  },
  {
    icon: <HomeSmile />,
    title: "Intuitive Dashboard",
    description: "Easily manage all aspects of your real estate business.",
    number: "06",
  },
  {
    icon: <DesignServices />,
    title: "Flawless Designs",
    description: "Stunning and responsive layouts that attract buyers.",
    number: "07",
  },
];

const cardStyles = (theme: Theme) => {
  return {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    p: 3.5,
    borderRadius: "16px",
    border: "1px solid",
    borderColor: theme.palette.primary.light,
    background: "#ffffff",
    cursor: "default",
    overflow: "hidden",
    transition:
      "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(135deg, rgba(180,140,90,0.06) 0%, transparent 60%)",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.1)",
      borderColor: theme.palette.primary.main,
      "&::before": { opacity: 1 },
      "& .feature-icon-wrapper": {
        background:
          "linear-gradient(135deg, theme.palette.primary.dark 0%, theme.palette.primary.light 100%)",
        "& svg": { color: theme.palette.primary.main },
      },
      "& .feature-number": {
        color: theme.palette.primary.main,
      },
    },
  };
};

const FeaturesSection = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: { xs: 10, md: 14 },
        position: "relative",
        background: theme.palette.background.paper,
        // Subtle grain overlay
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 6, md: 10 }, maxWidth: 640 }}>
          <Typography
            component="span"
            sx={{
              display: "inline-block",
              mb: 2,
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              background: theme.palette.primary.alpha12,
              color: theme.palette.primary.main,
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Platform Features
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.75rem" },
              lineHeight: 1.2,
              color: "#1a1714",
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            Everything your real estate{" "}
            <Box
              component="em"
              sx={{
                fontStyle: "italic",
                color: theme.palette.primary.main,
              }}
            >
              business needs
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: "1.0625rem",
              color: theme.palette.primary.main,
              lineHeight: 1.7,
              fontFamily: "'Lora', Georgia, serif",
            }}
          >
            A complete toolkit to manage listings, capture leads, and grow your
            business — all from one elegant platform.
          </Typography>
        </Box>

        {/* Feature Grid */}
        <Grid2 container spacing={2.5}>
          {features.map((feature, index) => (
            <Grid2
              size={{ xs: 12, sm: 6, md: 4 }}
              key={index}
              sx={{
                // Last item (7th) centered on md+
                ...(index === 6 && {
                  "@media (min-width: 900px)": {
                    gridColumn: "2 / 3",
                  },
                }),
              }}
            >
              <Box sx={cardStyles}>
                {/* Corner number */}
                <Typography
                  className="feature-number"
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    letterSpacing: "0.05em",
                    transition: "color 0.3s ease",
                  }}
                >
                  {feature.number}
                </Typography>

                {/* Icon */}
                <Box
                  className="feature-icon-wrapper"
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: theme.palette.primary.alpha12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    transition: "background 0.3s ease",
                    flexShrink: 0,
                  }}
                >
                  <SvgIcon
                    sx={{
                      fontSize: 22,
                      color: theme.palette.primary.main,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {feature.icon}
                  </SvgIcon>
                </Box>

                {/* Text */}
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 600,
                    fontSize: "1.0625rem",
                    color: "#1a1714",
                    mb: 1,
                    lineHeight: 1.3,
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.875rem",
                    color: "#857f79",
                    lineHeight: 1.65,
                    fontFamily: "'Lora', Georgia, serif",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
