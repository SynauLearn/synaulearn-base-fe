import Image from "next/image";
import PlaceholderIcon from "@/assets/icons/placeholder.svg";
import ImgDecorationDashboard from "@/assets/images/img-decoration-home-dashboard.svg";

const DashboardSection = () => {
  return (
    <section className="relative flex flex-col gap-9 bg-gold-100 py-6 px-4 w-full rounded-4xl min-h-dvh overflow-clip">
      <Image
        src={ImgDecorationDashboard}
        alt="Decoration Dashboard"
        width={300}
        height={300}
        className="absolute w-[5.875rem] h-14 top-10 right-4"
      />

      {/* <div className="absolute left-0 top-10 w-52 h-26 bg-white/50 rounded-t-full z-10" /> */}

      <div className="flex flex-col w-full bg-graphite-700 rounded-3xl">
        <div className="flex flex-col bg-sapphire-100 rounded-3xl gap-4 px-4 py-6">
          <div className="flex flex-col items-start gap-1 text-graphite-700">
            <h2 className="font-bold">Your Learning Performance</h2>
            <p className="font-inter text-[0.625rem]">at a glance...</p>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex px-4 py-1 bg-white rounded-2xl">
                <div className="flex items-center gap-2.5 text-graphite-700">
                  <h4 className="text-3xl font-bold">0</h4>
                  <p className="font-inter text-[0.625rem]">Cards Mastered</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center gap-2.5 py-2">
          <h3 className="font-bold text-[0.625rem] text-white">
            Boca said, &quot;Keep it up!&quot;
          </h3>
          <PlaceholderIcon className="size-3.5" />
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
