/**
 * watermarkImage
 *
 * Applies a subtle "© Bimsara Gunawardana" watermark to an image
 * file using the Canvas API before upload. The watermark is:
 *   - Positioned in the bottom-right corner
 *   - Semi-transparent white text with a dark shadow (visible on any bg)
 *   - Sized relative to the image (never too big or too small)
 *
 * Returns a new File with the watermark baked in, preserving the
 * original filename and MIME type.
 *
 * NOTE: This runs entirely client-side — no server required.
 */
export async function watermarkImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file); // fallback: upload original if canvas unavailable
        return;
      }

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // ── Watermark config ────────────────────────────────────
      const text = '© Bimsara Gunawardana';
      // Font size: ~1.8% of the image width, clamped between 14px and 36px
      const fontSize = Math.min(36, Math.max(14, Math.round(img.naturalWidth * 0.018)));
      const padding = Math.round(fontSize * 1.0);

      ctx.font = `500 ${fontSize}px Inter, -apple-system, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      const x = canvas.width - padding;
      const y = canvas.height - padding;

      // Shadow for visibility on any background
      ctx.shadowColor = 'rgba(0,0,0,0.65)';
      ctx.shadowBlur = Math.round(fontSize * 0.6);
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Semi-transparent white text
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.fillText(text, x, y);

      // Convert canvas back to a File
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file); // fallback
            return;
          }
          const watermarked = new File([blob], file.name, { type: file.type });
          resolve(watermarked);
        },
        file.type,
        0.93 // high quality JPEG/WEBP compression
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // fallback: upload original on error
    };

    img.src = objectUrl;
  });
}
