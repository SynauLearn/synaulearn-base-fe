export { default as MultipleChoiceQuiz } from "./v2/MultipleChoiceQuiz";
export { default as TrueFalseQuiz } from "./v2/TrueFalseQuiz";
export { default as FillBlankQuiz } from "./v2/FillBlankQuiz";

// Type exports
export type QuizType = "multiple_choice" | "true_false" | "fill_blank";

export interface QuizOption {
  id: string;
  text: string;
}

export interface BaseQuiz {
  _id: string;
  card_id: string;
  quiz_type: QuizType;
  question: string;
  correct_answer: string;
  created_at: number;
}

export interface MultipleChoiceQuizData extends BaseQuiz {
  quiz_type: "multiple_choice";
  options: QuizOption[];
}

export interface TrueFalseQuizData extends BaseQuiz {
  quiz_type: "true_false";
  correct_answer: "true" | "false";
}

export interface FillBlankQuizData extends BaseQuiz {
  quiz_type: "fill_blank";
  acceptable_answers?: string[];
  hint?: string;
}

export type QuizData =
  | MultipleChoiceQuizData
  | TrueFalseQuizData
  | FillBlankQuizData;
