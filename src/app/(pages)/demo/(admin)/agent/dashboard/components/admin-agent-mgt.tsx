"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Paper,
  Badge,
  Container,
} from "@mui/material";
import { useRouter } from "nextjs-toploader/app";
import SendFormModal from "./send-form-modal";

type Agent = {
  id: string;
  name: string;
  email: string;
  availability: string;
  leads: number;
  activeAppointments: number;
};

// Fake agents data
const initialAgents: Agent[] = Array.from({ length: 23 }, (_, index) => ({
  id: `${index + 1}`,
  name: `Agent ${index + 1}`,
  email: `agent${index + 1}@example.com`,
  availability: index % 2 === 0 ? "Available" : "Busy",
  leads: Math.floor(Math.random() * 10),
  activeAppointments: Math.floor(Math.random() * 5),
}));

const pendingForms = 3; // Replace with your actual pending forms count

export default function AdminAgentManagementPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openSendModal, setOpenSendModal] = useState(false);

  const router = useRouter();

  const handleDelete = (id: string) => {
    setAgents((prev) => prev.filter((agent) => agent.id !== id));
  };

  const handleNavigatePendingForms = () => {
    router.push("/demo/dashboard/agent/pending-forms");
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAgents = agents.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container sx={{ mt: 10 }} maxWidth="xl">
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4" fontWeight="bold">
          Agent Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button variant="contained" onClick={() => setOpenSendModal(true)}>
            Send Agent Form
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleNavigatePendingForms}
            sx={{ position: "relative" }}
          >
            Pending Forms
            {pendingForms > 0 && (
              <Badge badgeContent={pendingForms} color="error" sx={{ ml: 1 }} />
            )}
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Leads</TableCell>
              <TableCell>Active Appointments</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAgents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>{agent.name}</TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>{agent.availability}</TableCell>
                <TableCell>{agent.leads}</TableCell>
                <TableCell>{agent.activeAppointments}</TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(agent.id)}
                    >
                      Delete
                    </Button>
                    {/* <Button
                      variant="outlined"
                      color="warning"
                      size="small"
                      onClick={() => handleBan(agent.id)}
                    >
                      Ban
                    </Button> */}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination Control */}
        <TablePagination
          component="div"
          count={agents.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </TableContainer>

      {/* Modern Modal */}
      <SendFormModal
        openSendModal={openSendModal}
        setOpenSendModal={setOpenSendModal}
      />
    </Container>
  );
}
