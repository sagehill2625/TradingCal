export const themes = {
  default: {
    name: 'Default Dark',
    primary: '#3B82F6',
    background: '#030712',
    surface: '#111827',
    hover: '#1F2937'
  },
  light: {
    name: 'Light',
    primary: '#3B82F6',
    background: '#ffffff',
    surface: '#f3f4f6',
    hover: '#e5e7eb'
  },
  midnight: {
    name: 'Midnight Blue',
    primary: '#818CF8',
    background: '#020617',
    surface: '#0F172A',
    hover: '#1E293B'
  },
  emerald: {
    name: 'Emerald',
    primary: '#34D399',
    background: '#022C22',
    surface: '#064E3B',
    hover: '#065F46'
  },
  rose: {
    name: 'Rose',
    primary: '#FB7185',
    background: '#2D0A12',
    surface: '#4C1D25',
    hover: '#881337'
  },
  amber: {
    name: 'Amber',
    primary: '#FCD34D',
    background: '#2D1C05',
    surface: '#4C3010',
    hover: '#854D0E'
  },
  purple: {
    name: 'Royal Purple',
    primary: '#A855F7',
    background: '#1E1B4B',
    surface: '#312E81',
    hover: '#4338CA'
  },
  teal: {
    name: 'Ocean Teal',
    primary: '#2DD4BF',
    background: '#042F2E',
    surface: '#134E4A',
    hover: '#115E59'
  },
  orange: {
    name: 'Sunset Orange',
    primary: '#F97316',
    background: '#431407',
    surface: '#7C2D12',
    hover: '#9A3412'
  },
  crimson: {
    name: 'Deep Crimson',
    primary: '#DC2626',
    background: '#450A0A',
    surface: '#991B1B',
    hover: '#B91C1C'
  },
  mint: {
    name: 'Cool Mint',
    primary: '#10B981',
    background: '#022C22',
    surface: '#064E3B',
    hover: '#047857'
  },
  indigo: {
    name: 'Deep Indigo',
    primary: '#6366F1',
    background: '#1E1B4B',
    surface: '#3730A3',
    hover: '#4338CA'
  }
} as const;

export type ThemeId = keyof typeof themes;