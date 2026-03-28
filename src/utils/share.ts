export function canShareFiles(): boolean {
  try {
    return Boolean(
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({
        files: [new File([], 'test.png', { type: 'image/png' })],
      })
    );
  } catch {
    return false;
  }
}

export async function dataUrlToFile(
  dataUrl: string,
  filename: string
): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: 'image/png' });
}

export async function shareWithFile(
  file: File,
  text: string
): Promise<boolean> {
  if (!canShareFiles()) return false;
  try {
    await navigator.share({ text, files: [file] });
    return true;
  } catch {
    return false;
  }
}

export function downloadImage(dataUrl: string, filename: string): void {
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function waitForCardAssets(root: HTMLElement): Promise<void> {
  const fontsReady = (document as unknown as { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
  if (fontsReady) {
    try {
      await fontsReady;
    } catch {
      // ignore
    }
  }

  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(async (img) => {
      if (img.complete && img.naturalWidth > 0) {
        if (typeof img.decode === 'function') {
          try {
            await img.decode();
          } catch {
            // ignore
          }
        }
        return;
      }

      await new Promise<void>((resolve) => {
        const cleanup = () => {
          img.removeEventListener('load', onDone);
          img.removeEventListener('error', onDone);
        };
        const onDone = () => {
          cleanup();
          resolve();
        };
        img.addEventListener('load', onDone);
        img.addEventListener('error', onDone);
      });
    })
  );
}
