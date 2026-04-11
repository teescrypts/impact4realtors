// LeadCaptureSection.tsx
"use client";

import { useState } from "react";

import {
  Box,
  Typography,
  Container,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import HomeSmile from "@/app/icons/untitled-ui/duocolor/home-smile";
import Locations from "@/app/icons/untitled-ui/duocolor/location";
import TrendingUp from "@/app/icons/untitled-ui/duocolor/trending-up";
import { BuyerTypeCard } from "../buyer-type-card";
import { LeadCaptureModal } from "../buyer-lead-capture-modal";

const buyerTypes = [
  {
    icon: HomeSmile,
    title: "First-Time Buyers",
    description:
      "Navigate the home buying journey with confidence. Our comprehensive guide covers everything from pre-approval to closing day.",
    features: [
      "Step-by-step buying checklist",
      "Understanding mortgage options",
      "Hidden costs to budget for",
      "Negotiation strategies",
    ],
  },
  {
    icon: Locations,
    title: "Relocating Buyers",
    description:
      "Moving to a new city? Get insider knowledge on neighborhoods, schools, and local amenities before you make the move.",
    features: [
      "Neighborhood comparison guide",
      "Remote buying tips & tricks",
      "Timeline planning template",
      "Local market insights",
    ],
  },
  {
    icon: TrendingUp,
    title: "Investment Buyers",
    description:
      "Build wealth through real estate. Learn proven strategies for identifying high-yield properties and maximizing returns.",
    features: [
      "ROI calculation templates",
      "Market analysis framework",
      "Rental income projections",
      "Tax advantage strategies",
    ],
  },
];

export const BuyerLeadCaptureSection = ({
  adminId,
}: {
  adminId: string | undefined;
}) => {
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBuyerType, setSelectedBuyerType] = useState("");
  const primary = theme.palette.primary.main;

  const handleGetGuide = (title: string) => {
    setSelectedBuyerType(title);
    setModalOpen(true);
  };

  return (
    <Container sx={{ my: 6 }} maxWidth={"lg"}>
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 16 },
          position: "relative",
          overflow: "hidden",
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Background decorations */}
        <Box
          sx={{
            position: "absolute",
            top: -200,
            left: "50%",
            transform: "translateX(-50%)",
            width: 800,
            height: 800,
            borderRadius: "50%",
            background: theme.palette.primary.main + "20",
            filter: "blur(120px)",
            zIndex: -1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -150,
            right: -100,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: theme.palette.secondary.main,
            filter: "blur(120px)",
            zIndex: -1,
          }}
        />

        {/* Header */}
        <Box textAlign="center" mb={{ xs: 6, md: 12 }} px={2}>
          <Chip
            label="The right guide for you"
            size="small"
            sx={{
              bgcolor: alpha(primary, 0.08),
              color: "primary.main",
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              border: `1px solid ${alpha(primary, 0.18)}`,
              borderRadius: 1,
              height: 26,
              mb: 4
            }}
          />
          <Typography
            variant="h3"
            fontWeight={700}
            mb={2}
            sx={{ lineHeight: 1.2 }}
          >
            Discover the Perfect Guide for Your Next Move
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.8, maxWidth: 700, mx: "auto" }}
          >
            Whether you’re buying your first home, relocating, or seeking
            investment opportunities, we have a guide tailored for you.
          </Typography>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            justifyContent: { xs: "flex-start", md: "center" },
            alignItems: "stretch",
            gap: 3,
            px: { xs: 2, md: 0 },

            // Mobile swipe behavior
            overflowX: { xs: "auto", md: "visible" },
            scrollSnapType: { xs: "x mandatory", md: "none" },

            // Prevent scrollbar flash on desktop
            "&::-webkit-scrollbar": {
              display: "none",
            },
            scrollbarWidth: "none",
          }}
        >
          {buyerTypes.map((buyer) => (
            <BuyerTypeCard
              key={buyer.title}
              icon={buyer.icon}
              title={buyer.title}
              description={buyer.description}
              features={buyer.features}
              onGetGuide={() => handleGetGuide(buyer.title)}
            />
          ))}
        </Box>

        {/* Modal */}
        <LeadCaptureModal
          adminId={adminId}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          buyerType={selectedBuyerType}
        />
      </Box>
    </Container>
  );
};
