import { create } from 'zustand';
import { ReportTemplate } from '../services/reportService';

interface TemplateStore {
  templates: ReportTemplate[];
  setTemplates: (templates: ReportTemplate[]) => void;
  addTemplate: (template: ReportTemplate) => void;
  updateTemplate: (id: string, updates: Partial<ReportTemplate>) => void;
  deleteTemplate: (id: string) => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  setTemplates: (templates) => set({ templates }),
  addTemplate: (template) => set((state) => ({ 
    templates: [template, ...state.templates] 
  })),
  updateTemplate: (id, updates) => set((state) => ({
    templates: state.templates.map((t) => 
      t.id === id ? { ...t, ...updates } : t
    ),
  })),
  deleteTemplate: (id) => set((state) => ({
    templates: state.templates.filter((t) => t.id !== id),
  })),
}));
