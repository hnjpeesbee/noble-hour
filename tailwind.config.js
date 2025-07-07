// tailwind.config.js
module.exports = {
  content: [
    './**/*.{html,js,php,blade.php,liquid,jsx,ts,tsx,vue}', // include all file types where classes are used
  ],
  theme: {
    extend: {
      spacing: {
        '94': '22rem',
      }
    },
  },
  plugins: [],
};
