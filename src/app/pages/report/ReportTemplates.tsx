import React from "react";
import { Button } from "@/app/components/ui/button";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

export function ReportTemplates() {
  const navigate = useNavigate();
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/report")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Templates</h1>
        </div>
        <Button onClick={() => navigate("/report/templates/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </div>
      <p className="text-muted-foreground">Manage your report templates here.</p>
    </div>
  );
}