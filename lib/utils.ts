import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const METADATA = {
  name: "Base Mini App Demo",
  description: "A demo mini app for testing capabilities on Base",
  bannerImageUrl: 'https://i.imgur.com/2bsV8mV.png',
  iconImageUrl: 'https://i.imgur.com/brcnijg.png',
  homeUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://synaulearn.com",
  splashBackgroundColor: "#FFFFFF"
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
