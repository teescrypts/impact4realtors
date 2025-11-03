"use server"

export const getGoogleOAuthClient = async () => {
  // Dynamically import googleapis so it’s only loaded at runtime
  const { google } = await import("googleapis");

  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/google/callback`
  );
};
