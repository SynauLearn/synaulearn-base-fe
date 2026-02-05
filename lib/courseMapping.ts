/**
 * Course ID Mapping
 * Maps UUID course IDs from the database to numeric IDs for the smart contract
 *
 * TODO: Update this mapping with your actual course UUIDs
 * You can get these by running: SELECT id, title FROM courses ORDER BY created_at;
 */

export const courseIdToNumber: Record<string, number> = {
  // Example mapping - Replace with your actual course UUIDs
  // Format: 'uuid': numeric_id
  '9bea6cc1-8a0f-4aad-9d10-2984bf70368f': 1,
  'be09f25c-3d2f-4485-a4e5-175c26c95c93': 2,
  'edcc44f4-02b6-476c-8768-51f165ca37c6': 3,
  'e7020156-f1ec-4fa2-afd3-2660da6b6719': 4,
  'e56e9279-aa5e-4657-9501-5aa1253b62d6': 5,

  //pengenalan blockhain
  '8da85464-08f3-4708-bb47-451401fe8637': 6,
  '2d637ba2-db08-4fb1-bd06-2516aecac8ff': 7,

  //introduction to web3 blockchain 
  '7f9b298d-91ad-4d68-960f-9a2d3cf15373': 8,

  //introduction to base
  '283c52db-bf78-42b3-b178-eb3a3b50280e': 9,

  // Missing IDs reported by user (Hotfix)
  // Smart Contract Fundamentals (from screenshot)
  'jd7ekvteyenc9tbm5pcxgs96bn7zk4s8': 10,
  // Other ID reported in text
  'jd7fj1sng3cgb1pgg5j738k18s7zkcak': 11

  // Add more courses here as you create them
  // 'course-uuid-2': 2,
  // 'course-uuid-3': 3,
  // etc...
};

// Reverse mapping: number to UUID
export const numberToCourseId: Record<number, string> = Object.fromEntries(
  Object.entries(courseIdToNumber).map(([uuid, num]) => [num, uuid])
);

/**
 * Get numeric course ID from UUID
 * @param uuid - Course UUID from database
 * @returns Numeric course ID for smart contract, or null if not found
 */
export function getCourseNumber(uuid: string): number | null {
  return courseIdToNumber[uuid] ?? null;
}

/**
 * Get UUID from numeric course ID
 * @param num - Numeric course ID from smart contract
 * @returns Course UUID, or null if not found
 */
export function getCourseUUID(num: number): string | null {
  return numberToCourseId[num] ?? null;
}

/**
 * Check if a course UUID has a numeric mapping
 * @param uuid - Course UUID to check
 * @returns True if mapping exists
 */
export function hasCourseMapping(uuid: string): boolean {
  return uuid in courseIdToNumber;
}

/**
 * Get all mapped course numbers
 * @returns Array of all numeric course IDs
 */
export function getAllMappedNumbers(): number[] {
  return Object.values(courseIdToNumber);
}

/**
 * Get all mapped course UUIDs
 * @returns Array of all course UUIDs
 */
export function getAllMappedUUIDs(): string[] {
  return Object.keys(courseIdToNumber);
}

/**
 * Get the next available course number
 * @returns Next numeric ID to use for a new course
 */
export function getNextCourseNumber(): number {
  const numbers = getAllMappedNumbers();
  if (numbers.length === 0) return 1;
  return Math.max(...numbers) + 1;
}

/**
 * Add a new course mapping
 * NOTE: This only updates the in-memory mapping.
 * For production, you should update this file manually or use a database.
 *
 * @param uuid - Course UUID
 * @param num - Numeric course ID (optional, will auto-increment if not provided)
 * @returns The numeric ID assigned
 */
export function addCourseMapping(uuid: string, num?: number): number {
  const courseNum = num ?? getNextCourseNumber();

  if (hasCourseMapping(uuid)) {
    throw new Error(`Course UUID ${uuid} already has a mapping`);
  }

  if (numberToCourseId[courseNum]) {
    throw new Error(`Course number ${courseNum} is already in use`);
  }

  courseIdToNumber[uuid] = courseNum;
  numberToCourseId[courseNum] = uuid;

  return courseNum;
}

/**
 * Get mapping statistics
 */
export function getMappingStats() {
  return {
    totalMapped: Object.keys(courseIdToNumber).length,
    maxNumber: getAllMappedNumbers().length > 0 ? Math.max(...getAllMappedNumbers()) : 0,
    nextAvailable: getNextCourseNumber(),
  };
}
