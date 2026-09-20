import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { Product } from '@/content/types';
import { useLabelTexture } from './labelTexture';
import { buildPack } from './packaging';

const RADIAL_SEGMENTS = 72;

/**
 * Tub / bottle generated from the packaging spec + a flat label. The group is centred on the
 * pack's mid-height so choreography can spin it around its own centre.
 */
function ProceduralPack({ product }: { product: Product }) {
  const pack = useMemo(() => buildPack(product.packaging), [product.packaging]);
  const label = useLabelTexture(product, pack.labelAspect);

  const bodyGeometry = useMemo(
    () =>
      new THREE.LatheGeometry(
        pack.bodyProfile.map(([x, y]) => new THREE.Vector2(x, y)),
        RADIAL_SEGMENTS,
      ),
    [pack],
  );
  useEffect(() => () => bodyGeometry.dispose(), [bodyGeometry]);

  return (
    <group position-y={-pack.height / 2}>
      <mesh geometry={bodyGeometry}>
        <meshPhysicalMaterial
          color={product.packaging.bodyColor}
          roughness={0.32}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* thetaStart = π puts the artwork's horizontal centre (the front panel) on +Z */}
      <mesh position-y={pack.label.centerY}>
        <cylinderGeometry
          args={[
            pack.label.radius,
            pack.label.radius,
            pack.label.height,
            RADIAL_SEGMENTS,
            1,
            true,
            Math.PI,
            Math.PI * 2,
          ]}
        />
        <meshStandardMaterial map={label} roughness={0.38} metalness={0.05} />
      </mesh>

      <mesh position-y={pack.lid.centerY}>
        <cylinderGeometry
          args={[pack.lid.radius, pack.lid.radius, pack.lid.height, RADIAL_SEGMENTS]}
        />
        <meshStandardMaterial color={product.packaging.lidColor} roughness={0.55} />
      </mesh>
    </group>
  );
}

/** Escape hatch for packs that are not a surface of revolution. Expects a centred, Y-up GLB. */
function GlbPack({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  const clone = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={clone} />;
}

export function ProductModel({ product }: { product: Product }) {
  return product.modelSrc ? (
    <GlbPack src={product.modelSrc} />
  ) : (
    <ProceduralPack product={product} />
  );
}
