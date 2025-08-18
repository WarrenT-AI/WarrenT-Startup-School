export enum ContentType {
  Theory = 'Theory',
  CaseStudy = 'Case Study',
  PracticalExercise = 'Practical Exercise',
}

export type Language = 'en' | 'zh';

export interface ContentSection {
  subtitle: string;
  text: string;
}

export interface StructuredContent {
  title: string;
  sections: ContentSection[];
}

export interface StageContent {
  theory: StructuredContent;
  caseStudy: StructuredContent;
  practicalExercise: StructuredContent;
  assignment: string;
}

export interface Stage {
  id: number;
  title: string;
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
  content?: StageContent;
  submission?: string;
  score?: number;
  feedback?: string;
}