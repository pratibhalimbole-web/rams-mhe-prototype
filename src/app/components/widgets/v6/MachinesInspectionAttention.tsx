import React, { useState } from "react";
import { Truck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { machinesInspectionData } from "../../../pages/mhe/FMSDashboard";

function getPartWithMostIssues(mheId: string): string | null {
  const machine = (machinesInspectionData as any[]).find((m) => m.mheId === mheId);
  if (!machine?.part_issues?.length) return null;
  const map = new Map<string, number>();
  machine.part_issues.forEach((issue: any) => {
    map.set(issue.part_name, issue.amber_count + issue.red_count);
  });
  if (!map.size) return null;
  return Array.from(map.entries()).reduce(
    (max, [part, count]) => count > (max[1] || 0) ? [part, count] : max, ["", 0]
  )[0] || null;
}

export function MachinesInspectionAttention() {
  const [selectedEquipment, setSelectedEquipment] = useState("Electric Forklift");

  return (
    <Card className="shadow-none border-[var(--border)] flex flex-col overflow-hidden" style={{ height: "448px" }}>
      <CardHeader className="pb-4 border-b border-[var(--border)]">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
              Machines Requiring Inspection Attention
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              MHE units with warning or critical findings from recent inspections.
            </CardDescription>
          </div>
          <div className="w-[200px] flex-shrink-0">
            <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
              <SelectTrigger className="h-8 text-xs w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Electric Forklift">Electric Forklift</SelectItem>
                <SelectItem value="Reach Truck">Reach Truck</SelectItem>
                <SelectItem value="Pallet Jack">Pallet Jack</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {(machinesInspectionData as any[]).map((row) => {
            const formattedDate = new Date(row.lastInspection).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
            const partWithMostIssues = getPartWithMostIssues(row.mheId);
            const hasIssues = row.redFindings > 0 || row.amberFindings > 0;
            return (
              <Card key={row.mheId} className="shadow-none border rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#eff6ff" }}>
                      <Truck className="h-4 w-4" style={{ color: "#1b59f8" }} />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)] font-mono text-[color:var(--primary)]">{row.mheId}</p>
                      <span className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">Last Inspection: {formattedDate}</span>
                    </div>
                  </div>
                  {hasIssues && partWithMostIssues ? (
                    <div className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0" style={{ backgroundColor: "#EEF2FF", color: "#1E40AF", borderColor: "#E0E7FF" }}>
                      <AlertTriangle className="h-3.5 w-3.5" style={{ color: "#2563EB" }} />
                      <span>Most Issues: {partWithMostIssues}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border flex-shrink-0" style={{ backgroundColor: "#ECFDF5", color: "#065F46", borderColor: "#D1FAE5" }}>
                      <span>All Good</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  {[
                    { label: "Red",   value: row.redFindings,   color: "var(--destructive)" },
                    { label: "Amber", value: row.amberFindings, color: "var(--warning)"     },
                    { label: "Green", value: row.greenFindings, color: "var(--success)"     },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="text-[length:var(--text-xs)]" style={{ color: "#9CA3AF" }}>{label}</span>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">{value}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[length:var(--text-xs)]" style={{ color: "#9CA3AF" }}>Parts</span>
                    <span className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">{row.parts}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
