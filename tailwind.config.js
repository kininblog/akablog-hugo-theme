const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './themes/akablog/layouts/**/*.html',
    './content/**/*.md',
    './layouts/**/*.html',
  ],
  darkMode: 'class', // or 'media' if you prefer OS-level settings
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // You can define custom colors here if needed, matching your design
        // Example:
        // 'brand-purple': '#9333ea',
        // 'brand-lavender': '#e9d5ff', // purple-200
        // 'brand-pink': '#fce7f3', // pink-100
        neutral: { // Re-defining neutral to match the design's dark/light mode text & bg
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626', // Used for dark card backgrounds
          900: '#171717', // Used for dark body background
        }
      },
      fontSize: {
        '[96px]': '96px', // For the hero title
      },
      // lineClamp is now part of Tailwind core, no need to extend here
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.neutral[700]'),
            '--tw-prose-headings': theme('colors.neutral[900]'),
            '--tw-prose-lead': theme('colors.neutral[600]'),
            '--tw-prose-links': theme('colors.indigo[600]'),
            '--tw-prose-bold': theme('colors.neutral[900]'),
            '--tw-prose-counters': theme('colors.neutral[500]'),
            '--tw-prose-bullets': theme('colors.neutral[300]'),
            '--tw-prose-hr': theme('colors.neutral[200]'),
            '--tw-prose-quotes': theme('colors.neutral[600]'),
            '--tw-prose-quote-borders': theme('colors.neutral[300]'),
            '--tw-prose-captions': theme('colors.neutral[500]'),
            '--tw-prose-code': theme('colors.pink[600]'),
            '--tw-prose-pre-code': theme('colors.neutral[200]'),
            '--tw-prose-pre-bg': theme('colors.neutral[800]'), // Matched pre bg
            '--tw-prose-th-borders': theme('colors.neutral[300]'),
            '--tw-prose-td-borders': theme('colors.neutral[200]'),

            '--tw-prose-invert-body': theme('colors.neutral[300]'),
            '--tw-prose-invert-headings': theme('colors.white'),
            '--tw-prose-invert-lead': theme('colors.neutral[400]'),
            '--tw-prose-invert-links': theme('colors.indigo[400]'),
            '--tw-prose-invert-bold': theme('colors.white'),
            '--tw-prose-invert-counters': theme('colors.neutral[400]'),
            '--tw-prose-invert-bullets': theme('colors.neutral[600]'),
            '--tw-prose-invert-hr': theme('colors.neutral[700]'),
            '--tw-prose-invert-quotes': theme('colors.neutral[400]'),
            '--tw-prose-invert-quote-borders': theme('colors.neutral[700]'),
            '--tw-prose-invert-captions': theme('colors.neutral[400]'),
            '--tw-prose-invert-code': theme('colors.pink[400]'),
            '--tw-prose-invert-pre-code': theme('colors.neutral[300]'),
            '--tw-prose-invert-pre-bg': theme('colors.neutral[800]'),
            '--tw-prose-invert-th-borders': theme('colors.neutral[700]'),
            '--tw-prose-invert-td-borders': theme('colors.neutral[800]'),
            img: {
              borderRadius: defaultTheme.borderRadius.lg,
            },
             h1: { fontWeight: '800' }, // Ensure h1 in prose is extra bold
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'), // Added for aspect ratio control
  ],
};
