import React, { useState } from "react";
import { Truck, Activity, ShieldCheck, Wifi } from "lucide-react";
import { KPICard, LicenseRenewDrawer, OperatorLicenseExpiryDrawer } from "./FMSDashboard";
import { TopMhesWithFindingsV3 } from "../../components/widgets/v3/TopMhesWithFindingsV3";
import { FleetCompositionWidget } from "../../components/widgets/v6/FleetCompositionWidget";
import { TopFailingPartsWidget } from "../../components/widgets/v6/TopFailingPartsWidget";
import { TopMhesWithFindingsWidget } from "../../components/widgets/v6/TopMhesWithFindingsWidget";
import { LiabilityExposureWidget } from "../../components/widgets/v6/LiabilityExposureWidget";
import { AssetBurnForecastWidget } from "../../components/widgets/v6/AssetBurnForecastWidget";
import { TodaysActivityWidget } from "../../components/widgets/v6/TodaysActivityWidget";
import { TripLoadBreakdownWidget } from "../../components/widgets/v6/TripLoadBreakdownWidget";
import { InspectionHealthWidget } from "../../components/widgets/v6/InspectionHealthWidget";
import { WarrantyExpiryTableV3 } from "../../components/widgets/v3/WarrantyExpiryTableV3";
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
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "var(--w-text-2)" }}>
            FMS · COMMAND CENTER
          </span>
        </div>

        <div className="col-span-3">
          <KPICard title="Fleet Size"         value="42"  description="Total machines in operation" icon={Truck} />
        </div>
        <div className="col-span-3">
          <KPICard title="Fleet Utilization"  value="78%" description="Percentage active equipment" icon={Activity} />
        </div>
        <div className="col-span-3">
          <KPICard title="Fleet Safety Score" value="92%" description="Safety performance rating"   icon={ShieldCheck} />
        </div>
        <div className="col-span-3">
          <KPICard title="Sensor Health"      value="95%" description="Active sensors percentage"   icon={Wifi} />
        </div>

        {/* Section — RTSS */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "var(--w-text-2)" }}>
            FMS · RTSS
          </span>
        </div>

        <div className="col-span-12 xl:col-span-8 flex min-h-[422px]">
          <TopMhesWithFindingsV3 />
        </div>
        <div className="col-span-12 xl:col-span-4 flex min-h-[422px]">
          <FleetCompositionWidget />
        </div>

        {/* Section — Activity & Inspection */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "var(--w-text-2)" }}>
            COMMAND CENTER · ACTIVITY
          </span>
        </div>

        <div className="col-span-4 flex min-h-[422px]">
          <TodaysActivityWidget />
        </div>
        <div className="col-span-4 flex min-h-[422px]">
          <TripLoadBreakdownWidget />
        </div>
        <div className="col-span-4 flex min-h-[422px]">
          <InspectionHealthWidget />
        </div>

        {/* Section — Risk & Service Signals */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "var(--w-text-2)" }}>
            RISK &amp; SERVICE SIGNALS
          </span>
        </div>

        <div className="col-span-6 flex min-h-[380px]">
          <LiabilityExposureWidget />
        </div>
        <div className="col-span-6 flex min-h-[380px]">
          <AssetBurnForecastWidget />
        </div>

        {/* Section — Top Failing Parts & Top MHEs */}
        <div className="col-span-12" style={{ marginTop: "-4px", marginBottom: "-12px" }}>
          <span className="font-semibold uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", color: "var(--w-text-2)" }}>
            COMMAND CENTER · FINDINGS
          </span>
        </div>

        <div className="col-span-6 flex min-h-[422px]">
          <TopFailingPartsWidget />
        </div>
        <div className="col-span-6 flex min-h-[422px]">
          <TopMhesWithFindingsWidget />
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
