import React, { useEffect, useState } from "react";
import { Toaster } from "./components/ui/sonner";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { isFigmaMakeActive, isEventFromFigmaMake } from "../utils/figma-make";
import { StorageWarningBanner } from "./components/StorageWarningBanner";
import { ThemeProvider } from "./components/theme-provider";

// Version: 2.0.1 - Router-based navigation (Cache cleared)
export default function App() {
  // 🔒 Enhanced Global reload prevention for Figma Make tools
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔒 Enhanced reload prevention active - Figma Make tools should work normally");
    }

    // Prevent ALL default navigation and form events globally when Figma Make is active
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Always allow Figma Make tools to work
      if (
        target.closest('[data-figma-make-overlay]') || 
        target.closest('[data-figma-make-edit-mode]') ||
        target.closest('[class*="figma-make"]') ||
        target.closest('[id*="figma-make"]')
      ) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Figma Make tool detected - allowing action');
        }
        return;
      }

      // Block navigation when Figma Make is active
      if (isFigmaMakeActive()) {
        const anchor = target.closest('a');
        const button = target.closest('button');
        
        if (anchor && anchor.getAttribute('href') !== '#') {
          if (process.env.NODE_ENV === 'development') {
            console.log('🛑 Blocked navigation - Figma Make edit mode is active');
          }
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        
        // Block any button that might trigger navigation
        if (button && button.getAttribute('type') !== 'button') {
          if (process.env.NODE_ENV === 'development') {
            console.log('🛑 Blocked button action - Figma Make edit mode is active');
          }
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    };

    // Prevent unwanted form submissions
    const handleFormSubmit = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Allow Figma Make tools to work
      if (isEventFromFigmaMake(e)) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Figma Make tool detected - allowing action');
        }
        return;
      }

      // Check if this is an actual form that should submit
      const form = target.closest('form');
      if (form && form.hasAttribute('data-allow-submit')) {
        return; // Allow intentional form submissions
      }

      // Prevent default form submission that would reload page
      if (target.tagName === 'FORM' || target.closest('form')) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🛑 Prevented form submission that would reload page');
        }
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Prevent unwanted anchor navigation
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Allow Figma Make tools to work
      if (isEventFromFigmaMake(e)) {
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Figma Make tool detected - allowing action');
        }
        return;
      }

      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        // Prevent hash-only navigation that might cause issues
        if (href === '#' || href === '') {
          e.preventDefault();
        }
      }
    };

    // Detect if page is actually reloading/unloading
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFigmaMakeActive()) {
        if (process.env.NODE_ENV === 'development') {
          console.log('⚠️ Page unload detected while Figma Make is active!');
        }
        // Try to prevent unload
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Add global listeners with capture phase for early interception
    document.addEventListener('click', handleGlobalClick, true);
    document.addEventListener('submit', handleFormSubmit, true);
    document.addEventListener('click', handleAnchorClick, true);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      document.removeEventListener('submit', handleFormSubmit, true);
      document.removeEventListener('click', handleAnchorClick, true);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="w-screen h-screen overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
        <RouterProvider router={router} />
        <Toaster />
        <StorageWarningBanner />
      </div>
    </ThemeProvider>
  );
}