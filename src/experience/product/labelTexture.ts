import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import type { Product } from '@/content/types';

const LABEL_WIDTH = 2048;

/**
 * Label layout convention (shared with docs/ASSETS.md):
 * the flat wraps the pack exactly once, the FRONT panel is centred at 50% of the width and the
 * seam sits at the back (0% / 100%).
 */
function drawPlaceholderLabel(product: Product, aspect: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = LABEL_WIDTH;
  canvas.height = Math.max(64, Math.round(LABEL_WIDTH / aspect));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const { width: w, height: h } = canvas;
  const { primary, secondary, ink } = product.theme;

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, secondary);
  bg.addColorStop(0.55, primary);
  bg.addColorStop(1, '#0a0a0b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const display = '900 italic';
  const family = '"Arial Black", "Helvetica Neue", Arial, sans-serif';

  // Front panel
  const cx = w / 2;
  ctx.font = `700 ${h * 0.06}px ${family}`;
  ctx.fillText('AURAVIGOR', cx, h * 0.16);
  const title = `${product.line ? `${product.line} ` : ''}${product.name}`.toUpperCase();
  let size = h * 0.3;
  ctx.font = `${display} ${size}px ${family}`;
  const maxWidth = w * 0.3;
  const measured = ctx.measureText(title).width;
  if (measured > maxWidth) size *= maxWidth / measured;
  ctx.font = `${display} ${size}px ${family}`;
  ctx.fillText(title, cx, h * 0.47);
  ctx.font = `600 ${h * 0.05}px ${family}`;
  ctx.fillText(product.category.toUpperCase(), cx, h * 0.72);
  ctx.font = `500 ${h * 0.035}px ${family}`;
  ctx.fillText('PLACEHOLDER LABEL', cx, h * 0.88);

  // Back-left panel: facts box
  const boxX = w * 0.05;
  const boxW = w * 0.24;
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(2, h * 0.006);
  ctx.strokeRect(boxX, h * 0.12, boxW, h * 0.76);
  ctx.textAlign = 'left';
  ctx.font = `800 ${h * 0.055}px ${family}`;
  ctx.fillText('SUPPLEMENT FACTS', boxX + w * 0.012, h * 0.2);
  ctx.globalAlpha = 0.55;
  for (let i = 0; i < 9; i += 1) {
    ctx.fillRect(boxX + w * 0.012, h * (0.29 + i * 0.06), boxW - w * 0.024 - (i % 3) * w * 0.03, h * 0.012);
  }
  ctx.globalAlpha = 1;

  // Back-right panel: feature list
  const listX = w * 0.72;
  ctx.font = `${display} ${h * 0.07}px ${family}`;
  product.features.forEach((feature, i) => {
    ctx.fillText(`0${i + 1}  ${feature.title.toUpperCase()}`, listX, h * (0.24 + i * 0.17));
  });

  return canvas;
}

function configure(texture: THREE.Texture): THREE.Texture {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Returns the label texture for a product: a generated placeholder straight away, swapped for
 * the real artwork (product.labelSrc) once it has loaded. No Suspense, no pop-in of geometry.
 */
export function useLabelTexture(product: Product, aspect: number): THREE.Texture {
  const placeholder = useMemo(
    () => configure(new THREE.CanvasTexture(drawPlaceholderLabel(product, aspect))),
    [product, aspect],
  );
  const [artwork, setArtwork] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!product.labelSrc) return undefined;
    let cancelled = false;
    let loaded: THREE.Texture | null = null;
    new THREE.TextureLoader().load(product.labelSrc, (texture) => {
      if (cancelled) {
        texture.dispose();
        return;
      }
      loaded = configure(texture);
      setArtwork(loaded);
    });
    return () => {
      cancelled = true;
      loaded?.dispose();
      setArtwork(null);
    };
  }, [product.labelSrc]);

  useEffect(() => () => placeholder.dispose(), [placeholder]);

  return artwork ?? placeholder;
}
