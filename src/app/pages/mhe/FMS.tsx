import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  Filter,
  TrendingUp,
  Activity,
  Shield,
  Radio,
} from "lucide-react";

// KPI Card Component
function KPICard({ title, value, subtext }: { title: string; value: string; subtext: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="kpi-card"
    >
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-subtext">{subtext}</div>
    </motion.div>
  );
}

// Donut Chart Component
function DonutChart() {
  const segments = [
    { label: "Active Warranty", count: 16, percent: 80, color: "#06B6D4", offset: 0 },
    { label: "Expiring in 30 Days", count: 2, percent: 10, color: "#F59E0B", offset: 80 },
    { label: "Expiring in 60 Days", count: 1, percent: 5, color: "#EAB308", offset: 90 },
    { label: "Expired Warranty", count: 1, percent: 5, color: "#EF4444", offset: 95 },
  ];

  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  const strokeWidth = 24;

  const createArc = (percent: number, offset: number) => {
    const angle = (percent / 100) * 360;
    const startAngle = (offset / 100) * 360 - 90;
    const endAngle = startAngle + angle;

    const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = angle > 180 ? 1 : 0;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>MHE Warranty Compliance Overview</h3>
      </div>
      <div className="chart-content">
        <div className="donut-container">
          <svg viewBox="0 0 200 200" className="donut-svg">
            {segments.map((seg, idx) => (
              <motion.path
                key={idx}
                d={createArc(seg.percent, seg.offset)}
                stroke={seg.color}
                strokeWidth={hoveredSegment === idx ? strokeWidth + 4 : strokeWidth}
                fill="none"
                strokeLinecap="round"
                onMouseEnter={() => setHoveredSegment(idx)}
                onMouseLeave={() => setHoveredSegment(null)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                style={{ cursor: "pointer" }}
              />
            ))}
            <text
              x={centerX}
              y={centerY - 8}
              textAnchor="middle"
              className="donut-center-value"
            >
              20
            </text>
            <text
              x={centerX}
              y={centerY + 12}
              textAnchor="middle"
              className="donut-center-label"
            >
              Total MHE
            </text>
          </svg>
          <AnimatePresence>
            {hoveredSegment !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="chart-tooltip"
              >
                <div className="tooltip-title">{segments[hoveredSegment].label}</div>
                <div className="tooltip-value">{segments[hoveredSegment].count} MHE</div>
                <div className="tooltip-percent">{segments[hoveredSegment].percent}%</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="chart-legend">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className="legend-item"
              onMouseEnter={() => setHoveredSegment(idx)}
              onMouseLeave={() => setHoveredSegment(null)}
            >
              <div className="legend-color" style={{ backgroundColor: seg.color }} />
              <span className="legend-label">{seg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Bar Chart Component
function BarChart() {
  const bars = [
    { label: "Active License", value: 45, color: "#06B6D4" },
    { label: "Expiring in 30 Days", value: 8, color: "#F59E0B" },
    { label: "Expiring in 60 Days", value: 14, color: "#EAB308" },
    { label: "Expired License", value: 3, color: "#EF4444" },
  ];

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const maxValue = Math.max(...bars.map(b => b.value));

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Operator License Compliance Status</h3>
      </div>
      <div className="chart-content">
        <div className="bar-chart-container">
          {bars.map((bar, idx) => (
            <div key={idx} className="bar-wrapper">
              <div className="bar-label">{bar.label}</div>
              <div className="bar-track">
                <motion.div
                  className="bar-fill"
                  style={{ backgroundColor: bar.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(bar.value / maxValue) * 100}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <span className="bar-value">{bar.value}</span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {hoveredBar !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="chart-tooltip"
            >
              <div className="tooltip-title">{bars[hoveredBar].label}</div>
              <div className="tooltip-value">{bars[hoveredBar].value} Operators</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: "active" | "expiring-soon" | "expired" }) {
  const config = {
    active: { label: "Active", color: "#06B6D4" },
    "expiring-soon": { label: "Expiring Soon", color: "#F59E0B" },
    expired: { label: "Expired", color: "#EF4444" },
  };

  const { label, color } = config[status];

  return (
    <span className="status-badge" style={{ borderColor: color, color }}>
      {label}
    </span>
  );
}

// MHE Warranty Table
function MHEWarrantyTable({ onRowClick }: { onRowClick: () => void }) {
  const [selectedMHE, setSelectedMHE] = useState<string | null>(null);

  const data = [
    { id: "MHE145268", type: "Electric Forklift", expiry: "30 Apr 2026", days: 14, status: "expiring-soon" as const },
    { id: "MHE145269", type: "Reach Truck", expiry: "15 May 2026", days: 29, status: "expiring-soon" as const },
    { id: "MHE145270", type: "Pallet Jack", expiry: "20 Jun 2026", days: 65, status: "active" as const },
    { id: "MHE145271", type: "Order Picker", expiry: "10 Mar 2026", days: -36, status: "expired" as const },
    { id: "MHE145272", type: "Tow Tractor", expiry: "25 Jul 2026", days: 100, status: "active" as const },
  ];

  return (
    <div className="table-card">
      <div className="table-header">
        <h3>MHE Warranty Expiry Monitoring</h3>
        <div className="table-controls">
          <select className="filter-select">
            <option>All MHE Types</option>
            <option>Electric Forklift</option>
            <option>Reach Truck</option>
            <option>Pallet Jack</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>MHE Type</th>
              <th>MHE ID</th>
              <th>Warranty Expiry</th>
              <th>Days Remaining</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <motion.tr
                key={row.id}
                whileHover={{ backgroundColor: "rgba(6, 182, 212, 0.04)" }}
                onClick={() => {
                  setSelectedMHE(row.id);
                  onRowClick();
                }}
                style={{ cursor: "pointer" }}
              >
                <td>{row.type}</td>
                <td className="mono">{row.id}</td>
                <td>{row.expiry}</td>
                <td className="mono">{row.days} Days</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  <button className="action-button">Renew Warranty</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Operator License Table
function OperatorLicenseTable({ onRowClick }: { onRowClick: () => void }) {
  const [selectedOperator, setSelectedOperator] = useState<string | null>(null);

  const data = [
    { id: "145268", name: "Vikram Deshmukh", expiry: "30 Apr 2026", days: 14, mhe: "Electric Forklift", status: "expiring-soon" as const },
    { id: "145269", name: "Priya Sharma", expiry: "15 May 2026", days: 29, mhe: "Reach Truck", status: "expiring-soon" as const },
    { id: "145270", name: "Rajesh Kumar", expiry: "20 Jun 2026", days: 65, mhe: "Pallet Jack", status: "active" as const },
    { id: "145271", name: "Anjali Patel", expiry: "10 Mar 2026", days: -36, mhe: "Order Picker", status: "expired" as const },
    { id: "145272", name: "Suresh Reddy", expiry: "25 Jul 2026", days: 100, mhe: "Tow Tractor", status: "active" as const },
  ];

  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Operator License Expiry Monitoring</h3>
        <div className="table-controls">
          <select className="filter-select">
            <option>All Operators</option>
            <option>Active License</option>
            <option>Expiring Soon</option>
            <option>Expired</option>
          </select>
        </div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>Operator ID</th>
              <th>License Expiry</th>
              <th>Days Remaining</th>
              <th>Assigned MHE</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <motion.tr
                key={row.id}
                whileHover={{ backgroundColor: "rgba(6, 182, 212, 0.04)" }}
                onClick={() => {
                  setSelectedOperator(row.id);
                  onRowClick();
                }}
                style={{ cursor: "pointer" }}
              >
                <td>{row.name}</td>
                <td className="mono">{row.id}</td>
                <td>{row.expiry}</td>
                <td className="mono">{row.days} Days</td>
                <td>{row.mhe}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  <button className="action-button">Update License</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Edit Panel Component
function EditPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="panel-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="edit-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="panel-header">
              <h2>Edit MHE Asset</h2>
              <button onClick={onClose} className="panel-close">
                <X size={20} />
              </button>
            </div>
            <div className="panel-content">
              <div className="panel-section">
                <h3>Basic Details</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>MHE Serial No</label>
                    <input type="text" defaultValue="MHE145268" />
                  </div>
                  <div className="form-field">
                    <label>MHE Type</label>
                    <select defaultValue="Electric Forklift">
                      <option>Electric Forklift</option>
                      <option>Reach Truck</option>
                      <option>Pallet Jack</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>OEM / Make</label>
                    <input type="text" defaultValue="Toyota" />
                  </div>
                  <div className="form-field">
                    <label>Model Number</label>
                    <input type="text" defaultValue="8FBE20" />
                  </div>
                  <div className="form-field">
                    <label>Year of Manufacture</label>
                    <input type="text" defaultValue="2024" />
                  </div>
                </div>
              </div>

              <div className="panel-section">
                <h3>Ownership & Power</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Ownership Type</label>
                    <select defaultValue="Owned">
                      <option>Owned</option>
                      <option>Leased</option>
                      <option>Rented</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Supplier Name</label>
                    <input type="text" defaultValue="Toyota Material Handling" />
                  </div>
                  <div className="form-field">
                    <label>Power Type</label>
                    <select defaultValue="Electric">
                      <option>Electric</option>
                      <option>Diesel</option>
                      <option>LPG</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Load Capacity (kg)</label>
                    <input type="text" defaultValue="2000" />
                  </div>
                </div>
              </div>

              <div className="panel-section">
                <h3>Safety Compliance</h3>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Warranty Status</label>
                    <select defaultValue="Active">
                      <option>Active</option>
                      <option>Expiring Soon</option>
                      <option>Expired</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Warranty Expiry Date</label>
                    <input type="date" defaultValue="2026-04-30" />
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-footer">
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn-primary">Update Asset</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Main FMS Component
export function FMS() {
  const [activeTab, setActiveTab] = useState("incidents");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="fms-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Fira+Code:wght@400;500&family=Work+Sans:wght@400;500;600&display=swap');

        .fms-container {
          height: 100%;
          overflow-y: auto;
          background: #F8FAFB;
          font-family: 'Work Sans', sans-serif;
          position: relative;
        }

        .fms-container::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
          z-index: 0;
        }

        .fms-header {
          background: white;
          border-bottom: 1px solid #E2E8F0;
          padding: 24px 32px;
          position: sticky;
          top: 0;
          z-index: 10;
          backdrop-filter: blur(8px);
          background: rgba(255, 255, 255, 0.95);
        }

        .header-title {
          font-family: 'Archivo', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .header-tabs {
          display: flex;
          gap: 32px;
          border-bottom: 2px solid #E2E8F0;
          margin-bottom: -2px;
        }

        .tab {
          font-size: 14px;
          font-weight: 500;
          color: #64748B;
          padding: 12px 0;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          margin-bottom: -2px;
        }

        .tab.active {
          color: #06B6D4;
          border-bottom-color: #06B6D4;
        }

        .tab:hover:not(.active) {
          color: #334155;
        }

        .fms-content {
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 32px;
        }

        .kpi-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        .kpi-card:hover {
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          border-color: #CBD5E1;
        }

        .kpi-title {
          font-size: 13px;
          font-weight: 500;
          color: #64748B;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .kpi-value {
          font-family: 'Fira Code', monospace;
          font-size: 32px;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 8px;
          line-height: 1;
        }

        .kpi-subtext {
          font-size: 12px;
          color: #94A3B8;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
        }

        .chart-header {
          margin-bottom: 24px;
        }

        .chart-header h3 {
          font-family: 'Archivo', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #0F172A;
        }

        .chart-content {
          position: relative;
        }

        .donut-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .donut-svg {
          width: 240px;
          height: 240px;
          margin-bottom: 24px;
        }

        .donut-center-value {
          font-family: 'Fira Code', monospace;
          font-size: 28px;
          font-weight: 600;
          fill: #0F172A;
        }

        .donut-center-label {
          font-size: 12px;
          fill: #94A3B8;
        }

        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .legend-item:hover {
          background: #F8FAFC;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .legend-label {
          font-size: 13px;
          color: #475569;
        }

        .chart-tooltip {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 12px 16px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
          pointer-events: none;
          z-index: 100;
        }

        .tooltip-title {
          font-size: 12px;
          color: #64748B;
          margin-bottom: 4px;
        }

        .tooltip-value {
          font-family: 'Fira Code', monospace;
          font-size: 18px;
          font-weight: 600;
          color: #0F172A;
        }

        .tooltip-percent {
          font-size: 12px;
          color: #94A3B8;
        }

        .bar-chart-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .bar-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .bar-label {
          font-size: 13px;
          color: #475569;
          width: 160px;
          flex-shrink: 0;
        }

        .bar-track {
          flex: 1;
          height: 32px;
          background: #F1F5F9;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 12px;
          cursor: pointer;
          transition: filter 0.2s;
        }

        .bar-fill:hover {
          filter: brightness(1.1);
        }

        .bar-value {
          font-family: 'Fira Code', monospace;
          font-size: 13px;
          font-weight: 600;
          color: white;
        }

        .table-card {
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
          margin-bottom: 20px;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-header h3 {
          font-family: 'Archivo', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #0F172A;
        }

        .table-controls {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          font-size: 13px;
          padding: 6px 12px;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          background: white;
          color: #475569;
          cursor: pointer;
          font-family: 'Work Sans', sans-serif;
        }

        .filter-select:focus {
          outline: none;
          border-color: #06B6D4;
        }

        .table-container {
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table thead th {
          background: #F8FAFC;
          padding: 12px 24px;
          text-align: left;
          font-size: 11px;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #E2E8F0;
        }

        .data-table tbody td {
          padding: 16px 24px;
          font-size: 14px;
          color: #334155;
          border-bottom: 1px solid #F1F5F9;
        }

        .data-table tbody tr {
          transition: background 0.15s;
        }

        .data-table tbody tr:last-child td {
          border-bottom: none;
        }

        .mono {
          font-family: 'Fira Code', monospace;
          font-size: 13px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          border: 1px solid currentColor;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          background: white;
        }

        .action-button {
          font-size: 12px;
          padding: 6px 12px;
          background: transparent;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Work Sans', sans-serif;
          font-weight: 500;
        }

        .action-button:hover {
          background: #06B6D4;
          border-color: #06B6D4;
          color: white;
        }

        .panel-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          z-index: 100;
          backdrop-filter: blur(2px);
        }

        .edit-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 480px;
          background: white;
          z-index: 101;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 24px rgba(15, 23, 42, 0.15);
        }

        .panel-header {
          padding: 24px;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .panel-header h2 {
          font-family: 'Archivo', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #0F172A;
        }

        .panel-close {
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .panel-close:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .panel-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .panel-section {
          margin-bottom: 32px;
        }

        .panel-section h3 {
          font-family: 'Archivo', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #0F172A;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #E2E8F0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field label {
          font-size: 12px;
          font-weight: 500;
          color: #64748B;
        }

        .form-field input,
        .form-field select {
          font-size: 14px;
          padding: 8px 12px;
          border: 1px solid #E2E8F0;
          border-radius: 4px;
          background: white;
          color: #0F172A;
          font-family: 'Work Sans', sans-serif;
        }

        .form-field input:focus,
        .form-field select:focus {
          outline: none;
          border-color: #06B6D4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
        }

        .panel-footer {
          padding: 20px 24px;
          border-top: 1px solid #E2E8F0;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-secondary,
        .btn-primary {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Work Sans', sans-serif;
        }

        .btn-secondary {
          background: white;
          border: 1px solid #E2E8F0;
          color: #475569;
        }

        .btn-secondary:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }

        .btn-primary {
          background: #06B6D4;
          border: 1px solid #06B6D4;
          color: white;
        }

        .btn-primary:hover {
          background: #0891B2;
          border-color: #0891B2;
        }

        @media (max-width: 1200px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="fms-header">
        <h1 className="header-title">FMS (Fleet Management System)</h1>
        <div className="header-tabs">
          <div
            className={`tab ${activeTab === "incidents" ? "active" : ""}`}
            onClick={() => setActiveTab("incidents")}
          >
            Incident & Trends
          </div>
          <div
            className={`tab ${activeTab === "insights" ? "active" : ""}`}
            onClick={() => setActiveTab("insights")}
          >
            AI Powered Insights
          </div>
        </div>
      </div>

      <div className="fms-content">
        <motion.div
          className="kpi-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <KPICard
            title="Fleet Size"
            value="42"
            subtext="Total MHE = 12 | Total Operator = 12"
          />
          <KPICard
            title="Utilization"
            value="64%"
            subtext="Active fleet usage"
          />
          <KPICard
            title="Fleet Safety Score"
            value="85%"
            subtext="RTSS safety index"
          />
          <KPICard
            title="Sensor Health"
            value="70%"
            subtext="Active sensors coverage"
          />
        </motion.div>

        <motion.div
          className="charts-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <DonutChart />
          <BarChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <MHEWarrantyTable onRowClick={() => setIsPanelOpen(true)} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <OperatorLicenseTable onRowClick={() => setIsPanelOpen(true)} />
        </motion.div>
      </div>

      <EditPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}
