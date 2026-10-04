// A continuous textured surface, not independently animated image strips.
// Preserve the drape, with tiny gathering confined to the right attachment.
const COLS = 112;
const ROWS = 36;
const clamp = x => Math.max(0, Math.min(1, x));
const ease = x => { const t = clamp(x); return t * t * t * (t * (t * 6 - 15) + 10); };

export default function createDraperyMesh(canvas, image) {
    // Keep texture sampling and browser compositing in premultiplied alpha.
    // Straight-alpha antialiasing can expose hidden RGB at transparent hems.
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) return null;
    const shader = (type, source) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
    };
    const vertex = shader(gl.VERTEX_SHADER, `
        attribute vec2 position; attribute vec2 uv; attribute float shade;
        varying vec2 texCoord; varying float lighting;
        void main() { gl_Position = vec4(position.x * 2.0 - 1.0, 1.0 - position.y * 2.0, 0.0, 1.0); texCoord = uv; lighting = shade; }
    `);
    const fragment = shader(gl.FRAGMENT_SHADER, `
        precision mediump float; uniform sampler2D artwork;
        varying vec2 texCoord; varying float lighting;
        void main() {
            vec4 c = texture2D(artwork, texCoord);
            gl_FragColor = vec4(clamp(c.rgb * lighting, vec3(0.0), vec3(c.a)), c.a);
        }
    `);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    for (const [name, size, offset] of [['position', 2, 0], ['uv', 2, 8], ['shade', 1, 16]]) {
        const location = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, 20, offset);
    }
    const indices = [];
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        const a = y * (COLS + 1) + x, b = a + COLS + 1;
        indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    let loaded = false;
    let contextLost = false;
    let lastProgress = 0;
    const showImage = () => {
        canvas.style.visibility = 'hidden';
        image.style.removeProperty('visibility');
    };
    const handleContextLost = event => {
        event.preventDefault();
        contextLost = true;
        loaded = false;
        // The outer fabric still animates when GPU rendering is unavailable.
        showImage();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    const vertices = new Float32Array((COLS + 1) * (ROWS + 1) * 5);
    const projected = new Float32Array(COLS + 1);
    const fold = new Float32Array(COLS + 1);
    const amount = new Float32Array(COLS + 1);
    const draw = progress => {
        lastProgress = progress;
        if (!loaded || contextLost || gl.isContextLost()) {
            showImage();
            return false;
        }
        const width = canvas.clientWidth, height = canvas.clientHeight;
        const density = Math.min(devicePixelRatio || 1, 2);
        const w = Math.round(width * density), h = Math.round(height * density);
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
        gl.viewport(0, 0, w, h);
        // The authored CSS mirrors the asset horizontally: u=0 is the screen's
        // right attachment. Tension propagates continuously toward u=1 (hem).
        projected[0] = 0;
        for (let x = 0; x <= COLS; x++) {
            const u = x / COLS;
            amount[x] = ease((progress - 0.25 * u) / 0.56);
            const attachment = 1 - ease((u - 0.08) / 0.32);
            fold[x] = 0.22 * attachment * amount[x] * Math.sin(u * Math.PI * 14);
            if (x) projected[x] = projected[x - 1] + Math.cos((fold[x] + fold[x - 1]) / 2) / COLS;
        }
        const cover = Math.max(width / image.naturalWidth, height / image.naturalHeight);
        const uvW = width / (image.naturalWidth * cover), uvH = height / (image.naturalHeight * cover);
        let cursor = 0;
        for (let y = 0; y <= ROWS; y++) for (let x = 0; x <= COLS; x++) {
            const u = x / COLS, v = y / ROWS;
            const lift = amount[x] * Math.sin(u * Math.PI) * 0.007;
            // The mirrored left/bottom hem lags by at most ~10 authored pixels,
            // then rejoins continuously. UVs stay connected across the surface.
            const follow = 0.0075 * u * u * v * Math.sin(Math.PI * ease(progress));
            vertices[cursor++] = projected[x] + follow;
            vertices[cursor++] = v - lift * v * v + Math.sin(fold[x]) * 0.002 * Math.sin(v * Math.PI);
            vertices[cursor++] = (1 - uvW) / 2 + u * uvW;
            vertices[cursor++] = (1 - uvH) / 2 + v * uvH;
            vertices[cursor++] = 1 + Math.sin(fold[x]) * 0.018;
        }
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        canvas.dataset.projectedWidth = projected[COLS].toFixed(4);
        canvas.style.visibility = progress > 0 ? 'visible' : 'hidden';
        image.style.visibility = progress > 0 ? 'hidden' : '';
        return true;
    };
    const load = () => {
        if (contextLost || gl.isContextLost()) return;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        loaded = gl.getError() === gl.NO_ERROR;
        draw(lastProgress);
    };
    if (image.complete && image.naturalWidth) load();
    else image.addEventListener('load', load);
    return { draw, dispose() {
        image.removeEventListener('load', load);
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        image.style.removeProperty('visibility');
        canvas.style.visibility = 'hidden';
        gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteBuffer(indexBuffer);
        gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment);
    } };
}
