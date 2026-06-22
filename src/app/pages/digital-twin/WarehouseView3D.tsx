import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Ruler, FileText, X, LayoutGrid, Menu, Settings, Activity, Clock } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { WarehouseScene } from "./WarehouseScene3D";

function ToolbarBtn({ icon: Icon, badge, active = false }: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  badge?: number; active?: boolean;
}) {
  return (
    <button className={`relative flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors ${active ? "text-blue-600" : "text-gray-500"}`}>
      <Icon size={15} strokeWidth={1.5} />
      {badge !== undefined && (
        <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center bg-red-500 text-white rounded-full font-bold leading-none min-w-[15px] h-[15px] px-[3px] text-[8px]">
          {badge}
        </span>
      )}
    </button>
  );
}

export function WarehouseView3D() {
  const [highlightIssues, setHighlightIssues] = useState(true);
  const [singleRackView, setSingleRackView] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => setCanvasHeight(entries[0].contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#f0f0f0", overflow: "hidden" }}>
      <div ref={wrapRef} style={{ flex: "1 1 0", minHeight: 0, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 12, top: 16, zIndex: 10, display: "flex", flexDirection: "column", gap: 2, background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          <ToolbarBtn icon={Ruler}      badge={61} />
          <ToolbarBtn icon={FileText}   badge={21} />
          <ToolbarBtn icon={X}          badge={20} />
          <ToolbarBtn icon={LayoutGrid} badge={20} />
          <div style={{ width: "100%", height: 1, background: "#e5e7eb", margin: "3px 0" }} />
          <ToolbarBtn icon={Menu}     />
          <ToolbarBtn icon={Settings} />
        </div>
        <div style={{ position: "absolute", right: 12, top: 16, zIndex: 10, display: "flex", flexDirection: "column", gap: 2, background: "white", border: "1px solid #e5e7eb", borderRadius: 8, padding: 6, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
          <ToolbarBtn icon={Activity} />
          <ToolbarBtn icon={Clock}    />
        </div>
        {canvasHeight > 0 && (
          <Canvas shadows camera={{ position: [55, 42, 45], fov: 48, near: 0.1, far: 500 }}
            style={{ width: "100%", height: canvasHeight, background: "#eeeef0", display: "block" }}
            gl={{ antialias: true }}>
            <Suspense fallback={null}><WarehouseScene /></Suspense>
          </Canvas>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, padding: "10px 16px", background: "rgba(255,255,255,0.92)", borderTop: "1px solid #e5e7eb", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1f2937" }}>131</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>OK</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fb923c" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1f2937" }}>41</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Warn</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1f2937" }}>20</span>
            <span style={{ fontSize: 12, color: "#6b7280" }}>Crit</span>
          </div>
          <div style={{ width: 1, height: 16, background: "#d1d5db", margin: "0 4px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#374151" }}>Highlight Issues</span>
            <Switch checked={highlightIssues} onCheckedChange={setHighlightIssues} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#374151" }}>Single Rack View</span>
            <Switch checked={singleRackView} onCheckedChange={setSingleRackView} />
          </div>
        </div>
      </div>
    </div>
  );
}
