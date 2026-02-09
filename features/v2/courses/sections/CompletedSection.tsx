import { SafeArea } from "@coinbase/onchainkit/minikit";
import Image from "next/image";
import HomeIcon from "@/assets/icons/home.svg";
import LightningIcon from "@/assets/icons/lightning.svg";
import HonourStarIcon from "@/assets/icons/honour-star.svg";

interface CompletePageSectionProps {
  courseTitle: string;
  totalXP: number;
  cardsCompleted: number;
  correctAnswers: number;
  onBackToCourses: () => void;
}

const CompletePageSection = ({
  courseTitle,
  totalXP,
  cardsCompleted,
  correctAnswers,
  onBackToCourses,
}: CompletePageSectionProps) => {
  const accuracy = Math.round((correctAnswers / cardsCompleted) * 100);

  return (
    <SafeArea>
      <section className="relative min-h-screen w-full bg-white px-2.5 mt-4.5">
        <button
          onClick={onBackToCourses}
          className="absolute top-0 left-2.5 size-12 bg-primary rounded-full flex items-center justify-center z-50"
        >
          <HomeIcon className="size-6 text-white" />
        </button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 371 738"
          fill="none"
        >
          <path
            d="M371 626.059C371 643.732 356.673 658.059 339 658.059H244C226.327 658.059 212 672.385 212 690.059V706C212 723.673 197.673 738 180 738H32C14.3269 738 0 723.673 0 706V84C0 68.536 12.536 56 28 56C43.464 56 56 43.464 56 28C56 12.536 68.536 0 84 0H339C356.673 0 371 14.3269 371 32V626.059Z"
            fill="#DCE1FC"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="256"
          height="273"
          viewBox="0 0 256 273"
          fill="none"
          className="absolute top-0 left-2.5"
        >
          <path
            opacity="0.1"
            d="M-162.04 272.452C-161.224 250.824 -159.951 229.204 -153.457 208.388C-147.806 190.308 -137.653 175.144 -122.163 163.829C-115.749 159.151 -108.791 155.574 -101.256 153.048C-77.4436 145.031 -53.132 144.216 -28.417 147.444C-3.33469 150.718 21.0784 156.947 45.5023 163.242C73.5863 170.477 101.7 177.636 130.663 180.582C147.68 182.315 164.638 182.357 181.5 179.115C193.776 176.754 205.337 172.564 216.195 166.302C232.728 156.772 243.298 142.559 249.684 124.884C255.507 108.775 256.819 92.1713 255.293 75.2549C253.045 50.2888 245.716 26.9133 232.729 5.42019C211.785 -29.2382 184.539 -57.7812 149.664 -78.6983C135.266 -87.3336 120.208 -94.6902 103.31 -96.7859C97.1529 -97.5531 90.6485 -97.4513 84.5576 -96.3262C71.006 -93.8269 62.8129 -84.1004 61.5748 -70.3652C60.3792 -57.0484 64.1665 -44.8264 69.9655 -33.0575C70.71 -31.5536 71.373 -29.9704 72.3578 -28.6318C72.9556 -27.8209 74.0751 -26.9757 74.9749 -26.9523C75.6513 -26.9309 76.8291 -28.1025 76.9894 -28.9092C77.7842 -32.8955 78.6283 -36.9119 78.8583 -40.9496C79.2612 -48.1648 78.8073 -55.4484 79.4722 -62.6336C80.7151 -75.8818 85.6523 -79.7314 99.0293 -78.6435C107.954 -77.9154 116.313 -75.0504 124.322 -71.2799C171.485 -49.0753 205.101 -13.4361 226.579 33.5756C236.457 55.1829 240.401 78.2392 237.537 102.097C236.234 112.97 232.658 123.11 227.151 132.566C222.433 140.67 215.711 146.68 207.773 151.495C192.523 160.742 175.759 165.019 158.145 166.368C135.737 168.092 113.61 165.401 91.8033 160.661C64.3992 154.718 37.1788 147.878 9.85592 141.544C-13.2271 136.195 -36.5105 132.283 -60.3029 132.608C-75.5275 132.81 -90.4234 135.307 -104.954 139.791C-129.854 147.474 -147.252 163.91 -159.098 186.681C-168.054 203.902 -171.566 222.675 -174.557 241.581C-175.705 248.822 -176.379 256.153 -177.284 263.441C-177.399 264.353 -177.671 265.252 -177.87 266.155C-172.587 268.24 -167.314 270.346 -162.04 272.452Z"
            fill="#6F86F3"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="371"
          height="309"
          viewBox="0 0 371 309"
          fill="none"
          className="absolute top-52 left-2.5"
        >
          <path
            opacity="0.2"
            d="M432.218 100.239C431.279 99.1797 430.672 98.4435 429.991 97.7432C417.972 85.3709 415.837 71.7418 423.567 56.4246C428.021 47.6078 434.592 40.4251 442.599 34.6431C474.423 11.6404 510.37 0.650866 549.814 0.00442153C552.796 -0.0494488 555.814 0.399471 558.796 0.776564C583.037 3.93696 596.308 18.3024 596.97 42.1669C597.338 55.5806 594.246 68.4377 589.682 80.9356C580.718 105.447 567.778 127.713 549.998 147.286C525.187 174.598 496.97 198.032 465.257 217.228C393.455 260.701 316.113 290.509 232.77 304.928C209.726 308.915 186.442 309.489 163.472 304.408C155.428 302.63 147.477 299.541 140.133 295.824C125.114 288.193 117.88 275.461 118.193 259.013C118.727 231.521 127.672 206.615 143.133 183.72C154.342 167.11 165.423 150.392 176.061 133.441C180.571 126.259 184.565 118.591 187.492 110.672C191.964 98.5692 188.541 88.1183 178.601 79.3913C160.398 63.4278 138.697 58.3101 114.99 59.2259C81.1416 60.5188 48.2685 66.7857 16.4261 78.0266C0.780941 83.5573 -14.2384 90.1115 -25.8158 102.502C-29.9387 106.919 -35.4238 106.093 -39.0866 101.209C-42.4365 96.7196 -42.7862 91.6199 -40.7063 86.7716C-38.8473 82.4799 -36.3625 78.278 -33.3439 74.6687C-25.5213 65.3132 -15.9133 57.7534 -4.52 53.1206C32.0344 38.3062 69.7482 27.604 109.744 28.4839C141.568 29.1842 169.951 38.8809 192.645 62.1349C208.419 78.3139 213.978 96.6119 206.947 117.783C203.726 127.48 199.179 136.889 194.118 145.813C184.344 163.07 173.724 179.895 163.545 196.936C152.557 215.306 144.532 234.682 143.335 256.23C142.673 268.225 145.121 271.996 157.011 275.587C178.473 282.087 200.284 281.728 222.003 277.347C268.239 268.009 312.137 251.884 355.244 233.389C394.136 216.689 431.003 196.757 465.165 172.066C487.326 156.031 506.818 137.284 524.138 116.4C538.844 98.6769 549.428 78.7808 555.005 56.5683C556.183 51.8816 556.238 46.8896 556.422 42.0412C556.551 38.4678 554.544 36.1873 550.716 35.8821C546.888 35.5768 543.041 34.9842 539.231 35.1997C509.1 36.8876 482.154 46.7998 458.704 65.4389C456.238 67.3962 453.937 69.5331 451.71 71.7417C444.881 78.5294 444.881 79.5529 451.084 86.61C459.441 96.0911 460.398 104.962 453.035 115.071C448.912 120.746 443.611 125.594 438.715 130.694C437.482 131.969 435.789 132.867 434.169 133.693C427.138 137.302 419.536 136.135 415.542 130.909C411.64 125.792 412.303 118.537 417.751 113.078C422.205 108.625 427.248 104.621 432.218 100.239Z"
            fill="#B8C3F9"
          />
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="135"
          height="406"
          viewBox="0 0 135 406"
          fill="none"
          className="absolute top-68 right-2.5"
        >
          <path
            opacity="0.2"
            d="M385.209 405.623C387.87 384.189 390.078 362.692 386.994 341.163C384.306 322.462 376.698 305.924 363.195 292.335C357.603 286.715 351.296 282.093 344.251 278.416C321.989 266.763 298.08 262.125 273.123 261.406C247.796 260.674 222.657 262.959 197.496 265.307C168.566 268.003 139.618 270.62 110.506 268.953C93.4011 267.976 76.6258 265.342 60.4719 259.489C48.7114 255.226 37.9509 249.275 28.219 241.394C13.3981 229.398 5.22513 213.73 1.74494 195.312C-1.42951 178.526 -0.0650402 161.964 4.15704 145.541C10.3828 121.303 21.378 99.4338 37.6667 80.311C63.934 49.475 95.4531 25.6573 133.293 10.5547C148.915 4.31991 164.984 -0.551166 182.029 0.0500817C188.241 0.265729 194.656 1.39207 200.498 3.4612C213.498 8.06089 220.04 18.9343 219.062 32.6593C218.109 45.9655 212.404 57.4071 204.783 68.0852C203.805 69.4491 202.896 70.9041 201.707 72.0673C200.986 72.7718 199.744 73.4276 198.85 73.3088C198.178 73.2231 197.201 71.8833 197.172 71.0634C197.025 67.0113 196.835 62.9219 197.255 58.9083C198.013 51.7375 199.63 44.6345 200.125 37.4519C201.02 24.2059 196.755 19.635 183.353 18.5963C174.411 17.9056 165.686 19.4093 157.162 21.8599C106.965 36.2922 68.0094 66.0951 39.2331 109.015C26.0006 128.741 18.4033 150.83 17.4101 174.783C16.9553 185.699 18.8653 196.251 22.7947 206.434C26.1607 215.161 31.8435 222.142 38.921 228.137C52.5178 239.652 68.4094 246.509 85.6097 250.617C107.491 255.85 129.803 256.689 152.126 255.46C180.177 253.929 208.19 251.486 236.224 249.557C259.907 247.929 283.558 247.749 307.032 251.822C322.054 254.423 336.383 259.233 350.033 265.942C373.423 277.437 387.991 296.372 396.053 320.671C402.149 339.047 402.611 358.093 402.537 377.188C402.511 384.502 402.002 391.83 401.728 399.152C401.696 400.068 401.82 400.996 401.872 401.917C396.314 403.137 390.762 404.38 385.209 405.623Z"
            fill="#B8C3F9"
          />
        </svg>

        <div className="absolute top-14 flex flex-col gap-4 left-1/2 -translate-x-1/2 w-full items-center justify-center">
          <h1 className="text-graphite-700 text-2xl font-bold ">
            Lesson Completed!
          </h1>
          <div className="relative flex flex-col gap-6 bg-white p-6 rounded-3xl">
            <div className="flex flex-col items-start gap-2">
              <div className="flex px-2 py-1 items-center justify-center rounded-lg bg-primary">
                <span className="font-inter text-[0.625rem] font-semibold text-white">
                  DeFi & Smart Contracts
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span></span>
                <div className="flex flex-col items-start gap-1 flex-1">
                  <h2 className="text-sm font-bold text-graphite-700">
                    {courseTitle}
                  </h2>
                  <p className="font-inter text-[0.625rem] text-graphite-700">
                    Design secure, modular, and upgradeable contracts
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="flex pb-2 flex-col justify-center items-center gap-1 flex-1 bg-primary rounded-2xl">
                <div className="flex py-5 px-2 items-center justify-center gap-1 rounded-2xl border border-primary flex-1 bg-white w-full">
                  <span className="text-primary font-bold">{totalXP} XP</span>
                  <LightningIcon className="w-2.5" />
                </div>
                <h3 className="font-inter text-xs text-white font-medium">
                  XP Gained
                </h3>
              </div>
              <div className="flex pb-2 flex-col justify-center items-center gap-1 flex-1 bg-primary rounded-2xl">
                <div className="flex py-5 px-3 items-center justify-center gap-1 rounded-2xl border border-primary flex-1 bg-white w-full">
                  <span className="text-primary font-bold">
                    {cardsCompleted}
                  </span>
                </div>
                <h3 className="font-inter text-xs text-white font-medium">
                  Cards
                </h3>
              </div>
              <div className="flex pb-2 flex-col justify-center items-center gap-1 flex-1 bg-primary rounded-2xl">
                <div className="flex py-5 px-3 items-center justify-center gap-1 rounded-2xl border border-primary bg-white w-full ">
                  <span className="text-primary font-bold">{accuracy}%</span>
                </div>
                <h3 className="font-inter text-xs text-white font-medium">
                  Accuracy
                </h3>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2 w-full">
              <p className="font-inter text-xs text-graphite-400">
                Badge Earned:
              </p>
              <div className="w-full flex items-center justify-center gap-1 bg-linear-to-r from-primary to-sapphire-900 rounded-2xl px-2 py-3">
                <HonourStarIcon className="size-3.5 text-white" />
                <p className="text-white text-sm font-semibold">
                  Advanced Contract Architect
                </p>
              </div>
            </div>
          </div>
        </div>

        <button className="absolute bottom-0 right-2.5 bg-black flex items-center justify-center p-3 rounded-3xl w-36.5 h-17">
          <span className="font-semibold text-white">Mint Badge</span>
        </button>
      </section>

      {/* <div className="bg-[#1a1d2e] z-50 flex flex-col items-center gap-4 justify-center px-6 py-10 -mb-10">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-5xl font-bold text-white">Lesson Complete!</h1>
          <p className="text-gray-400 text-lg">{courseTitle}</p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="w-full flex justify-between items-center space-x-6">
            <div className="flex-1 flex flex-col border border-primary p-1 gap-2 bg-primary rounded-2xl text-center">
              <p className="text-white text-sm font-semibold">Total XP</p>
              <div className="text-lg bg-[#1a1d2e] rounded-2xl font-bold text-primary p-4 flex gap-2 justify-center items-center">
                <Zap fill="oklch(54.6% 0.245 262.881)" /> {totalXP}
              </div>
            </div>
            <div className="flex-1 flex flex-col border border-gray-400 p-1 gap-2 bg-gray-400 rounded-2xl text-center">
              <p className="text-white text-sm font-semibold">Total Card</p>
              <div className="text-lg bg-[#1a1d2e] rounded-2xl font-bold text-gray-400 p-4 flex gap-2 justify-center items-center">
                <BookCheck /> {cardsCompleted}
              </div>
            </div>
            <div className="flex-1 flex flex-col border border-emerald-600 p-1 gap-2 bg-emerald-600 rounded-2xl text-center">
              <p className="text-white text-sm font-semibold">Accuracy</p>
              <div className="text-lg bg-[#1a1d2e] rounded-2xl font-bold text-emerald-600 p-4 flex gap-2 justify-center items-center">
                <Target /> {accuracy}%
              </div>
            </div>
          </div>

          <div className="bg-[#252841] rounded-2xl p-4 border border-[#2a2d42] flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <h3 className="text-white font-bold text-lg">Lesson Master</h3>
              <p className="text-gray-400 text-sm">
                You&apos;ve completed this lesson with{" "}
                <span className="font-bold">{accuracy}%</span> accuracy!
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-2">
          {hasNextLesson && onNextLesson && (
            <button
              onClick={onNextLesson}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              Next Lesson
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={onBackToCourses}
            className="w-full bg-primary hover:bg-[#333649] text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            Continue
          </button>
          <p className="text-gray-500 text-sm mt-6 text-center">
            Keep learning to unlock more badges and climb the leaderboard! 🚀
          </p>
        </div>
      </div> */}
    </SafeArea>
  );
};

export default CompletePageSection;
