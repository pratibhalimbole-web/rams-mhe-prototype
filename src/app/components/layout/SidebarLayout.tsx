import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate, useLocation, Outlet } from "react-router";
import { PrimarySidebar } from "./PrimarySidebar";
import { SecondarySidebar } from "./SecondarySidebar";
import { domains, Domain, Suite, Feature } from "./sidebar-data";
import { cn } from "../ui/utils";
import { isFigmaMakeActive } from "../../../utils/figma-make";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

// --- Context Definition ---

type SidebarContextType = {
  setSubPageTitle: (title: string | null) => void;
  subPageTitle: string | null;
  setHeaderActions: (actions: React.ReactNode | null) => void;
  headerActions: React.ReactNode | null;
  activeDomainId: string;
  activeSuiteId: string | null;
  activeFeatureId: string | null;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  return context;
}

// --- Types ---

export type SidebarMode = "pinned" | "floating";

export type SidebarSelection = {
  domainId: string;
  suiteId: string | null;
  featureId: string | null;
};

// Helper function to parse URL path and extract domain/suite/feature
function parsePathToSelection(pathname: string): SidebarSelection {
  // Remove leading slash and split
  const parts = pathname.replace(/^\//, '').split('/');
  
  if (parts.length === 0 || parts[0] === '') {
    return { domainId: "rack", suiteId: "irds", featureId: "project-planner" };
  }
  
  // Special case for /report routes
  if (parts[0] === 'report') {
    return { domainId: "rack", suiteId: "irds", featureId: "report" };
  }
  
  const domainId = parts[0] || "rack";
  
  // Check if this domain has suites
  const domain = domains.find(d => d.id === domainId);

  if (domain?.type === "suite" || domain?.type === "mixed") {
    const suiteId = parts[1] || null;
    const featureId = parts[2] || null;

    // For mixed domains, check if this is a shared feature (no suite segment)
    if (domain.type === "mixed" && suiteId && !featureId) {
      const isSharedFeature = domain.sharedFeatures?.some(f => f.id === suiteId);
      if (isSharedFeature) {
        return { domainId, suiteId: null, featureId: suiteId };
      }
    }

    return { domainId, suiteId, featureId };
  } else {
    // Flat domain
    const featureId = parts[1] || null;
    return { domainId, suiteId: null, featureId };
  }
}

export function SidebarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse current location to determine active items
  const selection = useMemo(() => parsePathToSelection(location.pathname), [location.pathname]);
  const { domainId: activeDomainId, suiteId: activeSuiteId, featureId: activeFeatureId } = selection;
  
  // Layout State
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>("pinned");
  const [isPanelVisible, setIsPanelVisible] = useState(true);

  // Sub-page Breadcrumb State
  const [subPageTitle, setSubPageTitle] = useState<string | null>(null);
  
  // Header Actions State
  const [headerActions, setHeaderActions] = useState<React.ReactNode | null>(null);

  const activeDomain = domains.find((d) => d.id === activeDomainId) || domains[0];
  
  // Helper to get active objects
  let activeSuite: Suite | null = null;
  let activeFeature: Feature | null = null;

  if (activeDomain.type === "suite" || activeDomain.type === "mixed") {
     activeSuite = (activeDomain.content as Suite[]).find(s => s.id === activeSuiteId) || null;
     if (activeSuite && activeFeatureId) {
        activeFeature = activeSuite.items.find(f => f.id === activeFeatureId) || null;
     }
     // For mixed domains, check sharedFeatures if not found in suite
     if (!activeFeature && activeFeatureId && activeDomain.type === "mixed") {
        activeFeature = activeDomain.sharedFeatures?.find(f => f.id === activeFeatureId) || null;
     }
  } else {
     // Flat domain
     if (activeFeatureId) {
        activeFeature = (activeDomain.content as Feature[]).find(f => f.id === activeFeatureId) || null;
     }
  }

  // Reset sub-page and actions when URL changes
  useEffect(() => {
    setSubPageTitle(null);
    setHeaderActions(null);
  }, [location.pathname]);

  // Ensure sidebar is visible when switching to pinned mode
  useEffect(() => {
    if (sidebarMode === "pinned") {
      setIsPanelVisible(true);
    }
  }, [sidebarMode]);

  const handleDomainSelect = (domainId: string) => {
    // Always show panel when user interacts with primary navigation
    setIsPanelVisible(true);

    const domain = domains.find(d => d.id === domainId);
    if (!domain) return;

    // Navigate to the first item in this domain
    if (domain.type === "suite" || domain.type === "mixed") {
      const firstSuite = (domain.content as Suite[])[0];
      if (firstSuite && firstSuite.items.length > 0) {
        const firstFeature = firstSuite.items[0];
        navigate(`/${domainId}/${firstSuite.id}/${firstFeature.id}`);
      }
    } else {
      // Flat domain
      const firstFeature = (domain.content as Feature[])[0];
      if (firstFeature) {
        navigate(`/${domainId}/${firstFeature.id}`);
      }
    }
  };

  const handleSuiteSelect = (suiteId: string) => {
    const domain = domains.find(d => d.id === activeDomainId);
    if (!domain || (domain.type !== "suite" && domain.type !== "mixed")) return;

    const suite = (domain.content as Suite[]).find(s => s.id === suiteId);
    if (suite && suite.items.length > 0) {
      const firstFeature = suite.items[0];
      navigate(`/${activeDomainId}/${suiteId}/${firstFeature.id}`);
    }
  };

  const handleFeatureSelect = (featureId: string) => {
    // Check if this is a shared feature in a mixed domain
    const isSharedFeature = activeDomain.type === "mixed" &&
                           activeDomain.sharedFeatures?.some(f => f.id === featureId);

    if (isSharedFeature) {
      // Shared features don't have suite prefix
      navigate(`/${activeDomainId}/${featureId}`);
    } else if (activeSuiteId) {
      navigate(`/${activeDomainId}/${activeSuiteId}/${featureId}`);
    } else {
      navigate(`/${activeDomainId}/${featureId}`);
    }
  };

  const toggleSidebarMode = () => {
    if (sidebarMode === "pinned") {
       setSidebarMode("floating");
       setIsPanelVisible(false); // Collapse behavior
    } else {
       setSidebarMode("pinned");
       // isPanelVisible becomes true via effect
    }
  };

  const contextValue: SidebarContextType = {
    setSubPageTitle,
    subPageTitle,
    setHeaderActions,
    headerActions,
    activeDomainId,
    activeSuiteId,
    activeFeatureId
  };

  // Determine the page title
  const pageTitle = subPageTitle || activeFeature?.label || activeSuite?.label || activeDomain.label;

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Primary Sidebar (Always Visible, Fixed) */}
        <PrimarySidebar
          domains={domains}
          activeDomainId={activeDomainId}
          onDomainSelect={handleDomainSelect}
        />

        {/* Content Wrapper */}
        <div className="relative flex flex-1 flex-row min-w-0 overflow-hidden">
          
          {/* Secondary Sidebar Container */}
          <div 
            className={cn(
              "h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-40",
              // Mode-based classes
              sidebarMode === "pinned" 
                ? "relative flex-shrink-0" 
                : "absolute top-0 left-0 shadow-2xl",
              // Visibility (Width)
              isPanelVisible ? "w-[260px] opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full overflow-hidden border-none"
            )}
          >
            <SecondarySidebar
              activeDomain={activeDomain}
              activeSuiteId={activeSuiteId}
              onSuiteSelect={handleSuiteSelect}
              activeFeatureId={activeFeatureId}
              onFeatureSelect={handleFeatureSelect}
              sidebarMode={sidebarMode}
              onToggleMode={toggleSidebarMode}
            />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background transition-all duration-300">
            {/* Header - Fixed, not scrolling */}
            <header
              className="flex flex-col border-b bg-card shrink-0"
              style={{
                borderColor: "var(--border)",
                padding: "10px 20px",
                gap: "4px"
              }}
            >
              <div className="flex items-center justify-between" style={{ gap: "16px" }}>
                <h1
                  className="tracking-tight text-foreground"
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  {pageTitle}
                </h1>
                {headerActions && (
                  <div className="flex items-center" style={{ gap: "var(--spacing-2)" }}>
                    {headerActions}
                  </div>
                )}
              </div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    {!activeSuite && !activeFeature ? (
                      <BreadcrumbPage>{activeDomain.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          // Navigate to first feature of domain
                          if (activeDomain.type === "suite" || activeDomain.type === "mixed") {
                            const firstSuite = (activeDomain.content as Suite[])[0];
                            if (firstSuite && firstSuite.items.length > 0) {
                              const firstFeature = firstSuite.items[0];
                              navigate(`/${activeDomainId}/${firstSuite.id}/${firstFeature.id}`);
                            }
                          } else {
                            const firstFeature = (activeDomain.content as Feature[])[0];
                            if (firstFeature) {
                              navigate(`/${activeDomainId}/${firstFeature.id}`);
                            }
                          }
                        }}
                        className="hover:text-foreground cursor-pointer transition-colors"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {activeDomain.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  
                  {activeSuite && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        {!activeFeature ? (
                          <BreadcrumbPage style={{ fontFamily: "'Inter', sans-serif" }}>{activeSuite.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink 
                            href="#" 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              // Navigate to suite level (first feature in suite)
                              if (activeSuite.items.length > 0) {
                                navigate(`/${activeDomainId}/${activeSuiteId}/${activeSuite.items[0].id}`);
                              }
                            }}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {activeSuite.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </>
                  )}

                  {subPageTitle && (
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage style={{ fontFamily: "'Inter', sans-serif" }}>{subPageTitle}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            
            {/* Scrollable Content Container - ONLY THIS SCROLLS */}
            <div id="main-content-scroll-container" className="flex-1 overflow-y-auto p-[0px] bg-[var(--background)]">
              <div className="p-[0px] h-full">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}