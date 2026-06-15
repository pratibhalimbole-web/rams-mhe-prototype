import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { Domain } from "./sidebar-data";
import { ModeToggle } from "../mode-toggle";


interface PrimarySidebarProps {
  domains: Domain[];
  activeDomainId: string;
  onDomainSelect: (domainId: string) => void;
  onHoverChange?: (hovered: boolean) => void;
}

export function PrimarySidebar({
  domains,
  activeDomainId,
  onDomainSelect,
  onHoverChange,
}: PrimarySidebarProps) {
  return (
    <div
      className="flex w-16 flex-col items-center border-r bg-sidebar h-full"
      style={{ borderColor: "var(--sidebar-border)" }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <TooltipProvider delayDuration={0}>
        <div className="flex-1 w-full overflow-y-auto" style={{ padding: "var(--spacing-4) var(--spacing-2)" }}>
          <div className="flex flex-col" style={{ gap: "var(--spacing-2)" }}>
            {domains.map((domain) => (
              <Tooltip key={domain.id}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 transition-all",
                      activeDomainId === domain.id
                        ? "bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] hover:bg-[var(--sidebar-primary)]/90 hover:text-[var(--sidebar-primary-foreground)]"
                        : "bg-transparent text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-primary)] hover:text-[var(--sidebar-primary-foreground)]"
                    )}
                    style={{ borderRadius: "var(--radius)" }}
                    onClick={() => onDomainSelect(domain.id)}
                  >
                    <domain.icon className="h-5 w-5 text-current" />
                    <span className="sr-only">{domain.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center" style={{ gap: "var(--spacing-4)", fontFamily: "'Inter', sans-serif" }}>
                  {domain.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>

      <div className="flex flex-col items-center" style={{ marginTop: "auto", paddingTop: "var(--spacing-4)", paddingBottom: "var(--spacing-4)" }}>
        <ModeToggle />
      </div>
    </div>
  );
}