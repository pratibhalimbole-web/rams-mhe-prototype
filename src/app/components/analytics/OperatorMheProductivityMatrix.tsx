import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { TrendingUp, Activity, Award, User, Target, CheckCircle2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -- Interfaces --

interface Operator {
  id: string;
  name: string;
}

interface Mhe {
  id: string;
  name: string;
}

interface MatrixScore {
  operator_id: string;
  mhe_id: string;
  score: number | null; // null if no pairing data
}

interface ProcessedCell extends MatrixScore {
  operator_name: string;
  mhe_name: string;
  global_rank: number;
  is_top_5: boolean;
  operator_avg: number;
  mhe_avg: number;
}

// -- Dummy Data Generation --
const MOCK_OPERATORS: Operator[] = [
  { id: "op1", name: "J. Smith" },
  { id: "op2", name: "M. Johnson" },
  { id: "op3", name: "S. Williams" },
  { id: "op4", name: "D. Brown" },
  { id: "op5", name: "P. Jones" },
  { id: "op6", name: "R. Garcia" },
  { id: "op7", name: "L. Miller" },
  { id: "op8", name: "T. Davis" },
  { id: "op9", name: "C. Martinez" },
  { id: "op10", name: "E. Wilson" },
];

const MOCK_MHES: Mhe[] = [
  { id: "mhe1", name: "FL-001" },
  { id: "mhe2", name: "FL-002" },
  { id: "mhe3", name: "PT-015" },
  { id: "mhe4", name: "PT-016" },
  { id: "mhe5", name: "RC-005" },
  { id: "mhe6", name: "RC-006" },
];

const generateScores = (): MatrixScore[] => {
  const scores: MatrixScore[] = [];
  MOCK_MHES.forEach((mhe) => {
    MOCK_OPERATORS.forEach((op) => {
      // 10% chance of no data
      if (Math.random() < 0.1) {
        scores.push({ operator_id: op.id, mhe_id: mhe.id, score: null });
        return;
      }
      
      // Randomize scores but give some operators/MHEs natural advantages
      let base = 80;
      if (op.id === "op3" || op.id === "op8") base += 10;
      if (op.id === "op5") base -= 8;
      if (mhe.id === "mhe2") base += 5;
      
      let randomFactor = Math.floor(Math.random() * 15) - 5;
      let finalScore = Math.min(100, Math.max(65, base + randomFactor));
      
      scores.push({ operator_id: op.id, mhe_id: mhe.id, score: finalScore });
    });
  });
  return scores;
};

const MOCK_SCORES = generateScores();

// -- Color Scale Logic --
/*
Red #E5533D → <75
Orange #F59E0B → 75–79
Yellow #FACC15 → 80–84
Light Green #84CC16 → 85–89
Green #22C55E → 90–94
Dark Green #15803D → 95+
*/
function getScoreColor(score: number | null): { bg: string; text: string; bgHover: string } {
  if (score === null) return { bg: "bg-[var(--muted)]", text: "text-[var(--muted-foreground)]", bgHover: "hover:bg-[var(--muted)]/80" };
  
  if (score < 75) return { bg: "bg-[#E5533D]", text: "text-white", bgHover: "hover:bg-[#E5533D]/90" };
  if (score < 80) return { bg: "bg-[#F59E0B]", text: "text-white", bgHover: "hover:bg-[#F59E0B]/90" };
  if (score < 85) return { bg: "bg-[#FACC15]", text: "text-[#1F2937]", bgHover: "hover:bg-[#FACC15]/90" };
  if (score < 90) return { bg: "bg-[#84CC16]", text: "text-[#1F2937]", bgHover: "hover:bg-[#84CC16]/90" };
  if (score < 95) return { bg: "bg-[#22C55E]", text: "text-white", bgHover: "hover:bg-[#22C55E]/90" };
  return { bg: "bg-[#15803D]", text: "text-white", bgHover: "hover:bg-[#15803D]/90" };
}

export function OperatorMheProductivityMatrix() {
  const [selectedCell, setSelectedCell] = useState<ProcessedCell | null>(null);

  // Compute Averages and Ranks
  const processedData = useMemo(() => {
    // Averages maps
    const opScores: Record<string, number[]> = {};
    const mheScores: Record<string, number[]> = {};
    
    MOCK_OPERATORS.forEach(op => opScores[op.id] = []);
    MOCK_MHES.forEach(mhe => mheScores[mhe.id] = []);

    MOCK_SCORES.forEach(s => {
      if (s.score !== null) {
        opScores[s.operator_id].push(s.score);
        mheScores[s.mhe_id].push(s.score);
      }
    });

    const opAvgs: Record<string, number> = {};
    const mheAvgs: Record<string, number> = {};

    Object.entries(opScores).forEach(([id, scores]) => {
      opAvgs[id] = scores.length ? Math.round(scores.reduce((a,b) => a+b,0)/scores.length) : 0;
    });
    Object.entries(mheScores).forEach(([id, scores]) => {
      mheAvgs[id] = scores.length ? Math.round(scores.reduce((a,b) => a+b,0)/scores.length) : 0;
    });

    // Valid scores for ranking
    const validScores = [...MOCK_SCORES].filter(s => s.score !== null).sort((a,b) => (b.score as number) - (a.score as number));
    // Determine top 5 threshold
    const top5Threshold = validScores[Math.min(4, validScores.length - 1)]?.score || 100;

    const data: ProcessedCell[] = MOCK_SCORES.map(s => {
      const isTop5 = s.score !== null && s.score >= top5Threshold;
      const rank = s.score === null ? -1 : validScores.findIndex(v => v.score === s.score) + 1;
      
      return {
        ...s,
        operator_name: MOCK_OPERATORS.find(o => o.id === s.operator_id)?.name || "",
        mhe_name: MOCK_MHES.find(m => m.id === s.mhe_id)?.name || "",
        operator_avg: opAvgs[s.operator_id],
        mhe_avg: mheAvgs[s.mhe_id],
        global_rank: rank,
        is_top_5: isTop5
      };
    });

    return { cells: data, opAvgs, mheAvgs };
  }, []);

  const getCell = (opId: string, mheId: string) => processedData.cells.find(c => c.operator_id === opId && c.mhe_id === mheId);

  // MHE Max/Min to highlight rows
  const mheMinMax = useMemo(() => {
    const res: Record<string, { max: number, min: number }> = {};
    MOCK_MHES.forEach(mhe => {
      const scores = processedData.cells.filter(c => c.mhe_id === mhe.id && c.score !== null).map(c => c.score as number);
      if (scores.length) {
        res[mhe.id] = { max: Math.max(...scores), min: Math.min(...scores) };
      }
    });
    return res;
  }, [processedData]);

  if (!MOCK_SCORES || MOCK_SCORES.length === 0) {
    return (
      <div className="flex flex-col h-full w-full gap-6">
        <Card className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
          <div className="w-20 h-20 bg-[var(--secondary)] rounded-full flex items-center justify-center mb-4">
            <Activity className="w-10 h-10 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="text-[var(--text-xl)] font-[var(--font-weight-semi-bold)] mb-2 text-[var(--foreground)]">No productivity data available</h3>
          <p className="text-[var(--text-base)] text-[var(--muted-foreground)] max-w-md">
            Run tasks with operators and MHE machines to generate pairing insights.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full gap-6">
      {/* Header Section */}
      <Card className="flex-shrink-0 w-full overflow-hidden border-[var(--border)] shadow-sm bg-[var(--card)] rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 pb-2 gap-4">
          <div>
            <h2 className="text-[var(--text-xl)] font-[var(--font-weight-semi-bold)] text-[var(--card-foreground)]">Operator ↔ MHE Pairing Productivity Matrix</h2>
            <p className="text-[var(--text-sm)] font-[var(--font-weight-normal)] text-[var(--muted-foreground)] mt-1">Optimal Combination Analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue="7d">
              <SelectTrigger className="w-[130px] bg-[var(--input-background)]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px] bg-[var(--input-background)]">
                <SelectValue placeholder="Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shifts</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="wh1">
              <SelectTrigger className="w-[140px] bg-[var(--input-background)]">
                <SelectValue placeholder="Warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wh1">Main DC - North</SelectItem>
                <SelectItem value="wh2">Annex - South</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6 pt-4 flex flex-wrap justify-between items-end gap-4">
          {/* Legend */}
          <div className="flex flex-col gap-2">
            <span className="text-[var(--text-xs)] font-[var(--font-weight-semi-bold)] text-[var(--muted-foreground)] uppercase tracking-wider">Productivity Score (%)</span>
            <div className="flex items-center gap-1 text-[11px] font-[var(--font-weight-medium)]">
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#E5533D]"></div>&lt;75</div>
              <div className="w-2 h-px bg-[var(--border)] mx-1" />
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#F59E0B]"></div>75-79</div>
              <div className="w-2 h-px bg-[var(--border)] mx-1" />
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#FACC15]"></div>80-84</div>
              <div className="w-2 h-px bg-[var(--border)] mx-1" />
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#84CC16]"></div>85-89</div>
              <div className="w-2 h-px bg-[var(--border)] mx-1" />
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#22C55E]"></div>90-94</div>
              <div className="w-2 h-px bg-[var(--border)] mx-1" />
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm bg-[#15803D]"></div>95+</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Matrix Area */}
      <Card className="flex-1 min-h-[400px] flex flex-col overflow-hidden border-[var(--border)] shadow-sm bg-[var(--card)] rounded-lg">
        <div className="flex-1 overflow-auto relative bg-[var(--card)]">
          <TooltipProvider delayDuration={200}>
            <table className="w-full border-collapse border-spacing-0">
              <thead>
                <tr>
                  {/* Top-Left Corner (Empty/Frozen) */}
                  <th className="sticky top-0 left-0 z-30 bg-[var(--card)] border-b border-r border-[var(--border)] p-4 min-w-[140px] max-w-[140px]">
                    <div className="text-left text-[var(--text-sm)] font-[var(--font-weight-semi-bold)] text-[var(--muted-foreground)]">Machine \ Operator</div>
                  </th>
                  {/* Operator Headers (Top Frozen) */}
                  {MOCK_OPERATORS.map(op => (
                    <th key={op.id} className="sticky top-0 z-20 bg-[var(--card)] border-b border-r border-[var(--border)] p-3 min-w-[106px] max-w-[106px]">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-[var(--secondary)] flex items-center justify-center">
                          <User className="w-4 h-4 text-[var(--secondary-foreground)]" />
                        </div>
                        <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--foreground)] truncate w-full text-center">{op.name}</span>
                      </div>
                    </th>
                  ))}
                  {/* Row Avg Header (Top Right Frozen) */}
                  <th className="sticky top-0 right-0 z-20 bg-[var(--secondary)] border-b border-l border-[var(--border)] p-3 min-w-[90px] max-w-[90px] shadow-[-2px_0_4px_rgba(0,0,0,0.02)]">
                    <span className="text-[var(--text-sm)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Row Avg</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_MHES.map(mhe => (
                  <tr key={mhe.id}>
                    {/* MHE Header (Left Frozen) */}
                    <td className="sticky left-0 z-10 bg-[var(--card)] border-b border-r border-[var(--border)] p-3 min-w-[140px] max-w-[140px] shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-[var(--accent)] text-[var(--accent-foreground)]">
                          <Target className="w-4 h-4" />
                        </div>
                        <span className="text-[var(--text-sm)] font-[var(--font-weight-medium)] text-[var(--foreground)]">{mhe.name}</span>
                      </div>
                    </td>
                    
                    {/* Heatmap Cells */}
                    {MOCK_OPERATORS.map(op => {
                      const cell = getCell(op.id, mhe.id);
                      if (!cell) return <td key={op.id} className="border-b border-r border-[var(--border)] p-2"></td>;

                      const { bg, text, bgHover } = getScoreColor(cell.score);
                      const isMax = mheMinMax[mhe.id]?.max === cell.score && cell.score !== null;
                      const isMin = mheMinMax[mhe.id]?.min === cell.score && cell.score !== null;
                      
                      return (
                        <td key={op.id} className="border-b border-r border-[var(--border)] p-2 relative group min-w-[106px] max-w-[106px] h-[88px]">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setSelectedCell(cell)}
                                className={cn(
                                  "w-full h-full min-h-[72px] rounded-md flex items-center justify-center transition-all duration-200 cursor-pointer border-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                  bg, text, bgHover,
                                  cell.is_top_5 ? "border-[#FBBF24] shadow-[0_0_8px_rgba(251,191,36,0.6)] z-10" :
                                  isMax ? "border-[#22C55E] z-10" :
                                  isMin ? "border-[#EF4444] z-10" :
                                  "border-transparent"
                                )}
                              >
                                {cell.score !== null ? (
                                  <span className="text-[var(--text-base)] font-[var(--font-weight-semi-bold)]">{cell.score}%</span>
                                ) : (
                                  <span className="text-[var(--text-xs)]">N/A</span>
                                )}
                                {cell.is_top_5 && (
                                  <div className="absolute -top-2 -right-2 bg-[#FBBF24] text-white p-1 rounded-full shadow-md">
                                    <Award className="w-3 h-3" />
                                  </div>
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center" className="bg-[var(--popover)] text-[var(--popover-foreground)] border border-[var(--border)] shadow-lg p-3 w-56">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center border-b border-[var(--border)] pb-2 mb-1">
                                  <span className="font-[var(--font-weight-semi-bold)] text-[var(--text-sm)]">Productivity</span>
                                  <span className={cn("px-2 py-0.5 rounded text-[var(--text-xs)] font-[var(--font-weight-bold)]", bg, text)}>
                                    {cell.score !== null ? `${cell.score}%` : 'N/A'}
                                  </span>
                                </div>
                                {cell.is_top_5 && (
                                  <div className="flex items-center gap-1.5 text-[#F59E0B] bg-[#FEF3C7] px-2 py-1 rounded-sm mb-2 text-[var(--text-xs)] font-[var(--font-weight-semi-bold)]">
                                    <Award className="w-3 h-3" /> Top Performance Pair
                                  </div>
                                )}
                                <div className="grid grid-cols-2 gap-y-1 text-[var(--text-xs)]">
                                  <span className="text-[var(--muted-foreground)]">Operator:</span>
                                  <span className="font-[var(--font-weight-medium)] text-right">{cell.operator_name}</span>
                                  
                                  <span className="text-[var(--muted-foreground)]">MHE:</span>
                                  <span className="font-[var(--font-weight-medium)] text-right">{cell.mhe_name}</span>
                                  
                                  {cell.score !== null && (
                                    <>
                                      <span className="text-[var(--muted-foreground)] mt-2">Global Rank:</span>
                                      <span className="font-[var(--font-weight-bold)] text-right mt-2 text-[var(--primary)]">#{cell.global_rank}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      );
                    })}
                    
                    {/* Row Avg (Right Column) */}
                    <td className="sticky right-0 z-10 bg-[var(--secondary)] border-b border-l border-[var(--border)] p-3 min-w-[90px] max-w-[90px] shadow-[-2px_0_4px_rgba(0,0,0,0.02)]">
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
                          {processedData.mheAvgs[mhe.id]}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {/* Column Insight Row (Bottom) */}
                <tr>
                  <td className="sticky left-0 z-10 bg-[var(--muted)] border-r border-[var(--border)] p-4 min-w-[140px] max-w-[140px] shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                    <span className="text-[var(--text-sm)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">Operator Avg</span>
                  </td>
                  {MOCK_OPERATORS.map(op => (
                    <td key={op.id} className="bg-[var(--muted)] border-r border-[var(--border)] p-3 min-w-[106px] max-w-[106px]">
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">
                          {processedData.opAvgs[op.id]}%
                        </span>
                      </div>
                    </td>
                  ))}
                  <td className="sticky right-0 z-10 bg-[var(--secondary)] border-l border-[var(--border)] p-3 min-w-[90px] max-w-[90px] shadow-[-2px_0_4px_rgba(0,0,0,0.02)]">
                    <div className="flex h-full items-center justify-center">
                       <span className="text-[var(--text-base)] font-[var(--font-weight-extra-bold)] text-[var(--foreground)]">
                        {Math.round(MOCK_SCORES.reduce((a,b) => a+(b.score||0),0)/MOCK_SCORES.filter(s=>s.score!==null).length)}%
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </TooltipProvider>
        </div>
      </Card>

      {/* Right Drawer (Sheet) for Interaction Panel */}
      <Sheet open={!!selectedCell} onOpenChange={(open) => !open && setSelectedCell(null)}>
        <SheetContent className="sm:max-w-[420px] p-0 flex flex-col bg-[var(--background)] border-l-[var(--border)]">
          {selectedCell && (
            <>
              <SheetHeader className="p-6 border-b border-[var(--border)] bg-[var(--card)]">
                <SheetTitle className="text-[var(--text-xl)] font-[var(--font-weight-bold)] text-[var(--foreground)]">Operator–MHE Details</SheetTitle>
              </SheetHeader>
              
              <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-8">
                {/* Top Metrics Box */}
                <div className={cn(
                  "p-6 rounded-xl flex flex-col items-center text-center shadow-sm relative overflow-hidden",
                  getScoreColor(selectedCell.score).bg
                )}>
                  {selectedCell.is_top_5 && (
                    <div className="absolute top-3 right-3 bg-[#FBBF24] text-white p-1.5 rounded-full">
                      <Award className="w-5 h-5" />
                    </div>
                  )}
                  <div className={cn("text-5xl font-[var(--font-weight-extra-bold)]", getScoreColor(selectedCell.score).text)}>
                    {selectedCell.score !== null ? `${selectedCell.score}%` : 'N/A'}
                  </div>
                  <div className={cn("mt-2 text-[var(--text-sm)] font-[var(--font-weight-medium)] opacity-90", getScoreColor(selectedCell.score).text)}>
                    Productivity Score
                  </div>
                </div>

                {/* Entity Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[var(--secondary)] p-4 rounded-lg flex flex-col gap-1 border border-[var(--border)]">
                    <User className="w-5 h-5 text-[var(--muted-foreground)] mb-1" />
                    <span className="text-[var(--text-xs)] font-[var(--font-weight-medium)] text-[var(--muted-foreground)] uppercase tracking-wider">Operator</span>
                    <span className="text-[var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">{selectedCell.operator_name}</span>
                  </div>
                  <div className="bg-[var(--secondary)] p-4 rounded-lg flex flex-col gap-1 border border-[var(--border)]">
                    <Target className="w-5 h-5 text-[var(--muted-foreground)] mb-1" />
                    <span className="text-[var(--text-xs)] font-[var(--font-weight-medium)] text-[var(--muted-foreground)] uppercase tracking-wider">MHE Machine</span>
                    <span className="text-[var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)]">{selectedCell.mhe_name}</span>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-[var(--text-base)] font-[var(--font-weight-semi-bold)] text-[var(--foreground)] border-b border-[var(--border)] pb-2">Performance Metrics</h4>
                  
                  <div className="grid grid-cols-[1fr_auto] gap-y-4 text-[var(--text-sm)]">
                    <span className="flex items-center gap-2 text-[var(--muted-foreground)] font-[var(--font-weight-medium)]">
                      <Activity className="w-4 h-4 text-[var(--primary)]" />
                      Operator Avg Productivity
                    </span>
                    <span className="font-[var(--font-weight-bold)] text-[var(--foreground)]">{selectedCell.operator_avg}%</span>

                    <span className="flex items-center gap-2 text-[var(--muted-foreground)] font-[var(--font-weight-medium)]">
                      <Activity className="w-4 h-4 text-[#8B5CF6]" />
                      MHE Avg Productivity
                    </span>
                    <span className="font-[var(--font-weight-bold)] text-[var(--foreground)]">{selectedCell.mhe_avg}%</span>

                    <span className="flex items-center gap-2 text-[var(--muted-foreground)] font-[var(--font-weight-medium)]">
                      <TrendingUp className="w-4 h-4 text-[#10B981]" />
                      Shift Performance Trend
                    </span>
                    <span className="font-[var(--font-weight-bold)] text-[#10B981] flex items-center gap-1">+4.2%</span>
                    
                    <span className="flex items-center gap-2 text-[var(--muted-foreground)] font-[var(--font-weight-medium)]">
                      <CheckCircle2 className="w-4 h-4 text-[var(--muted-foreground)]" />
                      Total Tasks Completed
                    </span>
                    <span className="font-[var(--font-weight-bold)] text-[var(--foreground)]">
                      {selectedCell.score !== null ? Math.floor(selectedCell.score * 1.5) : 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-[var(--border)] bg-[var(--card)] mt-auto">
                <Button className="w-full h-12 text-[var(--text-base)] font-[var(--font-weight-semi-bold)] shadow-sm">
                  Recommend Assignment
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
