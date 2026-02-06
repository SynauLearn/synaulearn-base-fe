import Image from "next/image";
import MailIcon from "@/assets/icons/mail.svg";
import CatGreeting from "@/assets/images/img-decoration-cat-home-greeting.svg";

const GreetingsSection = () => {
  return (
    <section className="relative flex gap-2.5">
      <div className="relative w-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="371"
          height="245"
          viewBox="0 0 371 245"
          fill="none"
        >
          <path
            d="M225.5 0C241.24 0 254 12.7599 254 28.5C254 44.2401 266.76 57 282.5 57H339C356.673 57 371 71.3269 371 89V213C371 230.673 356.673 245 339 245H32C14.3269 245 0 230.673 0 213V32C0 14.3269 14.3269 0 32 0H225.5Z"
            fill="#DCE1FC"
          />
        </svg>

        <div className="absolute top-5 left-6 flex flex-col justify-center items-start gap-2">
          <h1 className="text-2xl font-extrabold text-graphite-700">
            Welcome!
          </h1>
        </div>

        <div className="absolute left-6 w-48 bottom-8 flex flex-col items-start py-3 px-4 gap-2.5 rounded-2xl bg-white">
          <h2 className="text-sm font-extrabold text-graphite-700">
            Hey, Genius. <br /> Ready to level up?
          </h2>
        </div>

        <Image
          src={CatGreeting}
          alt="Cat Greeting"
          width={300}
          height={300}
          className="absolute bottom-0 right-2 size-52"
        />
      </div>

      <div className="absolute right-2 top-0 flex gap-2.5">
        <button className="rounded-full bg-sapphire-400 p-2">
          <MailIcon className="size-7 text-white" />
        </button>
        <button className="rounded-full bg-sapphire-100 p-2"></button>
      </div>
    </section>
  );
};

export default GreetingsSection;
