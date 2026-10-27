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
import { useTheme } from "../../hooks/useTheme";
import { Bell } from "lucide-react";
import logoLight from "../../../assets/logo-r-light.png";
import logoDark from "../../../assets/logo-r-dark.png";


// Group domains into logical sections
const GROUPS = [
  { ids: ["digital-twin", "rack"] },
  { ids: ["mhe", "pallet", "analytics"] },
  { ids: ["iot", "library", "admin"] },
];

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
  const domainMap = Object.fromEntries(domains.map((d) => [d.id, d]));
  const { isDark } = useTheme();

  return (
    <div
      className="flex w-12 flex-col items-center border-r border-sidebar-border bg-sidebar h-full"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div className="flex items-center justify-center w-full border-b border-sidebar-border shrink-0" style={{ height: 44 }}>
        <img src={isDark ? logoDark : logoLight} alt="RAMS" className="h-6 w-6" />
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="flex-1 min-h-0 overflow-y-auto w-full px-1.5 pt-3 pb-4 [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col py-0.5">
            {GROUPS.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <div className="mt-3" />}
                <div className="flex flex-col gap-1">
                  {group.ids.map((id) => {
                    const domain = domainMap[id];
                    if (!domain) return null;
                    return (
                      <Tooltip key={domain.id}>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-9 w-9 rounded-md transition-all",
                              activeDomainId === domain.id
                                ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                                : "text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                            onClick={() => onDomainSelect(domain.id)}
                          >
                            <domain.icon className="h-5 w-5" />
                            <span className="sr-only">{domain.label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="flex items-center gap-4">
                          {domain.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>

      <div className="mt-auto flex flex-col items-center gap-2 pt-3 pb-4">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
                <span className="sr-only">Notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              Notifications
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ModeToggle />
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--sidebar-primary)]/15 text-[10px] font-bold text-[var(--sidebar-primary)]">
          WH
        </div>
      </div>
    </div>
  );
}