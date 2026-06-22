"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Stack,
  Chip,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import ExpendMore from "@/app/icons/untitled-ui/duocolor/expand-more";

const faqs = [
  {
    question: "How do I book a house tour?",
    answer:
      "Simply browse our listings, select a property, and click 'Book House Showing' to schedule a tour.",
  },
  {
    question: "What documents do I need to rent a house?",
    answer:
      "You will typically need an ID, proof of income, and a rental application form.",
  },
  {
    question: "How does mortgage comparison work?",
    answer:
      "We provide an easy-to-use tool to compare different mortgage plans based on interest rates and terms.",
  },
  {
    question: "Can I list my property for sale or rent?",
    answer:
      "Yes! You can list your property through our platform by filling out the listing form under 'Sell' or 'Rent' sections.",
  },
];

export default function FAQsSection() {
  const [expanded, setExpanded] = useState<number | false>(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const primary = theme.palette.primary.main;

  const handleChange =
    (index: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? index : false);
    };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 9, md: 13 },
        bgcolor: isDark ? "grey.950" : "grey.50",
      }}
    >
      {/* Background orb — matches recent-listings / testimonials */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: "10%",
          left: "-10%",
          width: { xs: 240, md: 420 },
          height: { xs: 240, md: 420 },
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(primary, 0.07)} 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Stack alignItems="center" spacing={2} mb={6}>
            <Chip
              label="Got Questions?"
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
              }}
            />
            <Typography
              variant="h3"
              fontWeight={900}
              letterSpacing="-0.03em"
              lineHeight={1.1}
              sx={{ fontSize: { xs: "1.85rem", sm: "2.4rem", md: "2.6rem" } }}
            >
              Frequently asked
              <Box component="span" sx={{ color: "primary.main" }}>
                {" "}
                questions
              </Box>
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 480, lineHeight: 1.7 }}
            >
              Everything you need to know about buying, selling, and renting
              with us.
            </Typography>
          </Stack>
        </motion.div>

        <Stack spacing={2} textAlign="left">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Accordion
                expanded={expanded === index}
                onChange={handleChange(index)}
                disableGutters
                elevation={0}
                sx={{
                  borderRadius: 2.5,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor:
                    expanded === index
                      ? alpha(primary, 0.35)
                      : isDark
                        ? alpha("#fff", 0.08)
                        : alpha("#000", 0.08),
                  bgcolor: isDark ? alpha("#fff", 0.03) : "common.white",
                  boxShadow:
                    expanded === index
                      ? `0 8px 24px ${alpha(primary, 0.12)}`
                      : "none",
                  transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        bgcolor: alpha(primary, 0.08),
                        color: "primary.main",
                      }}
                    >
                      <ExpendMore />
                    </Box>
                  }
                  sx={{
                    px: 3,
                    py: 1,
                    "& .MuiAccordionSummary-content": { my: 1 },
                  }}
                >
                  <Typography fontWeight={700} sx={{ fontSize: "1rem" }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
