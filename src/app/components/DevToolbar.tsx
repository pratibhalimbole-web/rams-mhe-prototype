/**
 * DevToolbar — Copy to Figma (Plugin Console Script)
 *
 * Only mounts in development.
 *
 * HOW IT WORKS:
 *  1. Click "Copy to Figma" → select a widget or dashboard
 *  2. Click "Copy Script" — the editable-layers script is on your clipboard
 *  3. Open Figma Desktop → top menu: Plugins → Development → Open Console
 *  4. Paste the script (Ctrl+V / Cmd+V) → press Enter
 *  5. Editable frames, auto-layout, and text layers appear on the canvas
 *
 * The script runs INSIDE the Figma app (no API key / seat needed).
 * "Copy as Image" is available as a fallback for quick visual reference.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { Code2, Crosshair, ChevronDown, ChevronUp, X, Camera, Layout, Square } from "lucide-react";
import { toast } from "sonner";

// ─────────────────────────────────────────────────────────────────────────────
// Screenshot fallback (image → paste in Figma)
// ─────────────────────────────────────────────────────────────────────────────

async function screenshotToClipboard(el: Element): Promise<void> {
  const canvas = await html2canvas(el as HTMLElement, {
    scale: 2, useCORS: true, backgroundColor: null, logging: false,
  });
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) { reject(new Error("blob failed")); return; }
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        resolve();
      } catch (e) { reject(e); }
    }, "image/png");
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Font + color helpers
// ─────────────────────────────────────────────────────────────────────────────

const WEIGHT_MAP: Record<number, string> = {
  100: "Thin", 200: "Extra Light", 300: "Light", 400: "Regular",
  500: "Medium", 600: "Semi Bold", 700: "Bold", 800: "Extra Bold", 900: "Black",
};
function weightToFigma(w: number) {
  return WEIGHT_MAP[Math.round(w / 100) * 100] ?? "Regular";
}
function fontFamily(css: string) {
  return css.split(",")[0].replace(/['"]/g, "").trim() || "Inter";
}

interface RGBA { r: number; g: number; b: number; a: number }
function parseCss(css: string): RGBA | null {
  if (!css || css === "transparent") return null;
  const m = css.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/);
  if (!m) return null;
  return { r: +(+m[1] / 255).toFixed(4), g: +(+m[2] / 255).toFixed(4), b: +(+m[3] / 255).toFixed(4), a: m[4] !== undefined ? +m[4] : 1 };
}
function clear(c: RGBA | null) { return !c || c.a < 0.01; }
function fill(c: RGBA) { return `[{type:"SOLID",color:{r:${c.r},g:${c.g},b:${c.b}},opacity:${c.a}}]`; }

// ─────────────────────────────────────────────────────────────────────────────
// Script builder
// ─────────────────────────────────────────────────────────────────────────────

class Builder {
  lines: string[] = []; fonts = new Map<string, { family: string; style: string }>(); idx = 0;
  v() { return `n${this.idx++}`; }
  font(family: string, style: string) { const k = `${family}::${style}`; if (!this.fonts.has(k)) this.fonts.set(k, { family, style }); }
  ln(s: string) { this.lines.push("  " + s); }
  script(root: string) {
    const fonts = [...this.fonts.values()]
      .map(f => `    figma.loadFontAsync({family:${JSON.stringify(f.family)},style:${JSON.stringify(f.style)}})`)
      .join(",\n");
    return `/* ── RAMS MHE DevToolbar ── */
/* HOW TO USE: Plugins → Development → Open Console → paste this → Enter */
(async () => {
  await Promise.all([\n${fonts || "    Promise.resolve()"}\n  ]);
  const fill=(r,g,b,a=1)=>[{type:"SOLID",color:{r,g,b},opacity:a}];
  const C=figma.viewport.center;
${this.lines.join("\n")}
  ${root}.x=C.x-${root}.width/2; ${root}.y=C.y-${root}.height/2;
  figma.currentPage.appendChild(${root});
  figma.viewport.scrollAndZoomIntoView([${root}]);
  figma.currentPage.selection=[${root}];
  console.log("✅ Created:",${root}.name,${root}.width+"×"+${root}.height);
})();`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DOM walker → Figma script
// ─────────────────────────────────────────────────────────────────────────────

const SKIP = new Set(["SCRIPT","STYLE","NOSCRIPT","META","HEAD"]);
const TEXT_ELS = new Set(["P","SPAN","H1","H2","H3","H4","H5","H6","LABEL","A",
  "BUTTON","LI","TD","TH","CAPTION","STRONG","EM","SMALL","B","I","U","CODE"]);

function walk(el: Element, pRect: DOMRect, b: Builder, parent: string|null, parentFlex: boolean, depth: number): string|null {
  if (depth > 15) return null;
  if (SKIP.has(el.tagName)) return null;
  if ((el as HTMLElement).dataset?.devSkip) return null;
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.01) return null;
  if (rect.width < 2 || rect.height < 2) return null;

  const W = Math.round(rect.width), H = Math.round(rect.height);
  const X = Math.round(rect.left - pRect.left), Y = Math.round(rect.top - pRect.top);
  const name = (el as HTMLElement).dataset.devName || el.getAttribute("aria-label") || el.tagName.toLowerCase();
  const v = b.v();

  // SVG → placeholder rect (no recursion into SVG internals)
  if (el.tagName === "svg" || el.tagName === "SVG") {
    b.ln(`const ${v}=figma.createRectangle();`);
    b.ln(`${v}.name="chart"; ${v}.resize(${Math.max(W,12)},${Math.max(H,12)});`);
    const fc = parseCss(cs.color);
    if (fc && !clear(fc)) b.ln(`${v}.fills=fill(${fc.r},${fc.g},${fc.b},0.1);`);
    else b.ln(`${v}.fills=fill(0.55,0.6,0.65,0.1);`);
    b.ln(`${v}.cornerRadius=4;`);
    if (parent) { b.ln(`${parent}.appendChild(${v});`); if (!parentFlex) b.ln(`${v}.x=${X};${v}.y=${Y};`); }
    return v;
  }
  // Skip inside SVG
  if (el.closest("svg")) return null;
  // IMG
  if (el.tagName === "IMG") {
    b.ln(`const ${v}=figma.createRectangle();`);
    b.ln(`${v}.name=${JSON.stringify(el.getAttribute("alt")||"image")};`);
    b.ln(`${v}.resize(${W},${H}); ${v}.fills=fill(0.88,0.91,0.95);`);
    if (parent) { b.ln(`${parent}.appendChild(${v});`); if (!parentFlex) b.ln(`${v}.x=${X};${v}.y=${Y};`); }
    return v;
  }

  // Text leaf
  const leafText = el.childElementCount === 0 ? (el.textContent ?? "").replace(/\s+/g, " ").trim() : "";
  if (TEXT_ELS.has(el.tagName) && leafText && leafText.length < 300) {
    const fam = fontFamily(cs.fontFamily);
    const sty = weightToFigma(parseInt(cs.fontWeight,10)||400);
    b.font(fam, sty);
    const col = parseCss(cs.color) ?? { r:0,g:0,b:0,a:1 };
    const align = cs.textAlign==="center"?"CENTER":cs.textAlign==="right"?"RIGHT":"LEFT";
    const ls = parseFloat(cs.letterSpacing)||0;
    const lhRaw = cs.lineHeight; const lhPx = lhRaw==="normal"?null:parseFloat(lhRaw);
    b.ln(`const ${v}=figma.createText();`);
    b.ln(`${v}.name=${JSON.stringify(leafText.slice(0,40))};`);
    b.ln(`${v}.fontName={family:${JSON.stringify(fam)},style:${JSON.stringify(sty)}};`);
    b.ln(`${v}.characters=${JSON.stringify(leafText)};`);
    b.ln(`${v}.fontSize=${parseFloat(cs.fontSize)||14};`);
    b.ln(`${v}.textAlignHorizontal="${align}"; ${v}.fills=${fill(col)};`);
    if (ls) b.ln(`${v}.letterSpacing={unit:"PIXELS",value:${ls}};`);
    if (lhPx) b.ln(`${v}.lineHeight={unit:"PIXELS",value:${lhPx}};`);
    if (parent) { b.ln(`${parent}.appendChild(${v});`); if (!parentFlex) b.ln(`${v}.x=${X};${v}.y=${Y};`); }
    return v;
  }

  // Container → Frame
  const bg = parseCss(cs.backgroundColor);
  const bc = parseCss(cs.borderColor);
  const bw = parseFloat(cs.borderWidth)||0;
  const cr = parseFloat(cs.borderRadius)||0;
  const pt=parseFloat(cs.paddingTop)||0, pb=parseFloat(cs.paddingBottom)||0;
  const pl=parseFloat(cs.paddingLeft)||0, pr=parseFloat(cs.paddingRight)||0;
  const isFlex = cs.display==="flex"||cs.display==="inline-flex";
  const isCol = isFlex && (cs.flexDirection==="column"||cs.flexDirection==="column-reverse");
  const gap = isFlex ? (parseFloat(cs.gap)||parseFloat(cs.rowGap)||parseFloat(cs.columnGap)||0) : 0;

  b.ln(`const ${v}=figma.createFrame();`);
  b.ln(`${v}.name=${JSON.stringify(name)}; ${v}.resize(${W},${H});`);
  if (!clear(bg)) b.ln(`${v}.fills=${fill(bg!)};`);
  else b.ln(`${v}.fills=[];`);
  if (cr>0) b.ln(`${v}.cornerRadius=${Math.round(cr)};`);
  if (bw>0 && !clear(bc)) { b.ln(`${v}.strokes=${fill(bc!)};`); b.ln(`${v}.strokeWeight=${bw}; ${v}.strokeAlign="INSIDE";`); }
  if (isFlex) {
    b.ln(`${v}.layoutMode="${isCol?"VERTICAL":"HORIZONTAL"}";`);
    b.ln(`${v}.primaryAxisSizingMode="FIXED"; ${v}.counterAxisSizingMode="FIXED";`);
    if (gap) b.ln(`${v}.itemSpacing=${Math.round(gap)};`);
    if (pt) b.ln(`${v}.paddingTop=${Math.round(pt)};`);
    if (pb) b.ln(`${v}.paddingBottom=${Math.round(pb)};`);
    if (pl) b.ln(`${v}.paddingLeft=${Math.round(pl)};`);
    if (pr) b.ln(`${v}.paddingRight=${Math.round(pr)};`);
    const jc = cs.justifyContent;
    if (jc==="center") b.ln(`${v}.primaryAxisAlignItems="CENTER";`);
    else if (jc==="flex-end"||jc==="end") b.ln(`${v}.primaryAxisAlignItems="MAX";`);
    else if (jc==="space-between") b.ln(`${v}.primaryAxisAlignItems="SPACE_BETWEEN";`);
    const ai = cs.alignItems;
    if (ai==="center") b.ln(`${v}.counterAxisAlignItems="CENTER";`);
    else if (ai==="flex-end"||ai==="end") b.ln(`${v}.counterAxisAlignItems="MAX";`);
  } else {
    b.ln(`${v}.layoutMode="NONE";`);
  }
  if (cs.overflow==="hidden") b.ln(`${v}.clipsContent=true;`);
  if (cs.boxShadow && cs.boxShadow!=="none") b.ln(`${v}.effects=[{type:"DROP_SHADOW",color:{r:0,g:0,b:0,a:0.1},offset:{x:0,y:2},radius:8,visible:true,blendMode:"NORMAL"}];`);
  const op=parseFloat(cs.opacity);
  if (!isNaN(op) && op<1) b.ln(`${v}.opacity=${op};`);
  if (!parentFlex && parent) b.ln(`${v}.x=${X};${v}.y=${Y};`);

  const childRect = el.getBoundingClientRect();
  for (const child of Array.from(el.children)) {
    const cr2 = child.getBoundingClientRect();
    if (cr2.left < rect.left-10 || cr2.top < rect.top-10) continue;
    walk(child, childRect, b, v, isFlex, depth+1);
  }
  if (parent) b.ln(`${parent}.appendChild(${v});`);
  return v;
}

function generateScript(el: Element): string {
  const b = new Builder();
  const rect = el.getBoundingClientRect();
  const root = walk(el, rect, b, null, false, 0);
  if (!root) return "// Could not parse element.";
  return b.script(root);
}

// ─────────────────────────────────────────────────────────────────────────────
// Ancestor finders
// ─────────────────────────────────────────────────────────────────────────────

function findWidget(el: Element): Element {
  let cur: Element|null = el;
  while (cur && cur !== document.body) {
    const s = getComputedStyle(cur), r = cur.getBoundingClientRect();
    const hasBg = s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor !== "transparent";
    if (hasBg && parseFloat(s.borderRadius) >= 6 && r.width > 120 && r.height > 60) return cur;
    cur = cur.parentElement;
  }
  return el;
}
function findSection(el: Element): Element {
  let cur: Element|null = el;
  while (cur && cur !== document.body) {
    const r = cur.getBoundingClientRect();
    if (r.width > window.innerWidth * 0.6 && cur.children.length >= 2) return cur;
    cur = cur.parentElement;
  }
  return el;
}
function findDashboard(): Element {
  return document.querySelector("[data-dashboard]") || document.querySelector(".flex-col.h-full") || document.querySelector("main") || document.body;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inner toolbar
// ─────────────────────────────────────────────────────────────────────────────

type Level = "widget" | "section" | "dashboard";

function DevToolbarInner() {
  const [open, setOpen]               = useState(false);
  const [selecting, setSelecting]     = useState(false);
  const [level, setLevel]             = useState<Level>("widget");
  const [selectedEl, setSelectedEl]   = useState<Element|null>(null);
  const [selectedRect, setSelectedRect] = useState<DOMRect|null>(null);
  const [selectedName, setSelectedName] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [hoverRect, setHoverRect]     = useState<DOMRect|null>(null);
  const [copied, setCopied]           = useState(false);
  const [capturing, setCapturing]     = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const resolve = useCallback((raw: Element): Element => {
    if (level === "dashboard") return findDashboard();
    if (level === "section")   return findSection(raw);
    return findWidget(raw);
  }, [level]);

  useEffect(() => {
    if (!selecting) { setHoverRect(null); return; }
    const onMove = (e: MouseEvent) => {
      const raw = document.elementFromPoint(e.clientX, e.clientY);
      if (!raw || toolbarRef.current?.contains(raw)) return;
      setHoverRect(resolve(raw).getBoundingClientRect());
    };
    const onClick = (e: MouseEvent) => {
      const raw = document.elementFromPoint(e.clientX, e.clientY);
      if (!raw || toolbarRef.current?.contains(raw)) return;
      e.preventDefault(); e.stopPropagation();
      const target = resolve(raw);
      const r = target.getBoundingClientRect();
      setSelectedEl(target);
      setSelectedRect(r);
      setSelectedName((target as HTMLElement).dataset.devName || target.getAttribute("aria-label") || level);
      setSelectedSize(`${Math.round(r.width)} × ${Math.round(r.height)}`);
      setSelecting(false); setHoverRect(null);
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("click", onClick, true);
    return () => { window.removeEventListener("mousemove", onMove); document.removeEventListener("click", onClick, true); };
  }, [selecting, resolve, level]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") { setSelecting(false); setHoverRect(null); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  useEffect(() => {
    if (!selectedEl) return;
    const upd = () => setSelectedRect(selectedEl.getBoundingClientRect());
    window.addEventListener("scroll", upd, true); window.addEventListener("resize", upd);
    return () => { window.removeEventListener("scroll", upd, true); window.removeEventListener("resize", upd); };
  }, [selectedEl]);

  const clearSelect = () => { setSelectedEl(null); setSelectedRect(null); setSelectedName(""); setSelectedSize(""); };

  const copyScript = async (el?: Element|null) => {
    const target = el ?? selectedEl;
    if (!target) { toast.info("Select a component first — click 'Enter Selection Mode' then click a widget."); return; }
    const script = generateScript(target);
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Clipboard blocked — check browser permissions.");
    }
  };

  const copyImage = async (el?: Element|null) => {
    const target = el ?? selectedEl;
    if (!target) { toast.info("Select a component first."); return; }
    setCapturing(true);
    try {
      await screenshotToClipboard(target);
      toast.success("Screenshot copied — paste in Figma with Ctrl+V", { duration: 4000 });
    } catch {
      toast.error("Screenshot failed — check browser permissions.");
    } finally { setCapturing(false); }
  };

  const BLUE = "#1b59f8";
  const GREEN = "#22c55e";
  const FF = "'Inter', sans-serif";

  return (
    <>
      {/* Hover outline */}
      {selecting && hoverRect && (
        <div style={{ position:"fixed", pointerEvents:"none", zIndex:9997, top:hoverRect.top-2, left:hoverRect.left-2,
          width:hoverRect.width+4, height:hoverRect.height+4, border:"2px dashed #1b59f8",
          background:"rgba(27,89,248,0.06)", borderRadius:6, boxSizing:"border-box", transition:"all 0.05s linear" }} />
      )}
      {/* Selected outline */}
      {!selecting && selectedRect && selectedEl && (
        <div style={{ position:"fixed", pointerEvents:"none", zIndex:9997, top:selectedRect.top-2, left:selectedRect.left-2,
          width:selectedRect.width+4, height:selectedRect.height+4, border:"2px solid #1b59f8",
          background:"rgba(27,89,248,0.04)", borderRadius:6, boxSizing:"border-box" }}>
          <div style={{ position:"absolute", top:-24, left:-1, background:BLUE, color:"#fff", fontFamily:FF,
            fontSize:10, fontWeight:600, padding:"3px 8px", borderRadius:"4px 4px 0 0",
            display:"flex", alignItems:"center", gap:8, whiteSpace:"nowrap" }}>
            <span>{selectedName || level}</span>
            <span style={{ opacity:.65, fontSize:9 }}>{selectedSize}</span>
            <button onClick={clearSelect} style={{ background:"rgba(255,255,255,0.18)", border:"none", borderRadius:3,
              cursor:"pointer", color:"#fff", padding:"0 3px", fontSize:11, pointerEvents:"all" }}>✕</button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div ref={toolbarRef} style={{ position:"fixed", bottom:20, right:20, zIndex:9999, fontFamily:FF }}>

        {open && (
          <div style={{ background:"var(--w-bg)", border:"1px solid var(--w-border)", borderRadius:14,
            padding:"14px 14px 14px", marginBottom:8, width:288, boxShadow:"0 8px 32px rgba(0,0,0,0.28)" }}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:GREEN, boxShadow:`0 0 6px ${GREEN}88` }} />
                <span style={{ fontSize:10, fontWeight:800, color:"var(--w-text-1)", letterSpacing:"0.08em" }}>COPY TO FIGMA</span>
                <span style={{ fontSize:9, color:"var(--w-text-3)", background:"var(--w-bg-muted)", padding:"1px 7px", borderRadius:20, border:"1px solid var(--w-border)" }}>dev</span>
              </div>
              <button onClick={() => setOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--w-text-3)", padding:2 }}>
                <X size={13} />
              </button>
            </div>

            {/* Level selector */}
            <p style={{ fontSize:9, fontWeight:700, color:"var(--w-text-3)", margin:"0 0 5px", letterSpacing:"0.07em" }}>CAPTURE LEVEL</p>
            <div style={{ display:"flex", gap:4, marginBottom:10 }}>
              {(["widget","section","dashboard"] as Level[]).map(l => (
                <button key={l} onClick={() => { setLevel(l); clearSelect(); }}
                  style={{ flex:1, padding:"5px 0", fontFamily:FF, fontSize:9, fontWeight:700, textTransform:"capitalize",
                    borderRadius:6, border:`1px solid ${level===l?BLUE:"var(--w-border)"}`,
                    background:level===l?BLUE:"transparent", color:level===l?"#fff":"var(--w-text-3)", cursor:"pointer" }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Selection mode */}
            <button onClick={() => { setSelecting(s => !s); if (selecting) setHoverRect(null); }}
              style={{ width:"100%", padding:"8px 10px", marginBottom:10, fontFamily:FF,
                borderRadius:8, border:`1px solid ${selecting?BLUE:"var(--w-border)"}`,
                background:selecting?"rgba(27,89,248,0.1)":"var(--w-bg-muted)",
                color:selecting?BLUE:"var(--w-text-1)", fontSize:11, fontWeight:600, cursor:"pointer",
                display:"flex", alignItems:"center", gap:8 }}>
              <Crosshair size={13} />
              <span style={{ flex:1, textAlign:"left" }}>
                {selecting ? "Click a component…" : selectedEl ? `✓  ${selectedName||level}  (${selectedSize})` : "Enter Selection Mode"}
              </span>
              {selecting && <span style={{ fontSize:9, opacity:.55 }}>Esc</span>}
            </button>

            <div style={{ height:1, background:"var(--w-divider)", margin:"0 0 10px" }} />

            {/* ── PRIMARY: Copy Script ── */}
            <button onClick={() => copyScript()}
              style={{ width:"100%", padding:"11px 14px", fontFamily:FF, borderRadius:9,
                border:`1px solid ${copied?GREEN:BLUE}`, background:copied?GREEN:BLUE,
                color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer",
                display:"flex", alignItems:"center", gap:9, marginBottom:10,
                transition:"background 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { if (!copied) (e.currentTarget.style.opacity="0.88"); }}
              onMouseLeave={e => (e.currentTarget.style.opacity="1")}
            >
              <Code2 size={15} />
              <span style={{ flex:1, textAlign:"left" }}>{copied ? "✓ Script copied!" : "Copy Script (Editable)"}</span>
            </button>

            {/* ── STEP-BY-STEP INSTRUCTIONS (always visible) ── */}
            <div style={{ background:"rgba(27,89,248,0.06)", border:"1px solid rgba(27,89,248,0.2)",
              borderRadius:9, padding:"10px 12px", marginBottom:10 }}>
              <p style={{ fontSize:9, fontWeight:800, color:BLUE, margin:"0 0 7px", letterSpacing:"0.07em" }}>
                HOW TO PASTE IN FIGMA
              </p>
              {[
                { n:"1", label:"Copy Script", detail:"Click the button above" },
                { n:"2", label:"Open Console in Figma", detail:'Plugins → Development → Open Console' },
                { n:"3", label:"Paste & press Enter", detail:"Ctrl+V / Cmd+V then Enter" },
              ].map(({ n, label, detail }) => (
                <div key={n} style={{ display:"flex", gap:8, marginBottom:n==="3"?0:6 }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", background:BLUE, color:"#fff",
                    fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                    {n}
                  </div>
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, color:"var(--w-text-1)", lineHeight:1.3 }}>{label}</div>
                    <div style={{ fontSize:9, color:"var(--w-text-3)", lineHeight:1.4 }}>{detail}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid rgba(27,89,248,0.15)",
                fontSize:9, color:"var(--w-text-2)", lineHeight:1.5 }}>
                Editable <strong>frames, auto-layout &amp; text</strong> will appear on the Figma canvas.
                No API key or paid seat required — runs locally.
              </div>
            </div>

            <div style={{ height:1, background:"var(--w-divider)", margin:"0 0 8px" }} />

            {/* Quick actions row */}
            <div style={{ display:"flex", gap:5 }}>
              <button onClick={() => copyScript(findDashboard())}
                style={{ flex:1, padding:"7px 8px", fontFamily:FF, borderRadius:7, border:"1px solid var(--w-border)",
                  background:"transparent", color:"var(--w-text-2)", fontSize:10, fontWeight:500, cursor:"pointer",
                  display:"flex", alignItems:"center", gap:6 }}
                onMouseEnter={e => (e.currentTarget.style.background="var(--w-bg-muted)")}
                onMouseLeave={e => (e.currentTarget.style.background="transparent")}
              >
                <Layout size={11} color="var(--w-text-3)" />
                <span>Script Full Page</span>
              </button>
              <button onClick={() => copyImage()} disabled={capturing}
                style={{ flex:1, padding:"7px 8px", fontFamily:FF, borderRadius:7, border:"1px solid var(--w-border)",
                  background:"transparent", color:"var(--w-text-2)", fontSize:10, fontWeight:500, cursor:capturing?"wait":"pointer",
                  display:"flex", alignItems:"center", gap:6 }}
                onMouseEnter={e => { if (!capturing) e.currentTarget.style.background="var(--w-bg-muted)"; }}
                onMouseLeave={e => (e.currentTarget.style.background="transparent")}
              >
                <Camera size={11} color="var(--w-text-3)" />
                <span>{capturing?"…":"Image (fallback)"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Toggle pill */}
        <button onClick={() => setOpen(o => !o)}
          style={{ padding:"9px 16px", fontFamily:FF, background:open?"var(--w-bg)":BLUE,
            border:`1px solid ${open?"var(--w-border)":BLUE}`, borderRadius:10, cursor:"pointer",
            display:"flex", alignItems:"center", gap:8, color:open?"var(--w-text-1)":"#fff",
            fontSize:12, fontWeight:700, boxShadow:"0 4px 16px rgba(0,0,0,0.2)", whiteSpace:"nowrap" }}>
          <Code2 size={14} />
          <span>Copy to Figma</span>
          {open ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          {selectedEl && !open && (
            <span style={{ fontSize:9, background:"rgba(255,255,255,0.25)", padding:"1px 6px", borderRadius:20, marginLeft:4 }}>
              1 selected
            </span>
          )}
        </button>
      </div>
    </>
  );
}

export function DevToolbar() {
  if (!import.meta.env.DEV) return null;
  return <DevToolbarInner />;
}
