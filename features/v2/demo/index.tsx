"use client";

import { useState } from "react";
import Image from "next/image";
import CatCourse from "@/assets/images/img-decoration-cat-course.svg";
import CloudCourse from "@/assets/images/img-decoration-course-cloud.svg";
import { CourseProvider } from "@/features/v2/courses/contexts/CourseContext";
import DemoLessonSection from "./DemoLessonSection";

const BASE_APP_URL = "https://base.app/app/https:/app.synaulearn.com";

const content = {
    en: {
        badge: "SynauLearn Demo",
        title: "Learn Web3 in 5 Minutes",
        subtitle:
            "Experience SynauLearn with a quick demo lesson. Flip flashcards, answer quizzes, and see how easy learning blockchain can be.",
        ctaStart: "Start Demo",
        ctaFull: "Get Full Version on Base App",
    },
    id: {
        badge: "Demo SynauLearn",
        title: "Belajar Web3 dalam 5 Menit",
        subtitle:
            "Rasakan SynauLearn dengan pelajaran demo singkat. Balik kartu, jawab kuis, dan lihat betapa mudahnya belajar blockchain.",
        ctaStart: "Mulai Demo",
        ctaFull: "Dapatkan Versi Lengkap di Base App",
    },
};

interface DemoPageProps {
    initialLocale?: string;
}

export default function DemoPage({ initialLocale = "en" }: DemoPageProps) {
    const [locale, setLocale] = useState(initialLocale);
    const [started, setStarted] = useState(false);

    const t = locale === "id" ? content.id : content.en;

    if (started) {
        return (
            <CourseProvider>
                <DemoLessonSection locale={locale} onBack={() => setStarted(false)} />
            </CourseProvider>
        );
    }

    return (
        <section className="relative w-full min-h-screen bg-gradient-to-b from-cream-50 to-sapphire-200/10 overflow-hidden">
            {/* Language toggle */}
            <div className="absolute top-4 right-4 z-20">
                <div className="flex bg-white rounded-full shadow-sm overflow-hidden">
                    <button
                        onClick={() => setLocale("en")}
                        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${locale === "en"
                            ? "bg-primary text-white"
                            : "text-graphite-400 hover:text-graphite-700"
                            }`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLocale("id")}
                        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${locale === "id"
                            ? "bg-primary text-white"
                            : "text-graphite-400 hover:text-graphite-700"
                            }`}
                    >
                        ID
                    </button>
                </div>
            </div>

            {/* Background decorations */}
            <Image
                src={CloudCourse}
                alt=""
                width={200}
                height={200}
                className="absolute top-8 -right-6 w-32 scale-x-[-1] opacity-40"
            />
            <Image
                src={CloudCourse}
                alt=""
                width={200}
                height={200}
                className="absolute top-40 -left-10 w-28 opacity-30"
            />

            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 gap-8 max-w-md mx-auto">
                {/* Cat mascot */}
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-150" />
                    <Image
                        src={CatCourse}
                        alt="SynauLearn Cat"
                        width={200}
                        height={200}
                        className="relative w-48"
                    />
                </div>

                {/* Badge */}
                <span className="bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full">
                    {t.badge}
                </span>

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-graphite-700 leading-tight">
                        {t.title}
                    </h1>
                    <p className="text-graphite-400 mt-3 text-sm leading-relaxed">
                        {t.subtitle}
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => setStarted(true)}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-full transition-all shadow-lg shadow-primary/30 active:scale-[0.98]"
                    >
                        {t.ctaStart}
                    </button>
                    <a
                        href={BASE_APP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-12 flex items-center justify-center bg-white hover:bg-graphite-50 text-primary font-semibold rounded-full border-2 border-primary transition-all"
                    >
                        {t.ctaFull}
                    </a>
                </div>

                {/* SynauLearn branding */}
                <p className="text-xs text-graphite-300">
                    SynauLearn — Learn Web3, Earn onchain
                </p>
            </div>
        </section>
    );
}
