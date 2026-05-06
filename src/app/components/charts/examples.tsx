/**
 * LineChartMain Usage Examples
 * 
 * This file demonstrates various usage patterns for the LineChartMain component.
 * Copy these examples to implement line charts in your features.
 */

import React from "react";
import { LineChartMain } from "./LineChartMain";

// ========================================
// EXAMPLE 1: Basic Line Chart
// ========================================
export function BasicLineChartExample() {
  const data = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 5500 },
  ];

  return (
    <LineChartMain
      title="Monthly Revenue"
      description="Revenue trend over the past 6 months"
      data={data}
      dataKey="revenue"
      xKey="month"
      variant="default"
    />
  );
}

// ========================================
// EXAMPLE 2: Risk Chart with Threshold
// ========================================
export function RiskChartExample() {
  const riskData = [
    { date: "Week 1", riskScore: 25 },
    { date: "Week 2", riskScore: 30 },
    { date: "Week 3", riskScore: 45 },
    { date: "Week 4", riskScore: 60 },
    { date: "Week 5", riskScore: 70 },
  ];

  return (
    <LineChartMain
      title="Weekly Risk Assessment"
      description="Tracking risk score over time"
      data={riskData}
      dataKey="riskScore"
      xKey="date"
      variant="risk"
      threshold={{
        value: 40,
        label: "Critical Threshold",
      }}
      trend={180}
      footerText="Risk increased significantly in Week 4 and 5"
      yAxisLabel="Risk Score"
    />
  );
}

// ========================================
// EXAMPLE 3: Success Metrics Chart
// ========================================
export function SuccessMetricsExample() {
  const successData = [
    { period: "Q1", completionRate: 75 },
    { period: "Q2", completionRate: 82 },
    { period: "Q3", completionRate: 88 },
    { period: "Q4", completionRate: 95 },
  ];

  return (
    <LineChartMain
      title="Project Completion Rate"
      description="Quarterly completion percentage"
      data={successData}
      dataKey="completionRate"
      xKey="period"
      variant="success"
      trend={26.7}
      footerText="Completion rate improved by 20% from Q1 to Q4"
    />
  );
}

// ========================================
// EXAMPLE 4: Compact Chart (No Area Fill)
// ========================================
export function CompactChartExample() {
  const compactData = [
    { day: "Mon", tasks: 12 },
    { day: "Tue", tasks: 15 },
    { day: "Wed", tasks: 10 },
    { day: "Thu", tasks: 18 },
    { day: "Fri", tasks: 14 },
  ];

  return (
    <LineChartMain
      title="Daily Task Count"
      data={compactData}
      dataKey="tasks"
      xKey="day"
      variant="default"
      showArea={false}
      height={200}
    />
  );
}

// ========================================
// EXAMPLE 5: Warning Chart with Custom Height
// ========================================
export function WarningChartExample() {
  const warningData = [
    { time: "00:00", temperature: 20 },
    { time: "04:00", temperature: 25 },
    { time: "08:00", temperature: 35 },
    { time: "12:00", temperature: 45 },
    { time: "16:00", temperature: 50 },
    { time: "20:00", temperature: 42 },
  ];

  return (
    <LineChartMain
      title="Temperature Monitoring"
      description="24-hour temperature readings"
      data={warningData}
      dataKey="temperature"
      xKey="time"
      variant="warning"
      height={320}
      threshold={{
        value: 40,
        label: "Warning Level",
      }}
      yAxisLabel="Temperature (°C)"
    />
  );
}

// ========================================
// EXAMPLE 6: Danger/Alert Chart
// ========================================
export function DangerChartExample() {
  const alertData = [
    { hour: "1h", alerts: 2 },
    { hour: "2h", alerts: 3 },
    { hour: "3h", alerts: 8 },
    { hour: "4h", alerts: 12 },
    { hour: "5h", alerts: 15 },
  ];

  return (
    <LineChartMain
      title="Security Alerts"
      description="Critical security events per hour"
      data={alertData}
      dataKey="alerts"
      xKey="hour"
      variant="danger"
      trend={650}
      footerText="Alert spike detected in last 3 hours - immediate action required"
    />
  );
}

// ========================================
// EXAMPLE 7: Interactive Chart with Click Handler
// ========================================
export function InteractiveChartExample() {
  const performanceData = [
    { sprint: "Sprint 1", velocity: 25 },
    { sprint: "Sprint 2", velocity: 30 },
    { sprint: "Sprint 3", velocity: 28 },
    { sprint: "Sprint 4", velocity: 35 },
  ];

  const handleChartClick = (e: any) => {
    console.log("Chart clicked", e);
    // Open modal, navigate, or perform other actions
  };

  return (
    <LineChartMain
      title="Sprint Velocity"
      description="Team velocity over recent sprints"
      data={performanceData}
      dataKey="velocity"
      xKey="sprint"
      variant="success"
      onClick={handleChartClick}
      footerText="Click to view detailed sprint analytics"
    />
  );
}

// ========================================
// EXAMPLE 8: Real-time Data Chart
// ========================================
export function RealTimeChartExample() {
  const [liveData, setLiveData] = React.useState([
    { timestamp: "10:00", users: 150 },
    { timestamp: "10:05", users: 200 },
    { timestamp: "10:10", users: 180 },
    { timestamp: "10:15", users: 250 },
  ]);

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => {
        const newData = [...prev];
        const lastTime = prev[prev.length - 1].timestamp;
        const newTime = incrementTime(lastTime, 5); // 5 min increment
        const newUsers = Math.floor(Math.random() * 100) + 150;
        
        newData.push({ timestamp: newTime, users: newUsers });
        
        // Keep only last 10 data points
        if (newData.length > 10) {
          newData.shift();
        }
        
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <LineChartMain
      title="Active Users (Live)"
      description="Real-time user activity"
      data={liveData}
      dataKey="users"
      xKey="timestamp"
      variant="default"
      showArea={true}
    />
  );
}

// Helper function for time increment
function incrementTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, "0")}:${String(newMins).padStart(2, "0")}`;
}

// ========================================
// EXAMPLE 9: Multi-Section Dashboard Layout
// ========================================
export function DashboardLayoutExample() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Top row - 2 columns */}
      <BasicLineChartExample />
      <SuccessMetricsExample />
      
      {/* Bottom row - full width */}
      <div className="col-span-2">
        <RiskChartExample />
      </div>
    </div>
  );
}
