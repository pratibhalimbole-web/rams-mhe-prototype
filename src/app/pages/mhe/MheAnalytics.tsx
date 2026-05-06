import React, { useEffect } from "react";
import { useSidebar } from "../../components/layout/SidebarLayout";
import { OperatorMheProductivityMatrix } from "../../components/analytics/OperatorMheProductivityMatrix";

export function MheAnalytics() {
  const sidebar = useSidebar();
  
  useEffect(() => {
    if (sidebar) {
      sidebar.setSubPageTitle("MHE Analytics");
    }
  }, [sidebar]);

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden bg-[var(--background)]">
      <div className="flex-1 overflow-auto">
        <OperatorMheProductivityMatrix />
      </div>
    </div>
  );
}
