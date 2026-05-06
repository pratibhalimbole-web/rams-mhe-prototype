/**
 * DynamicInsightConfig - Configuration panel for dynamic text blocks
 * Auto-generates insights from module dataset
 */

import React from 'react';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Input } from '@/app/components/ui/input';

interface DynamicInsightConfigProps {
  config: {
    insightSource?: string;
    insightType?: string;
    maxInsights?: number;
  };
  onChange: (config: any) => void;
}

export function DynamicInsightConfig({ config, onChange }: DynamicInsightConfigProps) {
  const updateConfig = (key: string, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      {/* Insight Source */}
      <div className="space-y-2">
        <Label 
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Insight Source
        </Label>
        <Select
          value={config.insightSource || 'module-data'}
          onValueChange={(value) => updateConfig('insightSource', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="module-data">Module Dataset</SelectItem>
            <SelectItem value="report-wide">Report-wide Data</SelectItem>
            <SelectItem value="historical">Historical Comparison</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Insight Type */}
      <div className="space-y-2">
        <Label
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Insight Type
        </Label>
        <Select
          value={config.insightType || 'key-findings'}
          onValueChange={(value) => updateConfig('insightType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select insight type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="key-findings">Key Findings</SelectItem>
            <SelectItem value="trends">Trends & Patterns</SelectItem>
            <SelectItem value="anomalies">Anomalies & Outliers</SelectItem>
            <SelectItem value="recommendations">Recommendations</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Max Insights */}
      <div className="space-y-2">
        <Label
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Max Insights
        </Label>
        <Input
          type="number"
          min="1"
          max="10"
          value={config.maxInsights || 3}
          onChange={(e) => updateConfig('maxInsights', parseInt(e.target.value))}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'var(--text-sm)',
          }}
        />
      </div>

      {/* Preview Info */}
      <div 
        className="text-xs p-3 rounded-md bg-muted/50 border"
        style={{
          color: 'var(--muted-foreground)',
          borderColor: 'var(--border)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <strong>Note:</strong> Dynamic insights will be generated from the configured data source when the report is viewed or exported.
      </div>
    </div>
  );
}
