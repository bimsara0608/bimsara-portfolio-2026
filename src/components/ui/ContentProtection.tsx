'use client';

import { useEffect } from 'react';

/**
 * ContentProtection
 *
 * Adds client-side deterrents against casual content theft:
 *  - Disables right-click context menu on images/canvas/video
 *  - Blocks drag-to-save on media elements
 *  - Blocks common keyboard shortcuts: Ctrl+S, Ctrl+U, Ctrl+P, F12, DevTools
 *
 * NOTE: These are deterrents only. OS-level screenshots and
 * browser DevTools network tab remain outside browser JS control.
 */
export default function ContentProtection() {
  useEffect(() => {
    // ── Right-click context menu ──────────────────────────────
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLImageElement ||
        target instanceof HTMLCanvasElement ||
        target instanceof HTMLVideoElement
      ) {
        e.preventDefault();
      }
    };

    // ── Keyboard shortcut blocking ────────────────────────────
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      if (
        (ctrl && e.key === 's') ||
        (ctrl && e.key === 'u') ||
        (ctrl && e.key === 'p') ||
        (ctrl && e.shiftKey && e.key === 'I') ||
        (ctrl && e.shiftKey && e.key === 'J') ||
        (ctrl && e.shiftKey && e.key === 'C') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    // ── Drag prevention on media elements ────────────────────
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (
        target instanceof HTMLImageElement ||
        target instanceof HTMLCanvasElement ||
        target instanceof HTMLVideoElement
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Renders nothing — only attaches event listeners
  return null;
}
