// Gzip wraps the optimized GLB. Meshopt and lossless WebP retain its surface data.
export default async function loadCompressedModel(url, { signal, onProgress }) {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Perfume model request failed: ${response.status}`);
    if (!response.body) throw new Error('Perfume model response has no body');
    const total = Number(response.headers.get('content-length'));
    let received = 0;
    const progress = new TransformStream({
        transform(chunk, controller) {
            received += chunk.byteLength;
            if (total > 0) onProgress(Math.min(99, Math.round(received / total * 100)));
            controller.enqueue(chunk);
        },
    });
    const stream = response.body.pipeThrough(progress).pipeThrough(new DecompressionStream('gzip'));
    const data = await new Response(stream).arrayBuffer();
    onProgress(100);
    return data;
}
