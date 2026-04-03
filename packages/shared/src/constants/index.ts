/** Default departments auto-created for every new project */
export const DEFAULT_DEPARTMENTS = [
  { name: 'Cinematografia', icon: '🎥', color: '#4A6CF7', order: 0 },
  { name: 'Arte', icon: '🎨', color: '#F2C94C', order: 1 },
  { name: 'Som', icon: '🎧', color: '#6FCF97', order: 2 },
  { name: 'Figurino', icon: '👗', color: '#BDB2FF', order: 3 },
  { name: 'Design de Produção', icon: '🏗️', color: '#F2994A', order: 4 },
] as const;

/** Color palette as defined in Spec §15.2 */
export const COLORS = {
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F7F7F9',
  primary: '#4A6CF7',
  inProgress: '#F2C94C',
  completed: '#6FCF97',
  comments: '#BDB2FF',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
} as const;
