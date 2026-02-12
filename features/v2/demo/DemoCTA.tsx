"use client";

import Image from "next/image";
import CatCourse from "@/assets/images/img-decoration-cat-course.svg";
import LightningIcon from "@/assets/icons/lightning.svg";

interface DemoCTAProps {
    totalXP: number;
    cardsCompleted: number;
    correctAnswers: number;
    locale: string;
    onRestart: () => void;
    onCtaClick: (ctaType: string) => void;
}

const BASE_APP_URL = "https://base.app/app/https:/app.synaulearn.com";

const content = {
    en: {
        title: "🎉 Demo Complete!",
        subtitle: "You just got a taste of Web3 learning",
        xpLabel: "XP Earned",
        cardsLabel: "Cards Completed",
        quizLabel: "Quiz Score",
        compareTitle: "Demo vs Full Version",
        demoCol: "Demo",
        fullCol: "Full Version",
        courses: ["1 lesson", "50+ courses"],
        badges: ["None", "NFT badges 🏅"],
        xp: ["Not saved", "Earn & save XP ⚡"],
        leaderboard: ["None", "Global leaderboard 🏆"],
        community: ["None", "Farcaster community 🤝"],
        ctaPrimary: "Continue Learning on Base App",
        ctaSecondary: "Try Again",
        ctaShare: "Share Your Score",
        poweredBy: "Powered by SynauLearn — Learn Web3, Earn onchain",
    },
    id: {
        title: "🎉 Demo Selesai!",
        subtitle: "Kamu baru saja merasakan belajar Web3",
        xpLabel: "XP Didapat",
        cardsLabel: "Kartu Selesai",
        quizLabel: "Skor Kuis",
        compareTitle: "Demo vs Versi Lengkap",
        demoCol: "Demo",
        fullCol: "Versi Lengkap",
        courses: ["1 pelajaran", "50+ kursus"],
        badges: ["Tidak ada", "NFT badge 🏅"],
        xp: ["Tidak disimpan", "Dapatkan & simpan XP ⚡"],
        leaderboard: ["Tidak ada", "Leaderboard global 🏆"],
        community: ["Tidak ada", "Komunitas Farcaster 🤝"],
        ctaPrimary: "Lanjut Belajar di Base App",
        ctaSecondary: "Coba Lagi",
        ctaShare: "Bagikan Skormu",
        poweredBy: "Powered by SynauLearn — Belajar Web3, Earn onchain",
    },
};

export default function DemoCTA({
    totalXP,
    cardsCompleted,
    correctAnswers,
    locale,
    onRestart,
    onCtaClick,
}: DemoCTAProps) {
    const t = locale === "id" ? content.id : content.en;

    const handleBaseAppClick = () => {
        onCtaClick("base_app");
        window.open(BASE_APP_URL, "_blank");
    };

    const handleShare = () => {
        onCtaClick("share");
        const shareText =
            locale === "id"
                ? `Aku baru selesai demo SynauLearn! Skor: ${correctAnswers}/${cardsCompleted} ⚡ ${totalXP} XP. Coba juga!`
                : `Just finished the SynauLearn demo! Score: ${correctAnswers}/${cardsCompleted} ⚡ ${totalXP} XP. Try it out!`;
        const shareUrl = "https://app.synaulearn.com/demo";

        if (navigator.share) {
            navigator.share({ text: shareText, url: shareUrl }).catch(() => { });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard
                .writeText(`${shareText} ${shareUrl}`)
                .then(() => alert(locale === "id" ? "Disalin!" : "Copied!"))
                .catch(() => { });
        }
    };

    const compareRows = [
        { label: locale === "id" ? "Kursus" : "Courses", values: t.courses },
        { label: "Badges", values: t.badges },
        { label: "XP", values: t.xp },
        { label: "Leaderboard", values: t.leaderboard },
        { label: locale === "id" ? "Komunitas" : "Community", values: t.community },
    ];

    return (
        <section className="relative w-full min-h-screen bg-gradient-to-b from-sapphire-200/20 to-gold-100/30 overflow-hidden">
            <div className="flex flex-col items-center px-6 py-12 gap-8 max-w-md mx-auto">
                {/* Cat mascot */}
                <Image
                    src={CatCourse}
                    alt="SynauLearn Cat"
                    width={160}
                    height={160}
                    className="w-40"
                />

                {/* Title */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-graphite-700">{t.title}</h1>
                    <p className="text-graphite-400 mt-2">{t.subtitle}</p>
                </div>

                {/* Stats */}
                <div className="flex gap-4 w-full">
                    <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm">
                        <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                            {totalXP}
                            <LightningIcon className="size-5" />
                        </div>
                        <p className="text-xs text-graphite-400 mt-1">{t.xpLabel}</p>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm">
                        <p className="text-2xl font-bold text-primary">{cardsCompleted}</p>
                        <p className="text-xs text-graphite-400 mt-1">{t.cardsLabel}</p>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-4 text-center shadow-sm">
                        <p className="text-2xl font-bold text-primary">
                            {correctAnswers}/{cardsCompleted}
                        </p>
                        <p className="text-xs text-graphite-400 mt-1">{t.quizLabel}</p>
                    </div>
                </div>

                {/* Comparison table */}
                <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-primary px-4 py-3">
                        <h3 className="text-white font-bold text-center">
                            {t.compareTitle}
                        </h3>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-graphite-100">
                                <th className="py-2 px-3 text-left text-xs text-graphite-400 font-normal" />
                                <th className="py-2 px-3 text-center text-xs text-graphite-400 font-semibold">
                                    {t.demoCol}
                                </th>
                                <th className="py-2 px-3 text-center text-xs text-primary font-semibold">
                                    {t.fullCol}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {compareRows.map((row) => (
                                <tr key={row.label} className="border-b border-graphite-50">
                                    <td className="py-2.5 px-3 text-xs font-medium text-graphite-700">
                                        {row.label}
                                    </td>
                                    <td className="py-2.5 px-3 text-center text-xs text-graphite-400">
                                        {row.values[0]}
                                    </td>
                                    <td className="py-2.5 px-3 text-center text-xs text-graphite-700 font-medium">
                                        {row.values[1]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={handleBaseAppClick}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all shadow-lg shadow-primary/30"
                    >
                        {t.ctaPrimary}
                    </button>
                    <button
                        onClick={onRestart}
                        className="w-full h-12 text-graphite-400 hover:text-graphite-700 font-medium transition-colors"
                    >
                        {t.ctaSecondary}
                    </button>
                </div>

                {/* Footer */}
                <p className="text-xs text-graphite-300 text-center">{t.poweredBy}</p>
            </div>
        </section>
    );
}
