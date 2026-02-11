'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'id';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

type Messages = Record<string, unknown>;

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [messages, setMessages] = useState<Messages>({});

  // Initialize locale from localStorage or browser
  useEffect(() => {
    const savedLocale = typeof window !== 'undefined' ? localStorage.getItem('locale') as Locale : null;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'id')) {
      setLocaleState(savedLocale);
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.toLowerCase();
      const detectedLocale = browserLang.startsWith('id') ? 'id' : 'en';
      setLocaleState(detectedLocale);
    }
  }, []);

  // Load messages when locale changes
  useEffect(() => {
    async function loadMessages() {
      try {
        const msgs = await import(`../messages/${locale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
      }
    }
    loadMessages();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  // Translation function with nested key support
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = messages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
