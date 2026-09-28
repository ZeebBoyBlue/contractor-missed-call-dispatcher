# Contractor Missed-Call Dispatcher

> Captures missed trade contractor inbound calls, fires an instant 5-second SMS qualification text-back, triages plumbing, HVAC, and electrical emergencies, and stages draft jobs in Jobber, ServiceTitan, Housecall Pro, or Google Calendar.

## Overview

The **Contractor Missed-Call Dispatcher** is an official Vellum plugin designed for trade contractors, solo operators, and mechanical field crews. In residential home services, 27% of calls go unanswered because technicians have their hands on tools in crawlspaces, basements, or attics. Unanswered callers hang up and call the next listing on Google Maps.

This plugin automates the first critical five seconds: it detects an unanswered call, fires an authentic, human-sounding text-back from the contractor's number, triages emergency safety issues (burst pipes, gas leaks, electrical sparking), and stages a clean lead card directly into your dispatch stack.

## Key Capabilities

- **5-Second Lead Capture:** Instant conversational SMS response halts customer shopping immediately.
- **Deterministic Emergency Triage:** Built-in domain logic for plumbing, HVAC, electrical, roofing, and general contracting triage.
- **Life-Safety Guidance:** Automatic shutoff instructions (water valves, gas utility, breaker disconnect) sent to callers in P0 crises.
- **Dispatch Integration:** Direct staging into Jobber (Requests), ServiceTitan (Unbooked Calls / Leads), Housecall Pro, or Google Calendar.
- **Draft-Only Safety:** 100% human-in-the-loop control. The assistant stages estimate holds and tickets; it never commits binding quotes or technician schedules without operator confirmation.

## Included Components

- **Skill:** `contractor-missed-call-dispatcher` (qualification rules, trade emergency scoring, and CRM dispatch guardrails)
- **Tool:** `triage_contractor_inbound_lead` (deterministic parser for caller intent, trade severity scoring, address extraction, and CRM payload assembly)
- **UI Surface:** `call-dispatcher` (interactive Preact activity stream and emergency lead queue)

## License

MIT © 2026 Nicolas Zeeb
