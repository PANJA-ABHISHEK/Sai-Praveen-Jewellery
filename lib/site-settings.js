import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, withFirestoreTimeout } from '@/lib/firebase';
import {
  ANNOUNCEMENT_BACKGROUND_COLORS,
  ANNOUNCEMENT_TEXT_COLORS,
  mergeSiteSettings,
} from '@/data/siteSettings';

const SETTINGS_DOC = doc(db, 'settings', 'siteSettings');

export async function getSiteSettings() {
  const snapshot = await withFirestoreTimeout(() => getDoc(SETTINGS_DOC));
  return mergeSiteSettings(snapshot.exists() ? snapshot.data() : {});
}

function isAllowedMediaUrl(value) {
  return value.startsWith('/') || /^https?:\/\//i.test(value);
}

function normalizeHomepageSettings(input, current) {
  const requestedSlides = Array.isArray(input?.slides) ? input.slides : current.homepage.slides;
  const slides = requestedSlides
    .filter((slide) => {
      const desktopUrl = String(slide?.imageUrl || '').trim();
      const mobileUrl = String(slide?.mobileImageUrl || desktopUrl).trim();
      return isAllowedMediaUrl(desktopUrl) && isAllowedMediaUrl(mobileUrl);
    })
    .slice(0, 6)
    .map((slide, index) => ({
      id: String(slide.id || `hero-${index + 1}`),
      imageUrl: String(slide.imageUrl).trim(),
      mobileImageUrl: String(slide.mobileImageUrl || slide.imageUrl).trim(),
      alt: String(slide.alt || 'Sai Praveen Jewellery collection').trim().slice(0, 160),
    }));

  if (slides.length === 0) {
    throw new Error('Please keep at least one hero image on the homepage.');
  }

  const videoUrl = String(input?.videoUrl ?? current.homepage.videoUrl ?? '').trim();
  if (videoUrl && !isAllowedMediaUrl(videoUrl)) {
    throw new Error('Please use a valid homepage video URL.');
  }

  if (input?.videoEnabled && !videoUrl) {
    throw new Error('Add a homepage video before enabling the video section.');
  }

  return {
    slides,
    videoUrl,
    videoEnabled: Boolean(input?.videoEnabled),
  };
}

export async function saveSiteSettings(input = {}, adminUid = 'admin') {
  const current = await getSiteSettings();
  const announcementInput = input.announcement;
  const message = String(announcementInput?.message ?? current.announcement.message).trim();

  if (!message) {
    throw new Error('Please enter an announcement message.');
  }

  if (message.length > 140) {
    throw new Error('Announcement messages must be 140 characters or fewer.');
  }

  const backgroundColor = ANNOUNCEMENT_BACKGROUND_COLORS.some(
    (color) => color.id === announcementInput?.backgroundColor
  )
    ? announcementInput.backgroundColor
    : current.announcement.backgroundColor;
  const textColor = ANNOUNCEMENT_TEXT_COLORS.some(
    (color) => color.id === announcementInput?.textColor
  )
    ? announcementInput.textColor
    : current.announcement.textColor;

  const homepage = normalizeHomepageSettings(input.homepage, current);

  const nextSettings = mergeSiteSettings({
    ...current,
    announcement: {
      enabled: announcementInput?.enabled === undefined
        ? current.announcement.enabled
        : Boolean(announcementInput.enabled),
      message,
      backgroundColor,
      textColor,
    },
    homepage,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUid,
  });

  await withFirestoreTimeout(() => setDoc(SETTINGS_DOC, {
    ...nextSettings,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUid,
  }, { merge: true }));

  return nextSettings;
}

export async function saveAnnouncementSettings(input, adminUid = 'admin') {
  return saveSiteSettings({ announcement: input }, adminUid);
}
