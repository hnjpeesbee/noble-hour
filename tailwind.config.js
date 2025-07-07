// tailwind.config.js
module.exports = {
  content: [
    './**/*.{html,js,php,blade.php}', // adjust based on your project files
  ],
  theme: {
    extend: {
      spacing: {
        '94': '22rem',
      },
    },
  },
  plugins: [],
};
