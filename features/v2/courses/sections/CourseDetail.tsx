import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import HonourStarIcon from "@/assets/icons/honour-star.svg";

const CourseDetail = () => {
  return (
    <section className="relative min-h-screen w-full">
      <div className="absolute inset-x-2.5 top-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 371 208"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M371 124C371 138.912 358.912 151 344 151C329.088 151 317 163.088 317 178V179.5C317 195.24 304.24 208 288.5 208H32C14.3269 208 0 193.673 0 176V84C0 69.0883 12.0883 57 27 57C41.9117 57 54 44.9117 54 30V28.5C54 12.7599 66.7599 0 82.5 0H339C356.673 0 371 14.3269 371 32V124Z"
            fill="#F1F3FF"
          />
        </svg>

        <div className="absolute size-12 top-0 left-0 bg-primary rounded-full flex items-center justify-center">
          <ArrowLeftIcon className="size-6 text-white" />
        </div>

        <div className="absolute top-4 right-4 inline-flex py-1 px-2 gap-1 items-center justify-center bg-linear-to-r from-sapphire-400 to-sapphire-900 rounded-lg">
          <HonourStarIcon className="size-3.5 text-white" />
          <h2 className="text-[0.625rem] font-semibold text-white flex-1">
            Advanced Contract Architect
          </h2>
        </div>

        <div className="absolute size-12 bottom-0 right-0 bg-primary rounded-full flex items-center justify-center p-2">
          <span className="text-xs font-semibold text-white text-center">
            1200 XP
          </span>
        </div>
      </div>
    </section>
  );
};

export default CourseDetail;
