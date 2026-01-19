// Local Course interface (previously from supabase)
export interface Course {
  title: string;
  total_lessons: number;
  emoji: string;
}

export interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Convert IPFS URL to HTTP gateway URL for better compatibility
 */
function ipfsToGateway(ipfsUrl: string): string {
  // If already a gateway URL, return as-is
  if (ipfsUrl.startsWith('http://') || ipfsUrl.startsWith('https://')) {
    return ipfsUrl;
  }

  // Convert ipfs:// to gateway URL
  const gateway = process.env.PINATA_GATEWAY || process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'gateway.pinata.cloud';
  const cid = ipfsUrl.replace('ipfs://', '');
  return `https://${gateway}/ipfs/${cid}`;
}

/**
 * Generate NFT metadata for a course badge
 */
export function generateBadgeMetadata(
  courseId: number,
  course: Course,
  imageIPFSUrl: string
): BadgeMetadata {
  return {
    name: `${course.title} Badge`,
    description: `Completion badge for ${course.title} course on SynauLearn. This NFT certifies that the holder has successfully completed all lessons and assessments in this course.`,
    image: ipfsToGateway(imageIPFSUrl),
    attributes: [
      {
        trait_type: "Course",
        value: course.title,
      },
      {
        trait_type: "Course ID",
        value: courseId,
      },
      {
        trait_type: "Platform",
        value: "SynauLearn",
      },
      {
        trait_type: "Total Lessons",
        value: course.total_lessons,
      },
      {
        trait_type: "Emoji",
        value: course.emoji,
      },
      {
        trait_type: "Type",
        value: "Course Completion Badge",
      },
    ],
  };
}

/**
 * Generate metadata for all courses
 */
export function generateAllMetadata(
  courses: Array<{ courseId: number; course: Course; imageIPFSUrl: string }>
): Record<number, BadgeMetadata> {
  const metadata: Record<number, BadgeMetadata> = {};

  for (const { courseId, course, imageIPFSUrl } of courses) {
    metadata[courseId] = generateBadgeMetadata(courseId, course, imageIPFSUrl);
  }

  return metadata;
}

/**
 * Validate metadata structure
 */
export function validateMetadata(metadata: BadgeMetadata): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!metadata.name || metadata.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!metadata.description || metadata.description.trim() === "") {
    errors.push("Description is required");
  }

  if (!metadata.image || (!metadata.image.startsWith("ipfs://") && !metadata.image.startsWith("http"))) {
    errors.push("Image must be a valid IPFS or HTTP URL");
  }

  if (!Array.isArray(metadata.attributes) || metadata.attributes.length === 0) {
    errors.push("Attributes array is required and must not be empty");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Convert metadata to JSON string with proper formatting
 */
export function metadataToJSON(metadata: BadgeMetadata): string {
  return JSON.stringify(metadata, null, 2);
}
