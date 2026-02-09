import { useMemo } from "react";
import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import HonourStarIcon from "@/assets/icons/honour-star.svg";
import { Id } from "@/convex/_generated/dataModel";
import {
  useCourseProgressPercentage,
  useLessonsByCourse,
  useLessonsProgressForCourse,
  UserId,
} from "@/lib/convexApi";
import { useLocale } from "@/lib/LocaleContext";

import CloudDecoration from "@/assets/images/img-decoration-course-detail-cloud.svg";
import CatCourseDetail from "@/assets/images/img-decoration-cat-course-detail.svg";
import Image from "next/image";

interface CourseDetailProps {
  courseId: Id<"courses">;
  courseTitle: string;
  courseDescription: string;
  userId?: UserId | null;
  onBack: () => void;
  onLessonSelect: (lessonId: Id<"lessons">, lessonTitle: string) => void;
}

const CourseDetail = ({
  courseId,
  courseTitle,
  courseDescription,
  userId,
  onBack,
  onLessonSelect,
}: CourseDetailProps) => {
  const { t } = useLocale();
  const lessons = useLessonsByCourse(courseId);
  const courseProgress = useCourseProgressPercentage(
    userId ?? undefined,
    courseId,
  );
  const lessonsProgress = useLessonsProgressForCourse(
    userId ?? undefined,
    courseId,
  );

  const loading = lessons === undefined;

  // Create a map of lesson progress for easy lookup
  const progressMap = useMemo(() => {
    const map: Record<
      string,
      { completed: boolean; total: number; done: number }
    > = {};
    if (lessonsProgress) {
      for (const lp of lessonsProgress) {
        map[lp.lessonId] = {
          completed: lp.completed,
          total: lp.total,
          done: lp.done,
        };
      }
    }
    return map;
  }, [lessonsProgress]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen w-full flex flex-col gap-9 p-3 pb-20">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 371 208"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M371 124C371 138.912 358.912 151 344 151C329.0100 151 317 163.088 317 178V179.5C317 195.24 304.24 208 288.5 208H32C14.3269 208 0 193.673 0 176V84C0 69.0883 12.0883 57 27 57C41.9117 57 54 44.9117 54 30V28.5C54 12.7599 66.7599 0 82.5 0H339C356.673 0 371 14.3269 371 32V124Z"
            fill="#F1F3FF"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="293"
          height="208"
          viewBox="0 0 293 208"
          fill="none"
          className="absolute top-0 right-0"
        >
          <path
            opacity="0.2"
            d="M328.339 249.977C335.617 229.642 342.466 209.146 344.158 187.463C345.618 168.626 341.805 150.826 331.596 134.616C327.366 127.911 322.22 122.023 316.148 116.896C296.969 100.663 274.649 90.9162 250.452 84.7639C225.896 78.5195 200.864 75.2591 175.798 72.0562C146.977 68.3694 118.156 64.602 90.1116 56.6178C73.6325 51.9287 57.8372 45.6958 43.3514 36.4558C32.8057 29.7275 23.6043 21.5706 15.8284 11.7545C3.98477 -3.18836 -0.569544 -20.2627 0.0562425 -38.996C0.624086 -56.0703 5.5724 -71.9349 13.2788 -87.0391C24.6473 -109.333 40.1529 -128.273 60.2244 -143.378C92.5915 -167.733 128.551 -184.093 168.775 -190.568C185.382 -193.241 202.127 -194.485 218.63 -190.176C224.644 -188.609 230.659 -186.109 235.908 -182.814C247.59 -175.487 251.599 -163.447 247.648 -150.267C243.812 -137.49 235.746 -127.571 225.977 -118.814C224.725 -117.697 223.52 -116.476 222.106 -115.6C221.249 -115.07 219.893 -114.701 219.047 -115.012C218.409 -115.243 217.749 -116.764 217.899 -117.57C218.641 -121.556 219.348 -125.589 220.634 -129.414C222.941 -136.246 226.069 -142.824 228.121 -149.726C231.887 -162.456 228.723 -167.848 215.871 -171.789C207.296 -174.415 198.454 -174.853 189.6 -174.323C137.463 -171.201 92.9392 -150.624 55.4847 -115.024C38.264 -98.6639 26.0264 -78.7669 19.8265 -55.6095C16.9988 -45.0561 16.5585 -34.3415 18.1693 -23.5462C19.5483 -14.2948 23.5696 -6.24148 29.1669 1.15509C39.9211 15.3606 53.9318 25.5223 69.8198 33.2875C90.0304 43.1727 111.62 48.8641 133.673 52.5394C161.382 57.1709 189.252 60.9037 217.03 65.1435C240.497 68.7266 263.617 73.7152 285.635 82.8169C299.727 88.635 312.66 96.4579 324.515 105.986C344.83 122.311 354.912 143.971 357.473 169.444C359.408 188.708 355.7 207.395 351.458 226.013C349.836 233.145 347.738 240.184 345.873 247.27C345.641 248.157 345.56 249.09 345.409 250C339.719 249.977 334.029 249.977 328.339 249.977Z"
            fill="#B8C3F9"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="320"
          height="208"
          viewBox="0 0 320 208"
          fill="none"
          className="absolute top-0 left-0"
        >
          <path
            opacity="0.1"
            d="M-98.4999 286.452C-97.6841 264.824 -96.4109 243.204 -89.9168 222.388C-84.2659 204.308 -74.1134 189.144 -58.623 177.829C-52.2093 173.151 -45.2511 169.574 -37.7164 167.048C-13.9038 159.031 10.4078 158.216 35.1228 161.444C60.2051 164.718 84.6182 170.947 109.042 177.242C137.126 184.477 165.24 191.636 194.202 194.582C211.22 196.315 228.177 196.357 245.04 193.115C257.316 190.754 268.877 186.564 279.734 180.302C296.268 170.772 306.838 156.559 313.224 138.884C319.046 122.775 320.359 106.171 318.832 89.2549C316.585 64.2888 309.256 40.9133 296.269 19.4202C275.325 -15.2382 248.078 -43.7812 213.204 -64.6983C198.806 -73.3336 183.747 -80.6902 166.85 -82.7859C160.693 -83.5531 154.188 -83.4513 148.097 -82.3262C134.546 -79.8269 126.353 -70.1004 125.115 -56.3652C123.919 -43.0484 127.706 -30.8264 133.505 -19.0575C134.25 -17.5536 134.913 -15.9704 135.898 -14.6318C136.495 -13.8209 137.615 -12.9757 138.515 -12.9523C139.191 -12.9309 140.369 -14.1025 140.529 -14.9092C141.324 -18.8955 142.168 -22.9119 142.398 -26.9496C142.801 -34.1648 142.347 -41.4484 143.012 -48.6336C144.255 -61.8818 149.192 -65.7314 162.569 -64.6435C171.494 -63.9154 179.852 -61.0504 187.862 -57.2799C235.025 -35.0753 268.641 0.563877 290.119 47.5756C299.997 69.1829 303.941 92.2392 301.077 116.097C299.774 126.97 296.198 137.11 290.691 146.566C285.973 154.67 279.251 160.68 271.313 165.495C256.063 174.742 239.298 179.019 221.685 180.368C199.277 182.092 177.15 179.401 155.343 174.661C127.939 168.718 100.719 161.878 73.3957 155.544C50.3127 150.195 27.0292 146.283 3.23682 146.608C-11.9877 146.81 -26.8836 149.307 -41.4145 153.791C-66.314 161.474 -83.7126 177.91 -95.5582 200.681C-104.515 217.902 -108.026 236.675 -111.018 255.581C-112.166 262.822 -112.839 270.153 -113.744 277.441C-113.859 278.353 -114.131 279.252 -114.33 280.155C-109.048 282.24 -103.774 284.346 -98.4999 286.452Z"
            fill="#6F86F3"
          />
        </svg>

        <button
          onClick={onBack}
          className="absolute size-12 top-0 left-0 bg-primary rounded-full flex items-center justify-center"
        >
          <ArrowLeftIcon className="size-6 text-white" />
        </button>

        <div className="absolute top-4 right-4 inline-flex py-1 px-2 gap-1 items-center justify-center bg-linear-to-r from-sapphire-400 to-sapphire-900 rounded-lg">
          <HonourStarIcon className="size-3.5 text-white" />
          <h2 className="text-[0.625rem] font-semibold text-white flex-1">
            {courseTitle}
          </h2>
        </div>

        <div className="absolute top-14 bottom-4 left-6 inline-flex flex-col items-start justify-between gap-3">
          <div className="flex flex-col items-start gap-1">
            <div className="flex justify-center items-center gap-2.5 text-graphite-700">
              <h1 className="text-2xl font-bold line-clamp-2">
                {lessons[0].title}
              </h1>
            </div>
            <p className="text-xs font-inter line-clamp-2">
              {courseDescription}
            </p>
          </div>
          <div className="flex py-2 px-3 justify-center items-center gap-2 rounded-2xl bg-primary/20 backdrop-blur-xs">
            <h4 className="font-inter text-xs text-graphite-700 text-center">
              <span className="font-semibold">0</span> Cards
            </h4>
            <div className="size-1 bg-primary rounded-full" />
            <h4 className="font-inter text-xs text-graphite-700 text-center">
              <span className="font-semibold">0</span> Quiz
            </h4>
            {/* <div className="size-1 bg-primary rounded-full" />
            <span className="text-xs font-semibold text-white text-center">
              0 Cards
            </span> */}
          </div>
        </div>

        <div className="absolute size-12 bottom-0 right-0 bg-primary rounded-full flex items-center justify-center p-2">
          <span className="text-xs font-semibold text-white text-center">
            1200 XP
          </span>
        </div>
      </div>

      <div className="relative flex flex-col justify-center items-center gap-4 bg-gold-400 rounded-4xl p-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-start gap-4 p-6 rounded-2xl bg-gold-100">
            <h3 className="font-bold text-graphite-700">
              What you will learn...
            </h3>
            <div className="text-sm font-inter text-graphite-400">
              <ul>
                <li>Why contract structure impacts security</li>
                <li>How to apply Single Responsibility</li>
                <li>Modular contract design with interfaces</li>
                <li>How Proxy pattern enables upgrades</li>
                <li>What delegate call actually does</li>
                <li>Storage layout rules for upgradeable contracts</li>
                <li>
                  No long videos.No theory overload.Just focused concepts that
                  stack.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div></div>
      </div>

      <div className="relative flex items-start px-4 py-6 gap-4 rounded-3xl bg-sapphire-100">
        <Image
          src={CloudDecoration}
          alt="Cloud Decoration"
          width={100}
          height={100}
          className="absolute top-2 right-0 w-22"
        />
        <Image
          src={CatCourseDetail}
          alt="Cat Course Detail"
          width={100}
          height={100}
          className="absolute bottom-0 right-0 w-18"
        />
        <div className="flex flex-col items-start gap-1 flex-1 text-graphite-700">
          <h2 className="font-bold">Take This Lesson!</h2>
          <p className="font-inter text-xs ">
            “If your contract is one giant file… we need to talk.”
          </p>
        </div>
      </div>

      <div className="fixed left-0 right-0 bottom-0 flex w-full rounded-t-3xl bg-white py-3 px-4 justify-end z-20">
        <button
          onClick={() => onLessonSelect(lessons[0]._id, lessons[0].title)}
          className="flex w-full h-12 rounded-full items-center justify-center bg-graphite-700"
        >
          <span className="text-white font-semibold">Start Lesson</span>
        </button>
      </div>
    </section>
  );
};

export default CourseDetail;
