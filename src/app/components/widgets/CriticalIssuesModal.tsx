import React from "react";
import { X, Truck, User, AlertTriangle, ShieldAlert, ClipboardX, Calendar, Clock } from "lucide-react";
import {
  warrantyExpiryData,
  operatorLicenseData,
  machinesInspectionData,
} from "../../pages/mhe/FMSDashboard";

interface CriticalIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const criticalWarranty   = warrantyExpiryData.filter((r) => r.status === "expired");
const criticalLicense    = operatorLicenseData.filter((r) => r.status === "expired");
const criticalInspection = machinesInspectionData.filter((r) => r.redFindings > 0);
const totalCount = criticalWarranty.length + criticalLicense.length + criticalInspection.length;

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });

/* ── Section label — matches CommandDashboard section labels ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "16px 20px 10px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "#64748b",
      }}>
        {children}
      </span>
    </div>
  );
}

/* ── Item card ── */
function IssueCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      border: "1px solid #e2e8f0",
      borderRadius: 10,
      padding: "12px 16px",
      background: "#ffffff",
    }}>
      {children}
    </div>
  );
}

/* ── 28×28 icon circle — matches MachinesAttentionV3 avatar ── */
function IconCircle({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: bg, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {children}
    </div>
  );
}

/* ── Severity dot chip — 10px, #64748b ── */
function SevChip({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 7px", borderRadius: 999,
      background: "#f1f5f9",
      fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 10, color: "#64748b",
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
      {label} · {value}
    </span>
  );
}

/* ── Overdue badge ── */
function OverdueBadge({ days }: { days: number }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "2px 7px", borderRadius: 999,
      background: "#fff1f2", border: "1px solid #fecdd3",
      fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 10, color: "#e11d48",
      whiteSpace: "nowrap",
    }}>
      <Clock style={{ width: 9, height: 9 }} />
      {days}d overdue
    </span>
  );
}

export function CriticalIssuesModal({ isOpen, onClose }: CriticalIssuesModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "32px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          width: "100%",
          maxWidth: 820,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
        }}
      >

        {/* ── Header — V3 widget header style ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <IconCircle bg="rgba(225,29,72,0.10)">
              <AlertTriangle style={{ width: 14, height: 14, color: "#e11d48" }} />
            </IconCircle>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  fontFamily: "Inter, sans-serif", fontWeight: 700,
                  fontSize: 12, color: "#0f172a", lineHeight: "18px",
                }}>
                  Critical Issues
                </span>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  height: 20, padding: "0 8px", borderRadius: 6,
                  background: "#f1f5f9",
                  fontFamily: "Inter, sans-serif", fontWeight: 600,
                  fontSize: 11, color: "#64748b",
                }}>
                  {totalCount} total
                </span>
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif", fontWeight: 400,
                fontSize: 10, color: "#64748b", lineHeight: "15px",
              }}>
                Expired warranty, license & high severity inspections
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                width: 28, height: 28, borderRadius: 6,
                border: "1px solid #e2e8f0",
                background: "#ffffff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <X style={{ width: 13, height: 13, color: "#64748b" }} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ overflowY: "auto", flex: 1, background: "#ffffff" }}>

          {/* MHE Warranty Expiry */}
          <SectionLabel>
            <ShieldAlert style={{ width: 11, height: 11, display: "inline", marginRight: 4 }} />
            MHE Warranty Expiry · {criticalWarranty.length}
          </SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 20px 20px" }}>
            {criticalWarranty.map((row) => (
              <IssueCard key={row.mheId}>
                <IconCircle bg="rgba(37,99,235,0.10)">
                  <Truck style={{ width: 14, height: 14, color: "#2563eb" }} />
                </IconCircle>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "#0f172a" }}>
                      {row.mheType}
                    </span>
                    <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 11, color: "#2563eb" }}>
                      {row.mheId}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: "Inter, sans-serif", fontSize: 10, color: "#94a3b8" }}>
                      <Calendar style={{ width: 9, height: 9 }} />
                      Expired {fmt(row.licenseExpiry)}
                    </span>
                    <OverdueBadge days={Math.abs(row.daysRemaining)} />
                  </div>
                </div>
              </IssueCard>
            ))}
          </div>

          {/* Operator License Expiry */}
          <div style={{ borderTop: "1px solid #e2e8f0" }}>
            <SectionLabel>
              <User style={{ width: 11, height: 11, display: "inline", marginRight: 4 }} />
              Operator License Expiry · {criticalLicense.length}
            </SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 20px 20px" }}>
              {criticalLicense.map((row) => (
                <IssueCard key={row.operatorId}>
                  <IconCircle bg="rgba(22,163,74,0.10)">
                    <User style={{ width: 14, height: 14, color: "#16a34a" }} />
                  </IconCircle>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "#0f172a" }}>
                        {row.operator}
                      </span>
                      <span style={{ fontFamily: "monospace", fontWeight: 600, fontSize: 11, color: "#2563eb" }}>
                        {row.operatorId}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: "Inter, sans-serif", fontSize: 10, color: "#94a3b8" }}>
                        <Calendar style={{ width: 9, height: 9 }} />
                        Expired {fmt(row.licenseExpiry)}
                      </span>
                      <OverdueBadge days={Math.abs(row.daysRemaining)} />
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#94a3b8" }}>
                        Assigned: <b style={{ color: "#64748b" }}>{row.assignedMhe}</b>
                      </span>
                    </div>
                  </div>
                </IssueCard>
              ))}
            </div>
          </div>

          {/* High Severity Inspection Findings */}
          <div style={{ borderTop: "1px solid #e2e8f0" }}>
            <SectionLabel>
              <ClipboardX style={{ width: 11, height: 11, display: "inline", marginRight: 4 }} />
              High Severity Inspection Findings · {criticalInspection.length}
            </SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 20px 20px" }}>
              {criticalInspection.map((row) => (
                <IssueCard key={row.mheId}>
                  <IconCircle bg="rgba(37,99,235,0.10)">
                    <Truck style={{ width: 14, height: 14, color: "#2563eb" }} />
                  </IconCircle>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12, color: "#0f172a" }}>
                        {row.mheId}
                      </span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#64748b" }}>
                        {row.equipmentType}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {row.redFindings > 0 && <SevChip color="#ef4444" label="Red" value={row.redFindings} />}
                      {row.amberFindings > 0 && <SevChip color="#f59e0b" label="Amber" value={row.amberFindings} />}
                      {row.part_issues[0] && (
                        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#94a3b8" }}>
                          Top issue: <b style={{ color: "#0f172a" }}>{row.part_issues[0].part_name}</b>
                        </span>
                      )}
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontFamily: "Inter, sans-serif", fontSize: 10, color: "#94a3b8", marginLeft: "auto" }}>
                        <Calendar style={{ width: 9, height: 9 }} />
                        {fmt(row.lastInspection)}
                      </span>
                    </div>
                  </div>
                </IssueCard>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
