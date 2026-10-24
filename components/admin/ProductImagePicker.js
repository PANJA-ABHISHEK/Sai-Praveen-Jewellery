'use client';

import Image from 'next/image';
import { CheckCircle2, ImagePlus, Loader2, Trash2 } from 'lucide-react';

const IMAGE_SLOTS = [0, 1, 2];

export default function ProductImagePicker({
  previews = [],
  urls = [],
  uploading = [],
  onSelect,
  onRemove,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">Product photos</p>
          <p className="mt-1 text-xs leading-5 text-gray-500">
            Add up to 3 clear photos. The first photo becomes the main catalogue image.
          </p>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-800">
          Up to 3 photos
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {IMAGE_SLOTS.map((index) => {
          const preview = previews[index] || '';
          const isUploading = Boolean(uploading[index]);
          const isPrimary = index === 0;

          return (
            <div key={index} className="min-w-0">
              {preview ? (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={preview}
                      alt={isPrimary ? 'Main product preview' : `Product preview ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />

                    <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-2">
                      <span className="rounded-full bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-gray-700 shadow-sm">
                        {isPrimary ? 'Main photo' : `Photo ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        aria-label={`Remove ${isPrimary ? 'main photo' : `photo ${index + 1}`}`}
                        onClick={() => onRemove(index)}
                        disabled={isUploading}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {isUploading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/55 text-white backdrop-blur-[2px]">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-[11px] font-medium">Uploading photo...</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    {isUploading ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading
                      </span>
                    ) : urls[index] ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Ready to use
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-red-600">Choose this photo again</span>
                    )}

                    <label className="cursor-pointer text-[11px] font-semibold text-slate-600 underline decoration-slate-300 underline-offset-2 transition hover:text-slate-950">
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => onSelect(index, event)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white px-3 text-center transition hover:border-amber-300 hover:bg-amber-50/40">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#C8102E]">
                    <ImagePlus className="h-5 w-5" />
                  </span>
                  <span className="mt-2 text-xs font-semibold text-gray-900">
                    {isPrimary ? 'Add main photo' : 'Add another photo'}
                  </span>
                  <span className="mt-1 text-[10px] leading-4 text-gray-500">
                    {isPrimary ? 'Required' : 'Optional'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => onSelect(index, event)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-5 text-gray-500">
        Customers will see only the photos you add. Photo 1 appears first in the catalogue and product page.
      </p>
    </div>
  );
}
