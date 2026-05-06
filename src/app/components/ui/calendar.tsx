"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-[var(--spacing-3)]", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-[var(--spacing-4)]",
        month: "flex flex-col gap-[var(--spacing-4)]",
        caption: "flex justify-center pt-[var(--spacing-1)] relative items-center w-full",
        caption_label: "text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground",
        nav: "flex items-center gap-[var(--spacing-1)]",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-[28px] w-[28px] bg-transparent p-0 opacity-50 hover:opacity-100 rounded-[var(--radius-sm)] border-border",
        ),
        nav_button_previous: "absolute left-[var(--spacing-1)]",
        nav_button_next: "absolute right-[var(--spacing-1)]",
        table: "w-full border-collapse space-x-[var(--spacing-1)]",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-[var(--radius-md)] w-[32px] font-[var(--font-weight-normal)] text-[var(--text-xs)]",
        row: "flex w-full mt-[var(--spacing-2)]",
        cell: cn(
          "relative p-0 text-center text-[var(--text-sm)] focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-[var(--radius-md)]",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-[var(--radius-md)] [&:has(>.day-range-start)]:rounded-l-[var(--radius-md)] first:[&:has([aria-selected])]:rounded-l-[var(--radius-md)] last:[&:has([aria-selected])]:rounded-r-[var(--radius-md)]"
            : "[&:has([aria-selected])]:rounded-[var(--radius-md)]",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-[32px] w-[32px] p-0 font-[var(--font-weight-normal)] aria-selected:opacity-100 rounded-[var(--radius-md)] text-foreground",
        ),
        day_range_start:
          "day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_range_end:
          "day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };