/**
 * Shared Three.js warehouse scene — imported by both the Digital Twin 3D Map
 * page and the MHE Command Center page.
 */
import { useRef, useEffect } from "react";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

// ─── Constants ────────────────────────────────────────────────────────────────
export const BAY_W   = 1.1;
export const ROW_D   = 0.95;
export const LEVEL_H = 0.7;
export const LEVELS  = 5;
const POST_DIM = 0.065;
const BEAM_H   = 0.06;
export const RACK_H  = LEVELS * LEVEL_H + 0.35;

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
        <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh position={[0, H / 2, -depth / 2]}><boxGeometry args={[width, H, T]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[0, H / 2,  depth / 2]}><boxGeometry args={[width, H, T]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[-width / 2, H / 2, 0]}><boxGeometry args={[T, H, depth]} /><meshBasicMaterial color={borderColor} /></mesh>
      <mesh position={[ width / 2, H / 2, 0]}><boxGeometry args={[T, H, depth]} /><meshBasicMaterial color={borderColor} /></mesh>
      <Html position={[0, 0.6, 0]} center distanceFactor={18} zIndexRange={[50, 0]}>
        <div style={{ textAlign: "center", pointerEvents: "none", fontFamily: "system-ui,sans-serif" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#222" }}>{labelText}</div>
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

// ─── WarehouseScene (the full Three.js scene — no Canvas wrapper) ─────────────
export function WarehouseScene() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[25, 40, 20]} intensity={1.1} castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5} shadow-camera-far={200}
        shadow-camera-left={-70} shadow-camera-right={70}
        shadow-camera-top={70}  shadow-camera-bottom={-70}
      />
      <directionalLight position={[-15, 25, -10]} intensity={0.25} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshLambertMaterial color="#cbcbcb" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.03, -8]}>
        <planeGeometry args={[72, 52]} />
        <meshLambertMaterial color="#b9b9b9" />
      </mesh>

      <RackSection label="SIDE STORAGE"  sublabel="2 ROWS × 6 BAYS"  rows={2} bays={6}  position={[-26, 0, -13]} />
      <RackSection label="MAIN STORAGE"  sublabel="4 ROWS × 21 BAYS" rows={4} bays={21} position={[-4,  0, -19]} />
      <RackSection label="BULK STORAGE"  sublabel="2 ROWS × 12 BAYS" rows={2} bays={12} position={[6,   0,  2]}  />

      <RowLabel position={[-26, 0.3, -12]}  text="Row A" />
      <RowLabel position={[-26, 0.3, -11.1]} text="Row B" />
      <RowLabel position={[-4,  0.3, -18.9]} text="Row A" />
      <RowLabel position={[-4,  0.3, -18.0]} text="Row B" />
      <RowLabel position={[-4,  0.3, -17.1]} text="Row C" />
      <RowLabel position={[-4,  0.3, -16.2]} text="Row D" />
      <RowLabel position={[6,   0.3,  2.05]} text="Row A" />
      <RowLabel position={[6,   0.3,  2.95]} text="Row B" />

      <FloorZone position={[-28, 0, 0]}  width={15} depth={11} color="#4A90D9" borderColor="#4A90D9" labelText="Pallet Receiving" labelSub="Inbound" />
      <FloorZone position={[-8, 0, 12]}  width={19} depth={9}  color="#4CAF50" borderColor="#4CAF50" labelText="Shipping Station" labelSub="Outbound" rotation={[0, 0.12, 0]} />
      <AreaLabel position={[-14, 0.2, 3]} text="Open Workflow" sub="Staging Area" />

      <OrbitControls
        makeDefault
        target={[2, 0, -5]}
        minPolarAngle={Math.PI / 10}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={10} maxDistance={120}
        zoomSpeed={0.7} panSpeed={0.6}
      />
    </>
  );
}
