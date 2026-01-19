import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { Progress } from "@/components/ui/progress";
import ResultPopup from "./ResultPopup";
import CompletePage from "./CompletePage";
import { useSIWFProfile } from "@/components/SignInWithFarcaster";
import { useCardsByLesson, useUserByFid, useSaveCardProgress, useGetOrCreateUser, UserId } from "@/lib/convexApi";
import { Id } from "@/convex/_generated/dataModel";

interface CardViewProps {
  lessonId: string;
  courseTitle: string;
  onBack: () => void;
  onComplete?: () => void;
}

type Step = "flashcard" | "quiz" | "result";

const LessonPage = ({
  lessonId,
  courseTitle,
  onBack,
  onComplete,
}: CardViewProps) => {
  const { context } = useMiniKit();
  const siwfProfile = useSIWFProfile();

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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);

  // Create or get user in Convex when FID is available
  useEffect(() => {
    async function ensureUser() {
      if (!fid) return;

      try {
        const user = await getOrCreateUser({
          fid,
          username: username || undefined,
          display_name: displayName || undefined,
        });
        if (user) {
          setConvexUserId(user._id);
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }

    ensureUser();
  }, [fid, username, displayName, getOrCreateUser]);

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

  // Convert quiz options to array format
  const quizOptions = [
    {
      id: "A",
      text: currentCard.quiz_option_a,
      correct: currentCard.quiz_correct_answer === "A",
    },
    {
      id: "B",
      text: currentCard.quiz_option_b,
      correct: currentCard.quiz_correct_answer === "B",
    },
    {
      id: "C",
      text: currentCard.quiz_option_c,
      correct: currentCard.quiz_correct_answer === "C",
    },
    {
      id: "D",
      text: currentCard.quiz_option_d,
      correct: currentCard.quiz_correct_answer === "D",
    },
  ];

  const handleFlashcardContinue = () => {
    setXpEarned(xpEarned + 5);
    setStep("quiz");
  };

  const handleAnswerSelect = async () => {
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

    setShowResultPopup(true);
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
      setSelectedAnswer(null);
    }
    setShowResultPopup(false);
  };

  const handleRetry = () => {
    setStep("quiz");
    setSelectedAnswer(null);
    setShowResultPopup(false);
  };

  const handleSelectedOption = (id: string) => {
    const correct = id === currentCard.quiz_correct_answer;
    setSelectedAnswer(id);
    setIsCorrect(correct);
  };

  // Show completion screen
  if (showCompletion) {
    return (
      <CompletePage
        courseTitle={courseTitle}
        totalXP={xpEarned}
        cardsCompleted={totalCards}
        correctAnswers={correctCount}
        onBackToCourses={onBack}
        onNextLesson={onComplete}
        hasNextLesson={false}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1d2e] px-4 pt-4 -mb-10 flex flex-col">
      {/* Header */}
      <div className="">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-8 text-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <Progress
            value={((currentCardIndex + 1) / totalCards) * 100}
            max={totalCards * 100}
            className="flex-1"
          />
          <div className="w-14 text-primary font-bold text-sm text-right">
            {xpEarned} XP
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm">
          Card {currentCardIndex + 1} of {totalCards}
          {step === "quiz" && " - Quiz"}
          {step === "result" && " - Result"}
        </p>
      </div>

      {/* Content Area */}
      <div className="flex items-center justify-center px-6 pt-16">
        {/* FLASHCARD STEP */}
        {step === "flashcard" && (
          <div className="flex-1 flex flex-col gap-8">
            <div className="w-full">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full bg-[#252841] rounded-3xl p-8 min-h-96 flex items-center justify-center cursor-pointer hover:bg-[#2a2d46]"
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.6s",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  style={{
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {!isFlipped ? (
                    <>
                      <div className="flex h-96 items-center">
                        <h2 className="text-2xl font-bold text-white">
                          {currentCard.flashcard_question}
                        </h2>
                      </div>
                      <p className="text-gray-200 text-sm text-center">
                        Tap to flip
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-200 text-sm">Answer :</p>
                      <div className="flex h-96 items-center">
                        <p className={`leading-relaxed mb-6 ${currentCard.flashcard_answer.length > 200 ? 'text-sm text-white' : 'text-lg text-white'
                          }`}>
                          {currentCard.flashcard_answer}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isFlipped && (
              <button
                onClick={handleFlashcardContinue}
                className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all"
              >
                Continue to Quiz →
              </button>
            )}
          </div>
        )}

        {/* QUIZ STEP */}
        {step === "quiz" && (
          <div className="flex-1 flex flex-col gap-10">
            <div className="flex p-6 flex-col gap-4 border border-[#333649] rounded-2xl bg-[#2a2d42]">
              <h1 className="font-medium text-sm text-gray-300">Quiz :</h1>
              <h2 className="h-32 text-xl font-bold text-white">
                {currentCard.quiz_question}
              </h2>
            </div>

            <div className="flex-1 flex flex-col gap-2 items-center">
              <p className="w-full text-left text-sm font-semibold my-2 text-white">
                Choose an option to answer
              </p>
              {quizOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectedOption(option.id)}
                  className={`w-full flex items-center text-left px-6 py-4 rounded-2xl font-medium bg-[#2a2d42] text-white border-2 ${selectedAnswer === option.id
                    ? "border-primary"
                    : "hover:bg-[#333649] border-transparent"
                    }`}
                >
                  <span className="font-bold mr-2">{option.id}.</span>
                  {option.text}
                </button>
              ))}
            </div>

            <div>
              <button
                onClick={handleAnswerSelect}
                disabled={!selectedAnswer}
                className={`w-full ${!selectedAnswer ? "bg-gray-300" : "bg-primary"
                  } flex items-center justify-center text-white px-6 py-4 rounded-4xl font-medium`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        <ResultPopup
          show={showResultPopup}
          onClose={handleNext}
          isCorrect={isCorrect}
          onRetry={handleRetry}
          correctAnswer={`${currentCard.quiz_correct_answer}. ${quizOptions.find((o) => o.correct)?.text
            }`}
        />
      </div>
    </div>
  );
};

export default LessonPage;
