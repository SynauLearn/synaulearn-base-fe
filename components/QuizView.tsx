"use client";

import { useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { MultipleChoiceQuiz, TrueFalseQuiz, FillBlankQuiz } from "./quiz";

interface QuizViewProps {
  cardId: Id<"cards">;
  cardIndex: number;
  onBack: () => void;
  onBackToFlashcard: () => void;
  onComplete: (isCorrect: boolean) => void;
  embedded?: boolean;
}

export default function QuizView({
  cardId,
  cardIndex,
  onBack,
  onBackToFlashcard,
  onComplete,
  embedded = false,
}: QuizViewProps) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  // Fetch quiz from new quizzes table
  const quiz = useQuery(api.quizzes.getByCardId, { cardId });

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart.y || !touchEnd.y) return;

    const distanceY = touchStart.y - touchEnd.y;
    const isVerticalSwipe = Math.abs(distanceY) > minSwipeDistance;

    // Swipe down to go back to flashcard
    if (isVerticalSwipe && distanceY < 0) {
      onBackToFlashcard();
    }
  };

  const handleQuizComplete = (isCorrect: boolean) => {
    onComplete(isCorrect);
  };

  // Loading state
  if (quiz === undefined) {
    return (
      <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-400 mt-4">Loading quiz...</p>
      </div>
    );
  }

  // Quiz not found
  if (!quiz) {
    return (
      <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col items-center justify-center px-6">
        <p className="text-gray-400">Quiz not found for this card</p>
        <button
          onClick={onBack}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  // Render quiz based on type
  const renderQuiz = () => {
    switch (quiz.quiz_type) {
      case "multiple_choice":
        return (
          <MultipleChoiceQuiz
            question={quiz.question}
            options={quiz.options || []}
            correctAnswer={quiz.correct_answer}
          />
        );

      case "true_false":
        return (
          <TrueFalseQuiz
            question={quiz.question}
            correctAnswer={quiz.correct_answer as "true" | "false"}
          />
        );

      case "fill_blank":
        return (
          <FillBlankQuiz
            question={quiz.question}
            correctAnswer={quiz.correct_answer}
            acceptableAnswers={quiz.acceptable_answers}
            hint={quiz.hint}
          />
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center px-6">
            <p className="text-gray-400">Unknown quiz type: {quiz.quiz_type}</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={embedded
        ? "w-full h-full flex flex-col bg-[#1a1d2e]"
        : "fixed inset-0 bg-[#1a1d2e] z-50 flex flex-col"
      }
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBackToFlashcard} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
          <span className="text-lg font-medium">
            Card {cardIndex + 1} Quiz
            <span className="ml-2 text-xs text-gray-400 capitalize">
              ({quiz.quiz_type.replace("_", " ")})
            </span>
          </span>
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {renderQuiz()}
      </div>

      {/* Swipe hint */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-gray-500 text-sm">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        <span>Swipe down to return to flashcard</span>
      </div>
    </div>
  );
}
