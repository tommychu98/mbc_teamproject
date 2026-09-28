import { fragmentShader, vertexShader } from './paperCurlShaders';

// The reference curl shader, rendered only while GSAP changes its progress.
export function createPaperCurl(image) {
    const canvas = document.createElement('canvas');
    canvas.className = 'galerie-another__curl';
    canvas.setAttribute('aria-hidden', 'true');
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return null;
    const shaders = [];
    let program;
    let buffer;
    let texture;
    let observer;
    let disposed = false;
    let ready = false;
    const state = { progress: 0 };
    const onContextLost = () => {
        // An old canvas can report context loss after React has mounted its replacement.
        if (disposed) return;
        ready = false;
        image.style.removeProperty('visibility');
        canvas.style.display = 'none';
    };
    const dispose = () => {
        if (disposed) return;
        disposed = true;
        observer?.disconnect();
        image.removeEventListener('load', upload);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        image.style.removeProperty('visibility');
        canvas.remove();
        if (texture) gl.deleteTexture(texture);
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        shaders.forEach((shader) => gl.deleteShader(shader));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    let progressLocation;
    let planeLocation;
    const render = () => {
        if (!ready || disposed) return;
        gl.uniform1f(progressLocation, state.progress);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const resize = () => {
        const { width, height } = image.getBoundingClientRect();
        if (!width || !height || disposed) return;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * 1.2 * ratio);
        canvas.height = Math.round(height * 1.2 * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(planeLocation, width, height);
        render();
    };
    function upload() {
        if (disposed || !image.naturalWidth) return;
        try {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.uniform2f(gl.getUniformLocation(program, 'uImageSize'), image.naturalWidth, image.naturalHeight);
            ready = true;
            resize();
            image.style.visibility = 'hidden';
        } catch {
            dispose();
        }
    }
    try {
        program = gl.createProgram();
        for (const [type, source] of [[gl.VERTEX_SHADER, vertexShader], [gl.FRAGMENT_SHADER, fragmentShader]]) {
            const shader = gl.createShader(type);
            shaders.push(shader);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
            gl.attachShader(program, shader);
        }
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
        gl.useProgram(program);
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(program, 'uTexture'), 0);
        gl.uniform2f(gl.getUniformLocation(program, 'uPad'), 1 / 12, 1 / 12);
        progressLocation = gl.getUniformLocation(program, 'uProgress');
        planeLocation = gl.getUniformLocation(program, 'uPlaneSize');
        image.parentElement.appendChild(canvas);
        canvas.addEventListener('webglcontextlost', onContextLost);
        observer = new ResizeObserver(resize);
        observer.observe(image);
        image.addEventListener('load', upload);
        if (image.complete) upload();
        return { state, render, dispose };
    } catch {
        dispose();
        return null;
    }
}
