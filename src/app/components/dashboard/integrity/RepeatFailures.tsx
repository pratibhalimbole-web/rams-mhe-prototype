"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { ChevronRight } from "lucide-react";

const repeatData = [
  { item: "3 cons", severity: "Escalate", variant: "default" as const },
  { item: "3 cons", severity: "Major", variant: "secondary" as const },
  { item: "3 cons", severity: "Minor", variant: "outline" as const },
  { item: "2 cons", severity: "1 more", variant: "outline" as const },
];

export function RepeatFailures() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repeat Failures</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Subheader */}
        <div className="text-xs font-medium text-muted-foreground mb-3">
          Last 2 cycles
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {repeatData.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <Badge variant={item.variant}>
                {item.severity}
              </Badge>

              <div className="flex items-center gap-1">
                <span className="text-sm">{item.item}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
