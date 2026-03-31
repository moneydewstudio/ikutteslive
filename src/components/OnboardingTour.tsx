import React, { useEffect, useRef } from 'react';
import { driver, type DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useOnboardingTour } from '../contexts/OnboardingTourContext';

const OnboardingTour: React.FC = () => {
  const { replayTour, isTourActive, setIsTourActive } = useOnboardingTour();
  const driverObjRef = useRef<any>(null);

  useEffect(() => {
    // Check if tour was already completed
    if (localStorage.getItem('onboarding_tour_v1_completed') === '1') {
      return;
    }

    // Wait for DOM elements to be ready
    const timeoutId = setTimeout(() => {
      const steps: DriveStep[] = [
        {
          // Step 1: Welcome (no element)
          popover: {
            title: 'Selamat datang di Ikuttes! 👋',
            description: 'Mari kenali fitur utama aplikasi latihan CPNS.',
          },
        },
        {
          // Step 2: Logo
          element: '[data-tour="header-logo"]',
          popover: {
            title: 'Kembali ke Beranda',
            description: 'Klik logo kapan saja untuk kembali ke halaman Drills.',
          },
        },
        {
          // Step 3: Nav bar (container, not single item)
          element: '[data-tour="nav-bar"]',
          popover: {
            title: 'Menu Utama',
            description: 'Akses Drills, Latihan Harian, Tryout SKD, dan Statistik dari sini.',
          },
        },
        {
          // Step 4: Drills cards (container, not single card)
          element: '[data-tour="drills-cards"]',
          popover: {
            title: 'Latihan per Kategori',
            description: '20 soal fokus TIU, TWK, atau TKP. Gratis: 1 kategori per hari.',
          },
        },
        {
          // Step 5: Done (no element)
          popover: {
            title: 'Siap latihan! 🚀',
            description: 'Pilih kategori di atas untuk mulai. Ulangi panduan kapan saja dari halaman Profil.',
          },
        },
      ];

      // Filter out steps with missing elements
      const validSteps = steps.filter((step) => {
        if (!step.element) return true; // Always include steps without elements
        if (typeof step.element === 'string') {
          return document.querySelector(step.element) !== null;
        }
        if (typeof step.element === 'function') {
          return step.element() != null;
        }
        return step.element != null;
      });

      // If no valid steps with elements remain, still show welcome/done steps
      if (validSteps.length < 2) {
        console.warn('OnboardingTour: No valid target elements found, skipping tour');
        return;
      }

      // Create and start the tour
      driverObjRef.current = driver({
        steps: validSteps,
        showProgress: true,
        allowClose: true,
        nextBtnText: 'Lanjut',
        prevBtnText: 'Kembali',
        doneBtnText: 'Mulai Latihan',
        onDestroyed: () => {
          // Mark tour as completed
          localStorage.setItem('onboarding_tour_v1_completed', '1');
          localStorage.setItem('onboarding_tour_v1_completed_at', new Date().toISOString());
          setIsTourActive(false);
        },
        onHighlightStarted: () => {
          setIsTourActive(true);
        },
      });

      driverObjRef.current.drive();
    }, 500); // 500ms delay for DOM readiness

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (driverObjRef.current) {
        driverObjRef.current.destroy();
      }
    };
  }, [setIsTourActive]);

  return null; // This component doesn't render anything
};

export default OnboardingTour;
