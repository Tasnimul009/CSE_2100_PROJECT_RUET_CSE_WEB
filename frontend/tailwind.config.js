export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0f3d91',
        secondary: '#153f74',
        accent: '#f59e0b',
        soft: '#f5f7fb'
      },
      boxShadow: {
        card: '0 10px 30px rgba(15,61,145,0.08)'
      }
    },
  },
  plugins: [],
};
