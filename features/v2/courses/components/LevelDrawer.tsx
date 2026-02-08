import { useEffect, useState } from "react";
import { LucideX } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CatFoodIcon from "@/assets/icons/cat-food.svg";

export type Level = "basic" | "intermediate" | "advance";

interface LevelDrawerProps {
  open: boolean;
  value: Level[];
  onClose: () => void;
  onApply: (selected: Level[]) => void;
}

const levels: { label: string; value: Level; dots: number }[] = [
  { label: "Basic", value: "basic", dots: 1 },
  { label: "Intermediate", value: "intermediate", dots: 2 },
  { label: "Advance", value: "advance", dots: 3 },
];

const LevelDrawer = ({ open, value, onClose, onApply }: LevelDrawerProps) => {
  const [tempSelected, setTempSelected] = useState<Level[]>([]);

  useEffect(() => {
    if (open) setTempSelected(value);
  }, [open, value]);

  const toggleLevel = (level: Level) => {
    setTempSelected((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 w-full z-200 flex flex-col items-center justify-end bg-black/74">
      <div className="w-full flex flex-col items-end justify-end rounded-t-3xl bg-white py-5 gap-2">
        <div className="w-full flex items-start justify-between border-b-2 border-graphite-600/20 px-6 pb-3">
          <h2 className="flex-1 text-xl font-semibold text-black">
            Select Level
          </h2>
          <button onClick={onClose} className="text-xl">
            <LucideX className="size-4 text-graphite-600" />
          </button>
        </div>

        <div className="w-full flex flex-col justify-end items-end gap-2 pb-4 px-6">
          {levels.map((item) => {
            const active = tempSelected.includes(item.value);

            return (
              <button
                key={item.value}
                onClick={() => toggleLevel(item.value)}
                className="flex w-full items-center gap-2 py-3"
              >
                <div className="w-20 flex">
                  {Array.from({ length: item.dots }).map((_, i) => (
                    <CatFoodIcon
                      key={i}
                      className={`h-11 ${i > 0 ? "-ml-9 " : ""}`}
                    />
                  ))}
                </div>

                <span className="font-inter font-medium flex-1 text-left">
                  {item.label}
                </span>

                <Checkbox checked={active} className="p-2" />
              </button>
            );
          })}

          <button
            disabled={tempSelected.length === 0}
            onClick={() => onApply(tempSelected)}
            className={`mt-2 w-full flex rounded-full p-3 items-center justify-center font-semibold transition
            ${
              tempSelected.length === 0
                ? "bg-graphite-200 text-graphite-400"
                : "bg-graphite-700  text-white"
            }
          `}
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelDrawer;
