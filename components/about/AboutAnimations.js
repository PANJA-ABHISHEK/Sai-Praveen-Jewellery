'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutAnimations() {
  useEffect(() => {
    AOS.init({
      duration: 760,
      easing: 'ease-out-cubic',
      once: true,
      offset: 64,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
    AOS.refreshHard();
  }, []);

  return null;
}
