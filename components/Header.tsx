'use client';

import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-slate-900 dark:bg-slate-900 border-b border-slate-800 dark:border-slate-700">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Menu Button + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-white dark:text-gray-100" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                alt="SynauLearn Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-white dark:text-gray-100">SynauLearn</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}