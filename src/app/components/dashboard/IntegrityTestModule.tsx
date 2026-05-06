import React, { useState } from "react";
import { cn } from "../ui/utils";
import { IntegrityOverview } from "./IntegrityOverview";
import { IntegritySummary } from "./IntegritySummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

type IntegrityTab = "overview" | "summary";
type DateRangePreset = "last7days" | "last30days" | "last90days" | "last6months" | "last12months" | "custom";

export function IntegrityTestModule() {
  const [activeTab, setActiveTab] = useState<IntegrityTab>("overview");
  const [selectedPreset, setSelectedPreset] = useState<DateRangePreset>("last6months");
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);

  // Calculate date range based on preset
  const getDateRangeFromPreset = (preset: DateRangePreset): DateRange | undefined => {
    const today = new Date();
    switch (preset) {
      case "last7days":
        return { from: subDays(today, 7), to: today };
      case "last30days":
        return { from: subDays(today, 30), to: today };
      case "last90days":
        return { from: subDays(today, 90), to: today };
      case "last6months":
        return { from: subMonths(today, 6), to: today };
      case "last12months":
        return { from: subMonths(today, 12), to: today };
      case "custom":
        return customDateRange;
      default:
        return { from: subMonths(today, 6), to: today };
    }
  };

  const currentDateRange = getDateRangeFromPreset(selectedPreset);

  // Display label for the date range selector
  const getDisplayLabel = () => {
    if (selectedPreset === "custom" && customDateRange?.from && customDateRange?.to) {
      return `${format(customDateRange.from, "MMM d, yyyy")} - ${format(customDateRange.to, "MMM d, yyyy")}`;
    }
    
    switch (selectedPreset) {
      case "last7days":
        return "Last 7 Days";
      case "last30days":
        return "Last 30 Days";
      case "last90days":
        return "Last 90 Days";
      case "last6months":
        return "Last 6 Months";
      case "last12months":
        return "Last 12 Months";
      case "custom":
        return "Custom Range";
      default:
        return "Last 6 Months";
    }
  };

  const handlePresetChange = (value: DateRangePreset) => {
    setSelectedPreset(value);
    if (value === "custom") {
      setShowCustomCalendar(true);
    } else {
      setShowCustomCalendar(false);
    }
  };

  const handleCustomDateChange = (dateRange: DateRange | undefined) => {
    setCustomDateRange(dateRange);
    if (dateRange?.from && dateRange?.to) {
      setShowCustomCalendar(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-background">
      {/* Header Row with Tabs and Date Range Selector */}
      <div 
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: "var(--background)",
          paddingTop: "var(--spacing-6)",
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "var(--spacing-4)",
        }}
      >
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={(value) => setActiveTab(value as IntegrityTab)}>
            <TabsList className="bg-[var(--muted)] p-1 rounded-[var(--radius)]">
              <TabsTrigger 
                value="overview" 
                className="gap-2 px-4 py-2 text-[length:var(--text-sm)] font-[var(--font-weight-medium)] rounded-[var(--radius-sm)] shadow-none data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] transition-colors"
              >
                Integrity Overview
              </TabsTrigger>
              <TabsTrigger 
                value="summary" 
                className="gap-2 px-4 py-2 text-[length:var(--text-sm)] font-[var(--font-weight-medium)] rounded-[var(--radius-sm)] shadow-none data-[state=active]:bg-[var(--background)] data-[state=active]:text-[var(--foreground)] transition-colors"
              >
                Integrity Summary
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right: Date Range Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
            <Popover open={showCustomCalendar} onOpenChange={setShowCustomCalendar}>
              <div style={{ position: "relative" }}>
                <Select
                  value={selectedPreset}
                  onValueChange={handlePresetChange}
                >
                  <SelectTrigger 
                    style={{
                      width: "200px",
                      height: "var(--input-height)",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-2)",
                      paddingLeft: "var(--spacing-3)",
                      paddingRight: "var(--spacing-3)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)" }}>
                      <CalendarIcon 
                        style={{ 
                          width: "16px", 
                          height: "16px",
                          color: "var(--muted-foreground)",
                          flexShrink: 0,
                        }} 
                      />
                      <span 
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "var(--text-sm)",
                          fontWeight: "var(--font-weight-normal)",
                          color: "var(--foreground)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {getDisplayLabel()}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last7days">Last 7 Days</SelectItem>
                    <SelectItem value="last30days">Last 30 Days</SelectItem>
                    <SelectItem value="last90days">Last 90 Days</SelectItem>
                    <SelectItem value="last6months">Last 6 Months</SelectItem>
                    <SelectItem value="last12months">Last 12 Months</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>

                {/* Custom Date Range Calendar Popover */}
                {selectedPreset === "custom" && (
                  <PopoverContent 
                    style={{
                      width: "auto",
                      padding: "0",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--border)",
                      boxShadow: "var(--elevation-sm)",
                      backgroundColor: "var(--popover)",
                    }}
                    align="end"
                    sideOffset={8}
                  >
                    <div style={{ display: "flex" }}>
                      <div 
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--spacing-1)",
                          padding: "var(--spacing-3)",
                          borderRight: "1px solid var(--border)",
                          backgroundColor: "var(--card)",
                        }}
                      >
                        <Button
                          variant="ghost"
                          style={{
                            justifyContent: "flex-start",
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            height: "var(--input-height)",
                            paddingLeft: "var(--spacing-3)",
                            paddingRight: "var(--spacing-3)",
                            borderRadius: "var(--radius-sm)",
                          }}
                          onClick={() => handleCustomDateChange({ from: new Date(), to: new Date() })}
                        >
                          Today
                        </Button>
                        <Button
                          variant="ghost"
                          style={{
                            justifyContent: "flex-start",
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            height: "var(--input-height)",
                            paddingLeft: "var(--spacing-3)",
                            paddingRight: "var(--spacing-3)",
                            borderRadius: "var(--radius-sm)",
                          }}
                          onClick={() => handleCustomDateChange({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) })}
                        >
                          Yesterday
                        </Button>
                        <Button
                          variant="ghost"
                          style={{
                            justifyContent: "flex-start",
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            height: "var(--input-height)",
                            paddingLeft: "var(--spacing-3)",
                            paddingRight: "var(--spacing-3)",
                            borderRadius: "var(--radius-sm)",
                          }}
                          onClick={() => handleCustomDateChange({ from: subDays(new Date(), 7), to: new Date() })}
                        >
                          Last 7 days
                        </Button>
                        <Button
                          variant="ghost"
                          style={{
                            justifyContent: "flex-start",
                            fontSize: "var(--text-sm)",
                            fontWeight: "var(--font-weight-medium)",
                            height: "var(--input-height)",
                            paddingLeft: "var(--spacing-3)",
                            paddingRight: "var(--spacing-3)",
                            borderRadius: "var(--radius-sm)",
                          }}
                          onClick={() => handleCustomDateChange({ from: subDays(new Date(), 30), to: new Date() })}
                        >
                          Last 30 days
                        </Button>
                      </div>
                      <div 
                        style={{
                          padding: "var(--spacing-3)",
                          backgroundColor: "var(--popover)",
                        }}
                      >
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={customDateRange?.from}
                          selected={customDateRange}
                          onSelect={handleCustomDateChange}
                          numberOfMonths={2}
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: "var(--font-weight-normal)",
                          }}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                )}
              </div>
            </Popover>
          </div>
        </div>
      </div>

      {/* Tab Content - Flows naturally with spacing */}
      <div className="w-full px-[24px] pb-[24px]">
        {activeTab === "overview" && <IntegrityOverview />}
        {activeTab === "summary" && <IntegritySummary />}
      </div>
    </div>
  );
}