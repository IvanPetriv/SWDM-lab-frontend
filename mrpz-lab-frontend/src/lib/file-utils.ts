export function saveBlob(blob: Blob, filename?: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  if (filename) a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function downloadAndSave(
  downloadFn: (id: string) => Promise<Blob>,
  id: string,
  filename?: string
) {
  const blob = await downloadFn(id);
  saveBlob(blob, filename);
}

export default saveBlob;
