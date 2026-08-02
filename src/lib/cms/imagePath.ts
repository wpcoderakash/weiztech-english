/** Shared image-field heuristic (server jsonform + client repeater). */
export function isImagePath(value: string, key?: string): boolean {
  if (/\.(webp|png|jpe?g|svg|gif|avif)(\?|$)/i.test(value)) return true;
  if (value.startsWith("/images/")) return true;
  if (value.includes("/storage/v1/object/public/")) return true;
  return ["src", "image", "cover", "logo"].includes(key ?? "") && value.startsWith("/");
}
