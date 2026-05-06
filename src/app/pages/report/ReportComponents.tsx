import React from 'react';
import { cn } from '@/app/components/ui/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ImageIcon } from 'lucide-react';

// --- 1. Executive Summary Report ---
export const ExecutiveSummaryReport = () => {
  return (
    <div className="text-gray-800">
      <p className="text-[16px] leading-[1.6] mb-4">
        This structural audit covered 24 inspection points.
        Overall compliance is 78%.
      </p>
      <p className="text-[16px] leading-[1.6]">
        Two critical risks were identified in baseplate anchoring.
        Immediate corrective action is recommended.
      </p>
    </div>
  );
};

// --- 2. Key Risks Report ---
export const KeyRisksReport = () => {
  return (
    <div className="space-y-6 text-gray-800">
      <div>
        <h4 className="font-bold text-red-600 text-lg mb-2">High Severity</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li className="text-[15px]">Loose Anchor Bolt at Column C2</li>
          <li className="text-[15px]">Baseplate Settlement at Rack 5</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-orange-600 text-lg mb-2">Medium Severity</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li className="text-[15px]">Surface corrosion on Beam 3</li>
        </ul>
      </div>
    </div>
  );
};

// --- 3. Compliance Report ---
export const ComplianceReport = () => {
  const data = [
    { name: 'Structural', score: 82, fill: '#10b981' }, // emerald-500
    { name: 'Inspection', score: 74, fill: '#3b82f6' }, // blue-500
    { name: 'Safety', score: 80, fill: '#f59e0b' },     // amber-500
  ];

  const pieData = [
    { name: 'Compliant', value: 78, color: '#22c55e' },
    { name: 'Non-Compliant', value: 22, color: '#e2e8f0' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <h4 className="text-xl font-semibold">Overall Compliance: 78%</h4>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h5 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Category Breakdown</h5>
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="font-medium text-lg">{item.name}</span>
                <div className="flex items-center gap-4 flex-1 justify-end">
                   <div className="w-32 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ width: `${item.score}%`, backgroundColor: item.fill }} 
                      />
                   </div>
                   <span className="font-bold w-8 text-right">{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-[200px] flex items-center justify-center relative">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-3xl font-bold text-gray-900">78%</span>
             <span className="text-xs text-gray-500 uppercase tracking-wider">Score</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. Visual Inspection Report ---
export const VisualInspectionReport = () => {
  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-700">Item</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 font-semibold text-gray-700 text-right">Severity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <tr>
            <td className="px-4 py-3 font-medium">Column 1</td>
            <td className="px-4 py-3 text-red-600 font-medium">Fail</td>
            <td className="px-4 py-3 text-right text-red-600 font-bold">High</td>
          </tr>
          <tr className="bg-gray-50/50">
            <td className="px-4 py-3 font-medium">Beam 4</td>
            <td className="px-4 py-3 text-green-600 font-medium">Pass</td>
            <td className="px-4 py-3 text-right text-gray-400">-</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium">Baseplate 2</td>
            <td className="px-4 py-3 text-red-600 font-medium">Fail</td>
            <td className="px-4 py-3 text-right text-orange-500 font-bold">Medium</td>
          </tr>
          <tr className="bg-gray-50/50">
            <td className="px-4 py-3 font-medium">Row Spacer A</td>
            <td className="px-4 py-3 text-green-600 font-medium">Pass</td>
            <td className="px-4 py-3 text-right text-gray-400">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// --- 5. Photo Gallery Report ---
export const PhotoGalleryReport = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="aspect-video bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
           <div className="flex flex-col items-center gap-2 text-gray-400">
             <ImageIcon className="h-8 w-8" />
             <span className="text-xs font-medium">Site Photo {i}</span>
           </div>
        </div>
      ))}
    </div>
  );
};

// --- Generic Findings Log Report ---
export const FindingsLogReport = () => {
    return (
        <div className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
             <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                    <tr>
                        <th className="px-4 py-3 font-medium">ID</th>
                        <th className="px-4 py-3 font-medium">Issue Description</th>
                        <th className="px-4 py-3 font-medium text-right">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    <tr>
                        <td className="px-4 py-3 font-mono text-gray-500">F-101</td>
                        <td className="px-4 py-3">Anchor Misalignment at Row 3</td>
                        <td className="px-4 py-3 text-right"><span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 text-xs font-medium">Open</span></td>
                    </tr>
                    <tr>
                        <td className="px-4 py-3 font-mono text-gray-500">F-102</td>
                        <td className="px-4 py-3">Corrosion Level 2 on Baseplate</td>
                        <td className="px-4 py-3 text-right"><span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded border border-gray-200 text-xs font-medium">Closed</span></td>
                    </tr>
                </tbody>
             </table>
        </div>
    )
}

// --- Main Report Module Renderer ---
export const ReportModuleRenderer = ({ module }: { module: any }) => {
  const { type, tag, name } = module;
  
  if (name.includes('Key Risks') || tag === 'Risks') return <KeyRisksReport />;
  if (name.includes('Compliance') || tag === 'Visual' && type === 'Chart') return <ComplianceReport />;
  if (name.includes('Visual Inspection') || tag === 'Inspection') return <VisualInspectionReport />;
  if (name.includes('Photo') || tag === 'Media') return <PhotoGalleryReport />;
  if (name.includes('Findings') || tag === 'Data') return <FindingsLogReport />;
  
  // Default to Executive Summary style for text/others
  return <ExecutiveSummaryReport />;
};
