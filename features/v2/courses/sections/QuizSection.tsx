"use client";

import { useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  MultipleChoiceQuiz,
  TrueFalseQuiz,
  FillBlankQuiz,
} from "@/components/quiz";

interface QuizSectionPageProps {
  cardId: Id<"cards">;
  cardIndex: number;
  onBack: () => void;
  onBackToFlashcard: () => void;
  onComplete: (isCorrect: boolean) => void;
  embedded?: boolean;
}

const QuizSectionPage = ({
  cardId,
  cardIndex,
  onBack,
  onBackToFlashcard,
  onComplete,
  embedded = false,
}: QuizSectionPageProps) => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  // Fetch quiz from new quizzes table
  const quiz = useQuery(api.quizzes.getByCardId, { cardId });

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
    <div className="relative flex flex-col w-full items-center pt-9 mb-6 px-5 gap-6  min-h-screen">
      <h1 className="text-gold-900 font-bold line-clamp-2 capitalize">
        {quiz.quiz_type.replace("_", " ")}
      </h1>

      {renderQuiz()}
    </div>
  );
};

export default QuizSectionPage;
