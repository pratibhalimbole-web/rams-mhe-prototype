import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface InspectorBreakdown {
  inspectorName: string;
  totalInspections: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  pendingFindings: number;
}

const generateInspectorData = (): InspectorBreakdown[] => {
  const inspectors = ["John Smith", "Maria Garcia", "James Chen", "Sarah Johnson", "David Wilson"];
  return inspectors.map(name => ({
    inspectorName: name,
    totalInspections: Math.floor(Math.random() * 20) + 5,
    highSeverity: Math.floor(Math.random() * 8),
    mediumSeverity: Math.floor(Math.random() * 12),
    lowSeverity: Math.floor(Math.random() * 15),
    pendingFindings: Math.floor(Math.random() * 10),
  })).sort((a, b) => (b.highSeverity + b.mediumSeverity) - (a.highSeverity + a.mediumSeverity));
};

export function MachinesRequiringInspectionAttention() {
  const [selectedInspector, setSelectedInspector] = useState("All");
  const inspectorData = useMemo(() => generateInspectorData(), []);
  
  const inspectors = ["All", ...inspectorData.map(i => i.inspectorName)];
  const filteredData = selectedInspector === "All" ? inspectorData : inspectorData.filter(i => i.inspectorName === selectedInspector);

  return (
    <Card className="col-span-6 shadow-none border-[var(--border)]">
      <CardHeader className="pb-4 border-b border-[var(--border)]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-[length:var(--text-sm)] font-[var(--font-weight-semi-bold)]">
              Inspector-wise Inspection Breakdown
            </CardTitle>
            <CardDescription className="text-[length:var(--text-xs)] text-[var(--muted-foreground)]">
              Inspection findings by inspector
            </CardDescription>
          </div>
          <div className="w-[180px] flex-shrink-0">
            <Select value={selectedInspector} onValueChange={setSelectedInspector}>
              <SelectTrigger className="h-8 text-xs w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {inspectors.map(inspector => (
                  <SelectItem key={inspector} value={inspector}>{inspector}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {filteredData.map((inspector, idx) => {
            const totalFindings = inspector.highSeverity + inspector.mediumSeverity + inspector.lowSeverity;
            const maxValue = Math.max(...inspectorData.map(i => i.highSeverity + i.mediumSeverity + i.lowSeverity), 1);
            const fillPercentage = (totalFindings / maxValue) * 100;

            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[var(--foreground)]">{inspector.inspectorName}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">Total: {inspector.totalInspections}</span>
                </div>
                
                {/* Stacked bar for severity breakdown */}
                <div className="flex h-8 rounded overflow-hidden bg-[var(--muted)] border border-[var(--border)]">
                  {inspector.highSeverity > 0 && (
                    <div
                      style={{ width: `${(inspector.highSeverity / totalFindings) * 100}%` }}
                      className="bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center"
                      title={`High: ${inspector.highSeverity}`}
                    >
                      {inspector.highSeverity > 0 && <span className="text-xs font-bold text-white">{inspector.highSeverity}</span>}
                    </div>
                  )}
                  {inspector.mediumSeverity > 0 && (
                    <div
                      style={{ width: `${(inspector.mediumSeverity / totalFindings) * 100}%` }}
                      className="bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center"
                      title={`Medium: ${inspector.mediumSeverity}`}
                    >
                      {inspector.mediumSeverity > 0 && <span className="text-xs font-bold text-white">{inspector.mediumSeverity}</span>}
                    </div>
                  )}
                  {inspector.lowSeverity > 0 && (
                    <div
                      style={{ width: `${(inspector.lowSeverity / totalFindings) * 100}%` }}
                      className="bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center"
                      title={`Low: ${inspector.lowSeverity}`}
                    >
                      {inspector.lowSeverity > 0 && <span className="text-xs font-bold text-white">{inspector.lowSeverity}</span>}
                    </div>
                  )}
                </div>

                {/* Summary counts */}
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-[var(--foreground)]">High: {inspector.highSeverity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-[var(--foreground)]">Medium: {inspector.mediumSeverity}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-[var(--foreground)]">Low: {inspector.lowSeverity}</span>
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="font-semibold text-[var(--foreground)]">Pending: {inspector.pendingFindings}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
