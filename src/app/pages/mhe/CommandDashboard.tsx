import React, { useState } from "react";
import { Truck, Activity, ShieldCheck, Wifi, ShieldAlert, ClipboardCheck, Trophy, Award } from "lucide-react";
import { CriticalIssuesBanner } from "../../components/widgets/CriticalIssuesBanner";
import { KpiCardV3 } from "../../components/widgets/v3/KpiCardV3";
import { SeverityTrendLineV3 } from "../../components/widgets/v3/SeverityTrendLineV3";
import { ImpactDonutV3 } from "../../components/widgets/v3/ImpactDonutV3";
import { MachinesAttentionV3 } from "../../components/widgets/v3/MachinesAttentionV3";
import { EquipmentHealthCardV3 } from "../../components/widgets/v3/EquipmentHealthCardV3";
import { ImpactTrendRankedV3 } from "../../components/widgets/v3/ImpactTrendRankedV3";
import { WarrantyExpiryTableV3 } from "../../components/widgets/v3/WarrantyExpiryTableV3";
import { MonitoringCardV3 } from "../../components/widgets/v3/MonitoringCardV3";
import { MonitoringSplitCardV3 } from "../../components/widgets/v3/MonitoringSplitCardV3";
import { LicenseRenewDrawer, OperatorLicenseExpiryDrawer } from "./FMSDashboard";
import { Variation1Tab } from "./Variation1Tab";
import { CriticalIssuesModal } from "../../components/widgets/CriticalIssuesModal";

const TABS = [
  { id: "variation1", label: "Variation 1" },
  { id: "variation2", label: "Variation 2" },
];

export function CommandDashboard() {
  const [activeTab, setActiveTab] = useState("variation1");
  const [isIssuesModalOpen, setIsIssuesModalOpen] = useState(false);
  const [isRenewDrawerOpen, setIsRenewDrawerOpen] = useState(false);
  const [selectedMheForRenewal, setSelectedMheForRenewal] = useState<string | null>(null);
  const [isLicenseDrawerOpen, setIsLicenseDrawerOpen] = useState(false);
  const [selectedOperatorForLicense, setSelectedOperatorForLicense] = useState<string | null>(null);

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
              color: activeTab === tab.id ? "#1b59f8" : "#64748b",
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
      {activeTab === "variation2" ? (
        <div className="flex-1 overflow-y-auto">
          <Variation1Tab />
        </div>
      ) : (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="grid grid-cols-12 gap-6">

        {/* Critical Alert Banner */}
        <div className="col-span-12">
          <CriticalIssuesBanner
            count={11}
            trendNote="↑ 3 new today"
            onViewAll={() => setIsIssuesModalOpen(true)}
          />
        </div>

        {/* Section — Command Center KPIs */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
            FMS · COMMAND CENTER
          </span>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
          <KpiCardV3 label="Fleet Size"         value="42"  description="Total machines in operation" icon={Truck} />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
          <KpiCardV3 label="Fleet Utilization"  value="78%" description="Percentage active equipment" icon={Activity} />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
          <KpiCardV3 label="Fleet Safety Score" value="92%" description="Safety performance rating"   icon={ShieldCheck} />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-3 flex">
          <KpiCardV3 label="Active Sensors"      value="95" description="Active sensors percentage"   icon={Wifi} />
        </div>

        {/* Section — MEPS Monitoring Strip */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
            FMS · MEPS
          </span>
        </div>

        <div className="col-span-12">
          <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", height: "154px" }}>
            <div className="grid grid-cols-1 xl:grid-cols-4 divide-y xl:divide-y-0 xl:divide-x" style={{ height: "100%", borderColor: "#e2e8f0" }}>
              <MonitoringSplitCardV3
                icon={ShieldAlert}
                title="Expiry Monitoring"
                metrics={[
                  { label: "Operator License", value: "04", suffix: "/ 12" },
                  { label: "MHE Warranty",     value: "04", suffix: "/ 40" },
                ]}
                actionLabel="Renew All"
              />
              <MonitoringSplitCardV3
                icon={ClipboardCheck}
                title="Inspection Findings"
                metrics={[
                  { label: "Reported", value: "124" },
                  { label: "Closed",   value: "38"  },
                ]}
                footerCaption="76% completion rate this week"
              />
              <MonitoringCardV3
                icon={Trophy}
                title="Top Operator Performance :"
                highlight="Abhishek Sharma"
                value="94.55"
                suffix="Score"
                progress={91}
                caption="Ranked by productivity score"
              />
              <MonitoringCardV3
                icon={Award}
                title="Top MHE Performance :"
                highlight="MHE 05"
                value="90"
                suffix="Score"
                progress={84}
                caption="Ranked by productivity score"
              />
            </div>
          </div>
        </div>

        {/* Section — RTSS Charts */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
            FMS · RTSS
          </span>
        </div>

        <div className="col-span-12 xl:col-span-8 flex min-h-[422px]">
          <SeverityTrendLineV3 />
        </div>
        <div className="col-span-12 xl:col-span-4 flex min-h-[422px]">
          <ImpactDonutV3 />
        </div>

        {/* Section — Operational Widgets */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
            COMMAND CENTER · RTSS · IMDS
          </span>
        </div>

        <div className="col-span-12 md:col-span-6 xl:col-span-4 flex min-h-[360px]">
          <MachinesAttentionV3 />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4 flex min-h-[360px]">
          <EquipmentHealthCardV3 />
        </div>
        <div className="col-span-12 md:col-span-6 xl:col-span-4 flex min-h-[360px]">
          <ImpactTrendRankedV3 />
        </div>

        {/* Section — Warranty / License Table */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
            COMMAND CENTER · IMDS
          </span>
        </div>

        <div className="col-span-12">
          <WarrantyExpiryTableV3
            onRenew={(id, type) => {
              if (type === "operator") {
                setSelectedOperatorForLicense(id);
                setIsLicenseDrawerOpen(true);
              } else {
                setSelectedMheForRenewal(id);
                setIsRenewDrawerOpen(true);
              }
            }}
          />
        </div>

      </div>

      <LicenseRenewDrawer
        isOpen={isRenewDrawerOpen}
        onClose={() => { setIsRenewDrawerOpen(false); setSelectedMheForRenewal(null); }}
        mheId={selectedMheForRenewal}
      />
      <OperatorLicenseExpiryDrawer
        isOpen={isLicenseDrawerOpen}
        onClose={() => { setIsLicenseDrawerOpen(false); setSelectedOperatorForLicense(null); }}
        operatorId={selectedOperatorForLicense}
      />
    </div>
      )}

      <CriticalIssuesModal
        isOpen={isIssuesModalOpen}
        onClose={() => setIsIssuesModalOpen(false)}
      />
    </div>
  );
}
