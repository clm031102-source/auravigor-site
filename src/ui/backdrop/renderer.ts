import type { Rgb } from './colorTransition';
import { fragmentShader, vertexShader } from './shaders';

export interface BackdropFrame {
  time: number;
  themeMix: number;
  burst: number;
  colors: Record<'themeA' | 'themeB' | 'top' | 'mid' | 'floor' | 'glow' | 'void', Rgb>;
}

/** One full-screen triangle; no scene graph, textures, postprocessing, or external assets. */
export function createBackdropRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
  if (!gl) return null;

  const shaders: WebGLShader[] = [];
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const dispose = () => {
    shaders.forEach((shader) => gl.deleteShader(shader));
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };

  try {
    if (!program || !buffer) throw new Error('Backdrop allocation failed');
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertexShader],
      [gl.FRAGMENT_SHADER, fragmentShader],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Backdrop shader allocation failed');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) ?? 'Backdrop shader compilation failed');
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'Backdrop link failed');
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(
      [
        'Resolution',
        'Time',
        'ThemeMix',
        'Burst',
        'ThemeA',
        'ThemeB',
        'Top',
        'Mid',
        'Floor',
        'Glow',
        'Void',
      ].map((name) => [name, gl.getUniformLocation(program, `u${name}`)]),
    );

    return {
      draw(frame: BackdropFrame) {
        // CSS-pixel resolution caps fill cost on high-DPR screens; the backdrop has no fine detail.
        const width = Math.max(1, Math.round(canvas.clientWidth));
        const height = Math.max(1, Math.round(canvas.clientHeight));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
        gl.uniform2f(uniforms.Resolution, width, height);
        gl.uniform1f(uniforms.Time, frame.time);
        gl.uniform1f(uniforms.ThemeMix, frame.themeMix);
        gl.uniform1f(uniforms.Burst, frame.burst);
        for (const [name, color] of Object.entries(frame.colors)) {
          gl.uniform3fv(uniforms[name[0].toUpperCase() + name.slice(1)], color);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      dispose,
    };
  } catch {
    dispose();
    return null;
  }
}
