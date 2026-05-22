/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

export default function useWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : '';
    const height = hasWindow ? window.innerHeight : '';
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      window.addEventListener('resize', () => setWindowDimensions(getWindowDimensions()));
      return () => window.removeEventListener('resize', () => setWindowDimensions(getWindowDimensions()));
    }
  }, [hasWindow]);

  return windowDimensions;
}
