'use client';

import Image from 'next/image';
import { Minus, Plus, ZoomIn } from 'lucide-react';
import { useState } from 'react';

function getPoint(event) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 100;
  const y = ((event.clientY - bounds.top) / bounds.height) * 100;

  return {
    x: Math.min(85, Math.max(15, x)),
    y: Math.min(85, Math.max(15, y)),
  };
}

export default function ProductImageZoom({ src, alt }) {
  const [zoomLevel, setZoomLevel] = useState(2.5);
  const [magnifierActive, setMagnifierActive] = useState(false);
  const [point, setPoint] = useState({ x: 50, y: 50 });

  const updatePoint = (event) => setPoint(getPoint(event));

  const handlePointerEnter = (event) => {
    if (event.pointerType === 'mouse') setMagnifierActive(true);
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType === 'mouse') setMagnifierActive(false);
  };

  const handlePointerDown = (event) => {
    if (event.target.closest('button')) return;

    updatePoint(event);
    setMagnifierActive(true);

    if (event.pointerType === 'touch') {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }
  };

  return (
    <div
      className={`group relative h-full w-full select-none touch-none ${magnifierActive ? 'cursor-crosshair' : 'cursor-zoom-in'}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={updatePoint}
      onPointerDown={handlePointerDown}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        draggable={false}
        className="pointer-events-none object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />

      <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full border border-white/70 bg-white/90 p-1 text-skj-charcoal shadow-lg backdrop-blur-sm">
        <button
          type="button"
          aria-label="Decrease magnification"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setZoomLevel((value) => Math.max(1.5, Number((value - 0.5).toFixed(1))))}
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-skj-ivory"
        >
          <Minus size={15} />
        </button>
        <button
          type="button"
          aria-label={magnifierActive ? 'Hide magnifier' : 'Show magnifier'}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setMagnifierActive((active) => !active)}
          className={`flex h-8 min-w-12 items-center justify-center gap-1 rounded-full px-2 text-xs font-semibold transition ${
            magnifierActive ? 'bg-skj-olive text-white' : 'hover:bg-skj-ivory'
          }`}
        >
          <ZoomIn size={14} />
          {zoomLevel.toFixed(1)}x
        </button>
        <button
          type="button"
          aria-label="Increase magnification"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setZoomLevel((value) => Math.min(4, Number((value + 0.5).toFixed(1))))}
          className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-skj-ivory"
        >
          <Plus size={15} />
        </button>
      </div>

      {magnifierActive && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border-2 border-white bg-skj-ivory/20 shadow-2xl ring-2 ring-skj-gold/60 sm:h-52 sm:w-52"
          style={{
            left: `${point.x}%`,
            top: `${point.y}%`,
            backgroundImage: `url("${src}")`,
            backgroundPosition: `${point.x}% ${point.y}%`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${zoomLevel * 100}% ${zoomLevel * 100}%`,
          }}
        />
      )}

      <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 sm:block">
        Move over the design to inspect
      </span>
      {!magnifierActive && (
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/55 px-3 py-1.5 text-[10px] font-medium text-white sm:hidden">
          Tap and drag to inspect
        </span>
      )}
    </div>
  );
}
