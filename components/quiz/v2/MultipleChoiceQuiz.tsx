"use client";

import InformationCircleIcon from "@/assets/icons/information-circle.svg";
import { useCourseContext } from "@/features/v2/courses/contexts/CourseContext";

interface QuizOption {
  id: string;
  text: string;
}

interface MultipleChoiceQuizProps {
  question: string;
  options: QuizOption[];
  correctAnswer: string;
}

export default function MultipleChoiceQuiz({
  question,
  options,
  correctAnswer,
}: MultipleChoiceQuizProps) {
  const { selectedAnswer, showResult, isCorrect, handleAnswerSelect } =
    useCourseContext();

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <h2 className="h-14 text-center text-xl font-bold">{question}</h2>

      <div className="flex flex-col gap-2.5 items-start">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswerSelect(option.id, correctAnswer)}
            className={`w-full flex px-4.5 py-5 items-center gap-2.5 rounded-2xl ${
              selectedAnswer === option.id
                ? showResult && isCorrect
                  ? "bg-spruce-500 text-white"
                  : showResult && !isCorrect
                    ? "bg-ruby-600 text-white"
                    : "bg-primary text-white"
                : "bg-white text-black not-disabled:hover:bg-primary/80"
            }`}
            disabled={showResult}
          >
            <span
              className={`flex py-1 px-2 items-center justify-center rounded-lg ${
                selectedAnswer === option.id
                  ? "bg-white text-primary"
                  : "bg-primary text-white"
              } font-inter text-[0.625rem] font-semibold`}
            >
              {option.id}
            </span>
            <span className="text-start">{option.text}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-center items-center gap-1 text-graphite-400">
        <InformationCircleIcon className="size-3" />
        <p className="text-xs">Only one answer is correct.</p>
      </div>
    </div>
  );
}
