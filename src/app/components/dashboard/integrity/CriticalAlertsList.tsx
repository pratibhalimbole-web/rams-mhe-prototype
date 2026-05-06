"use client";

import React from "react";
import { Card } from "../../ui/card";
import { AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "../../ui/utils";

const alerts = [
  {
    id: 1,
    severity: "critical",
    message: "Critical deflection detected in Rack A / Bay 3",
    time: "2h ago",
  },
  {
    id: 2,
    severity: "warning",
    message: "Missing safety pin in Rack B / Level 2",
    time: "4h ago",
  },
  {
    id: 3,
    severity: "warning",
    message: "Corrosion levels approaching threshold in Zone C",
    time: "1d ago",
  },
  {
    id: 4,
    severity: "critical",
    message: "Impact damage reported on Upright U-12",
    time: "2d ago",
  },
];

export function CriticalAlertsList() {
  return (
    null
  );
}
