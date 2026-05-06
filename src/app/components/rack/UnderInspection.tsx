import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ListChecks } from "lucide-react";

export function UnderInspection() {
  return (
    <div className="w-full h-full flex flex-col bg-[var(--background)] p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-5 w-5" />
            Under Inspection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-[var(--muted-foreground)] mb-2">
              Active inspection monitoring is under development
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              This module will display racks currently under inspection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
