import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

// ─── Mock data ────────────────────────────────────────────────────────────────

const warrantyData = [
  { mheName: "MHE 05", oem: "Elite Handling Technologies", modelNo: "L14AP",    ownership: "Buy",   expiry: "09 Jun 2026", daysRemaining: -6,   status: "Expired"  },
  { mheName: "MHE 08", oem: "Toyota",                      modelNo: "FKL-2021", ownership: "Buy",   expiry: "09 Jun 2026", daysRemaining: -6,   status: "Expired"  },
  { mheName: "MHE 02", oem: "Crown",                       modelNo: "WP3040",   ownership: "Lease", expiry: "20 Jul 2026", daysRemaining: 35,   status: "Due Soon" },
  { mheName: "MHE 11", oem: "Hyster",                      modelNo: "H50CT",    ownership: "Buy",   expiry: "01 Aug 2026", daysRemaining: 47,   status: "Due Soon" },
];

const licenseData = [
  { operatorName: "Vivek Deshmukh", licenseNo: "LIC-VD-2201", type: "Forklift",    expiry: "09 Jun 2026", daysRemaining: -6,   status: "Expired"  },
  { operatorName: "Arjun Mehta",    licenseNo: "LIC-AM-1834", type: "Reach Truck", expiry: "15 Jun 2026", daysRemaining:  0,   status: "Expired"  },
  { operatorName: "Sneha Patil",    licenseNo: "LIC-SP-0971", type: "Pallet Jack", expiry: "30 Jun 2026", daysRemaining: 15,   status: "Due Soon" },
  { operatorName: "Rahul Singh",    licenseNo: "LIC-RS-3312", type: "Forklift",    expiry: "10 Jul 2026", daysRemaining: 25,   status: "Due Soon" },
  { operatorName: "Priya Nair",     licenseNo: "LIC-PN-4401", type: "Stacker",     expiry: "22 Jul 2026", daysRemaining: 37,   status: "Due Soon" },
];

const servicingData = [
  { mheName: "MHE 06", oem: "Toyota",                      lastService: "12 Dec 2025", nextService: "12 Mar 2026", daysRemaining: -95,  kmRemaining: 1000, cyclesRemaining: -1000, status: "Overdue"  },
  { mheName: "MHE 03", oem: "Elite Handling Technologies", lastService: "12 Dec 2025", nextService: "10 Feb 2026", daysRemaining: -125, kmRemaining: 20,   cyclesRemaining: 0,     status: "Overdue"  },
  { mheName: "MHE 01", oem: "Toyota",                      lastService: "12 Dec 2025", nextService: "12 Mar 2026", daysRemaining: -95,  kmRemaining: 50,   cyclesRemaining: -100,  status: "Overdue"  },
  { mheName: "MHE 02", oem: "Crown",                       lastService: "12 Dec 2025", nextService: "12 Mar 2026", daysRemaining: -95,  kmRemaining: 0,    cyclesRemaining: 100,   status: "Overdue"  },
  { mheName: "MHE 05", oem: "Elite Handling Technologies", lastService: "12 Dec 2025", nextService: "12 Mar 2026", daysRemaining: -95,  kmRemaining: 100,  cyclesRemaining: 348,   status: "Overdue"  },
  { mheName: "MHE 09", oem: "Toyota",                      lastService: "30 Apr 2026", nextService: "29 Jun 2026", daysRemaining: 14,   kmRemaining: 40,   cyclesRemaining: 50,    status: "Due Soon" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = "warranty" | "license" | "servicing";

const TABS: { key: TabKey; label: string }[] = [
  { key: "warranty",  label: "Warranty Expiry" },
  { key: "license",   label: "License Expiry"  },
  { key: "servicing", label: "Servicing Due"   },
];

const TAB_TITLES: Record<TabKey, string> = {
  warranty:  "MHE Warranty Expiry Monitoring",
  license:   "Operator License Expiry Monitoring",
  servicing: "MHE Servicing Due Monitoring",
};

const TAB_SUBTITLES: Record<TabKey, string> = {
  warranty:  "MHEs whose warranty has expired or will expire soon.",
  license:   "Operators whose license has expired or will expire soon.",
  servicing: "MHEs whose next service is overdue or due soon based on service interval.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FF = "Inter, sans-serif";

const thStyle: React.CSSProperties = {
  fontFamily: FF, fontSize: 11, fontWeight: 500,
  color: "var(--w-text-3)", textTransform: "uppercase",
  letterSpacing: "0.4px", textAlign: "left",
  padding: "10px 20px", whiteSpace: "nowrap",
  borderBottom: "1px solid var(--w-border)",
  background: "var(--w-bg-muted)",
};

const tdStyle: React.CSSProperties = {
  fontFamily: FF, fontSize: 12, fontWeight: 400,
  color: "var(--w-text-1)", padding: "13px 20px",
  whiteSpace: "nowrap", borderBottom: "1px solid var(--w-divider)",
};

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    "Expired":  { bg: "rgba(239,68,68,0.12)",  color: "#ef4444" },
    "Overdue":  { bg: "rgba(239,68,68,0.12)",  color: "#ef4444" },
    "Due Soon": { bg: "rgba(217,119,6,0.12)",  color: "#d97706" },
  };
  const { bg, color } = cfg[status] ?? { bg: "rgba(100,116,139,0.1)", color: "var(--w-text-3)" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 10px", borderRadius: 9999, background: bg }}>
      <span style={{ fontFamily: FF, fontSize: 11, fontWeight: 500, color, whiteSpace: "nowrap" }}>{status}</span>
    </span>
  );
}

function DaysCell({ days }: { days: number }) {
  const isNeg = days < 0;
  return (
    <span style={{ fontFamily: FF, fontSize: 12, color: isNeg ? "#ef4444" : "var(--w-text-1)", fontWeight: isNeg ? 500 : 400 }}>
      {days > 0 ? `${days} Days` : `${days} Days`}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface WarrantyExpiryTableV3Props {
  onRenew?: (id: string, type: "mhe" | "operator") => void;
}

export function WarrantyExpiryTableV3({ onRenew }: WarrantyExpiryTableV3Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("warranty");
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(10);

  const handleTabChange = (tab: TabKey) => { setActiveTab(tab); setPage(1); };

  const allData = activeTab === "warranty" ? warrantyData : activeTab === "license" ? licenseData : servicingData;
  const total   = allData.length;
  const rows    = allData.slice((page - 1) * pageSize, page * pageSize);
  const first   = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last    = Math.min(page * pageSize, total);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

      {/* Section label */}
      <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "var(--w-text-2)" }}>
        Renewals &amp; Compliance Monitoring
      </span>

      {/* Tabs */}
      <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "var(--w-bg-muted)", borderRadius: 8, padding: "3px", gap: 2 }}>
        {TABS.map(t => {
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              style={{
                fontFamily: FF, fontSize: 11, fontWeight: active ? 600 : 400,
                color: active ? "var(--w-text-1)" : "var(--w-text-3)",
                background: active ? "var(--w-bg)" : "transparent",
                border: active ? "1px solid var(--w-border)" : "1px solid transparent",
                borderRadius: 6, padding: "5px 14px",
                cursor: "pointer", transition: "all 0.12s",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Card */}
      <div style={{ background: "var(--w-bg)", border: "1px solid var(--w-border)", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Card header */}
        <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid var(--w-border)" }}>
          <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 600, color: "var(--w-text-1)", margin: "0 0 2px" }}>{TAB_TITLES[activeTab]}</p>
          <p style={{ fontFamily: FF, fontSize: 11, color: "var(--w-text-3)", margin: 0 }}>{TAB_SUBTITLES[activeTab]}</p>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto", flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {activeTab === "warranty" && (
                  <>
                    <th style={thStyle}>MHE Name</th>
                    <th style={thStyle}>OEM</th>
                    <th style={thStyle}>Model No</th>
                    <th style={thStyle}>Ownership</th>
                    <th style={thStyle}>Warranty Expiry</th>
                    <th style={thStyle}>Days Remaining</th>
                    <th style={thStyle}>Status</th>
                  </>
                )}
                {activeTab === "license" && (
                  <>
                    <th style={thStyle}>Operator Name</th>
                    <th style={thStyle}>License No</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Expiry Date</th>
                    <th style={thStyle}>Days Remaining</th>
                    <th style={thStyle}>Status</th>
                  </>
                )}
                {activeTab === "servicing" && (
                  <>
                    <th style={thStyle}>MHE Name</th>
                    <th style={thStyle}>OEM</th>
                    <th style={thStyle}>Last Service</th>
                    <th style={thStyle}>Next Service</th>
                    <th style={thStyle}>Days Remaining</th>
                    <th style={thStyle}>KM Remaining</th>
                    <th style={thStyle}>Cycles Remaining</th>
                    <th style={thStyle}>Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ ...tdStyle, textAlign: "center", color: "var(--w-text-3)", padding: "32px 20px" }}>
                    No records found.
                  </td>
                </tr>
              ) : rows.map((row: any, i) => (
                <tr key={i} style={{ transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--w-bg-page)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  {activeTab === "warranty" && (
                    <>
                      <td style={tdStyle}>{row.mheName}</td>
                      <td style={tdStyle}>{row.oem}</td>
                      <td style={tdStyle}>{row.modelNo}</td>
                      <td style={tdStyle}>{row.ownership}</td>
                      <td style={tdStyle}>{row.expiry}</td>
                      <td style={tdStyle}><DaysCell days={row.daysRemaining} /></td>
                      <td style={tdStyle}><StatusBadge status={row.status} /></td>
                    </>
                  )}
                  {activeTab === "license" && (
                    <>
                      <td style={tdStyle}>{row.operatorName}</td>
                      <td style={{ ...tdStyle, fontWeight: 500, color: "#2563eb" }}>{row.licenseNo}</td>
                      <td style={tdStyle}>{row.type}</td>
                      <td style={tdStyle}>{row.expiry}</td>
                      <td style={tdStyle}><DaysCell days={row.daysRemaining} /></td>
                      <td style={tdStyle}><StatusBadge status={row.status} /></td>
                    </>
                  )}
                  {activeTab === "servicing" && (
                    <>
                      <td style={tdStyle}>{row.mheName}</td>
                      <td style={tdStyle}>{row.oem}</td>
                      <td style={tdStyle}>{row.lastService}</td>
                      <td style={tdStyle}>{row.nextService}</td>
                      <td style={tdStyle}><DaysCell days={row.daysRemaining} /></td>
                      <td style={{ ...tdStyle, color: row.kmRemaining === 0 ? "#ef4444" : row.kmRemaining < 0 ? "#ef4444" : "var(--w-text-1)", fontWeight: (row.kmRemaining <= 0) ? 500 : 400 }}>
                        {row.kmRemaining} KM
                      </td>
                      <td style={{ ...tdStyle, color: row.cyclesRemaining < 0 ? "#ef4444" : row.cyclesRemaining === 0 ? "var(--w-text-2)" : "var(--w-text-1)", fontWeight: row.cyclesRemaining < 0 ? 500 : 400 }}>
                        {row.cyclesRemaining} Cycles
                      </td>
                      <td style={tdStyle}><StatusBadge status={row.status} /></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "10px 20px", borderTop: "1px solid var(--w-border)", flexShrink: 0 }}>
          <span style={{ fontFamily: FF, fontSize: 11, color: "var(--w-text-3)" }}>Rows per page:</span>
          <Select value={`${pageSize}`} onValueChange={v => { setPageSize(Number(v)); setPage(1); }}>
            <SelectTrigger style={{ height: 28, width: 60, fontSize: 11, fontFamily: FF, border: "1px solid var(--w-border)", background: "var(--w-bg)", color: "var(--w-text-1)", borderRadius: 6, padding: "0 8px", boxShadow: "none", fontWeight: 400 }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top" avoidCollisions={false} style={{ backgroundColor: "var(--w-bg)", border: "1px solid var(--w-border)", color: "var(--w-text-1)" }}>
              {[10, 25, 50, 100].map(s => (
                <SelectItem key={s} value={`${s}`} style={{ fontFamily: FF, fontSize: 11, color: "var(--w-text-1)" }}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span style={{ fontFamily: FF, fontSize: 11, color: "var(--w-text-3)" }}>{first} – {last} of {total}</span>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
            style={{ width: 26, height: 26, borderRadius: 5, border: "1px solid var(--w-border)", background: "var(--w-bg)", cursor: page <= 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: page <= 1 ? 0.35 : 1 }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="var(--w-text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            style={{ width: 26, height: 26, borderRadius: 5, border: "1px solid var(--w-border)", background: "var(--w-bg)", cursor: page >= totalPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: page >= totalPages ? 0.35 : 1 }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="var(--w-text-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
