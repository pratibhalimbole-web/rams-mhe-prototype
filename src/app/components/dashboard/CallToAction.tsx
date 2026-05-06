"use client";

import React from "react";
import { SetActionDrawer } from "./SetActionDrawer";
import { Button } from "../ui/button";

export function CallToAction() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[30px] font-semibold text-foreground mb-2">Call To Action</h1>
        <p className="text-sm text-muted-foreground">
          Manage and assign actions for combined observations
        </p>
      </div>

      {/* Content Area */}
      <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-center max-w-[500px]">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Set Action for Observations
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            After combining observations from multiple tests or inspections, use the Set Action
            drawer to assign appropriate corrective or monitoring actions. You can specify action
            types, adjust severity levels, and provide detailed notes for follow-up.
          </p>
          <Button onClick={() => setIsDrawerOpen(true)} className="min-h-[44px]">
            Open Set Action Drawer
          </Button>
        </div>

        {/* Example Placeholder Content */}
        <div className="mt-6 w-full max-w-[700px]">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-xs text-muted-foreground italic">
              <strong>Example scenario:</strong> After combining 3 observations (2 Red severity, 1
              Amber severity) related to rack upright plumbness and component damage, the inspector
              can open the Set Action drawer to assign a "Structural Assessment" action with
              optional severity adjustment and detailed justification notes.
            </p>
          </div>
        </div>
      </div>

      {/* Set Action Drawer */}
      <SetActionDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        severityDistribution={{
          red: 2,
          amber: 1,
          green: 0,
        }}
      />
    </div>
  );
}
