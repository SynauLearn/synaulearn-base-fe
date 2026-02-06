import GreetingsSection from "./sections/GreetingsSection";
import DashboardSection from "./sections/DashboardSection";

const HomePage = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col gap-5 py-5 px-2">
      <GreetingsSection />
      <DashboardSection />
    </section>
  );
};

export default HomePage;
