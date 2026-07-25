import type { Course } from "./types";

/**
 * Three future course placeholders. All are "coming-soon" — no course
 * content, video, or LMS functionality is built in Phase 1 (see Phase 5 in
 * the project roadmap).
 */
export const courses: Course[] = [
  {
    id: "course-1",
    slug: "leading-under-pressure",
    title: "Leading Under Pressure",
    description:
      "A practical programme for managers and leaders who need to make sound decisions when time, scrutiny and stakes are all high.",
    category: "leadership",
    format: "paid",
    status: "coming-soon",
  },
  {
    id: "course-2",
    slug: "quality-and-culture-in-care",
    title: "Quality and Culture in Care",
    description:
      "A course for care-sector managers building a culture of quality and accountability from the frontline up.",
    category: "care-quality",
    format: "paid",
    status: "coming-soon",
  },
  {
    id: "course-3",
    slug: "first-steps-into-african-markets",
    title: "First Steps Into African Markets",
    description:
      "An introductory programme for aspiring entrepreneurs and investors exploring opportunities across Africa.",
    category: "entrepreneurship",
    format: "free",
    status: "coming-soon",
  },
];
