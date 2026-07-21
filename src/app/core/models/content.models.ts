export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter?: string;
  instagram?: string;
  /** Prefer mailto:… for in-app mail links. */
  email: string;
  blogger?: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Project {
  slug: string;
  title: string;
  excerpt: string;
  domain: string;
  year: string;
  role: string;
  cover: string;
  tags: string[];
  overview: string;
  challenges: string[];
  approach: string[];
  outcomes: string[];
  tech: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location?: string;
  /** Official company website when available. */
  companyUrl?: string;
  summary: string;
  highlights: string[];
  tech: string[];
  logo?: string;
}

export interface ExpertiseHighlight {
  title: string;
  description: string;
  icon: 'code' | 'layers' | 'cloud' | 'briefcase' | 'spark' | 'user';
}

export interface WorkingApproachStep {
  title: string;
  description: string;
  icon: 'spark' | 'code' | 'layers' | 'compass' | 'briefcase';
}

export interface SiteContent {
  name: string;
  brand: string;
  tagline: string;
  role: string;
  location: string;
  email: string;
  availability: string;
  about: string;
  bio: string;
  journey: string;
  heroCardTitle: string;
  social: SocialLinks;
  expertiseHighlights: ExpertiseHighlight[];
  workingApproach: WorkingApproachStep[];
  skills: SkillGroup[];
  experience: Experience[];
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readingTime: string;
  /** Local asset path; empty string when no cover. */
  cover: string;
  /** When true, hidden from lists/previews but still reachable by slug URL. */
  draft?: boolean;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

export type PlaceType = 'trek' | 'travel';

export interface Place {
  slug: string;
  name: string;
  region: string;
  country: string;
  visitedOn: string;
  type: PlaceType;
  summary: string;
  notes: string;
  photo: string;
  photoCredit: string;
}
