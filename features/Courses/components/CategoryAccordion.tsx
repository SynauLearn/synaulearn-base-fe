'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import CourseCard from './CourseCard';

// Define types inline to avoid dependency on lib/api
export interface Category {
  id: string;
  name: string;
  name_id: string;
  emoji: string;
  slug: string;
  order_index: number;
  description?: string;
  description_id?: string;
}

export interface CourseWithProgress {
  id: string;
  title: string;
  description: string;
  emoji: string;
  language: string;
  difficulty: string;
  category_id?: string | null;
  total_lessons: number;
  progressPercentage?: number;
}

interface CategoryAccordionProps {
  categories: Category[];
  courses: CourseWithProgress[];
  onCourseClick: (courseId: string) => void;
}

const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  categories,
  courses,
  onCourseClick,
}) => {
  const { locale } = useLocale();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const categoryCourses = courses.filter(
          (c) => c.category_id === category.id
        );

        if (categoryCourses.length === 0) return null;

        const isExpanded = expandedCategory === category.id;
        const categoryName = locale === 'id' ? category.name_id : category.name;

        return (
          <div
            key={category.id}
            className="bg-slate-800 rounded-xl overflow-hidden"
          >
            {/* Category Header */}
            <button
              onClick={() =>
                setExpandedCategory(isExpanded ? null : category.id)
              }
              className="w-full flex items-center justify-between p-4 hover:bg-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.emoji}</span>
                <div className="text-left">
                  <h3 className="text-white font-semibold">{categoryName}</h3>
                  <p className="text-sm text-gray-400">
                    {categoryCourses.length}{' '}
                    {locale === 'id' ? 'kursus' : 'courses'}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''
                  }`}
              />
            </button>

            {/* Course List (Expanded) */}
            {isExpanded && (
              <div className="p-4 space-y-3 bg-slate-850">
                {categoryCourses.map((course, index) => (
                  <CourseCard
                    key={course.id}
                    id={index + 1}
                    title={course.title}
                    description={course.description}
                    progress={course.progressPercentage || 0}
                    image={course.emoji}
                    onClick={() => onCourseClick(course.id)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryAccordion;
