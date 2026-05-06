import { create } from 'zustand';
import { Report } from '../services/reportService';

interface ReportStore {
  reports: Report[];
  setReports: (reports: Report[]) => void;
  addReport: (report: Report) => void;
  updateReport: (id: string, updates: Partial<Report>) => void;
  deleteReport: (id: string) => void;
}

export const useReportStore = create<ReportStore>((set) => ({
  reports: [],
  setReports: (reports) => set({ reports }),
  addReport: (report) => set((state) => ({ 
    reports: [report, ...state.reports] 
  })),
  updateReport: (id, updates) => set((state) => ({
    reports: state.reports.map((r) => 
      r.id === id ? { ...r, ...updates } : r
    ),
  })),
  deleteReport: (id) => set((state) => ({
    reports: state.reports.filter((r) => r.id !== id),
  })),
}));
