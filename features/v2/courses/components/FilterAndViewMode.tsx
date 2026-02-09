import DashboardSquareIcon from "@/assets/icons/dashboard-square.svg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import CatFoodIcon from "@/assets/icons/cat-food.svg";

type FilterAndViewModeProps = {
  viewMode: string;
  setViewMode: React.Dispatch<React.SetStateAction<"list" | "category">>;
  onClickLevelDrawer: () => void;
  levelFilter: string[];
};

const FilterAndViewMode = ({
  viewMode,
  setViewMode,
  levelFilter,
  onClickLevelDrawer,
}: FilterAndViewModeProps) => {
  return (
    <div className="flex items-start gap-2.5 w-full h-12 relative z-50">
      <button
        onClick={onClickLevelDrawer}
        className="flex-1 flex items-center gap-2.5 pr-4 py-2.5 rounded-2xl bg-white h-full"
      >
        <div className="flex">
          <CatFoodIcon className={`h-11`} />
        </div>
        <span className="flex-1 -ml-4 font-inter text-sm font-medium text-left">
          {levelFilter.length === 0 || levelFilter.length === 3
            ? "All Levels"
            : levelFilter
                .map((level) => level.charAt(0).toUpperCase() + level.slice(1))
                .join(", ")}
        </span>
        <ChevronDownIcon className={`size-4 text-graphite-200`} />
      </button>
      <button
        onClick={() => setViewMode(viewMode === "list" ? "category" : "list")}
        className={`px-4 h-full flex items-center rounded-2xl ${viewMode === "list" ? "bg-white" : "bg-sapphire-500"}`}
      >
        <DashboardSquareIcon
          className={`size-4 ${viewMode === "list" ? "text-graphite-200" : "text-white"}`}
        />
      </button>
    </div>
  );
};

export default FilterAndViewMode;
