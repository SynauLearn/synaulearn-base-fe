"use client";

import { useState, useRef, useEffect } from "react";

interface FillBlankQuizProps {
    question: string;
    description?: string;
    correctAnswer: string;
    acceptableAnswers?: string[];
    hint?: string;
    onComplete: (isCorrect: boolean) => void;
    onBack: () => void;
}

export default function FillBlankQuiz({
    question,
    description,
    correctAnswer,
    acceptableAnswers = [],
    hint,
    onComplete,
    onBack,
}: FillBlankQuizProps) {
    const [userAnswer, setUserAnswer] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Focus the input when component mounts
        inputRef.current?.focus();
    }, []);

    const checkAnswer = (answer: string): boolean => {
        const normalizedAnswer = answer.toLowerCase().trim();
        const normalizedCorrect = correctAnswer.toLowerCase().trim();

        // Check main answer
        if (normalizedAnswer === normalizedCorrect) {
            return true;
        }

        // Check acceptable alternatives
        return acceptableAnswers.some(
            alt => normalizedAnswer === alt.toLowerCase().trim()
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim()) return;

        const correct = checkAnswer(userAnswer);
        setIsCorrect(correct);
        setShowResult(true);
    };

    const handleContinue = () => {
        onComplete(isCorrect);
    };

    // Parse question to highlight blank
    const renderQuestion = () => {
        const parts = question.split("_____");
        if (parts.length === 1) {
            return <span>{question}</span>;
        }

        return (
            <>
                {parts[0]}
                <span className="inline-block min-w-[100px] border-b-2 border-blue-500 mx-1 text-blue-400">
                    {userAnswer || "?????"}
                </span>
                {parts[1]}
            </>
        );
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] px-6">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">{isCorrect ? "🎉" : "😔"}</div>
                    <h2 className="text-3xl font-bold mb-4">
                        {isCorrect ? "Correct!" : "Incorrect"}
                    </h2>
                    <p className="text-gray-400 mb-4">
                        {isCorrect
                            ? "Great job! You got it right."
                            : `Your answer: "${userAnswer}"`}
                    </p>
                    {!isCorrect && (
                        <p className="text-white mb-8">
                            The correct answer was: <span className="text-green-400 font-bold">{correctAnswer}</span>
                        </p>
                    )}
                    <button
                        onClick={handleContinue}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
                    >
                        Continue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 px-6 pb-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 leading-relaxed">
                    {renderQuestion()}
                </h2>
                {description && (
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <input
                    ref={inputRef}
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full px-6 py-4 bg-[#2a2d42] text-white rounded-2xl border-2 border-transparent focus:border-blue-600 focus:outline-none placeholder-gray-500 text-lg"
                    autoComplete="off"
                    autoCapitalize="off"
                />

                <button
                    type="submit"
                    disabled={!userAnswer.trim()}
                    className={`w-full font-bold py-4 px-8 rounded-2xl transition-all ${userAnswer.trim()
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-[#2a2d42] text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Submit Answer
                </button>
            </form>

            {hint && (
                <div className="mb-6">
                    {showHint ? (
                        <div className="bg-[#2a2d42] rounded-2xl p-4">
                            <p className="text-sm text-gray-400">
                                <span className="text-yellow-400 font-medium">💡 Hint:</span> {hint}
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowHint(true)}
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                            💡 Need a hint?
                        </button>
                    )}
                </div>
            )}

            <button
                onClick={onBack}
                className="w-full bg-[#2a2d42] hover:bg-[#333649] text-gray-400 font-medium py-3 px-6 rounded-2xl transition-all"
            >
                Back to Flashcard
            </button>
        </div>
    );
}
