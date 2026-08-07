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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "Thank you for downloading our **Complete Home Buyer's Guide**! I hope you find it helpful as you navigate your home buying journey." },
          { id: "b3", type: "paragraph", text: "I noticed you're interested in learning more about purchasing a home. I'd love to help answer any questions you might have about:" },
          {
            id: "b4",
            type: "bullets",
            items: [
              "Current market conditions in your area",
              "Understanding the buying process",
              "Financing and mortgage options",
              "What to look for in a property",
            ],
          },
          { id: "b5", type: "paragraph", text: "Would you be open to a quick **15-minute call** this week? I can share insights specific to your situation and help you take the next step." },
          {
            id: "b6",
            type: "button",
            label: "Schedule a Call",
            url: "mailto:{{agentEmail}}",
            note: "Or simply reply to this email",
          },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I wanted to follow up on the Buyer's Guide I sent a few days ago." },
          { id: "b3", type: "paragraph", text: "I know you're probably still in the research phase, and that's perfectly normal. Buying a home is a big decision, and it's smart to take your time learning about the process." },
          { id: "b4", type: "paragraph", text: "I'm here to help whenever you're ready. Even if you just have a quick question about:" },
          {
            id: "b5",
            type: "bullets",
            items: [
              "How much home you can afford",
              "Which neighborhoods might fit your lifestyle",
              "What the timeline typically looks like",
              "Current interest rates and market conditions",
            ],
          },
          { id: "b6", type: "paragraph", text: "Feel free to reply to this email or give me a call at [{{agentPhone}}](tel:{{agentPhone}}). No pressure - just here to help!" },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I noticed you've been reading through the information I sent - that's great! It shows you're serious about finding the right home." },
          { id: "b3", type: "paragraph", text: "Many of my clients appreciate having someone in their corner who can:" },
          {
            id: "b4",
            type: "bullets",
            items: [
              "✓ Send you properties that match your criteria (before they hit the public sites)",
              "✓ Guide you through the offer and negotiation process",
              "✓ Connect you with trusted mortgage professionals",
              "✓ Help you avoid common first-time buyer mistakes",
            ],
          },
          { id: "b5", type: "paragraph", text: "I've helped many buyers just like you find their dream home. Would you like to schedule a brief call to discuss what you're looking for?" },
          { id: "b6", type: "paragraph", text: "I have availability this week:" },
          {
            id: "b7",
            type: "bullets",
            items: [
              "📅 Tuesday 2-4pm",
              "📅 Wednesday 10am-12pm",
              "📅 Thursday 3-5pm",
            ],
          },
          { id: "b8", type: "paragraph", text: "Just reply with what works for you!" },
          {
            id: "b9",
            type: "button",
            label: "Let's Schedule a Call",
            url: "mailto:{{agentEmail}}",
          },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I wanted to check in one more time." },
          { id: "b3", type: "paragraph", text: "I know everyone's timeline is different. Some people are ready to start looking right away, while others are still a few months out from making a move." },
          { id: "b4", type: "paragraph", text: "Wherever you are in the process, I'm here to help. Whether that's:" },
          {
            id: "b5",
            type: "bullets",
            items: [
              "Answering quick questions (no commitment needed)",
              "Helping you understand your budget and options",
              "Keeping you updated on market trends in your area",
              "Starting the serious search when you're ready",
            ],
          },
          { id: "b6", type: "paragraph", text: "No pressure at all - just wanted you to know I'm here when the time is right for you." },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "Thank you for requesting a property tour! I'm excited to show you around and help you find the perfect home." },
          { id: "b3", type: "callout", tone: "info", text: "Tour Details\n📍 {{propertyAddress}}\n📅 {{appointmentDate}}\n🕐 {{appointmentTime}}" },
          { id: "b4", type: "paragraph", text: "To make the most of our time together, I'd love to know:" },
          {
            id: "b5",
            type: "bullets",
            items: [
              "What features are most important to you?",
              "Are there any deal-breakers I should know about?",
              "Is there anything specific you'd like to see during the tour?",
            ],
          },
          { id: "b6", type: "paragraph", text: "Feel free to reply with any questions or special requests. Looking forward to meeting you!" },
          {
            id: "b7",
            type: "button",
            label: "Reply to This Email",
            url: "mailto:{{agentEmail}}",
          },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "Just a friendly reminder about your property tour tomorrow!" },
          { id: "b3", type: "callout", tone: "warning", text: "Quick Reminders:\n📝 Bring a notebook or use your phone to take notes\n📸 Feel free to take photos (I'll help)\n❓ Come prepared with questions\n👟 Wear comfortable shoes" },
          { id: "b4", type: "paragraph", text: "If you need to reschedule or have any last-minute questions, just give me a call at [{{agentPhone}}](tel:{{agentPhone}})." },
          { id: "b5", type: "paragraph", text: "See you tomorrow!" },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I hope you enjoyed touring the property! I'd love to hear your thoughts." },
          { id: "b3", type: "paragraph", text: "Please take a moment to let me know:" },
          {
            id: "b4",
            type: "bullets",
            items: [
              "💭 What did you think of the property?",
              "⭐ What features did you love?",
              "⚠️ Were there any concerns?",
              "🏠 Would you like to see other similar properties?",
            ],
          },
          { id: "b5", type: "paragraph", text: "If you're interested in making an offer, I can walk you through the process and help you craft a competitive proposal." },
          { id: "b6", type: "paragraph", text: "I'm here to answer any questions and help you find the perfect home!" },
          {
            id: "b7",
            type: "button",
            label: "Share Your Feedback",
            url: "mailto:{{agentEmail}}",
          },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "Thank you for requesting a valuation for your property! I'm excited to help you understand your home's current market value." },
          { id: "b3", type: "callout", tone: "info", text: "Here's what happens next:\n1️⃣ I'll analyze recent sales of comparable homes in your area\n2️⃣ Review current market trends and conditions\n3️⃣ Consider your property's unique features and updates\n4️⃣ Prepare a detailed valuation report (typically ready in 24-48 hours)" },
          { id: "b4", type: "paragraph", text: "In the meantime, I'd love to learn more about your plans:" },
          {
            id: "b5",
            type: "bullets",
            items: [
              "What's your timeline for potentially selling?",
              "Are there specific improvements or updates you've made to the home?",
              "What prompted you to request a valuation?",
            ],
          },
          { id: "b6", type: "paragraph", text: "I'll give you a call in the next few hours to discuss your property and answer any questions you might have." },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I hope you've had a chance to review the home valuation report I sent a few days ago." },
          { id: "b3", type: "paragraph", text: "I'd love to discuss the findings with you and answer any questions:" },
          {
            id: "b4",
            type: "bullets",
            items: [
              "Does the valuation align with your expectations?",
              "Would you like me to explain how I arrived at the estimated value?",
              "Are you considering moving forward with listing your home?",
            ],
          },
          { id: "b5", type: "paragraph", text: "The report shows your home's value based on current market conditions, but there are several factors we can discuss that might help **maximize your sale price**:" },
          { id: "b6", type: "callout", tone: "success", text: "✓ Optimal timing for listing\n✓ Strategic improvements that add value\n✓ Pricing strategy to attract serious buyers\n✓ Marketing plan to reach the right audience" },
          { id: "b7", type: "paragraph", text: "When would be a good time for a call? I'm happy to walk you through everything in detail." },
          {
            id: "b8",
            type: "button",
            label: "Let's Discuss Your Report",
            url: "mailto:{{agentEmail}}",
          },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I noticed you've been reviewing the valuation report - that's great!" },
          { id: "b3", type: "paragraph", text: "If you're considering listing your home, now would be an excellent time to discuss your next steps. I can help you:" },
          {
            id: "b4",
            type: "bullets",
            items: [
              "Create a strategic pricing plan based on current market conditions",
              "Prepare your home to show beautifully and attract top dollar",
              "Develop a comprehensive marketing strategy",
              "Navigate offers and negotiations to maximize your profit",
              "Handle all the details so you can focus on your next chapter",
            ],
          },
          { id: "b5", type: "callout", tone: "warning", text: "30-Minute In-Home Consultation\nMany of my sellers appreciate understanding the complete process before making a decision. I'd love to schedule a time to meet at your property where I can:\n✓ Walk through and provide staging recommendations\n✓ Present a detailed marketing plan\n✓ Answer all your questions\n✓ Discuss timeline and next steps" },
          { id: "b6", type: "paragraph", text: "Would you be available for a consultation this week or next?" },
          {
            id: "b7",
            type: "button",
            label: "Schedule Consultation",
            url: "mailto:{{agentEmail}}",
          },
          { id: "b8", type: "paragraph", text: "Looking forward to working with you," },
          { id: "b9", type: "paragraph", text: "{{agentName}}" },
          { id: "b10", type: "paragraph", text: "📞 {{agentPhone}}" },
          { id: "b11", type: "paragraph", text: "✉️ {{agentEmail}}" },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "Thank you for contacting me! I received your message and I'm here to help with any real estate questions you have." },
          { id: "b3", type: "callout", tone: "info", text: "📞 I'll be giving you a call within the next 1-2 hours to better understand your needs and see how I can assist you." },
          { id: "b4", type: "paragraph", text: "In the meantime, feel free to reply to this email with any additional details:" },
          {
            id: "b5",
            type: "bullets",
            items: [
              "Are you looking to buy or sell (or both)?",
              "What's your general timeline?",
              "What area are you interested in?",
              "Any specific questions I can prepare to answer?",
            ],
          },
          { id: "b6", type: "paragraph", text: "I'm looking forward to speaking with you soon!" },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I wanted to follow up on your recent inquiry. I tried reaching you earlier but haven't been able to connect yet." },
          { id: "b3", type: "paragraph", text: "I'd really love to help you with your real estate needs. Whether you're:" },
          {
            id: "b4",
            type: "bullets",
            items: [
              "🏠 Looking to buy your first home",
              "📈 Thinking about selling your current property",
              "💰 Curious about market values in your area",
              "📊 Just exploring your options",
            ],
          },
          { id: "b5", type: "paragraph", text: "I'm here to provide guidance with **no pressure or obligation**." },
          { id: "b6", type: "paragraph", text: "When would be a good time for a quick **10-minute call**? You can also:" },
          {
            id: "b7",
            type: "bullets",
            items: [
              "Reply to this email with your availability",
              "Call or text me directly at [{{agentPhone}}](tel:{{agentPhone}})",
              "Book a time on my calendar: [calendar link]",
            ],
          },
          { id: "b8", type: "paragraph", text: "Looking forward to connecting!" },
          {
            id: "b9",
            type: "button",
            label: "Reply to Schedule",
            url: "mailto:{{agentEmail}}",
          },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I know you're busy, so I'll keep this brief." },
          { id: "b3", type: "paragraph", text: "I'm still here and happy to help whenever you're ready to discuss your real estate needs. **No pressure** - I understand everyone has their own timeline." },
          { id: "b4", type: "callout", tone: "info", text: "Here's how I typically help my clients:\n✓ Buyers:\nI find properties before they hit the market and guide you through the entire process\n✓ Sellers:\nI provide free market valuations and create custom marketing strategies\n✓ Curious:\nI'm always happy to answer questions, even if you're just exploring" },
          { id: "b5", type: "paragraph", text: "Feel free to reach out whenever the time is right for you." },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "Your appointment is confirmed! 🎉 I'm looking forward to speaking with you about your **mortgage financing** options." },
          { id: "b3", type: "callout", tone: "info", text: "📅 Your Upcoming Appointment\nDate & time details will be in your calendar invite." },
          { id: "b4", type: "paragraph", text: "To make the most of our time together, here's what we'll cover on our call:" },
          {
            id: "b5",
            type: "bullets",
            items: [
              "💰 How much home you can comfortably afford",
              "📊 Loan programs that fit your situation (Conventional, FHA, VA, etc.)",
              "✅ What the pre-approval process looks like and how fast it can move",
              "🔒 How to lock in a competitive interest rate",
            ],
          },
          { id: "b6", type: "callout", tone: "success", text: "💡 To prepare for our call, it may help to have:\n• A rough sense of your target home price or monthly budget\n• Your employment situation (full-time, self-employed, etc.)\n• Any questions you've been wanting to ask about the mortgage process\n• Your ideal timeline for buying" },
          { id: "b7", type: "paragraph", text: "No need to have everything figured out — that's exactly what this call is for. I'm here to make the process clear and stress-free." },
          { id: "b8", type: "paragraph", text: "If anything comes up and you need to reschedule, feel free to reach out directly. See you soon!" },
          {
            id: "b9",
            type: "button",
            label: "Contact Me Anytime",
            url: "mailto:{{agentEmail}}",
          },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I wanted to check in on how your mortgage pre-approval is progressing." },
          { id: "b3", type: "paragraph", text: "Have you had a chance to connect with the lender? Do you have any questions about:" },
          {
            id: "b4",
            type: "bullets",
            items: [
              "The documents they're requesting",
              "Your loan options and rates",
              "The timeline for approval",
              "Next steps in the process",
            ],
          },
          { id: "b5", type: "paragraph", text: "Getting pre-approved is exciting because it means you're that much closer to finding your perfect home!" },
          { id: "b6", type: "callout", tone: "info", text: "Once you're pre-approved, we can:\n✓ Start showing you properties with confidence\n✓ Move quickly when you find \"the one\"\n✓ Make strong offers that sellers take seriously" },
          { id: "b7", type: "paragraph", text: "Let me know if there's anything I can help with or if you have any questions." },
          { id: "b8", type: "paragraph", text: "Looking forward to starting your home search!" },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "callout", tone: "success", text: "🎉\nCongratulations on Your Pre-Approval!" },
          { id: "b3", type: "paragraph", text: "This is a **huge step forward** in your home buying journey." },
          { id: "b4", type: "paragraph", text: "You're now in an excellent position because:" },
          {
            id: "b5",
            type: "bullets",
            items: [
              "✅ Sellers will take your offers seriously",
              "✅ You know exactly what you can afford",
              "✅ You can move quickly when you find the right home",
              "✅ You're ready to compete in today's market",
            ],
          },
          { id: "b6", type: "paragraph", text: "Now for the fun part - let's find your perfect home!" },
          { id: "b7", type: "paragraph", text: "I'd love to schedule a time to discuss:" },
          {
            id: "b8",
            type: "bullets",
            items: [
              "What neighborhoods interest you most",
              "Your must-have features and deal-breakers",
              "Properties that match your criteria and budget",
              "Timeline for starting property tours",
            ],
          },
          { id: "b9", type: "paragraph", text: "I've already started researching homes in your price range. I'm excited to show you some great options!" },
          { id: "b10", type: "paragraph", text: "When are you available for a quick call to kick off your search?" },
          {
            id: "b11",
            type: "button",
            label: "Let's Start Your Search!",
            url: "mailto:{{agentEmail}}",
          },
          { id: "b12", type: "paragraph", text: "Congratulations again!" },
          { id: "b13", type: "paragraph", text: "{{agentName}}" },
          { id: "b14", type: "paragraph", text: "📞 {{agentPhone}}" },
          { id: "b15", type: "paragraph", text: "✉️ {{agentEmail}}" },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "Thank you for scheduling a call with me! I'm looking forward to learning about your property and discussing how I can help you achieve your selling goals." },
          { id: "b3", type: "callout", tone: "info", text: "📞 Call Details:\n**Date:** {{appointmentDate}}\n**Time:** {{appointmentTime}}\n**Duration:** 15 minutes\n**I'll call:** {{phone}}" },
          { id: "b4", type: "paragraph", text: "To make the most of our time together, here are some things to think about before our call:" },
          {
            id: "b5",
            type: "bullets",
            items: [
              "Your timeline for selling (flexible or specific date?)",
              "Your goals for the sale (price, speed, convenience?)",
              "Any questions about the selling process",
              "Recent improvements or updates to your home",
            ],
          },
          { id: "b6", type: "paragraph", text: "I'll have initial market insights prepared based on your area, and I'm happy to answer any questions you have about:" },
          { id: "b7", type: "callout", tone: "info", text: "✓ Current market conditions\n✓ What buyers are looking for\n✓ The selling process and timeline\n✓ How to maximize your home's value" },
          { id: "b8", type: "paragraph", text: "Looking forward to our conversation!" },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "Just a quick reminder about our call tomorrow!" },
          { id: "b3", type: "callout", tone: "warning", text: "📞 Call Details:\n**Time:** {{appointmentTime}} on {{appointmentDate}}\n**I'll be calling:** {{phone}}" },
          { id: "b4", type: "paragraph", text: "I've prepared some **market insights specific to your area** that I'm excited to share with you." },
          { id: "b5", type: "paragraph", text: "If anything comes up and you need to reschedule, just let me know. Otherwise, I'll talk to you tomorrow!" },
          { id: "b6", type: "paragraph", text: "Looking forward to it," },
          { id: "b7", type: "paragraph", text: "{{agentName}}" },
          { id: "b8", type: "paragraph", text: "📞 {{agentPhone}}" },
          { id: "b9", type: "paragraph", text: "✉️ {{agentEmail}}" },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "Thank you for taking the time to speak with me yesterday about your property. I really enjoyed learning about your home and your selling goals." },
          { id: "b3", type: "callout", tone: "success", text: "As we discussed:\n• **Your timeline:** [Based on conversation]\n• **Your goals:** [Based on conversation]\n• **Next steps:** [Based on conversation]" },
          { id: "b4", type: "paragraph", text: "I'm preparing some additional information for you:" },
          {
            id: "b5",
            type: "bullets",
            items: [
              "📊 Detailed market analysis for your area",
              "📋 Comparable sales data",
              "📝 Pre-listing preparation checklist",
              "📈 Strategic pricing recommendations",
            ],
          },
          { id: "b6", type: "paragraph", text: "I'll have this ready within the next few days." },
          { id: "b7", type: "paragraph", text: "In the meantime, if you have any questions or if anything comes to mind that we didn't cover in our call, don't hesitate to reach out." },
          { id: "b8", type: "paragraph", text: "I'm here to help make this process as **smooth and profitable** as possible for you!" },
        ],
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
        emailContent: "",
        emailBlocks: [
          { id: "b1", type: "heading", text: "Hi {{firstName}}," },
          { id: "b2", type: "paragraph", text: "I've completed my research on your property and the current market conditions in your area. **The insights are really interesting!**" },
          { id: "b3", type: "callout", tone: "info", text: "I'd love to schedule a time to meet at your property where I can:\n✓ Walk through your home and provide professional staging advice\n✓ Present a detailed comparative market analysis\n✓ Share a comprehensive marketing strategy\n✓ Discuss optimal pricing and timing\n✓ Answer all your questions about the process" },
          { id: "b4", type: "paragraph", text: "This meeting typically takes **30-45 minutes**, and there's absolutely no obligation. My goal is to provide you with all the information you need to make the best decision for your situation." },
          { id: "b5", type: "paragraph", text: "When would work best for you?" },
          {
            id: "b6",
            type: "bullets",
            items: [
              "This week: [Availability]",
              "Next week: [Availability]",
            ],
          },
          { id: "b7", type: "paragraph", text: "Or feel free to suggest a time that works better for you." },
          {
            id: "b8",
            type: "button",
            label: "Schedule My Consultation",
            url: "mailto:{{agentEmail}}",
          },
          { id: "b9", type: "paragraph", text: "Looking forward to working together!" },
          { id: "b10", type: "paragraph", text: "{{agentName}}" },
          { id: "b11", type: "paragraph", text: "📞 {{agentPhone}}" },
          { id: "b12", type: "paragraph", text: "✉️ {{agentEmail}}" },
        ],
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
