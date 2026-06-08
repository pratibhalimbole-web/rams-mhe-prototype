import React, { useState } from "react";
import { Truck, Activity, ShieldCheck, Wifi } from "lucide-react";
import { KpiCardV3 } from "../../components/widgets/v3/KpiCardV3";
import { SeverityTrendLineV3 } from "../../components/widgets/v3/SeverityTrendLineV3";
import { FleetCompositionWidget } from "../../components/widgets/v6/FleetCompositionWidget";
import { FleetHealthDistributionWidget } from "../../components/widgets/v6/FleetHealthDistributionWidget";
import { ComponentFailureWidget } from "../../components/widgets/v6/ComponentFailureWidget";
import { InspectionAttentionWidget } from "../../components/widgets/v6/InspectionAttentionWidget";
import { WarrantyExpiryTableV3 } from "../../components/widgets/v3/WarrantyExpiryTableV3";
import { LicenseRenewDrawer, OperatorLicenseExpiryDrawer } from "./FMSDashboard";
import { CriticalIssuesModal } from "../../components/widgets/CriticalIssuesModal";

export function Variation6Tab() {
  const [isIssuesModalOpen, setIsIssuesModalOpen] = useState(false);
  const [isRenewDrawerOpen, setIsRenewDrawerOpen] = useState(false);
  const [selectedMheForRenewal, setSelectedMheForRenewal] = useState<string | null>(null);
  const [isLicenseDrawerOpen, setIsLicenseDrawerOpen] = useState(false);
  const [selectedOperatorForLicense, setSelectedOperatorForLicense] = useState<string | null>(null);

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="grid grid-cols-12 gap-6">

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

        {/* Section — IMDS Operational Widgets */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
            FMS · IMDS
          </span>
        </div>

        <div className="col-span-12 xl:col-span-7 flex min-h-[420px]">
          <FleetHealthDistributionWidget />
        </div>
        <div className="col-span-12 xl:col-span-5 flex min-h-[420px]">
          <ComponentFailureWidget />
        </div>

        <div className="col-span-12 xl:col-span-7 flex min-h-[380px]">
          <InspectionAttentionWidget />
        </div>
        <div className="col-span-12 xl:col-span-5 flex min-h-[380px]">
          <SeverityTrendLineV3 hideInsight />
        </div>

        {/* Section — Fleet Composition */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "#64748B" }}>
            FMS · FLEET
          </span>
        </div>

        <div className="col-span-12 xl:col-span-5 flex min-h-[340px]">
          <FleetCompositionWidget />
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

      <CriticalIssuesModal
        isOpen={isIssuesModalOpen}
        onClose={() => setIsIssuesModalOpen(false)}
      />
    </div>
  );
}
