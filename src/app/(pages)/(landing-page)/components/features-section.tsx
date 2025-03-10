"use client";

import Article from "@/app/icons/untitled-ui/duocolor/articule";
import Calculate from "@/app/icons/untitled-ui/duocolor/calculate";
import DesignServices from "@/app/icons/untitled-ui/duocolor/design-services";
import EventAvailable from "@/app/icons/untitled-ui/duocolor/event-available";
import Funnel from "@/app/icons/untitled-ui/duocolor/funnel";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import RealEstateAgent from "@/app/icons/untitled-ui/duocolor/real-estate-agent";
import StackedEmail from "@/app/icons/untitled-ui/duocolor/stacked-email";
import {
  Box,
  Container,
  Grid2,
  Typography,
  Card,
  CardContent,
  SvgIcon,
} from "@mui/material";

const features = [
  {
    icon: (
      <SvgIcon fontSize="large">
        <Funnel />
      </SvgIcon>
    ),
    title: "Lead Capturing & Management",
    description: "Convert visitors into leads and manage them efficiently.",
  },
  {
    icon: (
      <SvgIcon fontSize="large">
        <Calculate />
      </SvgIcon>
    ),
    title: "Mortgage Calculator",
    description: "Help clients estimate their mortgage costs effortlessly.",
  },
  {
    icon: (
      <SvgIcon fontSize="large">
        <EventAvailable />
      </SvgIcon>
    ),
    title: "Appointment Booking",
    description: "Schedule house tours and calls with potential buyers.",
  },
  {
    icon: (
      <SvgIcon fontSize="large">
        <Article />
      </SvgIcon>
    ),
    title: "Blog & Blog Management",
    description: "Share insights and manage content effortlessly.",
  },
  {
    icon: (
      <SvgIcon fontSize="large">
        <StackedEmail />
      </SvgIcon>
    ),
    title: "Newsletter",
    description: "Keep your clients engaged with email updates.",
  },
  {
    icon: (
      <SvgIcon fontSize="large">
        <RealEstateAgent />
      </SvgIcon>
    ),
    title: "Property Listing & Management",
    description: "Showcase properties and update listings seamlessly.",
  },
  {
    icon: (
      <SvgIcon fontSize="large">
        <HomeSmile />
      </SvgIcon>
    ),
    title: "Intuitive Dashboard",
    description: "Easily manage all aspects of your real estate business.",
  },
  {
    icon: (
      <SvgIcon fontSize="large">
        <DesignServices />
      </SvgIcon>
    ),
    title: "Flawless Designs",
    description: "Stunning and responsive layouts that attract buyers.",
  },
];

const FeaturesSection = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "#f5f5f5" }}>
      <Container>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          Powerful Features to Elevate Your Business
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          mb={4}
        >
          Everything you need to manage your real estate business efficiently.
        </Typography>

        <Grid2 container spacing={4}>
          {features.map((feature, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  textAlign: "center",
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box color="primary.main" mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
