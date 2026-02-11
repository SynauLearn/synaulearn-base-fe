import { BookOpen, Award, Zap, X } from 'lucide-react';
import { SafeArea } from '@coinbase/onchainkit/minikit';
import { useLocale } from '@/lib/LocaleContext';

interface WelcomeModalProps {
  onComplete: () => void;
}

export default function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const { t } = useLocale();

  return (
    <SafeArea>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 pb-28">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700 relative max-h-[calc(100vh-8rem)] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onComplete}
            className="absolute top-4 right-4 p-2 hover:bg-slate-700 rounded-lg transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>

          {/* Content */}
          <div className="p-8 text-center pb-6">
            {/* Logo/Icon */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden bg-blue-500">
              <img
                src="/logo.png"  // ✅ public/logo.png
                alt="SynauLearn Logo"
                className="w-12 h-12 object-cover"
              />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-3">
              {t('welcome.title')}
            </h2>

            <p className="text-gray-300 mb-8 text-sm leading-relaxed">
              {t('welcome.subtitle')}
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{t('welcome.interactiveLessons')}</h3>
                  <p className="text-gray-400 text-xs">
                    {t('welcome.interactiveLessonsDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{t('welcome.testKnowledge')}</h3>
                  <p className="text-gray-400 text-xs">
                    {t('welcome.testKnowledgeDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{t('welcome.earnBadges')}</h3>
                  <p className="text-gray-400 text-xs">
                    {t('welcome.earnBadgesDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {t('welcome.startLearning')}
            </button>
          </div>
        </div>
      </div>
    </SafeArea>
  );
}