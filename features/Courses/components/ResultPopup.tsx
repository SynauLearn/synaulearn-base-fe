import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import AppleMascot from "@/assets/mascot/apple-mascot.svg";
import WormMascot from "@/assets/mascot/worm-mascot.svg";
import Image from "next/image";

interface ResultPopupProps {
  show: boolean;
  isCorrect: boolean;
  message?: string;
  correctAnswer?: string;
  onClose: () => void;
  onSkip?: () => void;
  onRetry?: () => void;
}

export default function ResultPopup({
  show,
  isCorrect,
  message,
  correctAnswer,
  onClose,
  onSkip,
  onRetry,
}: ResultPopupProps) {
  const correctMessages = [
    "Great job!",
    "Excellent!",
    "You nailed it!",
    "Nice work!",
    "Perfect!",
    "Awesome!",
    "You’re on fire!",
    "That’s correct!",
    "Keep it up!",
    "Bravo!",
  ];

  const wrongMessages = [
    "Oops, not quite!",
    "Almost there!",
    "Don’t worry, try again!",
    "You can do it!",
    "Keep practicing!",
    "Hmm, that’s not right!",
    "Nice try!",
    "You'll get it next time!",
    "Let's give it another go!",
    "Close, but not quite!",
  ];

  const randomMessage = useMemo(() => {
    if (message) return message;
    const pool = isCorrect ? correctMessages : wrongMessages;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [show, isCorrect, message]);

  const bgColor = isCorrect ? "bg-emerald-600" : "bg-rose-600";

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/0 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed bottom-18 -left-10 -right-10 z-50 flex justify-center px-4"
            initial={{ y: "100%", opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 25,
              },
            }}
            exit={{
              y: "100%",
              opacity: 0,
              transition: { duration: 0.3 },
            }}
          >
            <div
              className={`${bgColor} text-white w-full px-16 py-6 rounded-t-2xl shadow-2xl flex flex-col items-center text-center gap-4`}
            >
              <div className="flex items-center gap-2 font-semibold text-lg">
                <Image
                  src={isCorrect ? AppleMascot : WormMascot}
                  alt="Logo"
                  className="w-12 h-12"
                />
                {randomMessage}
              </div>
              {
                <div className="bg-white/10 text-white text-sm px-4 py-2 rounded-lg">
                  {isCorrect ? (
                    <span className="font-bold text-white">{"+10 XP"}</span>
                  ) : (
                    <>
                      <span className="font-medium opacity-90">
                        Correct answer :{" "}
                      </span>
                      <span className="font-semibold">{correctAnswer}</span>
                    </>
                  )}
                </div>
              }
              {isCorrect ? (
                <button
                  onClick={onClose}
                  className={`w-full bg-blue-600 text-white font-semibold px-6 py-4 rounded-full hover:bg-blue-700 transition`}
                >
                  Continue
                </button>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <button
                    onClick={onRetry || onClose}
                    className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-700 transition"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={onSkip || onClose}
                    className="w-full bg-[#2a2d42] border border-transparent text-white font-semibold px-4 py-2 rounded-full hover:bg-white/10 transition"
                  >
                    Skip
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
