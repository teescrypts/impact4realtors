"use client";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid2,
  Typography,
} from "@mui/material";

const testimonials = [
  {
    name: "Sarah Thompson",
    role: "Homebuyer · Austin, TX",
    quote:
      "Working with this agency was the best decision I made. They guided me through every step with professionalism and genuine care.",
    avatar: "/testimonials/sarah.jpg",
  },
  {
    name: "James Carter",
    role: "Investor · San Diego, CA",
    quote:
      "Their knowledge of the local market and attention to detail is unmatched. I closed on my dream investment property in under 30 days.",
    avatar: "/testimonials/james.jpg",
  },
  {
    name: "Emily Chen",
    role: "Seller · Seattle, WA",
    quote:
      "They made selling my home a smooth and stress-free experience. From staging to closing, everything was seamless.",
    avatar: "/testimonials/emily.jpg",
  },
];

export default function Testimonials() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
      }}
    >
      <Container>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          What Our Clients Say
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          maxWidth="600px"
          mx="auto"
          mb={6}
        >
          Real stories from people who’ve found their perfect home, made a smart
          investment, or sold with ease.
        </Typography>

        <Grid2 container spacing={4}>
          {testimonials.map((t, i) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  p: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    fontStyle="italic"
                    mb={3}
                  >
                    “{t.quote}”
                  </Typography>

                  <Box display="flex" alignItems="center" mt="auto">
                    <Avatar src={t.avatar} alt={t.name} sx={{ mr: 2 }} />
                    <Box>
                      <Typography fontWeight="bold">{t.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t.role}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
