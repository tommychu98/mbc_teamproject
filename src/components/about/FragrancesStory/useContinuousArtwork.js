import { useEffect } from 'react';

const vertexSource = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = position;
  gl_Position = vec4(position.x * 2.0 - 1.0, 1.0 - position.y * 2.0, 0.0, 1.0);
}`;
const fragmentSource = `
precision highp float;
uniform sampler2D artwork;
uniform vec2 dimensions;
uniform vec2 crop;
uniform vec4 angles;
uniform float chandelier;
varying vec2 uv;
vec2 displacement(vec2 pivot, float angle) {
  vec2 p = (uv - pivot) * dimensions;
  float c = cos(angle), s = sin(angle);
  return (vec2(c * p.x + s * p.y, -s * p.x + c * p.y) - p) / dimensions;
}
float head(vec2 center, vec2 radius) {
  return 1.0 - smoothstep(0.55, 1.35, length((uv - center) / radius));
}
void main() {
  vec2 source = uv;
  if (chandelier > 0.5) {
    // Blend the original rigid swing into the fixed ceiling and outer lamps.
    // A continuous sampling field replaces the stair-shaped cutout boundary.
    float weight = smoothstep(0.26, 0.43, uv.y)
      * (1.0 - smoothstep(0.13, 0.30, abs(uv.x - 0.44)))
      * (1.0 - smoothstep(0.97, 1.0, uv.y));
    source += weight * displacement(vec2(0.44, 0.41), angles.x);
  } else {
    source += head(vec2(0.115, 0.11), vec2(0.045, 0.09)) * displacement(vec2(0.12, 0.18), angles.x);
    source += head(vec2(0.29, 0.37), vec2(0.05, 0.08)) * displacement(vec2(0.28, 0.42), angles.y);
    source += head(vec2(0.535, 0.24), vec2(0.045, 0.08)) * displacement(vec2(0.54, 0.30), angles.z);
    source += head(vec2(0.795, 0.41), vec2(0.045, 0.08)) * displacement(vec2(0.79, 0.46), angles.w);
  }
  vec4 color = texture2D(artwork, (source - 0.5) * crop + 0.5);
  gl_FragColor = vec4(color.rgb * color.a, color.a);
}`;

function createRenderer(wrapper, controls, isChandelier) {
  const original = wrapper.querySelector('img');
  const canvas = document.createElement('canvas');
  canvas.className = 'fragrances-con7__continuous-artwork';
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true });
  if (!gl) return undefined;
  const shaders = [];
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    shaders.push(shader);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, original);
  // Keep the original export resolution; CSS retains the existing artboard slot.
  canvas.width = original.naturalWidth;
  canvas.height = original.naturalHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  const dimensionLocation = gl.getUniformLocation(program, 'dimensions');
  const cropLocation = gl.getUniformLocation(program, 'crop');
  gl.uniform1f(gl.getUniformLocation(program, 'chandelier'), isChandelier ? 1 : 0);
  const angleLocation = gl.getUniformLocation(program, 'angles');
  const angleValues = new Float32Array(4);
  const render = () => {
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;
    if (!width || !height) return;
    const frameAspect = width / height;
    const imageAspect = original.naturalWidth / original.naturalHeight;
    gl.uniform2f(dimensionLocation, width, height);
    // Match the existing centered object-fit: cover, including mobile reflow.
    gl.uniform2f(cropLocation, Math.min(1, frameAspect / imageAspect), Math.min(1, imageAspect / frameAspect));
    controls.forEach((control, index) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(control).transform);
      angleValues[index] = Math.atan2(matrix.b, matrix.a);
    });
    gl.uniform4fv(angleLocation, angleValues);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  render();
  wrapper.append(canvas);
  wrapper.dataset.continuousArtwork = 'ready';
  const lost = (event) => {
    event.preventDefault();
    // An intact original remains available if the graphics context is lost.
    wrapper.dataset.continuousArtwork = 'fallback';
  };
  canvas.addEventListener('webglcontextlost', lost);
  return {
    render,
    dispose() {
      delete wrapper.dataset.continuousArtwork;
      canvas.removeEventListener('webglcontextlost', lost);
      canvas.remove();
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

export default function useContinuousArtwork(sceneRef) {
  useEffect(() => {
    const scene = sceneRef.current;
    const groups = [
      [scene.querySelector('.fragrances-con7__musicians'), '.fragrances-con7__musician', false],
      [scene.querySelector('.fragrances-con7__chandelier'), '.fragrances-con7__chandelier-swing', true],
    ];
    let disposed = false;
    let frame = 0;
    const renderers = [];
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    let visible = false;
    observer.observe(scene);
    // Existing CSS keyframes remain the clocks and transform sources. Hidden
    // controls continue to animate; each complete artwork is sampled once.
    Promise.all(groups.map(([wrapper]) => wrapper.querySelector('img').decode())).then(() => {
      if (disposed) return;
      groups.forEach(([wrapper, selector, isChandelier]) => {
        wrapper.dataset.continuousArtwork = 'fallback';
        try {
          const renderer = createRenderer(wrapper, [...wrapper.querySelectorAll(selector)], isChandelier);
          if (renderer) renderers.push(renderer);
        } catch {
          wrapper.dataset.continuousArtwork = 'fallback';
        }
      });
      const update = () => {
        if (visible) renderers.forEach((renderer) => renderer.render());
        frame = requestAnimationFrame(update);
      };
      update();
    }).catch(() => { /* The original image stays visible if decoding fails. */ });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderers.forEach((renderer) => renderer.dispose());
      groups.forEach(([wrapper]) => { delete wrapper.dataset.continuousArtwork; });
    };
  }, [sceneRef]);
}
