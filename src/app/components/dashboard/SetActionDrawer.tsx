"use client";

import React from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "../ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { toast } from "sonner";

interface SetActionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  severityDistribution?: {
    red: number;
    amber: number;
    green: number;
  };
}

export function SetActionDrawer({
  open,
  onOpenChange,
  severityDistribution = { red: 2, amber: 1, green: 0 },
}: SetActionDrawerProps) {
  const [actionType, setActionType] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [changeSeverity, setChangeSeverity] = React.useState(false);
  const [selectedSeverity, setSelectedSeverity] = React.useState<
    "red" | "amber" | "green" | undefined
  >(undefined);
  const [severityReason, setSeverityReason] = React.useState("");
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [validationError, setValidationError] = React.useState("");

  // Determine highest severity from distribution
  const highestSeverity = React.useMemo(() => {
    if (severityDistribution.red > 0) return "red";
    if (severityDistribution.amber > 0) return "amber";
    return "green";
  }, [severityDistribution]);

  // Set default severity when switch is turned on
  React.useEffect(() => {
    if (changeSeverity && !selectedSeverity) {
      setSelectedSeverity(highestSeverity as "red" | "amber" | "green");
    }
  }, [changeSeverity, selectedSeverity, highestSeverity]);

  // Reset form when drawer closes
  React.useEffect(() => {
    if (!open) {
      setActionType("");
      setNotes("");
      setChangeSeverity(false);
      setSelectedSeverity(undefined);
      setSeverityReason("");
      setValidationError("");
    }
  }, [open]);

  // Validate severity change
  const validateSeverityChange = () => {
    if (changeSeverity && selectedSeverity !== highestSeverity && !severityReason.trim()) {
      setValidationError("Reason for severity change is required");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleAssignAction = () => {
    // Validate severity change if applicable
    if (!validateSeverityChange()) {
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmAssign = () => {
    // Close confirmation dialog
    setShowConfirmDialog(false);

    // Show success toast
    toast.success("Action assigned successfully.");

    // Close drawer
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent 
          side="right" 
          className="w-[560px] flex flex-col p-0 gap-0"
        >
          {/* Header */}
          <SheetHeader className="px-6 pt-6 pb-4">
            <SheetTitle className="text-xl font-semibold">Set Action</SheetTitle>
            <SheetDescription className="sr-only">
              Assign actions and configure severity for combined observations
            </SheetDescription>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6">
            <div className="flex flex-col gap-6 pb-6">
              {/* Action Type */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="action-type">Action Type *</Label>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger id="action-type">
                    <SelectValue placeholder="Select action type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="replace">Replace</SelectItem>
                    <SelectItem value="monitor">Monitor</SelectItem>
                    <SelectItem value="escalate">Escalate</SelectItem>
                    <SelectItem value="structural-assessment">Structural Assessment</SelectItem>
                    <SelectItem value="lockout-zone">Lockout Zone</SelectItem>
                    <SelectItem value="temporary-fix">Temporary Fix</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Severity Distribution - Display Only */}
              <div className="flex gap-2 pt-6 pb-4">
                <Badge
                  variant="outline"
                  className="rounded-full bg-transparent text-destructive border-destructive px-4 py-1.5 gap-2 flex items-center"
                >
                  <span className="text-sm font-medium">Red</span>
                  <span className="text-sm font-medium">
                    {severityDistribution.red}
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full bg-transparent text-warning border-warning px-4 py-1.5 gap-2 flex items-center"
                >
                  <span className="text-sm font-medium">Amber</span>
                  <span className="text-sm font-medium">
                    {severityDistribution.amber}
                  </span>
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full bg-transparent text-success border-success px-4 py-1.5 gap-2 flex items-center"
                >
                  <span className="text-sm font-medium">Green</span>
                  <span className="text-sm font-medium">
                    {severityDistribution.green}
                  </span>
                </Badge>
              </div>

              {/* Change Severity Switch */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-normal">Change severity</span>
                <Switch 
                  checked={changeSeverity} 
                  onCheckedChange={setChangeSeverity}
                />
              </div>

              {/* Conditional: Severity Change Controls */}
              {changeSeverity && (
                <div className="flex flex-col gap-4 pt-6">
                  {/* New Severity - Toggle Group */}
                  <div className="flex flex-col gap-2">
                    <Label>New severity *</Label>
                    <ToggleGroup
                      type="single"
                      value={selectedSeverity}
                      onValueChange={(value) => {
                        if (value) {
                          setSelectedSeverity(value as "red" | "amber" | "green");
                          setValidationError("");
                        }
                      }}
                      variant="outline"
                      className="grid grid-cols-3 w-full gap-0 rounded-lg border border-input overflow-hidden"
                    >
                      <ToggleGroupItem 
                        value="red" 
                        aria-label="Select Red severity"
                        className="text-sm font-medium uppercase tracking-wide bg-background text-foreground hover:bg-muted data-[state=on]:bg-red-100 data-[state=on]:border-red-300 data-[state=on]:text-red-800"
                      >
                        RED
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="amber" 
                        aria-label="Select Amber severity"
                        className="text-sm font-medium uppercase tracking-wide bg-background text-foreground hover:bg-muted data-[state=on]:bg-yellow-100 data-[state=on]:border-yellow-300 data-[state=on]:text-yellow-900"
                      >
                        AMBER
                      </ToggleGroupItem>
                      <ToggleGroupItem 
                        value="green" 
                        aria-label="Select Green severity"
                        className="text-sm font-medium uppercase tracking-wide bg-background text-foreground hover:bg-muted data-[state=on]:bg-green-100 data-[state=on]:border-green-300 data-[state=on]:text-green-800"
                      >
                        GREEN
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  {/* Severity Change Reason */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="severity-reason">Reason for severity change *</Label>
                    <Textarea
                      id="severity-reason"
                      placeholder="Explain why the severity is being changed..."
                      value={severityReason}
                      onChange={(e) => {
                        setSeverityReason(e.target.value);
                        if (e.target.value.trim()) {
                          setValidationError("");
                        }
                      }}
                      onBlur={validateSeverityChange}
                      className={`min-h-[100px] resize-none ${validationError ? "border-destructive" : ""}`}
                    />
                    {validationError && (
                      <span className="text-sm text-destructive">{validationError}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Footer */}
          <SheetFooter className="border-t px-6 py-4 flex-row justify-end gap-3 mt-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignAction}>
              Assign Action
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold">
              Confirm Action Assignment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to assign this action? This will update the observation status.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAssign}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}