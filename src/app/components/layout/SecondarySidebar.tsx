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
  // Helper to render a feature button
  const renderFeature = (feature: Feature) => (
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
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div 
        className="flex h-14 items-center justify-between border-b border-sidebar-border/50 shrink-0" 
        style={{ padding: "0 var(--spacing-4)" }}
      >
        <h2 
          className="tracking-tight text-sidebar-foreground" 
          style={{ 
            fontFamily: "'Inter', sans-serif",
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-weight-semi-bold)"
          }}
        >
          {activeDomain.label}
        </h2>
        
        {/* Toggle Control: Only controls Pinned vs Floating mode */}
        <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground" 
            onClick={onToggleMode}
            style={{ borderRadius: "var(--radius)" }}
        >
            {sidebarMode === "pinned" ? (
                // Pinned Mode: Show "Collapse" icon (<<)
                <ChevronsLeft className="h-4 w-4" />
            ) : (
                // Floating Mode: Show "Pin" icon (>>)
                <ChevronsRight className="h-4 w-4" />
            )}
            <span className="sr-only">
              {sidebarMode === "pinned" ? "Collapse Sidebar" : "Pin Sidebar"}
            </span>
        </Button>
      </div>
      <ScrollArea className="flex-1 pr-1">
        <div style={{ padding: "var(--spacing-2)" }}>
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
                className="w-full"
                style={{ gap: "var(--spacing-1)" }}
              >
                {(activeDomain.content as Suite[]).map((suite) => (
                  <AccordionItem
                    key={suite.id}
                    value={suite.id}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className={cn(
                        "flex w-full items-center justify-between rounded-md hover:no-underline text-sidebar-foreground transition-colors",
                        activeSuiteId === suite.id
                          ? "bg-[var(--sidebar-primary)]/10 text-sidebar-foreground hover:bg-[var(--sidebar-primary)]/20"
                          : "bg-transparent hover:bg-[var(--sidebar-primary)]/10"
                      )}
                      style={{
                        padding: "var(--spacing-2)",
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--font-weight-medium)",
                        fontFamily: "'Inter', sans-serif",
                        borderRadius: "var(--radius)"
                      }}
                    >
                      <span className="truncate text-left" style={{ fontSize: "12px" }}>{suite.label}</span>
                    </AccordionTrigger>
                    <AccordionContent style={{ paddingBottom: "var(--spacing-1)", paddingTop: "var(--spacing-1)" }}>
                      <div
                        className="flex flex-col border-l border-sidebar-border/50"
                        style={{
                          gap: "2px",
                          marginLeft: "var(--spacing-2)",
                          paddingLeft: "var(--spacing-2)"
                        }}
                      >
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