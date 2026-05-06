"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Sparkles } from "lucide-react";

export function SafetyIntelligence() {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Safety Intelligence</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          Critical failures are concentrated in plumbness deviations and baseplate settlement issues 
          within Zones A3 and B4. The risk index has exceeded the acceptable threshold of 40, 
          reaching 70 points. Rack Upright and Beam elements show the highest failure rates with 
          9 and 7 failures respectively. Three consecutive failures in the same elements indicate 
          a need for immediate escalation and corrective action. Current inspection cycle shows 
          a 12% increase in total failures compared to the previous cycle.
        </p>
      </CardContent>
    </Card>
  );
}
