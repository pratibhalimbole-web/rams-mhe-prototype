import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText } from "lucide-react";

export function ProjectPlanner() {
  return (
    <div className="w-full h-full flex flex-col bg-[var(--background)] p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Project Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-[var(--muted-foreground)] mb-2">
              Project planning features are under development
            </div>
            <p className="text-sm text-[var(--muted-foreground)]">
              This module will allow you to plan and schedule inspection projects.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
