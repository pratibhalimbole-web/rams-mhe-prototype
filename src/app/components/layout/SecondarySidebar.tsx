import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../ui/utils";
import { Domain, Suite, Feature } from "./sidebar-data";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { SidebarMode } from "./SidebarLayout";


interface SecondarySidebarProps {
  activeDomain: Domain;
  activeSuiteId: string | null;
  onSuiteSelect: (suiteId: string) => void;
  activeFeatureId: string | null;
  onFeatureSelect: (featureId: string) => void;
  sidebarMode: SidebarMode;
  onToggleMode: () => void;
}

export function SecondarySidebar({
  activeDomain,
  activeSuiteId,
  onSuiteSelect,
  activeFeatureId,
  onFeatureSelect,
  sidebarMode,
  onToggleMode,
}: SecondarySidebarProps) {
  // Helper to render a feature button — hidden features are registered for breadcrumbs but not shown
  const renderFeature = (feature: Feature) => feature.hidden ? null : (
    <Button
      key={feature.id}
      type="button"
      variant="ghost"
      className={cn(
        "w-full justify-start h-7 px-2 text-[12px] font-normal text-sidebar-foreground/65 transition-colors rounded-[4px] hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
        activeFeatureId === feature.id
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          : ""
      )}
      style={{
        fontFamily: "'Inter', sans-serif"
      }}
      onClick={() => onFeatureSelect(feature.id)}
    >
      <span className="truncate w-full text-left leading-none">{feature.label}</span>
    </Button>
  );

  return (
    <div className="flex h-full w-full flex-col overflow-hidden min-h-0">
      <div className="flex shrink-0 items-center gap-1 pl-2 pr-2 border-b border-sidebar-border/50 overflow-hidden" style={{ minHeight: 44 }}>
        <h2 className="flex-1 min-w-0 pl-1 truncate text-[11px] font-semibold tracking-wide uppercase text-sidebar-foreground/50">
          {activeDomain.label}
        </h2>

        {/* Toggle Control: Only controls Pinned vs Floating mode */}
        <button
          type="button"
          onClick={onToggleMode}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          aria-label={sidebarMode === "pinned" ? "Collapse Sidebar" : "Pin Sidebar"}
        >
            {sidebarMode === "pinned" ? (
                // Pinned Mode: Show "Collapse" icon (<<)
                <ChevronsLeft className="h-4 w-4" />
            ) : (
                // Floating Mode: Show "Pin" icon (>>)
                <ChevronsRight className="h-4 w-4" />
            )}
        </button>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-1.5">
          {activeDomain.type === "flat" ? (
            <div className="flex flex-col" style={{ gap: "2px" }}>
              {(activeDomain.content as Feature[]).map(renderFeature)}
            </div>
          ) : (
            <>
              {activeDomain.type === "mixed" && activeDomain.topSharedFeatures && activeDomain.topSharedFeatures.length > 0 && (
                <div className="flex flex-col" style={{ gap: "2px", marginBottom: "var(--spacing-2)" }}>
                  {activeDomain.topSharedFeatures.map(renderFeature)}
                </div>
              )}
              <Accordion
                type="single"
                collapsible={true}
                value={activeSuiteId || ""}
                onValueChange={onSuiteSelect}
                className="w-full space-y-0.5"
              >
                {(activeDomain.content as Suite[]).map((suite) => (
                  <AccordionItem
                    key={suite.id}
                    value={suite.id}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-[4px] px-2 pr-1 py-1.5 text-[11px] font-semibold tracking-wide text-sidebar-foreground/50 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground hover:no-underline [&>svg]:shrink-0 [&>svg]:translate-y-0",
                        activeSuiteId === suite.id && "bg-sidebar-accent/40 text-sidebar-foreground"
                      )}
                    >
                      <span className="truncate text-left">{suite.label}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0.5 pt-0.5">
                      <div className="flex flex-col gap-0.5 ml-2 border-l border-sidebar-border/40 pl-2">
                        {suite.items.map(renderFeature)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              {activeDomain.type === "mixed" && activeDomain.sharedFeatures && activeDomain.sharedFeatures.length > 0 && (
                <>
                  <div
                    className="border-t border-sidebar-border/50"
                    style={{ margin: "var(--spacing-2) 0" }}
                  />
                  <div className="flex flex-col" style={{ gap: "2px" }}>
                    {activeDomain.sharedFeatures.map(renderFeature)}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}