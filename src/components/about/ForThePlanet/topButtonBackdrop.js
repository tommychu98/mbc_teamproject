// Samples this page's local image layers and solid surfaces, not section names.
// The tiny canvas follows the rendered 2D transforms, image crops and clipping.
export function createBackdropSampler(page, button) {
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 16;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const intersects = (a, b) => a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
  const lengths = (value) => value.match(/calc\([^)]*\)|[-\d.]+(?:px|%)?/g) || [];
  const resolve = (value, size) => [...value.replace(/\s/g, '').matchAll(/([+-]?[\d.]+)(px|%)/g)]
    .reduce((sum, [, number, unit]) => sum + Number(number) * (unit === '%' ? size / 100 : 1), 0);
  const expand = (values) => [values[0], values[1] ?? values[0], values[2] ?? values[0], values[3] ?? values[1] ?? values[0]];

  return () => {
    if (!ctx) return 0;
    const buttonBox = button.getBoundingClientRect();
    // Only the mobile sampling bounds change with the smaller Figma icon/label.
    const area = window.matchMedia('(max-width: 899px)').matches
      ? { left: buttonBox.left + 9, top: buttonBox.top + 7.5, right: buttonBox.left + 31, bottom: buttonBox.top + 43 }
      : { left: buttonBox.left + 24, top: buttonBox.top + 10, right: buttonBox.left + 58, bottom: buttonBox.top + 76 };
    const sx = canvas.width / (area.right - area.left);
    const sy = canvas.height / (area.bottom - area.top);
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const styles = new Map();
    const styleOf = (node) => {
      if (!styles.has(node)) styles.set(node, getComputedStyle(node));
      return styles.get(node);
    };

    const paint = (node, parentMatrix, alpha) => {
      if (node === button) return;
      const style = styleOf(node);
      if (style.display === 'none' || style.visibility === 'hidden') return;
      const opacity = alpha * Number(style.opacity);
      if (!opacity) return;
      const box = node.getBoundingClientRect();
      const visible = intersects(box, area);
      const clips = style.overflowX === 'hidden' || style.overflowX === 'clip';
      if (!visible && clips) return;
      const ownMatrix = style.transform === 'none' ? new DOMMatrix() : new DOMMatrix(style.transform);
      const matrix = parentMatrix.multiply(ownMatrix);
      matrix.e = 0;
      matrix.f = 0;
      const width = parseFloat(style.width) || node.clientWidth;
      const height = parseFloat(style.height) || node.clientHeight;
      const corners = [[0, 0], [width, 0], [0, height], [width, height]]
        .map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
      matrix.e = box.left - Math.min(...corners.map((p) => p.x));
      matrix.f = box.top - Math.min(...corners.map((p) => p.y));
      ctx.save();
      ctx.setTransform(sx * matrix.a, sy * matrix.b, sx * matrix.c, sy * matrix.d,
        sx * (matrix.e - area.left), sy * (matrix.f - area.top));
      ctx.globalAlpha = opacity;
      if (clips) {
        ctx.beginPath();
        const radii = ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius']
          .map((key) => {
            const [x, y = x] = lengths(style[key]);
            return { x: resolve(x || '0px', width), y: resolve(y || '0px', height) };
          });
        ctx.roundRect(0, 0, width, height, radii);
        ctx.clip();
      }
      // The arch and renewal scenes reveal their images through animated insets.
      // Clip the sampled image too, so ivory corners retain the dark TOP variant.
      if (style.clipPath.startsWith('inset(')) {
        const [insets, rounded = '0px'] = style.clipPath.slice(6, -1).split(/\s+round\s+/);
        const [top, right, bottom, left] = expand(lengths(insets))
          .map((value, index) => resolve(value, index % 2 ? width : height));
        const radii = expand(lengths(rounded)).map((value) => Math.max(0, resolve(value, Math.min(width, height))));
        ctx.beginPath();
        ctx.roundRect(left, top, Math.max(0, width - left - right), Math.max(0, height - top - bottom), radii);
        ctx.clip();
      }
      if (visible) {
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        if (node instanceof HTMLImageElement && node.complete && node.naturalWidth) {
          const iw = node.naturalWidth;
          const ih = node.naturalHeight;
          const scale = style.objectFit === 'cover' ? Math.max(width / iw, height / ih)
            : style.objectFit === 'contain' ? Math.min(width / iw, height / ih) : null;
          const dw = scale === null ? width : iw * scale;
          const dh = scale === null ? height : ih * scale;
          const [px, py] = style.objectPosition.split(' ').map((v) => parseFloat(v) / 100);
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          ctx.clip();
          ctx.drawImage(node, (width - dw) * px, (height - dh) * py, dw, dh);
          ctx.restore();
        }
      }
      // Existing artboards use DOM order, with explicit z-index for overlaps.
      [...node.children].sort((a, b) => (parseInt(styleOf(a).zIndex) || 0) - (parseInt(styleOf(b).zIndex) || 0))
        .forEach((child) => paint(child, matrix, opacity));
      ctx.restore();
    };
    paint(page, new DOMMatrix(), 1);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const linear = (v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    let luminance = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      luminance += 0.2126 * linear(pixels[i] / 255) + 0.7152 * linear(pixels[i + 1] / 255) + 0.0722 * linear(pixels[i + 2] / 255);
    }
    return luminance / (pixels.length / 4);
  };
}
