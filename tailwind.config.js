/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      primary: '#DE442F',
      background: '#202030',
      light: '#2F2F46',
      dark: '#12121C',
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#641ae6',
          secondary: '#d926a9',
          accent: '#1fb2a6',
          neutral: '#2a323c',
          'base-100': '#1d232a',
          info: '#3abff8',
          success: '#36d399',
          warning: '#fbbd23',
          error: '#f87272',
          transparent: 'transparent',
          white: '#ffffff',
          primary: '#DE442F',
          background: '#202030',
          light: '#2F2F46',
          dark: '#12121C',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
