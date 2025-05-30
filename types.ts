

export interface Tag {
  name: string;
  color: string; // Tailwind background color class
  textColor: string; // Tailwind text color class
  darkColor: string; // Tailwind dark mode background color class
  darkTextColor: string; // Tailwind dark mode text color class
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  imageUrl?: string; // Optional for text-only posts
  excerpt: string;
  tags: string[]; // Array of tag names
  featuredImage?: string; // Specific image for featured/large display
}

export enum PostCardVariant {
  DEFAULT = 'default',
  TEXT_ONLY = 'textOnly',
  IMAGE_ONLY = 'imageOnly',
  RECENT_FEATURED = 'recentFeatured', // For Card A in recent posts
}