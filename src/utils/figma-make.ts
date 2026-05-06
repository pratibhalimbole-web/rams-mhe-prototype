/**
 * Figma Make Tool Detection Utilities
 * 
 * This module provides utilities to detect when Figma Make's "Point and Edit" tool
 * is active and prevent navigation/routing events that would cause page reloads.
 */

/**
 * Checks if Figma Make edit mode is currently active
 */
export function isFigmaMakeActive(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for Figma Make overlay elements in the DOM
  const hasOverlay = 
    document.querySelector('[data-figma-make-overlay]') ||
    document.querySelector('[data-figma-make-edit-mode]') ||
    document.querySelector('[class*="figma-make"]') ||
    document.querySelector('[id*="figma-make"]');
  
  return !!hasOverlay;
}

/**
 * Checks if a click event originated from Figma Make tools
 */
export function isEventFromFigmaMake(e: Event): boolean {
  if (!e.target) return false;
  
  const target = e.target as HTMLElement;
  
  // Check if the target or any parent is part of Figma Make UI
  const isFigmaMakeElement = 
    target.closest('[data-figma-make-overlay]') ||
    target.closest('[data-figma-make-edit-mode]') ||
    target.closest('[class*="figma-make"]') ||
    target.closest('[id*="figma-make"]');
  
  return !!isFigmaMakeElement;
}

/**
 * Safe event handler wrapper that prevents default behavior when Figma Make is active
 * 
 * Usage:
 * ```tsx
 * <button onClick={safeFigmaMakeHandler(() => myFunction())}>
 *   Click me
 * </button>
 * ```
 */
export function safeFigmaMakeHandler<T extends Event = Event>(
  handler: (e: T) => void,
  options?: {
    preventDefault?: boolean;
    stopPropagation?: boolean;
    allowWhenFigmaMakeActive?: boolean;
  }
) {
  return (e: T) => {
    const {
      preventDefault = true,
      stopPropagation = true,
      allowWhenFigmaMakeActive = false
    } = options || {};

    // If Figma Make tool is active and we shouldn't allow the action
    if (isFigmaMakeActive() && !allowWhenFigmaMakeActive) {
      console.log('🛑 Blocked action - Figma Make edit mode is active');
      if (preventDefault) e.preventDefault();
      if (stopPropagation) e.stopPropagation();
      return;
    }

    // If event is from Figma Make tools, let them work
    if (isEventFromFigmaMake(e)) {
      console.log('✅ Figma Make tool detected - allowing action');
      return;
    }

    // Always prevent default and stop propagation for safety
    if (preventDefault) e.preventDefault();
    if (stopPropagation) e.stopPropagation();

    // Execute the handler
    handler(e);
  };
}

/**
 * Hook for navigation that's safe with Figma Make
 * Returns a function that will only navigate if Figma Make is not active
 */
export function createSafeNavigator(
  navigate: (path: string) => void
): (path: string) => void {
  return (path: string) => {
    if (isFigmaMakeActive()) {
      console.log('🛑 Navigation blocked - Figma Make edit mode is active');
      return;
    }
    navigate(path);
  };
}

/**
 * Create a safe click handler for navigation/routing
 * 
 * Usage:
 * ```tsx
 * <div onClick={createSafeClickHandler(() => navigate('/path'))}>
 *   Navigate
 * </div>
 * ```
 */
export function createSafeClickHandler(
  handler: () => void
): (e: React.MouseEvent) => void {
  return (e: React.MouseEvent) => {
    // Always prevent default navigation
    e.preventDefault();
    e.stopPropagation();

    // If Figma Make is active, block the action
    if (isFigmaMakeActive()) {
      console.log('🛑 Click handler blocked - Figma Make edit mode is active');
      return;
    }

    // If event is from Figma Make tools, let them work
    if (isEventFromFigmaMake(e.nativeEvent)) {
      console.log('✅ Figma Make tool detected - allowing click');
      return;
    }

    // Execute the handler
    handler();
  };
}
