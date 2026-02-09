import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import { useQuery } from "convex/react";
import { Progress } from "@/components/ui/progress";
import LightningIcon from "@/assets/icons/lightning.svg";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import InformationCircleIcon from "@/assets/icons/information-circle.svg";
import PlaceholderIcon from "@/assets/icons/placeholder.svg";

// import CompletePage from "./CompletePage";
import { useSIWFProfile } from "@/components/SignInWithFarcaster";
import {
  useCardsByLesson,
  useUserByFid,
  useSaveCardProgress,
  useGetOrCreateUser,
  UserId,
} from "@/lib/convexApi";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import CloudCourse from "@/assets/images/img-decoration-course-cloud.svg";
import CatCourse from "@/assets/images/img-decoration-cat-course.svg";
import CatCourseWrong from "@/assets/images/img-decoration-cat-quiz-wrong.svg";
import CatPawCourse from "@/assets/images/img-decoration-catpaw-course.svg";
import MonitorCourse from "@/assets/images/img-decoration-course-pc.svg";
import QuizSectionPage from "./QuizSection";
import { useCourseContext } from "../contexts/CourseContext";
import CompletePageSection from "./CompletedSection";
interface CardViewProps {
  lessonId: string;
  courseTitle: string;
  onBack: () => void;
  onComplete?: () => void;
  onMintBadge?: () => void;
}

type Step = "flashcard" | "quiz" | "result";

const LessonPageSection = ({
  lessonId,
  courseTitle,
  onBack,
  onComplete,
  onMintBadge,
}: CardViewProps) => {
  const { context } = useMiniKit();
  const siwfProfile = useSIWFProfile();
  const { address, isConnected } = useAccount();
  const {
    handleConfirmAnswer,
    handleContinue,
    isCorrect,
    setIsCorrect,
    showResult,
    setShowResult,
    selectedAnswer,
    setSelectedAnswer,
  } = useCourseContext();

  // Get FID from MiniKit or SIWF
  const fid = context?.user?.fid || siwfProfile.fid;
  const username = context?.user?.username || siwfProfile.username;
  const displayName = context?.user?.displayName || siwfProfile.displayName;

  // Convex hooks
  const getOrCreateUser = useGetOrCreateUser();
  const convexUser = useUserByFid(fid);
  const saveCardProgress = useSaveCardProgress();
  const cardsData = useCardsByLesson(lessonId as Id<"lessons">);

  const [convexUserId, setConvexUserId] = useState<UserId | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [step, setStep] = useState<Step>("flashcard");
  const [isFlipped, setIsFlipped] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const currentCardId = cardsData?.[currentCardIndex]?._id;
  const quiz = useQuery(
    api.quizzes.getByCardId,
    currentCardId ? { cardId: currentCardId } : "skip",
  );

  // Create or get user in Convex when wallet is connected
  useEffect(() => {
    async function ensureUser() {
      // Wallet is required for user creation
      if (!address || !isConnected) return;

      try {
        const user = await getOrCreateUser({
          wallet_address: address,
          fid: fid || undefined,
          username: username || undefined,
          display_name: displayName || undefined,
        });
        if (user) {
          setConvexUserId(user._id);
        }
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }

    ensureUser();
  }, [address, isConnected, fid, username, displayName, getOrCreateUser]);

  // Convert cards data
  const cards = cardsData || [];
  const loading = cardsData === undefined;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="fixed inset-0 bg-[#1a1d2e] z-50 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No cards found for this lesson</p>
          <button
            onClick={onBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const totalCards = cards.length;
  const isLastCard = currentCardIndex === totalCards - 1;
  const correctAnswerLabel = (() => {
    if (!quiz) return "";
    if (quiz.quiz_type === "multiple_choice") {
      const option = quiz.options?.find((o) => o.id === quiz.correct_answer);
      return option?.text || quiz.correct_answer;
    }
    if (quiz.quiz_type === "true_false") {
      return quiz.correct_answer === "true" ? "True" : "False";
    }
    return quiz.correct_answer;
  })();

  const handleFlashcardContinue = () => {
    setXpEarned(xpEarned + 5);
    setStep("quiz");
  };

  const handleQuizComplete = async (isCorrect: boolean) => {
    if (isCorrect) {
      setXpEarned(xpEarned + 10);
      setCorrectCount(correctCount + 1);
    }

    if (convexUserId && currentCard) {
      try {
        await saveCardProgress({
          userId: convexUserId,
          cardId: currentCard._id,
          quizCorrect: isCorrect,
        });
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }

    handleNext();
  };

  const handleNext = () => {
    if (isLastCard) {
      const bonusXP = 25;
      const finalXP = xpEarned + bonusXP;
      setXpEarned(finalXP);
      setShowCompletion(true);
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
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
            ? "Finish Lesson"
            : "Next Lesson"
          : "Try Again";
      }

      return "Submit Answer";
    }

    return "Jump to Quiz";
  })();

  // Show completion screen
  if (showCompletion) {
    return (
      <CompletePageSection
        courseTitle={courseTitle}
        totalXP={xpEarned}
        cardsCompleted={totalCards}
        correctAnswers={correctCount}
        onBackToCourses={onBack}
        onMintBadge={onMintBadge}
      />
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-sapphire-200/10 overflow-hidden">
      <div className="fixed top-0 inset-x-0 pl-6 px-4 py-2.5 flex gap-4 items-center rounded-b-3xl bg-white z-50">
        <Progress
          value={((currentCardIndex + 1) / totalCards) * 100}
          max={totalCards * 100}
          className="flex-1"
        />

        <div className="px-2 py-1 flex items-center gap-1 bg-linear-to-r from-primary to-sapphire-900 rounded-full">
          <span className="text-white font-bold text-xs">{xpEarned} XP</span>
          <LightningIcon className="h-4" />
        </div>
      </div>

      <div className="w-full">
        <Image
          src={CloudCourse}
          alt="Cloud Course"
          width={300}
          height={300}
          className="absolute top-10 -right-10 w-39.5 scale-x-[-1]"
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-130 bg-sapphire-200/20 rounded-full">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-86 bg-sapphire-200/30 rounded-full" />
        </div>
      </div>

      {/* Content Area */}
      <div className={`relative min-h-screen mb-30`}>
        <div
          className={`absolute h-full ${step === "quiz" ? "top-36 bg-gold-100" : "top-50 bg-white justify-center"} inset-x-0 py-6 px-5 inline-flex flex-col gap-6 rounded-t-[2.25rem]`}
        >
          <div
            className={`absolute ${step === "quiz" ? "-top-22 left-3.5 w-full" : "-top-34 right-4"} z-10`}
          >
            <div className="flex gap-4">
              <Image
                src={MonitorCourse}
                alt="Monitor Course"
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
                  alt="Cat Course"
                  width={300}
                  height={300}
                  className="top-0 right-0 w-44"
                />
                <Image
                  src={CatPawCourse}
                  alt="Cat Paw Course"
                  width={300}
                  height={300}
                  className="relative -top-10 right-0 w-44 object-contain"
                />
              </div>
            </div>
          </div>

          {/* FLASHCARD STEP */}
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
                className="flex items-center p-6 w-3xs h-80 bg-white rounded-2xl"
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                {!isFlipped ? (
                  <h2 className="text-xl font-bold text-black text-center">
                    {currentCard.flashcard_question}
                  </h2>
                ) : (
                  <h2 className="text-xl font-bold text-black text-center">
                    {currentCard.flashcard_answer}
                  </h2>
                )}

                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center justify-center gap-1 px-2 py-1 mt-10 bg-white/50 rounded-full backdrop-blur-xs text-graphite-400">
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

          {/* QUIZ STEP */}
          {step === "quiz" && (
            <QuizSectionPage
              cardId={currentCard._id}
              cardIndex={currentCardIndex}
              onBack={onBack}
              onBackToFlashcard={handleBackToFlashcard}
              onComplete={handleQuizComplete}
              embedded={true}
            />
          )}
        </div>
      </div>

      <div
        className={`${step === "quiz" ? "hidden" : ""} fixed inset-x-0 bottom-0 h-34 flex w-full rounded-t-4xl bg-primary py-3 px-2 z-10`}
      >
        <div className="w-full h-full border-dashed border-4 border-white/20 rounded-t-4xl" />
      </div>

      <div className="relative">
        {showResult && (
          <div className="relative">
            <Image
              src={isCorrect ? CatCourse : CatCourseWrong}
              alt="Cat Course"
              width={300}
              height={300}
              className={`fixed bottom-24 ${isCorrect ? "-right-2" : "right-0"} w-43.5`}
            />
            <Image
              src={CatPawCourse}
              alt="Cat Paw Course"
              width={300}
              height={300}
              className="fixed bottom-32 right-1 w-38 z-50"
            />
          </div>
        )}
        <div
          className={`fixed inset-x-0 bottom-0 flex flex-col gap-4 w-full rounded-t-3xl ${step === "quiz" && showResult ? (isCorrect ? "bg-spruce-200" : "bg-ruby-200") : "bg-white"} py-3 px-4 z-20`}
        >
          {step === "quiz" && showResult && (
            <div className="flex flex-col justify-center items-start gap-2">
              <h2
                className={`${isCorrect ? "text-spruce-500" : "text-ruby-600"} font-bold text-xl`}
              >
                {isCorrect
                  ? "Correct! You’re dangerous now."
                  : "Not quite! Flip the concept again."}
              </h2>
              {isCorrect && (
                <div className="flex py-1 px-2 justify-center items-center gap-1 rounded-lg bg-linear-to-r from-primary to-spruce-200">
                  <span className="text-white text-xs font-semibold">
                    +{xpEarned} XP
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
                !isFlipped || (step === "quiz" && !showResult && !selectedAnswer)
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
                className={`flex-1 h-12 rounded-full items-center justify-center bg-white`}
              >
                <span className="text-ruby-600 font-semibold">Skip</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonPageSection;
