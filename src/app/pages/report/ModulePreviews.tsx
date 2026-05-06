import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ImageIcon, 
  Table as TableIcon, 
  FileText, 
  List, 
  Calendar, 
  MoreHorizontal, 
  GripVertical, 
  Trash2,
  BrainCircuit,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/components/ui/utils';
import { AddContentMenu } from '@/app/components/report/AddContentMenu';
import { ModuleContentBlock, ContentBlock } from '@/app/components/report/ModuleContentBlock';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/ui/select';
import { Settings } from 'lucide-react';

// --- 1. Executive Summary Preview ---
const ExecutiveSummaryPreview = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        <div className="flex justify-between items-center border-b border-border/40 pb-1">
          <span className="text-xs text-muted-foreground font-medium">Total Inspections</span>
          <span className="text-sm font-bold text-foreground">24</span>
        </div>
        <div className="flex justify-between items-center border-b border-border/40 pb-1">
          <span className="text-xs text-muted-foreground font-medium">Passed</span>
          <span className="text-sm font-bold text-green-600">18</span>
        </div>
        <div className="flex justify-between items-center border-b border-border/40 pb-1">
          <span className="text-xs text-muted-foreground font-medium">Failed</span>
          <span className="text-sm font-bold text-red-600">6</span>
        </div>
        <div className="flex justify-between items-center border-b border-border/40 pb-1">
          <span className="text-xs text-muted-foreground font-medium">Critical Risks</span>
          <span className="text-sm font-bold text-red-600">2</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Narrative</div>
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
          This rack system shows moderate compliance with current safety standards. 
          While the majority of uprights are structurally sound, specific anchor bolt failures in Zone B require immediate attention.
        </p>
      </div>
    </div>
  );
};

// --- 2. Key Risks Preview ---
const KeyRisksPreview = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 p-2 rounded-md bg-background border border-border/50">
        <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
        <Badge variant="outline" className="h-5 text-[10px] px-1.5 bg-red-50 text-red-700 border-red-200">High</Badge>
        <span className="text-sm font-medium truncate">Loose Anchor Bolt</span>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-md bg-background border border-border/50">
        <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
        <Badge variant="outline" className="h-5 text-[10px] px-1.5 bg-red-50 text-red-700 border-red-200">High</Badge>
        <span className="text-sm font-medium truncate">Baseplate Settlement</span>
      </div>
      <div className="flex items-center gap-2 p-2 rounded-md bg-background border border-border/50">
        <div className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
        <Badge variant="outline" className="h-5 text-[10px] px-1.5 bg-orange-50 text-orange-700 border-orange-200">Med</Badge>
        <span className="text-sm font-medium truncate">Surface Corrosion</span>
      </div>
      <div className="pl-4 text-xs text-muted-foreground font-medium mt-1">
        + 3 more risks...
      </div>
    </div>
  );
};

// --- 3. Compliance Score Preview ---
const ComplianceScorePreview = () => {
  const data = [
    { name: 'Compliant', value: 78, color: '#22c55e' }, // green-500
    { name: 'Non-Compliant', value: 22, color: '#e2e8f0' }, // slate-200
  ];

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-[80px] w-[80px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={25}
              outerRadius={35}
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold">78%</span>
        </div>
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Structural</span>
          <span className="font-semibold">82%</span>
        </div>
        <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '82%' }} />
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Inspection</span>
          <span className="font-semibold">74%</span>
        </div>
        <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '74%' }} />
        </div>
      </div>
    </div>
  );
};

// --- 4. Visual Inspection Preview ---
const VisualInspectionPreview = () => {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-12 gap-2 pb-2 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase">
        <div className="col-span-5">Item</div>
        <div className="col-span-3">Status</div>
        <div className="col-span-4 text-right">Severity</div>
      </div>
      <div className="space-y-2 mt-2">
        <div className="grid grid-cols-12 gap-2 text-sm items-center">
          <div className="col-span-5 font-medium truncate">Column A-1</div>
          <div className="col-span-3"><Badge variant="outline" className="text-[10px] h-5 px-1.5 border-red-200 text-red-700 bg-red-50">Fail</Badge></div>
          <div className="col-span-4 text-right text-xs text-red-600 font-medium">High</div>
        </div>
        <div className="grid grid-cols-12 gap-2 text-sm items-center">
          <div className="col-span-5 font-medium truncate">Beam B-4</div>
          <div className="col-span-3"><Badge variant="outline" className="text-[10px] h-5 px-1.5 border-green-200 text-green-700 bg-green-50">Pass</Badge></div>
          <div className="col-span-4 text-right text-xs text-muted-foreground">-</div>
        </div>
        <div className="grid grid-cols-12 gap-2 text-sm items-center">
          <div className="col-span-5 font-medium truncate">Baseplate C-2</div>
          <div className="col-span-3"><Badge variant="outline" className="text-[10px] h-5 px-1.5 border-red-200 text-red-700 bg-red-50">Fail</Badge></div>
          <div className="col-span-4 text-right text-xs text-orange-600 font-medium">Medium</div>
        </div>
      </div>
      <div className="mt-3 text-xs text-center text-muted-foreground font-medium bg-muted/30 py-1 rounded">
        Showing 3 of 24 inspections
      </div>
    </div>
  );
};

// --- 5. Findings Log Preview ---
const FindingsLogPreview = () => {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-12 gap-2 pb-2 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase">
        <div className="col-span-3">ID</div>
        <div className="col-span-6">Issue</div>
        <div className="col-span-3 text-right">Status</div>
      </div>
      <div className="space-y-2 mt-2">
        <div className="grid grid-cols-12 gap-2 text-sm items-center">
          <div className="col-span-3 font-mono text-xs text-muted-foreground">F-101</div>
          <div className="col-span-6 truncate font-medium">Anchor Misalignment</div>
          <div className="col-span-3 text-right"><span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Open</span></div>
        </div>
        <div className="grid grid-cols-12 gap-2 text-sm items-center">
          <div className="col-span-3 font-mono text-xs text-muted-foreground">F-102</div>
          <div className="col-span-6 truncate font-medium">Corrosion Level 2</div>
          <div className="col-span-3 text-right"><span className="text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Closed</span></div>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground font-medium flex justify-between px-1">
        <span>Total Findings: 8</span>
        <span className="text-primary cursor-pointer hover:underline">View All</span>
      </div>
    </div>
  );
};

// --- 6. Photo Gallery Preview ---
const PhotoGalleryPreview = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="aspect-[4/3] bg-muted rounded-md relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10">
            <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
          </div>
        </div>
        <div className="aspect-[4/3] bg-muted rounded-md relative overflow-hidden group">
          <div className="absolute inset-0 flex items-center justify-center bg-muted-foreground/10">
             <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
          </div>
        </div>
        <div className="aspect-[4/3] bg-muted rounded-md relative overflow-hidden">
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-2">
            <span className="text-lg font-bold">+5</span>
            <span className="text-[10px] font-medium opacity-80">more images</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="h-3 w-3" />
        <span>Last updated: Today, 10:42 AM</span>
      </div>
    </div>
  );
};

// --- 7. AI Insight Preview ---
const AIInsightPreview = () => {
  return (
    <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-lg p-3">
      <div className="flex gap-3">
        <BrainCircuit className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <div>
            <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-1">Risk Pattern Detected</div>
            <p className="text-sm text-foreground/90 leading-tight">Frequent anchor bolt loosening across Level 2 sectors.</p>
          </div>
          <div>
             <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide mb-1 mt-2">Recommendation</div>
             <p className="text-sm text-foreground/90 leading-tight">Schedule structural reinforcement audit within 30 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 8. Table Representation Preview ---
const TableRepresentationPreview = ({ config }: { config: any }) => {
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-12 gap-2 pb-2 border-b border-border/50 text-xs font-semibold text-muted-foreground uppercase">
        <div className="col-span-3">ID</div>
        <div className="col-span-6">Issue</div>
        <div className="col-span-3 text-right">Status</div>
      </div>
      <div className="space-y-2 mt-2">
        <div className="grid grid-cols-12 gap-2 text-sm items-center">
          <div className="col-span-3 font-mono text-xs text-muted-foreground">F-101</div>
          <div className="col-span-6 truncate font-medium">Anchor Misalignment</div>
          <div className="col-span-3 text-right"><span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">Open</span></div>
        </div>
        <div className="grid grid-cols-12 gap-2 text-sm items-center">
          <div className="col-span-3 font-mono text-xs text-muted-foreground">F-102</div>
          <div className="col-span-6 truncate font-medium">Corrosion Level 2</div>
          <div className="col-span-3 text-right"><span className="text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Closed</span></div>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground font-medium flex justify-between px-1">
        <span>Total Findings: 8</span>
        <span className="text-primary cursor-pointer hover:underline">View All</span>
      </div>
    </div>
  );
};

// --- 9. Chart Representation Preview ---
const ChartRepresentationPreview = ({ config, moduleId }: { config: any; moduleId: string }) => {
  // Generate unique IDs for this chart instance using moduleId
  const chartIdPrefix = `chart-${moduleId}`;
  
  // EMPTY STATE: Show when chart is not configured
  if (!config?.xAxisField || !config?.yAxisField) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="rounded-full bg-muted/50 p-4 mb-4">
          <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h4 
          className="font-semibold text-foreground/80 mb-2"
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semi-bold)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Chart Not Configured
        </h4>
        <p 
          className="text-muted-foreground text-center max-w-[280px]"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Select X-axis and Y-axis fields in the settings panel to render the chart
        </p>
      </div>
    );
  }

  // Sample data for chart preview (in production, this would come from real data)
  const sampleData = [
    { name: 'Zone A', value: 24, value2: 18 },
    { name: 'Zone B', value: 32, value2: 28 },
    { name: 'Zone C', value: 18, value2: 15 },
    { name: 'Zone D', value: 28, value2: 22 },
    { name: 'Zone E', value: 22, value2: 20 },
  ];

  const pieData = [
    { name: 'Zone A', value: 24, color: '#3b82f6' },
    { name: 'Zone B', value: 32, color: '#22c55e' },
    { name: 'Zone C', value: 18, color: '#f59e0b' },
    { name: 'Zone D', value: 28, color: '#ef4444' },
    { name: 'Zone E', value: 22, color: '#a855f7' },
  ];

  const chartType = config.chartType || 'bar';

  // Render the correct chart based on type (prevents duplicate key warnings)
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart key={chartIdPrefix} data={sampleData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid key={`${chartIdPrefix}-grid`} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              key={`${chartIdPrefix}-xaxis`}
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <YAxis 
              key={`${chartIdPrefix}-yaxis`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <Tooltip 
              key={`${chartIdPrefix}-tooltip`}
              contentStyle={{ 
                fontSize: 12, 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
            <Bar key={`${chartIdPrefix}-bar`} dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart key={chartIdPrefix} data={sampleData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid key={`${chartIdPrefix}-grid`} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              key={`${chartIdPrefix}-xaxis`}
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <YAxis 
              key={`${chartIdPrefix}-yaxis`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <Tooltip 
              key={`${chartIdPrefix}-tooltip`}
              contentStyle={{ 
                fontSize: 12, 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
            <Line 
              key={`${chartIdPrefix}-line`}
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        );
      
      case 'pie':
        return (
          <PieChart key={chartIdPrefix}>
            <Pie
              key={`${chartIdPrefix}-pie`}
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={60}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`${chartIdPrefix}-pie-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              key={`${chartIdPrefix}-tooltip`}
              contentStyle={{ 
                fontSize: 12, 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
          </PieChart>
        );
      
      case 'stacked-bar':
        return (
          <BarChart key={chartIdPrefix} data={sampleData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid key={`${chartIdPrefix}-grid`} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              key={`${chartIdPrefix}-xaxis`}
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <YAxis 
              key={`${chartIdPrefix}-yaxis`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <Tooltip 
              key={`${chartIdPrefix}-tooltip`}
              contentStyle={{ 
                fontSize: 12, 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
            <Legend key={`${chartIdPrefix}-legend`} wrapperStyle={{ fontSize: 11 }} iconType="square" />
            <Bar key={`${chartIdPrefix}-bar-1`} dataKey="value" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
            <Bar key={`${chartIdPrefix}-bar-2`} dataKey="value2" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart key={chartIdPrefix} data={sampleData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid key={`${chartIdPrefix}-grid`} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              key={`${chartIdPrefix}-xaxis`}
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <YAxis 
              key={`${chartIdPrefix}-yaxis`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <Tooltip 
              key={`${chartIdPrefix}-tooltip`}
              contentStyle={{ 
                fontSize: 12, 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
            <Area 
              key={`${chartIdPrefix}-area`}
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      
      default:
        return (
          <BarChart key={chartIdPrefix} data={sampleData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid key={`${chartIdPrefix}-grid`} strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              key={`${chartIdPrefix}-xaxis`}
              dataKey="name" 
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <YAxis 
              key={`${chartIdPrefix}-yaxis`}
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <Tooltip 
              key={`${chartIdPrefix}-tooltip`}
              contentStyle={{ 
                fontSize: 12, 
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}
            />
            <Bar key={`${chartIdPrefix}-bar`} dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Configuration Summary Badge */}
      <div 
        className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-md px-3 py-2 border border-border/40"
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <BarChart3 className="h-3.5 w-3.5" />
        <span className="font-medium">
          X: <span className="text-foreground">{config.xAxisField || 'Not set'}</span>
        </span>
        <span className="text-border">•</span>
        <span className="font-medium">
          Y: <span className="text-foreground">{config.yAxisField || 'Not set'}</span>
        </span>
        <span className="text-border">•</span>
        <Badge variant="outline" className="text-[10px] h-5 px-1.5 capitalize">
          {chartType}
        </Badge>
      </div>

      {/* Chart Rendering */}
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- 10. Heatmap Representation Preview ---
const HeatmapRepresentationPreview = ({ config }: { config: any }) => {
  // EMPTY STATE: Show when heatmap is not configured
  if (!config?.xAxisField || !config?.yAxisField || !config?.valueField) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="rounded-full bg-muted/50 p-4 mb-4">
          <TableIcon className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h4 
          className="font-semibold text-foreground/80 mb-2"
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semi-bold)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Heatmap Not Configured
        </h4>
        <p 
          className="text-muted-foreground text-center max-w-[280px]"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Select X-axis, Y-axis, and value fields to render the heatmap
        </p>
      </div>
    );
  }

  // Sample heatmap data
  const yLabels = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];
  const xLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
  
  // Generate sample data with intensity values (0-100)
  const heatmapData = [
    [85, 72, 91, 68],
    [64, 88, 75, 82],
    [92, 81, 69, 95],
    [78, 86, 94, 73],
  ];

  // Helper function to get color based on value
  const getHeatmapColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-500';
    if (value >= 75) return 'bg-green-400';
    if (value >= 60) return 'bg-yellow-400';
    if (value >= 45) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-3">
      {/* Configuration Summary */}
      <div 
        className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-md px-3 py-2 border border-border/40"
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <TableIcon className="h-3.5 w-3.5" />
        <span className="font-medium">
          X: <span className="text-foreground">{config.xAxisField}</span>
        </span>
        <span className="text-border">•</span>
        <span className="font-medium">
          Y: <span className="text-foreground">{config.yAxisField}</span>
        </span>
        <span className="text-border">•</span>
        <span className="font-medium">
          Value: <span className="text-foreground">{config.valueField}</span>
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-1">
        {/* Header Row */}
        <div className="grid grid-cols-5 gap-1">
          <div /> {/* Empty corner cell */}
          {xLabels.map((label, idx) => (
            <div 
              key={idx} 
              className="text-center text-xs font-medium text-muted-foreground py-1"
              style={{
                fontSize: 'var(--text-xs)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {yLabels.map((yLabel, yIdx) => (
          <div key={yIdx} className="grid grid-cols-5 gap-1">
            <div 
              className="text-xs font-medium text-muted-foreground flex items-center pr-2"
              style={{
                fontSize: 'var(--text-xs)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {yLabel}
            </div>
            {heatmapData[yIdx].map((value, xIdx) => (
              <div 
                key={xIdx}
                className={cn(
                  "aspect-square rounded flex items-center justify-center text-white text-xs font-semibold transition-transform hover:scale-110 cursor-pointer",
                  getHeatmapColor(value)
                )}
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 justify-end">
        <span 
          className="text-xs text-muted-foreground"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Low
        </span>
        <div className="flex gap-1">
          <div key="legend-red" className="w-4 h-4 rounded bg-red-400" />
          <div key="legend-orange" className="w-4 h-4 rounded bg-orange-400" />
          <div key="legend-yellow" className="w-4 h-4 rounded bg-yellow-400" />
          <div key="legend-green" className="w-4 h-4 rounded bg-green-400" />
          <div key="legend-emerald" className="w-4 h-4 rounded bg-emerald-500" />
        </div>
        <span 
          className="text-xs text-muted-foreground"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          High
        </span>
      </div>
    </div>
  );
};

// --- 11. Insights Representation Preview ---
const InsightsRepresentationPreview = ({ config, moduleId }: { config: any; moduleId: string }) => {
  const insightType = config?.insightType || 'kpi';
  
  // EMPTY STATE: Show when insights is not configured
  const isConfigured = () => {
    switch (insightType) {
      case 'kpi':
        return config?.metricSource && config?.aggregationType;
      case 'kpi-grid':
        return config?.metricsSelection && config?.metricsSelection.length > 0;
      case 'key-observations':
        return config?.observationSource;
      case 'trend-summary':
        return config?.trendMetric && config?.timeInterval;
      default:
        return false;
    }
  };

  if (!isConfigured()) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4">
        <div className="rounded-full bg-muted/50 p-4 mb-4">
          <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h4 
          className="font-semibold text-foreground/80 mb-2"
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semi-bold)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Insights Not Configured
        </h4>
        <p 
          className="text-muted-foreground text-center max-w-[280px]"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Configure your insight type and required fields
        </p>
      </div>
    );
  }

  // KPI Preview
  if (insightType === 'kpi') {
    return (
      <div className="space-y-3">
        {/* Configuration Badge */}
        <div 
          className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-md px-3 py-2 border border-border/40"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span className="font-medium">
            {config.metricSource} ({config.aggregationType})
          </span>
          <span className="text-border">•</span>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5">
            KPI
          </Badge>
        </div>

        {/* KPI Display */}
        <div 
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h4 
            className="text-muted-foreground font-medium mb-2 text-center"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Total Inspections
          </h4>
          <div 
            className="text-5xl font-bold text-primary"
            style={{
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            245
          </div>
        </div>
      </div>
    );
  }

  // KPI Grid Preview
  if (insightType === 'kpi-grid') {
    const maxKPIs = config.maxKPIs || 4;
    const sampleKPIs = [
      { label: 'Total Inspections', value: '245', trend: '+12%' },
      { label: 'Critical Findings', value: '18', trend: '-5%' },
      { label: 'High Risk Zones', value: '3', trend: '0%' },
      { label: 'Compliance Score', value: '86%', trend: '+3%' },
      { label: 'Open Issues', value: '42', trend: '+8%' },
      { label: 'Completed', value: '203', trend: '+15%' },
    ].slice(0, maxKPIs);

    return (
      <div className="space-y-3">
        {/* Configuration Badge */}
        <div 
          className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-md px-3 py-2 border border-border/40"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span className="font-medium">
            {config.metricsSelection.length} metric(s)
          </span>
          <span className="text-border">•</span>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5">
            KPI Grid
          </Badge>
        </div>

        {/* KPI Grid Display */}
        <div 
          className="grid grid-cols-2 gap-3"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {sampleKPIs.map((kpi, idx) => (
            <div 
              key={idx}
              className="flex flex-col p-4 bg-muted/20 rounded-lg border border-border/40"
            >
              <span 
                className="text-muted-foreground mb-1"
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {kpi.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-2xl font-bold text-foreground"
                  style={{
                    fontWeight: 'var(--font-weight-bold)',
                  }}
                >
                  {kpi.value}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[9px] h-4 px-1",
                    kpi.trend.startsWith('+') && "bg-green-50 text-green-700 border-green-200",
                    kpi.trend.startsWith('-') && "bg-red-50 text-red-700 border-red-200",
                    kpi.trend.startsWith('0') && "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {kpi.trend}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Key Observations Preview
  if (insightType === 'key-observations') {
    const maxObs = config.maxObservations || 5;
    const sampleObservations = [
      'Zone B contains the highest number of structural defects',
      'Anchor bolt failures increased by 12% since last inspection',
      'Corrosion detected in 3 rack aisles requiring immediate attention',
      'Load capacity compliance at 94% across all zones',
      'Welding integrity shows improvement in recent inspections',
      'Paint condition deteriorating in high-humidity areas',
      'Beam deflection within acceptable limits',
      'Floor anchoring systems require reinforcement',
    ].slice(0, maxObs);

    return (
      <div className="space-y-3">
        {/* Configuration Badge */}
        <div 
          className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-md px-3 py-2 border border-border/40"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span className="font-medium">
            {config.observationSource}
          </span>
          <span className="text-border">•</span>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5">
            Key Observations
          </Badge>
        </div>

        {/* Observations Display */}
        <div 
          className="space-y-2 p-4 bg-muted/20 rounded-lg border border-border/40"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h5 
            className="font-semibold text-foreground mb-3"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semi-bold)',
            }}
          >
            Key Insights
          </h5>
          <ul className="space-y-2">
            {sampleObservations.map((obs, idx) => (
              <li 
                key={idx} 
                className="flex gap-2 text-foreground/90"
                style={{
                  fontSize: 'var(--text-sm)',
                }}
              >
                <span className="text-primary mt-1.5 flex-shrink-0">•</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Trend Summary Preview
  if (insightType === 'trend-summary') {
    return (
      <div className="space-y-3">
        {/* Configuration Badge */}
        <div 
          className="flex items-center gap-2 text-muted-foreground bg-muted/30 rounded-md px-3 py-2 border border-border/40"
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span className="font-medium">
            {config.trendMetric} ({config.timeInterval})
          </span>
          <span className="text-border">•</span>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5">
            Trend Summary
          </Badge>
        </div>

        {/* Trend Summary Display */}
        <div 
          className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border border-primary/20"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <h5 
            className="font-semibold text-foreground mb-2"
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semi-bold)',
            }}
          >
            Trend Summary
          </h5>
          <p 
            className="text-foreground/80 leading-relaxed"
            style={{
              fontSize: 'var(--text-sm)',
            }}
          >
            Structural failures increased by <span className="font-semibold text-orange-600">8%</span> over the last quarter,
            with the majority occurring in high-load storage zones. Proactive maintenance
            recommended for Zone B and Zone D to prevent further deterioration.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

// --- Text Block Preview ---
const TextBlockPreview = ({ config }: { config: any }) => {
  return (
    <div className="space-y-2">
      <div 
        className="w-full min-h-[80px] p-3 bg-muted/20 border border-border/40 rounded-md text-muted-foreground italic"
        style={{
          fontSize: 'var(--text-sm)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {config?.content || 'Write notes or explanation...'}
      </div>
    </div>
  );
};

// --- Divider Preview ---
const DividerPreview = () => {
  return (
    <div className="py-2">
      <div className="border-t border-border/60" />
    </div>
  );
};

// --- Main Module Renderer ---
export const ModuleRenderer = ({ module }: { module: any }) => {
  const { id, type, tag, name, representationType, config } = module;
  
  // Handle content blocks (Text Block and Divider)
  if (type === 'TextBlock') return <TextBlockPreview config={config} />;
  if (type === 'Divider') return <DividerPreview />;
  
  // If module has been configured with a specific representation type, use that
  if (config?.isSaved && representationType) {
    switch (representationType) {
      case 'table':
        return <TableRepresentationPreview config={config} />;
      case 'chart':
        return <ChartRepresentationPreview config={config} moduleId={id} />;
      case 'heatmap':
        return <HeatmapRepresentationPreview config={config} />;
      case 'insights':
        return <InsightsRepresentationPreview config={config} moduleId={id} />;
      default:
        break;
    }
  }
  
  // Fallback to default preview based on module name/type (unconfigured modules)
  if (name.includes('AI Insight')) return <AIInsightPreview />;
  if (tag === 'Risks' || type === 'List') return <KeyRisksPreview />;
  if (tag === 'Visual' || tag === 'Engineering' || type === 'Chart') return <ComplianceScorePreview />;
  if (tag === 'Inspection' || name.includes('Inspection')) return <VisualInspectionPreview />;
  if (tag === 'Data' || type === 'Table') return <FindingsLogPreview />;
  if (tag === 'Media' || type === 'Gallery') return <PhotoGalleryPreview />;
  
  // Default fallback (Executive Summary style)
  return <ExecutiveSummaryPreview />;
};

// --- Main Builder Card Component ---
export const ModuleBuilderCard = ({ 
  module, 
  onDelete, 
  isSelected, 
  onClick,
  dragHandleRef,
  onUpdateConfig,
  selectedContentBlockId,
  onContentBlockClick
}: { 
  module: any, 
  onDelete: (e: React.MouseEvent) => void, 
  isSelected: boolean,
  onClick: (e: React.MouseEvent) => void,
  dragHandleRef?: any,
  onUpdateConfig?: (updates: any) => void,
  selectedContentBlockId?: string | null,
  onContentBlockClick?: (blockId: string) => void
}) => {
  // Handle content blocks
  const handleAddContent = (type: 'text' | 'divider') => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      content: type === 'text' ? '' : undefined,
      mode: type === 'text' ? 'static' : undefined,
    };
    
    const currentBlocks = module.contentBlocks || [];
    const updatedBlocks = [...currentBlocks, newBlock];
    
    if (onUpdateConfig) {
      onUpdateConfig({ contentBlocks: updatedBlocks });
    }
    
    // Auto-select the newly created text block
    if (type === 'text' && onContentBlockClick) {
      // Use setTimeout to ensure state updates after contentBlocks are saved
      setTimeout(() => {
        onContentBlockClick(newBlock.id);
      }, 0);
    }
  };
  
  const handleUpdateBlock = (blockId: string, updatedBlock: ContentBlock) => {
    const currentBlocks = module.contentBlocks || [];
    const updatedBlocks = currentBlocks.map((block: ContentBlock) =>
      block.id === blockId ? updatedBlock : block
    );
    
    if (onUpdateConfig) {
      onUpdateConfig({ contentBlocks: updatedBlocks });
    }
  };
  
  const handleDeleteBlock = (blockId: string) => {
    const currentBlocks = module.contentBlocks || [];
    const updatedBlocks = currentBlocks.filter((block: ContentBlock) => block.id !== blockId);
    
    if (onUpdateConfig) {
      onUpdateConfig({ contentBlocks: updatedBlocks });
    }
  };
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group flex flex-col bg-card border rounded-xl overflow-hidden transition-all duration-200 mb-4",
        isSelected 
          ? "border-primary ring-1 ring-primary/20 shadow-md" 
          : "border-border/60 hover:border-primary/30 hover:shadow-sm"
      )}
      style={{
        borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* HEADER: [Drag Handle] Title [Badge] [Delete] */}
      <div 
        className="flex items-center gap-3 px-4 py-3 bg-muted/30 border-b border-border/40 min-h-[48px]"
        style={{
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div 
          ref={dragHandleRef} 
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </div>
        
        <div 
          className="flex-1 text-foreground/90 truncate"
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semi-bold)',
          }}
        >
          {module.name}
        </div>
        
        {/* Show representation type badge if configured */}
        {module.config?.isSaved && module.representationType && (
          <Badge 
            variant="outline" 
            className="h-5 px-2 bg-primary/5 text-primary border-primary/30 capitalize"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {module.representationType}
          </Badge>
        )}
        
        {/* Show page orientation indicator ONLY for table representation */}
        {module.config?.isSaved && module.representationType === 'table' && module.config?.pageOrientation && (
          <Badge 
            variant="outline" 
            className="h-5 px-2 bg-background text-muted-foreground border-border capitalize"
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {module.config.pageOrientation === 'portrait' ? '📄' : '📃'} {module.config.pageOrientation}
          </Badge>
        )}
        
        <Badge 
          variant="outline" 
          className="h-5 px-2 bg-background text-muted-foreground border-border"
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          {module.type}
        </Badge>
        
        {/* Add Content Menu */}
        <AddContentMenu onAddContent={handleAddContent} />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 -mr-1"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>



      {/* CONTENT: Preview Area */}
      <div className="p-4 bg-card/50 min-h-[100px]">
        <ModuleRenderer module={module} />
      </div>
      
      {/* MODULE CONTENT BLOCKS */}
      {module.contentBlocks && module.contentBlocks.length > 0 && (
        <div className="px-4 pb-4">
          {module.contentBlocks.map((block: ContentBlock) => (
            <ModuleContentBlock
              key={block.id}
              block={block}
              onDelete={() => handleDeleteBlock(block.id)}
              isSelected={selectedContentBlockId === block.id}
              onClick={() => onContentBlockClick?.(block.id)}
              isEditable={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};