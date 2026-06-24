/**
 * Shared Three.js warehouse scene — imported by both the Digital Twin 3D Map
 * page and the MHE Command Center page.
 */
import { useRef, useEffect, useState, useMemo } from "react";
import { useTheme } from "../../hooks/useTheme";
import { OrbitControls, Html, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────
export const BAY_W   = 1.1;
export const ROW_D   = 0.95;
export const LEVEL_H = 0.7;
export const LEVELS  = 5;
const POST_DIM = 0.065;
const BEAM_H   = 0.06;
export const RACK_H  = LEVELS * LEVEL_H + 0.35;

// Warehouse bounds (used for walls/roof)
const WH_W = 72;   // X width
const WH_D = 52;   // Z depth
const WH_H = 12;   // wall height
const WH_OX = -2;  // X offset center
const WH_OZ = -8;  // Z offset center

// ─── RackSection ─────────────────────────────────────────────────────────────
export function RackSection({
  rows, bays, position, label, sublabel, rowLetter = "A", labelStart = 1,
}: {
  rows: number; bays: number;
  position: [number, number, number];
  label: string; sublabel: string;
  rowLetter?: string; labelStart?: number;
}) {
  const postRef  = useRef<THREE.InstancedMesh>(null);
  const beamXRef = useRef<THREE.InstancedMesh>(null);
  const beamZRef = useRef<THREE.InstancedMesh>(null);

  const totalW = bays * BAY_W;
  const totalD = rows * ROW_D;

  const postCount  = (bays + 1) * (rows + 1);
  const beamXCount = LEVELS * (rows + 1);
  const beamZCount = LEVELS * (bays + 1);

  useEffect(() => {
    const dummy = new THREE.Object3D();

    if (postRef.current) {
      let i = 0;
      for (let xi = 0; xi <= bays; xi++) {
        for (let zi = 0; zi <= rows; zi++) {
          dummy.position.set(xi * BAY_W, RACK_H / 2, zi * ROW_D);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          postRef.current.setMatrixAt(i++, dummy.matrix);
        }
      }
      postRef.current.instanceMatrix.needsUpdate = true;
    }

    if (beamXRef.current) {
      let i = 0;
      for (let l = 0; l < LEVELS; l++) {
        const y = 0.25 + l * LEVEL_H;
        for (let zi = 0; zi <= rows; zi++) {
          dummy.position.set(totalW / 2, y, zi * ROW_D);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          beamXRef.current.setMatrixAt(i++, dummy.matrix);
        }
      }
      beamXRef.current.instanceMatrix.needsUpdate = true;
    }

    if (beamZRef.current) {
      let i = 0;
      for (let l = 0; l < LEVELS; l++) {
        const y = 0.25 + l * LEVEL_H;
        for (let xi = 0; xi <= bays; xi++) {
          dummy.position.set(xi * BAY_W, y, totalD / 2);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          beamZRef.current.setMatrixAt(i++, dummy.matrix);
        }
      }
      beamZRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [bays, rows, totalW, totalD]);

  // Bay labels every 3 bays — floor-level at back face, sticky (no distanceFactor)
  const bayLabels = [];
  for (let b = 0; b < bays; b += 3) {
    const n = Math.floor(b / 3) + labelStart;
    bayLabels.push(
      <Html key={b} position={[b * BAY_W + BAY_W * 1.5, 0.08, -0.52]} center zIndexRange={[30, 0]}>
        <div style={{
          fontSize: 9, color: "rgba(255,255,255,0.82)", fontFamily: "system-ui,sans-serif",
          pointerEvents: "none", fontWeight: 600, letterSpacing: "0.03em",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          whiteSpace: "nowrap",
        }}>{rowLetter}{n}'</div>
      </Html>
    );
  }

  return (
    <group position={position}>

      <instancedMesh ref={postRef} args={[null as any, null as any, postCount]} castShadow>
        <boxGeometry args={[POST_DIM, RACK_H, POST_DIM]} />
        <meshLambertMaterial color="#1e3a6e" />
      </instancedMesh>
      <instancedMesh ref={beamXRef} args={[null as any, null as any, beamXCount]}>
        <boxGeometry args={[totalW, BEAM_H, 0.065]} />
        <meshLambertMaterial color="#C4622D" />
      </instancedMesh>
      <instancedMesh ref={beamZRef} args={[null as any, null as any, beamZCount]}>
        <boxGeometry args={[0.065, BEAM_H, totalD]} />
        <meshLambertMaterial color="#C4622D" />
      </instancedMesh>
      <Html position={[totalW / 2, 0.08, -1.2]} center zIndexRange={[100, 0]}>
        <div style={{
          fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
          pointerEvents: "none", fontFamily: "system-ui,sans-serif",
          color: "rgba(255,255,255,0.65)", letterSpacing: "0.1em",
          textShadow: "0 1px 4px rgba(0,0,0,0.9)",
        }}>
          {label}
        </div>
      </Html>
      {bayLabels}
    </group>
  );
}

// ─── FloorZone ────────────────────────────────────────────────────────────────
export function FloorZone({
  position, width, depth, rotation = [0, 0, 0], color, borderColor, labelText, labelSub,
}: {
  position: [number, number, number]; width: number; depth: number;
  rotation?: [number, number, number]; color: string; borderColor: string;
  labelText: string; labelSub?: string;
}) {
  const T = 0.12;
  const H = 0.04;
  return (
    <group position={position} rotation={rotation as [number, number, number]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} depthWrite={false} />
      </mesh>
      {/* Striped overlay for zone feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial color={color} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh position={[0, H / 2, -depth / 2]}><boxGeometry args={[width, H, T]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, H / 2,  depth / 2]}><boxGeometry args={[width, H, T]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[-width / 2, H / 2, 0]}><boxGeometry args={[T, H, depth]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[ width / 2, H / 2, 0]}><boxGeometry args={[T, H, depth]} /><meshBasicMaterial color={borderColor} /></mesh>
      <Html position={[0, 0.6, 0]} center distanceFactor={18} zIndexRange={[50, 0]}>
        <div style={{ textAlign: "center", pointerEvents: "none", fontFamily: "system-ui,sans-serif" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#222", letterSpacing: 0.2 }}>{labelText}</div>
          {labelSub && <div style={{ fontSize: 9, color: "#666", marginTop: 1 }}>{labelSub}</div>}
        </div>
      </Html>
    </group>
  );
}

// ─── AreaLabel ────────────────────────────────────────────────────────────────
export function AreaLabel({ position, text, sub }: { position: [number, number, number]; text: string; sub?: string }) {
  return (
    <Html position={position} center distanceFactor={18} zIndexRange={[50, 0]}>
      <div style={{ textAlign: "center", pointerEvents: "none", fontFamily: "system-ui,sans-serif" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#333" }}>{text}</div>
        {sub && <div style={{ fontSize: 9, color: "#777", marginTop: 1 }}>{sub}</div>}
      </div>
    </Html>
  );
}

// ─── RowLabel ─────────────────────────────────────────────────────────────────
export function RowLabel({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <Html position={position} center distanceFactor={18} zIndexRange={[40, 0]}>
      <div style={{
        background: "rgba(255,255,255,0.78)", borderRadius: 3, padding: "1px 5px",
        fontSize: 9, fontWeight: 500, color: "#444", pointerEvents: "none",
        fontFamily: "system-ui,sans-serif", border: "1px solid #e5e7eb",
      }}>{text}</div>
    </Html>
  );
}

// ─── AisleMarker ─────────────────────────────────────────────────────────────
function AisleMarker({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <Html position={position} center distanceFactor={20} zIndexRange={[35, 0]}>
      <div style={{
        background: "rgba(255,200,0,0.15)", border: "1px solid rgba(255,200,0,0.5)",
        borderRadius: 3, padding: "1px 6px",
        fontSize: 8, fontWeight: 600, color: "#b45309", pointerEvents: "none",
        fontFamily: "system-ui,sans-serif", letterSpacing: 0.5,
      }}>{label}</div>
    </Html>
  );
}

// ─── Building Structure ───────────────────────────────────────────────────────
function WarehouseBuilding() {
  return (
    <group position={[WH_OX, 0, WH_OZ]}>
      {/* Floor slab only — walls/roof removed to avoid visual overlap with scene content */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[WH_W, WH_D]} />
        <meshLambertMaterial color="#b9b9b9" />
      </mesh>
    </group>
  );
}

// ─── MHE Vehicle (Forklift / Reach Truck) ────────────────────────────────────
type MHEVehicleProps = {
  id: string;
  label: string;
  type: string;
  color: string;
  position: [number, number, number];
  rotation?: number;
  onSelect?: (id: string) => void;
  onDoubleSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  selected?: boolean;
  dimmed?: boolean;
};

function MHEVehicle({ id, label, type, color, position, rotation = 0, onSelect, onDoubleSelect, onHover, selected, dimmed }: MHEVehicleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Dimmed vehicles get muted gray colours — no transparency (avoids Three.js depth-pass issues)
  const bodyC  = dimmed ? "#b0b7c3" : selected ? "#fef08a" : color;
  const darkC  = dimmed ? "#7a8494" : "#1a2332";
  const steelC = dimmed ? "#7a8494" : "#2d3748";
  const forkC  = dimmed ? "#7a8494" : "#b8860b";
  const wheelC = dimmed ? "#5a6270" : "#111827";
  const hubC   = dimmed ? "#7a8494" : "#374151";
  const glassC = dimmed ? "#8a9bb0" : "#bae6fd";

  // PBR material helpers — opaque always so depth buffer is never skipped
  const BM = { roughness: 0.72, metalness: 0.06 };
  const DM = { roughness: 0.50, metalness: 0.28 };
  const FM = { roughness: 0.40, metalness: 0.35 };
  const WM = { roughness: 0.94, metalness: 0.00 };
  const HM = { roughness: 0.38, metalness: 0.55 };

  // ── Counterbalance Forklift ──────────────────────────────────────────────────
  // Reference-matched: heavy counterweight, big drive tyres, steering wheel, open overhead guard
  const forkliftGeom = (
    <group>
      {/* Lower chassis frame */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.96, 0.32, 1.6]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      {/* Mid body — operator compartment */}
      <mesh position={[0, 0.52, -0.08]} castShadow>
        <boxGeometry args={[0.9, 0.48, 1.2]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      {/* Counterweight — the defining rear mass of a CB forklift, large and rounded-looking */}
      <mesh position={[0, 0.58, -0.86]} castShadow>
        <boxGeometry args={[0.92, 0.92, 0.52]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      <mesh position={[0, 0.22, -0.98]}>
        <boxGeometry args={[0.9, 0.2, 0.28]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      {/* Engine hood (slopes up from mast toward cabin) */}
      <mesh position={[0, 0.8, 0.1]} rotation={[0.24, 0, 0]}>
        <boxGeometry args={[0.88, 0.1, 0.78]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      {/* Seat back */}
      <mesh position={[0, 0.9, -0.3]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[0.36, 0.36, 0.08]} />
        <meshStandardMaterial color={darkC} {...DM} />
      </mesh>
      {/* Seat cushion */}
      <mesh position={[0, 0.72, -0.14]}>
        <boxGeometry args={[0.36, 0.07, 0.28]} />
        <meshStandardMaterial color={darkC} {...DM} />
      </mesh>
      {/* Steering column */}
      <mesh position={[0, 0.85, 0.18]} rotation={[0.55, 0, 0]}>
        <cylinderGeometry args={[0.018, 0.022, 0.32, 8]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Steering wheel (torus) */}
      <mesh position={[0, 0.98, 0.28]} rotation={[1.1, 0, 0]}>
        <torusGeometry args={[0.11, 0.016, 8, 20]} />
        <meshStandardMaterial color={darkC} {...DM} />
      </mesh>
      {/* Overhead guard — 4 slim structural pillars */}
      {([ [-0.43, 0.52], [0.43, 0.52], [-0.43, -0.58], [0.43, -0.58] ] as [number,number][]).map(([px, pz], i) => (
        <mesh key={i} position={[px, 1.18, pz]}>
          <boxGeometry args={[0.048, 1.08, 0.048]} />
          <meshStandardMaterial color={steelC} {...DM} />
        </mesh>
      ))}
      {/* Guard top — lateral + longitudinal bars */}
      <mesh position={[0, 1.73, -0.03]}>
        <boxGeometry args={[0.92, 0.036, 0.036]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      <mesh position={[0, 1.73, -0.03]}>
        <boxGeometry args={[0.036, 0.036, 1.14]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Diagonal X brace on guard roof */}
      <mesh position={[0, 1.73, -0.03]} rotation={[0, 0.55, 0]}>
        <boxGeometry args={[0.028, 0.028, 1.5]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      <mesh position={[0, 1.73, -0.03]} rotation={[0, -0.55, 0]}>
        <boxGeometry args={[0.028, 0.028, 1.5]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Mast — twin outer channels */}
      <mesh position={[-0.27, 1.05, 0.82]}>
        <boxGeometry args={[0.082, 2.1, 0.12]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      <mesh position={[0.27, 1.05, 0.82]}>
        <boxGeometry args={[0.082, 2.1, 0.12]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Mast inner stage */}
      <mesh position={[-0.21, 1.15, 0.83]}>
        <boxGeometry args={[0.054, 1.8, 0.08]} />
        <meshStandardMaterial color={dimmed ? "#9ca3af" : "#374151"} {...DM} />
      </mesh>
      <mesh position={[0.21, 1.15, 0.83]}>
        <boxGeometry args={[0.054, 1.8, 0.08]} />
        <meshStandardMaterial color={dimmed ? "#9ca3af" : "#374151"} {...DM} />
      </mesh>
      {/* Carriage backrest plate */}
      <mesh position={[0, 0.82, 0.88]}>
        <boxGeometry args={[0.56, 0.82, 0.05]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Fork carriage lower crossbar */}
      <mesh position={[0, 0.36, 0.9]}>
        <boxGeometry args={[0.58, 0.1, 0.06]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Forks — twin blades at ground level */}
      <mesh position={[-0.16, 0.07, 1.32]}>
        <boxGeometry args={[0.088, 0.072, 1.05]} />
        <meshStandardMaterial color={forkC} {...FM} />
      </mesh>
      <mesh position={[0.16, 0.07, 1.32]}>
        <boxGeometry args={[0.088, 0.072, 1.05]} />
        <meshStandardMaterial color={forkC} {...FM} />
      </mesh>
      {/* Large front drive wheels with hub detail */}
      {([-0.56, 0.56] as number[]).map((px, i) => (
        <group key={i} position={[px, 0.25, 0.52]}>
          <mesh rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.22, 20]} />
            <meshStandardMaterial color={wheelC} {...WM} />
          </mesh>
          <mesh position={[i === 0 ? -0.13 : 0.13, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.11, 0.11, 0.02, 12]} />
            <meshStandardMaterial color={hubC} {...HM} />
          </mesh>
        </group>
      ))}
      {/* Rear steer wheels — smaller */}
      {([-0.5, 0.5] as number[]).map((px, i) => (
        <group key={i} position={[px, 0.18, -0.68]}>
          <mesh rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.16, 16]} />
            <meshStandardMaterial color={wheelC} {...WM} />
          </mesh>
          <mesh position={[i === 0 ? -0.1 : 0.1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 10]} />
            <meshStandardMaterial color={hubC} {...HM} />
          </mesh>
        </group>
      ))}
      {/* Safety stripe band on counterweight */}
      {[0.06, -0.06].map((dy, i) => (
        <mesh key={i} position={[0, 0.3 + dy, -1.12]}>
          <boxGeometry args={[0.88, 0.045, 0.02]} />
          <meshStandardMaterial color={i === 0 ? "#111827" : forkC} {...BM} />
        </mesh>
      ))}
    </group>
  );

  // ── Reach Truck ──────────────────────────────────────────────────────────────
  // Narrow upright body, enclosed glass cabin, A-frame outriggers, telescoping mast
  const reachTruckGeom = (
    <group>
      {/* Main body — tall and narrow */}
      <mesh position={[0, 0.66, -0.06]} castShadow>
        <boxGeometry args={[0.62, 1.32, 1.02]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      {/* Cabin front glass */}
      <mesh position={[0, 0.74, 0.52]}>
        <boxGeometry args={[0.56, 0.64, 0.035]} />
        <meshStandardMaterial color={glassC} roughness={0.08} metalness={0.0} transparent opacity={dimmed ? 0.06 : 0.48} />
      </mesh>
      {/* Roof slab */}
      <mesh position={[0, 1.34, -0.06]}>
        <boxGeometry args={[0.64, 0.07, 1.08]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Outrigger arms */}
      {([-0.35, 0.35] as number[]).map((px, i) => (
        <group key={i}>
          <mesh position={[px, 0.1, 0.84]}>
            <boxGeometry args={[0.09, 0.09, 1.68]} />
            <meshStandardMaterial color={steelC} {...DM} />
          </mesh>
          <mesh position={[px, 0.05, 1.68]}>
            <boxGeometry args={[0.2, 0.04, 0.26]} />
            <meshStandardMaterial color={steelC} {...DM} />
          </mesh>
          <mesh position={[px, 0.09, 1.66]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.08, 12]} />
            <meshStandardMaterial color={wheelC} {...WM} />
          </mesh>
        </group>
      ))}
      {/* Mast outer channels */}
      {([-0.21, 0.21] as number[]).map((px, i) => (
        <group key={i}>
          <mesh position={[px, 1.24, 0.54]}>
            <boxGeometry args={[0.078, 2.48, 0.1]} />
            <meshStandardMaterial color={steelC} {...DM} />
          </mesh>
          <mesh position={[px, 1.5, 0.55]}>
            <boxGeometry args={[0.052, 1.85, 0.07]} />
            <meshStandardMaterial color={dimmed ? "#9ca3af" : "#374151"} {...DM} />
          </mesh>
        </group>
      ))}
      {/* Carriage + forks */}
      <mesh position={[0, 0.4, 0.6]}>
        <boxGeometry args={[0.48, 0.1, 0.08]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {([-0.13, 0.13] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 0.1, 1.36]}>
          <boxGeometry args={[0.072, 0.06, 1.6]} />
          <meshStandardMaterial color={forkC} {...FM} />
        </mesh>
      ))}
      {/* Rear drive wheel */}
      <mesh position={[0, 0.18, -0.58]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.22, 16]} />
        <meshStandardMaterial color={wheelC} {...WM} />
      </mesh>
    </group>
  );

  // ── Electric Pallet Jack ─────────────────────────────────────────────────────
  // Walk-behind: compact motor head, long low fork channels, tiller arm
  const palletJackGeom = (
    <group>
      {/* Motor/battery head */}
      <mesh position={[0, 0.28, -0.34]} castShadow>
        <boxGeometry args={[0.66, 0.56, 0.74]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      {/* Control panel bump */}
      <mesh position={[0, 0.57, -0.1]}>
        <boxGeometry args={[0.3, 0.2, 0.2]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Display glass */}
      <mesh position={[0, 0.59, 0.0]}>
        <boxGeometry args={[0.18, 0.1, 0.02]} />
        <meshStandardMaterial color={glassC} roughness={0.1} metalness={0.0} transparent opacity={dimmed ? 0.08 : 0.7} />
      </mesh>
      {/* Tiller shaft */}
      <mesh position={[0, 0.66, -0.72]} rotation={[-0.44, 0, 0]}>
        <boxGeometry args={[0.038, 0.038, 0.74]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Tiller handle */}
      <mesh position={[0, 0.98, -1.08]}>
        <boxGeometry args={[0.4, 0.038, 0.038]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Grips */}
      {([-0.2, 0.2] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 0.95, -1.08]}>
          <boxGeometry args={[0.038, 0.12, 0.038]} />
          <meshStandardMaterial color={bodyC} {...BM} />
        </mesh>
      ))}
      {/* Fork channels — long, low */}
      {([-0.21, 0.21] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 0.1, 0.78]}>
          <boxGeometry args={[0.13, 0.16, 1.6]} />
          <meshStandardMaterial color={forkC} {...FM} />
        </mesh>
      ))}
      {/* Cross brace */}
      <mesh position={[0, 0.12, 0.04]}>
        <boxGeometry args={[0.54, 0.1, 0.08]} />
        <meshStandardMaterial color={forkC} {...FM} />
      </mesh>
      {/* Drive wheel */}
      <mesh position={[0, 0.14, -0.34]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.17, 14]} />
        <meshStandardMaterial color={wheelC} {...WM} />
      </mesh>
      {/* Load wheels at fork tips */}
      {([-0.21, 0.21] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 0.07, 1.54]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 10]} />
          <meshStandardMaterial color={wheelC} {...WM} />
        </mesh>
      ))}
    </group>
  );

  // ── Order Picker ─────────────────────────────────────────────────────────────
  // Elevated operator cage, outrigger base, tall rear mast
  const orderPickerGeom = (
    <group>
      {/* Lower chassis */}
      <mesh position={[0, 0.22, -0.08]} castShadow>
        <boxGeometry args={[0.68, 0.44, 1.02]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      {/* Platform floor */}
      <mesh position={[0, 0.46, 0.34]}>
        <boxGeometry args={[0.64, 0.06, 0.56]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Cage side panels */}
      {([-0.33, 0.33] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 0.88, 0.34]}>
          <boxGeometry args={[0.04, 0.84, 0.58]} />
          <meshStandardMaterial color={bodyC} {...BM} />
        </mesh>
      ))}
      {/* Cage front mesh (semi-transparent) */}
      <mesh position={[0, 0.88, 0.62]}>
        <boxGeometry args={[0.68, 0.84, 0.032]} />
        <meshStandardMaterial color={bodyC} roughness={0.7} metalness={0.1} transparent opacity={dimmed ? 0.12 : 0.28} />
      </mesh>
      {/* Cage top rail */}
      <mesh position={[0, 1.32, 0.34]}>
        <boxGeometry args={[0.68, 0.04, 0.58]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Outrigger legs */}
      {([-0.35, 0.35] as number[]).map((px, i) => (
        <group key={i}>
          <mesh position={[px, 0.1, 0.76]}>
            <boxGeometry args={[0.08, 0.08, 1.52]} />
            <meshStandardMaterial color={steelC} {...DM} />
          </mesh>
          <mesh position={[px, 0.09, 1.48]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.09, 12]} />
            <meshStandardMaterial color={wheelC} {...WM} />
          </mesh>
        </group>
      ))}
      {/* Rear mast */}
      {([-0.23, 0.23] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 1.36, -0.58]}>
          <boxGeometry args={[0.066, 2.72, 0.09]} />
          <meshStandardMaterial color={steelC} {...DM} />
        </mesh>
      ))}
      {/* Forks */}
      {([-0.16, 0.16] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 0.1, 1.24]}>
          <boxGeometry args={[0.072, 0.062, 1.48]} />
          <meshStandardMaterial color={forkC} {...FM} />
        </mesh>
      ))}
      {/* Drive wheel */}
      <mesh position={[0, 0.16, -0.54]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.18, 14]} />
        <meshStandardMaterial color={wheelC} {...WM} />
      </mesh>
    </group>
  );

  // ── BPOT ─────────────────────────────────────────────────────────────────────
  // Wide ride-on platform truck: flat cargo deck, stand-on operator station
  const bpotGeom = (
    <group>
      {/* Cargo deck */}
      <mesh position={[0, 0.18, 0.44]} castShadow>
        <boxGeometry args={[0.94, 0.24, 1.58]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      {/* Non-slip deck surface */}
      <mesh position={[0, 0.31, 0.44]}>
        <boxGeometry args={[0.9, 0.03, 1.54]} />
        <meshStandardMaterial color={dimmed ? "#9ca3af" : "#1e293b"} {...DM} />
      </mesh>
      {/* Operator station block */}
      <mesh position={[0, 0.38, -0.64]}>
        <boxGeometry args={[0.92, 0.52, 0.52]} />
        <meshStandardMaterial color={bodyC} {...BM} />
      </mesh>
      {/* Operator footplate */}
      <mesh position={[0, 0.65, -0.64]}>
        <boxGeometry args={[0.9, 0.04, 0.5]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Steering column */}
      <mesh position={[0, 1.04, -0.48]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.042, 0.6, 0.042]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Handlebar */}
      <mesh position={[0, 1.28, -0.36]}>
        <boxGeometry args={[0.5, 0.042, 0.042]} />
        <meshStandardMaterial color={steelC} {...DM} />
      </mesh>
      {/* Control display */}
      <mesh position={[0, 1.12, -0.38]}>
        <boxGeometry args={[0.16, 0.1, 0.03]} />
        <meshStandardMaterial color={glassC} roughness={0.1} metalness={0.0} transparent opacity={dimmed ? 0.08 : 0.65} />
      </mesh>
      {/* Safety rails */}
      {([-0.49, 0.49] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 0.46, 0.44]}>
          <boxGeometry args={[0.024, 0.32, 1.54]} />
          <meshStandardMaterial color={forkC} {...FM} />
        </mesh>
      ))}
      {/* Front bumper */}
      <mesh position={[0, 0.27, 1.24]}>
        <boxGeometry args={[0.94, 0.15, 0.055]} />
        <meshStandardMaterial color={forkC} {...FM} />
      </mesh>
      {/* Drive wheels (rear) with hub */}
      {([-0.5, 0.5] as number[]).map((px, i) => (
        <group key={i} position={[px, 0.17, -0.64]}>
          <mesh rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.17, 0.17, 0.17, 16]} />
            <meshStandardMaterial color={wheelC} {...WM} />
          </mesh>
          <mesh position={[i === 0 ? -0.1 : 0.1, 0, 0]} rotation={[0, 0, Math.PI/2]}>
            <cylinderGeometry args={[0.08, 0.08, 0.02, 10]} />
            <meshStandardMaterial color={hubC} {...HM} />
          </mesh>
        </group>
      ))}
      {/* Front castor wheels */}
      {([-0.46, 0.46] as number[]).map((px, i) => (
        <mesh key={i} position={[px, 0.11, 1.16]} rotation={[0, 0, Math.PI/2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.11, 12]} />
          <meshStandardMaterial color={wheelC} {...WM} />
        </mesh>
      ))}
    </group>
  );

  const geomByType: Record<string, JSX.Element> = {
    "Forklift":             forkliftGeom,
    "Reach Truck":          reachTruckGeom,
    "Electric Pallet Jack": palletJackGeom,
    "Order Picker":         orderPickerGeom,
    "BPOT":                 bpotGeom,
  };

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotation, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover?.(id); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); onHover?.(null); document.body.style.cursor = "default"; }}
      onClick={(e) => { e.stopPropagation(); onSelect?.(id); }}
      onDoubleClick={(e) => { e.stopPropagation(); onDoubleSelect?.(id); }}
    >
      {geomByType[type] ?? forkliftGeom}

      {/* Warning beacon light */}
      {!dimmed && (
        <mesh position={[0, 1.05, 0]}>
          <sphereGeometry args={[0.065, 8, 8]} />
          <meshBasicMaterial color={selected ? "#f59e0b" : (hovered ? "#fbbf24" : "#d97706")} />
        </mesh>
      )}

      {/* Selection ring — vehicle colour when selected, subtle white when hovered */}
      {!dimmed && (selected || hovered) && (
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[0.72, 0.88, 24]} />
            <meshBasicMaterial color={selected ? color : "#ffffff"} transparent opacity={selected ? 0.9 : 0.35} side={THREE.DoubleSide} />
          </mesh>
          {/* Second outer glow ring when selected */}
          {selected && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
              <ringGeometry args={[0.9, 1.1, 24]} />
              <meshBasicMaterial color={color} transparent opacity={0.28} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      )}

      {/* Label */}
      <Html position={[0, 2.4, 0]} center distanceFactor={18} zIndexRange={[80, 0]}>
        <div style={{
          background: dimmed
            ? "rgba(60,60,60,0.38)"
            : selected ? color : (hovered ? "rgba(255,255,255,0.18)" : "rgba(30,30,30,0.75)"),
          color: dimmed ? "rgba(255,255,255,0.45)" : selected ? "#0f172a" : "#fff",
          borderRadius: 4, padding: "2px 7px",
          fontSize: 9, fontWeight: 700, fontFamily: "system-ui,sans-serif",
          pointerEvents: "none", whiteSpace: "nowrap",
          boxShadow: selected && !dimmed ? `0 2px 10px ${color}88` : "0 1px 4px rgba(0,0,0,0.3)",
          border: selected && !dimmed ? `1px solid ${color}` : "1px solid transparent",
          transition: "background 0.15s",
        }}>
          {label}
          {hovered && !dimmed && <span style={{ opacity: 0.8, marginLeft: 4, fontSize: 8 }}>· {type}</span>}
        </div>
      </Html>
    </group>
  );
}

// ─── Animated MHE — moves along a path ───────────────────────────────────────
type PathPoint = [number, number, number];

function AnimatedMHE(props: MHEVehicleProps & {
  path: PathPoint[]; speed?: number;
  onNearMiss?: (e: NearMissEvent) => void;
  hotRacksRef?: React.MutableRefObject<Set<string>>;
  infoCardNode?: React.ReactNode;
  mheStateRef?: React.MutableRefObject<Map<string, MHELiveState>>;
  humanPositions?: [number,number,number][];
}) {
  const { path, speed = 1.2, onNearMiss, hotRacksRef, infoCardNode, mheStateRef, humanPositions, ...vehicleProps } = props;
  const groupRef = useRef<THREE.Group>(null);
  const tRef = useRef(Math.random()); // stagger start
  const trailRef = useRef<THREE.Points>(null);
  const trailPositions = useRef<Float32Array>(new Float32Array(30 * 3));
  const trailIdx = useRef(0);
  const lastAlertAt  = useRef<Record<string, number>>({});
  const clearTimers  = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const ALERT_COOLDOWN = 6000;

  // Proximity zone material refs
  const dangerFillRef = useRef<THREE.MeshBasicMaterial>(null);
  const warnFillRef   = useRef<THREE.MeshBasicMaterial>(null);
  const safeFillRef   = useRef<THREE.MeshBasicMaterial>(null);
  const dangerRingRef = useRef<THREE.MeshBasicMaterial>(null);
  const warnRingRef   = useRef<THREE.MeshBasicMaterial>(null);
  const safeRingRef   = useRef<THREE.MeshBasicMaterial>(null);
  const zonePulseT    = useRef(0);

  const totalLen = useMemo(() => {
    let l = 0;
    for (let i = 1; i < path.length; i++) {
      const a = new THREE.Vector3(...path[i - 1]);
      const b = new THREE.Vector3(...path[i]);
      l += a.distanceTo(b);
    }
    return l;
  }, [path]);

  const getPositionOnPath = (t: number): [THREE.Vector3, number] => {
    const target = (t % 1) * totalLen;
    let acc = 0;
    for (let i = 1; i < path.length; i++) {
      const a = new THREE.Vector3(...path[i - 1]);
      const b = new THREE.Vector3(...path[i]);
      const seg = a.distanceTo(b);
      if (acc + seg >= target) {
        const frac = (target - acc) / seg;
        const pos = a.lerp(b, frac);
        const angle = Math.atan2(b.x - a.x, b.z - a.z);
        return [pos, angle];
      }
      acc += seg;
    }
    return [new THREE.Vector3(...path[path.length - 1]), 0];
  };

  useFrame((_, delta) => {
    tRef.current += (delta * speed) / totalLen;
    const [pos, angle] = getPositionOnPath(tRef.current);
    if (groupRef.current) {
      groupRef.current.position.set(pos.x, 0, pos.z);
      groupRef.current.rotation.y = angle;
    }
    // Publish live state for follow-cam
    mheStateRef?.current.set(vehicleProps.id, { x: pos.x, z: pos.z, angle });
    // Update trail
    const ti = (trailIdx.current % 30) * 3;
    trailPositions.current[ti]     = pos.x;
    trailPositions.current[ti + 1] = 0.08;
    trailPositions.current[ti + 2] = pos.z;
    trailIdx.current++;
    if (trailRef.current) {
      (trailRef.current.geometry as THREE.BufferGeometry).attributes.position.needsUpdate = true;
    }

    // ── Near-miss collision detection ──────────────────────────────────────
    const rack = isInSafetyZone(pos.x, pos.z);
    if (rack) {
      const now = performance.now();
      if (!lastAlertAt.current[rack.id] || now - lastAlertAt.current[rack.id] > ALERT_COOLDOWN) {
        lastAlertAt.current[rack.id] = now;
        // Mark rack as hot (drives visual in RackSafetyZone via useFrame)
        if (hotRacksRef) {
          hotRacksRef.current.add(rack.id);
          clearTimeout(clearTimers.current[rack.id]);
          clearTimers.current[rack.id] = setTimeout(() => {
            hotRacksRef.current.delete(rack.id);
          }, 2500);
        }
        // Fire event to React UI
        onNearMiss?.({
          mheId: props.id, mheLabel: props.label,
          rackId: rack.id, rackLabel: rack.label,
          timestamp: now,
        });
      }
    }

    // ── Human proximity detection ──────────────────────────────────────────
    if (humanPositions?.length) {
      let minDist = Infinity;
      for (const hp of humanPositions) {
        const dx = pos.x - hp[0], dz = pos.z - hp[2];
        minDist = Math.min(minDist, Math.sqrt(dx * dx + dz * dz));
      }
      zonePulseT.current += delta;
      const pulse = Math.sin(zonePulseT.current * 6) * 0.5 + 0.5; // 0–1

      const inDanger  = minDist < ZONE_DANGER;
      const inWarning = minDist < ZONE_WARNING;
      const inSafe    = minDist < ZONE_SAFE;

      if (dangerFillRef.current)
        dangerFillRef.current.opacity = inDanger  ? 0.18 + pulse * 0.14 : 0.04;
      if (dangerRingRef.current)
        dangerRingRef.current.opacity = inDanger  ? 0.9  : 0.25;
      if (warnFillRef.current)
        warnFillRef.current.opacity   = (!inDanger && inWarning) ? 0.10 + pulse * 0.08 : 0.03;
      if (warnRingRef.current)
        warnRingRef.current.opacity   = inWarning ? (inDanger ? 0.2 : 0.75) : 0.18;
      if (safeFillRef.current)
        safeFillRef.current.opacity   = (!inWarning && inSafe)  ? 0.06 + pulse * 0.04 : 0.02;
      if (safeRingRef.current)
        safeRingRef.current.opacity   = inSafe    ? (inWarning ? 0.12 : 0.55) : 0.10;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        <MHEVehicle {...vehicleProps} position={[0, 0, 0]} rotation={0} />
        {infoCardNode}

        {/* ── Proximity detection zones (always shown, intensity reacts to humans) ── */}
        {/* Danger fill */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <circleGeometry args={[ZONE_DANGER, 52]} />
          <meshBasicMaterial ref={dangerFillRef} color="#ef4444" transparent opacity={0.04} depthWrite={false} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
        </mesh>
        {/* Danger ring border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0]}>
          <ringGeometry args={[ZONE_DANGER - 0.13, ZONE_DANGER, 52]} />
          <meshBasicMaterial ref={dangerRingRef} color="#ef4444" transparent opacity={0.25} depthWrite={false} />
        </mesh>

        {/* Warning fill (annular) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <ringGeometry args={[ZONE_DANGER, ZONE_WARNING, 52]} />
          <meshBasicMaterial ref={warnFillRef} color="#f59e0b" transparent opacity={0.03} depthWrite={false} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
        </mesh>
        {/* Warning ring border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0]}>
          <ringGeometry args={[ZONE_WARNING - 0.13, ZONE_WARNING, 52]} />
          <meshBasicMaterial ref={warnRingRef} color="#f59e0b" transparent opacity={0.18} depthWrite={false} />
        </mesh>

        {/* Safe fill (annular) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <ringGeometry args={[ZONE_WARNING, ZONE_SAFE, 52]} />
          <meshBasicMaterial ref={safeFillRef} color="#22c55e" transparent opacity={0.02} depthWrite={false} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2} />
        </mesh>
        {/* Safe ring border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.022, 0]}>
          <ringGeometry args={[ZONE_SAFE - 0.13, ZONE_SAFE, 52]} />
          <meshBasicMaterial ref={safeRingRef} color="#22c55e" transparent opacity={0.10} depthWrite={false} />
        </mesh>
      </group>
      {/* Trail — hidden when dimmed */}
      {!props.dimmed && (
        <points ref={trailRef}>
          <bufferGeometry onUpdate={self => {
            self.setAttribute("position", new THREE.BufferAttribute(trailPositions.current, 3));
          }} />
          <pointsMaterial size={0.08} color={props.color} transparent opacity={0.35} sizeAttenuation />
        </points>
      )}
    </>
  );
}

// ─── Operator Marker ──────────────────────────────────────────────────────────
function OperatorMarker({ position, name, id, active = true }: {
  position: [number, number, number]; name: string; id: string; active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      {/* Person body */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.7, 8]} />
        <meshLambertMaterial color={active ? "#0ea5e9" : "#6b7280"} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshLambertMaterial color="#fde68a" />
      </mesh>
      {/* Hard hat */}
      <mesh position={[0, 1.54, 0]}>
        <cylinderGeometry args={[0.18, 0.14, 0.1, 10]} />
        <meshLambertMaterial color={active ? "#f59e0b" : "#9ca3af"} />
      </mesh>
      {/* Status dot */}
      <mesh position={[0.18, 1.45, 0]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshBasicMaterial color={active ? "#22c55e" : "#6b7280"} />
      </mesh>
      {/* Floor shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.12} />
      </mesh>

      <Html position={[0, 1.9, 0]} center distanceFactor={16} zIndexRange={[75, 0]}>
        <div style={{
          background: hovered ? "#0ea5e9" : "rgba(14,165,233,0.15)",
          color: hovered ? "#fff" : "#0369a1",
          border: "1px solid rgba(14,165,233,0.4)",
          borderRadius: 4, padding: "2px 6px",
          fontSize: 8, fontWeight: 600, fontFamily: "system-ui,sans-serif",
          pointerEvents: "none", whiteSpace: "nowrap",
        }}>
          {name}
        </div>
      </Html>
    </group>
  );
}

// ─── Event Hotspot ────────────────────────────────────────────────────────────
type EventSeverity = "critical" | "warning" | "info";

function EventHotspot({ position, label, severity, count = 1 }: {
  position: [number, number, number]; label: string; severity: EventSeverity; count?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);

  const COLOR = severity === "critical" ? "#ef4444" : severity === "warning" ? "#f59e0b" : "#3b82f6";

  useFrame((_, delta) => {
    pulseRef.current += delta * 2.5;
    if (ringRef.current) {
      const s = 1 + Math.sin(pulseRef.current) * 0.22;
      ringRef.current.scale.set(s, s, s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 - Math.sin(pulseRef.current) * 0.2;
    }
  });

  return (
    <group
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      {/* Pulse ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.28, 0.42, 20]} />
        <meshBasicMaterial color={COLOR} transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Pin base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.22, 16]} />
        <meshBasicMaterial color={COLOR} transparent opacity={0.9} />
      </mesh>
      {/* Pin stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        <meshLambertMaterial color={COLOR} />
      </mesh>
      {/* Pin head */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshLambertMaterial color={COLOR} />
      </mesh>
      {/* Count badge */}
      {count > 1 && (
        <Html position={[0.18, 1.25, 0]} center distanceFactor={12} zIndexRange={[90, 0]}>
          <div style={{
            background: "#1f2937", color: "#fff",
            borderRadius: "50%", width: 14, height: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 7, fontWeight: 700, fontFamily: "system-ui,sans-serif",
            pointerEvents: "none",
          }}>{count}</div>
        </Html>
      )}
      <Html position={[0, 1.5, 0]} center distanceFactor={16} zIndexRange={[85, 0]}>
        <div style={{
          background: hovered ? COLOR : `${COLOR}20`,
          color: hovered ? "#fff" : COLOR,
          border: `1px solid ${COLOR}60`,
          borderRadius: 4, padding: "2px 6px",
          fontSize: 8, fontWeight: 600, fontFamily: "system-ui,sans-serif",
          pointerEvents: "none", whiteSpace: "nowrap",
          transition: "background 0.15s",
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

// ─── Rack Safety Zones ───────────────────────────────────────────────────────
export const SAFETY_MARGIN = 1.5; // world-units around rack that counts as danger zone

export const RACK_BOUNDS = [
  { id: "SIDE", label: "Side Storage",
    xMin: -26,  xMax: -26 + 6  * BAY_W,   // -26 → -19.4
    zMin: -13,  zMax: -13 + 2  * ROW_D },  // -13 → -11.1
  { id: "MAIN", label: "Main Storage",
    xMin: -4,   xMax: -4  + 21 * BAY_W,   // -4  → 19.1
    zMin: -19,  zMax: -19 + 4  * ROW_D },  // -19 → -15.2
  { id: "BULK", label: "Bulk Storage",
    xMin: 6,    xMax: 6   + 12 * BAY_W,   //  6  → 19.2
    zMin: 2,    zMax: 2   + 2  * ROW_D },  //  2  →  3.9
] as const;

export type NearMissEvent = {
  mheId: string; mheLabel: string;
  rackId: string; rackLabel: string;
  timestamp: number;
};

// ── Human proximity zones ─────────────────────────────────────────────────────
const ZONE_DANGER  = 2.5; // red   — imminent collision risk
const ZONE_WARNING = 5.0; // amber — caution, slow down
const ZONE_SAFE    = 8.5; // green — awareness zone

const HUMAN_SPOTS: { id: string; name: string; pos: [number,number,number] }[] = [
  { id: "w1", name: "Worker A", pos: [-9,  0, -4]  },
  { id: "w2", name: "Worker B", pos: [ 6,  0,  5]  },
  { id: "w3", name: "Worker C", pos: [13,  0, -9]  },
  { id: "w4", name: "Worker D", pos: [-2,  0,  8]  },
  { id: "w5", name: "Worker E", pos: [22,  0,  2]  },
];

function isInSafetyZone(x: number, z: number): typeof RACK_BOUNDS[number] | null {
  for (const r of RACK_BOUNDS) {
    if (x >= r.xMin - SAFETY_MARGIN && x <= r.xMax + SAFETY_MARGIN &&
        z >= r.zMin - SAFETY_MARGIN && z <= r.zMax + SAFETY_MARGIN) {
      return r;
    }
  }
  return null;
}

function RackSafetyZone({
  rack, hotRacksRef,
}: {
  rack: typeof RACK_BOUNDS[number];
  hotRacksRef: React.MutableRefObject<Set<string>>;
}) {
  const matRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame(() => {
    const hot   = hotRacksRef.current.has(rack.id);
    const color = hot ? "#ef4444" : "#f59e0b";
    matRefs.current.forEach((m, i) => {
      if (!m) return;
      m.color.set(color);
      // index 0 is fill, 1-4 are border bars
      m.opacity = i === 0 ? (hot ? 0.18 : 0.06) : (hot ? 1.0 : 0.7);
    });
  });

  const x0 = rack.xMin - SAFETY_MARGIN;
  const x1 = rack.xMax + SAFETY_MARGIN;
  const z0 = rack.zMin - SAFETY_MARGIN;
  const z1 = rack.zMax + SAFETY_MARGIN;
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const w  = x1 - x0;
  const d  = z1 - z0;

  // Thin raised bars for the 4 edges — no z-fighting, no aliasing
  const T = 0.07; // bar thickness
  const H = 0.055; // bar height above floor
  const bars: { pos: [number,number,number]; size: [number,number,number] }[] = [
    { pos: [cx, H / 2, z0], size: [w, H, T] }, // front
    { pos: [cx, H / 2, z1], size: [w, H, T] }, // back
    { pos: [x0, H / 2, cz], size: [T, H, d] }, // left
    { pos: [x1, H / 2, cz], size: [T, H, d] }, // right
  ];

  return (
    <group>
      {/* Subtle fill — polygonOffset keeps it above floor without z-fight */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0, cz]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial
          ref={el => { matRefs.current[0] = el; }}
          color="#f59e0b" transparent opacity={0.06}
          depthWrite={false} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-2}
        />
      </mesh>

      {/* Solid border bars */}
      {bars.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshBasicMaterial
            ref={el => { matRefs.current[i + 1] = el; }}
            color="#f59e0b" transparent opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

// ─── Human Figure (warehouse worker, walks slowly, detection-aware) ──────────
const WALK_RADIUS = 3.5; // units from base before turning back
const WALK_SPEED  = 0.45; // units/second

function HumanFigure({
  pos, name, mheStateRef,
}: {
  pos: [number,number,number];
  name: string;
  mheStateRef: React.MutableRefObject<Map<string, MHELiveState>>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Walking state — all in refs so useFrame can mutate without re-renders
  const walkX      = useRef(pos[0]);
  const walkZ      = useRef(pos[2]);
  const targetX    = useRef(pos[0]);
  const targetZ    = useRef(pos[2]);
  const turnTimer  = useRef(Math.random() * 3); // stagger first turn
  const walkFacing = useRef(0);
  const stepDist   = useRef(Math.random() * Math.PI * 2); // bob phase offset

  const ringRef  = useRef<THREE.Mesh>(null);
  const iconRef  = useRef<HTMLDivElement>(null);
  const pulseT   = useRef(0);

  const pickNewTarget = () => {
    const angle = Math.random() * Math.PI * 2;
    const r     = 1.5 + Math.random() * (WALK_RADIUS - 1.5);
    targetX.current = pos[0] + Math.cos(angle) * r;
    targetZ.current = pos[2] + Math.sin(angle) * r;
    turnTimer.current = 4 + Math.random() * 5; // 4-9 s per leg
  };

  useFrame((_, delta) => {
    // ── Walk ───────────────────────────────────────────────────────────────
    turnTimer.current -= delta;
    const dx   = targetX.current - walkX.current;
    const dz   = targetZ.current - walkZ.current;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 0.12 || turnTimer.current <= 0) pickNewTarget();

    if (dist > 0.01) {
      const step = Math.min(WALK_SPEED * delta, dist);
      walkX.current    += (dx / dist) * step;
      walkZ.current    += (dz / dist) * step;
      walkFacing.current = Math.atan2(dx, dz);
      stepDist.current  += step;
    }

    const bobY = Math.abs(Math.sin(stepDist.current * 5)) * 0.06;

    if (groupRef.current) {
      groupRef.current.position.set(walkX.current, bobY, walkZ.current);
      groupRef.current.rotation.y = walkFacing.current;
    }

    // ── Detection ──────────────────────────────────────────────────────────
    let minDist = Infinity;
    for (const s of mheStateRef.current.values()) {
      const ex = s.x - walkX.current, ez = s.z - walkZ.current;
      minDist = Math.min(minDist, Math.sqrt(ex * ex + ez * ez));
    }
    pulseT.current += delta;
    const pulse = Math.sin(pulseT.current * 7) * 0.5 + 0.5;

    const inDanger  = minDist < ZONE_DANGER;
    const inWarning = minDist < ZONE_WARNING;

    const iconColor = inDanger ? "#ef4444" : inWarning ? "#f59e0b" : "#9ca3af";

    if (iconRef.current) iconRef.current.style.color = iconColor;

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (inDanger || inWarning) {
        const s = 1 + pulse * 0.45;
        ringRef.current.scale.set(s, s, s);
        mat.color.set(iconColor);
        mat.opacity = inDanger ? 0.55 + pulse * 0.25 : 0.35 + pulse * 0.15;
      } else {
        mat.opacity = 0;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Pulse ring on floor */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[0.18, 0.34, 20]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* Shadow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.18, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.08} depthWrite={false} />
      </mesh>
      {/* Gray person icon + name label */}
      <Html position={[0, 0, 0]} center zIndexRange={[75, 0]}>
        <div ref={iconRef} style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          pointerEvents: "none", color: "#9ca3af",
        }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <circle cx="12" cy="4.5" r="2.8" />
            <path d="M8 9.5c0-2.2 1.8-4 4-4s4 1.8 4 4v5H8v-5z" />
            <path d="M9 14.5l-1.5 7h2l1-4 1 4h2l1-4 1 4h2l-1.5-7H9z" />
          </svg>
          <span style={{ fontSize: 9, fontWeight: 700, fontFamily: "system-ui,sans-serif", marginTop: 2, whiteSpace: "nowrap", textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>{name}</span>
        </div>
      </Html>
    </group>
  );
}

// ─── Task Path Types ─────────────────────────────────────────────────────────
export type TaskStatus = "assigned" | "in-progress" | "deviated" | "completed";

export type TaskMetrics = {
  plannedDist: number; actualDist: number;
  plannedTime: number; actualTime: number;
  batteryPlanned: number; batteryActual: number;
  efficiencyScore: number;
  operatorScore: { before: number; after: number };
  issues: string[];
};

export type TaskAssignment = {
  id: string;
  taskId: string;
  taskName: string;
  mheId: string;
  status: TaskStatus;
  plannedPath: [number,number,number][];
  actualPath?: [number,number,number][];
  deviationZone?: { cx: number; cz: number; w: number; d: number };
  metrics?: TaskMetrics;
};

// ─── PathLine ─────────────────────────────────────────────────────────────────
// Clean floor-level line using drei Line (LineSegments2 — WebGL thick lines).
// Planned path = dashed, actual path = solid.
function PathLine({ points, color, opacity = 0.92, dashed = false }: {
  points: [number,number,number][];
  color: string; opacity?: number; dashed?: boolean;
  yOffset?: number; width?: number; // kept for call-site compat
}) {
  // Lift slightly off floor so it doesn't z-fight
  const pts = points.map(([x,, z]) => [x, 0.06, z] as [number,number,number]);
  return (
    <group>
      {/* Soft glow halo — wider, very transparent */}
      <Line points={pts} color={color} lineWidth={6}
        transparent opacity={opacity * 0.15} depthWrite={false} />
      {/* Core line */}
      <Line points={pts} color={color}
        lineWidth={dashed ? 1.5 : 2.5}
        dashed={dashed} dashSize={0.55} gapSize={0.35}
        transparent opacity={opacity} />
    </group>
  );
}

// ─── PathArrows ───────────────────────────────────────────────────────────────
// Small flat chevrons on the floor at each segment midpoint.
function PathArrows({ points, color }: { points: [number,number,number][]; color: string }) {
  return (
    <>
      {points.slice(1).map(([ex,, ez], i) => {
        const [sx,, sz] = points[i];
        const segLen = Math.sqrt((ex-sx)**2+(ez-sz)**2);
        const angle = Math.atan2(ex-sx, ez-sz);
        // Place one arrow per segment at the 65% mark so it feels directional
        const t = 0.65;
        const mx = sx + (ex-sx)*t, mz = sz + (ez-sz)*t;
        // Skip tiny segments
        if (segLen < 0.8) return null;
        return (
          <group key={i} position={[mx, 0.07, mz]} rotation={[-Math.PI/2, 0, -angle]}>
            <mesh>
              <coneGeometry args={[0.18, 0.32, 3]} />
              <meshBasicMaterial color={color} transparent opacity={0.75} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

// ─── StartEndMarker ───────────────────────────────────────────────────────────
function StartEndMarker({ position, type }: { position: [number,number,number]; type: "start" | "end" }) {
  const color = type === "start" ? "#22c55e" : "#ef4444";
  const label = type === "start" ? "PICKUP" : "DROPOFF";
  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[0.55, 20]} />
        <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.05, 1.8, 8]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <mesh position={[0.28, 1.76, 0]}>
        <boxGeometry args={[0.52, 0.34, 0.05]} />
        <meshLambertMaterial color={color} />
      </mesh>
      <Html position={[0, 2.4, 0]} center distanceFactor={16} zIndexRange={[160, 0]}>
        <div style={{
          background: color, color: "#fff", borderRadius: 3, padding: "2px 7px",
          fontSize: 9, fontWeight: 700, fontFamily: "system-ui,sans-serif",
          pointerEvents: "none", letterSpacing: 0.4,
        }}>{label}</div>
      </Html>
    </group>
  );
}

// ─── MHEInfoCard — unified status + task impact card (pure React, no R3F) ─────
function MHEInfoCard({ mheId, position, color, type, assignment }: {
  mheId: string; position: [number,number,number];
  color: string; type: string;
  assignment?: TaskAssignment;
}) {
  const st         = MHE_STATUS_DATA[mheId];
  const m          = assignment?.metrics;
  const isDeviated = assignment?.status === "deviated";
  const isCompleted= assignment?.status === "completed";
  const sc         = st ? STATUS_COLOR[st.status] : color;
  const batCol     = st ? (st.battery > 60 ? "#22c55e" : st.battery > 30 ? "#f59e0b" : "#ef4444") : "#6b7280";

  const distDelta  = m ? m.actualDist - m.plannedDist : 0;
  const timeDelta  = m ? +(m.actualTime - m.plannedTime).toFixed(1) : 0;
  const batDelta   = m ? +(m.batteryActual - m.batteryPlanned).toFixed(1) : 0;
  const scoreDelta = m ? m.operatorScore.after - m.operatorScore.before : 0;
  const effScore   = m?.efficiencyScore ?? 0;
  const effColor   = effScore >= 80 ? "#22c55e" : effScore >= 60 ? "#f59e0b" : "#ef4444";

  const F = "'Inter', system-ui, sans-serif";
  const deviated = isDeviated;
  const statusLabel = deviated ? "⚠ Deviated" : isCompleted ? "✓ Completed" : "Active";
  const statusCol   = deviated ? "#ef4444" : isCompleted ? "#22c55e" : sc;

  const { isDark } = useTheme();

  // Theme-aware palette — dark: slate-800/900, light: white/slate-50
  const C = isDark ? {
    bg:      "#1e293b",
    bgMuted: "#0f172a",
    tile:    "#334155",
    border:  "#334155",
    shadow:  "0 16px 48px rgba(0,0,0,0.6)",
    t1:      "#f8fafc",
    t2:      "#cbd5e1",
    t3:      "#94a3b8",
    t4:      "#64748b",
    t5:      "#475569",
  } : {
    bg:      "#ffffff",
    bgMuted: "#f8fafc",
    tile:    "#f1f5f9",
    border:  "#e2e8f0",
    shadow:  "0 16px 48px rgba(15,23,42,0.12)",
    t1:      "#0f172a",
    t2:      "#334155",
    t3:      "#64748b",
    t4:      "#94a3b8",
    t5:      "#cbd5e1",
  };

  const card = (
    <div
      style={{ width: 280, fontFamily: F, borderRadius: 12, overflow: "hidden", boxShadow: C.shadow, userSelect: "none", background: C.bg, border: `1px solid ${C.border}` }}
      onPointerDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >

      {/* ── Header ── */}
      <div style={{ padding: "12px 14px 10px", borderBottom: `1px solid ${C.border}` }}>

        {/* row 1: status pill + type chip + close */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: C.bgMuted, borderRadius: 20, padding: "3px 9px", border: `1px solid ${C.tile}` }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: sc, boxShadow: `0 0 6px ${sc}`, flexShrink: 0 }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: sc, letterSpacing: 0.8 }}>{st?.status.toUpperCase() ?? "ACTIVE"}</span>
          </div>
          <span style={{ fontSize: 9, fontWeight: 600, color: C.t3, background: C.bgMuted, border: `1px solid ${C.tile}`, borderRadius: 4, padding: "2px 8px", letterSpacing: 0.3 }}>{type}</span>
          <div style={{ flex: 1 }} />
        </div>

        {/* row 2: MHE ID + zone inline */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.t1, letterSpacing: -0.5, lineHeight: 1 }}>{mheId}</div>
          {st && <div style={{ fontSize: 11, color: C.t4 }}>{st.zone}</div>}
        </div>

        {/* row 3: current task */}
        {st && (
          <div style={{ marginTop: 8, padding: "6px 8px", background: C.bgMuted, borderRadius: 6, border: `1px solid ${C.tile}` }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: C.t5, letterSpacing: 0.6, marginBottom: 2 }}>CURRENT TASK</div>
            <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.4 }}>{st.task}</div>
          </div>
        )}
      </div>

      {/* ── Telemetry strip ── */}
      {st && (
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
          {[
            { label: "SPEED", value: String(st.speed), unit: "km/h", color: st.speed > 0 ? C.t1 : C.t4 },
            { label: "BATTERY", value: String(st.battery), unit: "%", color: batCol, bar: st.battery },
          ].map(({ label, value, unit, color: vc, bar }, i) => (
            <div key={label} style={{ flex: 1, padding: "9px 0", textAlign: "center", borderRight: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: C.t5, letterSpacing: 0.7, marginBottom: 4 }}>{label}</div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2, marginBottom: bar !== undefined ? 5 : 0 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: vc, lineHeight: 1 }}>{value}</span>
                <span style={{ fontSize: 9, color: C.t5 }}>{unit}</span>
              </div>
              {bar !== undefined && (
                <div style={{ margin: "0 auto", width: "64%", height: 3, background: C.tile, borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${bar}%`, background: batCol, borderRadius: 2 }} />
                </div>
              )}
            </div>
          ))}
          {/* Zone cell */}
          <div style={{ flex: 1, padding: "9px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: C.t5, letterSpacing: 0.7, marginBottom: 4 }}>ZONE</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.t2 }}>{st.zone}</div>
          </div>
        </div>
      )}

      {/* ── Task performance ── */}
      {m && (
        <div style={{ padding: "10px 12px 12px" }}>

          {/* Section header + status badge */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: C.t5, letterSpacing: 0.7, flex: 1 }}>TASK PERFORMANCE</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: statusCol, background: `${statusCol}1a`, border: `1px solid ${statusCol}40`, borderRadius: 20, padding: "2px 8px" }}>{statusLabel}</span>
          </div>

          {/* Efficiency + operator score tiles */}
          <div style={{ display: "flex", gap: 7, marginBottom: 7 }}>
            <div style={{ flex: 1, background: C.bgMuted, borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.tile}` }}>
              <div style={{ fontSize: 8, color: C.t5, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>EFFICIENCY</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 5 }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: effColor, lineHeight: 1 }}>{effScore}</span>
                <span style={{ fontSize: 10, color: C.t5 }}>%</span>
              </div>
              <div style={{ height: 3, background: C.tile, borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${effScore}%`, background: effColor, borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ flex: 1, background: C.bgMuted, borderRadius: 8, padding: "8px 10px", border: `1px solid ${C.tile}` }}>
              <div style={{ fontSize: 8, color: C.t5, fontWeight: 600, letterSpacing: 0.5, marginBottom: 4 }}>OP. SCORE</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 2 }}>
                <span style={{ fontSize: 11, color: C.t4 }}>{m.operatorScore.before}</span>
                <span style={{ fontSize: 9, color: C.t5 }}>→</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: scoreDelta < 0 ? "#ef4444" : "#22c55e", lineHeight: 1 }}>{m.operatorScore.after}</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: scoreDelta < 0 ? "#ef4444" : "#22c55e" }}>{scoreDelta > 0 ? "+" : ""}{scoreDelta} pts</div>
            </div>
          </div>

          {/* Distance + Time delta pills */}
          <div style={{ display: "flex", gap: 6, marginBottom: m.issues.length > 0 ? 7 : 0 }}>
            {[
              { label: "Distance", delta: distDelta, from: m.plannedDist, to: m.actualDist, unit: "m" },
              { label: "Time",     delta: timeDelta, from: m.plannedTime, to: m.actualTime, unit: "min" },
            ].map(({ label, delta, from, to, unit }) => {
              const bad = delta > 0;
              return (
                <div key={label} style={{ flex: 1, background: C.bgMuted, borderRadius: 7, padding: "6px 8px", border: `1px solid ${C.tile}` }}>
                  <div style={{ fontSize: 8, color: C.t5, fontWeight: 600, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 10, color: C.t4 }}>{from}{unit} → <span style={{ fontWeight: 700, color: bad ? "#ef4444" : "#22c55e" }}>{to}{unit}</span></div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: bad ? "#ef4444" : "#22c55e", marginTop: 1 }}>{bad ? "+" : ""}{delta}{unit}</div>
                </div>
              );
            })}
          </div>

          {/* Issues */}
          {m.issues.length > 0 && (
            <div style={{ background: isDark ? "rgba(220,38,38,0.10)" : "rgba(220,38,38,0.06)", borderRadius: 7, padding: "7px 9px", border: isDark ? "1px solid rgba(220,38,38,0.22)" : "1px solid rgba(220,38,38,0.18)" }}>
              {m.issues.map((issue, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: i < m.issues.length - 1 ? 4 : 0 }}>
                  <span style={{ color: "#ef4444", fontSize: 10, flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: 10, color: C.t3, lineHeight: 1.5 }}>{issue}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Html position={[0, 3.5, 0]} center zIndexRange={[200, 0]}>
      {card}
    </Html>
  );
}

// ─── TaskPathOverlay ──────────────────────────────────────────────────────────
export function TaskPathOverlay({ assignment, showImpact = false, showPath = false, onCloseImpact }: { assignment: TaskAssignment; showImpact?: boolean; showPath?: boolean; onCloseImpact?: () => void }) {
  const isDeviated  = assignment.status === "deviated";
  const isCompleted = assignment.status === "completed";
  const inProgress  = assignment.status === "in-progress";
  const cardPath = assignment.actualPath ?? assignment.plannedPath;
  const mid = cardPath[Math.floor(cardPath.length / 2)];

  return (
    <group>
      {/* Planned path — blue dashed — only when selected */}
      {showPath && <PathLine points={assignment.plannedPath} color="#1b59f8" width={0.18} dashed yOffset={0.06} opacity={0.75} />}
      {showPath && <PathArrows points={assignment.plannedPath} color="#1b59f8" />}

      {/* Actual path — colored solid — only when selected */}
      {showPath && (isDeviated || isCompleted) && assignment.actualPath && (
        <>
          <PathLine points={assignment.actualPath} color={isDeviated ? "#ef4444" : "#22c55e"} width={0.11} yOffset={0.09} opacity={0.9} />
          <PathArrows points={assignment.actualPath} color={isDeviated ? "#ef4444" : "#22c55e"} />
        </>
      )}

      {/* Deviation zone — only when selected */}
      {showPath && isDeviated && assignment.deviationZone && (
        <group>
          <mesh rotation={[-Math.PI/2, 0, 0]} position={[assignment.deviationZone.cx, 0.07, assignment.deviationZone.cz]}>
            <planeGeometry args={[assignment.deviationZone.w, assignment.deviationZone.d]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.10} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          {/* Dashed border */}
          {[[-1,0],[1,0],[0,-1],[0,1]].map(([dx, dz], i) => {
            const bw = dx !== 0 ? 0.12 : assignment.deviationZone!.w;
            const bd = dz !== 0 ? 0.12 : assignment.deviationZone!.d;
            const bx = assignment.deviationZone!.cx + dx * assignment.deviationZone!.w / 2;
            const bz = assignment.deviationZone!.cz + dz * assignment.deviationZone!.d / 2;
            return (
              <mesh key={i} rotation={[-Math.PI/2, 0, 0]} position={[bx, 0.08, bz]}>
                <planeGeometry args={[bw, bd]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
              </mesh>
            );
          })}
          <Html position={[assignment.deviationZone.cx, 1.2, assignment.deviationZone.cz]} center distanceFactor={18} zIndexRange={[120, 0]}>
            <div style={{
              background: "rgba(239,68,68,0.88)", color: "#fff", borderRadius: 4, padding: "2px 8px",
              fontSize: 8, fontWeight: 700, fontFamily: "system-ui,sans-serif", pointerEvents: "none", letterSpacing: 0.5,
            }}>DEVIATION ZONE</div>
          </Html>
        </group>
      )}

      {/* Start / End flags — only when selected */}
      {showPath && <StartEndMarker position={assignment.plannedPath[0]} type="start" />}
      {showPath && <StartEndMarker position={assignment.plannedPath[assignment.plannedPath.length - 1]} type="end" />}

      {/* In-progress badge */}
      {inProgress && (
        <Html position={[mid[0], 3.5, mid[2]]} center distanceFactor={20} zIndexRange={[150, 0]}>
          <div style={{
            background: "rgba(27,89,248,0.9)", color: "#fff", borderRadius: 6, padding: "5px 12px",
            fontSize: 10, fontWeight: 600, fontFamily: "system-ui,sans-serif", pointerEvents: "none",
            boxShadow: "0 2px 10px rgba(27,89,248,0.4)",
          }}>▶ {assignment.taskName} · {assignment.mheId} · On Route</div>
        </Html>
      )}
    </group>
  );
}

// ─── MHE Data ─────────────────────────────────────────────────────────────────
// Paths are aisle-only — no path should enter any rack AABB
// MAIN STORAGE north face = z -15.2 → aisle at z -14 is 1.2 units away (inside 1.5-unit safety zone → triggers near-miss)
const MHE_VEHICLES = [
  { id: "MHE-01", label: "MHE 01", type: "Forklift",             color: "#f59e0b", path: [[-20,0,-5],[-12,0,-5],[-12,0,2],[-20,0,2],[-20,0,-5]]    as [number,number,number][] },
  { id: "MHE-02", label: "MHE 02", type: "Reach Truck",          color: "#10b981", path: [[4,0,-12],[16,0,-12],[16,0,-7],[4,0,-7],[4,0,-12]]          as [number,number,number][] },
  { id: "MHE-03", label: "MHE 03", type: "Forklift",             color: "#fef08a", path: [[-8,0,5],[2,0,5],[2,0,10],[-8,0,10],[-8,0,5]]              as [number,number,number][] },
  { id: "MHE-04", label: "MHE 04", type: "Order Picker",         color: "#ec4899", path: [[2,0,-14],[18,0,-14],[18,0,-8],[2,0,-8],[2,0,-14]]          as [number,number,number][] },
  { id: "MHE-05", label: "MHE 05", type: "BPOT",                 color: "#06b6d4", path: [[-22,0,3],[-14,0,3],[-14,0,7],[-22,0,7],[-22,0,3]]         as [number,number,number][] },
  { id: "MHE-06", label: "MHE 06", type: "Forklift",             color: "#f97316", path: [[-2,0,-14],[10,0,-14],[10,0,-8],[-2,0,-8],[-2,0,-14]]       as [number,number,number][] },
];

const OPERATOR_DATA = [
  { id: "OP-01", name: "J. Smith",  position: [-18, 0, -4]  as [number,number,number], active: true  },
  { id: "OP-02", name: "A. Patel",  position: [12,  0, -10] as [number,number,number], active: true  },
  { id: "OP-03", name: "M. Lee",    position: [-4,  0,  6]  as [number,number,number], active: true  },
  { id: "OP-04", name: "T. Brown",  position: [14,  0, -16] as [number,number,number], active: false },
  { id: "OP-05", name: "R. Gomez",  position: [-20, 0,  5]  as [number,number,number], active: true  },
];

const EVENT_DATA = [
  { id: "E1", position: [-16, 0, -2]  as [number,number,number], label: "Impact",    severity: "critical" as EventSeverity, count: 1 },
  { id: "E2", position: [8,   0, -15] as [number,number,number], label: "Near Miss", severity: "warning"  as EventSeverity, count: 2 },
  { id: "E3", position: [-6,  0,  5]  as [number,number,number], label: "Slow Zone", severity: "info"     as EventSeverity, count: 1 },
  { id: "E4", position: [16,  0, -8]  as [number,number,number], label: "Impact",    severity: "critical" as EventSeverity, count: 3 },
];

// ─── Live MHE Status Data ────────────────────────────────────────────────────
type MHEStatus = "active" | "idle" | "loading" | "charging";
const MHE_STATUS_DATA: Record<string, {
  status: MHEStatus; operator: string; speed: number;
  battery: number; zone: string; task: string;
}> = {
  "MHE-01": { status: "active",   operator: "J. Smith",  speed: 8.2, battery: 74, zone: "Aisle C",        task: "Pallet Pick → Bay A-12"      },
  "MHE-02": { status: "active",   operator: "A. Patel",  speed: 6.5, battery: 58, zone: "Main Storage",   task: "Replenishment → Row B"        },
  "MHE-03": { status: "active",   operator: "M. Lee",    speed: 7.1, battery: 82, zone: "Staging Area",   task: "Outbound → Shipping Station"  },
  "MHE-04": { status: "loading",  operator: "T. Brown",  speed: 0.0, battery: 91, zone: "Bulk Storage",   task: "Order Pick · Bay D-08"        },
  "MHE-05": { status: "charging", operator: "R. Gomez",  speed: 0.0, battery: 34, zone: "Charging Bay",   task: "Standby · Awaiting Next Task" },
  "MHE-06": { status: "active",   operator: "D. Kim",    speed: 9.4, battery: 67, zone: "Aisle A",        task: "Pallet Move → QC Station"     },
};

const STATUS_COLOR: Record<MHEStatus, string> = {
  active: "#22c55e", idle: "#6b7280", loading: "#f59e0b", charging: "#3b82f6",
};

// ─── Shared MHE live-state ref ────────────────────────────────────────────────
export type MHELiveState = { x: number; z: number; angle: number };

// ─── ViewModeController ──────────────────────────────────────────────────────
export type ViewMode = "2d" | "3d" | "avatar" | "focus";

const VIEW_PRESETS: Record<Exclude<ViewMode,"avatar">, { cam: [number,number,number]; tgt: [number,number,number] }> = {
  "3d":    { cam: [55, 42, 45],  tgt: [2, 0, -5] },
  "2d":    { cam: [2, 100, -5],  tgt: [2, 0, -5] },
  "focus": { cam: [2, 28, 18],   tgt: [2, 0, -5] },
};

function ViewModeController({
  mode,
  mheStateRef,
  followMheId,
}: {
  mode: ViewMode;
  mheStateRef: React.MutableRefObject<Map<string, MHELiveState>>;
  followMheId: string | null;
}) {
  const { camera, controls } = useThree();

  // Refs so useFrame always reads latest values — no stale closures
  const modeRef    = useRef(mode);
  const followRef  = useRef(followMheId);
  useEffect(() => { modeRef.current   = mode; },        [mode]);
  useEffect(() => { followRef.current = followMheId; }, [followMheId]);

  // One-time transition anim for non-avatar modes
  const animRef = useRef<{
    fromCam: THREE.Vector3; toCam: THREE.Vector3;
    fromTarget: THREE.Vector3; toTarget: THREE.Vector3;
    t: number;
  } | null>(null);

  useEffect(() => {
    if (mode === "avatar") { animRef.current = null; return; }
    if (!controls) return;
    const ctrl = controls as any;
    const preset = VIEW_PRESETS[mode as Exclude<ViewMode, "avatar">];
    animRef.current = {
      fromCam:    camera.position.clone(),
      toCam:      new THREE.Vector3(...preset.cam),
      fromTarget: ctrl.target.clone(),
      toTarget:   new THREE.Vector3(...preset.tgt),
      t: 0,
    };
  }, [mode]);

  // Smoothed vectors for avatar follow-cam
  const smoothCam     = useRef(new THREE.Vector3());
  const smoothTgt     = useRef(new THREE.Vector3());
  const avatarInit    = useRef(false);
  const prevFollowId  = useRef<string | null>(null);

  useEffect(() => {
    if (mode !== "avatar") avatarInit.current = false;
  }, [mode]);

  useFrame(() => {
    const ctrl = controls as any;
    if (!ctrl) return;

    // ── Avatar / Google-Maps follow-cam ──────────────────────────────────────
    if (modeRef.current === "avatar") {
      const id    = followRef.current ?? MHE_VEHICLES[0].id;
      const state = mheStateRef.current.get(id);
      if (!state) return;

      const { x, z, angle } = state;
      const dx = Math.sin(angle);
      const dz = Math.cos(angle);

      const desiredCam = new THREE.Vector3(x - dx * 9, 3.5, z - dz * 9);
      const desiredTgt = new THREE.Vector3(x + dx * 5, 1.2, z + dz * 5);

      // Re-seed when entering avatar mode OR switching to a different MHE
      if (!avatarInit.current || prevFollowId.current !== id) {
        smoothCam.current.copy(camera.position);
        smoothTgt.current.copy(ctrl.target);
        avatarInit.current   = true;
        prevFollowId.current = id;
      }

      smoothCam.current.lerp(desiredCam, 0.07);
      smoothTgt.current.lerp(desiredTgt, 0.07);

      camera.position.copy(smoothCam.current);
      ctrl.target.copy(smoothTgt.current);
      ctrl.update();
      return;
    }

    // ── One-time transition for 2d / 3d / focus ───────────────────────────
    const a = animRef.current;
    if (!a) return;
    a.t = Math.min(a.t + 0.04, 1);
    const ease = 1 - Math.pow(1 - a.t, 3);
    camera.position.lerpVectors(a.fromCam, a.toCam, ease);
    ctrl.target.lerpVectors(a.fromTarget, a.toTarget, ease);
    ctrl.update();
    if (a.t >= 1) animRef.current = null;
  });

  return null;
}

// ─── CameraAnimator ──────────────────────────────────────────────────────────
// Zooms to the MHE's LIVE position when mheId changes, not a static waypoint.
function CameraAnimator({
  mheId,
  mheStateRef,
}: {
  mheId: string | null;
  mheStateRef: React.MutableRefObject<Map<string, MHELiveState>>;
}) {
  const { camera, controls } = useThree();
  const animRef = useRef<{
    fromCam: THREE.Vector3; toCam: THREE.Vector3;
    fromTarget: THREE.Vector3; toTarget: THREE.Vector3;
    t: number;
  } | null>(null);

  useEffect(() => {
    if (!mheId || !controls) return;
    const ctrl = controls as any;

    // Grab live position — fall back to orbit target if MHE hasn't moved yet
    const live  = mheStateRef.current.get(mheId);
    const tx    = live?.x ?? ctrl.target.x;
    const tz    = live?.z ?? ctrl.target.z;
    const focus = new THREE.Vector3(tx, 0, tz);

    // Tight isometric view: 14 units above, 12 units diagonally back
    const toCam = new THREE.Vector3(tx + 12, 14, tz + 12);

    animRef.current = {
      fromCam:    camera.position.clone(),
      toCam,
      fromTarget: ctrl.target.clone(),
      toTarget:   focus,
      t: 0,
    };
  }, [mheId]);

  useFrame(() => {
    const a = animRef.current;
    if (!a || !controls) return;
    const ctrl = controls as any;

    a.t = Math.min(a.t + 0.045, 1);
    const ease = 1 - Math.pow(1 - a.t, 3); // cubic ease-out

    camera.position.lerpVectors(a.fromCam, a.toCam, ease);
    ctrl.target.lerpVectors(a.fromTarget, a.toTarget, ease);
    ctrl.update();

    if (a.t >= 1) animRef.current = null;
  });

  return null;
}

// ─── WarehouseScene (the full Three.js scene — no Canvas wrapper) ─────────────
export function WarehouseScene({
  onSelectMHE,
  taskAssignments = [],
  onNearMiss,
  viewMode = "3d",
}: {
  onSelectMHE?: (id: string) => void;
  taskAssignments?: TaskAssignment[];
  onNearMiss?: (e: NearMissEvent) => void;
  viewMode?: ViewMode;
} = {}) {
  const [selectedMHE, setSelectedMHE] = useState<string | null>(null);
  const [hoveredMHE,  setHoveredMHE]  = useState<string | null>(null);
  const [impactMHE, setImpactMHE]     = useState<string | null>(null);
  // Shared ref: keys are rack IDs that are currently "hot" (MHE nearby)
  const hotRacksRef = useRef<Set<string>>(new Set());
  // Live MHE positions updated every frame by AnimatedMHE
  const mheStateRef = useRef<Map<string, MHELiveState>>(new Map());

  // Derived: if any task assignment exists, that MHE is "focused"; others are dimmed
  const focusedMheId = taskAssignments.length > 0 ? taskAssignments[0].mheId : null;

  const handleSelect = (id: string) => {
    setSelectedMHE(prev => prev === id ? null : id);
    onSelectMHE?.(id);
  };

  const handleDoubleSelect = (id: string) => {
    setImpactMHE(prev => prev === id ? null : id);
  };

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[25, 40, 20]} intensity={1.4} castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5} shadow-camera-far={200}
        shadow-camera-left={-70} shadow-camera-right={70}
        shadow-camera-top={70}  shadow-camera-bottom={-70}
      />
      <directionalLight position={[-15, 25, -10]} intensity={0.5} />
      {/* Warm fill from front */}
      <directionalLight position={[0, 8, 30]} intensity={0.28} color="#fff8e0" />

      {/* Large ground plane — click anywhere on empty floor to deselect */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow onClick={() => setSelectedMHE(null)}>
        <planeGeometry args={[140, 140]} />
        <meshLambertMaterial color="#c8c8c8" />
      </mesh>

      {/* Building */}
      <WarehouseBuilding />

      {/* ── Rack sections ── */}
      <RackSection label="SIDE STORAGE"  sublabel="2 ROWS × 6 BAYS"  rows={2} bays={6}  position={[-26, 0, -13]} rowLetter="A" labelStart={1}  />
      <RackSection label="MAIN STORAGE"  sublabel="4 ROWS × 21 BAYS" rows={4} bays={21} position={[-4,  0, -19]} rowLetter="A" labelStart={3}  />
      <RackSection label="BULK STORAGE"  sublabel="2 ROWS × 12 BAYS" rows={2} bays={12} position={[6,   0,  2]}  rowLetter="A" labelStart={10} />

      {/* ── Aisle markers ── */}
      <AisleMarker position={[-1, 0.1, -13]}  label="AISLE A" />
      <AisleMarker position={[4,  0.1, -4]}   label="AISLE B" />
      <AisleMarker position={[-8, 0.1, -5]}   label="AISLE C" />
      <AisleMarker position={[20, 0.1, -12]}  label="AISLE D" />

      {/* ── Floor zones ── */}
      <FloorZone position={[-28, 0, 0]}  width={15} depth={11} color="#8a8a8a" borderColor="#6e6e6e" labelText="Pallet Receiving" labelSub="Inbound" />
      <FloorZone position={[-8, 0, 12]}  width={19} depth={9}  color="#8a8a8a" borderColor="#6e6e6e" labelText="Shipping Station" labelSub="Outbound" rotation={[0, 0.12, 0]} />
      <FloorZone position={[22, 0, -4]}  width={12} depth={8}  color="#8a8a8a" borderColor="#6e6e6e" labelText="Charging Bay"     labelSub="MHE Charging" />
      <FloorZone position={[5,  0, 10]}  width={8}  depth={6}  color="#8a8a8a" borderColor="#6e6e6e" labelText="QC Station"        labelSub="Quality Check" />
      <AreaLabel position={[-14, 0.2, 3]} text="Open Workflow" sub="Staging Area" />

      {/* ── Rack safety zones (amber → red when MHE is near) ── */}
      {RACK_BOUNDS.map(r => (
        <RackSafetyZone key={r.id} rack={r} hotRacksRef={hotRacksRef} />
      ))}

      {/* ── Animated MHEs ── */}
      {MHE_VEHICLES.map((v, i) => {
        const isSelected = selectedMHE === v.id;
        const assignment = isSelected ? taskAssignments.find(a => a.mheId === v.id) : undefined;
        return (
          <AnimatedMHE
            key={v.id}
            id={v.id}
            label={v.label}
            type={v.type}
            color={v.color}
            position={v.path[0]}
            path={v.path}
            speed={0.7 + i * 0.08}
            selected={isSelected}
            onSelect={handleSelect}
            onDoubleSelect={handleDoubleSelect}
            onHover={setHoveredMHE}
            hotRacksRef={hotRacksRef}
            mheStateRef={mheStateRef}
            humanPositions={HUMAN_SPOTS.map(h => h.pos)}
            onNearMiss={onNearMiss}
            dimmed={
              selectedMHE !== null
                ? !isSelected
                : focusedMheId !== null && v.id !== focusedMheId
            }
            infoCardNode={isSelected ? (
              <MHEInfoCard
                mheId={v.id}
                position={[0, 0, 0]}
                color={v.color}
                type={v.type}
                assignment={assignment}
              />
            ) : undefined}
          />
        );
      })}

      {/* ── Selected MHE: route highlight ── */}
      {selectedMHE && (() => {
        const v = MHE_VEHICLES.find(mv => mv.id === selectedMHE);
        if (!v) return null;
        return (
          <group>
            <PathLine points={v.path} color="#3b82f6" opacity={0.9} />
            <PathArrows points={v.path} color="#3b82f6" />
          </group>
        );
      })()}

      {/* ── Task path overlays ── */}
      {taskAssignments.map(a => (
        <TaskPathOverlay
          key={a.id}
          assignment={a}
          showPath={selectedMHE === a.mheId}
        />
      ))}

      {/* ── Warehouse workers (proximity-detection-aware) ── */}
      {HUMAN_SPOTS.map(h => (
        <HumanFigure key={h.id} pos={h.pos} name={h.name} mheStateRef={mheStateRef} />
      ))}

      <OrbitControls
        ref={(controls: any) => { if (controls) controls.zoomToCursor = true; }}
        makeDefault
        target={[2, 0, -5]}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={2} maxDistance={120}
        zoomSpeed={1.2} panSpeed={0.8}
        screenSpacePanning
      />

      {/* View mode camera controller */}
      <ViewModeController
        mode={viewMode}
        mheStateRef={mheStateRef}
        followMheId={selectedMHE ?? MHE_VEHICLES[0].id}
      />

      {/* Zoom to selected MHE live position — skip when avatar-following */}
      {viewMode !== "avatar" && (
        <CameraAnimator mheId={selectedMHE} mheStateRef={mheStateRef} />
      )}
    </>
  );
}
