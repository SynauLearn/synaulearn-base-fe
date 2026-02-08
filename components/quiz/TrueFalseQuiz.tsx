"use client";

import { useState } from "react";

interface TrueFalseQuizProps {
    question: string;
    description?: string;
    correctAnswer: "true" | "false";
    onComplete: (isCorrect: boolean) => void;
    onBack: () => void;
}

export default function TrueFalseQuiz({
    question,
    description,
    correctAnswer,
    onComplete,
    onBack,
}: TrueFalseQuizProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<"true" | "false" | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleAnswerSelect = (answer: "true" | "false") => {
        const correct = answer === correctAnswer;
        setSelectedAnswer(answer);
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
                            : `The correct answer was: ${correctAnswer === "true" ? "True" : "False"}`}
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

            <div className="flex gap-4 mb-8">
                {/* True Button */}
                <button
                    onClick={() => handleAnswerSelect("true")}
                    className={`flex-1 flex flex-col items-center justify-center py-8 rounded-2xl font-bold text-xl transition-all ${selectedAnswer === "true"
                            ? "bg-green-600 text-white border-2 border-green-400"
                            : "bg-[#2a2d42] text-white hover:bg-[#333649] border-2 border-transparent"
                        }`}
                >
                    <span className="text-4xl mb-2">✅</span>
                    <span>TRUE</span>
                </button>

                {/* False Button */}
                <button
                    onClick={() => handleAnswerSelect("false")}
                    className={`flex-1 flex flex-col items-center justify-center py-8 rounded-2xl font-bold text-xl transition-all ${selectedAnswer === "false"
                            ? "bg-red-600 text-white border-2 border-red-400"
                            : "bg-[#2a2d42] text-white hover:bg-[#333649] border-2 border-transparent"
                        }`}
                >
                    <span className="text-4xl mb-2">❌</span>
                    <span>FALSE</span>
                </button>
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
