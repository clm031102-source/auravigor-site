import { useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { products } from '@/content/products';
import { featureBlend } from '@/director/acts';
import { lerp } from '@/director/math';
import { ringState, scrollState } from '@/director/scrollState';
import { useAppStore } from '@/store/useAppStore';
import { castPose } from './choreography';
import { ProductModel } from './product/ProductModel';

const RING_DAMPING = 7;
const POSE_DAMPING = 14;
const TELEPORT = 1e6;
const HIDDEN = 0.02;

/**
 * One persistent set of packs for the whole film. Every frame each pack asks the choreography
 * where it should be and eases there — nothing is mounted / unmounted between acts, so there
 * are no pops and no duplicate GPU resources.
 */
export function Cast() {
  const groups = useRef<(THREE.Group | null)[]>([]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1); // cap so a background tab coming back does not jump
    const damp = THREE.MathUtils.damp;

    ringState.position = damp(ringState.position, ringState.target, RING_DAMPING, dt);

    const { activeIndex } = useAppStore.getState();
    const features = products[activeIndex].features;
    const blend = featureBlend(scrollState.local.features, features.length);
    const faceAngle = features.length
      ? lerp(features[blend.index].faceAngle, features[blend.next].faceAngle, blend.t)
      : Math.PI;

    const aspect = state.size.width / state.size.height;
    const time = state.clock.elapsedTime;

    products.forEach((_, index) => {
      const group = groups.current[index];
      if (!group) return;
      const pose = castPose({
        index,
        count: products.length,
        activeIndex,
        ring: ringState.position,
        local: scrollState.local,
        exit: scrollState.exit,
        faceAngle,
        aspect,
        time,
      });
      // A hidden pack teleports (e.g. when it wraps around the ring) instead of flying across.
      const lambda = group.scale.x < HIDDEN || pose.s < HIDDEN ? TELEPORT : POSE_DAMPING;
      group.position.set(
        damp(group.position.x, pose.x, lambda, dt),
        damp(group.position.y, pose.y, lambda, dt),
        damp(group.position.z, pose.z, lambda, dt),
      );
      group.rotation.set(
        damp(group.rotation.x, pose.rx, lambda, dt),
        damp(group.rotation.y, pose.ry, lambda, dt),
        damp(group.rotation.z, pose.rz, lambda, dt),
      );
      const scale = damp(group.scale.x, pose.s, POSE_DAMPING, dt);
      group.scale.setScalar(scale);
      group.visible = scale > HIDDEN;
    });
  });

  return (
    <>
      {products.map((product, index) => (
        <group
          key={product.id}
          ref={(node) => {
            groups.current[index] = node;
          }}
          scale={0}
        >
          <Suspense fallback={null}>
            <ProductModel product={product} />
          </Suspense>
        </group>
      ))}
    </>
  );
}
