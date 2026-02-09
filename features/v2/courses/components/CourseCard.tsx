import ChevronRightIcon from "@/assets/icons/chevron-right.svg";

type CourseCardProps = {
  id: number;
  category?: string;
  level: string;
  totalLessons: number;
  title: string;
  description: string;
  progress: number;
  image: string;
  onClick?: (id: number) => void;
};

const CourseCard = ({
  id,
  title,
  description,
  progress,
  image,
  onClick,
  totalLessons = 0,
  category = "DeFi & Smart Contracts",
  level = "Beginner",
}: CourseCardProps) => {
  return (
    <div
      onClick={() => onClick?.(id)}
      className="flex flex-col items-start bg-white p-4 rounded-3xl gap-2.5"
    >
      <div className="flex justify-between items-center w-full">
        <div className="px-2 py-1 bg-sapphire-500 rounded-lg flex">
          <span className="font-inter text-[0.625rem] text-white font-semibold">
            {category}
          </span>
        </div>
        <ChevronRightIcon className="text-graphite-700 size-2.5" />
      </div>
      <div className="flex items-center gap-2.5">
        <div className="size-17">
          <span className="text-[60px] leading-none">{image}</span>
        </div>
        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-col items-start gap-1 text-graphite-700">
            <h1 className="text-sm font-bold">{title}</h1>
            <p className="font-inter text-[0.625rem]">{description}</p>
          </div>

          <div className="flex justify-center items-center gap-2.5">
            <span className="font-inter text-[0.625rem] text-graphite-700">
              {totalLessons} Lessons
            </span>
            <div className="size-1 rounded-full bg-graphite-300" />
            <div className="px-2 py-1 bg-spruce-500 rounded-lg flex">
              <span className="font-inter text-[0.625rem] text-white font-medium">
                {level}
              </span>
            </div>
          </div>

          <div className="hidden">{progress}</div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
