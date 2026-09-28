---
name: "contractor-missed-call-dispatcher"
description: "Captures missed trade contractor inbound calls, fires an instant 5-second SMS qualification text-back, triages plumbing/HVAC/electrical emergencies, and stages draft jobs in Jobber or ServiceTitan."
metadata:
  emoji: "📲"
  vellum:
    display-name: "Contractor Missed-Call Dispatcher"
    activation-hints:
      - "capture missed contractor call"
      - "dispatch missed call text-back"
      - "qualify emergency trade inquiry"
      - "screen after-hours HVAC call"
      - "stage plumbing estimate from text lead"
    avoid-when:
      - "restaurant reservation booking"
      - "ecommerce tracking inquiries"
    category: commerce
---

# Contractor Missed-Call Dispatcher

Captures missed inbound phone calls for solo tradesmen and multi-crew contractors, automatically fires an instant qualification text-back within 5 seconds, triages trade emergencies (active leaks, freezing temps, sparking panels), and stages draft estimates into CRM/scheduling software without losing leads to the next Google result.

## Trigger & Input
Triggered when an inbound call to the contractor's business phone goes unanswered, rings out, or hits voicemail:
- Inbound caller phone number
- Call timestamp and ring duration
- Trade type (Plumbing, HVAC, Electrical, Roofing, General Contracting)
- Inbound voicemail transcript or customer SMS reply

## Execution Workflow

### 1. Instant 5-Second Automated Text-Back
Detects missed call and fires an immediate human-sounding SMS:
- *"Hey, this is Dave with Oakridge Plumbing. I'm currently under a subfloor on a job and couldn't grab the phone. What's going on with your plumbing, and what neighborhood are you in?"*

### 2. Trade-Specific Qualification & Emergency Triage
Analyzes incoming customer SMS replies or voicemail transcripts against trade qualification rules:
- **Plumbing:** Detects active water pooling, burst pipes, sewer backups, and guides the homeowner to shut off the main water valve.
- **HVAC:** Detects no-heat conditions in sub-freezing weather, elderly/infant occupants, refrigerant leaks, or thermostat error codes.
- **Electrical:** Flags sparking breakers, burning ozone smells, partial house blackouts, and power company grid drops.
- **General Remodeling / Roofing:** Extracts job scope, structural damage, property address, and photo uploads.

### 3. CRM & Calendar Estimate Staging
- Calculates preliminary urgency score (Emergency P0, Urgent 24h P1, Routine Estimate P2).
- Extracts homeowner name, service address, problem description, and preferred appointment window.
- Stages a draft job/estimate in Jobber, ServiceTitan, Housecall Pro, or drops a tentative slot on Google Calendar.
- Surfaces a clean dispatch alert to the contractor with one-tap client callback or confirmation.

### 4. Human-in-the-Loop Safety Gate
- **Draft Only:** Never commits hard emergency dispatches without tech confirmation or promises binding pricing on unknown scope.
- **Transparent Staging:** All appointments are staged as tentative pending owner approval.
