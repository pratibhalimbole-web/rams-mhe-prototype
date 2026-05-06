import svgPaths from "./svg-kwe1srq84e";
import * as React from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList, ReferenceLine, PieChart, Pie, Cell } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart";
import { Badge } from "@/app/components/ui/badge";

// Chart data for Inspection Observations with severity breakdown per day
const observationsData = [
  { day: 1, critical: 2, warning: 12, ok: 24 },
  { day: 2, critical: 5, warning: 18, ok: 29 },
  { day: 3, critical: 3, warning: 8, ok: 24 },
  { day: 4, critical: 1, warning: 3, ok: 9 },
  { day: 5, critical: 4, warning: 10, ok: 22 },
  { day: 6, critical: 2, warning: 7, ok: 21 },
  { day: 7, critical: 3, warning: 11, ok: 22 },
  { day: 8, critical: 2, warning: 6, ok: 18 },
];

// Convert to cumulative data with separate lines for each severity
const cumulativeData = observationsData.reduce((acc: any[], curr, index) => {
  const prevCritical = index > 0 ? acc[index - 1].cumulativeCritical : 0;
  const prevWarning = index > 0 ? acc[index - 1].cumulativeWarning : 0;
  const prevOk = index > 0 ? acc[index - 1].cumulativeOk : 0;
  
  const cumulativeCritical = prevCritical + curr.critical;
  const cumulativeWarning = prevWarning + curr.warning;
  const cumulativeOk = prevOk + curr.ok;
  
  acc.push({
    day: curr.day,
    cumulativeCritical,
    cumulativeWarning,
    cumulativeOk,
    cumulativeTotal: cumulativeCritical + cumulativeWarning + cumulativeOk,
    // Keep individual values for tooltip
    critical: curr.critical,
    warning: curr.warning,
    ok: curr.ok,
  });
  return acc;
}, []);

// Thresholds for safety alert
const WARNING_THRESHOLD = 60;
const CRITICAL_THRESHOLD = 100;

const chartConfig = {
  cumulativeCritical: {
    label: "Critical",
    color: "var(--destructive)",
  },
  cumulativeWarning: {
    label: "Warning",
    color: "var(--warning)",
  },
  cumulativeOk: {
    label: "OK",
    color: "var(--success)",
  },
} satisfies ChartConfig;

function Container() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <h2 className="text-[18px] font-[var(--font-weight-semi-bold)] text-foreground leading-[1.56]">
        Inspection Observations
      </h2>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <p className="text-[var(--text-sm)] font-[var(--font-weight-normal)] text-muted-foreground leading-[1.43]">
        Current inspection cycle
      </p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[var(--spacing-1,4px)] items-start relative shrink-0" data-name="Container">
      <Container />
      <Container1 />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p150f5b00} id="Vector_2" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2d6e5280} id="Vector_3" stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ButtonMenu() {
  return (
    <button
      type="button"
      className="flex items-center justify-center relative rounded-full shrink-0 size-[24px] hover:bg-muted transition-colors cursor-pointer"
      data-name="Button menu"
      aria-label="More options"
    >
      <Svg />
    </button>
  );
}

function CardHeader() {
  // Calculate risk status based on slope of critical line
  const getRiskStatus = () => {
    if (cumulativeData.length < 2) {
      return { label: "Risk Stable", variant: "success" as const };
    }
    
    // Calculate slope from first half to second half of cycle
    const midpoint = Math.floor(cumulativeData.length / 2);
    const firstHalf = cumulativeData.slice(0, midpoint);
    const secondHalf = cumulativeData.slice(midpoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.cumulativeCritical, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.cumulativeCritical, 0) / secondHalf.length;
    
    const slope = (secondHalfAvg - firstHalfAvg) / midpoint;
    
    // Check if critical observations are accelerating
    if (slope > 2 || cumulativeData[cumulativeData.length - 1].cumulativeCritical >= CRITICAL_THRESHOLD) {
      return { label: "Escalation Required", variant: "destructive" as const };
    } else {
      return { label: "Risk Stable", variant: "success" as const };
    }
  };

  const riskStatus = getRiskStatus();

  return (
    <div className="relative shrink-0 w-full" data-name="CardHeader">
      <div aria-hidden="true" className="absolute border-border border-b inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start justify-between px-[20px] py-[16px] relative w-full">
        <div className="flex items-start gap-[var(--spacing-3,12px)]">
          <Container2 />
          <Badge 
            variant={riskStatus.variant}
            className="mt-[2px] text-[12px] font-[var(--font-weight-medium)]"
          >
            {riskStatus.label}
          </Badge>
        </div>
        <ButtonMenu />
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents inset-[93.2%_90.74%_1.37%_3.24%]" data-name="Group">
      <p className="absolute css-4hzbpn font-['Geist:Regular',sans-serif] font-normal inset-[93.2%_90.74%_1.37%_3.24%] leading-[normal] text-[#6c727e] text-[14px] text-center">08:00</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents inset-[93.2%_78.36%_1.37%_15.86%]" data-name="Group">
      <p className="absolute css-4hzbpn font-['Geist:Regular',sans-serif] font-normal inset-[93.2%_78.36%_1.37%_15.86%] leading-[normal] text-[#6c727e] text-[14px] text-center">08:15</p>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[93.2%_65.62%_1.37%_28.12%]" data-name="Group">
      <p className="absolute css-4hzbpn font-['Geist:Regular',sans-serif] font-normal inset-[93.2%_65.62%_1.37%_28.12%] leading-[normal] text-[#6c727e] text-[14px] text-center">08:30</p>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[93.2%_53.48%_1.37%_40.98%]" data-name="Group">
      <p className="absolute css-4hzbpn font-['Geist:Regular',sans-serif] font-normal inset-[93.2%_53.48%_1.37%_40.98%] leading-[normal] text-[#6c727e] text-[14px] text-center">08:45</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[93.2%_40.38%_1.37%_52.88%]" data-name="Group">
      <p className="absolute css-4hzbpn font-['Geist:Regular',sans-serif] font-normal inset-[93.2%_40.38%_1.37%_52.88%] leading-[normal] text-[#6c727e] text-[14px] text-center">09:00</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[93.2%_28.24%_1.37%_65.74%]" data-name="Group">
      <p className="absolute css-4hzbpn font-['Geist:Regular',sans-serif] font-normal inset-[93.2%_28.24%_1.37%_65.74%] leading-[normal] text-[#6c727e] text-[14px] text-center">09:15</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[93.2%_16.22%_1.37%_78.72%]" data-name="Group">
      <p className="absolute css-4hzbpn font-['Geist:Regular',sans-serif] font-normal inset-[93.2%_16.22%_1.37%_78.72%] leading-[normal] text-[#6c727e] text-[14px] text-center">09:30</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[93.2%_3.12%_1.37%_90.62%]" data-name="Group">
      <p className="absolute css-4hzbpn font-['Geist:Regular',sans-serif] font-normal inset-[93.2%_3.12%_1.37%_90.62%] leading-[normal] text-[#6c727e] text-[14px] text-center">09:45</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[93.2%_3.12%_1.37%_3.24%]" data-name="Group">
      <Group />
      <Group1 />
      <Group2 />
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[93.2%_3.12%_1.37%_3.24%]" data-name="Group">
      <Group8 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute inset-[34.69%_89.64%_9.04%_1.93%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0329 186.833">
        <g id="Group">
          <path d={svgPaths.p108ac480} fill="var(--fill-0, #2463EF)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute inset-[13.96%_77.14%_9.04%_14.43%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0329 255.667">
        <g id="Group">
          <path d={svgPaths.p9492a00} fill="var(--fill-0, #2463EF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute inset-[43.57%_64.64%_9.04%_26.93%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0329 157.333">
        <g id="Group">
          <path d={svgPaths.p2e867f80} fill="var(--fill-0, #2463EF)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute inset-[73.19%_52.14%_9.04%_39.43%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0329 59">
        <g id="Group">
          <path d={svgPaths.p2d918900} fill="var(--fill-0, #2463EF)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute inset-[39.13%_39.64%_9.04%_51.93%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0329 172.083">
        <g id="Group">
          <path d={svgPaths.p1c001070} fill="var(--fill-0, #2463EF)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute inset-[49.5%_27.14%_9.04%_64.43%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0329 137.667">
        <g id="Group">
          <path d={svgPaths.p1640df80} fill="var(--fill-0, #2463EF)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute inset-[42.09%_14.64%_9.04%_76.93%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0329 162.25">
        <g id="Group">
          <path d={svgPaths.p29cf1880} fill="var(--fill-0, #2463EF)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute inset-[53.94%_2.14%_9.04%_89.43%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.0329 122.917">
        <g id="Group">
          <path d={svgPaths.p1c03a3f0} fill="var(--fill-0, #2463EF)" fillOpacity="0.2" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-[13.96%_2.14%_9.04%_1.93%]" data-name="Group">
      <Group10 />
      <Group11 />
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
      <Group16 />
      <Group17 />
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents inset-[13.96%_2.14%_9.04%_1.93%]" data-name="Group">
      <Group18 />
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents font-['Geist:Bold',sans-serif] font-bold inset-[5.52%_2.38%_28.92%_2.17%] leading-[normal] text-[#333] text-[16px] text-center" data-name="Group">
      <p className="absolute css-4hzbpn inset-[26.26%_89.88%_67.42%_2.17%]">38</p>
      <p className="absolute css-4hzbpn inset-[5.52%_77.38%_88.15%_14.67%]">52</p>
      <p className="absolute css-4hzbpn inset-[35.14%_65%_58.53%_27.29%]">32</p>
      <p className="absolute css-4hzbpn inset-[64.76%_52.86%_28.92%_40.15%]">12</p>
      <p className="absolute css-4hzbpn inset-[30.7%_39.88%_62.98%_52.17%]">35</p>
      <p className="absolute css-4hzbpn inset-[41.06%_27.38%_52.61%_64.67%]">28</p>
      <p className="absolute css-4hzbpn inset-[33.66%_15%_60.02%_77.29%]">33</p>
      <p className="absolute css-4hzbpn inset-[45.51%_2.38%_48.17%_89.67%]">25</p>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents inset-[5.52%_2.14%_9.04%_1.93%]" data-name="Group">
      <Group19 />
      <Group20 />
    </div>
  );
}

// Micro Safety Summary Component
function MicroSafetySummary() {
  // Calculate totals across all time buckets
  const totals = observationsData.reduce(
    (acc, item) => ({
      critical: acc.critical + item.critical,
      warning: acc.warning + item.warning,
      ok: acc.ok + item.ok,
    }),
    { critical: 0, warning: 0, ok: 0 }
  );

  return (
    <div className="flex items-center gap-[var(--spacing-5,20px)] mb-[var(--spacing-4,16px)]">
      {/* Critical */}
      <div className="flex items-center gap-[var(--spacing-2,8px)]">
        <div className="size-[8px] rounded-full bg-[var(--destructive)]" />
        <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground">
          Critical:
        </span>
        <span className="text-[var(--text-sm)] font-[var(--font-weight-bold)] text-foreground">
          {totals.critical}
        </span>
      </div>
      {/* Warning */}
      <div className="flex items-center gap-[var(--spacing-2,8px)]">
        <div className="size-[8px] rounded-full bg-[var(--warning)]" />
        <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground">
          Warning:
        </span>
        <span className="text-[var(--text-sm)] font-[var(--font-weight-bold)] text-foreground">
          {totals.warning}
        </span>
      </div>
      {/* OK */}
      <div className="flex items-center gap-[var(--spacing-2,8px)]">
        <div className="size-[8px] rounded-full bg-[var(--success)]" />
        <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-foreground">
          OK:
        </span>
        <span className="text-[var(--text-sm)] font-[var(--font-weight-bold)] text-foreground">
          {totals.ok}
        </span>
      </div>
    </div>
  );
}

// Custom Bar Shape with Severity Accent
const CustomBar = (props: any) => {
  const { fill, x, y, width, height, payload } = props;
  
  // Get computed CSS color values
  const getComputedColor = (varName: string) => {
    if (typeof window === 'undefined') return varName;
    const root = document.documentElement;
    const rgba = getComputedStyle(root).getPropertyValue(varName).trim();
    return rgba || varName;
  };

  // Determine accent color based on severity (thin 2px cap)
  let accentColor = null;
  if (payload.critical > 0) {
    accentColor = getComputedColor('--destructive');
  } else if (payload.warning > 0) {
    accentColor = getComputedColor('--warning');
  }
  // No cap for OK-only (stays neutral blue)

  const radius = 4;
  const capHeight = 2; // Thin cap

  return (
    <g>
      {/* Main bar body with rounded top corners */}
      <path
        d={`
          M ${x} ${y + height}
          L ${x} ${y + radius}
          Q ${x} ${y} ${x + radius} ${y}
          L ${x + width - radius} ${y}
          Q ${x + width} ${y} ${x + width} ${y + radius}
          L ${x + width} ${y + height}
          Z
        `}
        fill={fill}
        opacity={props.opacity || 1}
        style={{ transition: 'opacity 0.2s ease, fill 0.2s ease' }}
      />
      {/* Thin RAG cap (2px) */}
      {accentColor && (
        <path
          d={`
            M ${x} ${y + capHeight}
            L ${x} ${y + radius}
            Q ${x} ${y} ${x + radius} ${y}
            L ${x + width - radius} ${y}
            Q ${x + width} ${y} ${x + width} ${y + radius}
            L ${x + width} ${y + capHeight}
            Z
          `}
          fill={accentColor}
          style={{ transition: 'fill 0.2s ease' }}
        />
      )}
    </g>
  );
};

// Custom Tooltip - Compact shadcn style
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;

  const data = payload[0].payload;
  
  // Determine risk status based on critical acceleration
  const getRiskStatus = () => {
    const criticalRatio = data.cumulativeCritical / data.cumulativeTotal;
    if (criticalRatio > 0.15 || data.cumulativeCritical > 20) {
      return "Escalating";
    }
    return "Stable";
  };
  
  const status = getRiskStatus();

  return (
    <div className="bg-card/95 backdrop-blur-sm border border-border rounded-[var(--radius)] shadow-md px-[10px] py-[8px] text-[var(--text-xs)]">
      <div className="font-[var(--font-weight-semi-bold)] text-foreground mb-[6px]">
        Day {data.day}
      </div>
      <div className="flex flex-col gap-[4px] text-[11px]">
        <div className="flex justify-between gap-[12px]">
          <span className="text-muted-foreground">Critical:</span>
          <span className="font-[var(--font-weight-semi-bold)] text-foreground">{data.cumulativeCritical}</span>
        </div>
        <div className="flex justify-between gap-[12px]">
          <span className="text-muted-foreground">Warning:</span>
          <span className="font-[var(--font-weight-semi-bold)] text-foreground">{data.cumulativeWarning}</span>
        </div>
        <div className="flex justify-between gap-[12px]">
          <span className="text-muted-foreground">OK:</span>
          <span className="font-[var(--font-weight-semi-bold)] text-foreground">{data.cumulativeOk}</span>
        </div>
        <div className="h-px bg-border my-[2px]" />
        <div className="flex justify-between gap-[12px]">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-[var(--font-weight-semi-bold)] text-foreground">{data.cumulativeTotal}</span>
        </div>
        <div className="flex justify-between gap-[12px] mt-[2px]">
          <span className="text-muted-foreground">Risk status:</span>
          <span 
            className="font-[var(--font-weight-semi-bold)]"
            style={{ color: status === "Escalating" ? "var(--destructive)" : "var(--success)" }}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

function Application() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Get computed colors from CSS variables
  const getColor = (varName: string) => {
    if (typeof window === 'undefined') return '';
    const root = document.documentElement;
    return getComputedStyle(root).getPropertyValue(varName).trim();
  };

  // Convert rgba to rgba with opacity
  const getPrimaryMuted = () => {
    const primary = getColor('--primary');
    if (!primary) return '#93c5fd'; // fallback light blue
    // Parse rgba and apply 0.2 opacity
    const match = primary.match(/rgba?\(([^)]+)\)/);
    if (match) {
      const parts = match[1].split(',').map(p => p.trim());
      if (parts.length >= 3) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, 0.2)`;
      }
    }
    return primary;
  };

  const primaryColor = getColor('--primary') || '#2563eb';
  const primaryMuted = getPrimaryMuted();
  const destructiveColor = getColor('--destructive') || '#ef4444';
  const warningColor = getColor('--warning') || '#f59e0b';
  const successColor = getColor('--success') || '#10b981';
  const mutedForeground = getColor('--muted-foreground') || '#64748b';
  const borderColor = getColor('--border') || '#e2e8f0';

  // Calculate totals for insights
  const totals = React.useMemo(() => {
    return observationsData.reduce(
      (acc, item) => ({
        critical: acc.critical + item.critical,
        warning: acc.warning + item.warning,
        ok: acc.ok + item.ok,
      }),
      { critical: 0, warning: 0, ok: 0 }
    );
  }, []);

  // Detect critical spikes (observations exceeding threshold)
  const criticalSpikes = observationsData.filter(item => item.total >= CRITICAL_THRESHOLD).length;

  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Application">
      <div className="flex flex-col gap-[var(--spacing-4,16px)] h-full">
        {/* Multi-Line Cumulative Chart */}
        <div className="relative min-h-0 flex-1">
          <ChartContainer config={chartConfig} className="h-full w-full p-[0px]">
            <LineChart 
              data={cumulativeData} 
              margin={{ top: 20, right: 60, left: 15, bottom: 20 }}
              onMouseMove={(state) => {
                if (state.isTooltipActive) {
                  setActiveIndex(state.activeTooltipIndex ?? null);
                } else {
                  setActiveIndex(null);
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3" 
                stroke={borderColor} 
                opacity={0.3} 
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke={mutedForeground}
                fontSize={11}
                className="font-[var(--font-weight-normal)]"
                tickFormatter={(value) => `Day ${value}`}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                stroke={mutedForeground}
                fontSize={11}
                className="font-[var(--font-weight-normal)]"
                width={40}
              />
              
              {/* Warning threshold line */}
              <ReferenceLine 
                y={WARNING_THRESHOLD} 
                stroke={warningColor} 
                strokeDasharray="6 4"
                strokeWidth={1}
                opacity={0.35}
                label={{ 
                  value: "Warning", 
                  position: "right",
                  fill: warningColor,
                  fontSize: 9,
                  opacity: 0.6,
                  className: "font-[var(--font-weight-medium)]"
                }}
              />
              
              {/* Critical threshold line */}
              <ReferenceLine 
                y={CRITICAL_THRESHOLD} 
                stroke={destructiveColor} 
                strokeDasharray="6 4"
                strokeWidth={1}
                opacity={0.35}
                label={{ 
                  value: "Critical", 
                  position: "right",
                  fill: destructiveColor,
                  fontSize: 9,
                  opacity: 0.6,
                  className: "font-[var(--font-weight-medium)]"
                }}
              />
              
              <ChartTooltip 
                content={<CustomTooltip />}
                cursor={{
                  stroke: borderColor,
                  strokeWidth: 1,
                  opacity: 0.4,
                }}
              />
              
              {/* Critical observations line */}
              <Line
                dataKey="cumulativeCritical"
                stroke={destructiveColor}
                strokeWidth={2}
                type="monotone"
                dot={false}
                activeDot={{ r: 5, fill: destructiveColor, strokeWidth: 2, stroke: 'var(--background)' }}
                opacity={activeIndex === null ? 1 : 0.3}
                strokeOpacity={activeIndex === null ? 1 : 0.3}
              />
              
              {/* Warning observations line */}
              <Line
                dataKey="cumulativeWarning"
                stroke={warningColor}
                strokeWidth={2}
                type="monotone"
                dot={false}
                activeDot={{ r: 5, fill: warningColor, strokeWidth: 2, stroke: 'var(--background)' }}
                opacity={activeIndex === null ? 1 : 0.3}
                strokeOpacity={activeIndex === null ? 1 : 0.3}
              />
              
              {/* OK observations line */}
              <Line
                dataKey="cumulativeOk"
                stroke={successColor}
                strokeWidth={2}
                type="monotone"
                dot={false}
                activeDot={{ r: 5, fill: successColor, strokeWidth: 2, stroke: 'var(--background)' }}
                opacity={activeIndex === null ? 1 : 0.3}
                strokeOpacity={activeIndex === null ? 1 : 0.3}
              />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Insight Footer - Info Callout */}
        <div className="bg-[var(--primary)]/5 border-l-2 border-[var(--primary)] rounded-[var(--radius)] px-[var(--spacing-3,12px)] py-[var(--spacing-2,8px)]">
          <p className="text-[var(--text-sm)] text-muted-foreground font-[var(--font-weight-normal)] leading-relaxed">
            Risk accelerated early but stabilized after mid-cycle.
          </p>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-auto md:h-[360px] relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] content-stretch flex items-start justify-center relative size-full">
        <Application />
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="VerticalBorder">
      <div className="content-stretch flex flex-col relative w-full">
        <CardHeader />
        <div className="p-[16px]">
          <Container4 />
        </div>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#333] text-[18px]">
        <p className="css-ew64yg leading-[28px]">Inspection Report</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px]">
        <p className="css-ew64yg leading-[20px]">Event performance summary</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0" data-name="Container">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p36e45a00} id="Vector" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p150f5b00} id="Vector_2" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2d6e5280} id="Vector_3" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function ButtonMenu1() {
  return (
    <div className="content-stretch flex items-center justify-center relative rounded-[33554400px] shrink-0 size-[24px]" data-name="Button menu">
      <Svg1 />
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between px-[24px] relative w-full">
        <Container7 />
        <ButtonMenu1 />
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.pace200} id="Vector" stroke="var(--stroke-0, #1E3A8B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3836560} id="Vector_2" stroke="var(--stroke-0, #1E3A8B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M12 18V6" id="Vector_3" stroke="var(--stroke-0, #1E3A8B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(30,58,139,0.1)] content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative rounded-[2px]" data-name="Overlay">
      <Svg2 />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex items-start justify-center overflow-clip relative rounded-[2px] shrink-0 size-[48px]" data-name="Container">
      <Overlay />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[16px]">
        <p className="css-ew64yg leading-[24px]">This event</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#333] text-[24px]">
        <p className="css-ew64yg leading-[32px]">+82.46%</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Container">
      <Container10 />
      <Container11 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center p-[8px] relative self-stretch shrink-0" data-name="Container">
      <Container9 />
      <Container12 />
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d={svgPaths.p1cbf6000} id="Vector" stroke="var(--stroke-0, #2463EF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p10779400} id="Vector_2" stroke="var(--stroke-0, #2463EF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(36,99,239,0.1)] content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative rounded-[2px]" data-name="Overlay">
      <Svg3 />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex items-start justify-center overflow-clip relative rounded-[2px] shrink-0 size-[48px]" data-name="Container">
      <Overlay1 />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[16px]">
        <p className="css-ew64yg leading-[24px]">Previous event</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#333] text-[24px]">
        <p className="css-ew64yg leading-[32px]">-24.8%</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0" data-name="Container">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center p-[8px] relative self-stretch shrink-0" data-name="Container">
      <Container14 />
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="content-stretch flex gap-[20px] items-start pl-[8.02px] pr-[8.05px] relative w-full">
        <Container13 />
        <div className="bg-[#e4e8ef] self-stretch shrink-0 w-px" data-name="Vertical Divider" />
        <Container18 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center relative w-full">
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[24px] relative w-full">
        <div className="bg-[#e4e8ef] h-px shrink-0 w-full" data-name="Horizontal Divider" />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[16px]">
        <p className="css-ew64yg leading-[24px]">Overall Performance</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full px-[24px] py-[0px]" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#333] text-[20px]">
        <p className="css-ew64yg leading-[28px]">+94.13%</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Container">
      <Container22 />
      <Container23 />
    </div>
  );
}

function Link() {
  return null;
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[70px] relative w-full py-[0px]">
          <Container24 />
        </div>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] content-stretch flex flex-col gap-[var(--spacing-8,32px)] items-start relative w-full">
        <Container8 />
        <Container20 />
        <Container21 />
        <Container25 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-card relative rounded-[var(--radius)] flex-1 min-w-0 w-full h-full" data-name="Background+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[var(--radius)]" />
      <div className="content-stretch flex flex-col relative rounded-[inherit] w-full overflow-hidden h-full">
        <VerticalBorder />
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p3155f180} id="Vector" stroke="var(--stroke-0, #2463EF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pea6a680} id="Vector_2" stroke="var(--stroke-0, #2463EF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(36,99,239,0.1)] content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px relative rounded-[2px]" data-name="Overlay">
      <Svg4 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex items-start justify-center overflow-clip relative rounded-[2px] shrink-0 size-[32px]" data-name="Container">
      <Overlay2 />
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[16px]">
        <p className="css-ew64yg leading-[24px]">Total sales</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container27 />
      <Container28 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white content-stretch flex h-[28px] items-center justify-center px-[9px] py-[5px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#e4e8ef] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]" />
      <div className="css-g0mm18 flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#333] text-[12px] text-center">
        <p className="css-ew64yg leading-[16px]">Details</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pr-[0.01px] relative w-full">
          <Container29 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#333] text-[24px]">
        <p className="css-ew64yg leading-[32px]">$2,150.00</p>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(57,129,246,0.1)] relative rounded-[2px] shrink-0" data-name="Overlay+Border">
      <div className="content-stretch flex items-center justify-center overflow-clip px-[9px] py-[3px] relative rounded-[inherit]">
        <div className="css-g0mm18 flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#3981f6] text-[12px] text-center">
          <p className="css-ew64yg leading-[16px]">+5%</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container31 />
      <OverlayBorder />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] content-stretch flex flex-col gap-[var(--spacing-2,8px)] items-start px-[var(--spacing-6,24px)] relative w-full">
        <Container30 />
        <Container32 />
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p39ee6532} id="Vector" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p14d10c00} id="Vector_2" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 8H14.6667" id="Vector_3" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px]">
        <p className="css-ew64yg leading-[20px]">Online Store</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Svg5 />
      <Container34 />
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px]">
        <p className="css-ew64yg leading-[20px]">$20k</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[14px]">
        <p className="css-ew64yg leading-[20px]">+12.6%</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container36 />
      <Container37 />
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between py-[8px] relative w-full">
          <Container35 />
          <Container38 />
        </div>
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path d={svgPaths.p36f21e80} id="Vector" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p2a594880} id="Vector_2" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p20b4ecc0} id="Vector_3" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M1.33333 4.66667H14.6667" id="Vector_4" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p4cbcae0} id="Vector_5" stroke="var(--stroke-0, #6C727E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px]">
        <p className="css-ew64yg leading-[20px]">Offline Store</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Svg6 />
      <Container40 />
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#6c727e] text-[14px]">
        <p className="css-ew64yg leading-[20px]">$20k</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="css-g0mm18 flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#333] text-[14px]">
        <p className="css-ew64yg leading-[20px]">-4.2%</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Container">
      <Container42 />
      <Container43 />
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between py-[8px] relative w-full">
          <Container41 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Container39 />
      <Container45 />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute contents inset-[87.43%_82.34%_1.32%_6.92%]" data-name="Group">
      <p className="absolute css-ew64yg font-['Geist:Regular',sans-serif] font-normal inset-[87.43%_82.34%_1.32%_6.92%] leading-[normal] text-[#6c727e] text-[13.986px] text-center">10:00</p>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute contents inset-[87.43%_65.97%_1.32%_23.3%]" data-name="Group">
      <p className="absolute css-ew64yg font-['Geist:Regular',sans-serif] font-normal inset-[87.43%_65.97%_1.32%_23.3%] leading-[normal] text-[#6c727e] text-[13.986px] text-center">12:00</p>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute contents inset-[87.43%_49.88%_1.32%_39.67%]" data-name="Group">
      <p className="absolute css-ew64yg font-['Geist:Regular',sans-serif] font-normal inset-[87.43%_49.88%_1.32%_39.67%] leading-[normal] text-[#6c727e] text-[13.986px] text-center">14:00</p>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute contents inset-[87.43%_33.21%_1.32%_56.05%]" data-name="Group">
      <p className="absolute css-ew64yg font-['Geist:Regular',sans-serif] font-normal inset-[87.43%_33.21%_1.32%_56.05%] leading-[normal] text-[#6c727e] text-[13.986px] text-center">16:00</p>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute contents inset-[87.43%_16.84%_1.32%_72.43%]" data-name="Group">
      <p className="absolute css-ew64yg font-['Geist:Regular',sans-serif] font-normal inset-[87.43%_16.84%_1.32%_72.43%] leading-[normal] text-[#6c727e] text-[13.986px] text-center">18:00</p>
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents inset-[87.43%_-0.12%_1.32%_88.22%]" data-name="Group">
      <p className="absolute css-ew64yg font-['Geist:Regular',sans-serif] font-normal inset-[87.43%_-0.12%_1.32%_88.22%] leading-[normal] text-[#6c727e] text-[13.986px] text-center">20:00</p>
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute contents inset-[87.43%_-0.12%_1.32%_6.92%]" data-name="Group">
      <Group22 />
      <Group23 />
      <Group24 />
      <Group25 />
      <Group26 />
      <Group27 />
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute contents inset-[87.43%_-0.12%_1.32%_6.92%]" data-name="Group">
      <Group28 />
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute inset-[46.6%_93.62%_18.78%_1.74%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.984 55.3847">
        <g id="Group">
          <path d={svgPaths.p37495580} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute inset-[46.6%_85.43%_18.78%_9.93%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.984 55.3847">
        <g id="Group">
          <path d={svgPaths.p2e86b600} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute inset-[24.58%_77.25%_18.78%_18.12%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9842 90.6295">
        <g id="Group">
          <path d={svgPaths.p7d8400} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute inset-[24.58%_69.06%_18.78%_26.3%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9842 90.6295">
        <g id="Group">
          <path d={svgPaths.p38d2d400} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute inset-[38.34%_60.87%_18.78%_34.49%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.984 68.6015">
        <g id="Group">
          <path d={svgPaths.p3aa68080} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute inset-[41.1%_52.68%_18.78%_42.68%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9841 64.1959">
        <g id="Group">
          <path d={svgPaths.p155b4170} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute inset-[56.83%_44.49%_18.78%_50.87%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9841 39.0211">
        <g id="Group">
          <path d={svgPaths.p1c1d9400} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute inset-[56.83%_36.3%_18.78%_59.06%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9841 39.0211">
        <g id="Group">
          <path d={svgPaths.p1c1d9400} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group38() {
  return (
    <div className="absolute inset-[30.87%_28.12%_18.78%_67.25%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9841 80.5596">
        <g id="Group">
          <path d={svgPaths.p3b9e5200} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group39() {
  return (
    <div className="absolute inset-[24.58%_19.93%_18.78%_75.43%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9842 90.6295">
        <g id="Group">
          <path d={svgPaths.p19a90580} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group40() {
  return (
    <div className="absolute inset-[9.23%_11.74%_18.78%_83.62%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9842 115.175">
        <g id="Group">
          <path d={svgPaths.pc81c700} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group41() {
  return (
    <div className="absolute inset-[2.55%_3.55%_18.78%_91.81%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9842 125.874">
        <g id="Group">
          <path d={svgPaths.p295d7800} fill="var(--fill-0, #2463EF)" fillOpacity="0.1" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group42() {
  return (
    <div className="absolute contents inset-[2.55%_3.55%_18.78%_1.74%]" data-name="Group">
      <Group30 />
      <Group31 />
      <Group32 />
      <Group33 />
      <Group34 />
      <Group35 />
      <Group36 />
      <Group37 />
      <Group38 />
      <Group39 />
      <Group40 />
      <Group41 />
    </div>
  );
}

function Group43() {
  return (
    <div className="absolute contents inset-[2.55%_3.55%_18.78%_1.74%]" data-name="Group">
      <Group42 />
    </div>
  );
}

function Group44() {
  return (
    <div className="absolute contents inset-[2.55%_3.55%_18.78%_1.74%]" data-name="Group">
      <Group43 />
    </div>
  );
}

function Group45() {
  return (
    <div className="absolute inset-[2.55%_5.83%_43.17%_4.09%]" data-name="Group">
      <div className="absolute inset-[-1.73%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 310.444 89.8503">
          <g id="Group">
            <path d={svgPaths.p24635e00} id="Vector" stroke="var(--stroke-0, #2463EF)" strokeWidth="2.99704" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg7() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="SVG">
      <Group29 />
      <Group44 />
      <Group45 />
    </div>
  );
}

function Container47() {
  return (
    <div className="aspect-[344.6600036621094/160] content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Svg7 />
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] content-stretch flex flex-col gap-[var(--spacing-4,16px)] items-start px-[var(--spacing-6,24px)] relative w-full">
        <div className="bg-border h-px shrink-0 w-full" data-name="Horizontal Divider" />
        <Container46 />
        <div className="bg-border h-px shrink-0 w-full" data-name="Horizontal Divider" />
        <Container47 />
      </div>
    </div>
  );
}

function TeamContributionHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[var(--spacing-1,4px)] items-start relative shrink-0" data-name="Container">
      <div className="content-stretch flex items-center relative shrink-0">
        <h3 className="font-[var(--font-weight-medium)] text-foreground leading-[1.43] font-bold">
          Team Contribution
        </h3>
      </div>
      <div className="content-stretch flex items-center relative shrink-0">
        <p className="text-[var(--text-xs)] font-[var(--font-weight-normal)] text-muted-foreground leading-[1.33]">
          Inspector-wise inspection breakdown
        </p>
      </div>
    </div>
  );
}

function TeamContributionMenu() {
  return (
    <button 
      type="button"
      className="flex items-center justify-center relative rounded-full shrink-0 size-[24px] hover:bg-muted transition-colors cursor-pointer" 
      data-name="Button menu"
      aria-label="More options"
    >
      <div className="relative shrink-0 size-[16px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
          <g>
            <path d={svgPaths.p36e45a00} stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d={svgPaths.p150f5b00} stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            <path d={svgPaths.p2d6e5280} stroke="var(--muted-foreground)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </g>
        </svg>
      </div>
    </button>
  );
}

function TeamContributionCardHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-border border-b inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start justify-between px-[20px] py-[16px] relative w-full">
        <TeamContributionHeader />
        <TeamContributionMenu />
      </div>
    </div>
  );
}

function InspectorAvatar({ initials }: { initials: string }) {
  return (
    <div className="bg-primary/10 content-stretch flex items-center justify-center relative rounded-full shrink-0 size-[32px]">
      <span className="text-[10px] font-[var(--font-weight-medium)] text-primary leading-[1.6]">
        {initials}
      </span>
    </div>
  );
}

function InspectorRow({ name, initials, area, totalObs, critical, major, minor, onClick }: { 
  name: string; 
  initials: string; 
  area: string; 
  totalObs: number; 
  critical: number; 
  major: number; 
  minor: number;
  onClick?: () => void;
}) {
  const total = critical + major + minor;

  // Calculate RAG bar segments (64 bars total to match Figma)
  const redBars = Math.round((critical / total) * 64);
  const amberBars = Math.round((major / total) * 64);
  const greenBars = 64 - redBars - amberBars;

  return (
    <div 
      className="group relative flex flex-col gap-[12px] pl-[20px] pr-[21px] bg-card border border-border rounded-[var(--radius)] cursor-pointer hover:border-border/80 hover:shadow-sm transition-all duration-200 pt-[20px] pb-[20px] p-[20px]" 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between w-full gap-[12px]">
        <div className="flex flex-col gap-[4px] min-w-0 flex-1">
          <span className="font-[var(--font-weight-semi-bold)] text-foreground leading-[1.4] text-[16px] truncate">
            {name}
          </span>
          <span className="font-[var(--font-weight-normal)] leading-[1.43] text-[rgb(100,116,139)] truncate text-[14px]">
            {area}
          </span>
        </div>
        <div className="flex items-center justify-center min-w-[40px] h-[40px] rounded-[var(--radius)] bg-muted flex-shrink-0">
          <span className="text-[20px] font-[var(--font-weight-semi-bold)] text-primary leading-[1]">
            {totalObs}
          </span>
        </div>
      </div>

      {/* RAG Status Bar */}
      <div className="flex gap-[2px] h-[17px] items-center w-full">
        {Array.from({ length: redBars }).map((_, i) => (
          <div key={`red-${i}`} className="bg-[#e11d48] h-[14px] shrink-0 w-[3px]" />
        ))}
        {Array.from({ length: amberBars }).map((_, i) => (
          <div key={`amber-${i}`} className="bg-[#f59e0b] h-[14px] shrink-0 w-[3px]" />
        ))}
        {Array.from({ length: greenBars }).map((_, i) => (
          <div key={`green-${i}`} className="bg-[#16a34a] h-[14px] shrink-0 w-[3px]" />
        ))}
      </div>

      {/* Stats Grid */}
      <div className="flex items-center gap-[12px]">
        <div className="flex items-center gap-[9px]">
          <div className="h-[8px] w-[8px] rounded-full flex-shrink-0 bg-[#ef4444]" />
          <span className="font-[var(--font-weight-medium)] leading-[1.43] text-[var(--text-sm)] text-[14px]">
            {critical}
          </span>
          <span className="font-[var(--font-weight-normal)] leading-[1.43] text-[rgb(100,116,139)] text-[14px]">
            Red
          </span>
        </div>
        <div className="flex items-center gap-[9px]">
          <div className="h-[8px] w-[8px] rounded-full flex-shrink-0 bg-[#fbbf24]" />
          <span className="font-[var(--font-weight-medium)] leading-[1.43] text-[var(--text-sm)] text-[14px]">
            {major}
          </span>
          <span className="font-[var(--font-weight-normal)] leading-[1.43] text-[rgb(100,116,139)] text-[14px]">
            Amber
          </span>
        </div>
        <div className="flex items-center gap-[9px]">
          <div className="h-[8px] w-[8px] rounded-full flex-shrink-0 bg-[#22c55e]" />
          <span className="font-[var(--font-weight-medium)] leading-[1.43] text-[var(--text-sm)] text-[14px]">
            {minor}
          </span>
          <span className="font-[var(--font-weight-normal)] leading-[1.43] text-[rgb(100,116,139)] text-[14px]">
            Green
          </span>
        </div>
      </div>
    </div>
  );
}

function TeamContributionList() {
  const inspectors = [
    { name: "Sarah Mitchell", initials: "SM", area: "Rack 01 – Rack 04", totalObs: 45, critical: 8, major: 12, minor: 25 },
    { name: "James Chen", initials: "JC", area: "Rack 05 – Rack 08", totalObs: 38, critical: 5, major: 15, minor: 18 },
    { name: "Emily Rodriguez", initials: "ER", area: "Bay A1 – Bay A6", totalObs: 52, critical: 12, major: 18, minor: 22 },
    { name: "Michael O'Brien", initials: "MO", area: "Bay B1 – Bay B8", totalObs: 41, critical: 6, major: 14, minor: 21 },
  ];

  const scrollbarStyles = `
    .team-contribution-scroll {
      scrollbar-width: thin;
      scrollbar-color: transparent transparent;
    }
    .team-contribution-scroll:hover {
      scrollbar-color: var(--border) transparent;
    }
    .team-contribution-scroll::-webkit-scrollbar {
      width: 6px;
    }
    .team-contribution-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .team-contribution-scroll::-webkit-scrollbar-thumb {
      background-color: transparent;
      border-radius: var(--radius-sm);
    }
    .team-contribution-scroll:hover::-webkit-scrollbar-thumb {
      background-color: var(--border);
    }
    .team-contribution-scroll:hover::-webkit-scrollbar-thumb:hover {
      background-color: var(--muted-foreground);
      opacity: 0.7;
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div 
        className="team-contribution-scroll flex flex-col gap-[var(--spacing-3,12px)] w-full overflow-y-auto overflow-x-hidden px-[var(--spacing-4,16px)] pt-[var(--spacing-4,16px)] pb-[var(--spacing-3,12px)] flex-1 min-h-0 max-h-full" 
      >
        {inspectors.map((inspector) => (
          <InspectorRow 
            key={inspector.name} 
            {...inspector} 
            onClick={() => console.log(`Filter by ${inspector.name}`)} 
          />
        ))}
      </div>
    </>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-card relative rounded-[var(--radius)] w-full lg:max-w-[395px] lg:flex-shrink-0 self-stretch" data-name="Background+Border+Shadow">
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[inherit]">
        <TeamContributionCardHeader />
        <TeamContributionList />
      </div>
      <div aria-hidden="true" className="absolute border border-border inset-0 pointer-events-none rounded-[var(--radius)]" />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="flex flex-col lg:flex-row gap-[var(--spacing-6,24px)] items-stretch w-full min-w-0 p-4 md:p-0">
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
    </div>
  );
}