"use client"

import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  useTheme,
  SvgIcon,
} from "@mui/material";
import { motion } from "framer-motion";
import User01 from "@/app/icons/untitled-ui/duocolor/user01";
import MessageChatSquare from "@/app/icons/untitled-ui/duocolor/message-chat-square";
import Payment from "@/app/icons/untitled-ui/duocolor/payment";
import Building04 from "@/app/icons/untitled-ui/duocolor/building-04";
import Support from "@/app/icons/untitled-ui/duocolor/support";

const HowItWorks: React.FC = () => {
  const theme = useTheme();

  // Steps data
  const steps = [
    {
      icon: (
        <SvgIcon sx={{ fontSize: "3rem", color: theme.palette.primary.main }}>
          <User01 />
        </SvgIcon>
      ),
      title: "Explore the Demo",
      description:
        "Discover our live demo to see how our website solutions can work for you.",
    },
    {
      icon: (
        <SvgIcon sx={{ fontSize: "3rem", color: theme.palette.primary.main }}>
          <MessageChatSquare />
        </SvgIcon>
      ),
      title: "Message Us for Enquiry & Customization",
      description: "Reach out to discuss your needs and customization options.",
    },
    {
      icon: (
        <SvgIcon sx={{ fontSize: "3rem", color: theme.palette.primary.main }}>
          <Payment />
        </SvgIcon>
      ),
      title: "Pay the Customization Fee",
      description: "Secure your project with a simple payment process.",
    },
    {
      icon: (
        <SvgIcon sx={{ fontSize: "3rem", color: theme.palette.primary.main }}>
          <Building04 />
        </SvgIcon>
      ),
      title: "Build Your Customized Website",
      description: "We'll create your tailored website within 10 working days.",
    },
    {
      icon: (
        <SvgIcon sx={{ fontSize: "3rem", color: theme.palette.primary.main }}>
          <Support />
        </SvgIcon>
      ),
      title: "Enjoy Free Six-Month Support",
      description:
        "Get peace of mind with six months of complimentary support after launch.",
    },
  ];

  return (
    <Box
      sx={{
        py: 10,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 6,
            color: theme.palette.text.primary,
          }}
        >
          How It Works
        </Typography>

        <Grid container spacing={6}>
          {steps.map((step, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    p: 4,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: theme.shadows[3],
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ mb: 2 }}>{step.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
