import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Gunakan ClassValue dari clsx sebagai tipe
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}