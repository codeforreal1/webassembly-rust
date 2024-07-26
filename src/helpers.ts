/**
 * Calculates approximate size of a image from base64 string
 * @param {string} base64String
 * @returns
 */
export function getImageSizeFromBase64(base64String: string) {
  const padding = (base64String.match(/=*$/) || [""])[0].length;
  const base64Length = base64String.length;
  const sizeInBytes = base64Length * 0.75 - padding;
  return sizeInBytes;
}

/**
 * Formats bytes to human readable size format
 * @param {number} bytes
 * @param {number} decimals
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
