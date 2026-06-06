export function isPortrait(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(orientation: portrait)').matches;
}

export function onOrientationChange(callback: (isPortrait: boolean) => void): void {
  if (typeof window === 'undefined') return;
  window.addEventListener('orientationchange', () => {
    callback(isPortrait());
  });
  window.matchMedia('(orientation: portrait)').addEventListener('change', (e: MediaQueryListEvent) => {
    callback(e.matches);
  });
}
