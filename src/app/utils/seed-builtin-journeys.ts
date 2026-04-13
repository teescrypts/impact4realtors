/**
 * Seed Built-in Journeys - REVISED
 *
 * Simple, realistic, linear flows that work with current execution engine
 * Each journey handles ONE specific lead capture scenario
 * Follow-up journeys can be created separately for different outcomes
 */

import mongoose from "mongoose";
import { Journey } from "../model/journey";

// Helper to generate unique node IDs
// const nodeId = (type: string, index: number) => `${type}_${index}`;

/**
 * Journey 1: Buyer Guide Follow-up
 *
 * Scenario: Lead downloads buyer guide PDF from website
 * Goal: Nurture and qualify the lead, schedule consultation
 * Entry: Tag "new lead" assigned
 */
const buyerGuideJourney = {
  name: "Buyer Guide Follow-up",
  contactType: "Buyer" as const,
  leadIntent: "Buyer Guide" as const,
  entryAction: {
    tagAction: {
      type: "assign" as const,
      tagName: "new lead",
    },
  },
  isBuiltIn: true,
  isEditable: false,
  isActive: false,
  builtInCategory: "buyer-guide",
  entryNodeId: "entry_1",
  nodes: [
    {
      id: "entry_1",
      type: "entry",
      config: { type: "entry" },
    },
    // Immediate welcome email
    {
      id: "send_email_1",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Your Free Buyer's Guide + Next Steps",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Thank you for downloading our <strong>Complete Home Buyer's Guide</strong>! I hope you find it helpful as you navigate your home buying journey.</p>
              <p style="margin: 0 0 16px;">I noticed you're interested in learning more about purchasing a home. I'd love to help answer any questions you might have about:</p>
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Current market conditions in your area</li>
                <li style="margin-bottom: 8px;">Understanding the buying process</li>
                <li style="margin-bottom: 8px;">Financing and mortgage options</li>
                <li style="margin-bottom: 0;">What to look for in a property</li>
              </ul>
              <p style="margin: 0;">Would you be open to a quick <strong>15-minute call</strong> this week? I can share insights specific to your situation and help you take the next step.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Schedule a Call</a>
                  </td>
                </tr>
              </table>
              <p style="text-align: center; margin: 16px 0 0; color: #6b7280; font-size: 13px;">Or simply reply to this email</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
        fromName: "{{agentName}}",
      },
    },
    // Urgent call reminder
    {
      id: "call_reminder_1",
      type: "call_reminder",
      config: {
        type: "call_reminder",
        message:
          "PRIORITY: New buyer guide download - {{firstName}} {{lastName}}. Call within 2-4 hours while interest is fresh. Qualify their timeline, budget, and preferred areas. Schedule consultation if serious.",
      },
    },
    // Wait 2 days for agent to make contact
    {
      id: "delay_1",
      type: "delay",
      config: { type: "delay", duration: 2, unit: "days" },
    },
    // Follow-up email
    {
      id: "send_email_2",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Quick Question About Your Home Search",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I wanted to follow up on the Buyer's Guide I sent a few days ago.</p>
              <p style="margin: 0 0 16px;">I know you're probably still in the research phase, and that's <em>perfectly normal</em>. Buying a home is a big decision, and it's smart to take your time learning about the process.</p>
              <p style="margin: 0 0 16px;">I'm here to help whenever you're ready. Even if you just have a quick question about:</p>
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">How much home you can afford</li>
                <li style="margin-bottom: 8px;">Which neighborhoods might fit your lifestyle</li>
                <li style="margin-bottom: 8px;">What the timeline typically looks like</li>
                <li style="margin-bottom: 0;">Current interest rates and market conditions</li>
              </ul>
              <p style="margin: 0;">Feel free to reply to this email or give me a call at <a href="tel:{{agentPhone}}" style="color: #3b82f6; text-decoration: none;">{{agentPhone}}</a>. No pressure - just here to help!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // Check engagement
    {
      id: "condition_1",
      type: "condition",
      config: { type: "condition", checkType: "email_opened" },
    },
    // YES: They opened email - high interest
    {
      id: "delay_2",
      type: "delay",
      config: { type: "delay", duration: 3, unit: "days" },
    },
    {
      id: "send_email_3",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Ready to Start Your Home Search?",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I noticed you've been reading through the information I sent - that's great! It shows you're serious about finding the right home.</p>
              <p style="margin: 0 0 16px;">Many of my clients appreciate having someone in their corner who can:</p>
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">✓ Send you properties that match your criteria <em>(before they hit the public sites)</em></li>
                <li style="margin-bottom: 8px;">✓ Guide you through the offer and negotiation process</li>
                <li style="margin-bottom: 8px;">✓ Connect you with trusted mortgage professionals</li>
                <li style="margin-bottom: 0;">✓ Help you avoid common first-time buyer mistakes</li>
              </ul>
              <p style="margin: 0 0 16px;">I've helped many buyers just like you find their dream home. Would you like to schedule a brief call to discuss what you're looking for?</p>
              <p style="margin: 0 0 8px; font-weight: 600;">I have availability this week:</p>
              <ul style="margin: 0 0 16px; padding-left: 20px; list-style: none;">
                <li style="margin-bottom: 4px;">📅 Tuesday 2-4pm</li>
                <li style="margin-bottom: 4px;">📅 Wednesday 10am-12pm</li>
                <li style="margin-bottom: 0;">📅 Thursday 3-5pm</li>
              </ul>
              <p style="margin: 0;">Just reply with what works for you!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Let's Schedule a Call</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    {
      id: "meeting_reminder_1",
      type: "meeting_reminder",
      config: {
        type: "meeting_reminder",
        title: "Schedule buyer consultation - {{firstName}} {{lastName}}",
        message:
          "Lead is engaged (opened multiple emails). High conversion potential. Call to schedule consultation and start property search. Update tag to 'needs consultation' or 'contacted' based on outcome.",
      },
    },
    // NO: They didn't open - lower interest
    {
      id: "delay_3",
      type: "delay",
      config: { type: "delay", duration: 5, unit: "days" },
    },
    {
      id: "send_email_4",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Still Thinking About Buying?",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I wanted to check in one more time.</p>
              <p style="margin: 0 0 16px;">I know everyone's timeline is different. Some people are ready to start looking right away, while others are still a few months out from making a move.</p>
              <p style="margin: 0 0 16px;">Wherever you are in the process, I'm here to help. Whether that's:</p>
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Answering quick questions <em>(no commitment needed)</em></li>
                <li style="margin-bottom: 8px;">Helping you understand your budget and options</li>
                <li style="margin-bottom: 8px;">Keeping you updated on market trends in your area</li>
                <li style="margin-bottom: 0;">Starting the serious search when you're ready</li>
              </ul>
              <p style="margin: 0;">No pressure at all - just wanted you to know I'm here when the time is right for you.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    {
      id: "sms_reminder_1",
      type: "sms_reminder",
      config: {
        type: "sms_reminder",
        message:
          "Low engagement from buyer guide lead. Consider friendly text message or final call attempt. If no response, update tag to 'cold lead' and add to long-term nurture list.",
      },
    },
  ],
  edges: [
    { id: "e1", source: "entry_1", target: "send_email_1" },
    { id: "e2", source: "send_email_1", target: "call_reminder_1" },
    { id: "e3", source: "call_reminder_1", target: "delay_1" },
    { id: "e4", source: "delay_1", target: "send_email_2" },
    { id: "e5", source: "send_email_2", target: "condition_1" },
    // YES branch
    { id: "e6", source: "condition_1", target: "delay_2", label: "yes" },
    { id: "e7", source: "delay_2", target: "send_email_3" },
    { id: "e8", source: "send_email_3", target: "meeting_reminder_1" },
    // NO branch
    { id: "e9", source: "condition_1", target: "delay_3", label: "no" },
    { id: "e10", source: "delay_3", target: "send_email_4" },
    { id: "e11", source: "send_email_4", target: "sms_reminder_1" },
  ],
};

/**
 * Journey 2: House Tour Follow-up
 *
 * Scenario: Lead books 45-min house tour on website
 * Goal: Confirm tour, conduct showing, gather feedback, continue search
 * Entry: Tag "property viewing scheduled" assigned
 */
const houseTourJourney = {
  name: "House Tour Follow-up",
  contactType: "Buyer" as const,
  leadIntent: "House Tour" as const,
  entryAction: {
    tagAction: {
      type: "assign" as const,
      tagName: "property viewing scheduled",
    },
  },
  isBuiltIn: true,
  isEditable: false,
  isActive: false,
  builtInCategory: "house-tour",
  entryNodeId: "entry_1",
  nodes: [
    {
      id: "entry_1",
      type: "entry",
      config: { type: "entry" },
    },
    // Immediate confirmation email
    {
      id: "send_email_1",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Your House Tour is Confirmed!",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Thank you for requesting a property tour! I'm excited to show you around and help you find the perfect home.</p>
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #1e40af;">Tour Details</p>
                <p style="margin: 0 0 4px; color: #1e3a8a;">📍 {{propertyAddress}}</p>
                <p style="margin: 0 0 4px; color: #1e3a8a;">📅 {{appointmentDate}}</p>
                <p style="margin: 0; color: #1e3a8a;">🕐 {{appointmentTime}}</p>
              </div>
              <p style="margin: 0 0 16px;">To make the most of our time together, I'd love to know:</p>
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">What features are most important to you?</li>
                <li style="margin-bottom: 8px;">Are there any deal-breakers I should know about?</li>
                <li style="margin-bottom: 0;">Is there anything specific you'd like to see during the tour?</li>
              </ul>
              <p style="margin: 0;">Feel free to reply with any questions or special requests. Looking forward to meeting you!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Reply to This Email</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // Urgent reminder to agent
    {
      id: "meeting_reminder_1",
      type: "meeting_reminder",
      config: {
        type: "meeting_reminder",
        title: "CONFIRM house tour - {{firstName}} {{lastName}}",
        message:
          "House tour scheduled for {{appointmentDate}} at {{appointmentTime}}. Call lead within 1 hour to confirm, get contact preferences, and send property details/directions. Add calendar reminder for tour.",
      },
    },
    // Day before reminder
    {
      id: "delay_1",
      type: "delay",
      config: { type: "delay", duration: 1, unit: "days" },
    },
    {
      id: "send_email_2",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Reminder: Your Property Tour Tomorrow",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Just a friendly reminder about your property tour tomorrow!</p>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #92400e;">Quick Reminders:</p>
                <p style="margin: 0 0 4px; color: #78350f;">📝 Bring a notebook or use your phone to take notes</p>
                <p style="margin: 0 0 4px; color: #78350f;">📸 Feel free to take photos (I'll help)</p>
                <p style="margin: 0 0 4px; color: #78350f;">❓ Come prepared with questions</p>
                <p style="margin: 0; color: #78350f;">👟 Wear comfortable shoes</p>
              </div>
              <p style="margin: 0 0 16px;">If you need to reschedule or have any last-minute questions, just give me a call at <a href="tel:{{agentPhone}}" style="color: #3b82f6; text-decoration: none;">{{agentPhone}}</a>.</p>
              <p style="margin: 0;">See you tomorrow!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // After tour follow-up
    {
      id: "delay_2",
      type: "delay",
      config: { type: "delay", duration: 1, unit: "days" },
    },
    {
      id: "send_email_3",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "What Did You Think of {{propertyAddress}}?",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I hope you enjoyed touring the property! I'd love to hear your thoughts.</p>
              <p style="margin: 0 0 16px;">Please take a moment to let me know:</p>
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">💭 What did you think of the property?</li>
                <li style="margin-bottom: 8px;">⭐ What features did you love?</li>
                <li style="margin-bottom: 8px;">⚠️ Were there any concerns?</li>
                <li style="margin-bottom: 0;">🏠 Would you like to see other similar properties?</li>
              </ul>
              <p style="margin: 0 0 16px;">If you're interested in making an offer, I can walk you through the process and help you craft a competitive proposal.</p>
              <p style="margin: 0;">I'm here to answer any questions and help you find the perfect home!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Share Your Feedback</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // Check engagement
    {
      id: "condition_1",
      type: "condition",
      config: { type: "condition", checkType: "email_opened" },
    },
    // YES: Engaged
    {
      id: "delay_3",
      type: "delay",
      config: { type: "delay", duration: 2, unit: "days" },
    },
    {
      id: "call_reminder_1",
      type: "call_reminder",
      config: {
        type: "call_reminder",
        message:
          "Lead viewed property and is engaged. HIGH PRIORITY: Call to discuss feedback, answer questions, and determine next steps. Options: Schedule second viewing, show comparables, discuss offer, or update search criteria. Update tag based on outcome: 'actively searching', 'offer made', or 'viewed property'.",
      },
    },
    // NO: Not engaged
    {
      id: "delay_4",
      type: "delay",
      config: { type: "delay", duration: 5, unit: "days" },
    },
    {
      id: "sms_reminder_1",
      type: "sms_reminder",
      config: {
        type: "sms_reminder",
        message:
          "Lead toured property but hasn't responded. May have chosen another property or agent. Send friendly text or call to maintain relationship. If interested, schedule more viewings. If not, update tag to 'cold lead' or 'lost lead'.",
      },
    },
  ],
  edges: [
    { id: "e1", source: "entry_1", target: "send_email_1" },
    { id: "e2", source: "send_email_1", target: "meeting_reminder_1" },
    { id: "e3", source: "meeting_reminder_1", target: "delay_1" },
    { id: "e4", source: "delay_1", target: "send_email_2" },
    { id: "e5", source: "send_email_2", target: "delay_2" },
    { id: "e6", source: "delay_2", target: "send_email_3" },
    { id: "e7", source: "send_email_3", target: "condition_1" },
    // YES branch
    { id: "e8", source: "condition_1", target: "delay_3", label: "yes" },
    { id: "e9", source: "delay_3", target: "call_reminder_1" },
    // NO branch
    { id: "e10", source: "condition_1", target: "delay_4", label: "no" },
    { id: "e11", source: "delay_4", target: "sms_reminder_1" },
  ],
};

/**
 * Journey 3: Home Valuation Follow-up
 *
 * Scenario: Seller submits valuation request with property details
 * Goal: Prepare valuation, send report, discuss listing
 * Entry: Tag "needs valuation" assigned
 */
const homeValuationJourney = {
  name: "Home Valuation Follow-up",
  contactType: "Seller" as const,
  leadIntent: "Home valuation" as const,
  entryAction: {
    tagAction: {
      type: "assign" as const,
      tagName: "needs valuation",
    },
  },
  isBuiltIn: true,
  isEditable: false,
  isActive: false,
  builtInCategory: "home-valuation",
  entryNodeId: "entry_1",
  nodes: [
    {
      id: "entry_1",
      type: "entry",
      config: { type: "entry" },
    },
    // Immediate acknowledgment
    {
      id: "send_email_1",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "We're Preparing Your Home Valuation",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Thank you for requesting a valuation for your property! I'm excited to help you understand your home's current market value.</p>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 12px; font-weight: 600; color: #1e40af;">Here's what happens next:</p>
                <p style="margin: 0 0 6px; color: #1e3a8a;">1️⃣ I'll analyze recent sales of comparable homes in your area</p>
                <p style="margin: 0 0 6px; color: #1e3a8a;">2️⃣ Review current market trends and conditions</p>
                <p style="margin: 0 0 6px; color: #1e3a8a;">3️⃣ Consider your property's unique features and updates</p>
                <p style="margin: 0; color: #1e3a8a;">4️⃣ Prepare a detailed valuation report (typically ready in 24-48 hours)</p>
              </div>
              
              <p style="margin: 0 0 16px;">In the meantime, I'd love to learn more about your plans:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">What's your timeline for potentially selling?</li>
                <li style="margin-bottom: 8px;">Are there specific improvements or updates you've made to the home?</li>
                <li style="margin-bottom: 0;">What prompted you to request a valuation?</li>
              </ul>
              
              <p style="margin: 0;">I'll give you a call in the next few hours to discuss your property and answer any questions you might have.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // Urgent task for agent
    {
      id: "meeting_reminder_1",
      type: "meeting_reminder",
      config: {
        type: "meeting_reminder",
        title: "Complete home valuation - {{firstName}} {{lastName}}",
        message:
          "PRIORITY: Seller requested home valuation. Action needed: 1) Call seller within 2-4 hours to discuss property 2) Gather additional details if needed 3) Complete CMA within 24-48 hours 4) Send valuation via dashboard (this will auto-update tag to 'valuation report sent')",
      },
    },
    // Wait for agent to send valuation (trigger)
    {
      id: "trigger_1",
      type: "trigger",
      config: {
        type: "trigger",
        waitForTag: "valuation report sent",
        description: "Waiting for agent to send valuation report via dashboard",
      },
    },
    // Give them time to review
    {
      id: "delay_1",
      type: "delay",
      config: { type: "delay", duration: 3, unit: "days" },
    },
    // Follow-up on valuation
    {
      id: "send_email_2",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Did You Have a Chance to Review Your Valuation?",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I hope you've had a chance to review the home valuation report I sent a few days ago.</p>
              
              <p style="margin: 0 0 16px;">I'd love to discuss the findings with you and answer any questions:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Does the valuation align with your expectations?</li>
                <li style="margin-bottom: 8px;">Would you like me to explain how I arrived at the estimated value?</li>
                <li style="margin-bottom: 0;">Are you considering moving forward with listing your home?</li>
              </ul>
              
              <p style="margin: 0 0 16px;">The report shows your home's value based on current market conditions, but there are several factors we can discuss that might help <strong>maximize your sale price</strong>:</p>
              
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 6px; color: #047857;">✓ Optimal timing for listing</p>
                <p style="margin: 0 0 6px; color: #047857;">✓ Strategic improvements that add value</p>
                <p style="margin: 0 0 6px; color: #047857;">✓ Pricing strategy to attract serious buyers</p>
                <p style="margin: 0; color: #047857;">✓ Marketing plan to reach the right audience</p>
              </div>
              
              <p style="margin: 0;">When would be a good time for a call? I'm happy to walk you through everything in detail.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Let's Discuss Your Report</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // Check engagement
    {
      id: "condition_1",
      type: "condition",
      config: { type: "condition", checkType: "email_opened" },
    },
    // YES: Interested
    {
      id: "delay_2",
      type: "delay",
      config: { type: "delay", duration: 2, unit: "days" },
    },
    {
      id: "send_email_3",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Ready to Discuss Listing Your Home?",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I noticed you've been reviewing the valuation report - that's great!</p>
              
              <p style="margin: 0 0 16px;">If you're considering listing your home, now would be an excellent time to discuss your next steps. I can help you:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Create a strategic pricing plan based on current market conditions</li>
                <li style="margin-bottom: 8px;">Prepare your home to show beautifully and attract top dollar</li>
                <li style="margin-bottom: 8px;">Develop a comprehensive marketing strategy</li>
                <li style="margin-bottom: 8px;">Navigate offers and negotiations to maximize your profit</li>
                <li style="margin-bottom: 0;">Handle all the details so you can focus on your next chapter</li>
              </ul>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 12px; font-weight: 600; color: #92400e;">30-Minute In-Home Consultation</p>
                <p style="margin: 0 0 8px; color: #78350f;">Many of my sellers appreciate understanding the complete process before making a decision. I'd love to schedule a time to meet at your property where I can:</p>
                <p style="margin: 0 0 4px; color: #78350f;">✓ Walk through and provide staging recommendations</p>
                <p style="margin: 0 0 4px; color: #78350f;">✓ Present a detailed marketing plan</p>
                <p style="margin: 0 0 4px; color: #78350f;">✓ Answer all your questions</p>
                <p style="margin: 0; color: #78350f;">✓ Discuss timeline and next steps</p>
              </div>
              
              <p style="margin: 0;">Would you be available for a consultation this week or next?</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Schedule Consultation</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Looking forward to working with you,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    {
      id: "call_reminder_1",
      type: "call_reminder",
      config: {
        type: "call_reminder",
        message:
          "Seller is engaged with valuation. HIGH CONVERSION POTENTIAL. Call to schedule in-person consultation and listing presentation. Prepare: CMA, marketing plan, staging suggestions. Update tag based on outcome: 'ready to list', 'considering listing', or 'contacted'.",
      },
    },
    // NO: Not engaged
    {
      id: "delay_3",
      type: "delay",
      config: { type: "delay", duration: 7, unit: "days" },
    },
    {
      id: "sms_reminder_1",
      type: "sms_reminder",
      config: {
        type: "sms_reminder",
        message:
          "Seller hasn't engaged with valuation follow-up. May not be ready to sell yet. Send friendly text or call to check if they have questions. If no interest, update tag to 'cold lead' and add to quarterly market update list.",
      },
    },
  ],
  edges: [
    { id: "e1", source: "entry_1", target: "send_email_1" },
    { id: "e2", source: "send_email_1", target: "meeting_reminder_1" },
    { id: "e3", source: "meeting_reminder_1", target: "trigger_1" },
    { id: "e4", source: "trigger_1", target: "delay_1" },
    { id: "e5", source: "delay_1", target: "send_email_2" },
    { id: "e6", source: "send_email_2", target: "condition_1" },
    // YES branch
    { id: "e7", source: "condition_1", target: "delay_2", label: "yes" },
    { id: "e8", source: "delay_2", target: "send_email_3" },
    { id: "e9", source: "send_email_3", target: "call_reminder_1" },
    // NO branch
    { id: "e10", source: "condition_1", target: "delay_3", label: "no" },
    { id: "e11", source: "delay_3", target: "sms_reminder_1" },
  ],
};

/**
 * Journey 4: General Inquiry Follow-up
 *
 * Scenario: Lead submits contact form with general question
 * Goal: Qualify lead quickly, determine buyer vs seller, schedule consultation
 * Entry: Tag "new lead" assigned
 */
const generalInquiryJourney = {
  name: "General Inquiry Follow-up",
  contactType: "Inquiry" as const,
  leadIntent: null,
  entryAction: {
    tagAction: {
      type: "assign" as const,
      tagName: "new lead",
    },
  },
  isBuiltIn: true,
  isEditable: false,
  isActive: false,
  builtInCategory: "general-inquiry",
  entryNodeId: "entry_1",
  nodes: [
    {
      id: "entry_1",
      type: "entry",
      config: { type: "entry" },
    },
    // Immediate response
    {
      id: "send_email_1",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Thanks for Reaching Out - Let's Connect!",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Thank you for contacting me! I received your message and I'm here to help with any real estate questions you have.</p>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0; font-weight: 600; color: #1e40af;">📞 I'll be giving you a call within the next 1-2 hours to better understand your needs and see how I can assist you.</p>
              </div>
              
              <p style="margin: 0 0 16px;">In the meantime, feel free to reply to this email with any additional details:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Are you looking to buy or sell (or both)?</li>
                <li style="margin-bottom: 8px;">What's your general timeline?</li>
                <li style="margin-bottom: 8px;">What area are you interested in?</li>
                <li style="margin-bottom: 0;">Any specific questions I can prepare to answer?</li>
              </ul>
              
              <p style="margin: 0;">I'm looking forward to speaking with you soon!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // URGENT call reminder
    {
      id: "call_reminder_1",
      type: "call_reminder",
      config: {
        type: "call_reminder",
        message:
          "URGENT: New general inquiry from {{firstName}} {{lastName}}. Call within 1-2 hours while interest is hot. Qualify: buyer or seller? Timeline? Budget/price range? Specific needs? Update category to 'buyer' or 'seller' and assign appropriate tag based on conversation.",
      },
    },
    // Wait for initial contact
    {
      id: "delay_1",
      type: "delay",
      config: { type: "delay", duration: 1, unit: "days" },
    },
    // Follow-up
    {
      id: "send_email_2",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Following Up on Your Inquiry",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I wanted to follow up on your recent inquiry. I tried reaching you earlier but haven't been able to connect yet.</p>
              
              <p style="margin: 0 0 16px;">I'd really love to help you with your real estate needs. Whether you're:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px; list-style: none;">
                <li style="margin-bottom: 8px;">🏠 Looking to buy your first home</li>
                <li style="margin-bottom: 8px;">📈 Thinking about selling your current property</li>
                <li style="margin-bottom: 8px;">💰 Curious about market values in your area</li>
                <li style="margin-bottom: 0;">📊 Just exploring your options</li>
              </ul>
              
              <p style="margin: 0 0 16px;">I'm here to provide guidance with <strong>no pressure or obligation</strong>.</p>
              
              <p style="margin: 0 0 16px;">When would be a good time for a quick <strong>10-minute call</strong>? You can also:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Reply to this email with your availability</li>
                <li style="margin-bottom: 8px;">Call or text me directly at <a href="tel:{{agentPhone}}" style="color: #3b82f6; text-decoration: none;">{{agentPhone}}</a></li>
                <li style="margin-bottom: 0;">Book a time on my calendar: [calendar link]</li>
              </ul>
              
              <p style="margin: 0;">Looking forward to connecting!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Reply to Schedule</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // Check engagement
    {
      id: "condition_1",
      type: "condition",
      config: { type: "condition", checkType: "email_opened" },
    },
    // YES: Still interested
    {
      id: "delay_2",
      type: "delay",
      config: { type: "delay", duration: 2, unit: "days" },
    },
    {
      id: "send_email_3",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "I'm Here When You're Ready",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I know you're busy, so I'll keep this brief.</p>
              
              <p style="margin: 0 0 16px;">I'm still here and happy to help whenever you're ready to discuss your real estate needs. <strong>No pressure</strong> - I understand everyone has their own timeline.</p>
              
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 0 0 16px;">
                <p style="margin: 0 0 12px; font-weight: 600; color: #111827;">Here's how I typically help my clients:</p>
                
                <div style="margin-bottom: 12px;">
                  <p style="margin: 0 0 4px; font-weight: 600; color: #3b82f6;">✓ Buyers:</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">I find properties before they hit the market and guide you through the entire process</p>
                </div>
                
                <div style="margin-bottom: 12px;">
                  <p style="margin: 0 0 4px; font-weight: 600; color: #3b82f6;">✓ Sellers:</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">I provide free market valuations and create custom marketing strategies</p>
                </div>
                
                <div>
                  <p style="margin: 0 0 4px; font-weight: 600; color: #3b82f6;">✓ Curious:</p>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">I'm always happy to answer questions, even if you're just exploring</p>
                </div>
              </div>
              
              <p style="margin: 0;">Feel free to reach out whenever the time is right for you.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    {
      id: "meeting_reminder_1",
      type: "meeting_reminder",
      config: {
        type: "meeting_reminder",
        title: "Final follow-up attempt - {{firstName}} {{lastName}}",
        message:
          "Lead opened emails but hasn't responded. Make final call/text attempt. If interested, schedule consultation and update category/tag. If no response, update tag to 'cold lead' for quarterly check-ins.",
      },
    },
    // NO: Not interested
    {
      id: "delay_3",
      type: "delay",
      config: { type: "delay", duration: 3, unit: "days" },
    },
    {
      id: "sms_reminder_1",
      type: "sms_reminder",
      config: {
        type: "sms_reminder",
        message:
          "General inquiry lead with no engagement. Try one final text message or call. If still no response, update tag to 'cold lead' or 'lost lead' and archive from active follow-up.",
      },
    },
  ],
  edges: [
    { id: "e1", source: "entry_1", target: "send_email_1" },
    { id: "e2", source: "send_email_1", target: "call_reminder_1" },
    { id: "e3", source: "call_reminder_1", target: "delay_1" },
    { id: "e4", source: "delay_1", target: "send_email_2" },
    { id: "e5", source: "send_email_2", target: "condition_1" },
    // YES branch
    { id: "e6", source: "condition_1", target: "delay_2", label: "yes" },
    { id: "e7", source: "delay_2", target: "send_email_3" },
    { id: "e8", source: "send_email_3", target: "meeting_reminder_1" },
    // NO branch
    { id: "e9", source: "condition_1", target: "delay_3", label: "no" },
    { id: "e10", source: "delay_3", target: "sms_reminder_1" },
  ],
};

/**
 * Journey 5: Mortgage Inquiry Follow-up
 *
 * Scenario: Lead uses mortgage calculator, needs more info
 * Goal: Connect with lender, get pre-approved, start property search
 * Entry: Tag "needs consultation" assigned
 */
const mortgageInquiryJourney = {
  name: "Mortgage Inquiry Follow-up",
  contactType: "Buyer" as const,
  leadIntent: "Mortgage Inquiry" as const,
  entryAction: {
    tagAction: {
      type: "assign" as const,
      tagName: "needs consultation",
    },
  },
  isBuiltIn: true,
  isEditable: false,
  isActive: false,
  builtInCategory: "mortgage-inquiry",
  entryNodeId: "entry_1",
  nodes: [
    {
      id: "entry_1",
      type: "entry",
      config: { type: "entry" },
    },
    // Immediate response
    {
      id: "send_email_1",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Let's Discuss Your Financing Options",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Your appointment is confirmed! 🎉 I'm looking forward to speaking with you about your <strong>mortgage financing</strong> options.</p>

              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 0 0 24px; border-radius: 4px;">
                <p style="margin: 0 0 6px; font-weight: 600; color: #1e40af;">📅 Your Upcoming Appointment</p>
                <p style="margin: 0; color: #1d4ed8;">Date & time details will be in your calendar invite.</p>
              </div>

              <p style="margin: 0 0 16px;">To make the most of our time together, here's what we'll cover on our call:</p>

              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">💰 How much home you can comfortably afford</li>
                <li style="margin-bottom: 8px;">📊 Loan programs that fit your situation (Conventional, FHA, VA, etc.)</li>
                <li style="margin-bottom: 8px;">✅ What the pre-approval process looks like and how fast it can move</li>
                <li style="margin-bottom: 0;">🔒 How to lock in a competitive interest rate</li>
              </ul>

              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #065f46;">💡 To prepare for our call, it may help to have:</p>
                <p style="margin: 0 0 4px; color: #047857;">• A rough sense of your target home price or monthly budget</p>
                <p style="margin: 0 0 4px; color: #047857;">• Your employment situation (full-time, self-employed, etc.)</p>
                <p style="margin: 0 0 4px; color: #047857;">• Any questions you've been wanting to ask about the mortgage process</p>
                <p style="margin: 0; color: #047857;">• Your ideal timeline for buying</p>
              </div>

              <p style="margin: 0 0 16px;">No need to have everything figured out — that's exactly what this call is for. I'm here to make the process clear and stress-free.</p>

              <p style="margin: 0;">If anything comes up and you need to reschedule, feel free to reach out directly. See you soon!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Contact Me Anytime</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; background-color: #f9fafb; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">You're receiving this because you booked an appointment with us.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      },
    },
    // Priority call
    {
      id: "meeting_reminder_1",
      type: "meeting_reminder",
      config: {
        type: "meeting_reminder",
        title: "Mortgage inquiry consultation - {{firstName}} {{lastName}}",
        message:
          "PRIORITY: Mortgage inquiry lead. Call within 4 hours. Assess: Budget range, down payment, credit situation, timeline. Connect with preferred lender for pre-approval. Update tag to 'pre-approval in progress' once lender intro is made.",
      },
    },
    // Wait for lender connection
    {
      id: "delay_1",
      type: "delay",
      config: { type: "delay", duration: 2, unit: "days" },
    },
    // Check in on pre-approval
    {
      id: "send_email_2",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "How's Your Pre-Approval Going?",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I wanted to check in on how your mortgage pre-approval is progressing.</p>
              
              <p style="margin: 0 0 16px;">Have you had a chance to connect with the lender? Do you have any questions about:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">The documents they're requesting</li>
                <li style="margin-bottom: 8px;">Your loan options and rates</li>
                <li style="margin-bottom: 8px;">The timeline for approval</li>
                <li style="margin-bottom: 0;">Next steps in the process</li>
              </ul>
              
              <p style="margin: 0 0 16px;">Getting pre-approved is exciting because it means you're that much closer to finding your perfect home!</p>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #1e40af;">Once you're pre-approved, we can:</p>
                <p style="margin: 0 0 4px; color: #1e3a8a;">✓ Start showing you properties with confidence</p>
                <p style="margin: 0 0 4px; color: #1e3a8a;">✓ Move quickly when you find "the one"</p>
                <p style="margin: 0; color: #1e3a8a;">✓ Make strong offers that sellers take seriously</p>
              </div>
              
              <p style="margin: 0 0 16px;">Let me know if there's anything I can help with or if you have any questions.</p>
              
              <p style="margin: 0;">Looking forward to starting your home search!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // Wait for pre-approval completion (trigger)
    {
      id: "trigger_1",
      type: "trigger",
      config: {
        type: "trigger",
        waitForTag: "pre-approved",
        description: "Waiting for pre-approval to complete",
      },
    },
    // Celebrate and start search
    {
      id: "send_email_3",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "🎉 Congratulations on Your Pre-Approval!",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px; margin: 0 0 24px; border-radius: 8px; text-align: center;">
                <p style="margin: 0; font-size: 32px;">🎉</p>
                <p style="margin: 8px 0 0; color: #ffffff; font-size: 18px; font-weight: 700;">Congratulations on Your Pre-Approval!</p>
              </div>
              
              <p style="margin: 0 0 16px;">This is a <strong>huge step forward</strong> in your home buying journey.</p>
              
              <p style="margin: 0 0 16px;">You're now in an excellent position because:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">✅ Sellers will take your offers seriously</li>
                <li style="margin-bottom: 8px;">✅ You know exactly what you can afford</li>
                <li style="margin-bottom: 8px;">✅ You can move quickly when you find the right home</li>
                <li style="margin-bottom: 0;">✅ You're ready to compete in today's market</li>
              </ul>
              
              <p style="margin: 0 0 16px; font-size: 17px; font-weight: 600; color: #111827;">Now for the fun part - let's find your perfect home!</p>
              
              <p style="margin: 0 0 16px;">I'd love to schedule a time to discuss:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">What neighborhoods interest you most</li>
                <li style="margin-bottom: 8px;">Your must-have features and deal-breakers</li>
                <li style="margin-bottom: 8px;">Properties that match your criteria and budget</li>
                <li style="margin-bottom: 0;">Timeline for starting property tours</li>
              </ul>
              
              <p style="margin: 0 0 16px;">I've already started researching homes in your price range. I'm excited to show you some great options!</p>
              
              <p style="margin: 0;">When are you available for a quick call to kick off your search?</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Let's Start Your Search!</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Congratulations again!</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    {
      id: "meeting_reminder_2",
      type: "meeting_reminder",
      config: {
        type: "meeting_reminder",
        title: "Start property search - {{firstName}} {{lastName}}",
        message:
          "Buyer is pre-approved and ready! HIGH PRIORITY: Call immediately to schedule property viewings. Prepare curated list of homes matching their criteria and budget. Strike while motivation is high. Update tag to 'actively searching'.",
      },
    },
  ],
  edges: [
    { id: "e1", source: "entry_1", target: "send_email_1" },
    { id: "e2", source: "send_email_1", target: "meeting_reminder_1" },
    { id: "e3", source: "meeting_reminder_1", target: "delay_1" },
    { id: "e4", source: "delay_1", target: "send_email_2" },
    { id: "e5", source: "send_email_2", target: "trigger_1" },
    { id: "e6", source: "trigger_1", target: "send_email_3" },
    { id: "e7", source: "send_email_3", target: "meeting_reminder_2" },
  ],
};

/**
 * Journey 6: Seller Call Appointment Follow-up
 *
 * Scenario: Seller books 15-min call appointment
 * Goal: Conduct call, assess listing potential, provide next steps
 * Entry: Tag "new lead" assigned
 */
const sellerCallJourney = {
  name: "Seller Call Appointment Follow-up",
  contactType: "Seller" as const,
  leadIntent: "Sell Call Appointment" as const,
  entryAction: {
    tagAction: {
      type: "assign" as const,
      tagName: "new lead",
    },
  },
  isBuiltIn: true,
  isEditable: false,
  isActive: false,
  builtInCategory: "seller-call",
  entryNodeId: "entry_1",
  nodes: [
    {
      id: "entry_1",
      type: "entry",
      config: { type: "entry" },
    },
    // Confirmation email
    {
      id: "send_email_1",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Your Call is Scheduled - What to Expect",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Thank you for scheduling a call with me! I'm looking forward to learning about your property and discussing how I can help you achieve your selling goals.</p>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 12px; font-weight: 600; color: #1e40af;">📞 Call Details:</p>
                <p style="margin: 0 0 4px; color: #1e3a8a;"><strong>Date:</strong> {{appointmentDate}}</p>
                <p style="margin: 0 0 4px; color: #1e3a8a;"><strong>Time:</strong> {{appointmentTime}}</p>
                <p style="margin: 0 0 4px; color: #1e3a8a;"><strong>Duration:</strong> 15 minutes</p>
                <p style="margin: 0; color: #1e3a8a;"><strong>I'll call:</strong> {{phone}}</p>
              </div>
              
              <p style="margin: 0 0 16px;">To make the most of our time together, here are some things to think about before our call:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Your timeline for selling (flexible or specific date?)</li>
                <li style="margin-bottom: 8px;">Your goals for the sale (price, speed, convenience?)</li>
                <li style="margin-bottom: 8px;">Any questions about the selling process</li>
                <li style="margin-bottom: 0;">Recent improvements or updates to your home</li>
              </ul>
              
              <p style="margin: 0 0 16px;">I'll have initial market insights prepared based on your area, and I'm happy to answer any questions you have about:</p>
              
              <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; margin: 0 0 16px;">
                <p style="margin: 0 0 6px; color: #374151;">✓ Current market conditions</p>
                <p style="margin: 0 0 6px; color: #374151;">✓ What buyers are looking for</p>
                <p style="margin: 0 0 6px; color: #374151;">✓ The selling process and timeline</p>
                <p style="margin: 0; color: #374151;">✓ How to maximize your home's value</p>
              </div>
              
              <p style="margin: 0;">Looking forward to our conversation!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // Agent preparation reminder
    {
      id: "meeting_reminder_1",
      type: "meeting_reminder",
      config: {
        type: "meeting_reminder",
        title: "Prepare for seller call - {{firstName}} {{lastName}}",
        message:
          "Seller call scheduled for {{appointmentDate}} at {{appointmentTime}}. PREPARE: Research property/neighborhood, pull recent comps, review market trends. SET CALENDAR REMINDER. After call, update tag based on outcome: 'contacted', 'ready to list', 'considering listing', or 'needs valuation'.",
      },
    },
    // Day before reminder
    {
      id: "delay_1",
      type: "delay",
      config: { type: "delay", duration: 1, unit: "days" },
    },
    {
      id: "send_email_2",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Reminder: Our Call Tomorrow",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Just a quick reminder about our call tomorrow!</p>
              
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #92400e;">📞 Call Details:</p>
                <p style="margin: 0 0 4px; color: #78350f;"><strong>Time:</strong> {{appointmentTime}} on {{appointmentDate}}</p>
                <p style="margin: 0; color: #78350f;"><strong>I'll be calling:</strong> {{phone}}</p>
              </div>
              
              <p style="margin: 0 0 16px;">I've prepared some <strong>market insights specific to your area</strong> that I'm excited to share with you.</p>
              
              <p style="margin: 0;">If anything comes up and you need to reschedule, just let me know. Otherwise, I'll talk to you tomorrow!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Looking forward to it,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // After call follow-up
    {
      id: "delay_2",
      type: "delay",
      config: { type: "delay", duration: 1, unit: "days" },
    },
    {
      id: "send_email_3",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Great Speaking with You!",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">Thank you for taking the time to speak with me yesterday about your property. I really enjoyed learning about your home and your selling goals.</p>
              
              <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 12px; font-weight: 600; color: #065f46;">As we discussed:</p>
                <p style="margin: 0 0 6px; color: #047857;">• <strong>Your timeline:</strong> [Based on conversation]</p>
                <p style="margin: 0 0 6px; color: #047857;">• <strong>Your goals:</strong> [Based on conversation]</p>
                <p style="margin: 0; color: #047857;">• <strong>Next steps:</strong> [Based on conversation]</p>
              </div>
              
              <p style="margin: 0 0 16px;">I'm preparing some additional information for you:</p>
              
              <ul style="margin: 0 0 16px; padding-left: 20px; list-style: none;">
                <li style="margin-bottom: 8px;">📊 Detailed market analysis for your area</li>
                <li style="margin-bottom: 8px;">📋 Comparable sales data</li>
                <li style="margin-bottom: 8px;">📝 Pre-listing preparation checklist</li>
                <li style="margin-bottom: 0;">📈 Strategic pricing recommendations</li>
              </ul>
              
              <p style="margin: 0 0 16px;">I'll have this ready within the next few days.</p>
              
              <p style="margin: 0 0 16px;">In the meantime, if you have any questions or if anything comes to mind that we didn't cover in our call, don't hesitate to reach out.</p>
              
              <p style="margin: 0;">I'm here to help make this process as <strong>smooth and profitable</strong> as possible for you!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Best regards,</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    // Check engagement
    {
      id: "condition_1",
      type: "condition",
      config: { type: "condition", checkType: "email_opened" },
    },
    // YES: Interested in next steps
    {
      id: "delay_3",
      type: "delay",
      config: { type: "delay", duration: 3, unit: "days" },
    },
    {
      id: "send_email_4",
      type: "send_email",
      config: {
        type: "send_email",
        subject: "Ready to Discuss Your Listing Strategy?",
        emailContent: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f7fa;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">Hi {{firstName}},</h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px; color: #374151; font-size: 15px; line-height: 1.6;">
              <p style="margin: 0 0 16px;">I've completed my research on your property and the current market conditions in your area. <strong>The insights are really interesting!</strong></p>
              
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 0 0 16px; border-radius: 4px;">
                <p style="margin: 0 0 12px; font-weight: 600; color: #1e40af;">I'd love to schedule a time to meet at your property where I can:</p>
                <p style="margin: 0 0 6px; color: #1e3a8a;">✓ Walk through your home and provide professional staging advice</p>
                <p style="margin: 0 0 6px; color: #1e3a8a;">✓ Present a detailed comparative market analysis</p>
                <p style="margin: 0 0 6px; color: #1e3a8a;">✓ Share a comprehensive marketing strategy</p>
                <p style="margin: 0 0 6px; color: #1e3a8a;">✓ Discuss optimal pricing and timing</p>
                <p style="margin: 0; color: #1e3a8a;">✓ Answer all your questions about the process</p>
              </div>
              
              <p style="margin: 0 0 16px;">This meeting typically takes <strong>30-45 minutes</strong>, and there's absolutely <em>no obligation</em>. My goal is to provide you with all the information you need to make the best decision for your situation.</p>
              
              <p style="margin: 0 0 8px; font-weight: 600;">When would work best for you?</p>
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                <li style="margin-bottom: 4px;">This week: [Availability]</li>
                <li style="margin-bottom: 0;">Next week: [Availability]</li>
              </ul>
              
              <p style="margin: 0;">Or feel free to suggest a time that works better for you.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 32px 32px;">
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 6px; text-align: center;">
                    <a href="mailto:{{agentEmail}}" style="display: inline-block; padding: 14px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px;">Schedule My Consultation</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px 32px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #111827; font-weight: 600; font-size: 15px;">Looking forward to working together!</p>
              <p style="margin: 0 0 4px; color: #111827; font-weight: 600; font-size: 15px;">{{agentName}}</p>
              <p style="margin: 0 0 2px; color: #6b7280; font-size: 14px;">📞 {{agentPhone}}</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">✉️ {{agentEmail}}</p>
            </td>
          </tr>
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
</html>`,
      },
    },
    {
      id: "meeting_reminder_2",
      type: "meeting_reminder",
      config: {
        type: "meeting_reminder",
        title: "Schedule listing presentation - {{firstName}} {{lastName}}",
        message:
          "Seller is engaged and interested. HIGH CONVERSION POTENTIAL. Call to schedule in-person presentation. PREPARE: Full CMA, marketing plan, staging checklist, listing agreement. Update tag after meeting: 'ready to list', 'property listed', or outcome-based.",
      },
    },
    // NO: Not ready yet
    {
      id: "delay_4",
      type: "delay",
      config: { type: "delay", duration: 7, unit: "days" },
    },
    {
      id: "call_reminder_1",
      type: "call_reminder",
      config: {
        type: "call_reminder",
        message:
          "Seller had call but low engagement with follow-ups. May not be ready to list yet. Make friendly check-in call to gauge interest level. If still interested, schedule consultation. If timeline pushed out, update tag to 'cold lead' for quarterly market updates.",
      },
    },
  ],
  edges: [
    { id: "e1", source: "entry_1", target: "send_email_1" },
    { id: "e2", source: "send_email_1", target: "meeting_reminder_1" },
    { id: "e3", source: "meeting_reminder_1", target: "delay_1" },
    { id: "e4", source: "delay_1", target: "send_email_2" },
    { id: "e5", source: "send_email_2", target: "delay_2" },
    { id: "e6", source: "delay_2", target: "send_email_3" },
    { id: "e7", source: "send_email_3", target: "condition_1" },
    // YES branch
    { id: "e8", source: "condition_1", target: "delay_3", label: "yes" },
    { id: "e9", source: "delay_3", target: "send_email_4" },
    { id: "e10", source: "send_email_4", target: "meeting_reminder_2" },
    // NO branch
    { id: "e11", source: "condition_1", target: "delay_4", label: "no" },
    { id: "e12", source: "delay_4", target: "call_reminder_1" },
  ],
};

/**
 * Main seed function
 * @param adminId - Admin ID to assign journeys to
 */
export async function seedBuiltInJourneys(
  adminId: string,
  isAgent: boolean,
  agent?: string,
) {
  try {
    const adminObjectId = adminId ? new mongoose.Types.ObjectId(adminId) : null;
    const agentObjectId = agent ? new mongoose.Types.ObjectId(agent) : null;

    // Check if built-in journeys already exist for this admin
    // const query = adminId
    //   ? { [isAgent ? "agent" : "admin"]: adminObjectId, isBuiltIn: true }
    //   : { admin: null, isBuiltIn: true };

    const query = isAgent
      ? { agent: agentObjectId, isBuiltIn: true }
      : { admin: adminObjectId, isBuiltIn: true };

    const existingBuiltIns = await Journey.countDocuments(query);

    if (existingBuiltIns > 0) {
      console.log(
        `Built-in journeys already seeded for ${adminId || "system"} (${existingBuiltIns} found)`,
      );
      return {
        success: true,
        message: "Built-in journeys already exist",
        count: existingBuiltIns,
      };
    }

    console.log(`Seeding built-in journeys for ${adminId || "system"}...`);

    const journeys = [
      buyerGuideJourney,
      houseTourJourney,
      homeValuationJourney,
      generalInquiryJourney,
      mortgageInquiryJourney,
      sellerCallJourney,
    ];

    // Update admin field for all journeys
    const journeysWithAdmin = journeys.map((journey) => ({
      ...journey,
      admin: adminObjectId,
      ...(isAgent && { agent: agentObjectId }),
    }));

    const result = await Journey.insertMany(journeysWithAdmin);

    console.log(
      `✅ Successfully seeded ${result.length} built-in journeys for ${adminId || "system"}:`,
    );
    journeys.forEach((j) => console.log(`   - ${j.name}`));

    return {
      success: true,
      message: "Built-in journeys seeded successfully",
      count: result.length,
      journeys: result,
    };
  } catch (error: any) {
    console.error("❌ Error seeding built-in journeys:", error);
    throw error;
  }
}
