// Stability Data Management Utility
// This manages rack stability data using localStorage for persistence

export type StabilityStatus = "Stable" | "Conditional" | "Not Stable" | "Not Evaluated";

export type RackData = {
  id: string;
  rackId: string;
  layout: string;
  oem: string;
  totalIssues: number;
  redIssues: number;
  amberIssues: number;
  greenIssues: number;
  lastInspection: string;
  inspector: string;
  status: StabilityStatus;
  evaluatedBy?: string;
  evaluatedOn?: string;
  conditionDescription?: string;
  instabilityReason?: string;
  recommendedAction?: string;
};

const STORAGE_KEY = "rams_stability_racks";

// Initial mock data
const initialMockRacks: RackData[] = [
  {
    id: "1",
    rackId: "RCK-A-001",
    layout: "Warehouse A - Aisle 1",
    oem: "OEM1",
    totalIssues: 12,
    redIssues: 3,
    amberIssues: 5,
    greenIssues: 4,
    lastInspection: "2026-03-08",
    inspector: "Inspector1",
    status: "Not Stable",
  },
  {
    id: "2",
    rackId: "RCK-A-002",
    layout: "Warehouse A - Aisle 1",
    oem: "OEM2",
    totalIssues: 8,
    redIssues: 0,
    amberIssues: 4,
    greenIssues: 4,
    lastInspection: "2026-03-07",
    inspector: "Inspector2",
    status: "Conditional",
  },
  {
    id: "3",
    rackId: "RCK-A-003",
    layout: "Warehouse A - Aisle 2",
    oem: "OEM3",
    totalIssues: 5,
    redIssues: 0,
    amberIssues: 1,
    greenIssues: 4,
    lastInspection: "2026-03-09",
    inspector: "Inspector3",
    status: "Stable",
  },
  {
    id: "4",
    rackId: "RCK-B-001",
    layout: "Warehouse B - Aisle 1",
    oem: "OEM4",
    totalIssues: 15,
    redIssues: 5,
    amberIssues: 7,
    greenIssues: 3,
    lastInspection: "2026-03-06",
    inspector: "Inspector4",
    status: "Not Stable",
  },
  {
    id: "5",
    rackId: "RCK-B-002",
    layout: "Warehouse B - Aisle 2",
    oem: "OEM5",
    totalIssues: 6,
    redIssues: 0,
    amberIssues: 2,
    greenIssues: 4,
    lastInspection: "2026-03-10",
    inspector: "Inspector5",
    status: "Stable",
  },
  {
    id: "6",
    rackId: "RCK-C-001",
    layout: "Warehouse C - Aisle 1",
    oem: "OEM6",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "7",
    rackId: "RCK-C-002",
    layout: "Warehouse C - Aisle 2",
    oem: "OEM7",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "8",
    rackId: "RCK-D-001",
    layout: "Warehouse D - Aisle 1",
    oem: "OEM8",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "9",
    rackId: "RCK-D-002",
    layout: "Warehouse D - Aisle 2",
    oem: "OEM9",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "10",
    rackId: "RCK-E-001",
    layout: "Warehouse E - Aisle 1",
    oem: "OEM10",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "11",
    rackId: "RCK-E-002",
    layout: "Warehouse E - Aisle 2",
    oem: "OEM11",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "12",
    rackId: "RCK-A-004",
    layout: "Warehouse A - Aisle 3",
    oem: "OEM12",
    totalIssues: 9,
    redIssues: 2,
    amberIssues: 3,
    greenIssues: 4,
    lastInspection: "2026-03-05",
    inspector: "Inspector6",
    status: "Conditional",
  },
  {
    id: "13",
    rackId: "RCK-A-005",
    layout: "Warehouse A - Aisle 4",
    oem: "OEM13",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "14",
    rackId: "RCK-B-003",
    layout: "Warehouse B - Aisle 3",
    oem: "OEM14",
    totalIssues: 11,
    redIssues: 4,
    amberIssues: 4,
    greenIssues: 3,
    lastInspection: "2026-03-04",
    inspector: "Inspector7",
    status: "Not Stable",
  },
  {
    id: "15",
    rackId: "RCK-B-004",
    layout: "Warehouse B - Aisle 4",
    oem: "OEM15",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "16",
    rackId: "RCK-F-001",
    layout: "Warehouse F - Aisle 1",
    oem: "OEM16",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "17",
    rackId: "RCK-F-002",
    layout: "Warehouse F - Aisle 2",
    oem: "OEM17",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "18",
    rackId: "RCK-G-001",
    layout: "Warehouse G - Aisle 1",
    oem: "OEM18",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "19",
    rackId: "RCK-G-002",
    layout: "Warehouse G - Aisle 2",
    oem: "OEM19",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "20",
    rackId: "RCK-H-001",
    layout: "Warehouse H - Aisle 1",
    oem: "OEM20",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "21",
    rackId: "RCK-H-002",
    layout: "Warehouse H - Aisle 2",
    oem: "OEM21",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "22",
    rackId: "RCK-I-001",
    layout: "Warehouse I - Aisle 1",
    oem: "OEM22",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "23",
    rackId: "RCK-I-002",
    layout: "Warehouse I - Aisle 2",
    oem: "OEM23",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "24",
    rackId: "RCK-J-001",
    layout: "Warehouse J - Aisle 1",
    oem: "OEM24",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
  {
    id: "25",
    rackId: "RCK-J-002",
    layout: "Warehouse J - Aisle 2",
    oem: "OEM25",
    totalIssues: 0,
    redIssues: 0,
    amberIssues: 0,
    greenIssues: 0,
    lastInspection: "—",
    inspector: "—",
    status: "Not Evaluated",
  },
];

// Initialize localStorage with mock data if not exists
export function initializeStabilityData(): void {
  if (typeof window === "undefined") return;
  
  const existingData = localStorage.getItem(STORAGE_KEY);
  if (!existingData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockRacks));
  }
}

// Get all racks
export function getAllRacks(): RackData[] {
  if (typeof window === "undefined") return initialMockRacks;
  
  initializeStabilityData();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialMockRacks;
}

// Get a single rack by rackId (e.g., "RCK-B-002")
export function getRackById(rackId: string): RackData | undefined {
  const racks = getAllRacks();
  return racks.find(rack => rack.rackId === rackId);
}

// Update a rack by rackId
export function updateRack(rackId: string, updates: Partial<RackData>): void {
  if (typeof window === "undefined") return;
  
  const racks = getAllRacks();
  const index = racks.findIndex(rack => rack.rackId === rackId);
  
  if (index !== -1) {
    racks[index] = { ...racks[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(racks));
    console.log(`✅ Updated rack ${rackId}:`, racks[index]);
  } else {
    console.error(`❌ Rack ${rackId} not found in data`);
  }
}

// Update rack status with evaluation details
export function updateRackStatus(
  rackId: string,
  status: StabilityStatus,
  evaluatorName: string,
  evaluationDate: string,
  conditionDescription?: string,
  instabilityReason?: string,
  recommendedAction?: string
): void {
  updateRack(rackId, {
    status,
    evaluatedBy: evaluatorName,
    evaluatedOn: evaluationDate,
    lastInspection: evaluationDate,
    conditionDescription,
    instabilityReason,
    recommendedAction,
  });
}

// Reset to initial mock data (useful for testing)
export function resetStabilityData(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockRacks));
  console.log("✅ Stability data has been reset to initial mock data");
  // Dispatch event to refresh UI
  window.dispatchEvent(new Event('stabilityDataUpdated'));
}

// Make reset function available globally for console access
if (typeof window !== "undefined") {
  (window as any).resetStabilityData = resetStabilityData;
  console.log("💡 Tip: Run 'resetStabilityData()' in console to reload fresh data");
}