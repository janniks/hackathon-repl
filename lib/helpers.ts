import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function utf8ToBytes(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

export function bytesToUtf8(arr: Uint8Array): string {
  return new TextDecoder().decode(arr);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
