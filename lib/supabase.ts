// Load .env file in Node.js environments (for scripts)
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('dotenv').config();
  } catch {
    // dotenv not available or already loaded, that's ok
  }
}

import { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createBrowserClient } from './supabase/client';

// For backward compatibility with existing code
// Components should gradually migrate to use lib/supabase/client.ts directly
let supabaseInstance: SupabaseClient | null = null;

// Only create client on the browser side
const getClientSideSupabase = (): SupabaseClient | null => {
  if (typeof window === 'undefined') {
    // Return null on server - caller should handle this
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient();
  }
  return supabaseInstance;
};

// Export for backward compatibility
// Note: This will be null on server-side, components using this should be client-only
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClientSideSupabase();
    if (!client) {
      // On server, throw a helpful error
      throw new Error(
        `Cannot use 'supabase' on the server. Use 'createClient' from 'lib/supabase/server.ts' for server-side operations.`
      );
    }
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

// Re-export createClient for convenience
export { createClient as createBrowserClient } from './supabase/client';

// Types
export type DifficultyLevel = 'Basic' | 'Advanced' | 'Professional';

export interface Category {
  id: string;
  name: string; // English name
  name_id: string; // Indonesian name
  description: string | null; // English description
  description_id: string | null; // Indonesian description
  emoji: string | null;
  slug: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  emoji: string;
  language: 'en' | 'id'; // Language code: en = English, id = Indonesian
  difficulty: DifficultyLevel; // Course difficulty level
  category_id: string | null; // Reference to category
  total_lessons: number;
  created_at: string;
  // Optional joined data
  category?: Category;
}

export interface Lesson {
  id: string;
  course_id: string;
  lesson_number: number;
  title: string;
  total_cards: number;
  created_at: string;
}

export interface Card {
  id: string;
  lesson_id: string;
  card_number: number;
  flashcard_question: string;
  flashcard_answer: string;
  quiz_question: string;
  quiz_option_a: string;
  quiz_option_b: string;
  quiz_option_c: string;
  quiz_option_d: string;
  quiz_correct_answer: 'A' | 'B' | 'C' | 'D';
  created_at: string;
}

export interface UserCardProgress {
  id: string;
  user_id: string;
  card_id: string;
  flashcard_viewed: boolean;
  quiz_completed: boolean;
  quiz_correct: boolean;
  xp_earned: number;
  completed_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  cards_completed: number;
  total_xp_earned: number;
  completed_at: string | null;
}