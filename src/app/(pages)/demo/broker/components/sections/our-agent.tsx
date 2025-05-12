"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Button,
  Stack,
  Grid2,
} from "@mui/material";
import Link from "next/link";
import { AgentType } from "../../agents/page";
import { useRouter } from "nextjs-toploader/app";

export default function OurAgents({
  agents,
  adminId,
}: {
  agents: AgentType[];
  adminId?: string;
}) {
  const router = useRouter();

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
          Meet Our Agents
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          maxWidth="600px"
          mx="auto"
          mb={6}
        >
          Our experienced agents are ready to help you buy, sell, or rent your
          next home.
        </Typography>

        <Grid2 container spacing={4}>
          {agents.map((agent, index) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 3,
                  transition: "transform 0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={agent.profilePictureUrl}
                  alt={`${agent.firstName} ${agent.lastName}`}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {`${agent.firstName} ${agent.lastName}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agent.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {agent.phone}
                  </Typography>
                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: "none", borderRadius: 2 }}
                      onClick={() =>
                        router.push(
                          adminId
                            ? `/demo/broker/agents/${
                                agent.owner
                              }?type=${"general"}&admin=${adminId}`
                            : `/demo/broker/agents/${
                                agent.owner
                              }?type=${"general"}`
                        )
                      }
                    >
                      View Profile
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        {/* "See All Agents" Button */}
        <Box textAlign="center" mt={8}>
          <Link
            href={
              adminId
                ? `/demo/broker/agents?admin=${adminId}`
                : `/demo/broker/agents`
            }
            passHref
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                borderRadius: 50,
                textTransform: "none",
                px: 4,
              }}
            >
              See All Agents
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
