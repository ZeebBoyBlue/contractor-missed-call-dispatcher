import type { ToolContext, ToolExecutionResult } from "@vellumai/plugin-api";

export default {
  name: "triage_contractor_inbound_lead",
  description: "Triages missed contractor calls and inbound customer messages across trade specialties (plumbing, HVAC, electrical, roofing, GC), assesses emergency severity, and stages a CRM lead.",
  defaultRiskLevel: "low" as const,
  input_schema: {
    type: "object",
    properties: {
      caller_phone: { type: "string", description: "Inbound caller phone number" },
      caller_name: { type: "string", description: "Customer name if provided or extracted from caller ID" },
      trade: {
        type: "string",
        enum: ["plumbing", "hvac", "electrical", "roofing", "general_contracting"],
        description: "Contractor trade specialty",
      },
      customer_message: {
        type: "string",
        description: "Customer text message reply, voicemail transcript, or audio note",
      },
      service_address: { type: "string", description: "Homeowner address or neighborhood" },
      preferred_window: { type: "string", description: "Preferred service window or urgency" },
      crm_target: {
        type: "string",
        enum: ["jobber", "servicetitan", "housecall_pro", "google_calendar"],
        description: "Target scheduling/dispatch platform",
      },
    },
    required: ["caller_phone", "customer_message", "trade"],
  },
  async execute(input: Record<string, unknown>, _ctx: ToolContext): Promise<ToolExecutionResult> {
    const phone = String(input.caller_phone ?? "");
    const name = String(input.caller_name ?? "Homeowner");
    const trade = String(input.trade ?? "general_contracting").toLowerCase();
    const message = String(input.customer_message ?? "");
    const address = String(input.service_address ?? "Address pending confirmation");
    const windowPref = String(input.preferred_window ?? "First available");
    const crm = String(input.crm_target ?? "jobber");

    // Emergency rule scoring
    let urgencyLevel: "emergency_p0" | "urgent_p1" | "routine_p2" = "routine_p2";
    let emergencyReason = "";
    let recommendedAction = "";
    let customerGuidanceSms = "";

    const lowerMsg = message.toLowerCase();

    if (trade === "plumbing") {
      if (
        lowerMsg.includes("burst") ||
        lowerMsg.includes("flooding") ||
        lowerMsg.includes("gushing") ||
        lowerMsg.includes("spraying") ||
        lowerMsg.includes("sewage") ||
        lowerMsg.includes("overflow")
      ) {
        urgencyLevel = "emergency_p0";
        emergencyReason = "Active water flood or sewage backup detected.";
        customerGuidanceSms = "URGENT: If water is actively running, please locate your main water shutoff valve (usually in the basement or street curb) and turn it 90 degrees clockwise immediately.";
        recommendedAction = "Immediate technician phone bridge or priority dispatch.";
      } else if (lowerMsg.includes("clog") || lowerMsg.includes("drip") || lowerMsg.includes("leak") || lowerMsg.includes("water heater")) {
        urgencyLevel = "urgent_p1";
        emergencyReason = "Contained plumbing issue or water heater failure.";
        customerGuidanceSms = "Thanks for the details! We have a tech finishing up a nearby call. Can we arrive between 2 PM and 5 PM today?";
        recommendedAction = "Stage same-day service slot in Jobber.";
      } else {
        urgencyLevel = "routine_p2";
        emergencyReason = "Standard fixture installation or estimate inquiry.";
        customerGuidanceSms = "Got it! We'd love to take a look and get you an estimate. Would tomorrow morning or afternoon work better for an on-site look?";
        recommendedAction = "Drop estimate consultation slot onto calendar.";
      }
    } else if (trade === "hvac") {
      if (
        lowerMsg.includes("no heat") ||
        lowerMsg.includes("freezing") ||
        lowerMsg.includes("gas smell") ||
        lowerMsg.includes("spark") ||
        lowerMsg.includes("co alarm")
      ) {
        urgencyLevel = "emergency_p0";
        emergencyReason = "Critical freeze hazard, carbon monoxide risk, or furnace failure.";
        customerGuidanceSms = "EMERGENCY ALERT: If you smell natural gas or your CO alarm is sounding, please evacuate your home and call the gas utility immediately. Our emergency on-call tech has been alerted.";
        recommendedAction = "Page on-call HVAC tech immediately.";
      } else if (lowerMsg.includes("no ac") || lowerMsg.includes("hot") || lowerMsg.includes("blowing warm") || lowerMsg.includes("frozen coil")) {
        urgencyLevel = "urgent_p1";
        emergencyReason = "AC cooling outage or frozen evaporator coil.";
        customerGuidanceSms = "Thanks for letting us know! Please turn your AC thermostat to 'OFF' and fan to 'ON' so any ice on the coil thaws before we arrive. We can book you in our afternoon window.";
        recommendedAction = "Stage same-day AC triage slot.";
      } else {
        urgencyLevel = "routine_p2";
        emergencyReason = "Seasonal tune-up or heat pump replacement quote.";
        customerGuidanceSms = "Thanks for reaching out! We provide full estimates on system replacements and seasonal maintenance. What day this week is most convenient for a walk-through?";
        recommendedAction = "Stage estimate consultation.";
      }
    } else if (trade === "electrical") {
      if (
        lowerMsg.includes("sparking") ||
        lowerMsg.includes("burning") ||
        lowerMsg.includes("smoke") ||
        lowerMsg.includes("breaker hot") ||
        lowerMsg.includes("buzzing")
      ) {
        urgencyLevel = "emergency_p0";
        emergencyReason = "Active electrical fire hazard or short circuit.";
        customerGuidanceSms = "SAFETY WARNING: If you see sparks, smoke, or smell burning electrical insulation, shut off that breaker at your main panel if safe, or call 911 if flame is present. An electrician is being paged.";
        recommendedAction = "Immediate emergency page.";
      } else if (lowerMsg.includes("half house") || lowerMsg.includes("breaker trips") || lowerMsg.includes("power out")) {
        urgencyLevel = "urgent_p1";
        emergencyReason = "Tripped phase or dead subpanel circuit.";
        customerGuidanceSms = "Received! If only part of your home lost power, check with your utility first to confirm a dropped phase. We have an opening this afternoon to diagnose.";
        recommendedAction = "Book diagnostic call in CRM.";
      } else {
        urgencyLevel = "routine_p2";
        emergencyReason = "EV charger install, recessed lighting, or panel upgrade estimate.";
        customerGuidanceSms = "Great, we can definitely help with your installation! Could you send a quick photo of your current electrical panel so we can review capacity before quoting?";
        recommendedAction = "Request panel photo and stage estimate job.";
      }
    } else {
      // General contracting / roofing
      if (lowerMsg.includes("roof leak") || lowerMsg.includes("water dripping from ceiling") || lowerMsg.includes("storm damage")) {
        urgencyLevel = "emergency_p0";
        emergencyReason = "Active roof intrusion or storm damage.";
        customerGuidanceSms = "We received your message! If water is actively dripping through drywall, place buckets underneath and poke a small pinhole in the center of the sag to relieve pressure. A project manager is reviewing now.";
        recommendedAction = "Priority storm triage dispatch.";
      } else {
        urgencyLevel = "routine_p2";
        emergencyReason = "Remodel, addition, or general repair inquiry.";
        customerGuidanceSms = "Thanks for reaching out! We'd love to learn more about your project. What is the approximate square footage and timeline you have in mind?";
        recommendedAction = "Stage project intake in CRM.";
      }
    }

    const leadSummary = {
      lead_id: `LEAD-${Date.now().toString().slice(-5)}`,
      caller: {
        name,
        phone,
        address,
      },
      trade,
      urgency_level: urgencyLevel,
      emergency_reason: emergencyReason,
      raw_inbound_message: message,
      automated_reply_sent: customerGuidanceSms,
      target_platform: crm,
      staged_job: {
        title: `${trade.toUpperCase()} Service Call: ${name}`,
        urgency: urgencyLevel === "emergency_p0" ? "HIGH / SAME-DAY" : urgencyLevel === "urgent_p1" ? "PRIORITY" : "STANDARD ESTIMATE",
        requested_window: windowPref,
        crm_status: "staged_draft",
        sync_action: `Ready to push to ${crm.toUpperCase()} upon contractor one-tap confirmation.`,
      },
      recommended_action: recommendedAction,
    };

    return {
      content: JSON.stringify(leadSummary, null, 2),
      isError: false,
    };
  },
};
