"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export type CourseContextType = {
  selectedAnswer: string | null;
  setSelectedAnswer: Dispatch<SetStateAction<string | null>>;
  showResult: boolean;
  setShowResult: Dispatch<SetStateAction<boolean>>;
  isCorrect: boolean;
  setIsCorrect: Dispatch<SetStateAction<boolean>>;
  handleAnswerSelect: (optionId: string, correctAnswer: string) => void;
  handleConfirmAnswer: () => void;
  handleContinue: (onComplete: (isCorrect: boolean) => void) => void;
};

const CourseContext = createContext<CourseContextType | null>(null);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerSelect = (optionId: string, correctAnswer: string) => {
    setSelectedAnswer(optionId);
    setIsCorrect(optionId === correctAnswer);
  };

  const handleConfirmAnswer = () => {
    setShowResult(true);
  };

  const handleContinue = (onComplete: (isCorrect: boolean) => void) => {
    onComplete(isCorrect);
  };

  return (
    <CourseContext.Provider
      value={{
        selectedAnswer,
        setSelectedAnswer,
        showResult,
        setShowResult,
        isCorrect,
        setIsCorrect,
        handleAnswerSelect,
        handleConfirmAnswer,
        handleContinue,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error("useCourseContext must be used within <CourseProvider />");
  }

  return context;
};

export default CourseContext;
