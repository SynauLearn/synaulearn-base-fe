"use client";

import { useState } from "react";

interface QuizOption {
    id: string;
    text: string;
}

interface MultipleChoiceQuizProps {
    question: string;
    description?: string;
    options: QuizOption[];
    correctAnswer: string;
    onComplete: (isCorrect: boolean) => void;
    onBack: () => void;
}

export default function MultipleChoiceQuiz({
    question,
    description,
    options,
    correctAnswer,
    onComplete,
    onBack,
}: MultipleChoiceQuizProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleAnswerSelect = (optionId: string) => {
        const correct = optionId === correctAnswer;
        setSelectedAnswer(optionId);
        setIsCorrect(correct);
        setShowResult(true);
    };

    const handleContinue = () => {
        onComplete(isCorrect);
    };

    if (showResult) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] px-6">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-6">{isCorrect ? "🎉" : "😔"}</div>
                    <h2 className="text-3xl font-bold mb-4">
                        {isCorrect ? "Correct!" : "Incorrect"}
                    </h2>
                    <p className="text-gray-400 mb-8">
                        {isCorrect
                            ? "Great job! You got it right."
                            : `The correct answer was: ${options.find(o => o.id === correctAnswer)?.text}`}
                    </p>
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
            <h2 className="text-2xl font-bold mb-4">{question}</h2>
            {description && (
                <p className="text-gray-400 text-sm leading-relaxed mb-8">{description}</p>
            )}

            <div className="space-y-3 mb-8">
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        className={`w-full text-left px-6 py-4 rounded-2xl font-medium transition-all ${selectedAnswer === option.id
                                ? "bg-[#2a2d42] text-white border-2 border-blue-600"
                                : "bg-[#2a2d42] text-white hover:bg-[#333649] border-2 border-transparent"
                            }`}
                    >
                        <span className="text-gray-400 mr-3">{option.id}.</span>
                        {option.text}
                    </button>
                ))}
            </div>

            <button
                onClick={onBack}
                className="w-full bg-[#2a2d42] hover:bg-[#333649] text-gray-400 font-medium py-3 px-6 rounded-2xl transition-all"
            >
                Back to Flashcard
            </button>
        </div>
    );
}
