"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Plus, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Calendar } from "../ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "sonner"
import { cn } from "../../../lib/utils"

// --- Types ---

interface CreateBOQProps {
  onCancel: () => void
  onCreate: () => void
}

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

// --- Component ---

export function CreateBOQ({ onCancel, onCreate }: CreateBOQProps) {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  })
  const [boqId, setBoqId] = React.useState("")
  const [selectedOEMs, setSelectedOEMs] = React.useState<string[]>([])
  const [oemInput, setOemInput] = React.useState("")
  const [isGenerating, setIsGenerating] = React.useState(false)

  const availableOEMs = ["Dexion", "SSI Schaefer", "Mecalux", "Stow", "Interlake"]

  const handleAddOEM = (oem: string) => {
    if (oem && !selectedOEMs.includes(oem)) {
      setSelectedOEMs([...selectedOEMs, oem])
      setOemInput("")
    }
  }

  const handleRemoveOEM = (oem: string) => {
    setSelectedOEMs(selectedOEMs.filter(o => o !== oem))
  }

  const handleGenerate = async () => {
    // Validation
    if (!dateRange.from || !dateRange.to) {
      toast.error("Please select an inspection date range")
      return
    }

    if (!boqId.trim()) {
      toast.error("Please enter a BOQ ID")
      return
    }

    if (selectedOEMs.length === 0) {
      toast.error("Please select at least one OEM")
      return
    }

    setIsGenerating(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    toast.success("BOQ created successfully")
    setIsGenerating(false)
    onCreate()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {/* BOQ Configuration Card */}
          <Card>
            <CardHeader>
              <CardTitle>BOQ Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* BOQ ID */}
              <div className="space-y-2">
                <Label htmlFor="boq-id">BOQ ID</Label>
                <Input
                  id="boq-id"
                  placeholder="e.g., BOQ-APR25-1001"
                  value={boqId}
                  onChange={(e) => setBoqId(e.target.value)}
                />
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Inspection Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => {
                        setDateRange({
                          from: range?.from,
                          to: range?.to,
                        })
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* OEM Selection */}
              <div className="space-y-2">
                <Label>OEM Selection</Label>
                <div className="flex gap-2">
                  <Select value={oemInput} onValueChange={setOemInput}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select OEM" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOEMs
                        .filter(oem => !selectedOEMs.includes(oem))
                        .map((oem) => (
                          <SelectItem key={oem} value={oem}>
                            {oem}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddOEM(oemInput)}
                    disabled={!oemInput || selectedOEMs.includes(oemInput)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Selected OEMs */}
                {selectedOEMs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedOEMs.map((oem) => (
                      <div
                        key={oem}
                        className="inline-flex items-center gap-1 bg-muted text-muted-foreground px-3 py-1 rounded-md text-sm"
                      >
                        {oem}
                        <button
                          type="button"
                          onClick={() => handleRemoveOEM(oem)}
                          className="ml-1 hover:text-foreground transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                The Bill of Quantity (BOQ) will be generated based on the inspection data
                from the selected date range and OEMs. All observations and repair items
                will be automatically aggregated.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t bg-card px-6 py-4 flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isGenerating}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate BOQ"}
        </Button>
      </div>
    </div>
  )
}