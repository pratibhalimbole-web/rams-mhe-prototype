import React, { useState } from "react";
import { Truck, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

const mheData = [
  { type: "Reach Truck",       id: "MHE-002", expiry: "May 05, 2026", days:   8, status: "expiring" },
  { type: "Pallet Jack",       id: "MHE-003", expiry: "Apr 28, 2026", days:   1, status: "expiring" },
  { type: "Order Picker",      id: "MHE-004", expiry: "Mar 10, 2026", days: -48, status: "expired"  },
  { type: "Reach Truck",       id: "MHE-007", expiry: "May 08, 2026", days:  11, status: "expiring" },
  { type: "Electric Forklift", id: "MHE-009", expiry: "Apr 25, 2026", days:  -5, status: "expired"  },
  { type: "Forklift",          id: "MHE-011", expiry: "Jun 15, 2026", days:  34, status: "expiring" },
  { type: "Pallet Jack",       id: "MHE-015", expiry: "Mar 28, 2026", days: -30, status: "expired"  },
];

const operatorData = [
  { name: "Anjali Patel", id: "OP-004", expiry: "May 10, 2026", days:  13, status: "expiring" },
  { name: "Suresh Reddy", id: "OP-005", expiry: "Mar 15, 2026", days: -53, status: "expired"  },
  { name: "Rahul Sharma", id: "OP-008", expiry: "Apr 30, 2026", days:   3, status: "expiring" },
  { name: "Priya Kumar",  id: "OP-012", expiry: "Feb 28, 2026", days: -73, status: "expired"  },
  { name: "Vikram Singh", id: "OP-019", expiry: "May 15, 2026", days:  18, status: "expiring" },
  { name: "Meera Nair",   id: "OP-021", expiry: "Mar 05, 2026", days: -68, status: "expired"  },
  { name: "Arjun Das",    id: "OP-027", expiry: "Jun 01, 2026", days:  20, status: "expiring" },
];


const ROWS_PER_PAGE = 5;

function StatusBadge({ status }: { status: string }) {
  const isExpired = status === "expired";
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 10px",
      borderRadius: 9999,
      background: isExpired ? "rgba(239,68,68,0.1)" : "rgba(217,119,6,0.1)",
    }}>
      <span style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 500,
        fontSize: 11,
        lineHeight: "15.7px",
        color: isExpired ? "#ef4444" : "#d97706",
        whiteSpace: "nowrap",
      }}>
        {isExpired ? "Expired" : "Expiring Soon"}
      </span>
    </div>
  );
}

const filterStyle: React.CSSProperties = {
  height: "32px",
  width: "auto",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "6px",
  padding: "0 13px",
  fontSize: "10px",
  color: "#0f172a",
  fontFamily: "Inter, sans-serif",
  fontWeight: 400,
};

interface WarrantyExpiryTableV3Props {
  onRenew?: (id: string, type: "mhe" | "operator") => void;
}

export function WarrantyExpiryTableV3({ onRenew }: WarrantyExpiryTableV3Props) {
  const [category, setCategory] = useState<"mhe" | "operator">("operator");
  const [page, setPage] = useState(1);

  function handleCategoryChange(val: string) {
    setCategory(val as "mhe" | "operator");
    setPage(1);
  }

  const baseRows = category === "mhe" ? mheData : operatorData;

  const totalRows = baseRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE));
  const pageRows = baseRows.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);
  const startRow = totalRows === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1;
  const endRow = Math.min(page * ROWS_PER_PAGE, totalRows);

  const thStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: 12,
    lineHeight: "17px",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
    color: "#0f172a",
    padding: "15px 24px",
    whiteSpace: "nowrap",
    textAlign: "left",
    background: "rgba(241,245,249,0.5)",
  };

  const tdStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: 12,
    lineHeight: "20px",
    color: "#0f172a",
    padding: "14px 24px",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e2e8f0",
  };

  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        borderBottom: "1px solid #e2e8f0",
        gap: 16,
      }}>
        {/* Title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "21px",
            color: "#0f172a",
          }}>
            Warranty &amp; License Expiry Monitor
          </span>
          <span style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "18px",
            color: "#64748b",
          }}>
            Track MHE equipment warranties and operator licenses that have expired or are expiring soon.
          </span>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>

          {/* Primary: MHE / Operator */}
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger style={filterStyle}><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="operator" style={{ whiteSpace: "nowrap" }}>Operator</SelectItem>
              <SelectItem value="mhe"      style={{ whiteSpace: "nowrap" }}>MHE</SelectItem>
            </SelectContent>
          </Select>

        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
              <th style={thStyle}>{category === "mhe" ? "MHE Type" : "Operator Name"}</th>
              <th style={thStyle}>{category === "mhe" ? "MHE ID"   : "Operator ID"}</th>
              <th style={thStyle}>License Expiry</th>
              <th style={thStyle}>Days Remaining</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ ...tdStyle, textAlign: "center", color: "#94a3b8", padding: "32px 24px" }}>
                  No records found.
                </td>
              </tr>
            ) : pageRows.map((row: any, i) => (
              <tr key={i}>
                <td style={tdStyle}>
                  {category === "mhe" ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 4, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Truck style={{ width: 12, height: 12, color: "#1b59f8" }} />
                      </div>
                      {row.type}
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 4, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <User style={{ width: 12, height: 12, color: "#16a34a" }} />
                      </div>
                      {row.name}
                    </div>
                  )}
                </td>
                <td style={{ ...tdStyle, fontWeight: 600, color: "#2563eb" }}>{row.id}</td>
                <td style={tdStyle}>{row.expiry}</td>
                <td style={{ ...tdStyle, color: "#64748b" }}>{row.days} Days</td>
                <td style={tdStyle}><StatusBadge status={row.status} /></td>
                <td style={tdStyle}>
                  <span
                    onClick={() => onRenew?.(row.id, category)}
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      color: "#2563eb",
                      cursor: "pointer",
                    }}
                  >
                    Renew
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "49px",
        borderTop: "1px solid #e2e8f0",
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          fontSize: 12,
          color: "#64748b",
        }}>
          {startRow}–{endRow} of {totalRows}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Rows label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#64748b" }}>Rows:</span>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              height: 32, padding: "0 12px", background: "#ffffff",
              border: "1px solid #e2e8f0", borderRadius: 6,
            }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#0f172a" }}>{ROWS_PER_PAGE}</span>
            </div>
          </div>

          {/* Prev / counter / Next */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                width: 24, height: 24, borderRadius: 4, border: "none",
                background: "transparent", cursor: page === 1 ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: page === 1 ? 0.35 : 1, padding: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span style={{
              fontFamily: "Inter, sans-serif", fontSize: 12,
              color: "#64748b", minWidth: 36, textAlign: "center",
            }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                width: 24, height: 24, borderRadius: 4, border: "none",
                background: "transparent", cursor: page === totalPages ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: page === totalPages ? 0.35 : 1, padding: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
