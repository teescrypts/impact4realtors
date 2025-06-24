"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import notify from "@/app/utils/toast";
import Copy from "@/app/icons/untitled-ui/duocolor/copy";
import Delete from "@/app/icons/untitled-ui/duocolor/delete";
import { deleteForm } from "@/app/actions/server-actions";
import { useState } from "react";
import truncateWords from "@/app/utils/truncated-words";

export default function PendingFormsPage({
  forms,
}: {
  forms: { _id: string; email: string; createdAt: string }[];
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    notify("Link copied to clipboard!");
  };

  const handleDeleteForm = (id: string) => {
    setLoading(true);
    deleteForm(id).then((res) => {
      if (res.error) {
        setMessage(res.error);
        setLoading(false);
      }

      if (res.message) {
        notify(res.message);
        setLoading(false);
      }
    });
  };

  const formatDate = (isoDate: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(isoDate));
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Pending Agent Forms
      </Typography>

      {message && (
        <Typography variant="subtitle2" color="error" textAlign="center">
          {message}
        </Typography>
      )}

      {forms.length === 0 ? (
        <Typography color="text.secondary">No pending forms found.</Typography>
      ) : (
        <Card>
          <CardContent>
            {/* Responsive Scroll Container */}
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Form Link</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forms.map((form) => (
                    <TableRow key={form._id}>
                      <TableCell>{form.email}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ wordBreak: "break-all" }}
                        >
                          {truncateWords(
                            `${process.env.NEXT_PUBLIC_API_URL}/demo/broker/form/${form._id}`,
                            5
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(form.createdAt)}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <Tooltip title="Copy Link">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleCopyLink(
                                  `${process.env.NEXT_PUBLIC_API_URL}/demo/broker/form/${form._id}`
                                )
                              }
                            >
                              <Copy />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Form">
                            <IconButton
                              color="error"
                              disabled={loading}
                              onClick={() => handleDeleteForm(form._id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
