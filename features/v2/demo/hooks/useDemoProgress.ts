"use client";

import { useState, useCallback } from "react";

const PROGRESS_KEY = "synaulearn_demo_progress";

interface DemoProgress {
    currentCardIndex: number;
    completedCards: number[];
    quizAnswers: Record<number, boolean>; // cardIndex -> isCorrect
    xpEarned: number;
    isCompleted: boolean;
}

const defaultProgress: DemoProgress = {
    currentCardIndex: 0,
    completedCards: [],
    quizAnswers: {},
    xpEarned: 0,
    isCompleted: false,
};

function loadProgress(): DemoProgress {
    if (typeof window === "undefined") return defaultProgress;
    try {
        const saved = localStorage.getItem(PROGRESS_KEY);
        if (saved) return JSON.parse(saved);
    } catch {
        // ignore
    }
    return defaultProgress;
}

function saveProgress(progress: DemoProgress) {
    if (typeof window === "undefined") return;
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function useDemoProgress() {
    const [progress, setProgress] = useState<DemoProgress>(loadProgress);

    const updateProgress = useCallback((updater: (prev: DemoProgress) => DemoProgress) => {
        setProgress((prev) => {
            const next = updater(prev);
            saveProgress(next);
            return next;
        });
    }, []);

    const goToCard = useCallback(
        (index: number) => {
            updateProgress((p) => ({ ...p, currentCardIndex: index }));
        },
        [updateProgress]
    );

    const completeCard = useCallback(
        (cardIndex: number) => {
            updateProgress((p) => ({
                ...p,
                completedCards: p.completedCards.includes(cardIndex)
                    ? p.completedCards
                    : [...p.completedCards, cardIndex],
            }));
        },
        [updateProgress]
    );

    const recordQuizAnswer = useCallback(
        (cardIndex: number, isCorrect: boolean) => {
            updateProgress((p) => ({
                ...p,
                quizAnswers: { ...p.quizAnswers, [cardIndex]: isCorrect },
                xpEarned: p.xpEarned + (isCorrect ? 20 : 5),
            }));
        },
        [updateProgress]
    );

    const markCompleted = useCallback(() => {
        updateProgress((p) => ({ ...p, isCompleted: true }));
    }, [updateProgress]);

    const resetProgress = useCallback(() => {
        setProgress(defaultProgress);
        if (typeof window !== "undefined") {
            localStorage.removeItem(PROGRESS_KEY);
        }
    }, []);

    const quizScore = Object.values(progress.quizAnswers).filter(Boolean).length;
    const totalAnswered = Object.keys(progress.quizAnswers).length;

    return {
        ...progress,
        quizScore,
        totalAnswered,
        goToCard,
        completeCard,
        recordQuizAnswer,
        markCompleted,
        resetProgress,
    };
}
