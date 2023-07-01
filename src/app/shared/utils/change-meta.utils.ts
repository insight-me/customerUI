export function changeMetaToDesktop(): void {
  const viewport = document.querySelector('meta[name=viewport]');
  viewport.setAttribute('content', 'width=1200');
}

export function changeMetaToMobile(): void {
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport.getAttribute('content') === 'width=1200') {
    viewport.setAttribute('content', 'width=device-width');
  }
}
