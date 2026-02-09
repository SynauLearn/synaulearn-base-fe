"use client";

import { useCourseContext } from "@/features/v2/courses/contexts/CourseContext";
import InformationCircleIcon from "@/assets/icons/information-circle.svg";

interface TrueFalseQuizProps {
  question: string;
  correctAnswer: "true" | "false";
}

export default function TrueFalseQuiz({
  question,
  correctAnswer,
}: TrueFalseQuizProps) {
  const { selectedAnswer, showResult, isCorrect, handleAnswerSelect } =
    useCourseContext();

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6">
      <h2 className="h-14 text-center text-xl font-bold">{question}</h2>

      <div className="flex items-start gap-6">
        <button
          onClick={() => handleAnswerSelect("true", correctAnswer)}
          className={`h-36 flex flex-col justify-center items-center p-12 gap-3 rounded-2xl ${
            selectedAnswer === "true"
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
            className={`${
              selectedAnswer === "true" ? "text-white" : "text-black"
            } text-xl font-bold`}
          >
            True
          </span>
        </button>

        <button
          onClick={() => handleAnswerSelect("false", correctAnswer)}
          className={`h-36 flex flex-col justify-center items-center p-12 gap-3 rounded-2xl ${
            selectedAnswer === "false"
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
            className={`${
              selectedAnswer === "false" ? "text-white" : "text-black"
            } text-xl font-bold`}
          >
            False
          </span>
        </button>
      </div>

      <div className="flex justify-center items-center gap-1 text-graphite-400">
        <InformationCircleIcon className="size-3" />
        <p className="text-xs">Decide if the statement is true or false</p>
      </div>
    </div>
  );
}
