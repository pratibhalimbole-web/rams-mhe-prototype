import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BarChart } from "lucide-react";

export function InspectionCycleInsights() {
  return (
    <div className="w-full h-full flex flex-col bg-[var(--background)] p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Inspection Cycle Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-[var(--muted-foreground)] mb-2">
              Inspection cycle analytics are under development
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              This module will provide insights into inspection cycles and trends.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
