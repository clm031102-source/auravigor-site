import { Environment, Lightformer } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '@/store/useAppStore';
import { Cast } from './Cast';

/**
 * The transparent product canvas. It sits ABOVE the backdrop and the giant slogan, and BELOW
 * all readable DOM — see the layer map in docs/ARCHITECTURE.md. It never receives pointer
 * events; interaction is handled by DOM controls so it stays accessible.
 */
export function Experience() {
  const setReady = useAppStore((s) => s.setReady);

  return (
    <div className="layer layer--canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 32, position: [0, 0, 9], near: 0.1, far: 50 }}
        onCreated={() => setReady()}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 6]} intensity={2.2} />
        <directionalLight position={[-6, 2, -3]} intensity={0.8} color="#9fb4ff" />

        {/* Procedural studio reflections: no HDRI download, works offline and in CI. */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 5, 2]} scale={[10, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={2.2} position={[-5, 1, 2]} scale={[2, 8, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={2.2} position={[5, 1, 2]} scale={[2, 8, 1]} rotation-y={-Math.PI / 2} />
          <Lightformer form="ring" intensity={1.5} position={[0, 0, 8]} scale={4} />
        </Environment>

        <Cast />
      </Canvas>
    </div>
  );
}
