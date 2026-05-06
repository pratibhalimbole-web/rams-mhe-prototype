import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Package } from "lucide-react";

interface RackObservation {
  id: string;
  rackId: string;
  zone: string;
  observationCount: number;
  redSeverity: number;
  amberSeverity: number;
  greenSeverity: number;
  inspectorName: string;
  inspectorInitials: string;
}

interface RackWiseObservationSummaryProps {
  data: RackObservation[];
}

export function RackWiseObservationSummary({
  data,
}: RackWiseObservationSummaryProps) {
  return (
    <Card className="rounded-xl border bg-white">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="text-base font-semibold">
          Rack-Wise Observation Summary
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Observations and severity grouped by rack
        </CardDescription>
      </CardHeader>
      <CardContent style={{ padding: "0 var(--spacing-6) var(--spacing-6) var(--spacing-6)" }}>
        <div className="flex flex-col gap-3">
          {data.map((rack) => (
            <Card
              key={rack.id}
              className="border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              {/* Left Section: Rack Icon, ID, Zone */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#1B59F8]" />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{rack.rackId}</p>
                  <span className="text-xs text-muted-foreground">{rack.zone}</span>
                </div>
              </div>

              {/* Middle Section: Observation Count & Severity */}
              <div className="flex items-center gap-8 flex-1 justify-center">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span className="text-sm font-semibold">
                    {rack.observationCount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    observations
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Red Severity */}
                  <div className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#EF4444" }}
                    />
                    <span className="text-xs font-medium">
                      {rack.redSeverity}
                    </span>
                  </div>

                  {/* Amber Severity */}
                  <div className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#F59E0B" }}
                    />
                    <span className="text-xs font-medium">
                      {rack.amberSeverity}
                    </span>
                  </div>

                  {/* Green Severity */}
                  <div className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "#22C55E" }}
                    />
                    <span className="text-xs font-medium">
                      {rack.greenSeverity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section: Inspector Avatar & Name */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs font-medium">
                    {rack.inspectorInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium whitespace-nowrap">
                  {rack.inspectorName}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
