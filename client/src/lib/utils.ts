import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const customTwMerge = extendTailwindMerge({
  extend: {
      theme: {
        colors: [
          'white', 
          'black', 
          { primary: ['DEFAULT', 'foreground', '110', '100', '75', '50', '25', '5']},
          { secondary: ['DEFAULT', 'foreground', '110', '100', '75', '50', '25', '5']},
          { accent: ['DEFAULT', 'foreground', '110', '105', '100', '75', '50', '25', '5']},
          'sky', 
          'cream',
          { bg: ['green', 'yellow', 'red', 'purple'] },
          'border', 
          'input', 
          'ring', 
          'background', 
          'foreground',
          { descructive: ['DEFAULT', 'foreground'] },
          { muted: ['DEFAULT', 'foreground'] },
          { popover: ['DEFAULT', 'foreground'] },
          { card: ['DEFAULT', 'foreground'] },
        ],
      },
      classGroups: {
        'font-size': ['text-h1', 'text-h2', 'text-h3', 'text-h4', 'text-h5', 'text-h6', 'text-p', 'text-sm', 'text-xs', 'text-mobile-h1', 'text-mobile-h2', 'text-mobile-h3', 'text-mobile-h4', 'text-mobile-h5', 'text-mobile-h6', 'text-mobile-p', 'text-mobile-sm', 'text-mobile-xs'] 
      }
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
