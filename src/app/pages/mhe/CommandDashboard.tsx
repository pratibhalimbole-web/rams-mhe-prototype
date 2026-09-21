import React, { useState } from "react";
import { Variation4Tab } from "./Variation4Tab";
import { CriticalIssuesModal } from "../../components/widgets/CriticalIssuesModal";

export function CommandDashboard() {
  const [isIssuesModalOpen, setIsIssuesModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      <div className="flex-1 overflow-y-auto">
        <Variation4Tab />
      </div>

      <CriticalIssuesModal
        isOpen={isIssuesModalOpen}
        onClose={() => setIsIssuesModalOpen(false)}
      />
    </div>
  );
}
