export const vertexShader = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

export const fragmentShader = `
precision highp float;
varying vec2 vUv;
uniform vec2 uResolution;
uniform float uTime;
uniform float uThemeMix;
uniform float uBurst;
uniform vec3 uThemeA;
uniform vec3 uThemeB;
uniform vec3 uTop;
uniform vec3 uMid;
uniform vec3 uFloor;
uniform vec3 uGlow;
uniform vec3 uVoid;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), u.x), u.y);
}

void main() {
  float down = 1.0 - vUv.y;
  vec3 studio = mix(uTop, uMid, smoothstep(0.0, 0.36, down));
  studio = mix(studio, uFloor, smoothstep(0.36, 0.80, down));
  studio = mix(studio, uGlow, smoothstep(0.80, 1.0, down));

  float aspect = uResolution.x / uResolution.y;
  vec2 p = (vUv - vec2(0.5, 0.46)) * vec2(aspect, 1.0);
  float radius = length(p) / max(1.0, aspect);
  float flow = noise(p * 1.5 + vec2(uTime * 0.045, -uTime * 0.025));
  flow = flow * 0.7 + noise(p * 3.0 - uTime * 0.025) * 0.3;
  float edge = mix(-0.25, 1.1, uThemeMix);
  float flood = (1.0 - smoothstep(edge - 0.16, edge + 0.22, radius + flow * 0.1))
    * smoothstep(0.0, 0.2, uThemeMix);
  vec3 theme = mix(uThemeB, uThemeA, smoothstep(0.0, 0.68, radius + flow * 0.16));
  theme = mix(theme, uVoid, smoothstep(0.25, 1.1, radius) * 0.45);

  float angle = atan(p.y, p.x);
  float rays = sin(angle * 16.0 + sin(angle * 7.0 - uTime * 0.12) + uTime * 0.08);
  rays = smoothstep(-0.5, 1.0, rays) * smoothstep(0.02, 0.30, radius);
  vec3 energy = mix(theme, uThemeB, rays * 0.52);
  energy = mix(energy, uThemeB, (1.0 - smoothstep(0.0, 0.24, radius)) * 0.55);
  vec3 color = mix(studio, mix(theme, energy, uBurst), flood);

  // Sub-LSB noise breaks smooth gradient bands without animated grain or extra passes.
  color += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(color, 1.0);
}
`;
