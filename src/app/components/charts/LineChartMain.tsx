import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ReferenceLine 
} from "recharts";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "../ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "../ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";

// Color mapping for variants using design system variables
const colorMap = {
  default: "var(--chart-1)",
  risk: "var(--chart-4)",
  success: "var(--chart-2)",
  danger: "var(--chart-4)",
  warning: "var(--chart-3)",
};

// Gradient mapping for area fill variants
const gradientMap = {
  default: ["var(--chart-1)", "var(--chart-1)", "var(--chart-1)"],
  risk: ["var(--chart-2)", "var(--chart-3)", "var(--chart-4)"],
  success: ["var(--chart-2)", "var(--chart-2)", "var(--chart-2)"],
  danger: ["var(--chart-4)", "var(--chart-4)", "var(--chart-4)"],
  warning: ["var(--chart-3)", "var(--chart-3)", "var(--chart-3)"],
};

export interface LineChartMainProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  xKey: string;
  trend?: number;
  threshold?: {
    value: number;
    label: string;
  };
  footerText?: string;
  variant?: "default" | "risk" | "success" | "danger" | "warning";
  height?: number;
  yAxisLabel?: string;
  showArea?: boolean;
  onClick?: (e: any) => void;
}

export function LineChartMain({
  title,
  description,
  data,
  dataKey,
  xKey,
  trend,
  threshold,
  footerText,
  variant = "default",
  height = 260,
  yAxisLabel,
  showArea = false,
  onClick,
}: LineChartMainProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleChartClick = (e: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onClick) {
      onClick(e);
    }
  };

  // Determine if this is a "risk" style chart (with aggressive styling)
  const isRiskStyle = variant === "risk" || variant === "danger";
  
  // Get computed color values from CSS variables
  const [strokeColor, setStrokeColor] = React.useState<string>("#3b82f6");
  const [primaryColor, setPrimaryColor] = React.useState<string>("#2563eb");
  const [gradientColors, setGradientColors] = React.useState<string[]>(["#22c55e", "#fbbf24", "#ef4444"]);

  React.useEffect(() => {
    // Get the computed style values from CSS variables
    const computedStyle = getComputedStyle(document.documentElement);
    const variantColor = computedStyle.getPropertyValue(colorMap[variant].replace("var(", "").replace(")", "")).trim();
    const primary = computedStyle.getPropertyValue("--primary").trim();
    const gradient = gradientMap[variant].map(color => 
      computedStyle.getPropertyValue(color.replace("var(", "").replace(")", "")).trim()
    );
    
    if (variantColor) {
      setStrokeColor(variantColor);
    }
    if (primary) {
      setPrimaryColor(primary);
    }
    if (gradient.every(c => c)) {
      setGradientColors(gradient);
    }
  }, [variant]);

  const chartConfig = {
    [dataKey]: {
      label: title,
      color: strokeColor,
    },
  };

  const isTrendPositive = trend !== undefined ? trend >= 0 : null;

  // Card styling: risk style gets hover effects, default is clean
  const cardClassName = isRiskStyle 
    ? "rounded-xl border bg-card transition-all duration-200 hover:border-primary hover:bg-muted/20 cursor-pointer"
    : "rounded-xl border bg-card";
  
  // Determine final stroke color
  const finalStrokeColor = isRiskStyle && isHovered ? primaryColor : strokeColor;

  return (
    <Card 
      className={cardClassName}
      style={{
        borderRadius: "var(--radius-lg)",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader 
        className="pb-2 space-y-1"
        style={{
          paddingBottom: "var(--spacing-2)",
        }}
      >
        <CardTitle 
          className="text-base font-semibold"
          style={{
            fontSize: "var(--text-base)",
            fontWeight: "var(--font-weight-semi-bold)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {title}
        </CardTitle>
        {description && (
          <CardDescription
            style={{
              fontSize: "var(--text-sm)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent 
        className="pt-0 pb-4"
        style={{
          paddingTop: "0",
          paddingBottom: "var(--spacing-4)",
        }}
      >
        <ChartContainer 
          config={chartConfig} 
          className="w-full" 
          style={{ height: `${height}px` }}
        >
          <LineChart 
            data={data} 
            onClick={handleChartClick}
            margin={{
              top: 20,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            {showArea && (
              <defs>
                <linearGradient id={`fill-${variant}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={0.3} />
                  <stop offset="40%" stopColor={gradientColors[1]} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={gradientColors[2]} stopOpacity={0.3} />
                </linearGradient>
              </defs>
            )}
            
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3" 
              stroke="var(--muted-foreground)" 
              opacity={0.15}
            />
            
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="var(--muted-foreground)"
              style={{
                fontSize: "var(--text-xs)",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={30}
              stroke="var(--muted-foreground)"
              style={{
                fontSize: "var(--text-xs)",
                fontFamily: "'Inter', sans-serif",
              }}
              label={yAxisLabel ? {
                value: yAxisLabel,
                angle: -90,
                position: "insideLeft",
                style: { 
                  fontSize: 12, 
                  fontFamily: "'Inter', sans-serif" 
                },
              } : undefined}
            />
            
            <ChartTooltip 
              cursor={{ stroke: "var(--muted-foreground)", opacity: 0.15 }}
              content={<ChartTooltipContent />} 
            />
            
            {threshold && isRiskStyle && (
              <ReferenceLine
                y={threshold.value}
                stroke={isHovered ? primaryColor : "var(--muted-foreground)"}
                strokeDasharray="4 4"
                label={{
                  value: threshold.label,
                  position: "right",
                  fill: isHovered ? primaryColor : "var(--muted-foreground)",
                  fontSize: 12,
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            )}
            
            <Line
              dataKey={dataKey}
              type="natural"
              stroke={finalStrokeColor}
              strokeWidth={2}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: "var(--background)",
                stroke: finalStrokeColor,
              }}
              activeDot={{
                r: 6,
                fill: finalStrokeColor,
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
              fill={showArea ? `url(#fill-${variant})` : undefined}
              fillOpacity={showArea ? 1 : 0}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      {(trend !== undefined || footerText) && (
        <CardFooter 
          className="flex-col items-start gap-1 pt-3 text-sm"
          style={{
            paddingTop: "var(--spacing-3)",
            gap: "var(--spacing-1)",
          }}
        >
          {trend !== undefined && (
            <div 
              className="flex items-center gap-2 font-medium"
              style={{
                gap: "var(--spacing-2)",
                fontWeight: "var(--font-weight-medium)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Trending {isTrendPositive ? "up" : "down"} by {Math.abs(trend)}% this month
              {isTrendPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
          {footerText && (
            <div 
              className="text-muted-foreground leading-none"
              style={{
                fontSize: "var(--text-sm)",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {footerText}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}