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
  IconButton,
  Badge,
  Container,
  Avatar,
  Chip,
  Stack,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useRouter } from "nextjs-toploader/app";
import SendFormModal from "./send-form-modal";
import { AgentTableType } from "../agent/page";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import ConfirmDeleteAgentModal from "./confirm-delete-agent";
import { deleteAgent } from "@/app/actions/server-actions";
import notify from "@/app/utils/toast";

export default function AdminAgentManagementPage({
  agents,
  pendingForms,
}: {
  agents: AgentTableType[];
  pendingForms: number;
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openSendModal, setOpenSendModal] = useState(false);

  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAgentName, setSelectedAgentName] = useState<
    string | undefined
  >();
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDeleteClick = (agentName: string, agentId: string) => {
    setSelectedAgentName(agentName);
    setSelectedAgentId(agentId);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedAgentId) {
      setLoading(true);
      deleteAgent(selectedAgentId).then((res) => {
        if (res) {
          if (res.error) {
            setMessage(res.error);
            setLoading(false);
          }

          if (res.message) {
            notify(res.message);
            setLoading(false);
          }
        }
      });
    }

    setModalOpen(false);
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

  const theme = useTheme();

  return (
    <Container sx={{ mt: 10 }} maxWidth="lg">
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
            endIcon={
              <Badge badgeContent={pendingForms} color="error" sx={{ ml: 1 }} />
            }
          >
            Pending Forms
          </Button>
        </Box>
      </Box>

      {message && (
        <Typography textAlign={"center"} color="error" variant="subtitle2">
          {message}
        </Typography>
      )}

      <TableContainer component={Paper} elevation={2}>
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
              <TableRow
                key={agent.id}
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.background.default,
                  },
                  "&:hover": {
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              >
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar>{agent.name.charAt(0)}</Avatar>
                    <Typography>{agent.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{agent.email}</TableCell>
                <TableCell>
                  <Chip
                    label={agent.availability}
                    color={
                      agent.availability === "Available" ? "success" : "warning"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>{agent.leads}</TableCell>
                <TableCell>{agent.activeAppointments}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete Agent">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(agent.name, agent.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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

      <ConfirmDeleteAgentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        agentName={selectedAgentName}
        loading={loading}
      />

      {/* Modern Modal */}
      <SendFormModal
        openSendModal={openSendModal}
        setOpenSendModal={setOpenSendModal}
      />
    </Container>
  );
}
