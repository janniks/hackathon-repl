export function utf8ToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function bytesToUtf8(arr: Uint8Array): string {
  return new TextDecoder().decode(arr);
}
