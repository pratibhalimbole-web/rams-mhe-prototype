import React from "react";
import { Button } from "@/app/components/ui/button";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function ReportCreate() {
  const navigate = useNavigate();
  return (
    <div className="p-8">
      <Button variant="ghost" onClick={() => navigate("/report")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      <h1 className="text-2xl font-bold">Create Report</h1>
      <p className="text-muted-foreground">Select a template to start.</p>
    </div>
  );
}