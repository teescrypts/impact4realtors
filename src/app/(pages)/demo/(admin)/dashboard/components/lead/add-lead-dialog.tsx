/**
 * Add Lead Dialog Component
 *
 * Form to create a new lead with category, intent, contact info,
 * and initial status
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  CreateLeadPayload,
  LeadIntent,
  BuyerProfile,
  LeadCategory,
  Tag,
} from "./types/lead.types";

interface AddLeadDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeadPayload) => Promise<void>;
  tags: Tag[];
}

// Intent options per category
const BUYER_INTENTS: LeadIntent[] = [
  "House Tour",
  "Mortgage Inquiry",
  "Buyer Guide",
];

const SELLER_INTENTS: LeadIntent[] = [
  "Sell Call Appointment",
  "Home valuation",
];

const INQUIRY_INTENTS: LeadIntent[] = ["General Inquiry"];

const BUYER_PROFILES: BuyerProfile[] = [
  "First-Time Buyer",
  "Repeat Buyer",
  "Investor",
];

export default function AddLeadDialog({
  open,
  onClose,
  onSubmit,
  tags,
}: AddLeadDialogProps) {
  // Form state
  const [category, setCategory] = useState<LeadCategory>("buyer");
  const [intent, setIntent] = useState<LeadIntent | "">("");
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | "">("");
  const [status, setStatus] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get available intents based on category

  const getIntentsForCategory = useCallback((): LeadIntent[] => {
    if (category === "buyer") return BUYER_INTENTS;
    if (category === "seller") return SELLER_INTENTS;
    return INQUIRY_INTENTS;
  }, [category]);

  // Get available tags based on category
  const getTagsForCategory = useCallback(() => {
    return tags.filter((tag) => tag.category === category);
  }, [category, tags]);

  // Reset intent when category changes
  useEffect(() => {
    setIntent("");
    setBuyerProfile("");
    // Auto-select first intent for new category
    const intents = getIntentsForCategory();
    if (intents.length > 0) {
      setIntent(intents[0]);
    }
  }, [category, getIntentsForCategory]);

  // Auto-select "new lead" status when category changes
  useEffect(() => {
    const categoryTags = getTagsForCategory();
    const newLeadTag = categoryTags.find((tag) => tag.name === "new lead");
    if (newLeadTag) {
      setStatus(newLeadTag.name);
    } else if (categoryTags.length > 0) {
      setStatus(categoryTags[0].name);
    }
  }, [category, tags, getTagsForCategory]);

  const handleReset = () => {
    setCategory("buyer");
    setIntent("");
    setBuyerProfile("");
    setStatus("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setSource("");
    setNotes("");
    setError("");
    setLoading(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const validateForm = (): string | null => {
    if (!firstName.trim()) return "First name is required";
    if (!lastName.trim()) return "Last name is required";
    if (!email.trim()) return "Email is required";
    if (!phone.trim()) return "Phone is required";
    if (!category) return "Category is required";
    if (!intent) return "Intent is required";
    if (!status) return "Status is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";

    // Phone validation (basic)
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10)
      return "Phone number must be at least 10 digits";

    return null;
  };

  const handleSubmit = async () => {
    setError("");

    // Validate
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Prepare payload
    const payload: CreateLeadPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      category,
      intent: intent || null,
      status,
      source: source.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    // Add buyer profile if category is buyer
    if (category === "buyer" && buyerProfile) {
      payload.buyerProfile = buyerProfile;
    }

    try {
      setLoading(true);
      await onSubmit(payload);
      handleClose(); // Close dialog on success
    } catch (err: any) {
      setError(err.message || "Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Add New Lead</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Category */}
          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as LeadCategory)}
            required
            fullWidth
          >
            <MenuItem value="buyer">Buyer</MenuItem>
            <MenuItem value="seller">Seller</MenuItem>
            <MenuItem value="inquiry">Inquiry</MenuItem>
          </TextField>

          {/* Intent */}
          <TextField
            select
            label="Intent"
            value={intent}
            onChange={(e) => setIntent(e.target.value as LeadIntent)}
            required
            fullWidth
          >
            {getIntentsForCategory().map((intentOption) => (
              <MenuItem
                key={intentOption}
                value={intentOption ? intentOption : ""}
              >
                {intentOption}
              </MenuItem>
            ))}
          </TextField>

          {/* Buyer Profile (only for buyers) */}
          {category === "buyer" && (
            <TextField
              select
              label="Buyer Profile"
              value={buyerProfile}
              onChange={(e) => setBuyerProfile(e.target.value as BuyerProfile)}
              fullWidth
              helperText="Optional - helps categorize the buyer"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {BUYER_PROFILES.map((profile) => (
                <MenuItem key={profile} value={profile}>
                  {profile}
                </MenuItem>
              ))}
            </TextField>
          )}

          {/* Initial Status */}
          <TextField
            select
            label="Initial Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            fullWidth
            helperText="This will trigger the appropriate journey automation"
          >
            {getTagsForCategory().map((tag) => (
              <MenuItem key={tag._id} value={tag.name}>
                {tag.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Contact Info Section */}
          <Box sx={{ pt: 1 }}>
            <Stack spacing={2}>
              <TextField
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                fullWidth
                autoFocus
              />

              <TextField
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                placeholder="lead@example.com"
              />

              <TextField
                label="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                fullWidth
                placeholder="(555) 123-4567"
              />
            </Stack>
          </Box>

          {/* Source */}
          <TextField
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            fullWidth
            placeholder="e.g., Website Form, Referral, Phone Call"
            helperText="Optional - where did this lead come from?"
          />

          {/* Notes */}
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="Any additional information about this lead..."
            helperText="Optional"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {loading ? "Creating..." : "Create Lead"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
