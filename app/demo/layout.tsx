import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ConvexClientProvider } from "../ConvexClientProvider";
import { GA_ID } from "@/lib/analytics";
import "../globals.css";

export const metadata: Metadata = {
    title: "SynauLearn Demo — Learn Web3 in 5 Minutes",
    description:
        "Try SynauLearn for free. Flip flashcards, answer quizzes, and experience Web3 learning — no sign-up needed.",
    openGraph: {
        title: "SynauLearn Demo — Learn Web3 in 5 Minutes",
        description:
            "Try SynauLearn for free. Flip flashcards, answer quizzes, and experience Web3 learning — no sign-up needed.",
        url: "https://app.synaulearn.com/demo",
        siteName: "SynauLearn",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "SynauLearn Demo",
        description:
            "Learn Web3 in 5 minutes — free demo, no sign-up needed.",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ConvexClientProvider>
            <main className="min-h-screen">
                {children}
            </main>
            <GoogleAnalytics gaId={GA_ID} />
        </ConvexClientProvider>
    );
}
