import React from "react";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { FileCheck, CheckCircle2, XCircle, AlertTriangle, Shield, PlayCircle } from "lucide-react";
import { TotalTestsDefinedModal } from "./TotalTestsDefinedModal";
import { TestsExecutedModal } from "./TestsExecutedModal";
import { TestsPassedModal } from "./TestsPassedModal";
import { TestsFailedModal } from "./TestsFailedModal";
import { CriticalFailuresModal } from "./CriticalFailuresModal";
import { useModalState } from "../../../hooks/useModalState";

interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  isWarning?: boolean;
  onClick?: () => void;
}

function KpiCard({
  label,
  value,
  icon,
  isWarning,
  onClick
}: KpiCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card
      className="cursor-pointer border-border rounded-xl border bg-card"
      onClick={handleClick}
    >
      <CardContent
        className="p-4 p-[12px]"
        style={{
          padding: "var(--spacing-4)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-6)",
        }}
      >
        {/* Top Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            className="bg-muted rounded-md"
            style={{
              padding: "var(--spacing-1-5)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {icon}
          </div>
        </div>

        {/* KPI Value */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-0-5)",
          }}
        >
          <div
            className={isWarning ? "text-destructive text-2xl font-bold leading-none" : "text-foreground text-2xl font-bold leading-none"}
            style={{
              fontSize: "var(--text-2xl)",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1,
            }}
          >
            {value}
          </div>
          <p
            className="text-muted-foreground"
            style={{
              fontSize: "var(--text-xs)",
              fontWeight: "var(--font-weight-normal)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export interface KpiStripProps {
  totalTests: number;
  testsExecuted: number;
  testsFailed: number;
  criticalFailures: number;
}

export function KpiStrip({ 
  totalTests, 
  testsExecuted, 
  testsFailed, 
  criticalFailures
}: KpiStripProps) {
  const [isTotalTestsModalOpen, openTotalTestsModal, closeTotalTestsModal] = useModalState("total-tests-defined");
  const [isTestsExecutedModalOpen, openTestsExecutedModal, closeTestsExecutedModal] = useModalState("tests-executed");
  const [isTestsPassedModalOpen, openTestsPassedModal, closeTestsPassedModal] = useModalState("tests-passed");
  const [isTestsFailedModalOpen, openTestsFailedModal, closeTestsFailedModal] = useModalState("tests-failed");
  const [isCriticalFailuresModalOpen, openCriticalFailuresModal, closeCriticalFailuresModal] = useModalState("critical-failures");

  // Calculate tests passed
  const testsPassed = testsExecuted - testsFailed;

  return (
    <>
      <div 
        className="grid md:grid-cols-2 lg:grid-cols-4"
        style={{
          gap: "var(--spacing-4)",
        }}
      >
        {/* Card 1: Total Tests Defined */}
        <KpiCard
          label="Total Tests Defined"
          value={totalTests}
          icon={<FileCheck className="h-5 w-5 text-primary" />}
          onClick={openTotalTestsModal}
        />

        {/* Card 2: Tests Executed */}
        <KpiCard
          label="Tests Executed"
          value={testsExecuted}
          icon={<PlayCircle className="h-5 w-5 text-blue-500" />}
          onClick={openTestsExecutedModal}
        />

        {/* Card 3: Tests Passed */}
        <KpiCard
          label="Tests Passed"
          value={testsPassed}
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          onClick={openTestsPassedModal}
        />

        {/* Card 4: Tests Failed */}
        <KpiCard
          label="Tests Failed"
          value={testsFailed}
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          isWarning={testsFailed > 0}
          onClick={openTestsFailedModal}
        />
      </div>

      {/* Modals */}
      <TotalTestsDefinedModal
        open={isTotalTestsModalOpen}
        onOpenChange={closeTotalTestsModal}
        totalTests={totalTests}
      />
      
      <TestsExecutedModal
        open={isTestsExecutedModalOpen}
        onOpenChange={closeTestsExecutedModal}
        testsExecuted={testsExecuted}
        totalTests={totalTests}
      />
      
      <TestsPassedModal
        open={isTestsPassedModalOpen}
        onOpenChange={closeTestsPassedModal}
        testsPassed={testsPassed}
        totalTests={totalTests}
      />
      
      <TestsFailedModal
        open={isTestsFailedModalOpen}
        onOpenChange={closeTestsFailedModal}
        testsFailed={testsFailed}
        totalTests={totalTests}
      />
      
      <CriticalFailuresModal
        open={isCriticalFailuresModalOpen}
        onOpenChange={closeCriticalFailuresModal}
        criticalFailures={criticalFailures}
        totalTests={totalTests}
      />
    </>
  );
}