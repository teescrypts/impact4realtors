"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AgentType } from "../agents/page";

export default function OurAgentsPage({
  adminId,
  agents,
  total,
  currentPage,
  totalPages,
}: {
  adminId?: string;
  agents: AgentType[];
  total: number;
  currentPage: number;
  totalPages: number;
}) {
  const [currentAgents, setCurrentAgents] = useState(agents);
  const [hasMore, setHasMore] = useState(totalPages > currentPage);

  const handleLoadMore = () => {
    // setVisibleCount((prev) => prev + AGENTS_PER_PAGE);
    console.log(total);
    setCurrentAgents([]);
    setHasMore(false);
  };

  const router = useRouter();

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Our Real Estate Experts
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          textAlign="center"
          maxWidth="600px"
          mx="auto"
          mb={6}
        >
          Meet the professionals helping buyers and sellers every day.
        </Typography>

        <Grid2 container spacing={4}>
          {currentAgents.map((agent, index) => (
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

        {hasMore && (
          <Box textAlign="center" mt={6}>
            <Button
              variant="contained"
              onClick={handleLoadMore}
              sx={{ textTransform: "none", borderRadius: 3, px: 4 }}
            >
              Load More Agents
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
