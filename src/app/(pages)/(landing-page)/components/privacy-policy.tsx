"use client";

import { Typography, Link, Container } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Privacy Policy
      </Typography>

      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Last updated: October 2025
      </Typography>

      <Typography paragraph>
        Welcome to <strong>Realty Illustration</strong>. Realty Illustration
        (“we,” “our,” or “us”) provides a demo web application designed to help
        real estate professionals manage appointments, leads, and schedules.
      </Typography>

      <Typography paragraph>
        This Privacy Policy explains how we collect, use, and protect
        information when you connect your <strong>Google account</strong>{" "}
        through our calendar integration.
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        1. Information We Collect
      </Typography>
      <Typography component="ul">
        <li>Google Account Information: your name and email address.</li>
        <li>Google Calendar Data: details of events created or modified.</li>
        <li>Authentication Tokens: used to securely access Google Calendar.</li>
      </Typography>

      <Typography paragraph>
        We do <strong>not</strong> collect or store your Google password.
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        2. How We Use Your Information
      </Typography>
      <Typography component="ul">
        <li>Sync appointments with your Google Calendar.</li>
        <li>Display events in your Realty Illustration dashboard.</li>
        <li>Maintain connection with Google via secure tokens.</li>
      </Typography>
      <Typography paragraph>
        We do <strong>not</strong> sell, share, or use your data for advertising
        or analytics.
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        3. How We Store and Protect Data
      </Typography>
      <Typography paragraph>
        Tokens are stored securely and used only by our backend for Google
        Calendar synchronization. You can disconnect your Google account at any
        time to remove all tokens from our database.
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        4. Revoking Access
      </Typography>
      <Typography paragraph>
        You can disconnect your Google account from Realty Illustration, or
        revoke access directly via your Google Account settings:
      </Typography>
      <Link
        href="https://myaccount.google.com/permissions"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://myaccount.google.com/permissions
      </Link>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        5. Third-Party Services
      </Typography>
      <Typography paragraph>
        This app uses the Google Calendar API, governed by Google’s Privacy
        Policy:
      </Typography>
      <Link
        href="https://policies.google.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
      >
        https://policies.google.com/privacy
      </Link>
      <Typography paragraph sx={{ mt: 1 }}>
        We comply with the Google API Services User Data Policy, including the
        Limited Use requirements.
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        6. Data Retention
      </Typography>
      <Typography paragraph>
        We retain only data necessary to maintain your calendar connection. When
        you disconnect your account or delete your profile, your tokens and
        related Google data are deleted immediately.
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        7. Your Rights
      </Typography>
      <Typography component="ul">
        <li>Access your stored information.</li>
        <li>Request deletion of your data.</li>
        <li>Disconnect your Google account at any time.</li>
      </Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        8. Contact Us
      </Typography>
      <Typography paragraph>
        If you have any questions or concerns, please contact us:
      </Typography>
      <Typography>
        📧{" "}
        <Link href="mailto:impactgraphics98@gmail.com">
          impactgraphics98@gmail.com
        </Link>
      </Typography>
      <Typography>
        🌐{" "}
        <Link href="https://realtyillustration.live" target="_blank">
          https://realtyillustration.live
        </Link>
      </Typography>
    </Container>
  );
}
