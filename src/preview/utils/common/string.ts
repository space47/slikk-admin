export function ellipsis(s: string, n: number) {
  if (s.length <= n) {
    return s;
  } else {
    return s.substring(0, n) + "...";
  }
}
