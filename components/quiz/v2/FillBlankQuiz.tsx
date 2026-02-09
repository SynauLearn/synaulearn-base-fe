"use client";

import { useState, useRef, useEffect } from "react";
import InformationCircleIcon from "@/assets/icons/information-circle.svg";
import { useCourseContext } from "@/features/v2/courses/contexts/CourseContext";

interface FillBlankQuizProps {
  question: string;
  correctAnswer: string;
  acceptableAnswers?: string[];
  hint?: string;
}

export default function FillBlankQuiz({
  question,
  correctAnswer,
  acceptableAnswers = [],
  hint,
}: FillBlankQuizProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);

  const {
    selectedAnswer,
    setSelectedAnswer,
    setIsCorrect,
    showResult,
    isCorrect,
    handleAnswerSelect,
  } = useCourseContext();

  const checkAnswer = (answer: string): boolean => {
    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedCorrect = correctAnswer.toLowerCase().trim();

    // Check main answer
    if (normalizedAnswer === normalizedCorrect) {
      return true;
    }

    // Check acceptable alternatives
    return acceptableAnswers.some(
      (alt) => normalizedAnswer === alt.toLowerCase().trim(),
    );
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex py-12 flex-col items-center justify-center w-full gap-9 bg-white rounded-2xl">
        <h2 className="text-center text-xl font-bold">{question}</h2>

        <input
          type="text"
          value={userAnswer}
          onChange={(e) => {
            const value = e.target.value;
            const correct = checkAnswer(value);
            setUserAnswer(value);
            setSelectedAnswer(value);
            setIsCorrect(correct);
          }}
          placeholder="Type your answer..."
          className="flex-1 h-6 p-4 text-graphite-700 rounded-2xl border-2 border-transparent focus:border-primary focus:outline-none placeholder-graphite-300 text-lg"
          autoComplete="off"
          autoCapitalize="off"
          disabled={showResult}
        />
      </div>
      <div className="flex w-full justify-center items-center gap-1 text-graphite-400">
        <InformationCircleIcon className="size-3" />
        <p className="text-xs">
          Type the missing keyword based on what you just learned.
        </p>
      </div>
    </div>
  );
}
