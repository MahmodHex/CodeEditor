export interface Project {
  id: string;
  title: string;
  html: string;
  css: string;
  js: string;
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
  isFavorite: boolean;
}

export type StarterCategory = 'blank' | 'component' | 'game' | 'mobile';

export interface StarterTemplate {
  id: string;
  title: string;
  category: StarterCategory;
  description: string;
  html: string;
  css: string;
  js: string;
  badge?: string;
}
