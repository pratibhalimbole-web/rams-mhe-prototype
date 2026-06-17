import React, { useState } from "react";
import { Variation1Tab } from "./Variation1Tab";
import { Variation3Tab } from "./Variation3Tab";
import { Variation4Tab } from "./Variation4Tab";
import { CriticalIssuesModal } from "../../components/widgets/CriticalIssuesModal";

const TABS = [
  { id: "variation4", label: "Common Dashboard" },
  { id: "variation2", label: "Variation 2" },
  { id: "variation3", label: "Variation 3" },
];

export function CommandDashboard() {
  const [activeTab, setActiveTab] = useState("variation4");
  const [isIssuesModalOpen, setIsIssuesModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Tab Bar */}
      <div
        className="flex shrink-0 border-b bg-card"
        style={{ borderColor: "var(--border)", padding: "0 24px" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: activeTab === tab.id ? 600 : 400,
              fontFamily: "'Inter', sans-serif",
              color: activeTab === tab.id ? "#1b59f8" : "var(--w-text-2)",
              background: "none",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid #1b59f8" : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
              marginBottom: "-1px",
            }}
          >
            {tab.label}
          </button>
        ))}

      </div>


      {/* Tab Content */}
      {activeTab === "variation4" ? (
        <div className="flex-1 overflow-y-auto">
          <Variation4Tab />
        </div>
      ) : activeTab === "variation3" ? (
        <div className="flex-1 overflow-y-auto">
          <Variation3Tab />
        </div>
      ) : activeTab === "variation2" ? (
        <div className="flex-1 overflow-y-auto">
          <Variation1Tab />
        </div>
      ) : null}

      <CriticalIssuesModal
        isOpen={isIssuesModalOpen}
        onClose={() => setIsIssuesModalOpen(false)}
      />
    </div>
  );
}
