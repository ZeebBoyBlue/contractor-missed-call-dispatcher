import { useState } from "preact/hooks";

interface InboundLead {
  id: string;
  callerName: string;
  phone: string;
  trade: "Plumbing" | "HVAC" | "Electrical" | "General";
  timeAgo: string;
  urgency: "P0 Emergency" | "P1 Priority" | "P2 Standard";
  urgencyTone: "danger" | "warning" | "neutral";
  message: string;
  autoReplySent: string;
  jobTitle: string;
  address: string;
  status: "staged" | "confirmed" | "dismissed";
}

const DEMO_LEADS: InboundLead[] = [
  {
    id: "LEAD-9012",
    callerName: "Sarah Jenkins",
    phone: "(555) 234-8901",
    trade: "Plumbing",
    timeAgo: "2 mins ago",
    urgency: "P0 Emergency",
    urgencyTone: "danger",
    message: "Hey, water is actively spraying from under my kitchen sink and flooding the hardwood! Need someone ASAP please!!",
    autoReplySent: "URGENT: If water is actively running, please locate your main water shutoff valve immediately. Our tech is currently on a job but has been paged.",
    jobTitle: "Emergency Water Leak Triage",
    address: "1424 Elm Street, Apt 2B",
    status: "staged"
  },
  {
    id: "LEAD-9013",
    callerName: "Marcus Vance",
    phone: "(555) 876-5432",
    trade: "HVAC",
    timeAgo: "14 mins ago",
    urgency: "P1 Priority",
    urgencyTone: "warning",
    message: "AC stopped cooling and unit outside is buzzing and blowing warm air. Indoor temp is 79. Can someone come by today?",
    autoReplySent: "Thanks for reaching out! Please turn the AC to OFF and fan to ON to avoid freezing the coil. We have an afternoon diagnostic slot between 2-5 PM.",
    jobTitle: "AC Diagnostic & Capacitor Inspection",
    address: "742 Evergreen Terrace",
    status: "staged"
  },
  {
    id: "LEAD-9014",
    callerName: "Elena Rostova",
    phone: "(555) 432-1098",
    trade: "Electrical",
    timeAgo: "42 mins ago",
    urgency: "P2 Standard",
    urgencyTone: "neutral",
    message: "Hi, looking to get an estimate for an EV Level 2 charger installation in my garage. Need to check if our 200A panel has room.",
    autoReplySent: "Got it! We can definitely help with your EV charger install. Could you text back a quick photo of your panel breakers so we can check capacity?",
    jobTitle: "EV Charger 240V Circuit Estimate",
    address: "88 Ridgeview Lane",
    status: "staged"
  }
];

export function App() {
  const [leads, setLeads] = useState<InboundLead[]>(DEMO_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("LEAD-9012");
  const [filterTrade, setFilterTrade] = useState<string>("all");

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const handleConfirmLead = (id: string) => {
    setLeads(leads.map((l) => (l.id === id ? { ...l, status: "confirmed" } : l)));
  };

  const filteredLeads = filterTrade === "all" ? leads : leads.filter((l) => l.trade.toLowerCase() === filterTrade.toLowerCase());

  return (
    <div style={{ maxWidth: "780px", margin: "32px auto", padding: "0 20px", fontFamily: "var(--font-sans, -apple-system, sans-serif)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>📲</span>
          <div>
            <h1 style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "24px", margin: 0, fontWeight: 400 }}>Contractor Missed-Call Lead Triage</h1>
            <p style={{ margin: "2px 0 0", fontSize: "13px", color: "var(--color-secondary, #666)" }}>Instant 5-second text qualification and CRM dispatch</p>
          </div>
        </div>
        <span style={{ background: "#E8F5E9", color: "#2E7D32", padding: "4px 10px", borderRadius: "999px", fontSize: "12px", fontWeight: 600 }}>
          3 Active Inquiries
        </span>
      </div>

      {/* Trade Filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["all", "plumbing", "hvac", "electrical"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterTrade(t)}
            style={{
              background: filterTrade === t ? "#191816" : "#FFFFFF",
              color: filterTrade === t ? "#FFFFFF" : "#444444",
              border: "1px solid rgba(0,0,0,0.12)",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              textTransform: "capitalize",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            {t === "all" ? "All Trades" : t}
          </button>
        ))}
      </div>

      {/* Main split grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Lead List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredLeads.map((lead) => {
            const isSelected = lead.id === selectedLead.id;
            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                style={{
                  background: isSelected ? "#FBFBFA" : "#FFFFFF",
                  border: isSelected ? "2px solid #2F6946" : "1px solid rgba(0,0,0,0.12)",
                  borderRadius: "10px",
                  padding: "14px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600, fontSize: "14px", color: "#191816" }}>{lead.callerName}</span>
                  <span style={{ fontSize: "11px", color: "#888" }}>{lead.timeAgo}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 600,
                      background: lead.urgencyTone === "danger" ? "#FEE2E2" : lead.urgencyTone === "warning" ? "#FEF3C7" : "#F3F4F6",
                      color: lead.urgencyTone === "danger" ? "#991B1B" : lead.urgencyTone === "warning" ? "#92400E" : "#374151"
                    }}
                  >
                    {lead.urgency}
                  </span>
                  <span style={{ fontSize: "11px", background: "#EFF6FF", color: "#1E40AF", padding: "2px 8px", borderRadius: "4px" }}>
                    {lead.trade}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "12px", color: "#555", lineClamp: 2, overflow: "hidden", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2 }}>
                  "{lead.message}"
                </p>
              </div>
            );
          })}
        </div>

        {/* Lead Detail & Dispatch Card */}
        <div style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "10px", padding: "18px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ borderBottom: "1px solid #EEE", paddingBottom: "12px", marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h2 style={{ fontSize: "16px", margin: 0, fontWeight: 600 }}>{selectedLead.callerName}</h2>
              <span style={{ fontSize: "12px", color: "#666" }}>{selectedLead.phone}</span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#666" }}>📍 {selectedLead.address}</p>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#888", fontWeight: 600, marginBottom: "4px" }}>
              Inbound Customer Note
            </div>
            <div style={{ background: "#F7F6F1", padding: "10px 12px", borderRadius: "6px", fontSize: "12px", color: "#191816", fontStyle: "italic" }}>
              "{selectedLead.message}"
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", color: "#888", fontWeight: 600, marginBottom: "4px" }}>
              Instant Automated SMS Reply
            </div>
            <div style={{ background: "#E8F5E9", borderLeft: "3px solid #2E7D32", padding: "10px 12px", borderRadius: "4px", fontSize: "12px", color: "#1B5E20" }}>
              {selectedLead.autoReplySent}
            </div>
          </div>

          <div style={{ marginBottom: "18px", background: "#FAFAFA", padding: "12px", borderRadius: "8px", border: "1px solid #EFEFEF" }}>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#444", marginBottom: "4px" }}>CRM STAGING</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>{selectedLead.jobTitle}</div>
            <div style={{ fontSize: "11px", color: "#777", marginTop: "2px" }}>Ready to push to Jobber / ServiceTitan</div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => handleConfirmLead(selectedLead.id)}
              disabled={selectedLead.status === "confirmed"}
              style={{
                flex: 1,
                background: selectedLead.status === "confirmed" ? "#2E7D32" : "#216C37",
                color: "#FFFFFF",
                border: "none",
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: selectedLead.status === "confirmed" ? "default" : "pointer"
              }}
            >
              {selectedLead.status === "confirmed" ? "✓ Confirmed in Jobber" : "Book & Stage in Jobber →"}
            </button>
            <a
              href={`tel:${selectedLead.phone}`}
              style={{
                background: "#FFFFFF",
                color: "#333",
                border: "1px solid #CCC",
                padding: "10px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center"
              }}
            >
              Call Tech
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
