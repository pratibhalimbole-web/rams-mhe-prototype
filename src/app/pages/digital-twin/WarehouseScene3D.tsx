/**
 * Shared Three.js warehouse scene — imported by both the Digital Twin 3D Map
 * page and the MHE Command Center page.
 */
import { useRef, useEffect, useState, useMemo } from "react";
import { OrbitControls, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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
  rows, bays, position, label, sublabel,
}: {
  rows: number; bays: number;
  position: [number, number, number];
  label: string; sublabel: string;
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

  // Bay number labels every 3 bays
  const bayLabels = [];
  for (let b = 0; b < bays; b += 3) {
    bayLabels.push(
      <Html key={b} position={[b * BAY_W + BAY_W * 1.5, 0.25, -0.4]} center distanceFactor={14} zIndexRange={[30, 0]}>
        <div style={{
          fontSize: 7, color: "#888", fontFamily: "system-ui,sans-serif",
          pointerEvents: "none", fontWeight: 500,
        }}>B{String(b + 1).padStart(2, "0")}</div>
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
      <Html position={[totalW / 2, RACK_H + 1.0, totalD / 2]} center distanceFactor={22} zIndexRange={[100, 0]}>
        <div style={{
          background: "white", border: "1px solid #d1d5db", borderRadius: 4,
          padding: "3px 8px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
          pointerEvents: "none", fontFamily: "system-ui,sans-serif",
          boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
        }}>
          {label}{" "}
          <span style={{ fontSize: 9, fontWeight: 400, color: "#888" }}>· {sublabel}</span>
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
  selected?: boolean;
  dimmed?: boolean; // true = gray + low opacity (other MHEs when one is focused)
};

function MHEVehicle({ id, label, type, color, position, rotation = 0, onSelect, onDoubleSelect, selected, dimmed }: MHEVehicleProps) {
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
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
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
}) {
  const { path, speed = 1.2, onNearMiss, hotRacksRef, ...vehicleProps } = props;
  const groupRef = useRef<THREE.Group>(null);
  const tRef = useRef(Math.random()); // stagger start
  const trailRef = useRef<THREE.Points>(null);
  const trailPositions = useRef<Float32Array>(new Float32Array(30 * 3));
  const trailIdx = useRef(0);
  const lastAlertAt  = useRef<Record<string, number>>({});
  const clearTimers  = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const ALERT_COOLDOWN = 6000; // ms between alerts for the same mhe+rack pair

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
  });

  return (
    <>
      <group ref={groupRef}>
        <MHEVehicle {...vehicleProps} position={[0, 0, 0]} rotation={0} />
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
  // Only border lines — no fill plane so the floor stays clean
  const bordRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame(() => {
    const hot = hotRacksRef.current.has(rack.id);
    const color = hot ? "#ef4444" : "#f59e0b";
    bordRefs.current.forEach(m => {
      if (!m) return;
      m.color.set(color);
      m.opacity = hot ? 1.0 : 0.55;
    });
  });

  const cx = (rack.xMin + rack.xMax) / 2;
  const cz = (rack.zMin + rack.zMax) / 2;
  const sw = (rack.xMax - rack.xMin) + SAFETY_MARGIN * 2;
  const sd = (rack.zMax - rack.zMin) + SAFETY_MARGIN * 2;
  // Dashed border: alternate solid/gap segments along each edge
  const T = 0.10, H = 0.06;

  const borders = [
    { pos: [cx, H/2, rack.zMin - SAFETY_MARGIN] as [number,number,number], size: [sw, H, T] as [number,number,number] },
    { pos: [cx, H/2, rack.zMax + SAFETY_MARGIN] as [number,number,number], size: [sw, H, T] as [number,number,number] },
    { pos: [rack.xMin - SAFETY_MARGIN, H/2, cz]  as [number,number,number], size: [T, H, sd] as [number,number,number] },
    { pos: [rack.xMax + SAFETY_MARGIN, H/2, cz]  as [number,number,number], size: [T, H, sd] as [number,number,number] },
  ];

  return (
    <group>
      {borders.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshBasicMaterial ref={el => { bordRefs.current[i] = el; }} color="#f59e0b" transparent opacity={0.55} />
        </mesh>
      ))}
      {/* Corner diamonds */}
      {([
        [rack.xMin - SAFETY_MARGIN, rack.zMin - SAFETY_MARGIN],
        [rack.xMax + SAFETY_MARGIN, rack.zMin - SAFETY_MARGIN],
        [rack.xMax + SAFETY_MARGIN, rack.zMax + SAFETY_MARGIN],
        [rack.xMin - SAFETY_MARGIN, rack.zMax + SAFETY_MARGIN],
      ] as [number,number][]).map(([bx, bz], i) => (
        <mesh key={`c${i}`} position={[bx, 0.1, bz]} rotation={[0, Math.PI/4, 0]}>
          <boxGeometry args={[0.28, 0.08, 0.28]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.7} />
        </mesh>
      ))}
      <Html position={[cx, 0.5, rack.zMin - SAFETY_MARGIN - 0.5]} center distanceFactor={22} zIndexRange={[45, 0]}>
        <div style={{
          background: "rgba(245,158,11,0.85)", color: "#fff",
          borderRadius: 3, padding: "1px 7px",
          fontSize: 7, fontWeight: 700, fontFamily: "system-ui,sans-serif",
          pointerEvents: "none", letterSpacing: 0.5, whiteSpace: "nowrap",
        }}>⚠ {rack.label.toUpperCase()} SAFETY ZONE</div>
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
// Renders a vertical wall ribbon along the path so it's visible from any angle.
// Planned path uses dashed=true (gaps in the wall); actual path is solid.
const WALL_H    = 0.22; // ribbon height in world units
const WALL_T    = 0.06; // ribbon thickness

function PathLine({ points, color, opacity = 0.88, dashed = false }: {
  points: [number,number,number][];
  color: string; opacity?: number; dashed?: boolean;
  // yOffset and width are unused — kept for call-site compat
  yOffset?: number; width?: number;
}) {
  const segs: { cx: number; cz: number; len: number; angle: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const [sx,, sz] = points[i];
    const [ex,, ez] = points[i + 1];
    const len = Math.sqrt((ex-sx)**2 + (ez-sz)**2);
    const angle = Math.atan2(ex-sx, ez-sz);
    if (!dashed) {
      segs.push({ cx: (sx+ex)/2, cz: (sz+ez)/2, len, angle });
    } else {
      const DASH = 0.7, TOTAL = 1.2;
      const count = Math.max(1, Math.floor(len / TOTAL));
      for (let d = 0; d < count; d++) {
        const t0 = (d * TOTAL) / len;
        const t1 = Math.min((d * TOTAL + DASH) / len, 1);
        segs.push({ cx: sx+(ex-sx)*(t0+t1)/2, cz: sz+(ez-sz)*(t0+t1)/2, len: len*(t1-t0), angle });
      }
    }
  }
  return (
    <>
      {segs.map((s, i) => (
        <mesh key={i} position={[s.cx, WALL_H / 2, s.cz]} rotation={[0, s.angle, 0]}>
          <boxGeometry args={[WALL_T, WALL_H, s.len]} />
          <meshBasicMaterial color={color} transparent opacity={opacity} />
        </mesh>
      ))}
    </>
  );
}

// ─── PathArrows ───────────────────────────────────────────────────────────────
// Direction chevrons at the top of the wall ribbon (visible above rack floor)
function PathArrows({ points, color }: { points: [number,number,number][]; color: string }) {
  return (
    <>
      {points.slice(1).map(([ex,, ez], i) => {
        const [sx,, sz] = points[i];
        const mx = (sx+ex)/2, mz = (sz+ez)/2;
        const angle = Math.atan2(ex-sx, ez-sz);
        return (
          <group key={i} position={[mx, WALL_H + 0.1, mz]} rotation={[0, angle, 0]}>
            <mesh rotation={[Math.PI/2, 0, 0]}>
              <coneGeometry args={[0.13, 0.28, 6]} />
              <meshBasicMaterial color={color} transparent opacity={0.85} />
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

// ─── TaskImpactCard ───────────────────────────────────────────────────────────
function TaskImpactCard({ position, assignment, onClose }: {
  position: [number,number,number];
  assignment: TaskAssignment;
  onClose?: () => void;
}) {
  const m          = assignment.metrics!;
  const isDeviated = assignment.status === "deviated";
  const accent     = isDeviated ? "#ef4444" : "#22c55e";

  const distDelta  = m.actualDist - m.plannedDist;
  const timeDelta  = +(m.actualTime - m.plannedTime).toFixed(1);
  const batDelta   = +(m.batteryActual - m.batteryPlanned).toFixed(1);
  const scoreDelta = m.operatorScore.after - m.operatorScore.before;

  // Uses CSS variables from the app's design system — auto-responds to dark/light mode
  const s = {
    card:     "var(--w-bg)",
    surface:  "var(--w-bg-muted)",
    border:   "var(--w-border)",
    txt1:     "var(--w-text-1)",
    txt2:     "var(--w-text-2)",
    txt3:     "var(--w-text-3)",
    chip:     "var(--w-bg-muted)",
  } as const;

  const neg = isDeviated ? "var(--w-red-bg)" : "var(--w-green-bg)";
  const negBd = isDeviated ? "var(--w-red-border)" : "var(--w-green-border)";
  const negTxt = isDeviated ? "#ef4444" : "#22c55e";

  const effScore = m.efficiencyScore;
  const effColor = effScore >= 80 ? "#22c55e" : effScore >= 60 ? "#f59e0b" : "#ef4444";
  const effBg    = effScore >= 80 ? "var(--w-green-bg)" : effScore >= 60 ? "var(--w-amber-bg)" : "var(--w-red-bg)";

  const MetricChip = ({ label, planned, actual, delta, bad }: {
    label: string; planned: string; actual: string; delta: string; bad: boolean;
  }) => {
    const chipAccent = bad ? "#ef4444" : "#22c55e";
    const chipBg     = bad ? "var(--w-red-bg)" : "var(--w-green-bg)";
    return (
      <div style={{
        flex: 1, background: s.chip, borderRadius: 8,
        border: `1px solid ${s.border}`, padding: "8px 8px 6px",
        display: "flex", flexDirection: "column", gap: 4, minWidth: 0,
      }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: s.txt3, letterSpacing: 0.6 }}>{label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 7, color: s.txt3, marginBottom: 1 }}>Plan</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.txt1 }}>{planned}</div>
          </div>
          <div style={{ fontSize: 9, color: s.txt3, flexShrink: 0 }}>→</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 7, color: s.txt3, marginBottom: 1 }}>Actual</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: chipAccent }}>{actual}</div>
          </div>
        </div>
        <div style={{
          fontSize: 9, fontWeight: 700, textAlign: "center",
          color: chipAccent, background: chipBg,
          borderRadius: 4, padding: "2px 4px",
        }}>{delta}</div>
      </div>
    );
  };

  return (
    <Html position={[position[0], 6.5, position[2]]} center zIndexRange={[200, 0]}>
      <div style={{
        background: s.card,
        border: `1px solid ${s.border}`,
        borderTop: `3px solid ${accent}`,
        borderRadius: 12,
        width: 280,
        fontFamily: "'Inter', system-ui, sans-serif",
        boxShadow: "0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)",
        pointerEvents: "none",
      }}>

        {/* ── Header ── */}
        <div style={{ padding: "10px 12px 9px", display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
              <span style={{
                background: neg, color: negTxt, border: `1px solid ${negBd}`,
                fontSize: 8, fontWeight: 700, letterSpacing: 0.5,
                borderRadius: 4, padding: "2px 7px", whiteSpace: "nowrap",
              }}>
                {isDeviated ? "⚠ DEVIATION" : "✓ COMPLETED"}
              </span>
              <span style={{ fontSize: 9, color: s.txt2, fontWeight: 500 }}>{assignment.mheId}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.txt1, lineHeight: 1.3 }}>
              {assignment.taskName}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              pointerEvents: "auto", cursor: "pointer",
              background: s.surface, border: `1px solid ${s.border}`,
              color: s.txt2, borderRadius: 6,
              width: 24, height: 24, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, lineHeight: 1, padding: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = s.txt1; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = s.txt2; }}
          >×</button>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: s.border }} />

        {/* ── Metric chips ── */}
        <div style={{ padding: "10px 12px", display: "flex", gap: 6 }}>
          <MetricChip label="DISTANCE" planned={`${m.plannedDist}m`} actual={`${m.actualDist}m`}
            delta={distDelta > 0 ? `+${distDelta}m` : `${distDelta}m`} bad={distDelta > 0} />
          <MetricChip label="TIME" planned={`${m.plannedTime}m`} actual={`${m.actualTime}m`}
            delta={timeDelta > 0 ? `+${timeDelta}m` : `${timeDelta}m`} bad={timeDelta > 0} />
          <MetricChip label="BATTERY" planned={`${m.batteryPlanned}%`} actual={`${m.batteryActual}%`}
            delta={batDelta > 0 ? `+${batDelta}%` : `${batDelta}%`} bad={batDelta > 0} />
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: s.border }} />

        {/* ── Efficiency ── */}
        <div style={{ padding: "9px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 9, fontWeight: 600, color: s.txt2, letterSpacing: 0.4 }}>ROUTE EFFICIENCY</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: effColor,
              background: effBg, borderRadius: 4, padding: "1px 7px",
            }}>{effScore}%</span>
          </div>
          <div style={{ background: s.surface, borderRadius: 4, height: 6 }}>
            <div style={{
              height: "100%", borderRadius: 4, width: `${effScore}%`,
              background: effColor,
            }} />
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: s.border }} />

        {/* ── Operator score ── */}
        <div style={{ padding: "9px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 600, color: s.txt2, letterSpacing: 0.4, marginBottom: 4 }}>
              OPERATOR SCORE
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: s.txt2 }}>{m.operatorScore.before}</span>
              <span style={{ fontSize: 10, color: s.txt3 }}>→</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: scoreDelta < 0 ? "#ef4444" : "#22c55e" }}>
                {m.operatorScore.after}
              </span>
              <span style={{ fontSize: 9, color: s.txt3 }}>/ 100</span>
            </div>
          </div>
          <div style={{
            fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 6,
            color: scoreDelta < 0 ? "#ef4444" : "#22c55e",
            background: scoreDelta < 0 ? "var(--w-red-bg)" : "var(--w-green-bg)",
            border: `1px solid ${scoreDelta < 0 ? "var(--w-red-border)" : "var(--w-green-border)"}`,
          }}>{scoreDelta > 0 ? "+" : ""}{scoreDelta} pts</div>
        </div>

        {/* ── Issues ── */}
        {m.issues.length > 0 && (
          <>
            <div style={{ height: 1, background: s.border }} />
            <div style={{ background: s.surface, borderRadius: "0 0 12px 12px", padding: "8px 12px 10px" }}>
              <div style={{ fontSize: 8, fontWeight: 700, color: s.txt3, letterSpacing: 0.5, marginBottom: 5 }}>
                ISSUES
              </div>
              {m.issues.map((issue, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: i < m.issues.length - 1 ? 4 : 0 }}>
                  <span style={{ color: negTxt, fontSize: 9, flexShrink: 0, marginTop: 1 }}>•</span>
                  <span style={{ fontSize: 9, color: s.txt2, lineHeight: 1.5 }}>{issue}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Html>
  );
}

// ─── TaskPathOverlay ──────────────────────────────────────────────────────────
export function TaskPathOverlay({ assignment, showImpact = false, onCloseImpact }: { assignment: TaskAssignment; showImpact?: boolean; onCloseImpact?: () => void }) {
  const isDeviated  = assignment.status === "deviated";
  const isCompleted = assignment.status === "completed";
  const inProgress  = assignment.status === "in-progress";
  const cardPath = assignment.actualPath ?? assignment.plannedPath;
  const mid = cardPath[Math.floor(cardPath.length / 2)];

  return (
    <group>
      {/* Planned path — blue dashed */}
      <PathLine points={assignment.plannedPath} color="#1b59f8" width={0.18} dashed yOffset={0.06} opacity={0.75} />
      <PathArrows points={assignment.plannedPath} color="#1b59f8" />

      {/* Actual path — colored solid */}
      {(isDeviated || isCompleted) && assignment.actualPath && (
        <>
          <PathLine points={assignment.actualPath} color={isDeviated ? "#ef4444" : "#22c55e"} width={0.11} yOffset={0.09} opacity={0.9} />
          <PathArrows points={assignment.actualPath} color={isDeviated ? "#ef4444" : "#22c55e"} />
        </>
      )}

      {/* Deviation zone */}
      {isDeviated && assignment.deviationZone && (
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

      {/* Start / End flags */}
      <StartEndMarker position={assignment.plannedPath[0]} type="start" />
      <StartEndMarker position={assignment.plannedPath[assignment.plannedPath.length - 1]} type="end" />

      {/* Impact card — only when MHE is clicked */}
      {showImpact && assignment.metrics && (isDeviated || isCompleted) && (
        <TaskImpactCard position={mid} assignment={assignment} onClose={onCloseImpact} />
      )}

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

// ─── MHE Status Card ─────────────────────────────────────────────────────────
function MHEStatusCard({ mheId, pathMid, color, type, onClose }: {
  mheId: string; pathMid: [number,number,number];
  color: string; type: string; onClose: () => void;
}) {
  const s = MHE_STATUS_DATA[mheId];
  if (!s) return null;

  const sc      = STATUS_COLOR[s.status];
  const batCol  = s.battery > 60 ? "#22c55e" : s.battery > 30 ? "#f59e0b" : "#ef4444";
  const sl      = s.status.toUpperCase();

  return (
    <Html position={[pathMid[0], 5.5, pathMid[2]]} center zIndexRange={[200, 0]}>
      <div style={{
        background: "#0f172a",
        border: `1px solid rgba(255,255,255,0.1)`,
        borderTop: `3px solid ${color}`,
        borderRadius: 12,
        width: 272,
        fontFamily: "'Inter', system-ui, sans-serif",
        boxShadow: "0 20px 60px rgba(0,0,0,0.65)",
        overflow: "hidden",
        userSelect: "none",
      }}>

        {/* ── Header ── */}
        <div style={{ padding: "10px 12px 9px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
            background: sc, boxShadow: `0 0 8px ${sc}`,
          }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: sc, letterSpacing: 0.8 }}>{sl}</span>
          <span style={{
            fontSize: 9, background: `${color}22`, color, border: `1px solid ${color}44`,
            borderRadius: 4, padding: "1px 7px", fontWeight: 600, marginLeft: 2,
          }}>{type}</span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 14, fontWeight: 800, color: "#f1f5f9", letterSpacing: 0.3 }}>{mheId}</span>
          <button
            onClick={onClose}
            style={{
              pointerEvents: "auto", cursor: "pointer",
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#94a3b8", borderRadius: 6,
              width: 22, height: 22, flexShrink: 0, marginLeft: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, lineHeight: 1, padding: 0,
            }}
          >×</button>
        </div>

        {/* Operator row */}
        <div style={{ padding: "0 12px 9px", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 20, height: 20, borderRadius: "50%",
            background: `${color}30`, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 700, color,
          }}>{s.operator.charAt(0)}</div>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>{s.operator}</span>
          <span style={{ fontSize: 9, color: "#475569", marginLeft: "auto" }}>· {s.zone}</span>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

        {/* Task */}
        <div style={{ padding: "9px 12px" }}>
          <div style={{ fontSize: 8, color: "#475569", fontWeight: 700, letterSpacing: 0.6, marginBottom: 4 }}>CURRENT TASK</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4 }}>{s.task}</div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />

        {/* Metrics strip */}
        <div style={{ padding: "9px 12px", display: "flex", gap: 0 }}>

          {/* Speed */}
          <div style={{ flex: 1, paddingRight: 10, borderRight: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 8, color: "#475569", fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 }}>SPEED</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: s.speed > 0 ? "#f1f5f9" : "#6b7280", lineHeight: 1 }}>{s.speed}</span>
              <span style={{ fontSize: 9, color: "#475569" }}>km/h</span>
            </div>
          </div>

          {/* Battery */}
          <div style={{ flex: 1.2, padding: "0 10px", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{ fontSize: 8, color: "#475569", fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 }}>BATTERY</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 5 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: batCol, lineHeight: 1 }}>{s.battery}</span>
              <span style={{ fontSize: 9, color: "#475569" }}>%</span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${s.battery}%`, background: batCol, borderRadius: 2, transition: "width 0.4s" }} />
            </div>
          </div>

          {/* Zone */}
          <div style={{ flex: 1, paddingLeft: 10 }}>
            <div style={{ fontSize: 8, color: "#475569", fontWeight: 700, letterSpacing: 0.5, marginBottom: 3 }}>LOCATION</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.35 }}>{s.zone}</div>
          </div>

        </div>

      </div>
    </Html>
  );
}

// ─── WarehouseScene (the full Three.js scene — no Canvas wrapper) ─────────────
export function WarehouseScene({
  onSelectMHE,
  taskAssignments = [],
  onNearMiss,
}: {
  onSelectMHE?: (id: string) => void;
  taskAssignments?: TaskAssignment[];
  onNearMiss?: (e: NearMissEvent) => void;
} = {}) {
  const [selectedMHE, setSelectedMHE] = useState<string | null>(null);
  const [impactMHE, setImpactMHE]     = useState<string | null>(null);
  // Shared ref: keys are rack IDs that are currently "hot" (MHE nearby)
  const hotRacksRef = useRef<Set<string>>(new Set());

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

      {/* Large ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshLambertMaterial color="#c8c8c8" />
      </mesh>

      {/* Building */}
      <WarehouseBuilding />

      {/* ── Rack sections ── */}
      <RackSection label="SIDE STORAGE"  sublabel="2 ROWS × 6 BAYS"  rows={2} bays={6}  position={[-26, 0, -13]} />
      <RackSection label="MAIN STORAGE"  sublabel="4 ROWS × 21 BAYS" rows={4} bays={21} position={[-4,  0, -19]} />
      <RackSection label="BULK STORAGE"  sublabel="2 ROWS × 12 BAYS" rows={2} bays={12} position={[6,   0,  2]}  />

      {/* ── Row labels ── */}
      <RowLabel position={[-26, 0.3, -12]}   text="Row A" />
      <RowLabel position={[-26, 0.3, -11.1]} text="Row B" />
      <RowLabel position={[-4,  0.3, -18.9]} text="Row A" />
      <RowLabel position={[-4,  0.3, -18.0]} text="Row B" />
      <RowLabel position={[-4,  0.3, -17.1]} text="Row C" />
      <RowLabel position={[-4,  0.3, -16.2]} text="Row D" />
      <RowLabel position={[6,   0.3,  2.05]} text="Row A" />
      <RowLabel position={[6,   0.3,  2.95]} text="Row B" />

      {/* ── Aisle markers ── */}
      <AisleMarker position={[-1, 0.1, -13]}  label="AISLE A" />
      <AisleMarker position={[4,  0.1, -4]}   label="AISLE B" />
      <AisleMarker position={[-8, 0.1, -5]}   label="AISLE C" />
      <AisleMarker position={[20, 0.1, -12]}  label="AISLE D" />

      {/* ── Floor zones ── */}
      <FloorZone position={[-28, 0, 0]}  width={15} depth={11} color="#4A90D9" borderColor="#4A90D9" labelText="Pallet Receiving" labelSub="Inbound" />
      <FloorZone position={[-8, 0, 12]}  width={19} depth={9}  color="#4CAF50" borderColor="#4CAF50" labelText="Shipping Station" labelSub="Outbound" rotation={[0, 0.12, 0]} />
      <FloorZone position={[22, 0, -4]}  width={12} depth={8}  color="#a855f7" borderColor="#a855f7" labelText="Charging Bay"     labelSub="MHE Charging" />
      <FloorZone position={[5,  0, 10]}  width={8}  depth={6}  color="#f59e0b" borderColor="#f59e0b" labelText="QC Station"        labelSub="Quality Check" />
      <AreaLabel position={[-14, 0.2, 3]} text="Open Workflow" sub="Staging Area" />

      {/* ── Rack safety zones (amber → red when MHE is near) ── */}
      {RACK_BOUNDS.map(r => (
        <RackSafetyZone key={r.id} rack={r} hotRacksRef={hotRacksRef} />
      ))}

      {/* ── Animated MHEs ── */}
      {MHE_VEHICLES.map((v, i) => (
        <AnimatedMHE
          key={v.id}
          id={v.id}
          label={v.label}
          type={v.type}
          color={v.color}
          position={v.path[0]}
          path={v.path}
          speed={0.7 + i * 0.08}
          selected={selectedMHE === v.id}
          onSelect={handleSelect}
          onDoubleSelect={handleDoubleSelect}
          hotRacksRef={hotRacksRef}
          onNearMiss={onNearMiss}
          dimmed={
            (focusedMheId !== null && v.id !== focusedMheId) ||
            (selectedMHE !== null && v.id !== selectedMHE)
          }
        />
      ))}

      {/* ── Selected MHE: route highlight + status card ── */}
      {selectedMHE && (() => {
        const v = MHE_VEHICLES.find(mv => mv.id === selectedMHE);
        if (!v) return null;
        const mid = v.path[Math.floor(v.path.length / 2)];
        return (
          <group>
            <PathLine points={v.path} color={v.color} opacity={0.9} />
            <PathArrows points={v.path} color={v.color} />
            <MHEStatusCard
              mheId={v.id}
              pathMid={mid}
              color={v.color}
              type={v.type}
              onClose={() => setSelectedMHE(null)}
            />
          </group>
        );
      })()}

      {/* ── Operator markers ── */}
      {OPERATOR_DATA.map(op => (
        <OperatorMarker key={op.id} {...op} />
      ))}

      {/* ── Event hotspots ── */}
      {EVENT_DATA.map(ev => (
        <EventHotspot key={ev.id} {...ev} />
      ))}

      {/* ── Task path overlays ── */}
      {taskAssignments.map(a => (
        <TaskPathOverlay
          key={a.id}
          assignment={a}
          showImpact={false}
          onCloseImpact={() => setSelectedMHE(null)}
        />
      ))}

      <OrbitControls
        makeDefault
        target={[2, 0, -5]}
        minPolarAngle={0.05}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={4} maxDistance={120}
        zoomSpeed={1.4} panSpeed={0.6}
        zoomToCursor
      />
    </>
  );
}
