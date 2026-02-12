/**
 * Google Analytics 4 helper — thin wrapper around gtag()
 * GA4 Measurement ID: G-VZJ0VDY0XZ
 */

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-VZJ0VDY0XZ";

// Type-safe event names for the demo
export type DemoEvent =
    | "demo_started"
    | "demo_card_viewed"
    | "demo_quiz_answered"
    | "demo_completed"
    | "demo_cta_click"
    | "demo_drop_off";

type GTagEvent = DemoEvent | string;

interface EventParams {
    [key: string]: string | number | boolean | undefined;
}

/**
 * Send a custom event to GA4
 */
export function trackEvent(eventName: GTagEvent, params?: EventParams) {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;

    window.gtag("event", eventName, params);
}

// Extend Window interface for gtag
declare global {
    interface Window {
        gtag: (...args: unknown[]) => void;
    }
}
