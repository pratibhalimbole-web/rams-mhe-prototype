"use client";

import * as React from "react";
import { format, subDays } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "./utils";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

interface DateRangeSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  onDateChange?: (date: DateRange | undefined) => void;
  presets?: boolean;
}

export function DateRangeSelector({
  className,
  date: controlledDate,
  onDateChange,
  presets = true,
}: DateRangeSelectorProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    controlledDate || {
      from: subDays(new Date(), 7),
      to: new Date(),
    }
  );

  React.useEffect(() => {
    if (controlledDate !== undefined) {
      setDate(controlledDate);
    }
  }, [controlledDate]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <div className={cn("grid gap-[var(--spacing-2)]", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-[var(--font-weight-normal)] text-[var(--text-sm)] h-[var(--input-height)] px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-md)] border-border bg-card hover:bg-accent hover:text-accent-foreground transition-colors",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-[var(--spacing-2)] h-[var(--spacing-4)] w-[var(--spacing-4)] text-muted-foreground" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
            <ChevronDown className="ml-auto h-[var(--spacing-4)] w-[var(--spacing-4)] opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 rounded-[var(--radius-lg)] border-border shadow-[var(--elevation-sm)] bg-popover" 
          align="end"
          sideOffset={8}
        >
          <div className="flex">
            {presets && (
              <div className="flex flex-col gap-[var(--spacing-1)] p-[var(--spacing-3)] border-r border-border bg-card">
                <Button
                  variant="ghost"
                  className="justify-start text-[var(--text-sm)] font-[var(--font-weight-medium)] h-[var(--input-height)] px-[var(--spacing-3)] rounded-[var(--radius-sm)] text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleDateChange({ from: new Date(), to: new Date() })}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-[var(--text-sm)] font-[var(--font-weight-medium)] h-[var(--input-height)] px-[var(--spacing-3)] rounded-[var(--radius-sm)] text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleDateChange({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) })}
                >
                  Yesterday
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-[var(--text-sm)] font-[var(--font-weight-medium)] h-[var(--input-height)] px-[var(--spacing-3)] rounded-[var(--radius-sm)] text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleDateChange({ from: subDays(new Date(), 7), to: new Date() })}
                >
                  Last 7 days
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-[var(--text-sm)] font-[var(--font-weight-medium)] h-[var(--input-height)] px-[var(--spacing-3)] rounded-[var(--radius-sm)] text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleDateChange({ from: subDays(new Date(), 30), to: new Date() })}
                >
                  Last 30 days
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-[var(--text-sm)] font-[var(--font-weight-medium)] h-[var(--input-height)] px-[var(--spacing-3)] rounded-[var(--radius-sm)] text-foreground hover:bg-accent hover:text-accent-foreground"
                  onClick={() => handleDateChange({ from: subDays(new Date(), 90), to: new Date() })}
                >
                  Last 90 days
                </Button>
              </div>
            )}
            <div className="p-[var(--spacing-3)] bg-popover">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={2}
                className="font-[var(--font-weight-normal)]"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}