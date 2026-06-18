import { useEffect } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { SidebarLayout, useSidebar } from "./components/layout/SidebarLayout";
import { ProjectPlanner } from "./components/planning/ProjectPlanner";
import { IntegrityTestModule } from "./components/dashboard/IntegrityTestModule";
import { IntegrityTestDetail } from "./components/dashboard/IntegrityTestDetail";
import { BillOfQuantity } from "./components/dashboard/BillOfQuantity";
import { ElementStockManagement } from "./components/dashboard/ElementStockManagement";
import { RulesAndAction } from "./components/dashboard/RulesAndAction";
import { CallToAction } from "./components/dashboard/CallToAction";
import { ReportDashboard } from "./pages/report/ReportDashboard";
import { TemplateBuilder } from "./pages/report/TemplateBuilder";
import { TemplateLibrary } from "./pages/report/TemplateLibrary";
import { ReportBuilder } from "./pages/report/ReportBuilder";
import { ReportBuilderTest } from "./pages/report/ReportBuilderTest";
import { MheAnalytics } from "./pages/mhe/MheAnalytics";
import { OperatorMheDashboard } from "./pages/mhe/OperatorMheDashboard";
import { ActionBoard } from "./pages/mhe/ActionBoard";
import { FMS } from "./pages/mhe/FMS";
import { Stability } from "./pages/rack/Stability";
import { StabilityDetail } from "./pages/rack/StabilityDetail";
import { RackObservationDashboard } from "./pages/rack/RackObservationDashboard";
import { FMSDashboard } from "./pages/mhe/FMSDashboard";
import { Variation6Tab } from "./pages/mhe/Variation6Tab";
import { CommandDashboard } from "./pages/mhe/CommandDashboard";
import { WarehouseView3D } from "./pages/digital-twin/WarehouseView3D";
import { CommandCenter3D } from "./pages/mhe/CommandCenter3D";
import { IMDSInspectionFindings } from "./pages/mhe/IMDSInspectionFindings";
import { IMDSRulesAndAction } from "./pages/mhe/IMDSRulesAndAction";
import { IMDSManageChecklists } from "./pages/mhe/IMDSManageChecklists";

// Create a placeholder component for pages not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  const sidebar = useSidebar();
  
  useEffect(() => {
    if (sidebar) {
      sidebar.setSubPageTitle(title);
    }
  }, [sidebar, title]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">This page is under development</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SidebarLayout />,
    children: [
      // Default redirect
      {
        index: true,
        element: <Navigate to="/rack/irds/project-planner" replace />,
      },
      
      // Digital Twin routes — paths match sidebar feature IDs (flat domain: /domainId/featureId)
      {
        path: "digital-twin/dt-dashboard",
        element: <PlaceholderPage title="Digital Twin Overview" />,
      },
      {
        path: "digital-twin/dt-map",
        element: <WarehouseView3D />,
      },
      
      // Rack → IRDS routes
      {
        path: "rack/irds/project-planner",
        element: <ProjectPlanner />,
      },
      {
        path: "rack/irds/inspection",
        element: <PlaceholderPage title="Inspection" />,
      },
      {
        path: "rack/irds/inspection-cycle",
        element: <PlaceholderPage title="Inspection Cycle Insights" />,
      },
      {
        path: "rack/irds/inspection-findings",
        element: <PlaceholderPage title="Inspection Findings" />,
      },
      {
        path: "rack/irds/tpi-findings",
        element: <PlaceholderPage title="TPI Findings" />,
      },
      {
        path: "rack/irds/integrity-test",
        element: <IntegrityTestModule />,
      },
      {
        path: "rack/irds/integrity-test/:testId",
        element: <IntegrityTestDetail />,
      },
      {
        path: "rack/irds/rack-health",
        element: <PlaceholderPage title="Rack Health Analytics" />,
      },
      {
        path: "rack/irds/stability",
        element: <Stability />,
      },
      {
        path: "rack/irds/stability/:stabilityId",
        element: <StabilityDetail />,
      },
      {
        path: "rack/irds/rack-observation",
        element: <RackObservationDashboard />,
      },
      {
        path: "rack/irds/cta",
        element: <CallToAction />,
      },
      {
        path: "rack/irds/boq",
        element: <BillOfQuantity />,
      },
      {
        path: "rack/irds/stock-mgmt",
        element: <ElementStockManagement />,
      },
      {
        path: "rack/irds/purchase-req",
        element: <PlaceholderPage title="Purchase Request & Specs" />,
      },
      {
        path: "rack/irds/maintenance",
        element: <PlaceholderPage title="Maintenance" />,
      },
      {
        path: "rack/irds/compliance",
        element: <PlaceholderPage title="Compliance" />,
      },
      {
        path: "rack/irds/rules-action",
        element: <RulesAndAction />,
      },
      {
        path: "rack/irds/escalation",
        element: <PlaceholderPage title="Escalation Logs" />,
      },
      {
        path: "rack/irds/larc",
        element: <PlaceholderPage title="LARC Drawings" />,
      },
      {
        path: "rack/irds/report",
        element: <ReportDashboard />,
      },
      {
        path: "report",
        children: [
          {
            index: true,
            element: <ReportDashboard />,
          },
          {
            path: "create",
            element: <ReportBuilder />,
          },
          {
            path: "templates",
            element: <TemplateLibrary />,
          },
          {
            path: "templates/:templateId",
            element: <TemplateBuilder />,
          },
          {
            path: ":reportId",
            element: <ReportBuilderTest />,
          },
        ],
      },
      
      // MHE → Shared Features
      {
        path: "mhe/command-center",
        element: <CommandCenter3D />,
      },
      {
        path: "mhe/command-dashboard",
        element: <CommandDashboard />,
      },
      {
        path: "mhe/fms",
        element: <FMSDashboard />,
      },

      // MHE → MMS routes
      {
        path: "mhe/mms/dashboard",
        element: <FMSDashboard />,
      },
      {
        path: "mhe/mms/dashboard1",
        element: <Variation6Tab />,
      },
      {
        path: "mhe/mms/mhe-asset",
        element: <PlaceholderPage title="MHE Asset Details" />,
      },
      {
        path: "mhe/mms/operator-assign",
        element: <PlaceholderPage title="Operator Assignment" />,
      },
      {
        path: "mhe/mms/ops-settings",
        element: <PlaceholderPage title="Operational Settings" />,
      },
      {
        path: "mhe/mms/sensor-hub",
        element: <PlaceholderPage title="Sensor Hub" />,
      },
      
      // MHE → MEPS routes
      {
        path: "mhe/meps/mhe-monitor",
        element: <PlaceholderPage title="MHE Monitor" />,
      },
      {
        path: "mhe/meps/raw-data",
        element: <PlaceholderPage title="Raw Data" />,
      },
      {
        path: "mhe/meps/mhe-analytics",
        element: <MheAnalytics />,
      },
      {
        path: "mhe/meps/driver-analytics",
        element: <OperatorMheDashboard />,
      },
      
      // MHE → RTSS routes
      {
        path: "mhe/rtss/safety-config",
        element: <PlaceholderPage title="Safety Configuration" />,
      },
      {
        path: "mhe/rtss/mhe-monitor-rtss",
        element: <PlaceholderPage title="MHE Monitor" />,
      },
      {
        path: "mhe/rtss/raw-data-rtss",
        element: <PlaceholderPage title="Raw Data" />,
      },
      {
        path: "mhe/rtss/violation-review",
        element: <PlaceholderPage title="Violation Review" />,
      },
      {
        path: "mhe/rtss/mhe-analytics-rtss",
        element: <PlaceholderPage title="MHE Analytics" />,
      },
      {
        path: "mhe/rtss/driver-analytics-rtss",
        element: <PlaceholderPage title="Driver Analytics" />,
      },

      // MHE → IMDS routes
      {
        path: "mhe/imds/inspection-findings-imds",
        element: <IMDSInspectionFindings />,
      },
      {
        path: "mhe/imds/rules-action-imds",
        element: <IMDSRulesAndAction />,
      },
      {
        path: "mhe/imds/rules-action-imds/:typeId",
        element: <IMDSManageChecklists />,
      },

      // MHE → Shared Features (not under any suite)
      {
        path: "mhe/action-board",
        element: <ActionBoard />,
      },
      {
        path: "mhe/escalation-logs",
        element: <PlaceholderPage title="Escalation Logs" />,
      },
      {
        path: "mhe/report",
        element: <PlaceholderPage title="Report" />,
      },
      
      // Pallet → IMDS routes
      {
        path: "pallet/imds/checklist-config",
        element: <PlaceholderPage title="Checklist Configuration" />,
      },
      {
        path: "pallet/imds/inspection-findings-imds",
        element: <PlaceholderPage title="Inspection Findings" />,
      },
      {
        path: "pallet/imds/mhe-analytics-imds",
        element: <PlaceholderPage title="MHE Analytics" />,
      },
      {
        path: "pallet/imds/cta-imds",
        element: <PlaceholderPage title="Call To Action" />,
      },
      {
        path: "pallet/imds/insights",
        element: <PlaceholderPage title="Insights" />,
      },
      {
        path: "pallet/imds/inventory",
        element: <PlaceholderPage title="Inventory" />,
      },
      {
        path: "pallet/imds/report-imds",
        element: <PlaceholderPage title="Report" />,
      },
      
      // Analytics routes (flat)
      {
        path: "analytics/global-dashboard",
        element: <PlaceholderPage title="Global Dashboard" />,
      },
      {
        path: "analytics/cross-module",
        element: <PlaceholderPage title="Cross-Module Insights" />,
      },
      {
        path: "analytics/trend-analysis",
        element: <PlaceholderPage title="Trend Analysis" />,
      },
      {
        path: "analytics/perf-metrics",
        element: <PlaceholderPage title="Performance Metrics" />,
      },
      {
        path: "analytics/export-reports",
        element: <PlaceholderPage title="Export Reports" />,
      },
      
      // IoT routes (flat)
      {
        path: "iot/device-mgmt",
        element: <PlaceholderPage title="Device Management" />,
      },
      {
        path: "iot/sensor-mapping",
        element: <PlaceholderPage title="Sensor Mapping" />,
      },
      {
        path: "iot/live-data",
        element: <PlaceholderPage title="Live Data Stream" />,
      },
      {
        path: "iot/alerts",
        element: <PlaceholderPage title="Alerts & Thresholds" />,
      },
      {
        path: "iot/health-status",
        element: <PlaceholderPage title="Health Status" />,
      },
      
      // Library routes (flat)
      {
        path: "library/documents",
        element: <PlaceholderPage title="Documents" />,
      },
      {
        path: "library/sops",
        element: <PlaceholderPage title="SOPs" />,
      },
      {
        path: "library/drawings",
        element: <PlaceholderPage title="Drawings" />,
      },
      {
        path: "library/media",
        element: <PlaceholderPage title="Media" />,
      },
      {
        path: "library/templates",
        element: <PlaceholderPage title="Templates" />,
      },
      
      // Admin routes (flat)
      {
        path: "admin/user-mgmt",
        element: <PlaceholderPage title="User Management" />,
      },
      {
        path: "admin/roles",
        element: <PlaceholderPage title="Role & Permissions" />,
      },
      {
        path: "admin/org-settings",
        element: <PlaceholderPage title="Organization Settings" />,
      },
      {
        path: "admin/integrations",
        element: <PlaceholderPage title="Integrations" />,
      },
      {
        path: "admin/audit-logs",
        element: <PlaceholderPage title="Audit Logs" />,
      },
      {
        path: "admin/sys-config",
        element: <PlaceholderPage title="System Configuration" />,
      },
      
      // 404 fallback
      {
        path: "*",
        element: <Navigate to="/rack/irds/project-planner" replace />,
      },
    ],
  },
]);