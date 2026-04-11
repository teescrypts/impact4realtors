export default function createEmailHTML(params: {
  greeting?: string;
  body: string;
  signature?: boolean;
  ctaText?: string;
  ctaNote?: string;
}) {
  const {
    greeting = "Hi {{firstName}},",
    body,
    signature = true,
    ctaText,
    ctaNote,
  } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">${greeting}</h2>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              ${body}
            </td>
          </tr>
          
          ${
            ctaText
              ? `
          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">${ctaText}</a>
                  </td>
                </tr>
              </table>
              ${ctaNote ? `<p style="text-align: center; margin: 16px 0 0; color: #6b7280; font-size: 13px;">${ctaNote}</p>` : ""}
            </td>
          </tr>
          `
              : ""
          }
          
          ${
            signature
              ? `
          <!-- Signature -->
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
          `
              : ""
          }
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">You're receiving this because you requested information from us.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
