import React from "react";
import { useSidebar } from "../../components/layout/SidebarLayout";
import { RackWiseObservationSummary } from "../../components/widgets/RackWiseObservationSummary";

const mockRackObservations = [
  {
    id: "1",
    rackId: "R-001",
    zone: "Zone A",
    observationCount: 18,
    redSeverity: 5,
    amberSeverity: 8,
    greenSeverity: 5,
    inspectorName: "Sarah Mitchell",
    inspectorInitials: "SM",
  },
  {
    id: "2",
    rackId: "R-002",
    zone: "Zone A",
    observationCount: 12,
    redSeverity: 2,
    amberSeverity: 6,
    greenSeverity: 4,
    inspectorName: "James Chen",
    inspectorInitials: "JC",
  },
  {
    id: "3",
    rackId: "R-003",
    zone: "Zone B",
    observationCount: 25,
    redSeverity: 8,
    amberSeverity: 10,
    greenSeverity: 7,
    inspectorName: "Emily Rodriguez",
    inspectorInitials: "ER",
  },
  {
    id: "4",
    rackId: "R-004",
    zone: "Zone B",
    observationCount: 9,
    redSeverity: 1,
    amberSeverity: 4,
    greenSeverity: 4,
    inspectorName: "M. González",
    inspectorInitials: "MG",
  },
  {
    id: "5",
    rackId: "R-005",
    zone: "Zone C",
    observationCount: 21,
    redSeverity: 9,
    amberSeverity: 6,
    greenSeverity: 6,
    inspectorName: "C. Wei",
    inspectorInitials: "CW",
  },
];

export function RackObservationDashboard() {
  const sidebar = useSidebar();

  React.useEffect(() => {
    sidebar?.setSubPageTitle("Rack Observations");
  }, [sidebar]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <RackWiseObservationSummary data={mockRackObservations} />
    </div>
  );
}
