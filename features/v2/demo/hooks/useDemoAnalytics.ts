"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { trackEvent } from "@/lib/analytics";

const SESSION_KEY = "synaulearn_demo_session_id";

function generateSessionId(): string {
    return "demo_" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function getOrCreateSessionId(): string {
    if (typeof window === "undefined") return generateSessionId();

    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}

export function useDemoAnalytics(locale: string) {
    const [sessionId] = useState(() => getOrCreateSessionId());
    const initialized = useRef(false);

    const startSessionMutation = useMutation(api.demo.startSession);
    const updateSessionMutation = useMutation(api.demo.updateSession);
    const completeSessionMutation = useMutation(api.demo.completeSession);
    const recordCtaClickMutation = useMutation(api.demo.recordCtaClick);

    // Start session on mount
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        startSessionMutation({
            session_id: sessionId,
            referrer: typeof document !== "undefined" ? document.referrer : undefined,
            user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
            locale,
        }).catch(console.error);

        trackEvent("demo_started", { locale });
    }, [sessionId, locale, startSessionMutation]);

    const trackCardViewed = useCallback(
        (cardIndex: number, cardsViewed: number, quizScore: number) => {
            updateSessionMutation({
                session_id: sessionId,
                cards_viewed: cardsViewed,
                quiz_score: quizScore,
            }).catch(console.error);

            trackEvent("demo_card_viewed", { card_index: cardIndex, locale });
        },
        [sessionId, locale, updateSessionMutation]
    );

    const trackQuizAnswered = useCallback(
        (cardIndex: number, isCorrect: boolean) => {
            trackEvent("demo_quiz_answered", {
                card_index: cardIndex,
                is_correct: isCorrect,
                locale,
            });
        },
        [locale]
    );

    const trackCompleted = useCallback(
        (score: number, totalCards: number) => {
            completeSessionMutation({ session_id: sessionId }).catch(console.error);
            trackEvent("demo_completed", { score, total_cards: totalCards, locale });
        },
        [sessionId, locale, completeSessionMutation]
    );

    const trackCtaClick = useCallback(
        (ctaType: string) => {
            recordCtaClickMutation({
                session_id: sessionId,
                cta_type: ctaType,
            }).catch(console.error);
            trackEvent("demo_cta_click", { cta_type: ctaType, locale });
        },
        [sessionId, locale, recordCtaClickMutation]
    );

    return {
        sessionId,
        trackCardViewed,
        trackQuizAnswered,
        trackCompleted,
        trackCtaClick,
    };
}
