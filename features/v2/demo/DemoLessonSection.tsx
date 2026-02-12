"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Progress } from "@/components/ui/progress";
import LightningIcon from "@/assets/icons/lightning.svg";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import InformationCircleIcon from "@/assets/icons/information-circle.svg";
import PlaceholderIcon from "@/assets/icons/placeholder.svg";
import CloudCourse from "@/assets/images/img-decoration-course-cloud.svg";
import CatCourse from "@/assets/images/img-decoration-cat-course.svg";
import CatCourseWrong from "@/assets/images/img-decoration-cat-quiz-wrong.svg";
import CatPawCourse from "@/assets/images/img-decoration-catpaw-course.svg";
import MonitorCourse from "@/assets/images/img-decoration-course-pc.svg";
import {
    MultipleChoiceQuiz,
    TrueFalseQuiz,
    FillBlankQuiz,
} from "@/components/quiz";
import { useCourseContext } from "@/features/v2/courses/contexts/CourseContext";
import { useDemoProgress } from "./hooks/useDemoProgress";
import { useDemoAnalytics } from "./hooks/useDemoAnalytics";
import DemoCTA from "./DemoCTA";
import { Id } from "@/convex/_generated/dataModel";

type Step = "flashcard" | "quiz" | "result";

interface DemoLessonSectionProps {
    locale: string;
    onBack: () => void;
}

export default function DemoLessonSection({
    locale,
    onBack,
}: DemoLessonSectionProps) {
    const {
        handleConfirmAnswer,
        isCorrect,
        setIsCorrect,
        showResult,
        setShowResult,
        selectedAnswer,
        setSelectedAnswer,
    } = useCourseContext();

    const {
        currentCardIndex,
        xpEarned,
        quizScore,
        goToCard,
        completeCard,
        recordQuizAnswer,
        markCompleted,
    } = useDemoProgress();

    const { trackCardViewed, trackQuizAnswered, trackCompleted, trackCtaClick } =
        useDemoAnalytics(locale);

    // Fetch demo data from Convex
    const demoCourse = useQuery(api.demo.getDemoCourse, { language: locale });
    const demoLesson = useQuery(
        api.demo.getDemoLesson,
        demoCourse ? { courseId: demoCourse._id } : "skip"
    );
    const demoCards = useQuery(
        api.demo.getDemoCards,
        demoLesson ? { lessonId: demoLesson._id } : "skip"
    );
    const cardIds = useMemo(
        () => (demoCards ? demoCards.map((c) => c._id) : []),
        [demoCards]
    );
    const demoQuizzes = useQuery(
        api.demo.getDemoQuizzes,
        cardIds.length > 0 ? { cardIds } : "skip"
    );

    const [step, setStep] = useState<Step>("flashcard");
    const [isFlipped, setIsFlipped] = useState(false);
    const [localXp, setLocalXp] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);

    // Loading
    if (!demoCourse || !demoLesson || !demoCards || !demoQuizzes) {
        return (
            <div className="fixed inset-0 bg-sapphire-200/10 z-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-graphite-400">Loading demo lesson...</p>
                </div>
            </div>
        );
    }

    const cards = demoCards;
    const totalCards = cards.length;
    const currentCard = cards[currentCardIndex];
    const isLastCard = currentCardIndex === totalCards - 1;

    // Find quiz for current card
    const currentQuiz = demoQuizzes.find(
        (q) => q.card_id === currentCard?._id
    );

    const correctAnswerLabel = (() => {
        if (!currentQuiz) return "";
        if (currentQuiz.quiz_type === "multiple_choice") {
            const option = currentQuiz.options?.find(
                (o) => o.id === currentQuiz.correct_answer
            );
            return option?.text || currentQuiz.correct_answer;
        }
        if (currentQuiz.quiz_type === "true_false") {
            return currentQuiz.correct_answer === "true" ? "True" : "False";
        }
        return currentQuiz.correct_answer;
    })();

    const handleFlashcardContinue = () => {
        setLocalXp((prev) => prev + 5);
        setStep("quiz");
        trackCardViewed(currentCardIndex, currentCardIndex + 1, quizScore);
        completeCard(currentCardIndex);
    };

    const handleQuizComplete = (quizIsCorrect: boolean) => {
        if (quizIsCorrect) {
            setLocalXp((prev) => prev + 10);
            setCorrectCount((prev) => prev + 1);
        }
        recordQuizAnswer(currentCardIndex, quizIsCorrect);
        trackQuizAnswered(currentCardIndex, quizIsCorrect);
        handleNext();
    };

    const handleNext = () => {
        if (isLastCard) {
            const bonusXP = 25;
            setLocalXp((prev) => prev + bonusXP);
            setShowCompletion(true);
            markCompleted();
            trackCompleted(correctCount, totalCards);
        } else {
            goToCard(currentCardIndex + 1);
            setStep("flashcard");
            setIsFlipped(false);
            setSelectedAnswer("");
            setShowResult(false);
        }
    };

    const handleBackToFlashcard = () => {
        setStep("flashcard");
        setSelectedAnswer("");
        setIsCorrect(false);
        setShowResult(false);
        setIsFlipped(true);
    };

    const handleRetryQuiz = () => {
        setSelectedAnswer("");
        setIsCorrect(false);
        setShowResult(false);
    };

    const primaryCtaLabel = (() => {
        if (step === "quiz") {
            if (showResult) {
                return isCorrect
                    ? isLastCard
                        ? "Finish Demo"
                        : "Next Card"
                    : "Try Again";
            }
            return "Submit Answer";
        }
        return "Jump to Quiz";
    })();

    // Render quiz by type
    const renderQuiz = () => {
        if (!currentQuiz) return null;
        switch (currentQuiz.quiz_type) {
            case "multiple_choice":
                return (
                    <MultipleChoiceQuiz
                        question={currentQuiz.question}
                        options={currentQuiz.options || []}
                        correctAnswer={currentQuiz.correct_answer}
                    />
                );
            case "true_false":
                return (
                    <TrueFalseQuiz
                        question={currentQuiz.question}
                        correctAnswer={currentQuiz.correct_answer as "true" | "false"}
                    />
                );
            case "fill_blank":
                return (
                    <FillBlankQuiz
                        question={currentQuiz.question}
                        correctAnswer={currentQuiz.correct_answer}
                        acceptableAnswers={currentQuiz.acceptable_answers}
                        hint={currentQuiz.hint}
                    />
                );
            default:
                return null;
        }
    };

    // Show completion/CTA screen
    if (showCompletion) {
        return (
            <DemoCTA
                totalXP={localXp}
                cardsCompleted={totalCards}
                correctAnswers={correctCount}
                locale={locale}
                onRestart={() => {
                    setShowCompletion(false);
                    goToCard(0);
                    setStep("flashcard");
                    setIsFlipped(false);
                    setLocalXp(0);
                    setCorrectCount(0);
                    setSelectedAnswer("");
                    setShowResult(false);
                }}
                onCtaClick={trackCtaClick}
            />
        );
    }

    return (
        <section className="relative w-full min-h-screen bg-sapphire-200/10 overflow-hidden">
            {/* Top progress bar */}
            <div className="fixed top-0 inset-x-0 pl-6 px-4 py-2.5 flex gap-4 items-center rounded-b-3xl bg-white z-50">
                <Progress
                    value={((currentCardIndex + 1) / totalCards) * 100}
                    max={totalCards * 100}
                    className="flex-1"
                />
                <div className="px-2 py-1 flex items-center gap-1 bg-linear-to-r from-primary to-sapphire-900 rounded-full">
                    <span className="text-white font-bold text-xs">{localXp} XP</span>
                    <LightningIcon className="h-4" />
                </div>
            </div>

            {/* Background decorations */}
            <div className="w-full">
                <Image
                    src={CloudCourse}
                    alt="Cloud"
                    width={300}
                    height={300}
                    className="absolute top-10 -right-10 w-39.5 scale-x-[-1]"
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 size-130 bg-sapphire-200/20 rounded-full">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-86 bg-sapphire-200/30 rounded-full" />
                </div>
            </div>

            {/* Content Area */}
            <div className="relative min-h-screen mb-30">
                <div
                    className={`absolute h-full ${step === "quiz" ? "top-36 bg-gold-100" : "top-50 bg-white justify-center"} inset-x-0 py-6 px-5 inline-flex flex-col gap-6 rounded-t-[2.25rem]`}
                >
                    <div
                        className={`absolute ${step === "quiz" ? "-top-22 left-3.5 w-full" : "-top-34 right-4"} z-10`}
                    >
                        <div className="flex gap-4">
                            <Image
                                src={MonitorCourse}
                                alt="Monitor"
                                width={300}
                                height={300}
                                className={`relative -top-6 w-36 ${step === "quiz" ? "hidden" : ""}`}
                            />
                            <div
                                className={`absolute ${step === "quiz" ? "left-0" : "-left-8"} bg-white rounded-full p-3 border-8 border-sapphire-400/9`}
                            >
                                <p className="text-xs font-bold text-graphite-700">
                                    Topic {currentCardIndex + 1} of {totalCards}
                                </p>
                            </div>
                            <div
                                className={`flex flex-col ${step === "quiz" ? "hidden" : ""}`}
                            >
                                <Image
                                    src={CatCourse}
                                    alt="Cat"
                                    width={300}
                                    height={300}
                                    className="top-0 right-0 w-44"
                                />
                                <Image
                                    src={CatPawCourse}
                                    alt="Cat Paw"
                                    width={300}
                                    height={300}
                                    className="relative -top-10 right-0 w-44 object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* FLASHCARD */}
                    {step === "flashcard" && (
                        <div
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col p-2.5 pb-6 gap-2.5 bg-primary rounded-2xl"
                            style={{
                                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                transition: "transform 0.6s",
                                transformStyle: "preserve-3d",
                            }}
                        >
                            <div
                                className="relative w-3xs h-80 bg-white rounded-2xl overflow-hidden"
                                style={{
                                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                    backfaceVisibility: "hidden",
                                }}
                            >
                                <div className="w-full h-full p-6 pb-14 overflow-y-auto flex items-center justify-center no-scrollbar">
                                    {!isFlipped ? (
                                        <h2 className="text-lg font-bold text-black text-center w-full break-words leading-relaxed">
                                            {currentCard?.flashcard_question}
                                        </h2>
                                    ) : (
                                        <h2 className="text-sm font-bold text-black text-center w-full break-words leading-relaxed">
                                            {currentCard?.flashcard_answer}
                                        </h2>
                                    )}
                                </div>

                                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center justify-center gap-1 px-2 py-1 bg-white/80 rounded-full backdrop-blur-xs text-graphite-400 pointer-events-none z-10 shadow-xs">
                                    <InformationCircleIcon className="size-3" />
                                    <p className="font-inter text-xs">Tap to flip</p>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-center gap-1"
                                style={{
                                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                    backfaceVisibility: "hidden",
                                }}
                            >
                                <span className="text-xs font-bold text-white">synaulearn</span>
                                <PlaceholderIcon className="size-3.5 text-white" />
                            </div>
                        </div>
                    )}

                    {/* QUIZ */}
                    {step === "quiz" && (
                        <div className="relative flex flex-col w-full items-center pt-9 mb-6 px-5 gap-6">
                            <h1 className="text-gold-900 font-bold line-clamp-2 capitalize">
                                {currentQuiz?.quiz_type?.replace("_", " ")}
                            </h1>
                            {renderQuiz()}
                        </div>
                    )}
                </div>
            </div>

            {/* Flashcard bottom decoration */}
            <div
                className={`${step === "quiz" ? "hidden" : ""} fixed inset-x-0 bottom-0 h-34 flex w-full rounded-t-4xl bg-primary py-3 px-2 z-10`}
            >
                <div className="w-full h-full border-dashed border-4 border-white/20 rounded-t-4xl" />
            </div>

            {/* Result cat mascot */}
            <div className="relative">
                {showResult && (
                    <div className="relative">
                        <Image
                            src={isCorrect ? CatCourse : CatCourseWrong}
                            alt="Cat"
                            width={300}
                            height={300}
                            className={`fixed bottom-24 ${isCorrect ? "-right-2" : "right-0"} w-43.5`}
                        />
                        <Image
                            src={CatPawCourse}
                            alt="Cat Paw"
                            width={300}
                            height={300}
                            className="fixed bottom-32 right-1 w-38 z-50"
                        />
                    </div>
                )}

                {/* Bottom action bar */}
                <div
                    className={`fixed inset-x-0 bottom-0 flex flex-col gap-4 w-full rounded-t-3xl ${step === "quiz" && showResult ? (isCorrect ? "bg-spruce-200" : "bg-ruby-200") : "bg-white"} py-3 px-4 z-20`}
                >
                    {step === "quiz" && showResult && (
                        <div className="flex flex-col justify-center items-start gap-2">
                            <h2
                                className={`${isCorrect ? "text-spruce-500" : "text-ruby-600"} font-bold text-xl`}
                            >
                                {isCorrect
                                    ? "Correct! You're dangerous now. 🎉"
                                    : "Not quite! Flip the concept again."}
                            </h2>
                            {isCorrect && (
                                <div className="flex py-1 px-2 justify-center items-center gap-1 rounded-lg bg-linear-to-r from-primary to-spruce-200">
                                    <span className="text-white text-xs font-semibold">
                                        +{localXp} XP
                                    </span>
                                    <LightningIcon className="size-4" />
                                </div>
                            )}
                            {!isCorrect && (
                                <div className="flex py-1 px-2 justify-center items-center gap-2.5 rounded-sm bg-white">
                                    <span className="text-graphite-400 font-inter text-xs font-semibold">
                                        Correct answer: {correctAnswerLabel}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-start gap-2.5 w-full">
                        <button
                            onClick={() =>
                                step === "quiz" ? handleBackToFlashcard() : onBack()
                            }
                            className={`flex size-12 rounded-full items-center justify-center ${step === "quiz" && showResult ? "bg-white" : "bg-primary"}`}
                        >
                            <ArrowLeftIcon
                                className={`h-6 ${step === "quiz" && showResult ? (isCorrect ? "text-spruce-500" : "text-ruby-600") : "text-white"}`}
                            />
                        </button>
                        <button
                            onClick={() => {
                                if (step === "quiz") {
                                    if (showResult) {
                                        if (isCorrect) {
                                            handleQuizComplete(isCorrect);
                                        } else {
                                            handleRetryQuiz();
                                        }
                                    } else {
                                        handleConfirmAnswer();
                                    }
                                } else {
                                    handleFlashcardContinue();
                                }
                            }}
                            disabled={
                                !isFlipped ||
                                (step === "quiz" && !showResult && !selectedAnswer)
                            }
                            className={`flex-3 w-full h-12 rounded-full items-center justify-center ${step === "quiz" && showResult ? (isCorrect ? "bg-spruce-500" : "bg-ruby-600") : "bg-graphite-700 disabled:bg-graphite-200"}`}
                        >
                            <span className="text-white font-semibold">
                                {primaryCtaLabel}
                            </span>
                        </button>
                        {step === "quiz" && showResult && !isCorrect && (
                            <button
                                onClick={() => handleQuizComplete(isCorrect)}
                                disabled={!isFlipped}
                                className="flex-1 h-12 rounded-full items-center justify-center bg-white"
                            >
                                <span className="text-ruby-600 font-semibold">Skip</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
