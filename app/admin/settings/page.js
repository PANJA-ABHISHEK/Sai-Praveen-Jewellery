'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Megaphone,
  Palette,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import { STATIC_MEDIA } from '@/data/media';
import {
  ANNOUNCEMENT_BACKGROUND_COLORS,
  ANNOUNCEMENT_TEXT_COLORS,
  DEFAULT_SITE_SETTINGS,
  getAnnouncementBackground,
  getAnnouncementTextColor,
  mergeSiteSettings,
} from '@/data/siteSettings';

function createInitialSettings() {
  return mergeSiteSettings({
    ...DEFAULT_SITE_SETTINGS,
    announcement: { ...DEFAULT_SITE_SETTINGS.announcement },
    homepage: { ...DEFAULT_SITE_SETTINGS.homepage },
  });
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(createInitialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingSlides, setUploadingSlides] = useState([]);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const authResponse = await fetch('/api/admin/check', { cache: 'no-store' });
        if (!authResponse.ok) {
          router.replace('/admin/login');
          return;
        }

        if (!cancelled) setCheckingAuth(false);

        const response = await fetch('/api/admin/settings', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load store settings.');

        if (!cancelled && data.settings) {
          setSettings(mergeSiteSettings(data.settings));
        }
      } catch (loadError) {
        if (!cancelled) setError(loadError.message || 'Could not load store settings.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const announcement = settings.announcement;
  const homepage = settings.homepage;
  const background = useMemo(
    () => getAnnouncementBackground(announcement.backgroundColor),
    [announcement.backgroundColor]
  );
  const textColor = useMemo(
    () => getAnnouncementTextColor(announcement.textColor),
    [announcement.textColor]
  );

  const updateAnnouncement = (field, value) => {
    setSuccess('');
    setError('');
    setSettings((previous) => ({
      ...previous,
      announcement: {
        ...previous.announcement,
        [field]: value,
      },
    }));
  };

  const updateHomepage = (field, value) => {
    setSuccess('');
    setError('');
    setSettings((previous) => ({
      ...previous,
      homepage: {
        ...previous.homepage,
        [field]: value,
      },
    }));
  };

  const updateSlide = (index, field, value) => {
    setSuccess('');
    setError('');
    setSettings((previous) => ({
      ...previous,
      homepage: {
        ...previous.homepage,
        slides: previous.homepage.slides.map((slide, slideIndex) => (
          slideIndex === index ? { ...slide, [field]: value } : slide
        )),
      },
    }));
  };

  const addSlide = () => {
    if (homepage.slides.length >= 6) {
      setError('You can add up to 6 homepage slides.');
      return;
    }

    updateHomepage('slides', [
      ...homepage.slides,
      {
        id: `hero-${Date.now()}`,
        imageUrl: '',
        mobileImageUrl: '',
        alt: 'Sai Praveen Jewellery collection',
      },
    ]);
  };

  const removeSlide = (index) => {
    if (homepage.slides.length <= 1) {
      setError('Keep at least one hero image on the homepage.');
      return;
    }
    updateHomepage('slides', homepage.slides.filter((_, slideIndex) => slideIndex !== index));
  };

  const moveSlide = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= homepage.slides.length) return;

    const nextSlides = [...homepage.slides];
    [nextSlides[index], nextSlides[targetIndex]] = [nextSlides[targetIndex], nextSlides[index]];
    updateHomepage('slides', nextSlides);
  };

  const uploadHomepageMedia = async (file, type, slideIndex = -1, variant = 'desktop') => {
    if (!file) return;

    const isVideo = type === 'video';
    if (isVideo && !file.type.startsWith('video/')) {
      setError('Please choose a video file.');
      return;
    }
    if (!isVideo && !file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }

    setError('');
    setSuccess('');
    if (isVideo) {
      setUploadingVideo(true);
    } else {
      setUploadingSlides((previous) => {
        const next = [...previous];
        next[slideIndex] = true;
        return next;
      });
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || 'Media upload failed.');

      if (isVideo) {
        updateHomepage('videoUrl', data.url);
        updateHomepage('videoEnabled', true);
      } else {
        updateSlide(slideIndex, variant === 'mobile' ? 'mobileImageUrl' : 'imageUrl', data.url);
      }
      setSuccess(`${isVideo ? 'Video' : `${variant === 'mobile' ? 'Mobile' : 'Desktop'} hero image`} uploaded. Save the homepage media to publish it.`);
    } catch (uploadError) {
      setError(uploadError.message || 'Media upload failed.');
    } finally {
      if (isVideo) {
        setUploadingVideo(false);
      } else {
        setUploadingSlides((previous) => {
          const next = [...previous];
          next[slideIndex] = false;
          return next;
        });
      }
    }
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcement }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save announcement.');

      setSettings(mergeSiteSettings(data.settings));
      setSuccess('Your announcement is live on the website.');
    } catch (saveError) {
      setError(saveError.message || 'Could not save announcement.');
    } finally {
      setSaving(false);
    }
  };

  const saveHomepage = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (homepage.slides.some((slide) => !slide.imageUrl || !slide.mobileImageUrl)) {
        throw new Error('Upload both desktop and mobile images for every homepage slide before saving.');
      }

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homepage }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save homepage media.');

      setSettings(mergeSiteSettings(data.settings));
      setSuccess('Homepage images and video are now saved for your website.');
    } catch (saveError) {
      setError(saveError.message || 'Could not save homepage media.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      pageTitle="Store Settings"
      pageDescription="Manage website announcements and content settings."
    >
      <main className="mx-auto max-w-4xl space-y-5 px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-6">
        {(error || success) && (
          <div
            role="status"
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
              error
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {error ? <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />}
            <span>{error || success}</span>
          </div>
        )}

        {checkingAuth || loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-[#E8E0D3] bg-white shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin text-[#C99624]" />
              Loading store settings...
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={saveSettings} className="overflow-hidden rounded-3xl border border-[#E8E0D3] bg-white shadow-sm">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF7E6] text-[#A96F00]">
                      <Megaphone className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold leading-tight text-[#14213D]">Announcement Bar</h2>
                      <p className="mt-1 text-sm text-slate-500 sm:text-base">
                        Share a short offer or important update at the top of your website.
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${announcement.enabled ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                    <span className={`h-2 w-2 rounded-full ${announcement.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    {announcement.enabled ? 'Active & visible' : 'Hidden from website'}
                  </span>
                </div>

                <div className="space-y-5 pt-5">
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-[#EEE8DC] bg-[#FFFDF8] px-4 py-3">
                    <div>
                      <p className="font-semibold text-[#14213D]">Show announcement bar</p>
                      <p className="mt-1 text-xs text-slate-500">Shown above the main navigation.</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={announcement.enabled}
                      aria-label="Show announcement bar"
                      onClick={() => updateAnnouncement('enabled', !announcement.enabled)}
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${announcement.enabled ? 'bg-[#5B1F2A]' : 'bg-slate-300'}`}
                    >
                      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${announcement.enabled ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="announcement-message" className="text-sm font-semibold text-[#14213D]">Announcement message</label>
                      <span className="text-xs text-slate-400">{announcement.message.length}/140</span>
                    </div>
                    <input
                      id="announcement-message"
                      value={announcement.message}
                      maxLength={140}
                      onChange={(event) => updateAnnouncement('message', event.target.value)}
                      placeholder="e.g. Free delivery above ₹1,500 — India delivery addresses only"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#FCFCFB] px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#C99624] focus:ring-4 focus:ring-[#C99624]/10"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="announcement-background" className="text-sm font-semibold text-[#14213D]">Background color</label>
                      <select
                        id="announcement-background"
                        value={announcement.backgroundColor}
                        onChange={(event) => updateAnnouncement('backgroundColor', event.target.value)}
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#FCFCFB] px-4 text-sm text-slate-900 outline-none focus:border-[#C99624] focus:ring-4 focus:ring-[#C99624]/10"
                      >
                        {ANNOUNCEMENT_BACKGROUND_COLORS.map((color) => <option key={color.id} value={color.id}>{color.label}</option>)}
                      </select>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ANNOUNCEMENT_BACKGROUND_COLORS.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            title={color.label}
                            aria-label={`Use ${color.label} background`}
                            onClick={() => updateAnnouncement('backgroundColor', color.id)}
                            className={`h-8 w-8 rounded-full border-2 transition ${announcement.backgroundColor === color.id ? 'border-white ring-2 ring-[#14213D] ring-offset-2' : 'border-white shadow-sm'}`}
                            style={{ backgroundColor: color.value }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="announcement-text" className="text-sm font-semibold text-[#14213D]">Text color</label>
                      <select
                        id="announcement-text"
                        value={announcement.textColor}
                        onChange={(event) => updateAnnouncement('textColor', event.target.value)}
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-[#FCFCFB] px-4 text-sm text-slate-900 outline-none focus:border-[#C99624] focus:ring-4 focus:ring-[#C99624]/10"
                      >
                        {ANNOUNCEMENT_TEXT_COLORS.map((color) => <option key={color.id} value={color.id}>{color.label}</option>)}
                      </select>
                      <p className="mt-3 text-xs text-slate-500">Choose a readable contrast for your selected background.</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#14213D]">
                      <Palette className="h-4 w-4 text-[#C99624]" />
                      Live preview
                    </div>
                    <div
                      className="flex min-h-12 items-center justify-center rounded-xl px-4 py-3 text-center text-sm font-medium shadow-sm"
                      style={{ backgroundColor: background.value, color: textColor.value }}
                    >
                      <Megaphone className="mr-2 h-4 w-4 shrink-0" />
                      <span className="break-words">{announcement.message || 'Your announcement will appear here.'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 bg-[#FFFDF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500">Save when you are ready. The announcement will appear across the website.</p>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#A90D27] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Saving...' : 'Save announcement'}
                </button>
              </div>
            </form>

            <form onSubmit={saveHomepage} className="overflow-hidden rounded-3xl border border-[#E8E0D3] bg-white shadow-sm">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8EEDB] text-[#A8741D]">
                      <ImagePlus className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold leading-tight text-[#211719]">Homepage hero images</h2>
                      <p className="mt-1 text-sm text-slate-500 sm:text-base">
                        Upload two versions for every slide: a wide desktop banner and a taller mobile banner with larger, readable text.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E8D8C6] bg-[#FCF8F1] px-3 py-1.5 text-xs font-semibold text-[#7B5A21]">
                    {homepage.slides.length}/6 slides
                  </span>
                </div>

                <div className="grid gap-4 pt-5 md:grid-cols-2">
                  {homepage.slides.map((slide, index) => (
                    <article key={slide.id} className="overflow-hidden rounded-2xl border border-[#E8E0D3] bg-[#FFFDF9]">
                      <div className="relative grid grid-cols-[minmax(0,1fr)_110px] gap-2 bg-[#F4EEE6] p-2 sm:grid-cols-[minmax(0,1fr)_140px]">
                        <div className="relative aspect-[12/5] overflow-hidden rounded-xl bg-[#E9DFD5]">
                          {slide.imageUrl ? (
                            <img src={slide.imageUrl} alt={`${slide.alt || 'Homepage hero'} desktop preview`} className="h-full w-full object-contain" />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-xs text-slate-400">
                              <ImagePlus className="h-6 w-6" />
                              Desktop image
                            </div>
                          )}
                          <span className="absolute left-2 top-2 rounded-full bg-[#211719]/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#FFF9EF]">Desktop</span>
                        </div>
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#E9DFD5]">
                          {slide.mobileImageUrl ? (
                            <img src={slide.mobileImageUrl} alt={`${slide.alt || 'Homepage hero'} mobile preview`} className="h-full w-full object-contain" />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center gap-1 px-2 text-center text-xs text-slate-400">
                              <ImagePlus className="h-6 w-6" />
                              Mobile image
                            </div>
                          )}
                          <span className="absolute left-2 top-2 rounded-full bg-[#211719]/80 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#FFF9EF]">Mobile</span>
                        </div>
                        {uploadingSlides[index] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#211719]/55 text-white backdrop-blur-sm">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-2">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#5B1F2A] px-3 py-2 text-xs font-semibold text-[#FFF9EF] transition hover:bg-[#42151F]">
                              <Upload className="h-4 w-4" />
                              Desktop image
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) => {
                                  uploadHomepageMedia(event.target.files?.[0], 'image', index, 'desktop');
                                  event.target.value = '';
                                }}
                              />
                            </label>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#5B1F2A] px-3 py-2 text-xs font-semibold text-[#5B1F2A] transition hover:bg-[#F8EEDB]">
                              <Upload className="h-4 w-4" />
                              Mobile image
                              <input
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(event) => {
                                  uploadHomepageMedia(event.target.files?.[0], 'image', index, 'mobile');
                                  event.target.value = '';
                                }}
                              />
                            </label>
                          </div>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => moveSlide(index, -1)} disabled={index === 0} className="rounded-lg p-2 text-slate-500 transition hover:bg-[#F8EEDB] hover:text-[#5B1F2A] disabled:cursor-not-allowed disabled:opacity-30" aria-label={`Move slide ${index + 1} up`}>
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => moveSlide(index, 1)} disabled={index === homepage.slides.length - 1} className="rounded-lg p-2 text-slate-500 transition hover:bg-[#F8EEDB] hover:text-[#5B1F2A] disabled:cursor-not-allowed disabled:opacity-30" aria-label={`Move slide ${index + 1} down`}>
                              <ArrowDown className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => removeSlide(index)} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600" aria-label={`Remove slide ${index + 1}`}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`slide-alt-${index}`} className="text-xs font-semibold text-[#211719]">Accessibility description</label>
                          <input
                            id={`slide-alt-${index}`}
                            value={slide.alt || ''}
                            maxLength={160}
                            onChange={(event) => updateSlide(index, 'alt', event.target.value)}
                            placeholder="Sai Praveen Jewellery collection"
                            className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#C99A2E] focus:ring-4 focus:ring-[#C99A2E]/10"
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <button type="button" onClick={addSlide} disabled={homepage.slides.length >= 6} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-[#C99A2E]/60 px-4 py-2.5 text-sm font-semibold text-[#7B5A21] transition hover:bg-[#FFF8E8] disabled:cursor-not-allowed disabled:opacity-40">
                  <Plus className="h-4 w-4" />
                  Add another slide
                </button>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 bg-[#FFFDF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500">Recommended: desktop 1920×800 px · mobile 1080×1350 px.</p>
                <button type="submit" disabled={saving || uploadingSlides.some(Boolean)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B1F2A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42151F] disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Saving...' : 'Save hero images'}
                </button>
              </div>
            </form>

            <form onSubmit={saveHomepage} className="overflow-hidden rounded-3xl border border-[#E8E0D3] bg-white shadow-sm">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8EEDB] text-[#A8741D]">
                      <Video className="h-5 w-5" strokeWidth={1.8} />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold leading-tight text-[#211719]">Shop story video</h2>
                      <p className="mt-1 text-sm text-slate-500 sm:text-base">
                        Add a short video that introduces the store and its craftsmanship.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={homepage.videoEnabled}
                    aria-label="Show shop story video"
                    onClick={() => updateHomepage('videoEnabled', !homepage.videoEnabled)}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${homepage.videoEnabled ? 'bg-[#5B1F2A]' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${homepage.videoEnabled ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>

                <div className="grid gap-5 pt-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                  <div className="overflow-hidden rounded-2xl bg-[#211719] shadow-sm">
                    {homepage.videoUrl ? (
                      <video src={homepage.videoUrl} poster={STATIC_MEDIA.shopStoryPoster} controls muted className="aspect-video w-full object-cover" preload="metadata" />
                    ) : (
                      <div className="flex aspect-video items-center justify-center text-sm text-white/70">Upload a video to preview it here.</div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#C99A2E] px-4 py-3 text-sm font-semibold text-[#211719] transition hover:bg-[#D9AA3D]">
                      {uploadingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploadingVideo ? 'Uploading video...' : 'Upload new video'}
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="sr-only"
                        disabled={uploadingVideo}
                        onChange={(event) => {
                          uploadHomepageMedia(event.target.files?.[0], 'video');
                          event.target.value = '';
                        }}
                      />
                    </label>
                    <div>
                      <label htmlFor="homepage-video-url" className="text-xs font-semibold text-[#211719]">Or use a video URL</label>
                      <input
                        id="homepage-video-url"
                        value={homepage.videoUrl || ''}
                        onChange={(event) => updateHomepage('videoUrl', event.target.value)}
                        placeholder="https://.../shop-story.mp4"
                        className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-[#FCFCFB] px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#C99A2E] focus:ring-4 focus:ring-[#C99A2E]/10"
                      />
                    </div>
                    <p className="text-xs leading-5 text-slate-500">Recommended: MP4, landscape format, and under 30 seconds for a fast premium homepage experience.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 bg-[#FFFDF8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500">The video appears below the hero marquee when enabled.</p>
                <button type="submit" disabled={saving || uploadingVideo} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5B1F2A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#42151F] disabled:cursor-not-allowed disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {saving ? 'Saving...' : 'Save video settings'}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </AdminShell>
  );
}
