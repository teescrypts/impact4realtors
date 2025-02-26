"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
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

  const handleChange =
    (index: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? index : false);
    };

  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4} color="primary">
        Frequently Asked Questions
      </Typography>

      <Box maxWidth="800px" mx="auto">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Accordion
              expanded={expanded === index}
              onChange={handleChange(index)}
              sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpendMore />}
                sx={{ fontWeight: "bold" }}
              >
                {faq.question}
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
