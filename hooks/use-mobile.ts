// Simple React hook to detect if screen width is below a breakpoint (mobile)
// Usage: const isMobile = useIsMobile();
// Default breakpoint is 768px, override by passing another number.

'use client';

import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    function update() {
      setIsMobile(window.innerWidth < breakpoint);
    }

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);

  return isMobile;
}
