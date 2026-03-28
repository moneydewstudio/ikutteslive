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
