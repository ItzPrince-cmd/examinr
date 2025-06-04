import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomId = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

export const formatQuestionId = (id: number) => {
  return `#${id}`;
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const classOptions = [
  { label: 'JEE MAIN + NEET + JEE', value: 'jee' },
  { label: 'NEET', value: 'neet' },
  { label: 'JEE Advanced', value: 'jee-adv' },
  { label: 'Class 12', value: 'class-12' },
];

export const subjectOptions = [
  { label: 'PHYSICS', value: 'physics' },
  { label: 'CHEMISTRY', value: 'chemistry' },
  { label: 'MATHEMATICS', value: 'mathematics' },
  { label: 'BIOLOGY', value: 'biology' },
];

export const levelOptions = [
  { label: 'MEDIUM', value: 'medium' },
  { label: 'EASY', value: 'easy' },
  { label: 'HARD', value: 'hard' },
  { label: 'ADVANCED', value: 'advanced' },
];

export const typeOptions = [
  { label: 'SINGLE CORRECT MCQ', value: 'mcq' },
  { label: 'MULTIPLE CORRECT MCQ', value: 'mcq-multiple' },
  { label: 'NUMERICAL VALUE', value: 'numerical' },
  { label: 'MATRIX MATCH', value: 'matrix' },
];

export const chapterOptions = [
  { label: '04. Motion in a Plane', value: 'motion' },
  { label: '01. Kinematics', value: 'kinematics' },
  { label: '02. Dynamics', value: 'dynamics' },
  { label: '03. Work and Energy', value: 'work-energy' },
];

export const topicOptions = [
  { label: 'All', value: 'all' },
  { label: 'Vectors', value: 'vectors' },
  { label: 'Projectile Motion', value: 'projectile' },
  { label: 'Circular Motion', value: 'circular' },
];