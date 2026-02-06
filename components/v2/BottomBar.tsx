"use client";
import CardsIcon from "@/assets/icons/cards.svg";
import HomeIcon from "@/assets/icons/home.svg";
import RankingIcon from "@/assets/icons/ranking.svg";
import AchievementIcon from "@/assets/icons/honour-star.svg";

import { useLocale } from "@/lib/LocaleContext";

type View =
  | "home"
  | "courses"
  | "profile"
  | "leaderboard"
  | "signin"
  | "balance"
  | "mintbadge";

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const BottomBar = ({ currentView, onNavigate }: BottomNavProps) => {
  const { t } = useLocale();

  const navItems = [
    {
      id: "home" as const,
      label: t("navigation.home"),
      icon: <HomeIcon className="size-6" />,
    },
    {
      id: "courses" as const,
      label: t("navigation.courses"),
      icon: <CardsIcon className="size-6" />,
    },
    {
      id: "leaderboard" as const,
      label: t("navigation.leaderboard"),
      icon: <RankingIcon className="size-6" />,
    },
    {
      id: "mintbadge" as const,
      label: t("navigation.mintBadge"),
      icon: <AchievementIcon className="size-6" />,
    },
  ];

  return (
    <nav className="fixed bottom-2 inset-x-4 z-100">
      <div className="py-3 px-5 flex items-center justify-between w-full rounded-full border border-black/5 bg-white">
        {navItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`${currentView === id ? "flex gap-2 items-center px-4 py-2 rounded-full bg-black" : "shrink"}`}
          >
            <div
              className={
                currentView === id ? "text-white" : "text-graphite-300"
              }
            >
              {icon}
            </div>
            <span
              className={`${
                currentView === id
                  ? "text-xs font-semibold text-white"
                  : "hidden"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomBar;
